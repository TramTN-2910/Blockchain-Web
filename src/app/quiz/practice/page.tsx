'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, X, RotateCcw, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { ALL_QUESTIONS, QUIZ_TOPICS } from '@/data/quizQuestions';
import { Question } from '@/types/quiz';
import { useQuizStore } from '@/store/useQuizStore';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic');
  const difficultyParam = searchParams.get('difficulty');
  const { recordPracticeAnswer } = useQuizStore();

  // Filter questions according to query params
  const questions: Question[] = useMemo(() => {
    let list = ALL_QUESTIONS;
    if (topicParam) {
      list = list.filter((q) => q.topic_slug === topicParam);
    }
    if (difficultyParam && difficultyParam !== 'all') {
      list = list.filter((q) => q.difficulty === difficultyParam);
    }
    return list.length > 0 ? list : ALL_QUESTIONS;
  }, [topicParam, difficultyParam]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];
  const totalCount = questions.length;
  const progressPct = Math.round(((currentIndex + 1) / totalCount) * 100);

  // Reset selected option when question changes
  useEffect(() => {
    setSelectedOptionId(null);
  }, [currentIndex]);

  const handleSelectOption = (optId: string) => {
    if (selectedOptionId !== null) return; // Prevent changing after choosing
    setSelectedOptionId(optId);

    const isCorrect = currentQ.options.find((o) => o.id === optId)?.is_correct ?? false;
    if (isCorrect) {
      setSessionCorrectCount((prev) => prev + 1);
    }
    recordPracticeAnswer(currentQ.topic_slug, isCorrect);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalCount - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompletionModalOpen(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setSessionCorrectCount(0);
    setIsCompletionModalOpen(false);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'Dễ';
      case 'medium':
        return 'Vừa';
      case 'hard':
        return 'Khó';
      default:
        return 'Dễ';
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-3 sm:py-4 px-4 space-y-3">
      
      {/* Top Bar - Compact matching Image 2 */}
      <div className="flex items-center justify-between gap-3">
        
        {/* Back Button */}
        <Link
          href="/quiz"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại</span>
        </Link>

        {/* Center Progress Text */}
        <div className="text-center">
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            {currentIndex + 1} / {totalCount} • {currentQ.topic_name_vn}
          </span>
        </div>

        {/* Right Progress Bar */}
        <div className="w-20 sm:w-28 h-1.5 sm:h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Main Question Card - Compact Fit to Screen matching Image 2 */}
      <SpotlightCard className="rounded-2xl p-4 sm:p-5 border border-purple-100/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-md space-y-3" spotlightColor="rgba(168, 85, 247, 0.16)">
        
        {/* Question Header & Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm sm:text-base font-black text-purple-700 dark:text-purple-400">
            Câu {currentIndex + 1}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800/80">
              {getDifficultyLabel(currentQ.difficulty)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80">
              {currentQ.topic_name_vn}
            </span>
          </div>
        </div>

        {/* Question Statement */}
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {currentQ.question_vn}
        </h2>

        {/* Options List - Compact */}
        <div className="space-y-2 pt-0.5">
          {currentQ.options.map((opt, idx) => {
            const letter = optionLetters[idx] || String.fromCharCode(65 + idx);
            const isPicked = selectedOptionId === opt.id;
            const isAnswered = selectedOptionId !== null;
            const isCorrectOption = opt.is_correct;

            let cardClasses = 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200';
            let circleClasses = 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

            if (isAnswered) {
              if (isCorrectOption) {
                cardClasses = 'border-2 border-cyan-500 dark:border-cyan-400 bg-cyan-50/70 dark:bg-cyan-950/40 text-cyan-950 dark:text-cyan-100 shadow-sm';
                circleClasses = 'bg-cyan-600 text-white font-bold';
              } else if (isPicked && !isCorrectOption) {
                cardClasses = 'border-2 border-rose-400 dark:border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 shadow-sm';
                circleClasses = 'bg-rose-500 text-white font-bold';
              } else {
                cardClasses = 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={isAnswered}
                className={`w-full py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-xl border text-left flex items-center gap-3 transition-all text-xs sm:text-sm font-semibold ${cardClasses}`}
              >
                {/* Circle Badge (A, B, C, D) */}
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${circleClasses}`}>
                  {letter}
                </div>

                {/* Option Text */}
                <span className="flex-1 leading-snug">{opt.text_vn}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation Box - Compact */}
        <AnimatePresence>
          {selectedOptionId !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 6 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="p-3 sm:p-3.5 rounded-xl bg-cyan-50/80 dark:bg-cyan-950/30 border border-cyan-200/80 dark:border-cyan-800/80 space-y-1 text-slate-800 dark:text-slate-200"
            >
              <h4 className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                Giải thích:
              </h4>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {currentQ.explanation_vn}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </SpotlightCard>

      {/* Bottom Navigation - Compact */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-5 py-2 rounded-xl font-bold text-xs border transition-all ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          ← Trước
        </button>

        {currentIndex === totalCount - 1 ? (
          <button
            onClick={() => setIsCompletionModalOpen(true)}
            className="px-6 py-2 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Hoàn thành ✓</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
          >
            Tiếp →
          </button>
        )}
      </div>

      {/* Completion Modal Pop-up */}
      {isCompletionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Hoàn thành ôn tập bộ đề!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Bạn đã đi qua tất cả <strong>{totalCount} câu hỏi</strong> của chủ đề <strong className="text-indigo-600 dark:text-indigo-400">{currentQ.topic_name_vn}</strong>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ôn tập lại</span>
              </button>
              <button
                onClick={() => router.push('/quiz')}
                className="w-1/2 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition-all"
              >
                Về trang Quiz
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}
