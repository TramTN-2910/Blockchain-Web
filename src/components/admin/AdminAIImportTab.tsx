'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
  Trash2,
  ArrowRight,
  HelpCircle,
  Cpu,
  Edit2,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useAdminStore } from '@/store/useAdminStore';
import { Question, DifficultyLevel, QuestionOption } from '@/types/quiz';
import QuestionModal from './QuestionModal';

const SAMPLE_SHA256_TEXT = `Câu 1: Hàm băm SHA-256 tạo ra chuỗi đầu ra có độ dài bao nhiêu ký tự Hexadecimal?
A. 32 ký tự
B. 64 ký tự
C. 128 ký tự
D. 256 ký tự
Đáp án: B
Giải thích: 256 bits = 32 bytes, khi biểu diễn dưới dạng hệ cơ số 16 (hexadecimal) mỗi byte tương ứng 2 ký tự nên độ dài luôn là 64 ký tự hex.

Câu 2: Tính chất nào đảm bảo không thể tìm ra dữ liệu đầu vào ban đầu từ giá trị băm?
A. Hiệu ứng tuyết lở (Avalanche Effect)
B. Tính kháng tiền ảnh (Pre-image Resistance)
C. Tính kháng va chạm mạnh (Collision Resistance)
D. Tính độ dài cố định
Đáp án: B
Giải thích: Tính kháng tiền ảnh (One-way / Pre-image resistance) là thuộc tính đảm bảo tính một chiều, không thể suy ngược ra đầu vào x từ giá trị băm H(x).`;

const SAMPLE_MINING_TEXT = `Câu 1: Giá trị Nonce trong khối Blockchain có vai trò gì?
A. Lưu trữ chữ ký số của người gửi
B. Là số nguyên được thợ đào thay đổi liên tục để giá trị băm khối thỏa mãn độ khó
C. Xác định thời gian khối được tạo
D. Là khóa công khai của ví nhận thưởng
Đáp án: B
Giải thích: Nonce (Number used once) là trường số duy nhất mà thợ đào được phép thay đổi tự do để thử hàng tỷ giá trị băm khác nhau cho đến khi tìm được hash nhỏ hơn Target.

Câu 2: Cơ chế điều chỉnh độ khó (Difficulty Adjustment) trong Bitcoin nhằm mục đích gì?
A. Đảm bảo tổng cung tiền không vượt quá 21 triệu coin
B. Duy trì thời gian sinh khối trung bình ổn định khoảng 10 phút
C. Tăng phí giao dịch cho thợ đào
D. Giảm dung lượng của mỗi khối
Đáp án: B
Giải thích: Thuật toán điều chỉnh độ khó sau mỗi 2016 khối nhằm giữ thời gian trung bình tạo ra một khối mới luôn xấp xỉ 10 phút bất kể tổng hashrate mạng tăng hay giảm.`;

