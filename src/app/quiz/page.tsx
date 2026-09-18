'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Hash,
  Pickaxe,
  LockKeyhole,
  Trees,
  Link2,
  Binary,
  Globe,
  ScrollText,
  ShieldCheck,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { QUIZ_TOPICS } from '@/data/quizQuestions';
import { useQuizStore } from '@/store/useQuizStore';
import { TestResult } from '@/types/quiz';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function QuizMainPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const quiz = t.quiz || ({} as any);
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState<'practice' | 'test'>('practice');
  const { topicStats, testHistory = [], lastTestResult } = useQuizStore();

  const allTests: TestResult[] = useMemo(() => {
    const list = [...(testHistory || [])];
    if (lastTestResult && !list.some((t) => t.id === lastTestResult.id)) {
      list.unshift(lastTestResult);
    }
    return list;
  }, [testHistory, lastTestResult]);

  const latestFailedTest: TestResult | null = useMemo(() => {
    return allTests.find((t) => t.total_questions - t.correct_count > 0) || null;
  }, [allTests]);

  const testMistakesCount = latestFailedTest
    ? latestFailedTest.total_questions - latestFailedTest.correct_count
    : 0;

  const getTopicIcon = (slug: string) => {
    switch (slug) {
      case 'hash':
        return <span className="font-extrabold text-blue-600 text-lg">#</span>;
      case 'mining':
        return <Pickaxe className="w-5 h-5 text-amber-600" />;
      case 'rsa':
        return <LockKeyhole className="w-5 h-5 text-amber-700" />;
      case 'merkle':
        return <Trees className="w-5 h-5 text-emerald-600" />;
      case 'blockchain':
        return <Link2 className="w-5 h-5 text-slate-800 dark:text-slate-200" />;
      case 'cryptography':
        return <Binary className="w-5 h-5 text-purple-600" />;
      case 'p2p':
        return <Globe className="w-5 h-5 text-cyan-600" />;
      case 'smart-contract':
        return <ScrollText className="w-5 h-5 text-orange-600" />;
      case 'security':
        return <ShieldCheck className="w-5 h-5 text-red-600" />;
      default:
        return <Hash className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getTopicBg = (slug: string) => {
    switch (slug) {
      case 'hash':
        return 'bg-blue-100 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
      case 'mining':
        return 'bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
      case 'rsa':
        return 'bg-yellow-100 dark:bg-yellow-950/60 border-yellow-200 dark:border-yellow-800';
      case 'merkle':
        return 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
      case 'blockchain':
        return 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700';
      case 'cryptography':
        return 'bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800';
      case 'p2p':
        return 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800';
      case 'smart-contract':
        return 'bg-orange-100 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800';
      case 'security':
        return 'bg-red-100 dark:bg-red-950/60 border-red-200 dark:border-red-800';
      default:
        return 'bg-indigo-100 dark:bg-indigo-950/60';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        
        {/* Knowledge Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100/90 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-800/80 shadow-sm">
          <span>{isEn ? 'Assessment & Practice' : 'Kiểm Tra & Luyện Tập'}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          {quiz.title || 'Trung tâm Quiz Blockchain'}
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          {quiz.subtitle || 'Ôn tập kiến thức blockchain qua 500+ câu hỏi trắc nghiệm, sau đó làm bài test 40 câu để đánh giá toàn diện năng lực.'}
        </p>

        {/* Review Wrong Questions Alert Banner (Strict to tests) */}
        {testMistakesCount > 0 && latestFailedTest && (
          <div className="pt-1">
            <Link
              href={`/quiz/review-wrong?testId=${latestFailedTest.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 hover:bg-amber-500/20 transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {isEn 
                  ? `You have ${testMistakesCount} incorrect questions from your latest test to review`
                  : `Bạn có ${testMistakesCount} câu làm sai trong bài thi gần nhất cần ôn tập lại`}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'practice'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEn ? 'Practice' : 'Ôn tập'}
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'test'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEn ? 'Take Test' : 'Làm bài Test'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Certification Test Box */}
      <SpotlightCard className="rounded-3xl p-8 sm:p-10 border border-indigo-100 dark:border-slate-800 bg-gradient-to-b from-white/90 to-purple-50/40 dark:from-slate-900/90 dark:to-[#0f1424]/90 shadow-xl shadow-purple-500/5 text-center space-y-4 max-w-4xl mx-auto" spotlightColor="rgba(99, 102, 241, 0.18)">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {isEn ? 'Comprehensive Certification Test' : 'Bài Test Tổng Hợp'}
        </h2>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {isEn 
            ? '40 randomized questions • 60 minutes • Comprehensive Blockchain evaluation'
            : '40 câu hỏi ngẫu nhiên • 60 phút • Đánh giá toàn diện kiến thức Blockchain'}
        </p>
        <div className="pt-2">
          <Link
            href="/quiz/test"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
          >
            <span>{isEn ? 'Start Test' : 'Bắt đầu bài Test'}</span>
          </Link>
        </div>
      </SpotlightCard>

      {/* Topics Section */}
      <div className="space-y-5">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
          {isEn ? 'Practice by Topic' : 'Ôn tập theo chủ đề'}
        </h2>

        {/* 3x3 Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {QUIZ_TOPICS.map((topic) => {
            const stats = topicStats[topic.slug] || { answered: 0, correct: 0 };
            const pct = topic.total_questions > 0 ? Math.round((stats.answered / topic.total_questions) * 100) : 0;

            return (
              <Link
                key={topic.slug}
                href={`/quiz/practice?topic=${topic.slug}`}
                className="block h-full"
              >
                <SpotlightCard className="h-full group rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10 transition-all relative flex flex-col justify-between" spotlightColor="rgba(99, 102, 241, 0.16)">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      {/* Icon & Title */}
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm ${getTopicBg(topic.slug)}`}>
                          {getTopicIcon(topic.slug)}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {topic.name_vn}
                        </h3>
                      </div>

                      {/* Circular Progress Badge */}
                      <div className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center">
                        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-200 dark:text-slate-800"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-indigo-600 dark:text-indigo-400 transition-all duration-700 ease-out"
                            strokeDasharray={`${pct}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {pct}%
                        </span>
                      </div>
                    </div>

                    {/* Difficulty Badges */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60">
                        {topic.easy_count} {isEn ? 'Easy' : 'Dễ'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                        {topic.medium_count} {isEn ? 'Med' : 'Vừa'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
                        {topic.hard_count} {isEn ? 'Hard' : 'Khó'}
                      </span>
                    </div>
                  </div>

                  {/* Answered / Correct Subtext */}
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {stats.answered > 0 ? (
                      <span>
                        {stats.answered}/{topic.total_questions} {isEn ? 'answered' : 'đã trả lời'} • {stats.correct}/{stats.answered} {isEn ? 'correct' : 'đúng'}
                      </span>
                    ) : (
                      <span>0/{topic.total_questions} {isEn ? 'answered' : 'đã trả lời'}</span>
                    )}
                  </div>
                </SpotlightCard>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Practice by Difficulty */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
          {isEn ? 'Practice by Difficulty' : 'Ôn tập theo mức độ'}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/quiz/practice?difficulty=easy"
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-cyan-600 hover:text-white dark:hover:bg-cyan-600 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
          >
            {isEn ? 'Easy' : 'Dễ'}
          </Link>
          <Link
            href="/quiz/practice?difficulty=medium"
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
          >
            {isEn ? 'Medium' : 'Vừa'}
          </Link>
          <Link
            href="/quiz/practice?difficulty=hard"
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
          >
            {isEn ? 'Hard' : 'Khó'}
          </Link>
          <Link
            href="/quiz/practice?difficulty=all"
            className="px-7 py-2.5 rounded-xl font-bold text-sm bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-200 dark:border-indigo-800 transition-all shadow-sm"
          >
            {isEn ? 'All 500 Questions' : 'Tất cả 500 câu'}
          </Link>
        </div>
      </div>

    </div>
  );
}
