'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeStore } from '@/store/useThemeStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { 
  Moon, 
  Sun, 
  Globe, 
  ShieldCheck, 
  Menu, 
  X, 
  Sparkles, 
  LogIn, 
  LogOut, 
  User, 
  ChevronDown,
  Home,
  Binary,
  Pickaxe,
  KeyRound,
  HelpCircle,
  Layers,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Classic } from '@theme-toggles/react';
import '@theme-toggles/react/styles/classic.css';

interface DesktopNavLinkProps {
  id: string;
  href: string;
  label: string;
  isActive: boolean;
}

const DesktopNavLink = React.memo(function DesktopNavLink({
  href,
  label,
  isActive,
}: DesktopNavLinkProps) {
  return (
    <Link
      href={href}
      prefetch={true}
      className="relative px-3.5 py-1.5 rounded-full text-xs lg:text-[13px] font-semibold whitespace-nowrap leading-none flex items-center justify-center transition-colors"
    >
      {isActive && (
        <motion.div
          layoutId="header-active-pill"
          className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-md shadow-indigo-500/25"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
      <span
        className={`relative z-10 transition-colors ${
          isActive
            ? 'text-white font-bold'
            : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}
      >
        {label}
      </span>
    </Link>
  );
});

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useThemeStore();
  const { language, toggleLanguage } = useLanguageStore();
  const { user, isLoggedIn, logout, initAuth } = useAuthStore();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    setMobileMenuOpen(false);
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

  const getActiveModule = (path: string) => {
    if (path.startsWith('/hash')) return 'hash';
    if (path.startsWith('/mining')) return 'mining';
    if (path.startsWith('/rsa')) return 'rsa';
    if (path.startsWith('/quiz')) return 'quiz';
    if (path.startsWith('/project')) return 'project';
    if (path.startsWith('/team')) return 'team';
    if (path === '/') return 'home';
    return '';
  };

  const activeModule = getActiveModule(pathname);

  const navLinks = React.useMemo(() => [
    { id: 'home', href: '/', label: t.nav.home, icon: Home },
    { id: 'hash', href: '/hash/interaction', label: t.nav.hash, icon: Binary },
    { id: 'mining', href: '/mining/theory', label: t.nav.mining, icon: Pickaxe },
    { id: 'rsa', href: '/rsa/theory', label: t.nav.rsa, icon: KeyRound },
    { id: 'quiz', href: '/quiz', label: t.nav.quiz, icon: HelpCircle },
    { id: 'project', href: '/project', label: t.nav.project, icon: Layers },
    { id: 'team', href: '/team', label: t.nav.team, icon: Users },
  ], [t]);

  if (!mounted) return null;

  const isAdmin = isLoggedIn && user?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 dark:bg-[#0b0f19]/85 border-b border-purple-100/50 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo Brand Group */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight gradient-text">
              HubBlock
            </span>
          </Link>

          {/* Desktop Navigation Links Container (Visible on lg and above) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-800/60 shadow-inner overflow-x-auto no-scrollbar">
            {navLinks.map((link) => (
              <DesktopNavLink
                key={link.id}
                id={link.id}
                href={link.href}
                label={link.label}
                isActive={activeModule === link.id}
              />
            ))}
          </nav>

          {/* Controls & System Actions Cluster */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            
            {/* Desktop Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{language === 'vi' ? 'GB EN' : 'VN VI'}</span>
            </button>

            {/* Desktop Dark/Light Mode Toggle (@theme-toggles/react) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark/Light Mode"
              className="hidden sm:flex items-center justify-center p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all text-xl cursor-pointer"
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
                  aria-expanded={userDropdownOpen}
                  aria-label="User menu"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold uppercase shadow-sm flex-shrink-0">
                    {user?.name ? user.name.charAt(0) : (user?.email?.charAt(0) || 'U')}
                  </div>
                  <span className="max-w-[90px] sm:max-w-[110px] truncate font-medium text-xs">
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                  {user?.role === 'admin' && (
                    <span className="bg-purple-500/15 text-purple-600 dark:text-purple-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase border border-purple-500/30 hidden sm:inline-block">
                      Admin
                    </span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-950/20 dark:shadow-black/60 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Info Header */}
                    <div className="px-3 py-2.5 mb-1 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20">
                          {user?.name ? user.name.charAt(0) : (user?.email?.charAt(0) || 'U')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                            {user?.name || (user?.role === 'admin' ? (t.nav?.role_admin || 'Admin') : (t.nav?.role_user || 'User'))}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      {user?.role === 'admin' && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">{t.header?.role_label || 'Vai trò:'}</span>
                          <span className="inline-flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400">
                            <Sparkles className="w-3 h-3" /> {t.nav?.role_admin || 'Admin'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Navigation Actions */}
                    <div className="space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                        <span>{t.nav?.profile || 'Hồ sơ cá nhân'}</span>
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span>{t.nav?.admin_portal || 'Trang Quản trị Admin'}</span>
                        </Link>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.nav?.logout || 'Đăng xuất'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.nav?.login || 'Đăng nhập'}</span>
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle Button (Visible below lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/60 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Glassmorphism Drawer with Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden border-t border-purple-100/50 dark:border-slate-800/80 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-2xl shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-3.5">
              
              {/* Navigation Links Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {navLinks.map((link) => {
                  const isActive = activeModule === link.id;
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.id}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-indigo-500'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Bottom utility row: Language, Theme, Profile/Login/Admin */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col gap-2.5">
                
                {/* Mobile Quick Switch Row (Language & Theme) */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={toggleLanguage}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all"
                  >
                    <Globe className="w-4 h-4 text-indigo-500" />
                    <span>{language === 'vi' ? 'Tiếng Việt (VI)' : 'English (EN)'}</span>
                  </button>

                  <button
                    onClick={toggleTheme}
                    aria-label="Toggle Dark/Light Mode"
                    className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                  </button>
                </div>

                {/* Mobile Auth actions */}
                {isLoggedIn ? (
                  <div className="space-y-1.5 pt-1">
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <User className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="truncate">{user?.name || user?.email}</span>
                      </div>
                      {isAdmin && (
                        <span className="bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-purple-500/30 shrink-0">
                          Admin
                        </span>
                      )}
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{t.nav?.admin_portal || 'Trang Quản trị Admin'}</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.nav?.logout || 'Đăng xuất'}</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t.nav?.login || 'Đăng nhập'}</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
