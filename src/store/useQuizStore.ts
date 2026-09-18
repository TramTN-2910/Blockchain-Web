import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question, UserAnswer, WrongQuestionItem, TestResult } from '@/types/quiz';

interface QuizState {
  // Current active test state
  currentQuizId: string | null;
  answers: Record<string, string[]>; // questionId -> array of selected optionIds
  timeRemainingSeconds: number;
  testQuestions: Question[];
  
  // Last completed test result
  lastTestResult: TestResult | null;

  // Complete history of all taken tests
  testHistory: TestResult[];

  // Topic practice statistics: topicSlug -> { answered: number, correct: number }
  topicStats: Record<string, { answered: number; correct: number }>;

  // Wrong questions review queue (Spaced Repetition / Review Wrong)
  wrongQueue: Record<string, WrongQuestionItem>; // questionId -> item

  // Actions
  selectAnswer: (questionId: string, optionId: string, isMultiple?: boolean) => void;
  resetAnswers: () => void;
  setTimeRemaining: (seconds: number) => void;
  setTestQuestions: (questions: Question[]) => void;
  saveTestResult: (result: TestResult) => void;
  clearTestResult: () => void;
  deleteTestFromHistory: (id: string) => void;
  clearTestHistory: () => void;
  
  // Practice topic stats
  recordPracticeAnswer: (topicSlug: string, isCorrect: boolean) => void;

  // Wrong queue management
  recordAttemptResults: (questions: Question[], answers: Record<string, string[]>) => void;
  markAsMastered: (questionId: string) => void;
  clearWrongQueue: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentQuizId: null,
      answers: {},
      timeRemainingSeconds: 3600, // 60 minutes
      testQuestions: [],
      lastTestResult: null,
      testHistory: [],
      topicStats: {
        mining: { answered: 8, correct: 1 }, // Default seed matching UI demo
      },
      wrongQueue: {},

      selectAnswer: (questionId, optionId, isMultiple = false) => {
        set((state) => {
          const currentSelected = state.answers[questionId] || [];
          let updated: string[];

          if (isMultiple) {
            if (currentSelected.includes(optionId)) {
              updated = currentSelected.filter((id) => id !== optionId);
            } else {
              updated = [...currentSelected, optionId];
            }
          } else {
            updated = [optionId];
          }

          return {
            answers: {
              ...state.answers,
              [questionId]: updated,
            },
          };
        });
      },

      resetAnswers: () => set({ answers: {}, timeRemainingSeconds: 3600 }),
      setTimeRemaining: (seconds) => set({ timeRemainingSeconds: seconds }),
      setTestQuestions: (questions) => set({ testQuestions: questions }),
      
      saveTestResult: (result) => {
        // Save locally in Zustand state
        set((state) => {
          const existingHistory = state.testHistory || [];
          const filtered = existingHistory.filter((h) => h.id !== result.id);
          return {
            lastTestResult: result,
            testHistory: [result, ...filtered],
          };
        });

        // Asynchronously sync to Supabase if user is logged in
        import('@/lib/supabase/questions').then(({ saveTestResultToSupabase }) => {
          saveTestResultToSupabase(result).catch((err) => {
            console.warn('Lỗi đồng bộ bài thi lên Supabase:', err);
          });
        });
      },

      clearTestResult: () => set({ lastTestResult: null }),

      deleteTestFromHistory: (id) => {
        set((state) => ({
          testHistory: (state.testHistory || []).filter((t) => t.id !== id),
          lastTestResult: state.lastTestResult?.id === id ? null : state.lastTestResult,
        }));
      },

      clearTestHistory: () => set({ testHistory: [], lastTestResult: null }),

      recordPracticeAnswer: (topicSlug, isCorrect) => {
        set((state) => {
          const current = state.topicStats[topicSlug] || { answered: 0, correct: 0 };
          return {
            topicStats: {
              ...state.topicStats,
              [topicSlug]: {
                answered: current.answered + 1,
                correct: current.correct + (isCorrect ? 1 : 0),
              },
            },
          };
        });
      },

      recordAttemptResults: (questions, userAnswers) => {
        set((state) => {
          const updatedQueue = { ...state.wrongQueue };

          questions.forEach((q) => {
            const selected = userAnswers[q.id] || [];
            const correctOptionIds = q.options
              .filter((opt) => opt.is_correct)
              .map((opt) => opt.id);

            // Check if user answer matches correct options exactly
            const isCorrect =
              selected.length === correctOptionIds.length &&
              selected.every((id) => correctOptionIds.includes(id));

            if (!isCorrect) {
              const existing = updatedQueue[q.id];
              updatedQueue[q.id] = {
                question_id: q.id,
                question: q,
                wrong_count: (existing?.wrong_count || 0) + 1,
                last_wrong_at: new Date().toISOString(),
                is_mastered: false,
              };
            }
          });

          return { wrongQueue: updatedQueue };
        });
      },

      markAsMastered: (questionId) => {
        set((state) => {
          const updated = { ...state.wrongQueue };
          if (updated[questionId]) {
            updated[questionId].is_mastered = true;
          }
          return { wrongQueue: updated };
        });
      },

      clearWrongQueue: () => set({ wrongQueue: {} }),
    }),
    { name: 'hubblock-quiz-state' }
  )
);
