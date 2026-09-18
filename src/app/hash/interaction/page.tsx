'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sha256 } from 'js-sha256';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { SpringCounter } from '@/components/ui/SpringCounter';
import { Lightbulb, Copy, Check, Sparkles } from 'lucide-react';

const HEX_CHARS = '0123456789abcdef';

function getRandomHex(len = 64): string {
  let res = '';
  for (let i = 0; i < len; i++) {
    res += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
  }
  return res;
}

export default function HashInteractionPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState('Hello, World!');
  const [displayedHash, setDisplayedHash] = useState(() => sha256('Hello, World!'));
  const [isScrambling, setIsScrambling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSweeping, setIsSweeping] = useState(false);

  const realHash = sha256(input);

  // 150ms Scramble effect on keystroke with cyan glow pulse
  useEffect(() => {
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
  }, [input, realHash]);

  // Group hash into 4 lines of 4-character blocks
  const formattedBlocks: string[][] = [];
  for (let i = 0; i < 64; i += 16) {
    const chunk = displayedHash.slice(i, i + 16);
    const lineBlocks: string[] = [];
    for (let j = 0; j < 16; j += 4) {
      lineBlocks.push(chunk.slice(j, j + 4));
    }
    formattedBlocks.push(lineBlocks);
  }

  const byteLength = new TextEncoder().encode(input).length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(realHash);
      setCopied(true);
      setIsSweeping(true);

      setTimeout(() => {
        setIsSweeping(false);
      }, 700);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* Main Generator Card with Spotlight tracking */}
      <SpotlightCard 
        spotlightColor="rgba(99, 102, 241, 0.16)"
        className="glass-card p-6 sm:p-8 space-y-6 border border-indigo-200/80 dark:border-indigo-900/60 shadow-xl"
      >
        
        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{t.hash_interaction?.title || 'Trình tạo mã băm SHA-256'}</span>
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.hash_interaction?.subtitle || 'Nhập văn bản và xem mã băm SHA-256 cập nhật ngay tức thì'}
          </p>
        </div>

        {/* Input Textarea */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.hash_interaction?.input_label || 'VĂN BẢN ĐẦU VÀO'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="w-full p-4 rounded-xl border border-indigo-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm shadow-inner transition-colors"
            placeholder={t.hash_interaction?.input_placeholder || 'Nhập chuỗi ký tự...'}
          />
        </div>

        {/* Output Section */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <label className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span>{t.hash_interaction?.output_label || 'MÃ BĂM SHA-256 ĐẦU RA'}</span>
              {isScrambling && (
                <span className="text-[10px] text-cyan-500 font-mono animate-pulse font-normal lowercase">
                  (hashing...)
                </span>
              )}
            </label>
            <div className="flex items-center gap-3">
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] sm:text-xs">
                {t.hash_interaction?.output_stats || '64/64 ký tự hex = 256 bits'}
              </span>
              
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-emerald-500/25 scale-105'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 hover:scale-[1.02] active:scale-[0.98]'
                }`}
                title="Copy full hash"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 animate-bounce" />
                    <span>{t.hash_interaction?.copied_btn || 'Đã sao chép!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.hash_interaction?.copy_btn || 'Sao chép mã băm'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Hex Output Box with Light Beam Sweep & Cyan Scramble Pulse */}
          <div className={`relative overflow-hidden p-5 sm:p-6 rounded-2xl border font-mono text-sm sm:text-base space-y-2.5 shadow-sm transition-all duration-150 ${
            isScrambling
              ? 'bg-cyan-950/20 border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.2)]'
              : 'bg-indigo-50/40 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-900/60'
          }`}>
            
            {/* Radiant Light Beam Sweep Overlay */}
            {isSweeping && (
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '350%', opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.65, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-400/35 dark:via-cyan-300/40 to-transparent -skew-x-12 z-20"
              />
            )}

            {formattedBlocks.map((line, lineIdx) => (
              <div key={lineIdx} className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-6 font-semibold">
                {line.map((block, blockIdx) => (
                  <span
                    key={blockIdx}
                    className={`tracking-widest px-2 py-0.5 rounded transition-all duration-150 ${
                      isScrambling
                        ? 'text-cyan-500 dark:text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)] bg-cyan-400/10'
                        : 'text-indigo-700 dark:text-indigo-300'
                    }`}
                  >
                    {block}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Stats Bar with Spring Counter */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-sans pt-2">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div>
                {t.hash_interaction?.algo_label || 'Thuật toán:'}{' '}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">SHA-256</span>
              </div>
              <div>
                {t.hash_interaction?.size_label || 'Kích thước:'}{' '}
                <span className="font-bold text-purple-600 dark:text-purple-400">256 bits</span>
              </div>
              <div>
                {t.hash_interaction?.hex_chars_label || 'Ký tự Hex:'}{' '}
                <span className="font-bold text-slate-800 dark:text-slate-200">64</span>
              </div>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
              {t.hash_interaction?.input_bytes_label || 'Bytes đầu vào:'}{' '}
              <SpringCounter
                value={byteLength}
                className="font-bold text-indigo-600 dark:text-indigo-400 min-w-[20px] inline-block text-right"
              />
            </div>
          </div>
        </div>

      </SpotlightCard>

      {/* Bottom Tip Box */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3 shadow-sm">
        <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t.hash_interaction?.tip_text || 'Thay đổi một ký tự và xem toàn bộ mã băm đầu ra thay đổi hoàn toàn — đây là hiệu ứng Avalanche. Mã băm luôn giữ đúng 64 ký tự.'}
        </p>
      </div>

    </div>
  );
}
