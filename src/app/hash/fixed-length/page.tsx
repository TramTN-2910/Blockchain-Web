'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { sha256 } from 'js-sha256';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { Check, ShieldCheck } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function HashFixedLengthPage() {
  const { t } = useTranslation();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const cases = [
    {
      badgeKey: 'badge_short',
      defaultBadge: 'Ngắn (1 ký tự)',
      inputLabel: '"A"',
      inputStr: 'A',
      inputLength: 1,
      accentColor: 'indigo',
    },
    {
      badgeKey: 'badge_medium',
      defaultBadge: 'Trung bình',
      inputLabel: '"Hello"',
      inputStr: 'Hello',
      inputLength: 5,
      accentColor: 'purple',
    },
    {
      badgeKey: 'badge_sentence',
      defaultBadge: 'Câu',
      inputLabel: '"Hello, World!"',
      inputStr: 'Hello, World!',
      inputLength: 13,
      accentColor: 'pink',
    },
    {
      badgeKey: 'badge_paragraph',
      defaultBadge: 'Đoạn văn dài',
      inputLabel: '"The quick brown fox jumps over the lazy ..."',
      inputStr: 'The quick brown fox jumps over the lazy dog and many more words to test length',
      inputLength: 85,
      accentColor: 'blue',
    },
  ];

  return (
    <SpotlightCard 
      spotlightColor="rgba(168, 85, 247, 0.15)"
      className="glass-card p-6 sm:p-8 space-y-6 w-full border border-purple-200/80 dark:border-purple-900/60 shadow-xl"
    >
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>{t.hash_fixed_length?.title || 'Tính chất Độ dài Cố định'}</span>
          <ShieldCheck className="w-5 h-5 text-purple-500" />
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t.hash_fixed_length?.subtitle || 'SHA-256 luôn tạo ra đúng 64 ký tự hex (256 bits), bất kể kích thước đầu vào.'}
        </p>
      </div>

      {/* 4 Sample Cards with Staggered Fade-up and Sibling Dimming on Hover */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
        className="space-y-4"
      >
        {cases.map((item, idx) => {
          const hash = sha256(item.inputStr);
          const line1 = hash.slice(0, 32);
          const line2 = hash.slice(32, 64);
          
          const isHovered = hoveredIdx === idx;
          const isAnyHovered = hoveredIdx !== null;
          const isDimmed = isAnyHovered && !isHovered;
          
          const badgeText = (t.hash_fixed_length as Record<string, string>)?.[item.badgeKey] || item.defaultBadge;

          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              animate={{
                opacity: isDimmed ? 0.55 : 1,
                scale: isHovered ? 1.015 : isDimmed ? 0.99 : 1,
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-5 rounded-2xl border transition-colors space-y-3 relative ${
                isHovered
                  ? 'border-purple-400 dark:border-purple-600 bg-purple-50/70 dark:bg-slate-900/90 shadow-lg shadow-purple-500/10'
                  : 'border-purple-100/90 dark:border-slate-800/80 bg-purple-50/30 dark:bg-slate-900/50 shadow-sm'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
                    {badgeText}
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {item.inputLabel}
                  </span>
                </div>
                
                {/* Length Indicators with Animated CountUp & Bouncing Checkmark */}
                <div className="font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                  <span>{t.hash_fixed_length?.input_label || 'Đầu vào:'}</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    <CountUpNumber target={item.inputLength} duration={1.2} /> {t.hash_fixed_length?.chars_suffix || 'ký tự'}
                  </span>
                  <span>→</span>
                  <span>{t.hash_fixed_length?.output_label || 'Đầu ra:'}</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 inline-flex items-center gap-0.5">
                    {t.hash_fixed_length?.output_stat || '64 ký tự'}
                    <motion.span
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 2, repeatDelay: idx * 0.4 }}
                      className="inline-flex"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 stroke-[3]" />
                    </motion.span>
                  </span>
                </div>
              </div>

              {/* Hash Value Box */}
              <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-950/80 border border-purple-100/60 dark:border-slate-800 font-mono text-xs text-purple-700 dark:text-purple-300 space-y-1 break-all leading-relaxed shadow-inner">
                <div>{line1}</div>
                <div>{line2}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom Summary Box (Static) */}
      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold text-center flex items-center justify-center gap-2 shadow-sm">
        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <span>
          {t.hash_fixed_length?.conclusion || 'Tất cả đầu ra đều đúng 64 ký tự hex = 256 bits — tính chất "độ dài cố định".'}
        </span>
      </div>
    </SpotlightCard>
  );
}
