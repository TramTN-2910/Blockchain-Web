'use client';

import React, { useState, useRef } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useAdminStore } from '@/store/useAdminStore';
import { Question, DifficultyLevel } from '@/types/quiz';
import { QUIZ_TOPICS } from '@/data/quizQuestions';
import QuestionModal from './QuestionModal';

export default function AdminQuestionsTab() {
  const {
    questions,
    topics,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    resetToDefaultQuestions,
    exportQuestionsJSON,
    importQuestionsJSON,
  } = useAdminStore();

  const currentTopics = topics && topics.length > 0 ? topics : QUIZ_TOPICS;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Delete confirmation state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question_vn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic_name_vn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some((opt) => opt.text_vn.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTopic = selectedTopic === 'all' || q.topic_slug === selectedTopic;
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;

    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q: Question) => {
    setEditingQuestion(q);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = (questionData: any) => {
    if (editingQuestion) {
      updateQuestion(editingQuestion.id, questionData);
      showToast('Đã cập nhật câu hỏi thành công!');
    } else {
      addQuestion(questionData);
      showToast('Đã thêm câu hỏi mới thành công!');
    }
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteQuestion(deletingId);
      setDeletingId(null);
      showToast('Đã xóa câu hỏi khỏi ngân hàng đề thi.');
    }
  };

  const handleExportJSON = () => {
    const jsonStr = exportQuestionsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hubblock_questions_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải xuống tệp JSON ngân hàng câu hỏi!');
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importQuestionsJSON(content);
      if (res.success) {
        showToast(`Đã nhập thành công ${res.count} câu hỏi từ tệp JSON!`);
      } else {
        showToast(res.error || 'Lỗi nhập file JSON', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetDefault = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục danh sách câu hỏi về bộ mẫu chuẩn ban đầu?')) {
      resetToDefaultQuestions();
      showToast('Đã khôi phục ngân hàng câu hỏi về mặc định.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700 text-emerald-100'
              : 'bg-rose-950/90 border-rose-700 text-rose-100'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-bold">{toastMessage.text}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Ngân Hàng Câu Hỏi & Đề Thi</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tổng số: <span className="font-bold text-indigo-600 dark:text-indigo-400">{questions.length}</span> câu hỏi • Đang hiển thị: <span className="font-bold text-slate-700 dark:text-slate-200">{filteredQuestions.length}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden JSON file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
            title="Nhập câu hỏi từ tệp JSON"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Nhập JSON</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
            title="Xuất danh sách ra tệp JSON dự phòng"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất JSON</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefault}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
            title="Khôi phục ngân hàng mẫu ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mẫu</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Câu Hỏi Mới</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Bar */}
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nội dung câu hỏi, chủ đề, phương án..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Topic Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tất cả chủ đề</option>
            {currentTopics.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name_vn}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tất cả độ khó</option>
            <option value="easy">Dễ (Easy)</option>
            <option value="medium">Trung bình (Medium)</option>
            <option value="hard">Khó (Hard)</option>
          </select>
        </div>
      </div>

      {/* Questions Table / Cards */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Không tìm thấy câu hỏi nào phù hợp với bộ lọc.
            </p>
            <p className="text-xs text-slate-500">
              Hãy thử tìm kiếm từ khóa khác hoặc bấm nút "Thêm Câu Hỏi Mới".
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const correctOpt = q.options.find((o) => o.is_correct);
            return (
              <SpotlightCard
                key={q.id}
                className="group relative p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start justify-between gap-4"
                spotlightColor="rgba(99, 102, 241, 0.14)"
              >
                {/* Left details */}
                <div className="space-y-2 flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                      {q.topic_name_vn || q.topic_slug}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        q.difficulty === 'easy'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60'
                          : q.difficulty === 'medium'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/60'
                      }`}
                    >
                      {q.difficulty === 'easy' ? 'Dễ' : q.difficulty === 'medium' ? 'Vừa' : 'Khó'}
                    </span>

                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: {q.id}
                    </span>
                  </div>

                  {/* Question Text */}
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    {idx + 1}. {q.question_vn}
                  </h4>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={opt.id}
                        className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 border transition-all ${
                          opt.is_correct
                            ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="font-bold shrink-0">{['A', 'B', 'C', 'D'][oIdx]}.</span>
                        <span className="truncate">{opt.text_vn}</span>
                        {opt.is_correct && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Explanation if any */}
                  {q.explanation_vn && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 line-clamp-1">
                      💡 Giải thích: {q.explanation_vn}
                    </p>
                  )}
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-1.5 shrink-0 sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(q)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                    title="Chỉnh sửa câu hỏi"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingId(q.id)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </SpotlightCard>
            );
          })
        )}
      </div>

      {/* Question Modal (Add / Edit) */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
        initialQuestion={editingQuestion}
      />

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Xác Nhận Xóa Câu Hỏi
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa câu hỏi này khỏi hệ thống? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
