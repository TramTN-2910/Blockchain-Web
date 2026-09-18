'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { generateTestQuestions } from '@/data/quizQuestions';
import { Question, TestResult } from '@/types/quiz';
import { useQuizStore } from '@/store/useQuizStore';
import { useAdminStore } from '@/store/useAdminStore';

export default function TimedTestPage() {
  const router = useRouter();
  const {
    saveTestResult,
    recordAttemptResults,
  } = useQuizStore();
  const adminQuestions = useAdminStore((s) => s.questions);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(3600); // 60 minutes
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize 40 randomized test questions on client mount
  useEffect(() => {
    setIsMounted(true);
    const qs = generateTestQuestions(40, adminQuestions);
    setQuestions(qs);
  }, [adminQuestions]);

  // Timer countdown
  useEffect(() => {
    if (!isMounted || questions.length === 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isMounted, questions]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: [optionId],
    }));
  };

  const answeredCount = useMemo(() => {
    return Object.keys(selectedAnswers).filter(
      (qId) => (selectedAnswers[qId] || []).length > 0
    ).length;
  }, [selectedAnswers]);

  const handleSubmitTest = () => {
    if (questions.length === 0) return;

    // Calculate score
    let correctCount = 0;
    questions.forEach((q) => {
      const selected = selectedAnswers[q.id] || [];
      const correctOptionIds = q.options.filter((o) => o.is_correct).map((o) => o.id);
      const isCorrect =
        selected.length === correctOptionIds.length &&
        selected.every((id) => correctOptionIds.includes(id));
      if (isCorrect) {
        correctCount += 1;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= 70;
    const timeSpent = 3600 - secondsRemaining;

    const result: TestResult = {
      id: `test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      total_questions: questions.length,
      correct_count: correctCount,
      score_percentage: scorePercentage,
      passed,
      time_spent_seconds: timeSpent,
      answers: selectedAnswers,
      questions: questions,
    };

    // Save test result in store and sync wrong questions to Spaced Repetition queue
    saveTestResult(result);
    recordAttemptResults(questions, selectedAnswers);

    router.push('/quiz/result');
  };

  if (!isMounted || questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-4xl mx-auto py-3 sm:py-4 px-4 space-y-3">
      
      {/* Top Header Bar matching Image 1 */}
      <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-200/80 dark:border-slate-800">
        
        {/* Timer */}
        <div className="flex items-center gap-1.5">
          <Clock className={`w-4 h-4 ${secondsRemaining < 300 ? 'text-rose-500 animate-pulse' : 'text-indigo-600 dark:text-indigo-400'}`} />
          <span className={`text-lg sm:text-xl font-black tracking-wider ${secondsRemaining < 300 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
            {formatTimer(secondsRemaining)}
          </span>
        </div>

        {/* Center Progress Text */}
        <div className="text-center">
          <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
            {currentIndex + 1} / {questions.length} • {answeredCount} đã trả lời
          </span>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-5 py-1.5 rounded-xl font-extrabold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
        >
          Nộp bài
        </button>
      </div>

      {/* 40 Question Grid Navigator matching Image 1 */}
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-2.5 sm:p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = (selectedAnswers[q.id] || []).length > 0;

          let btnClasses = 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';

          if (isCurrent) {
            btnClasses = 'bg-indigo-600 text-white font-bold shadow-sm ring-2 ring-indigo-400';
          } else if (isAnswered) {
            btnClasses = 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold border-indigo-300 dark:border-indigo-700';
          }

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center transition-all ${btnClasses}`}
              title={`Câu ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card matching Image 1 */}
      <SpotlightCard className="rounded-2xl p-4 sm:p-5 border border-purple-100/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-md space-y-3" spotlightColor="rgba(99, 102, 241, 0.16)">
        
        {/* Question Header */}
        <span className="text-xs sm:text-sm font-black text-purple-700 dark:text-purple-400 block">
          Câu {currentIndex + 1}/{questions.length}
        </span>

        {/* Question Statement */}
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {currentQ.question_vn}
        </h2>

        {/* Options List */}
        <div className="space-y-2 pt-0.5">
          {currentQ.options.map((opt, idx) => {
            const letter = optionLetters[idx] || String.fromCharCode(65 + idx);
            const isSelected = (selectedAnswers[currentQ.id] || []).includes(opt.id);

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(currentQ.id, opt.id)}
                className={`w-full py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-xl border text-left flex items-center gap-3 transition-all text-xs sm:text-sm font-semibold ${
                  isSelected
                    ? 'border-2 border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-950 dark:text-white shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                }`}
              >
                {/* Circle Badge (A, B, C, D) */}
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {letter}
                </div>

                {/* Option Text */}
                <span className="flex-1 leading-snug">{opt.text_vn}</span>
              </button>
            );
          })}
        </div>
      </SpotlightCard>

      {/* Bottom Navigation matching Image 1 */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className={`px-5 py-2 rounded-xl font-bold text-xs border transition-all ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          ← Trước
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-6 py-2 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
          >
            Nộp bài
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            className="px-6 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
          >
            Tiếp →
          </button>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Xác nhận nộp bài thi?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Bạn đã hoàn thành <strong className="text-indigo-600 dark:text-indigo-400">{answeredCount}/{questions.length}</strong> câu hỏi.
                {answeredCount < questions.length && (
                  <span className="block text-rose-500 font-semibold mt-1">
                    Còn {questions.length - answeredCount} câu chưa trả lời.
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Kiểm tra lại
              </button>
              <button
                onClick={handleSubmitTest}
                className="w-1/2 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
