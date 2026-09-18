'use client';

import React, { useState } from 'react';
import { sha256 } from 'js-sha256';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function HashAvalanchePage() {
  const { t } = useTranslation();
  const pg = (t as any).hash_avalanche || {};

  const [inputA, setInputA] = useState('hello');
  const [inputB, setInputB] = useState('hellp');

  const hashA = sha256(inputA);
  const hashB = sha256(inputB);

  let diffCount = 0;
  for (let i = 0; i < 64; i++) {
    if (hashA[i] !== hashB[i]) diffCount++;
  }

  const percentage = Math.round((diffCount / 64) * 100);

  return (
    <SpotlightCard
      spotlightColor="rgba(99, 102, 241, 0.16)"
      className="glass-card p-6 sm:p-8 space-y-8 w-full shadow-xl"
    >
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
          {pg.title || 'Avalanche Effect'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {pg.subtitle || 'Change just 1 character and watch ~50% of the hash change completely.'}
        </p>
      </div>

      {/* Inputs Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {pg.input_a_label || 'INPUT A'}
          </label>
          <input
            type="text"
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
            className="w-full p-4 rounded-xl border border-indigo-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {pg.input_b_label || 'INPUT B'}{' '}
            <span className="text-[11px] font-normal text-slate-400">
              {pg.input_b_hint || '(try changing one character)'}
            </span>
          </label>
          <input
            type="text"
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
            className="w-full p-4 rounded-xl border border-amber-300 dark:border-amber-900/60 bg-white/90 dark:bg-slate-900/90 font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Large Metric Stat */}
      <div className="text-center space-y-3 py-4 border-y border-slate-100 dark:border-slate-800">
        <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          {percentage}%
        </div>
        <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
          {pg.stat_changed || 'hash bits changed'}{' '}
          <span className="text-indigo-600 dark:text-indigo-400">
            ({diffCount}/64 {pg.stat_detail || 'different hex chars'})
          </span>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto space-y-1.5 pt-2">
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {pg.progress_label || 'Good avalanche (≥40%)'}
          </div>
        </div>
      </div>

      {/* Hex Output Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Hash A Grid */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 font-mono">
            {pg.hash_a_label || 'Hash A'} (&quot;{inputA}&quot;)
          </div>
          <div className="grid grid-cols-12 gap-1.5 font-mono text-xs text-center">
            {hashA.split('').map((char, idx) => (
              <div
                key={idx}
                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-900/30 font-semibold"
              >
                {char}
              </div>
            ))}
          </div>
        </div>

        {/* Hash B Grid */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 font-mono">
            {pg.hash_b_label || 'Hash B'} (&quot;{inputB}&quot;)
          </div>
          <div className="grid grid-cols-12 gap-1.5 font-mono text-xs text-center">
            {hashB.split('').map((char, idx) => {
              const isDiff = char !== hashA[idx];
              return (
                <div
                  key={idx}
                  className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    isDiff
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {char}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </SpotlightCard>
  );
}
