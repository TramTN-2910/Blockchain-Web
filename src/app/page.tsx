'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { sha256 } from 'js-sha256';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { 
  ArrowRight, 
  Lock, 
  Zap, 
  Box, 
  Layers, 
  Sparkles
} from 'lucide-react';

const HEX_CHARS = '0123456789abcdef';

function getRandomHex(len = 64): string {
  let res = '';
  for (let i = 0; i < len; i++) {
    res += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
  }
  return res;
}

const propertiesContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const propertyCardVariants: Variants = {
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

export default function HomePage() {
  const { t } = useTranslation();
  const [liveInput, setLiveInput] = useState('Hello, HubBlock!');
  const [displayedHash, setDisplayedHash] = useState(() => sha256('Hello, HubBlock!'));
  const [isScrambling, setIsScrambling] = useState(false);

  // 150ms Hex Scramble Effect on keystroke
  useEffect(() => {
    const realHash = sha256(liveInput);
    setIsScrambling(true);

    const interval = setInterval(() => {
      setDisplayedHash(getRandomHex(64));
    }, 25);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setDisplayedHash(realHash);
      setIsScrambling(false);
    }, 150);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [liveInput]);

  return (
    <div className="relative overflow-hidden py-4 sm:py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue-400/20 via-indigo-500/20 to-purple-500/20 blur-3xl rounded-full -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="text-center space-y-5">
        
        {/* Main Title */}
        <div className="space-y-2.5 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            <span className="gradient-text">{t.brand}</span>
            <br />
            <span className="text-slate-800 dark:text-slate-100 text-3xl sm:text-4xl lg:text-5xl">
              {t.tagline}
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            {t.subtagline}
          </motion.p>
        </div>

        {/* Floating Hash Live Formula Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto glass-card p-4 text-xs font-mono text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-900/50 shadow-lg"
        >
          <span className="opacity-70">SHA256(input) → </span>
          <span className="break-all font-semibold">{displayedHash}</span>
        </motion.div>

        {/* Action CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/hash/interaction"
            className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <span>{t.home.btn_try_hash}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/project"
            className="px-6 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300/60 dark:border-slate-700/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {t.home.btn_about_project}
          </Link>
        </motion.div>
      </section>

      {/* Stat Grid with Count-up & Spotlight Gradients */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto items-stretch">
        
        {/* Stat 1: 256 bits */}
        <SpotlightCard 
          spotlightColor="rgba(99, 102, 241, 0.22)" 
          className="glass-card glass-card-hover p-4 sm:p-5 text-center flex flex-col justify-center min-h-[105px] transition-transform hover:-translate-y-1 h-full"
        >
          <div className="flex items-baseline justify-center gap-1 text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            <CountUpNumber target={256} duration={1.2} />
            <span className="text-xs sm:text-sm font-semibold">{t.home.stats.bits_label}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.home.stats.bits_sub}</div>
        </SpotlightCard>

        {/* Stat 2: 64 hex characters */}
        <SpotlightCard 
          spotlightColor="rgba(168, 85, 247, 0.22)" 
          className="glass-card glass-card-hover p-4 sm:p-5 text-center flex flex-col justify-center min-h-[105px] transition-transform hover:-translate-y-1 h-full"
        >
          <div className="flex items-baseline justify-center gap-1 text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
            <CountUpNumber target={64} duration={1.4} />
            <span className="text-xs sm:text-sm font-semibold">{t.home.stats.hex_label}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.home.stats.hex_sub}</div>
        </SpotlightCard>

        {/* Stat 3: 2^256 combinations */}
        <SpotlightCard 
          spotlightColor="rgba(236, 72, 153, 0.22)" 
          className="glass-card glass-card-hover p-4 sm:p-5 text-center flex flex-col justify-center min-h-[105px] transition-transform hover:-translate-y-1 h-full"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-baseline justify-center gap-1 text-2xl sm:text-3xl font-black text-pink-600 dark:text-pink-400"
          >
            <span>2<sup>256</sup></span>
            <span className="text-xs sm:text-sm font-semibold">{t.home.stats.combos_label}</span>
          </motion.div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.home.stats.combos_sub}</div>
        </SpotlightCard>

        {/* Stat 4: ~50% Avalanche */}
        <SpotlightCard 
          spotlightColor="rgba(59, 130, 246, 0.22)" 
          className="glass-card glass-card-hover p-4 sm:p-5 text-center flex flex-col justify-center min-h-[105px] transition-transform hover:-translate-y-1 h-full"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-baseline justify-center gap-1 text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400"
          >
            <span>~50%</span>
            <span className="text-xs sm:text-sm font-semibold">{t.home.stats.avalanche_label}</span>
          </motion.div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.home.stats.avalanche_sub}</div>
        </SpotlightCard>
      </section>

      {/* Live Interactive Widget Box with Spotlight & Keystroke Scramble */}
      <SpotlightCard 
        spotlightColor="rgba(99, 102, 241, 0.15)"
        className="max-w-4xl mx-auto glass-card p-6 sm:p-8 space-y-6 relative overflow-hidden border-indigo-200/80 dark:border-indigo-900/60 shadow-xl"
      >
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
          </span>
          <span>{t.home?.live_widget?.badge || 'SHA-256 trực tiếp — gõ bất kỳ ký tự nào'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Input field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.home?.live_widget?.input_label || 'ĐẦU VÀO'}
            </label>
            <input
              type="text"
              value={liveInput}
              onChange={(e) => setLiveInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm shadow-inner transition-colors"
              placeholder={t.home?.live_widget?.input_placeholder || 'Nhập chuỗi ký tự...'}
            />
          </div>

          {/* Result Output with Hex Scramble Glitch/Glow */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>{t.home?.live_widget?.result_label || 'KẾT QUẢ SHA-256 (luôn 64 ký tự)'}</span>
              {isScrambling && (
                <span className="text-[10px] text-cyan-500 font-mono animate-pulse">
                  Hashing...
                </span>
              )}
            </label>
            <div 
              className={`p-4 rounded-xl border font-mono text-xs break-all leading-relaxed shadow-sm transition-all duration-150 ${
                isScrambling 
                  ? 'bg-cyan-50/80 dark:bg-cyan-950/50 border-cyan-400 dark:border-cyan-500 text-cyan-600 dark:text-cyan-300 scale-[1.01] shadow-[0_0_15px_rgba(6,182,212,0.25)]' 
                  : 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-300/80 dark:border-indigo-800/80 text-indigo-900 dark:text-indigo-200'
              }`}
            >
              {displayedHash}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono text-right">
              {t.home?.live_widget?.length_prefix || 'Độ dài:'} <span className="text-indigo-600 dark:text-indigo-400 font-bold">{displayedHash.length}</span> {t.home?.live_widget?.length_chars || 'ký tự hex'} = <span className="text-indigo-600 dark:text-indigo-400 font-bold">256</span> {t.home?.live_widget?.length_bits || 'bits'}
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* 4 Crucial Properties Section with Staggered Fade-Up & Spotlight Cards */}
      <section className="space-y-10 text-center">
        <div className="space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t.home?.properties_title || '4 Tính Chất Quan Trọng của SHA-256'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.home?.properties_subtitle}
          </p>
        </div>

        <motion.div 
          variants={propertiesContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto text-left"
        >
          
          {/* Card 1: Deterministic */}
          <motion.div variants={propertyCardVariants} whileHover={{ y: -4 }}>
            <SpotlightCard 
              spotlightColor="rgba(245, 158, 11, 0.18)"
              className="glass-card glass-card-hover p-6 space-y-3 border-l-4 border-l-amber-500 h-full"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {t.home?.prop1_title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.home?.prop1_desc}
              </p>
            </SpotlightCard>
          </motion.div>

          {/* Card 2: Quick Computation */}
          <motion.div variants={propertyCardVariants} whileHover={{ y: -4 }}>
            <SpotlightCard 
              spotlightColor="rgba(244, 63, 94, 0.18)"
              className="glass-card glass-card-hover p-6 space-y-3 border-l-4 border-l-rose-500 h-full"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {t.home?.prop2_title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.home?.prop2_desc}
              </p>
            </SpotlightCard>
          </motion.div>

          {/* Card 3: Pre-image Resistance */}
          <motion.div variants={propertyCardVariants} whileHover={{ y: -4 }}>
            <SpotlightCard 
              spotlightColor="rgba(6, 182, 212, 0.18)"
              className="glass-card glass-card-hover p-6 space-y-3 border-l-4 border-l-cyan-500 h-full"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {t.home?.prop3_title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.home?.prop3_desc}
              </p>
            </SpotlightCard>
          </motion.div>

          {/* Card 4: Avalanche Effect */}
          <motion.div variants={propertyCardVariants} whileHover={{ y: -4 }}>
            <SpotlightCard 
              spotlightColor="rgba(16, 185, 129, 0.18)"
              className="glass-card glass-card-hover p-6 space-y-3 border-l-4 border-l-emerald-500 h-full"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {t.home?.prop4_title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.home?.prop4_desc}
              </p>
            </SpotlightCard>
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="pt-4"
        >
          <Link
            href="/hash/interaction"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            {t.home?.btn_open_interactive}
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