export default function AdminAIImportTab({ onSaveSuccess }: { onSaveSuccess?: () => void }) {
  const { bulkAddQuestions } = useAdminStore();

  const [rawText, setRawText] = useState('');
  const [topicSlug, setTopicSlug] = useState('hash');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<Omit<Question, 'id'>[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Client-side fallback parser regex heuristic
  const parseQuestionsClient = (text: string): Omit<Question, 'id'>[] => {
    const questions: Omit<Question, 'id'>[] = [];
    const blocks = text.split(/(?:Câu\s*\d+[:.]|\n\s*\d+[\.\)])/gi).filter((b) => b.trim().length > 10);

    for (const block of blocks) {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length < 3) continue;

      let questionText = lines[0];
      const options: QuestionOption[] = [];
      let correctAnswerKey = 'A';
      let explanation = '';

      // Check lines for options, answer, explanation
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        
        // Option detection
        const optMatch = line.match(/^([A-D])[\.\:\)]\s*(.+)$/i);
        if (optMatch) {
          const key = optMatch[1].toUpperCase();
          const optText = optMatch[2].trim();
          options.push({
            id: `opt-${key.toLowerCase()}`,
            text_vn: optText,
            text_en: '',
            is_correct: false,
          });
          continue;
        }

        // Answer detection
        const ansMatch = line.match(/^(?:Đáp án|Answer|Key)[:\s]*([A-D])/i);
        if (ansMatch) {
          correctAnswerKey = ansMatch[1].toUpperCase();
          continue;
        }

        // Explanation detection
        const expMatch = line.match(/^(?:Giải thích|Explanation)[:\s]*(.+)$/i);
        if (expMatch) {
          explanation = expMatch[1].trim();
          continue;
        }
      }

      // Mark correct option
      const finalOptions = options.map((opt) => ({
        ...opt,
        is_correct: opt.id === `opt-${correctAnswerKey.toLowerCase()}`,
      }));

      // Ensure at least one is correct
      if (finalOptions.length >= 2) {
        if (!finalOptions.some((o) => o.is_correct)) {
          finalOptions[0].is_correct = true;
        }

        questions.push({
          topic_slug: topicSlug,
          topic_name_vn: topicSlug === 'hash' ? 'Hàm băm & SHA-256' : topicSlug === 'mining' ? 'Khai thác & PoW' : 'Mật mã học & Blockchain',
          type: 'single',
          question_vn: questionText,
          options: finalOptions,
          explanation_vn: explanation || 'Giải thích chi tiết theo lý thuyết chuẩn mật mã học.',
          difficulty,
        });
      }
    }

    return questions;
  };

  const handleParseAI = async () => {
    if (!rawText.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập hoặc dán nội dung văn bản đề thi thô.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      // Try calling API endpoint
      const res = await fetch('/api/admin/ai-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          topicSlug,
          difficulty,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          setParsedQuestions(data.questions);
          setStatusMessage({
            type: 'success',
            text: `Đã bóc tách thành công ${data.questions.length} câu hỏi${data.provider ? ` qua ${data.provider}` : ''}!`,
          });
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('API route fallback to smart client regex parser...');
    }

    // Fallback parser
    setTimeout(() => {
      const fallbackResult = parseQuestionsClient(rawText);
      if (fallbackResult.length > 0) {
        setParsedQuestions(fallbackResult);
        setStatusMessage({
          type: 'success',
          text: `Đã trích xuất thành công ${fallbackResult.length} câu hỏi từ văn bản!`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Không thể nhận diện định dạng câu hỏi. Vui lòng đảm bảo các câu hỏi có dạng "Câu 1: ... A. ... B. ... Đáp án: ..."',
        });
      }
      setIsLoading(false);
    }, 600);
  };

  const [editingParsedIndex, setEditingParsedIndex] = useState<number | null>(null);

  const handleSaveAll = () => {
    if (parsedQuestions.length === 0) return;

    const count = bulkAddQuestions(parsedQuestions);
    setStatusMessage({
      type: 'success',
      text: `Đã lưu thành công ${count} câu hỏi vào Ngân hàng câu hỏi của hệ thống!`,
    });
    setParsedQuestions([]);
    setRawText('');
    if (onSaveSuccess) onSaveSuccess();
  };

  const handleDeleteItem = (index: number) => {
    setParsedQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveEditedQuestion = (updated: any) => {
    if (editingParsedIndex !== null) {
      setParsedQuestions((prev) => {
        const next = [...prev];
        next[editingParsedIndex] = updated;
        return next;
      });
      setEditingParsedIndex(null);
      setStatusMessage({
        type: 'success',
        text: `Đã cập nhật nội dung câu hỏi số ${editingParsedIndex + 1}!`,
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <SpotlightCard className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900/95 text-white border border-purple-700/40 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4" spotlightColor="rgba(255, 255, 255, 0.16)">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>AI Automated Quiz Import</span>
          </div>
          <h2 className="text-xl font-bold">Trích Xuất Đề Thi Tự Động Bằng AI</h2>
          <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
            Dán bất kỳ đoạn tài liệu, file đề thi Word/PDF hoặc câu hỏi thô dạng văn bản. Hệ thống AI sẽ tự động phân tích cú pháp, trích xuất câu hỏi, 4 phương án, đáp án đúng và giải thích.
          </p>
        </div>

        {/* Sample Buttons */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setRawText(SAMPLE_SHA256_TEXT)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
          >
            Mẫu SHA-256
          </button>
          <button
            type="button"
            onClick={() => setRawText(SAMPLE_MINING_TEXT)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
          >
            Mẫu Mining & PoW
          </button>
        </div>
      </SpotlightCard>

      {/* Input Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Textarea & Configuration (6 cols) */}
        <SpotlightCard className="lg:col-span-6 p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-4" spotlightColor="rgba(168, 85, 247, 0.14)">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Văn bản đề thi thô
            </label>
            <span className="text-[11px] text-slate-400">
              {rawText.length} ký tự
            </span>
          </div>

          <textarea
            rows={12}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`Dán nội dung đề thi vào đây...\nVí dụ:\nCâu 1: ...\nA. Phương án 1\nB. Phương án 2\nC. Phương án 3\nD. Phương án 4\nĐáp án: A\nGiải thích: ...`}
            className="w-full p-4 rounded-xl text-xs sm:text-sm font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
          />

          {/* Configuration selects */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Gán cho Chủ đề
              </label>
              <select
                value={topicSlug}
                onChange={(e) => setTopicSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="hash">Hàm băm & SHA-256</option>
                <option value="mining">Khai thác & PoW</option>
                <option value="rsa">Mã hoá RSA</option>
                <option value="merkle">Cây Merkle</option>
                <option value="blockchain">Cơ bản Blockchain</option>
                <option value="cryptography">Mật mã học</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Gán Độ khó mặc định
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="easy">Dễ (Easy)</option>
                <option value="medium">Trung bình (Medium)</option>
                <option value="hard">Khó (Hard)</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            disabled={isLoading || !rawText.trim()}
            onClick={handleParseAI}
            className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <Cpu className="w-4 h-4 animate-spin" />
                <span>Đang phân tích cấu trúc đề thi...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt Đầu Trích Xuất Bằng AI</span>
              </>
            )}
          </button>
        </SpotlightCard>

        {/* Right: Parsed Preview List (6 cols) */}
        <SpotlightCard className="lg:col-span-6 p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-4 flex flex-col justify-between" spotlightColor="rgba(99, 102, 241, 0.14)">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Kết Quả Nhận Diện ({parsedQuestions.length} câu)</span>
              </h3>

              {parsedQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setParsedQuestions([])}
                  className="text-xs text-rose-500 hover:underline font-semibold"
                >
                  Xóa kết quả
                </button>
              )}
            </div>

            {/* Status Alert */}
            {statusMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Parsed List Container */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {parsedQuestions.length === 0 ? (
                <div className="p-10 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-indigo-400 opacity-60" />
                  <p className="text-xs font-semibold">
                    Chưa có dữ liệu trích xuất. Hãy dán đề thi và bấm "Bắt Đầu Trích Xuất Bằng AI".
                  </p>
                </div>
              ) : (
                parsedQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2 relative group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {idx + 1}. {q.question_vn}
                      </span>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingParsedIndex(idx)}
                          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          title="Chỉnh sửa câu hỏi này trước khi lưu"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Loại bỏ câu này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-1.5 rounded truncate ${
                            opt.is_correct
                              ? 'bg-emerald-100 dark:bg-emerald-950/70 font-bold text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {['A', 'B', 'C', 'D'][oIdx]}. {opt.text_vn}
                        </div>
                      ))}
                    </div>

                    {q.explanation_vn && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 italic line-clamp-1">
                        💡 {q.explanation_vn}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Save All Button */}
          {parsedQuestions.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handleSaveAll}
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Tất Cả ({parsedQuestions.length}) Câu Hỏi Vào Ngân Hàng</span>
              </button>
            </div>
          )}

        </SpotlightCard>

      </div>

      {/* MODAL: EDIT PARSED QUESTION DIRECTLY BEFORE SAVING */}
      <QuestionModal
        isOpen={editingParsedIndex !== null}
        onClose={() => setEditingParsedIndex(null)}
        onSave={handleSaveEditedQuestion}
        initialQuestion={
          editingParsedIndex !== null
            ? ({
                ...parsedQuestions[editingParsedIndex],
                id: `temp-${editingParsedIndex}`,
              } as Question)
            : null
        }
      />

    </div>
  );
}

