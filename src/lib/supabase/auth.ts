import { supabase } from './client';
import { UserRole, UserProfile } from '@/store/useAuthStore';

/**
 * Fetch profile data (role, name, avatar) for a user from Supabase 'profiles' table
 */
export async function getSupabaseUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name, role, avatar_url')
      .eq('id', userId)
      .single();

    if (error || !data) {
      // If table doesn't have the row yet, fallback to user metadata
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const u = userData.user;
        const email = u.email || '';
        const name = (u.user_metadata?.name as string) || (email.includes('@') ? email.split('@')[0] : 'User');
        return {
          id: u.id,
          email,
          name,
          role: 'user', // Default safe role
          avatar_url: u.user_metadata?.avatar_url,
        };
      }
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name || (data.email.includes('@') ? data.email.split('@')[0] : 'User'),
      role: (data.role === 'admin' ? 'admin' : 'user') as UserRole,
      avatar_url: data.avatar_url,
    };
  } catch (err) {
    console.error('Lỗi khi tải thông tin Profile từ Supabase:', err);
    return null;
  }
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmailPassword(email: string, password: string): Promise<{ user: UserProfile | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Không tìm thấy thông tin người dùng.' };
    }

    const profile = await getSupabaseUserProfile(data.user.id);
    return {
      user: profile || {
        id: data.user.id,
        email: data.user.email || email,
        name: (data.user.user_metadata?.name as string) || email.split('@')[0],
        role: 'user',
      },
      error: null,
    };
  } catch (err: any) {
    return { user: null, error: err?.message || 'Đã xảy ra lỗi không xác định khi đăng nhập.' };
  }
}

/**
 * Sign up a new user with Email, Password and Name
 */
export async function signUpWithEmailPassword(email: string, password: string, name: string): Promise<{ success: boolean; error: string | null; needEmailVerification: boolean }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    });

    if (error) {
      return { success: false, error: error.message, needEmailVerification: false };
    }

    // Check if email confirmation is required
    const needEmailVerification = data.user && !data.session;

    return {
      success: true,
      error: null,
      needEmailVerification: Boolean(needEmailVerification),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Đã xảy ra lỗi khi tạo tài khoản.', needEmailVerification: false };
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogleOAuth(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
      },
    });

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err: any) {
    return { error: err?.message || 'Lỗi kết nối Google OAuth.' };
  }
}

/**
 * Sign out current user
 */
export async function signOutSupabase(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Lỗi khi đăng xuất Supabase:', err);
  }
}
