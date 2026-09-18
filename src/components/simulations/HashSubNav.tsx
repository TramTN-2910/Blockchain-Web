'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function HashSubNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const subnav = t.hash_subnav || ({} as any);

  const tabs = [
    { href: '/hash/interaction', label: subnav.tab_interaction || 'Tương tác' },
    { href: '/hash/fixed-length', label: subnav.tab_fixed_length || 'Độ dài cố định' },
    { href: '/hash/avalanche', label: subnav.tab_avalanche || 'Avalanche' },
    { href: '/hash/explain', label: subnav.tab_explain || 'Giải thích' },
    { href: '/hash/merkle-tree', label: subnav.tab_merkle_tree || 'Cây Merkle' },
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* Title & Subtitle with Float Entrance Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="space-y-1"
      >
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {subnav.title || 'Mô Phỏng Hash SHA-256'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {subnav.subtitle || 'Trình diễn tương tác các tính chất mật mã học của hàm băm 256-bit trong Blockchain.'}
        </p>
      </motion.div>

      {/* Sliding Horizontal Navigation Pill Tabs (Text-only, Border hugging) */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
        className="w-full overflow-x-auto no-scrollbar -mx-1 px-1 py-1"
      >
        <div className="inline-flex w-fit max-w-full items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-850 border border-slate-300/60 dark:border-slate-800/80 backdrop-blur-xl flex-nowrap">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                prefetch={true}
                className={`relative px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-colors duration-200 z-10 flex-shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {/* Sliding Active Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="hash-active-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-md shadow-indigo-500/25"
                  />
                )}

                <span className="relative z-10">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
