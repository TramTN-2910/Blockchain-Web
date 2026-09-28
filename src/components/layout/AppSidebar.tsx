'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MAIN_NAVIGATION } from '@/data/navigationConfig';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useMobileSidebarStore } from '@/store/useMobileSidebarStore';
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Layers,
  AlertTriangle,
  Network,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Shield,
  X,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Layers,
  AlertTriangle,
  Network,
  Users
};

export default function AppSidebar() {
  const pathname = usePathname();
  const { language } = useLanguageStore();
  const { isOpen: isMobileOpen, closeSidebar: closeMobileSidebar } = useMobileSidebarStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile sidebar on route changes
  useEffect(() => {
    closeMobileSidebar();
  }, [pathname, closeMobileSidebar]);

  if (!mounted) return null;

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 sticky top-16 h-[calc(100vh-4rem)] z-30 transition-all duration-300 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-xl ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header of Sidebar / Collapse Button */}
        <div className="flex items-center justify-between p-3.5 border-b border-slate-200/60 dark:border-slate-800/60">
          {!isCollapsed && (
            <div className="flex items-center gap-2 pl-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {language === 'vi' ? 'THANH ĐIỀU HƯỚNG' : 'NAVIGATION'}
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors mx-auto cursor-pointer"
            title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* 7 Main Navigation Categories */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-1.5">
          {MAIN_NAVIGATION.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || BookOpen;
            const isActive = pathname.startsWith(cat.basePath);

            return (
              <Link
                key={cat.id}
                href={cat.defaultSubPath}
                prefetch={true}
                className="relative group block"
              >
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all relative ${
                    isActive
                      ? 'text-white shadow-lg shadow-purple-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 rounded-2xl -z-10 shadow-md"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}

                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-purple-600 dark:text-purple-400 border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {!isCollapsed && (
                    <div className="overflow-hidden space-y-0.5">
                      <div className="truncate font-extrabold">
                        {language === 'vi' ? cat.titleVi : cat.titleEn}
                      </div>
                      <div className={`text-[10px] truncate ${isActive ? 'text-purple-200' : 'text-slate-400 dark:text-slate-500'}`}>
                        {cat.subTabs.length} {language === 'vi' ? 'chủ đề' : 'sub-tabs'}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Auxiliary Links */}
        <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1">
          <Link
            href="/quiz"
            prefetch={true}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all ${
              pathname.startsWith('/quiz') ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold' : ''
            }`}
          >
            <HelpCircle className="w-4 h-4 text-purple-500 shrink-0" />
            {!isCollapsed && <span>{language === 'vi' ? 'Thi & Ôn Tập (Quiz)' : 'Quiz & Assessment'}</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay & Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileSidebar}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-[#0b0f19] shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col z-10"
            >
              {/* Mobile Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center">
                    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[9px] flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <span className="font-extrabold text-base gradient-text">HubBlock</span>
                </div>
                <button
                  onClick={closeMobileSidebar}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items in Drawer */}
              <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1.5">
                {MAIN_NAVIGATION.map((cat) => {
                  const IconComponent = ICON_MAP[cat.icon] || BookOpen;
                  const isActive = pathname.startsWith(cat.basePath);

                  return (
                    <Link
                      key={cat.id}
                      href={cat.defaultSubPath}
                      prefetch={true}
                      onClick={closeMobileSidebar}
                      className="block"
                    >
                      <div
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-md'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-800/80 text-purple-600 dark:text-purple-400 border border-slate-200/60 dark:border-slate-700/60'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden space-y-0.5">
                          <div className="truncate font-extrabold">
                            {language === 'vi' ? cat.titleVi : cat.titleEn}
                          </div>
                          <div className={`text-[10px] truncate ${isActive ? 'text-purple-200' : 'text-slate-400 dark:text-slate-500'}`}>
                            {cat.subTabs.length} {language === 'vi' ? 'chủ đề' : 'sub-tabs'}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Quiz Link at Drawer bottom */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <Link
                  href="/quiz"
                  prefetch={true}
                  onClick={closeMobileSidebar}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    pathname.startsWith('/quiz')
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>{language === 'vi' ? 'Thi & Ôn Tập (Quiz)' : 'Quiz & Assessment'}</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
