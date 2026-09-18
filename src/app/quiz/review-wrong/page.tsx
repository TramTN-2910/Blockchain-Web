'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuizStore } from '@/store/useQuizStore';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Award,
  Sparkles,
  Calendar,
  Layers,
  Check,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Question, TestResult } from '@/types/quiz';

function ReviewWrongContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testIdParam = searchParams.get('testId');

  const { testHistory = [], lastTestResult } = useQuizStore();

  // Collect all completed tests from history (or fallback to lastTestResult)
  const allTests = useMemo(() => {
    const list = [...(testHistory || [])];
    if (lastTestResult && !list.some((t) => t.id === lastTestResult.id)) {
      list.unshift(lastTestResult);
    }
    return list;
  }, [testHistory, lastTestResult]);

  // Identify all tests that contain at least 1 wrong question
  const testsWithMistakes = useMemo(() => {
    return allTests.filter((t) => {
      const wrongCount = t.total_questions - t.correct_count;
      return wrongCount > 0;
    });
  }, [allTests]);

  // Determine currently selected test
  const selectedTest: TestResult | null = useMemo(() => {
    if (testIdParam) {
      const found = allTests.find((t) => t.id === testIdParam);
      if (found) return found;
    }
    // Default to the most recent test with mistakes
    if (testsWithMistakes.length > 0) {
      return testsWithMistakes[0];
    }
    // Or default to any available test
    if (allTests.length > 0) {
      return allTests[0];
    }
    return null;
  }, [testIdParam, allTests, testsWithMistakes]);

  // Extract STRICTLY the wrong questions from the selected test
  const wrongQuestionsInSelectedTest: { question: Question; userOriginalAnswer: string[] }[] = useMemo(() => {
    if (!selectedTest) return [];

    const list: { question: Question; userOriginalAnswer: string[] }[] = [];
    selectedTest.questions.forEach((q) => {
      const userSelected = selectedTest.answers[q.id] || [];
      const correctOptionIds = q.options.filter((opt) => opt.is_correct).map((opt) => opt.id);
      
      const isCorrect =
        userSelected.length === correctOptionIds.length &&
        userSelected.every((id) => correctOptionIds.includes(id));

      if (!isCorrect) {
        list.push({
          question: q,
          userOriginalAnswer: userSelected,
        });
      }
    });

    return list;
  }, [selectedTest]);

  // Local interactive practice state
  const [currentSelectedAnswers, setCurrentSelectedAnswers] = useState<Record<string, string[]>>({});
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [correctlyFixedSet, setCorrectlyFixedSet] = useState<Set<string>>(new Set());

  const handleSelectOption = (questionId: string, optionId: string, isMultiple = false) => {
    if (checkedState[questionId]) return; // locked after check

    setCurrentSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      let updated: string[];
      if (isMultiple) {
        updated = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
      } else {
        updated = [optionId];
      }
      return { ...prev, [questionId]: updated };
    });
  };

  const handleCheckAnswer = (q: Question) => {
    const selected = currentSelectedAnswers[q.id] || [];
    const correctOptionIds = q.options.filter((opt) => opt.is_correct).map((opt) => opt.id);
    const isCorrect =
      selected.length === correctOptionIds.length &&
      selected.every((id) => correctOptionIds.includes(id));

    setCheckedState((prev) => ({ ...prev, [q.id]: true }));

    if (isCorrect) {
      setCorrectlyFixedSet((prev) => new Set([...Array.from(prev), q.id]));
    }
  };

  const totalWrong = wrongQuestionsInSelectedTest.length;
  const fixedCount = correctlyFixedSet.size;
  const isAllMastered = totalWrong > 0 && fixedCount === totalWrong;
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-10 px-4 space-y-8">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Trung tâm Quiz</span>
        </Link>

        {selectedTest && (
          <Link
            href={`/quiz/result?id=${selectedTest.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Xem lại kết quả bài thi này</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Ôn tập Strict: Chỉ áp dụng cho câu làm sai trong bài kiểm tra</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Ôn Tập Câu Hỏi Chưa Đúng
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Hệ thống trích xuất chính xác các câu hỏi bạn đã trả lời chưa đúng trong bài thi để bạn rèn luyện lại và củng cố kiến thức trước khi thi tiếp.
        </p>
      </div>

      {/* Test Selector (if user has multiple test sessions) */}
      {testsWithMistakes.length > 1 && (
        <SpotlightCard className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm" spotlightColor="rgba(99, 102, 241, 0.15)">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Chọn bài kiểm tra cần ôn tập câu sai:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {testsWithMistakes.map((t) => {
              const isSelected = selectedTest?.id === t.id;
              const wrongCount = t.total_questions - t.correct_count;
              const dateStr = new Date(t.timestamp).toLocaleString('vi-VN');

              return (
                <button
                  key={t.id}
                  onClick={() => {
                    router.push(`/quiz/review-wrong?testId=${t.id}`);
                    setCurrentSelectedAnswers({});
                    setCheckedState({});
                    setCorrectlyFixedSet(new Set());
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200'
                  }`}
                >
                  <span>{dateStr}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                  }`}>
                    {wrongCount} câu sai
                  </span>
                </button>
              );
            })}
          </div>
        </SpotlightCard>
      )}

      {/* Main Review Section */}
      {!selectedTest || totalWrong === 0 ? (
        <SpotlightCard className="rounded-3xl p-10 sm:p-12 border border-purple-100/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl text-center space-y-5" spotlightColor="rgba(16, 185, 129, 0.16)">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Tuyệt vời! Không có câu hỏi sai nào cần ôn tập
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {allTests.length === 0
              ? 'Bạn chưa làm bài kiểm tra tính giờ nào. Hãy bắt đầu một bài test 40 câu để thử sức!'
              : 'Bạn đã hoàn thành chính xác tất cả câu hỏi trong bài kiểm tra này!'}
          </p>
          <div className="pt-2">
            <Link
              href="/quiz/test"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Làm bài kiểm tra mới</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </SpotlightCard>
      ) : (
        <div className="space-y-6">
          
          {/* Progress Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60">
            <div>
              <div className="text-xs font-bold text-amber-800 dark:text-amber-300">
                Bài thi ngày {new Date(selectedTest.timestamp).toLocaleString('vi-VN')}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Điểm bài thi: <span className="font-bold text-rose-600">{selectedTest.correct_count}/{selectedTest.total_questions}</span> • Cần sửa: <span className="font-bold text-amber-700 dark:text-amber-400">{totalWrong} câu</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Đã sửa đúng: <span className="text-emerald-600 font-extrabold">{fixedCount}</span> / {totalWrong}
              </span>
              <div className="w-28 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(fixedCount / totalWrong) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* All Mastered Celebration Banner */}
          {isAllMastered && (
            <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-3 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-lg font-black text-emerald-800 dark:text-emerald-200">
                Xuất sắc! Bạn đã sửa đúng tất cả {totalWrong} câu sai của bài thi này!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                Kiến thức của bạn đã được củng cố. Hãy thử sức với bài kiểm tra 40 câu mới để kiểm tra năng lực!
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/quiz/test"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all"
                >
                  Làm bài kiểm tra mới
                </Link>
                <Link
                  href="/quiz"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all"
                >
                  Về Danh mục Quiz
                </Link>
              </div>
            </div>
          )}

          {/* Question Cards List */}
          <div className="space-y-6">
            {wrongQuestionsInSelectedTest.map((item, idx) => {
              const q = item.question;
              const isChecked = checkedState[q.id];
              const userCurrentSelection = currentSelectedAnswers[q.id] || [];
              const correctOptionIds = q.options.filter((opt) => opt.is_correct).map((opt) => opt.id);
              
              const isCurrentCorrect =
                isChecked &&
                userCurrentSelection.length === correctOptionIds.length &&
                userCurrentSelection.every((id) => correctOptionIds.includes(id));

              return (
                <SpotlightCard
                  key={q.id}
                  className={`rounded-3xl p-6 sm:p-7 border bg-white/95 dark:bg-slate-900/95 shadow-md space-y-4 transition-all ${
                    isChecked
                      ? isCurrentCorrect
                        ? 'border-emerald-300 dark:border-emerald-800 shadow-emerald-500/5'
                        : 'border-rose-300 dark:border-rose-800 shadow-rose-500/5'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                  spotlightColor={isChecked ? (isCurrentCorrect ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)") : "rgba(99, 102, 241, 0.15)"}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        Câu {idx + 1} / {totalWrong} (Câu sai trong bài thi)
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80">
                        {q.topic_name_vn}
                      </span>
                    </div>

                    {isChecked && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        isCurrentCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                      }`}>
                        {isCurrentCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{isCurrentCorrect ? 'Đã sửa đúng!' : 'Vẫn chưa chính xác'}</span>
                      </span>
                    )}
                  </div>

                  {/* Question Statement */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                    {q.question_vn}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const letter = optionLetters[optIdx] || String.fromCharCode(65 + optIdx);
                      const isSelected = userCurrentSelection.includes(opt.id);
                      const isCorrect = opt.is_correct;

                      let containerStyle = 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500';
                      let badgeStyle = 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

                      if (isChecked) {
                        if (isCorrect) {
                          containerStyle = 'border-2 border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-bold';
                          badgeStyle = 'bg-emerald-600 text-white font-bold';
                        } else if (isSelected && !isCorrect) {
                          containerStyle = 'border-2 border-rose-400 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 line-through';
                          badgeStyle = 'bg-rose-500 text-white font-bold';
                        }
                      } else if (isSelected) {
                        containerStyle = 'border-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100 font-semibold';
                        badgeStyle = 'bg-indigo-600 text-white font-bold';
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={isChecked}
                          onClick={() => handleSelectOption(q.id, opt.id, q.type === 'multiple')}
                          className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left text-xs sm:text-sm flex items-center gap-3 transition-all ${containerStyle}`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${badgeStyle}`}>
                            {letter}
                          </div>
                          <span className="flex-1">{opt.text_vn}</span>
                          {isChecked && isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                              Đáp án đúng
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions & Explanations */}
                  {!isChecked ? (
                    <button
                      disabled={userCurrentSelection.length === 0}
                      onClick={() => handleCheckAnswer(q)}
                      className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-xs transition-all shadow-md shadow-indigo-500/20"
                    >
                      Kiểm tra câu này
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Giải thích chi tiết:</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {q.explanation_vn}
                      </p>
                    </div>
                  )}
                </SpotlightCard>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}

export default function ReviewWrongQuestionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ReviewWrongContent />
    </Suspense>
  );
}
