'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if user is logged in with admin role
  if (!isLoggedIn || user?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <div className="glass-card p-8 text-center space-y-6 shadow-2xl border-l-4 border-l-red-500">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center shadow-lg shadow-red-500/20">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Quyền Truy Cập Bị Từ Chối
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Trang Quản trị Admin yêu cầu đăng nhập tài khoản có vai trò <strong className="text-purple-600 dark:text-purple-400">Admin (role: admin)</strong>.
              {isLoggedIn ? (
                <span> Bạn đang đăng nhập với tài khoản <strong className="text-slate-800 dark:text-slate-200">{user?.email}</strong> (Role: {user?.role}).</span>
              ) : (
                <span> Hiện tại bạn chưa đăng nhập tài khoản.</span>
              )}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập Tài khoản Role Admin</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Trang Chủ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
