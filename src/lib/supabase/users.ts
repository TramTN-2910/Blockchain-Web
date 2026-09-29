import { supabase } from './client';
import { AdminUser, AdminAttempt } from '@/store/useAdminStore';

/**
 * Fetch all user profiles and compute statistics from test_results
 */
export async function getUsersFromSupabase(): Promise<AdminUser[]> {
  try {
    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('id, name, email, role, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (profError || !profiles || profiles.length === 0) {
      return [];
    }

    // Also fetch test_results to calculate quizzesTaken & avgScore
    const { data: testResults } = await supabase
      .from('test_results')
      .select('user_id, score_percentage, created_at');

    const users: AdminUser[] = profiles.map((p) => {
      const userTests = (testResults || []).filter((t) => t.user_id === p.id);
      const quizzesTaken = userTests.length;
      const avgScore =
        quizzesTaken > 0
          ? Math.round(
              (userTests.reduce((acc, curr) => acc + (curr.score_percentage || 0), 0) / quizzesTaken) * 10
            ) / 10
          : 0;

      // Calculate last active from updated_at or test_results
      const lastTest = userTests.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      const lastActiveDate = lastTest?.created_at || p.updated_at || p.created_at;
      const formattedDate = lastActiveDate ? new Date(lastActiveDate).toLocaleDateString('vi-VN') : 'Vừa xong';
      const joinedDate = p.created_at ? new Date(p.created_at).toLocaleDateString('vi-VN') : 'Mới tạo';

      return {
        id: p.id,
        name: p.name || (p.email ? p.email.split('@')[0] : 'User'),
        email: p.email || '',
        role: (p.role === 'admin' ? 'admin' : 'user') as 'admin' | 'user',
        joinedAt: joinedDate,
        quizzesTaken,
        avgScore,
        lastActive: formattedDate,
      };
    });

    return users;
  } catch (err) {
    console.error('Lỗi khi tải danh sách người dùng từ Supabase:', err);
    return [];
  }
}

/**
 * Update user role in Supabase profiles table
 */
export async function updateUserRoleInSupabase(
  userId: string,
  role: 'admin' | 'user'
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Lỗi cập nhật vai trò người dùng.' };
  }
}

/**
 * Fetch all test attempts from test_results
 */
export async function getAttemptsFromSupabase(): Promise<AdminAttempt[]> {
  try {
    const { data: results, error } = await supabase
      .from('test_results')
      .select('id, user_id, total_questions, correct_count, score_percentage, passed, time_spent_seconds, created_at')
      .order('created_at', { ascending: false });

    if (error || !results || results.length === 0) {
      return [];
    }

    // Get profiles for names
    const { data: profiles } = await supabase.from('profiles').select('id, name, email');
    const profileMap = new Map((profiles || []).map((p) => [p.id, p.name || p.email]));

    return results.map((r) => ({
      id: String(r.id),
      userId: r.user_id,
      userName: profileMap.get(r.user_id) || 'Học viên',
      quizTitle: 'Bài kiểm tra tổng hợp Blockchain',
      score: r.correct_count,
      totalQuestions: r.total_questions,
      passed: r.passed,
      durationSeconds: r.time_spent_seconds,
      completedAt: new Date(r.created_at).toLocaleString('vi-VN'),
    }));
  } catch (err) {
    console.error('Lỗi khi tải danh sách kết quả bài thi:', err);
    return [];
  }
}
