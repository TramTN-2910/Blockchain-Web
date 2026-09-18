import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question, QuizTopic } from '@/types/quiz';
import { ALL_QUESTIONS, QUIZ_TOPICS } from '@/data/quizQuestions';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  joinedAt: string;
  quizzesTaken: number;
  avgScore: number;
  lastActive: string;
}

export interface AdminAttempt {
  id: string;
  userId: string;
  userName: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  durationSeconds: number;
  completedAt: string;
}

const INITIAL_USERS: AdminUser[] = [
  {
    id: 'user-admin-1',
    name: 'HUB Block Master',
    email: 'admin@hubblock.edu.vn',
    role: 'admin',
    joinedAt: '2025-01-10',
    quizzesTaken: 28,
    avgScore: 96.5,
    lastActive: 'Vừa xong',
  },
  {
    id: 'user-2',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@hub.edu.vn',
    role: 'user',
    joinedAt: '2025-02-14',
    quizzesTaken: 12,
    avgScore: 84.0,
    lastActive: '2 giờ trước',
  },
  {
    id: 'user-3',
    name: 'Trần Thị Mai',
    email: 'mai.tran@hub.edu.vn',
    role: 'user',
    joinedAt: '2025-02-20',
    quizzesTaken: 8,
    avgScore: 78.5,
    lastActive: 'Hôm qua',
  },
  {
    id: 'user-4',
    name: 'Lê Hoàng Long',
    email: 'long.le@gmail.com',
    role: 'user',
    joinedAt: '2025-03-01',
    quizzesTaken: 15,
    avgScore: 90.0,
    lastActive: '3 ngày trước',
  },
  {
    id: 'user-5',
    name: 'Phạm Minh Đức',
    email: 'duc.pham@hub.edu.vn',
    role: 'user',
    joinedAt: '2025-03-05',
    quizzesTaken: 4,
    avgScore: 65.0,
    lastActive: '5 ngày trước',
  },
];

const INITIAL_ATTEMPTS: AdminAttempt[] = [
  {
    id: 'att-1',
    userId: 'user-2',
    userName: 'Nguyễn Văn An',
    quizTitle: 'Đề thi trắc nghiệm tổng hợp 40 câu',
    score: 36,
    totalQuestions: 40,
    passed: true,
    durationSeconds: 2450,
    completedAt: '18/09/2026 13:45',
  },
  {
    id: 'att-2',
    userId: 'user-4',
    userName: 'Lê Hoàng Long',
    quizTitle: 'Kiểm tra Hàm băm SHA-256 & Avalanche',
    score: 18,
    totalQuestions: 20,
    passed: true,
    durationSeconds: 1120,
    completedAt: '18/09/2026 11:20',
  },
  {
    id: 'att-3',
    userId: 'user-3',
    userName: 'Trần Thị Mai',
    quizTitle: 'Mật mã học RSA & Khóa công khai',
    score: 14,
    totalQuestions: 20,
    passed: false,
    durationSeconds: 1350,
    completedAt: '17/09/2026 16:30',
  },
  {
    id: 'att-4',
    userId: 'user-5',
    userName: 'Phạm Minh Đức',
    quizTitle: 'Độ khó đào & Cơ chế đồng thuận PoW',
    score: 11,
    totalQuestions: 15,
    passed: true,
    durationSeconds: 980,
    completedAt: '16/09/2026 09:15',
  },
];

interface AdminState {
  questions: Question[];
  topics: QuizTopic[];
  users: AdminUser[];
  attempts: AdminAttempt[];
  
