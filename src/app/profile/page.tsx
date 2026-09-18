'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  FileText,
  BarChart3,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useQuizStore } from '@/store/useQuizStore';
import { useAuthStore } from '@/store/useAuthStore';
import { QUIZ_TOPICS } from '@/data/quizQuestions';

export default function ProfilePage() {
  const { topicStats, wrongQueue, lastTestResult, testHistory = [] } = useQuizStore();
  const { user, isLoggedIn } = useAuthStore();

  const wrongCount = Object.values(wrongQueue).filter((item) => !item.is_mastered).length;

  // Calculate totals from topic practice
  let totalPracticeAnswered = 0;
  let totalPracticeCorrect = 0;

  Object.values(topicStats).forEach((st) => {
    totalPracticeAnswered += st.answered;
    totalPracticeCorrect += st.correct;
  });

  // Calculate total tests taken
  const completedTestsList = React.useMemo(() => {
    if (testHistory && testHistory.length > 0) {
      return testHistory;
    }
    if (lastTestResult) {
      return [lastTestResult];
    }
    return [];
  }, [testHistory, lastTestResult]);

  // Overall statistics
  const totalTestsTaken = completedTestsList.length;
  const answeredCount = totalPracticeAnswered > 0 ? totalPracticeAnswered : (totalTestsTaken > 0 ? totalTestsTaken * 40 : 0);
  const correctCount = totalPracticeCorrect > 0 ? totalPracticeCorrect : (completedTestsList.reduce((acc, t) => acc + t.correct_count, 0));
  const accuracyPct =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const displayName = user?.name || user?.email?.split('@')[0] || 'Học viên';
  const displayEmail = user?.email || 'student@hubblock.edu.vn';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
      
      {/* User Header Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SpotlightCard className="rounded-3xl p-6 sm:p-8 border border-purple-100/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl shadow-purple-500/5 flex flex-col sm:flex-row items-center gap-6" spotlightColor="rgba(99, 102, 241, 0.16)">
          {/* Big Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-3xl shadow-xl shadow-indigo-500/30 flex-shrink-0">
            {initial}
          </div>

          {/* User Info */}
          <div className="space-y-1.5 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
              {displayEmail}
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80">
                {user?.role === 'admin' ? 'Role: Quản trị viên' : 'Role: Học viên'}
              </span>
            </div>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Stat 1: Câu đã ôn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          whileHover={{ y: -3 }}
          className="h-full"
        >
          <SpotlightCard className="h-full rounded-2xl p-5 border border-purple-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md text-center space-y-1" spotlightColor="rgba(99, 102, 241, 0.16)">
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {answeredCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Câu đã ôn
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Stat 2: Trả lời đúng */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          whileHover={{ y: -3 }}
          className="h-full"
        >
          <SpotlightCard className="h-full rounded-2xl p-5 border border-purple-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md text-center space-y-1" spotlightColor="rgba(16, 185, 129, 0.16)">
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {correctCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Trả lời đúng
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Stat 3: Tỷ lệ đúng */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          whileHover={{ y: -3 }}
          className="h-full"
        >
          <SpotlightCard className="h-full rounded-2xl p-5 border border-purple-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md text-center space-y-1" spotlightColor="rgba(168, 85, 247, 0.16)">
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
              {accuracyPct}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Tỷ lệ đúng
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Stat 4: Bài test hoàn thành */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          whileHover={{ y: -3 }}
          className="h-full"
        >
          <SpotlightCard className="h-full rounded-2xl p-5 border border-purple-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md text-center space-y-1" spotlightColor="rgba(99, 102, 241, 0.16)">
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {totalTestsTaken}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Bài test hoàn thành
            </div>
          </SpotlightCard>
        </motion.div>

      </div>

      {/* Section 1: Lịch sử thi (Click to view detailed breakdown) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Lịch sử thi
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Nhấn vào bài thi bất kỳ để xem chi tiết đúng sai & giải thích
          </span>
        </div>

        {completedTestsList.length > 0 ? (
          <div className="space-y-3">
            {completedTestsList.map((test, idx) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.35 + idx * 0.08 }}
              >
                <Link
                  href={`/quiz/result?id=${test.id}`}
                  className="block"
                >
                  <SpotlightCard className="group rounded-2xl p-4 sm:p-5 border border-purple-100/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm flex items-center justify-between gap-4 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all" spotlightColor={test.passed ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)"}>
                    <div className="flex items-center gap-3.5">
                      <span className={`text-xl sm:text-2xl font-black ${test.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {test.correct_count}/{test.total_questions}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        test.passed
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/80'
                      }`}>
                        {test.passed ? `Đạt (${test.score_percentage}%)` : `Chưa đạt (${test.score_percentage}%)`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                        {new Date(test.timestamp).toLocaleString('vi-VN')}
                      </span>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <SpotlightCard className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-center space-y-3" spotlightColor="rgba(99, 102, 241, 0.12)">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Bạn chưa hoàn thành bài thi tính giờ nào.
            </p>
            <Link
              href="/quiz/test"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all"
            >
              <span>Làm bài kiểm tra ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </SpotlightCard>
        )}
      </motion.div>

      {/* Section 2: Tiến trình ôn tập matching Image 2 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Tiến trình ôn tập
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Topic 1: Hash */}
          <SpotlightCard className="rounded-2xl p-5 border border-purple-100/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm space-y-3" spotlightColor="rgba(99, 102, 241, 0.16)">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              hash
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {topicStats['hash'] ? `${topicStats['hash'].correct}/${topicStats['hash'].answered} đúng (${Math.round((topicStats['hash'].correct / Math.max(1, topicStats['hash'].answered)) * 100)}%)` : '0/1 đúng (0%)'}
            </p>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${topicStats['hash'] && topicStats['hash'].answered > 0 ? (topicStats['hash'].correct / topicStats['hash'].answered) * 100 : 0}%` }}
              />
            </div>
          </SpotlightCard>

          {/* Topic 2: Mining */}
          <SpotlightCard className="rounded-2xl p-5 border border-purple-100/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm space-y-3" spotlightColor="rgba(245, 158, 11, 0.16)">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              mining
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {topicStats['mining'] ? `${topicStats['mining'].correct}/${topicStats['mining'].answered} đúng (${Math.round((topicStats['mining'].correct / Math.max(1, topicStats['mining'].answered)) * 100)}%)` : '1/8 đúng (13%)'}
            </p>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${topicStats['mining'] && topicStats['mining'].answered > 0 ? (topicStats['mining'].correct / topicStats['mining'].answered) * 100 : 13}%` }}
              />
            </div>
          </SpotlightCard>

        </div>
      </motion.div>

    </div>
  );
}
