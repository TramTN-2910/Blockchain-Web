'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { signInWithEmailPassword, signUpWithEmailPassword, signInWithGoogleOAuth, sendPasswordResetEmail } from '@/lib/supabase/auth';
import {
  ShieldCheck,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  UserCheck,
  Sparkles,
  LogOut,
  AlertCircle,
  Loader2,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { user, isLoggedIn, logout } = useAuthStore();
  const { language } = useLanguageStore();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage(language === 'vi' ? 'Vui lòng nhập địa chỉ Email.' : 'Please enter your email address.');
      return;
    }

    setLoading(true);
    const res = await sendPasswordResetEmail(email);
    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage(
        language === 'vi'
          ? 'Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!'
          : 'Password reset link has been sent to your email. Please check your inbox!'
      );
    }
  };

  // Handle Sign In / Sign Up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === 'forgot') {
      return handleForgotPassword(e);
    }

    if (!email || !password) {
      setErrorMessage(language === 'vi' ? 'Vui lòng nhập đầy đủ Email và Mật khẩu.' : 'Please enter both Email and Password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage(language === 'vi' ? 'Vui lòng nhập họ và tên của bạn.' : 'Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage(language === 'vi' ? 'Mật khẩu cần tối thiểu 6 ký tự.' : 'Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage(language === 'vi' ? 'Mật khẩu xác nhận không khớp.' : 'Confirm password does not match.');
        return;
      }

      setLoading(true);
      const res = await signUpWithEmailPassword(email, password, name);
      setLoading(false);

      if (res.error) {
        setErrorMessage(res.error);
        return;
      }

      if (res.needEmailVerification) {
        setSuccessMessage(
          language === 'vi'
            ? 'Đăng ký thành công! Vui lòng kiểm tra hộp thư Email để xác nhận tài khoản.'
            : 'Registration successful! Please check your email inbox to verify your account.'
        );
      } else {
        setSuccessMessage(
          language === 'vi'
            ? 'Tạo tài khoản thành công! Đang tự động đăng nhập...'
            : 'Account created successfully! Logging you in...'
        );
        setTimeout(() => {
          router.push(redirectUrl || '/profile');
        }, 1200);
      }
      return;
    }

    // Sign In Mode
    setLoading(true);
    const res = await signInWithEmailPassword(email, password);
    setLoading(false);

    if (res.error) {
      setErrorMessage(
        res.error === 'Invalid login credentials'
          ? (language === 'vi' ? 'Email hoặc mật khẩu không chính xác.' : 'Invalid email or password.')
          : res.error
      );
      return;
    }

    if (res.user) {
      if (res.user.role === 'admin') {
        router.push(redirectUrl || '/admin');
      } else {
        router.push(redirectUrl || '/profile');
      }
    }
  };

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    const { error } = await signInWithGoogleOAuth();
    setLoading(false);
    if (error) {
      setErrorMessage(language === 'vi' ? `Lỗi đăng nhập Google: ${error}` : `Google login error: ${error}`);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 sm:py-16 px-4">
      <SpotlightCard className="glass-card p-6 sm:p-8 space-y-6 shadow-2xl" spotlightColor="rgba(99, 102, 241, 0.16)">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {isLoggedIn
              ? (language === 'vi' ? 'Tài Khoản Đã Đăng Nhập' : 'Account Logged In')
              : mode === 'signin'
              ? (language === 'vi' ? 'Đăng Nhập HubBlock' : 'Log In to HubBlock')
              : mode === 'signup'
              ? (language === 'vi' ? 'Đăng Ký Tài Khoản' : 'Create an Account')
              : (language === 'vi' ? 'Khôi Phục Mật Khẩu' : 'Reset Password')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isLoggedIn
              ? (language === 'vi' ? 'Bạn đang truy cập hệ thống với thông tin tài khoản bên dưới.' : 'You are signed in with the active account details below.')
              : mode === 'signin'
              ? (language === 'vi' ? 'Chào mừng quay trở lại! Nhập thông tin để tiếp tục học tập.' : 'Welcome back! Enter credentials to access your simulations.')
              : mode === 'signup'
              ? (language === 'vi' ? 'Tạo tài khoản mới để lưu tiến độ trắc nghiệm và lịch sử học tập.' : 'Sign up to track your quiz progress and certification history.')
              : (language === 'vi' ? 'Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.' : 'Enter your registered email to receive a password reset link.')}
          </p>
        </div>

        {/* Logged in state view */}
        {isLoggedIn ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
            <UserCheck className="w-10 h-10 text-emerald-500 mx-auto" />
            <div className="space-y-1">
              <div className="font-bold text-slate-900 dark:text-slate-100 text-base">{user?.name}</div>
              <p className="text-xs text-slate-500 font-mono">{user?.email}</p>
              <div className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-600 dark:text-purple-300">
                {language === 'vi' ? 'Vai trò:' : 'Role:'}{' '}
                {user?.role === 'admin'
                  ? (language === 'vi' ? 'Quản Trị Viên (Admin)' : 'Administrator')
                  : (language === 'vi' ? 'Học Viên (Student)' : 'Student / Researcher')}
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {user?.role === 'admin' ? (
                <Link
                  href="/admin"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 text-xs shadow-md shadow-purple-500/25 hover:opacity-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{language === 'vi' ? 'Vào Trang Quản Trị Admin' : 'Enter Admin Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/profile"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 text-xs shadow-md hover:bg-indigo-700 transition-all"
                >
                  <span>{language === 'vi' ? 'Xem Hồ Sơ & Lịch Sử Thi' : 'View Profile & Test History'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <button
                onClick={() => logout()}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Đăng xuất tài khoản' : 'Log Out Account'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* Mode Switcher Tabs (Sign In / Sign Up) */}
            {mode !== 'forgot' ? (
              <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    mode === 'signin'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {language === 'vi' ? 'Đăng Nhập' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {language === 'vi' ? 'Đăng Ký' : 'Sign Up'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Quay lại Đăng nhập' : 'Back to Sign In'}</span>
              </button>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full name input for sign up */}
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                    {language === 'vi' ? 'Họ và Tên' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                  {language === 'vi' ? 'Địa Chỉ Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Password */}
              {mode !== 'forgot' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                      {language === 'vi' ? 'Mật Khẩu' : 'Password'}
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMessage(null);
                          setSuccessMessage(null);
                        }}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        {language === 'vi' ? 'Quên mật khẩu?' : 'Forgot password?'}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* Confirm Password (Sign up only) */}
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                    {language === 'vi' ? 'Xác Nhận Mật Khẩu' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* Remember me (Sign in only) */}
              {mode === 'signin' && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{language === 'vi' ? 'Ghi nhớ đăng nhập' : 'Remember me'}</span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl font-bold text-white shadow-lg text-xs sm:text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'vi' ? 'Đang xử lý...' : 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === 'signin'
                        ? (language === 'vi' ? 'Đăng Nhập' : 'Sign In')
                        : mode === 'signup'
                        ? (language === 'vi' ? 'Tạo Tài Khoản' : 'Create Account')
                        : (language === 'vi' ? 'Gửi Yêu Cầu Đặt Lại' : 'Send Reset Link')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            {mode !== 'forgot' && (
              <>
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[11px] font-medium text-slate-400">
                    {language === 'vi' ? 'Hoặc tiếp tục với' : 'Or continue with'}
                  </span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                </div>

                {/* Google OAuth Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer disabled:opacity-70"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.54 0 2.89.55 3.93 1.45l2.94-2.94C17.09 1.83 14.73 1 12 1 7.42 1 3.53 3.61 1.7 7.39l3.52 2.73C6.09 7.39 8.8 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.71-4.92 3.71-8.7z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.22 14.88c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09L1.7 7.97C.62 10.12 0 12.49 0 15s.62 4.88 1.7 7.03l3.52-2.73z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.07.72-2.45 1.16-4.22 1.16-3.2 0-5.91-2.39-6.78-5.12L1.7 15.98C3.53 19.76 7.42 23 12 23z"
                    />
                  </svg>
                  <span>{language === 'vi' ? 'Đăng nhập với Google' : 'Continue with Google'}</span>
                </button>
              </>
            )}
          </div>
        )}
      </SpotlightCard>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