  // Question Actions
  addQuestion: (question: Omit<Question, 'id'>) => Question;
  updateQuestion: (id: string, updated: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  bulkAddQuestions: (newQuestions: Omit<Question, 'id'>[]) => number;
  resetToDefaultQuestions: () => void;
  
  // Topic Actions (CRUD with safety check)
  addTopic: (newTopic: { name_vn: string; slug?: string; icon?: string }) => { success: boolean; topic?: QuizTopic; error?: string };
  updateTopic: (slug: string, updated: Partial<QuizTopic>) => { success: boolean; error?: string };
  deleteTopic: (slug: string) => { success: boolean; error?: string };
  resetToDefaultTopics: () => void;

  // User Actions
  updateUserRole: (userId: string, role: 'admin' | 'user') => void;
  deleteUser: (userId: string) => void;
  
  exportQuestionsJSON: () => string;
  importQuestionsJSON: (jsonString: string) => { success: boolean; count: number; error?: string };
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      questions: ALL_QUESTIONS,
      topics: QUIZ_TOPICS,
      users: INITIAL_USERS,
      attempts: INITIAL_ATTEMPTS,

      // QUESTIONS CRUD
      addQuestion: (newQ) => {
        const id = `q-admin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const createdQuestion: Question = {
          ...newQ,
          id,
        };
        set((state) => ({
          questions: [createdQuestion, ...state.questions],
        }));
        return createdQuestion;
      },

      updateQuestion: (id, updated) => {
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === id ? { ...q, ...updated } : q
          ),
        }));
      },

      deleteQuestion: (id) => {
        set((state) => ({
          questions: state.questions.filter((q) => q.id !== id),
        }));
      },

      bulkAddQuestions: (newQuestions) => {
        const createdQuestions: Question[] = newQuestions.map((q, index) => ({
          ...q,
          id: `q-ai-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
        }));
        set((state) => ({
          questions: [...createdQuestions, ...state.questions],
        }));
        return createdQuestions.length;
      },

      resetToDefaultQuestions: () => {
        set({ questions: ALL_QUESTIONS });
      },

      // TOPICS CRUD WITH SAFETY CONSTRAINT
      addTopic: (newTopic) => {
        const slug = newTopic.slug?.trim() || newTopic.name_vn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `topic-${Date.now()}`;
        
        // Check duplicate
        if (get().topics.some((t) => t.slug === slug)) {
          return { success: false, error: `Mã chủ đề (slug) '${slug}' đã tồn tại.` };
        }

        const topic: QuizTopic = {
          slug,
          name_vn: newTopic.name_vn.trim(),
          icon: newTopic.icon || 'BookOpen',
          total_questions: 0,
          easy_count: 0,
          medium_count: 0,
          hard_count: 0,
        };

        set((state) => ({
          topics: [...state.topics, topic],
        }));

        return { success: true, topic };
      },

      updateTopic: (slug, updated) => {
        set((state) => ({
          topics: state.topics.map((t) => (t.slug === slug ? { ...t, ...updated } : t)),
          // If name updated, also sync topic_name_vn in existing questions of this topic
          questions: updated.name_vn
            ? state.questions.map((q) => (q.topic_slug === slug ? { ...q, topic_name_vn: updated.name_vn! } : q))
            : state.questions,
        }));
        return { success: true };
      },

      deleteTopic: (slug) => {
        const questionsInTopic = get().questions.filter((q) => q.topic_slug === slug);
        if (questionsInTopic.length > 0) {
          return {
            success: false,
            error: `Không thể xóa chủ đề này vì đang có ${questionsInTopic.length} câu hỏi thuộc chủ đề. Vui lòng chuyển hoặc xóa các câu hỏi trước khi xóa chủ đề.`,
          };
        }

        set((state) => ({
          topics: state.topics.filter((t) => t.slug !== slug),
        }));

        return { success: true };
      },

      resetToDefaultTopics: () => {
        set({ topics: QUIZ_TOPICS });
      },

      // USERS
      updateUserRole: (userId, role) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, role } : u)),
        }));
      },

      deleteUser: (userId) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
        }));
      },

      // JSON IMPORT / EXPORT
      exportQuestionsJSON: () => {
        const data = get().questions;
        return JSON.stringify(data, null, 2);
      },

      importQuestionsJSON: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          if (!Array.isArray(parsed)) {
            return { success: false, count: 0, error: 'Dữ liệu JSON không phải là mảng câu hỏi hợp lệ.' };
          }
          const validQuestions: Question[] = parsed.filter(
            (item) => item.question_vn && Array.isArray(item.options) && item.options.length >= 2
          );

          if (validQuestions.length === 0) {
            return { success: false, count: 0, error: 'Không tìm thấy câu hỏi hợp lệ trong tệp JSON.' };
          }

          set((state) => ({
            questions: [...validQuestions, ...state.questions],
          }));

          return { success: true, count: validQuestions.length };
        } catch (e: any) {
          return { success: false, count: 0, error: e.message || 'Lỗi phân tích cú pháp JSON.' };
        }
      },
    }),
    {
      name: 'hubblock-admin-store',
    }
  )
);
