'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-purple-100/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
        <span>Blockchain Visualizer &amp; Educational Simulator — developed by </span>
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">HubBlock Team</span>
        <span> - </span>
        <span className="text-slate-700 dark:text-slate-300">Ho Chi Minh University of Banking (HUB)</span>
      </div>
    </footer>
  );
}
