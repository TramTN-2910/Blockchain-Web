import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
}

interface AuthState {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: UserProfile | null) => void;
  login: (email: string, role?: UserRole, name?: string) => void;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      isInitialized: false,

      setUser: (user) => set({ user, isLoggedIn: Boolean(user) }),

      login: (email: string, role: UserRole = 'user', name?: string) => {
        const displayName = name || (email.includes('@') ? email.split('@')[0] : email) || 'User';
        set({
          user: {
            email,
            name: displayName,
            role,
          },
          isLoggedIn: true,
        });
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.warn('Lỗi khi đăng xuất Supabase:', e);
        }
        set({ user: null, isLoggedIn: false });
      },

      initAuth: async () => {
        if (get().isInitialized) return;
        set({ isLoading: true });

        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const u = session.user;
            const email = u.email || '';
            
            // Query profile strictly from database
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, email, name, role, avatar_url')
              .eq('id', u.id)
              .single();

            const detectedRole: UserRole = profile?.role === 'admin' ? 'admin' : 'user';

            set({
              user: {
                id: u.id,
                email,
                name: profile?.name || (u.user_metadata?.name as string) || (email.includes('@') ? email.split('@')[0] : 'User'),
                role: detectedRole,
                avatar_url: profile?.avatar_url || u.user_metadata?.avatar_url,
              },
              isLoggedIn: true,
              isLoading: false,
              isInitialized: true,
            });
          } else {
            set({ isLoading: false, isInitialized: true });
          }

          // Listen to realtime auth state changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const u = session.user;
              const email = u.email || '';
              const { data: profile } = await supabase
                .from('profiles')
                .select('id, email, name, role, avatar_url')
                .eq('id', u.id)
                .single();

              const detectedRole: UserRole = profile?.role === 'admin' ? 'admin' : 'user';

              set({
                user: {
                  id: u.id,
                  email,
                  name: profile?.name || (u.user_metadata?.name as string) || (email.includes('@') ? email.split('@')[0] : 'User'),
                  role: detectedRole,
                  avatar_url: profile?.avatar_url || u.user_metadata?.avatar_url,
                },
                isLoggedIn: true,
              });
            } else if (event === 'SIGNED_OUT') {
              set({ user: null, isLoggedIn: false });
            }
          });
        } catch (err) {
          console.warn('Supabase auth initialization fallback:', err);
          set({ isLoading: false, isInitialized: true });
        }
      },
    }),
    {
      name: 'hubblock-auth-state',
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
);
