'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  ArrowLeft,
  Calendar,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useQuizStore } from '@/store/useQuizStore';
import { TestResult } from '@/types/quiz';

function TestResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testIdParam = searchParams.get('id');

  const { lastTestResult, testHistory } = useQuizStore();

  // Find targeted test result: by ID or default to lastTestResult or most recent test in history
  const activeResult: TestResult | null = React.useMemo(() => {
    if (testIdParam) {
      const found = (testHistory || []).find((t) => t.id === testIdParam);
      if (found) return found;
    }
    if (lastTestResult) return lastTestResult;
    if (testHistory && testHistory.length > 0) return testHistory[0];
    return null;
  }, [testIdParam, testHistory, lastTestResult]);

  if (!activeResult) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">Chưa có kết quả bài thi</h2>
        <p className="text-sm text-slate-500">
          Hãy hoàn thành một bài test 40 câu để xem điểm số và đánh giá năng lực.
        </p>
        <Link
          href="/quiz/test"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all text-sm shadow-md"
        >
          Bắt đầu làm bài test
        </Link>
      </div>
    );
  }

  const {
    id,
    timestamp,
    total_questions,
    correct_count,
    score_percentage,
    passed,
    time_spent_seconds,
    answers,
    questions,
  } = activeResult;

  const wrongCount = total_questions - correct_count;
  const minutes = Math.floor(time_spent_seconds / 60);
  const seconds = time_spent_seconds % 60;
  const optionLetters = ['A', 'B', 'C', 'D'];
  const formattedDate = new Date(timestamp).toLocaleString('vi-VN');

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-10 px-4 space-y-8">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Hồ sơ cá nhân</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>Thời gian làm bài: {formattedDate}</span>
        </div>
      </div>

      {/* Top Score Banner */}
      <SpotlightCard className="rounded-3xl p-8 sm:p-10 border border-purple-100/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl shadow-purple-500/10 text-center space-y-6" spotlightColor={passed ? "rgba(16, 185, 129, 0.16)" : "rgba(244, 63, 94, 0.16)"}>
        
        {/* Score Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
            {passed ? '🎉 Chúc mừng bạn đã hoàn thành!' : '✍️ Kết quả bài kiểm tra'}
          </div>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
            {correct_count} / {total_questions}
          </h1>

          <p className="text-base sm:text-lg font-bold">
            {passed ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                ĐẠT ({score_percentage}%) — Bạn đã hoàn thành xuất sắc bài kiểm tra!
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400">
                CHƯA ĐẠT ({score_percentage}%) — Hãy ôn tập lại các câu sai để củng cố kiến thức.
              </span>
            )}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="text-xs text-slate-500 font-medium block">Thời gian</span>
            <span className="text-base font-bold text-slate-800 dark:text-slate-200">
              {minutes}p {seconds}s
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-center">
            <span className="text-xs text-emerald-600 font-medium block">Số câu đúng</span>
            <span className="text-base font-bold text-emerald-700 dark:text-emerald-300">
              {correct_count} câu
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60 text-center">
            <span className="text-xs text-rose-600 font-medium block">Số câu sai</span>
            <span className="text-base font-bold text-rose-700 dark:text-rose-300">
              {wrongCount} câu
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {wrongCount > 0 && (
            <Link
              href={`/quiz/review-wrong?testId=${id}`}
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-amber-950 bg-amber-400 hover:bg-amber-500 shadow-md flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ôn tập {wrongCount} câu làm sai trong bài thi này</span>
            </Link>
          )}

          <Link
            href="/quiz/test"
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all"
          >
            Làm bài Test mới
          </Link>

          <Link
            href="/quiz"
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
          >
            Về Trang Quiz
          </Link>
        </div>
      </SpotlightCard>

      {/* 40-Question Detailed Review List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            Xem lại chi tiết bài làm ({questions.length} câu)
          </h2>
          <span className="text-xs sm:text-sm font-semibold text-slate-500">
            {correct_count} đúng / {wrongCount} sai
          </span>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userSelected = answers[q.id] || [];
            const correctOptionIds = q.options.filter((o) => o.is_correct).map((o) => o.id);
            const isUserCorrect =
              userSelected.length === correctOptionIds.length &&
              userSelected.every((id) => correctOptionIds.includes(id));

            return (
              <SpotlightCard
                key={q.id}
                className={`rounded-3xl p-6 sm:p-8 border bg-white/90 dark:bg-slate-900/90 shadow-lg space-y-5 ${
                  isUserCorrect
                    ? 'border-emerald-200 dark:border-emerald-950 shadow-emerald-500/5'
                    : 'border-rose-200 dark:border-rose-950 shadow-rose-500/5'
                }`}
                spotlightColor={isUserCorrect ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)"}
              >
                {/* Question Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-purple-700 dark:text-purple-400">
                      Câu {idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80">
                      {q.topic_name_vn}
                    </span>
                  </div>

                  <div>
                    {isUserCorrect ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đúng (+1)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Chưa đúng</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Statement */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {q.question_vn}
                </h3>

                {/* Options Review */}
                <div className="space-y-2.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const letter = optionLetters[optIdx] || String.fromCharCode(65 + optIdx);
                    const isPickedByUser = userSelected.includes(opt.id);
                    const isCorrect = opt.is_correct;

                    let optionStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300';
                    let circleStyle = 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

                    if (isCorrect) {
                      // Correct option is always highlighted in Cyan/Emerald
                      optionStyle = 'border-2 border-cyan-500 dark:border-cyan-400 bg-cyan-50/70 dark:bg-cyan-950/40 text-cyan-950 dark:text-cyan-100 font-bold';
                      circleStyle = 'bg-cyan-600 text-white font-bold';
                    } else if (isPickedByUser && !isCorrect) {
                      // User picked this incorrect option
                      optionStyle = 'border-2 border-rose-400 dark:border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 line-through';
                      circleStyle = 'bg-rose-500 text-white font-bold';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm ${optionStyle}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${circleStyle}`}>
                          {letter}
                        </div>
                        <span className="flex-1">{opt.text_vn}</span>
                        {isCorrect && (
                          <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/60 px-2 py-0.5 rounded-md">
                            Đáp án đúng
                          </span>
                        )}
                        {isPickedByUser && !isCorrect && (
                          <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                            Lựa chọn của bạn
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50/80 dark:bg-cyan-950/30 border border-cyan-200/80 dark:border-cyan-800/80 space-y-1.5">
                  <h4 className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                    Giải thích chi tiết:
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {q.explanation_vn}
                  </p>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default function TestResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <TestResultContent />
    </Suspense>
  );
}
