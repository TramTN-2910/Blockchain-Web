import { supabase } from './client';
import { Question, QuizTopic, TestResult } from '@/types/quiz';
import { ALL_QUESTIONS, QUIZ_TOPICS } from '@/data/quizQuestions';

/**
 * Fetch all questions or filter by topic slug
 */
export async function getQuestionsFromSupabase(topicSlug?: string): Promise<Question[]> {
  try {
    let query = supabase.from('questions').select('*');
    if (topicSlug && topicSlug !== 'all') {
      query = query.eq('topic_slug', topicSlug);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      // Fallback to local questions if Supabase is empty or offline
      return topicSlug && topicSlug !== 'all'
        ? ALL_QUESTIONS.filter((q) => q.topic_slug === topicSlug)
        : ALL_QUESTIONS;
    }
    return data as Question[];
  } catch (err) {
    console.warn('Lỗi kết nối Supabase questions, sử dụng dữ liệu cục bộ:', err);
    return ALL_QUESTIONS;
  }
}

/**
 * Fetch topics from Supabase
 */
export async function getTopicsFromSupabase(): Promise<QuizTopic[]> {
  try {
    const { data, error } = await supabase.from('topics').select('*').order('created_at', { ascending: true });
    if (error || !data || data.length === 0) {
      return QUIZ_TOPICS;
    }
    return data as QuizTopic[];
  } catch (err) {
    console.warn('Lỗi kết nối Supabase topics, sử dụng dữ liệu cục bộ:', err);
    return QUIZ_TOPICS;
  }
}

/**
 * Add a new question to Supabase
 */
export async function addQuestionToSupabase(question: Omit<Question, 'id'>): Promise<{ question: Question | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert([question])
      .select()
      .single();

    if (error) {
      return { question: null, error: error.message };
    }
    return { question: data as Question, error: null };
  } catch (err: any) {
    return { question: null, error: err?.message || 'Lỗi thêm câu hỏi.' };
  }
}

/**
 * Bulk add questions (used for AI generator import)
 */
export async function bulkAddQuestionsToSupabase(questions: Omit<Question, 'id'>[]): Promise<{ count: number; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert(questions)
      .select();

    if (error) {
      return { count: 0, error: error.message };
    }
    return { count: data?.length || 0, error: null };
  } catch (err: any) {
    return { count: 0, error: err?.message || 'Lỗi thêm danh sách câu hỏi.' };
  }
}

/**
 * Delete a question from Supabase
 */
export async function deleteQuestionFromSupabase(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Lỗi xóa câu hỏi.' };
  }
}

/**
 * Save test result for logged in user
 */
export async function saveTestResultToSupabase(result: TestResult, userId?: string): Promise<boolean> {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const { data } = await supabase.auth.getUser();
      targetUserId = data.user?.id;
    }

    if (!targetUserId) return false;

    const { error } = await supabase.from('test_results').insert([
      {
        user_id: targetUserId,
        total_questions: result.total_questions,
        correct_count: result.correct_count,
        score_percentage: result.score_percentage,
        passed: result.passed,
        time_spent_seconds: result.time_spent_seconds,
        answers: result.answers,
        questions: result.questions,
      },
    ]);

    if (error) {
      console.warn('Không thể lưu kết quả thi lên Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Lỗi lưu kết quả thi:', err);
    return false;
  }
}

/**
 * Seed initial sample questions to Supabase if empty
 */
export async function seedInitialQuestionsToSupabase(): Promise<{ inserted: number; error: string | null }> {
  try {
    // 1. Seed topics first
    const { error: topicErr } = await supabase
      .from('topics')
      .upsert(
        QUIZ_TOPICS.map((t) => ({
          slug: t.slug,
          name_vn: t.name_vn,
          icon: t.icon,
        }))
      );

    if (topicErr) {
      return { inserted: 0, error: `Lỗi đồng bộ chủ đề: ${topicErr.message}` };
    }

    // 2. Seed questions
    const formatted = ALL_QUESTIONS.map(({ id, ...rest }) => rest);
    const { data, error: qErr } = await supabase.from('questions').insert(formatted).select();

    if (qErr) {
      return { inserted: 0, error: `Lỗi đồng bộ câu hỏi: ${qErr.message}` };
    }

    return { inserted: data?.length || 0, error: null };
  } catch (err: any) {
    return { inserted: 0, error: err?.message || 'Lỗi seed dữ liệu.' };
  }
}
