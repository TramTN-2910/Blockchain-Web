'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeStore } from '@/store/useThemeStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useMobileSidebarStore } from '@/store/useMobileSidebarStore';
import {
  Moon,
  Sun,
  Globe,
  ShieldCheck,
  Sparkles,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  HelpCircle,
  Shield,
  LayoutDashboard,
  Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Classic } from '@theme-toggles/react';
import '@theme-toggles/react/styles/classic.css';

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useThemeStore();
  const { language, toggleLanguage } = useLanguageStore();
  const { user, isLoggedIn, logout, initAuth } = useAuthStore();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setUserDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    initAuth();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, initAuth]);

  const { toggleSidebar } = useMobileSidebarStore();

  if (!mounted) return null;

  const isAdmin = isLoggedIn && user?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/85 dark:bg-[#0b0f19]/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: Mobile Hamburger & Logo Brand Group */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/intro/overview" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight gradient-text">
                  HubBlock
                </span>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 -mt-1 hidden sm:inline">
                  Blockchain Simulation Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Controls & System Actions Cluster */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            
            {/* Admin Shortcut if Admin Role */}
            {isAdmin && (
              <Link
                href="/admin"
                prefetch={true}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  pathname.startsWith('/admin')
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{language === 'vi' ? 'GB EN' : 'VN VI'}</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark/Light Mode"
              className="flex items-center justify-center p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all text-xl cursor-pointer"
            >
              <Classic
                toggled={theme === 'dark'}
                onToggle={() => {}}
                duration={750}
                aria-label="Toggle Dark/Light Mode"
                className="theme-toggle pointer-events-none"
              />
            </button>

            {/* Auth Section with Dropdown */}
            {isLoggedIn ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    userDropdownOpen
                      ? 'bg-indigo-50 dark:bg-slate-800 border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[80px] truncate font-medium hidden sm:inline">
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {user?.name || 'Học viên'}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          prefetch={true}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{language === 'vi' ? 'Hồ sơ cá nhân' : 'My Profile'}</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            prefetch={true}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 font-semibold transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            <span>{language === 'vi' ? 'Trang Quản trị Admin' : 'Admin Dashboard'}</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{language === 'vi' ? 'Đăng xuất' : 'Log Out'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                prefetch={true}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white shadow-md shadow-indigo-500/20 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Đăng nhập' : 'Log In'}</span>
              </Link>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
