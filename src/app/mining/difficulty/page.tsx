'use client';

import React, { useState } from 'react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function MiningDifficultyPage() {
  const { t } = useTranslation();
  const pg = (t as any).mining_difficulty || {};

  const [selectedDiff, setSelectedDiff] = useState<number>(3);

  const diffItems = [
    { level: 1, zeros: '0', tries: '~16' },
    { level: 2, zeros: '00', tries: '~256' },
    { level: 3, zeros: '000', tries: '~4,096' },
    { level: 4, zeros: '0000', tries: '~65,536' },
    { level: 5, zeros: '00000', tries: '~1,048,576' },
  ];

  return (
    <div className="space-y-6 pt-2 w-full">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
          {pg.badge || 'NETWORK CONFIGURATION'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {pg.title || 'Difficulty Lab'}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          {pg.subtitle || 'Adjust the difficulty level to understand why Bitcoin takes 10 minutes to mine a block'}
        </p>
      </div>

      {/* Difficulty Selector Card */}
      <SpotlightCard
        spotlightColor="rgba(99, 102, 241, 0.16)"
        className="glass-card p-6 sm:p-7 space-y-4 shadow-xl"
      >
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {pg.select_label || 'SELECT DIFFICULTY (1–5)'}
        </div>

        {/* Buttons 1-5 */}
        <div className="flex items-center gap-3">
          {diffItems.map((item) => (
            <button
              key={item.level}
              onClick={() => setSelectedDiff(item.level)}
              className={`w-12 h-12 rounded-2xl font-bold text-base transition-all flex items-center justify-center ${
                selectedDiff === item.level
                  ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              {item.level}
            </button>
          ))}
        </div>

        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-mono pt-1">
          {pg.current_diff || 'Current difficulty:'} <strong className="text-indigo-600 dark:text-indigo-400 font-sans font-bold">{selectedDiff}</strong> —{' '}
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{diffItems[selectedDiff - 1].zeros}</span>
          <span className="text-slate-400">xxxxxxxxxxxx</span>
        </div>
      </SpotlightCard>

      {/* Comparison List */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {pg.compare_label || 'TARGET COMPARISON PER DIFFICULTY LEVEL'}
        </div>

        <div className="space-y-3">
          {diffItems.map((item) => {
            const isSelected = selectedDiff === item.level;
            return (
              <SpotlightCard
                key={item.level}
                spotlightColor={isSelected ? "rgba(99, 102, 241, 0.2)" : "rgba(168, 85, 247, 0.12)"}
                onClick={() => setSelectedDiff(item.level)}
                className={`glass-card p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-all border-2 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/10'
                    : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.level}
                  </div>

                  <div className="font-mono text-xs sm:text-sm truncate">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{item.zeros}</span>
                    <span className="text-slate-400 dark:text-slate-500">
                      {'x'.repeat(24 - item.level)}...
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-amber-600 dark:text-amber-400 text-sm sm:text-base">
                    {item.tries} {pg.tries_suffix || 'attempts'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {pg.avg || 'average'}
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
