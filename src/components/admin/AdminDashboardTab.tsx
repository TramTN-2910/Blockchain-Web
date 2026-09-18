'use client';

import React from 'react';
import {
  HelpCircle,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  BarChart3,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useAdminStore } from '@/store/useAdminStore';
import { QUIZ_TOPICS } from '@/data/quizQuestions';

export default function AdminDashboardTab({ onSwitchTab }: { onSwitchTab: (tabId: string) => void }) {
  const { questions, topics, users, attempts } = useAdminStore();

  const currentTopics = topics && topics.length > 0 ? topics : QUIZ_TOPICS;

  // Metrics calculation
  const totalQuestions = questions.length;
  const totalTopics = currentTopics.length;
  const totalUsers = users.length;
  const totalAttempts = attempts.length;

  const easyQuestions = questions.filter((q) => q.difficulty === 'easy').length;
  const mediumQuestions = questions.filter((q) => q.difficulty === 'medium').length;
  const hardQuestions = questions.filter((q) => q.difficulty === 'hard').length;

  const passedAttempts = attempts.filter((a) => a.passed).length;
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

  // Question count per topic
  const topicCounts = currentTopics.map((topic) => {
    const count = questions.filter((q) => q.topic_slug === topic.slug).length;
    const percentage = totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0;
    return {
      ...topic,
      count,
      percentage,
    };
  });

  return (
    <div className="space-y-6">
      
      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <SpotlightCard className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-purple-100/80 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-3" spotlightColor="rgba(168, 85, 247, 0.16)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tổng Câu Hỏi
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalQuestions}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Ngân hàng câu hỏi sẵn sàng</span>
            </p>
          </div>
        </SpotlightCard>

        {/* Metric 2 */}
        <SpotlightCard className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-indigo-100/80 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-3" spotlightColor="rgba(99, 102, 241, 0.16)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Chủ Đề & Bộ Đề
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalTopics}
            </div>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
              9 phân hệ mật mã & Blockchain
            </p>
          </div>
        </SpotlightCard>

        {/* Metric 3 */}
        <SpotlightCard className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-cyan-100/80 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-3" spotlightColor="rgba(6, 182, 212, 0.16)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Học Viên Đăng Ký
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalUsers}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Tài khoản trong hệ thống
            </p>
          </div>
        </SpotlightCard>

        {/* Metric 4 */}
        <SpotlightCard className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-emerald-100/80 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-3" spotlightColor="rgba(16, 185, 129, 0.16)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Lượt Thi & Tỷ Lệ Đạt
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalAttempts} <span className="text-sm font-bold text-slate-500">lượt</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              Tỷ lệ đạt chuẩn: {passRate}%
            </p>
          </div>
        </SpotlightCard>

      </div>

      {/* Two Column Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Topic Distribution (8 cols) */}
        <SpotlightCard className="lg:col-span-7 p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-5" spotlightColor="rgba(99, 102, 241, 0.14)">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Phân Bổ Câu Hỏi Theo Chủ Đề</span>
            </h3>
            <button
              type="button"
              onClick={() => onSwitchTab('questions')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Xem chi tiết →
            </button>
          </div>

          <div className="space-y-3.5">
            {topicCounts.map((t) => (
              <div key={t.slug} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {t.name_vn}
                  </span>
                  <span className="text-slate-500 font-semibold">
                    {t.count} câu ({t.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${Math.max(t.percentage, 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>

        {/* Right: Difficulty & Quick Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Difficulty breakdown */}
          <SpotlightCard className="p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-4" spotlightColor="rgba(168, 85, 247, 0.14)">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Tỷ Lệ Mức Độ Khó</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 text-center space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Dễ
                </span>
                <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                  {easyQuestions}
                </div>
                <div className="text-[10px] text-slate-500">
                  {totalQuestions > 0 ? Math.round((easyQuestions / totalQuestions) * 100) : 0}%
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-center space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Vừa
                </span>
                <div className="text-xl font-black text-amber-700 dark:text-amber-300">
                  {mediumQuestions}
                </div>
                <div className="text-[10px] text-slate-500">
                  {totalQuestions > 0 ? Math.round((mediumQuestions / totalQuestions) * 100) : 0}%
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60 text-center space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Khó
                </span>
                <div className="text-xl font-black text-rose-700 dark:text-rose-300">
                  {hardQuestions}
                </div>
                <div className="text-[10px] text-slate-500">
                  {totalQuestions > 0 ? Math.round((hardQuestions / totalQuestions) * 100) : 0}%
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Quick Actions Shortcuts */}
          <SpotlightCard className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-slate-900/95 text-white border border-indigo-700/50 shadow-xl space-y-4" spotlightColor="rgba(255, 255, 255, 0.16)">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>AI Generator</span>
              </div>
              <h4 className="text-lg font-bold">Import Tự Động Với AI</h4>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Tự động trích xuất đề thi từ bất kỳ văn bản thô nào với mô hình AI chuyên dụng.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onSwitchTab('ai-import')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-950 hover:bg-slate-100 shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mở AI Parser</span>
              </button>

              <button
                type="button"
                onClick={() => onSwitchTab('questions')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                Quản lý câu hỏi
              </button>
            </div>
          </SpotlightCard>

        </div>

      </div>

    </div>
  );
}
