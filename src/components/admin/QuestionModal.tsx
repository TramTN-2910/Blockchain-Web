'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Eye, HelpCircle, Save, AlertCircle } from 'lucide-react';
import { Question, DifficultyLevel, QuestionType, QuestionOption } from '@/types/quiz';
import { QUIZ_TOPICS } from '@/data/quizQuestions';
import { useAdminStore } from '@/store/useAdminStore';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questionData: Omit<Question, 'id'> | Question) => void;
  initialQuestion?: Question | null;
}

export default function QuestionModal({
  isOpen,
  onClose,
  onSave,
  initialQuestion,
}: QuestionModalProps) {
  const storeTopics = useAdminStore((state) => state.topics);
  const currentTopics = storeTopics && storeTopics.length > 0 ? storeTopics : QUIZ_TOPICS;

  const [topicSlug, setTopicSlug] = useState('hash');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [type, setType] = useState<QuestionType>('single');
  const [questionVn, setQuestionVn] = useState('');
  const [explanationVn, setExplanationVn] = useState('');
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: 'opt-a', text_vn: '', text_en: '', is_correct: true },
    { id: 'opt-b', text_vn: '', text_en: '', is_correct: false },
    { id: 'opt-c', text_vn: '', text_en: '', is_correct: false },
    { id: 'opt-d', text_vn: '', text_en: '', is_correct: false },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (initialQuestion) {
      setTopicSlug(initialQuestion.topic_slug || 'hash');
      setDifficulty(initialQuestion.difficulty || 'medium');
      setType(initialQuestion.type || 'single');
      setQuestionVn(initialQuestion.question_vn || '');
      setExplanationVn(initialQuestion.explanation_vn || '');
      setOptions(
        initialQuestion.options && initialQuestion.options.length >= 2
          ? initialQuestion.options
          : [
              { id: 'opt-a', text_vn: '', text_en: '', is_correct: true },
              { id: 'opt-b', text_vn: '', text_en: '', is_correct: false },
              { id: 'opt-c', text_vn: '', text_en: '', is_correct: false },
              { id: 'opt-d', text_vn: '', text_en: '', is_correct: false },
            ]
      );
    } else {
      // Reset form
      setTopicSlug('hash');
      setDifficulty('medium');
      setType('single');
      setQuestionVn('');
      setExplanationVn('');
      setOptions([
        { id: 'opt-a', text_vn: '', text_en: '', is_correct: true },
        { id: 'opt-b', text_vn: '', text_en: '', is_correct: false },
        { id: 'opt-c', text_vn: '', text_en: '', is_correct: false },
        { id: 'opt-d', text_vn: '', text_en: '', is_correct: false },
      ]);
    }
    setError(null);
  }, [initialQuestion, isOpen]);

  if (!isOpen) return null;

  const handleOptionTextChange = (index: number, text: string) => {
    const next = [...options];
    next[index] = { ...next[index], text_vn: text };
    setOptions(next);
  };

  const handleSetCorrect = (index: number) => {
    if (type === 'single') {
      const next = options.map((opt, i) => ({
        ...opt,
        is_correct: i === index,
      }));
      setOptions(next);
    } else {
      const next = [...options];
      next[index] = { ...next[index], is_correct: !next[index].is_correct };
      setOptions(next);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionVn.trim()) {
      setError('Vui lòng nhập nội dung câu hỏi.');
      return;
    }

    const emptyOptions = options.some((opt) => !opt.text_vn.trim());
    if (emptyOptions) {
      setError('Vui lòng điền đầy đủ nội dung cho tất cả các phương án trả lời.');
      return;
    }

    const hasCorrect = options.some((opt) => opt.is_correct);
    if (!hasCorrect) {
      setError('Vui lòng đánh dấu ít nhất một phương án đúng.');
      return;
    }

    const selectedTopic = currentTopics.find((t) => t.slug === topicSlug);
    const topicNameVn = selectedTopic ? selectedTopic.name_vn : 'Kiến thức Blockchain';

    const questionData = {
      ...(initialQuestion?.id ? { id: initialQuestion.id } : {}),
      topic_slug: topicSlug,
      topic_name_vn: topicNameVn,
      difficulty,
      type,
      question_vn: questionVn.trim(),
      options: options.map((opt) => ({ ...opt, text_vn: opt.text_vn.trim() })),
      explanation_vn: explanationVn.trim() || 'Không có giải thích chi tiết.',
    };

    onSave(questionData as any);
    onClose();
  };

  const selectedTopicObj = currentTopics.find((t) => t.slug === topicSlug);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[82vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col my-auto overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{initialQuestion ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới'}</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Quản lý thông tin câu hỏi, các phương án lựa chọn và lời giải chi tiết.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Top Selectors: Topic, Difficulty, Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Chủ đề
              </label>
              <select
                value={topicSlug}
                onChange={(e) => setTopicSlug(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {currentTopics.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name_vn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Độ khó
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="easy">Dễ (Easy)</option>
                <option value="medium">Trung bình (Medium)</option>
                <option value="hard">Khó (Hard)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Loại câu hỏi
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as QuestionType)}
                className="w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="single">Chọn 1 đáp án</option>
                <option value="multiple">Nhiều đáp án</option>
              </select>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Nội dung câu hỏi <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={questionVn}
              onChange={(e) => setQuestionVn(e.target.value)}
              placeholder="Ví dụ: Thuật toán SHA-256 tạo ra chuỗi băm có kích thước cố định là bao nhiêu bit?"
              className="w-full p-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Các phương án lựa chọn (Click nút để đánh dấu đáp án đúng) <span className="text-rose-500">*</span>
            </label>

            <div className="space-y-1.5">
              {options.map((opt, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx] || `${idx + 1}`;
                return (
                  <div
                    key={opt.id}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                      opt.is_correct
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {/* Correct Answer Toggle */}
                    <button
                      type="button"
                      onClick={() => handleSetCorrect(idx)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        opt.is_correct
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                      title={opt.is_correct ? 'Đáp án đúng' : 'Nhấn để chọn đáp án đúng'}
                    >
                      {opt.is_correct ? <Check className="w-3.5 h-3.5" /> : label}
                    </button>

                    <input
                      type="text"
                      value={opt.text_vn}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      placeholder={`Nội dung phương án ${label}...`}
                      className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    />

                    {opt.is_correct && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 pr-1.5">
                        Đúng
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Giải thích chi tiết (Hiển thị khi học viên xem lại bài)
            </label>
            <textarea
              rows={2}
              value={explanationVn}
              onChange={(e) => setExplanationVn(e.target.value)}
              placeholder="Giải thích vì sao phương án được chọn là chính xác..."
              className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Live Preview Toggle & Card */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreview ? 'Ẩn bản xem trước' : 'Xem trước hiển thị câu hỏi'}</span>
            </button>

            {showPreview && (
              <div className="mt-2 p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {selectedTopicObj?.name_vn || topicSlug}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    Độ khó: {difficulty}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {questionVn || '(Chưa nhập nội dung câu hỏi)'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  {options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg text-xs font-medium border ${
                        opt.is_correct
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-200 font-semibold'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-bold mr-1">{['A', 'B', 'C', 'D'][i]}.</span>
                      {opt.text_vn || `Phương án ${['A', 'B', 'C', 'D'][i]}`}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{initialQuestion ? 'Cập Nhật' : 'Lưu Câu Hỏi'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
