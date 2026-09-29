'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, LogIn, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import AdminDashboardTab from '@/components/admin/AdminDashboardTab';
import AdminQuestionsTab from '@/components/admin/AdminQuestionsTab';
import AdminTopicsTab from '@/components/admin/AdminTopicsTab';
import AdminAIImportTab from '@/components/admin/AdminAIImportTab';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import { useAuthStore } from '@/store/useAuthStore';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

type AdminTab = 'dashboard' | 'questions' | 'topics' | 'ai-import' | 'users';

const ADMIN_TABS = [
  {
    id: 'dashboard' as AdminTab,
    label: 'Tổng quan & Thống kê',
  },
  {
    id: 'questions' as AdminTab,
    label: 'Ngân hàng câu hỏi',
  },
  {
    id: 'topics' as AdminTab,
    label: 'Quản lý chủ đề',
  },
  {
    id: 'ai-import' as AdminTab,
    label: 'AI Import đề thi',
  },
  {
    id: 'users' as AdminTab,
    label: 'Học viên & Lịch sử',
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mounted, setMounted] = useState(false);
  const { user, isLoggedIn, isLoading, isInitialized, initAuth } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    initAuth();
  }, [initAuth]);

  if (!mounted || (isLoading && !isInitialized)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Đang kiểm tra quyền truy cập Admin...</p>
      </div>
    );
  }

  // Access Control: Must be logged in as admin
  const isAdmin = isLoggedIn && user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4">
        <SpotlightCard className="p-8 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-purple-200 dark:border-purple-900/60 shadow-2xl text-center space-y-6" spotlightColor="rgba(168, 85, 247, 0.16)">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Yêu Cầu Quyền Quản Trị Viên
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Trang này chỉ dành riêng cho Quản trị viên (Admin) để quản lý ngân hàng câu hỏi, chủ đề và người dùng. Vui lòng đăng nhập với tài khoản Admin để tiếp tục.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login?redirect=/admin"
              className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 shadow-lg shadow-purple-500/25 transition-all text-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập Tài Khoản Admin</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/intro/overview"
              className="py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Quay về Trang Chủ
            </Link>
          </div>
        </SpotlightCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 min-h-screen">
      
      {/* Top Header with Float Entrance Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
            <span>Trung Tâm Quản Trị Hệ Thống</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Admin Management Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Quản trị ngân hàng đề thi, danh mục chủ đề, công cụ AI trích xuất và theo dõi học viên.
          </p>
        </div>
      </motion.div>

      {/* Sliding Horizontal Navigation Pill Tabs (Text-only, Border hugging) */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
        className="w-full overflow-x-auto no-scrollbar -mx-1 px-1 py-1"
      >
        <div className="inline-flex w-fit max-w-full items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-850 border border-slate-300/60 dark:border-slate-800/80 backdrop-blur-xl flex-nowrap">
          {ADMIN_TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-colors duration-200 z-10 flex-shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {/* Sliding Active Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="admin-active-tab-indicator"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-md shadow-indigo-500/25"
                  />
                )}

                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Tab Content with AnimatePresence */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.995 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'dashboard' && (
              <AdminDashboardTab onSwitchTab={(tabId) => setActiveTab(tabId as AdminTab)} />
            )}

            {activeTab === 'questions' && <AdminQuestionsTab />}

            {activeTab === 'topics' && <AdminTopicsTab />}

            {activeTab === 'ai-import' && (
              <AdminAIImportTab onSaveSuccess={() => setActiveTab('questions')} />
            )}

            {activeTab === 'users' && <AdminUsersTab />}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
