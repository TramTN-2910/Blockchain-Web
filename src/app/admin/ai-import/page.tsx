'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, CheckCircle2, AlertCircle, Save, FileText, HelpCircle } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Question } from '@/types/quiz';

export default function AdminAiImportPage() {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleParseText = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setParsedData(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/ai-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi khi gọi AI');

      setParsedData(data.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Có lỗi xảy ra khi phân tích văn bản');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDatabase = () => {
    // In real app, sends to Supabase / API
    setSaveSuccess(true);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Quản trị Admin</span>
        </Link>
        <div className="px-3 py-1 rounded-full text-xs font-mono bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
          Powered by Mistral AI Engine
        </div>
      </div>

      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <span>Công cụ AI Nhập & Tự Động Phân Tách Bộ Đề</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Dán bất kỳ đoạn văn bản thô, đề thi, câu hỏi trắc nghiệm hoặc bài báo vào ô dưới đây. AI sẽ tự động trích xuất Tên bộ đề, Danh sách câu hỏi (Đơn/Nhiều lựa chọn), Các đáp án và Lời giải chi tiết.
        </p>
      </div>

      {/* Input Form Section */}
      <SpotlightCard className="glass-card p-6 space-y-4" spotlightColor="rgba(168, 85, 247, 0.16)">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            DÁN VĂN BẢN THÔ (RAW TEXT / ĐỀ THI)
          </label>
          <button
            onClick={() => setRawText(`Câu 1: Hàm băm SHA-256 có độ dài đầu ra là bao nhiêu bits?
A. 128 bits
B. 256 bits (Đáp án đúng)
C. 512 bits
Giải thích: SHA-256 tạo mã băm cố định 256 bits (64 ký tự hex).

Câu 2: Những tính chất nào sau đây thuộc về hàm băm? (Chọn nhiều đáp án)
A. Hàm một chiều
B. Kháng va chạm
C. Giải mã ngược lại được
D. Hiệu ứng tuyết lở
Giải thích: Hàm băm là hàm 1 chiều, có tính kháng va chạm và hiệu ứng tuyết lở.`)}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400"
          >
            + Chèn mẫu thử nghiệm
          </button>
        </div>

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={8}
          className="w-full p-4 rounded-xl border border-purple-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono text-sm leading-relaxed"
          placeholder="Dán nội dung câu hỏi trắc nghiệm tại đây..."
        />

        <div className="flex justify-end">
          <button
            onClick={handleParseText}
            disabled={loading || !rawText.trim()}
            className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI đang phân tích & tách câu hỏi...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Bắt đầu Phân Tách Bằng AI</span>
              </>
            )}
          </button>
        </div>
      </SpotlightCard>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Parsed Result Preview */}
      {parsedData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <span>Kết quả Phân Tách Xem Trước (Preview)</span>
            </h2>
            <button
              onClick={handleSaveToDatabase}
              disabled={saveSuccess}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 shadow-md flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saveSuccess ? 'Đã Lưu Vào CSDL Supabase!' : 'Lưu Bộ Đề Vào Supabase'}</span>
            </button>
          </div>

          <SpotlightCard className="glass-card p-6 space-y-4" spotlightColor="rgba(99, 102, 241, 0.16)">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="text-xs font-semibold text-slate-400">TÊN BỘ ĐỀ</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{parsedData.title_vn}</div>
              <div className="text-xs text-slate-500 font-mono">{parsedData.title_en}</div>
            </div>

            {/* Questions List */}
            <div className="space-y-4 pt-2">
              {parsedData.questions?.map((q: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      CÂU {idx + 1} • {q.type === 'multiple' ? 'Nhiều lựa chọn (Multiple)' : 'Đơn lựa chọn (Single)'}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-900 dark:text-slate-100">{q.question_vn}</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options?.map((opt: any) => (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-lg text-xs font-medium border flex items-center justify-between ${
                          opt.is_correct
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span>{opt.text_vn}</span>
                        {opt.is_correct && <span className="text-[10px] uppercase font-bold text-emerald-600">✔ Đáp án đúng</span>}
                      </div>
                    ))}
                  </div>

                  {q.explanation_vn && (
                    <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-300">
                      <span className="font-bold">💡 Lời giải chi tiết: </span>
                      <span>{q.explanation_vn}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      )}

    </div>
  );
}
