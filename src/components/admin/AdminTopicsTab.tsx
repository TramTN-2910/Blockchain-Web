'use client';

import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Hash,
  Pickaxe,
  LockKeyhole,
  Trees,
  Link2,
  Binary,
  Globe,
  ScrollText,
  ShieldCheck,
  BookOpen,
  X,
  Save,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useAdminStore } from '@/store/useAdminStore';
import { QuizTopic } from '@/types/quiz';

const AVAILABLE_ICONS = [
  { id: 'Hash', label: 'Hàm băm' },
  { id: 'Pickaxe', label: 'Thợ đào / Khai thác' },
  { id: 'LockKeyhole', label: 'Khóa / Mật mã' },
  { id: 'Trees', label: 'Cây Merkle' },
  { id: 'Link2', label: 'Chuỗi khối' },
  { id: 'Binary', label: 'Mật mã học' },
  { id: 'Globe', label: 'Mạng P2P' },
  { id: 'ScrollText', label: 'Smart Contract' },
  { id: 'ShieldCheck', label: 'Bảo mật' },
  { id: 'BookOpen', label: 'Lý thuyết chung' },
];

export default function AdminTopicsTab() {
  const { topics, questions, addTopic, updateTopic, deleteTopic, resetToDefaultTopics } = useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<QuizTopic | null>(null);
  const [nameVn, setNameVn] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('BookOpen');
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [deletingTopic, setDeletingTopic] = useState<QuizTopic | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenAddModal = () => {
    setEditingTopic(null);
    setNameVn('');
    setSlug('');
    setIcon('BookOpen');
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: QuizTopic) => {
    setEditingTopic(t);
    setNameVn(t.name_vn);
    setSlug(t.slug);
    setIcon(t.icon || 'BookOpen');
    setError(null);
    setIsModalOpen(true);
  };

  const handleSaveTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVn.trim()) {
      setError('Vui lòng nhập tên chủ đề.');
      return;
    }

    if (editingTopic) {
      const res = updateTopic(editingTopic.slug, {
        name_vn: nameVn.trim(),
        icon,
      });
      if (res.success) {
        showToast(`Đã cập nhật chủ đề "${nameVn}" thành công!`);
        setIsModalOpen(false);
      } else {
        setError(res.error || 'Lỗi cập nhật chủ đề.');
      }
    } else {
      const res = addTopic({
        name_vn: nameVn.trim(),
        slug: slug.trim() || undefined,
        icon,
      });
      if (res.success) {
        showToast(`Đã thêm chủ đề mới "${nameVn}" thành công!`);
        setIsModalOpen(false);
      } else {
        setError(res.error || 'Lỗi thêm chủ đề.');
      }
    }
  };

  const handleAttemptDelete = (t: QuizTopic) => {
    const questionCount = questions.filter((q) => q.topic_slug === t.slug).length;
    setDeletingTopic(t);
    if (questionCount > 0) {
      setDeleteError(
        `Không thể xóa chủ đề này vì đang có ${questionCount} câu hỏi trong ngân hàng đề thi. Vui lòng chuyển hoặc xóa các câu hỏi thuộc chủ đề "${t.name_vn}" trước!`
      );
    } else {
      setDeleteError(null);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingTopic) return;
    const res = deleteTopic(deletingTopic.slug);
    if (res.success) {
      showToast(`Đã xóa chủ đề "${deletingTopic.name_vn}" thành công.`);
      setDeletingTopic(null);
      setDeleteError(null);
    } else {
      setDeleteError(res.error || 'Không thể xóa chủ đề.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-[110] px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 ${
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

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Quản Lý Chủ Đề & Danh Mục Thi</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tổng cộng: <span className="font-bold text-purple-600 dark:text-purple-400">{topics.length}</span> chủ đề • Quy tắc: Không cho phép xóa chủ đề nếu đang chứa câu hỏi.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Khôi phục danh sách chủ đề về 9 bộ chuẩn ban đầu?')) {
                resetToDefaultTopics();
                showToast('Đã khôi phục danh mục chủ đề chuẩn.');
              }
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Khôi phục mặc định
          </button>
          
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Chủ Đề Mới</span>
          </button>
        </div>
      </div>

      {/* Topics Table */}
      <SpotlightCard className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden backdrop-blur-xl" spotlightColor="rgba(168, 85, 247, 0.12)">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Chủ đề</th>
                <th className="py-3.5 px-4">Mã định danh (Slug)</th>
                <th className="py-3.5 px-4 text-center">Số lượng câu hỏi</th>
                <th className="py-3.5 px-4 text-center">Trạng thái an toàn</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {topics.map((topic) => {
                const count = questions.filter((q) => q.topic_slug === topic.slug).length;
                const hasQuestions = count > 0;

                return (
                  <tr key={topic.slug} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Topic Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200/60 dark:border-purple-800/60 font-bold">
                          {topic.name_vn.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {topic.name_vn}
                        </span>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {topic.slug}
                    </td>

                    {/* Question Count */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                        {count} câu
                      </span>
                    </td>

                    {/* Safety Status */}
                    <td className="py-3.5 px-4 text-center">
                      {hasQuestions ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          <LockKeyhole className="w-3.5 h-3.5" />
                          <span>Đang có dữ liệu (Khóa xóa)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Trống (Có thể xóa)</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(topic)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 transition-colors"
                          title="Sửa tên chủ đề"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleAttemptDelete(topic)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            hasQuestions
                              ? 'text-slate-300 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-pointer'
                              : 'text-rose-600 dark:text-rose-400 border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                          }`}
                          title={hasQuestions ? 'Chủ đề đang có câu hỏi' : 'Xóa chủ đề'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SpotlightCard>

      {/* MODAL: ADD / EDIT TOPIC */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-600" />
                <span>{editingTopic ? 'Chỉnh Sửa Chủ Đề' : 'Thêm Chủ Đề Mới'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTopic} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Tên chủ đề <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={nameVn}
                  onChange={(e) => setNameVn(e.target.value)}
                  placeholder="Ví dụ: Zero-Knowledge Proofs"
                  className="w-full p-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {!editingTopic && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    Mã định danh (Slug - Để trống sẽ tự sinh)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="zk-proofs"
                    className="w-full p-2.5 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Chủ Đề</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION & SAFETY CHECK */}
      {deletingTopic && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Xóa Chủ Đề "{deletingTopic.name_vn}"
              </h3>
            </div>

            {deleteError ? (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold leading-relaxed">
                ⚠️ {deleteError}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Chủ đề này hiện không chứa câu hỏi nào. Bạn có chắc chắn muốn xóa chủ đề này khỏi danh mục hệ thống?
              </p>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeletingTopic(null);
                  setDeleteError(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Đóng
              </button>
              {!deleteError && (
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md"
                >
                  Xác nhận xóa
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
