'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MAIN_NAVIGATION } from '@/data/navigationConfig';
import { useLanguageStore } from '@/store/useLanguageStore';

export default function HorizontalSubNav() {
  const pathname = usePathname();
  const { language } = useLanguageStore();

  const currentCategory = MAIN_NAVIGATION.find((cat) => pathname.startsWith(cat.basePath));

  if (!currentCategory || !currentCategory.subTabs || currentCategory.subTabs.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-1.5 shadow-xl mb-6 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 min-w-max">
        {currentCategory.subTabs.map((tab) => {
          const isActive = pathname === tab.path;

          return (
            <Link
              key={tab.id}
              href={tab.path}
              prefetch={true}
              className="relative group shrink-0"
            >
              <div
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
                  isActive
                    ? 'text-white font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId={`subnav-pill-${currentCategory.id}`}
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 rounded-xl shadow-lg shadow-purple-500/25 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span>{language === 'vi' ? tab.titleVi : tab.titleEn}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
