'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Mail,
  ShieldCheck,
  FileCheck,
  Sparkles,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function RsaTheoryPage() {
  const { t, language } = useTranslation();
  const rsa = t.theory_rsa || ({} as any);
  const isEn = language === 'en';

  const [activeStep, setActiveStep] = useState<number>(1);
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);

  const steps = [
    { id: 1, label: isEn ? 'Bob generates key pair' : 'Bob tạo cặp khóa' },
    { id: 2, label: isEn ? 'Bob sends Public Key to Alice' : 'Bob gửi Public Key cho Alice' },
    { id: 3, label: isEn ? 'Alice encrypts message' : 'Alice mã hóa thông điệp' },
    { id: 4, label: isEn ? 'Ciphertext sent over Internet' : 'Gửi Ciphertext qua Internet' },
    { id: 5, label: isEn ? 'Bob decrypts to recover plaintext' : 'Bob giải mã — thu lại plaintext' },
  ];

  return (
    <div className="space-y-12 pt-2">
      {/* 1. Overview Section: Mã Hóa Bất Đối Xứng là gì? */}
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {rsa.asymmetric_overview?.title || 'Mã Hóa Bất Đối Xứng là gì?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {rsa.asymmetric_overview?.desc || 'Khác với mã hóa đối xứng dùng 1 key duy nhất, RSA sử dụng cặp key: một key mã hóa (public) và một key giải mã (private) có quan hệ toán học đặc biệt.'}
          </p>
        </div>

        {/* 2 Key Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {/* Public Key Card */}
          <SpotlightCard 
            spotlightColor="rgba(245, 158, 11, 0.18)"
            className="glass-card p-6 sm:p-7 space-y-4 border-l-4 border-l-amber-500 relative overflow-hidden shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Public Key</h3>
                <div className="text-xs text-slate-400">{isEn ? 'Freely distributed' : 'Khóa công khai'}</div>
              </div>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {(rsa.public_key?.bullets || [
                'Chia sẻ tự do cho mọi người',
                'Dùng để mã hóa thông điệp',
                'Dùng để xác minh chữ ký số',
                'Không thể dẫn ngược ra private key',
              ]).map((b: string, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </SpotlightCard>

          {/* Private Key Card */}
          <SpotlightCard 
            spotlightColor="rgba(168, 85, 247, 0.18)"
            className="glass-card p-6 sm:p-7 space-y-4 border-l-4 border-l-purple-600 relative overflow-hidden shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Private Key</h3>
                <div className="text-xs text-slate-400">{isEn ? 'Strictly confidential' : 'Khóa bí mật'}</div>
              </div>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {(rsa.private_key?.bullets || [
                'Giữ bí mật tuyệt đối',
                'Dùng để giải mã thông điệp',
                'Dùng để ký số giao dịch',
                'Mất private key = mất quyền kiểm soát',
              ]).map((b: string, i: number) => (
                <li key={i} className={`flex items-center gap-2 ${i === 3 ? 'font-semibold text-rose-500' : ''}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 3 ? 'bg-rose-500' : 'bg-purple-600'}`}></span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </div>
      </div>

      {/* 2. Alice & Bob Stepper (Quy trình mã hóa RSA) */}
      <SpotlightCard 
        spotlightColor="rgba(99, 102, 241, 0.16)"
        className="glass-card p-6 sm:p-8 space-y-6 border-2 border-indigo-100 dark:border-slate-800 shadow-xl"
      >
        <div className="text-center space-y-1">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
            <span>🎭</span>
            <span>Alice & Bob — Quy trình mã hóa RSA</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Nhấn từng bước để theo dõi dữ liệu di chuyển qua toàn bộ quy trình
          </p>
        </div>

        {/* Stepper Layout (Left: Step list, Right: Step display) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Step List on Left (col-span-4) */}
          <div className="lg:col-span-4 space-y-2">
            {steps.map((step) => {
              const isCurrent = activeStep === step.id;
              const isPast = activeStep > step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full p-3 rounded-2xl flex items-center gap-3 text-left transition-all border ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border-indigo-600'
                      : isPast
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-100/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                      isCurrent
                        ? 'bg-white text-indigo-600'
                        : isPast
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : `B${step.id}`}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold truncate">{step.label}</div>
                </button>
              );
            })}
          </div>

          {/* Step Display on Right (col-span-8) */}
          <div className="lg:col-span-8 min-h-[380px] p-6 rounded-2xl bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-6">
            <AnimatePresence mode="wait">
              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {/* Step Header */}
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white">B1</span>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                        Bob tạo cặp khóa
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Sinh ra Public Key và Private Key từ cùng một phép toán
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Bob chạy thuật toán RSA để tạo ra <strong className="text-amber-500">Public Key</strong> và <strong className="text-purple-500">Private Key</strong>. Hai khóa này có quan hệ toán học — một khóa mã hóa, khóa kia giải mã.
                  </p>

                  {/* Public & Private Key Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Public Key Box */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                          <Key className="w-4 h-4" />
                          <span>Public Key</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded">Công khai</span>
                      </div>
                      <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                        (n=3233, e=17)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        📢 Chia sẻ công khai — ai cũng có thể biết
                      </div>
                    </div>

                    {/* Private Key Box */}
                    <div
                      onMouseEnter={() => setShowPrivateKey(true)}
                      onMouseLeave={() => setShowPrivateKey(false)}
                      className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                          <Lock className="w-4 h-4" />
                          <span>Private Key</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold bg-purple-500/20 text-purple-600 px-2 py-0.5 rounded">Bí mật</span>
                      </div>
                      <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                        <span>{showPrivateKey ? '(d=2753)' : '••••••••'}</span>
                        <button
                          type="button"
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                        🔒 Hover để xem • Không bao giờ chia sẻ!
                      </div>
                    </div>
                  </div>

                  {/* Math Note */}
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
                    💡 <strong>Toán học đằng sau:</strong> n = p × q = 61 × 53 = 3233. Chỉ người biết p và q (Bob) mới có thể tính ra d = 2753.
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white">B2</span>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                        Bob gửi Public Key cho Alice
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Public Key có thể truyền đi thoải mái, không cần bảo mật
                      </p>
                    </div>
                  </div>

                  {/* Visual Transmission Line */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 text-center">
                    <div className="flex items-center justify-between max-w-md mx-auto">
                      <div className="text-center space-y-1">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-lg shadow-sm">
                          👨
                        </div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Bob</div>
                      </div>

                      <div className="flex-1 px-4 space-y-1">
                        <div className="flex items-center justify-center text-emerald-600 font-mono text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 py-1 px-3 rounded-full border border-emerald-200 dark:border-emerald-800 animate-pulse">
                          🔑 (n=3233, e=17)
                        </div>
                        <div className="text-[10px] text-slate-400">→ gửi qua email / web / bất kỳ đâu →</div>
                      </div>

                      <div className="text-center space-y-1">
                        <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600 flex items-center justify-center font-bold text-lg shadow-sm">
                          👩
                        </div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Alice</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Alice nhận được Public Key <code className="font-bold text-amber-500 font-mono">(n=3233, e=17)</code> từ Bob. Cô ấy có thể dùng nó để mã hóa tin nhắn chỉ Bob đọc được.
                  </p>

                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" />
                    <span>
                      <strong>Không cần kênh bảo mật.</strong> Dù hacker có chặn được Public Key cũng không làm gì được — họ không có Private Key để giải mã.
                    </span>
                  </div>
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white">B3</span>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                        Alice mã hóa thông điệp
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Dùng Public Key của Bob để biến plaintext → ciphertext
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Alice muốn gửi bí mật cho Bob. Cô ấy dùng Public Key <span className="text-amber-500 font-mono font-bold">(n=3233, e=17)</span> để mã hóa từ <strong className="text-emerald-500 font-mono">&apos;HELLO&apos;</strong>.
                  </p>

                  {/* Encryption Visual Box */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-wider">Plaintext (Alice viết)</span>
                      <span className="font-mono font-black text-emerald-500 tracking-widest text-base">H E L L O</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-center font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Encrypt(m, e=17, n=3233)</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-wider">Ciphertext (gửi đi)</span>
                      <span className="font-mono font-bold text-amber-500 text-sm sm:text-base">
                        855 • 220 • 123 • 855 • 372
                      </span>
                    </div>
                  </div>

                  {/* Math Note */}
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
                    🔢 <strong>Cách tính:</strong> Mỗi chữ cái được ánh xạ thành số (H=72, E=69...), sau đó tính m<sup>e</sup> mod n. Ví dụ: H = 72<sup>17</sup> mod 3233 = 855.
                  </div>
                </motion.div>
              )}

              {activeStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500 text-white">B4</span>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                        Gửi Ciphertext qua Internet
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Kẻ tấn công có thể thấy nhưng không thể đọc
                      </p>
                    </div>
                  </div>

                  {/* Transmission Wire */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center justify-between max-w-md mx-auto">
                      <div className="text-center space-y-1">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 flex items-center justify-center font-bold text-base">
                          👩
                        </div>
                        <div className="text-[11px] font-bold">Alice</div>
                      </div>

                      <div className="flex-1 px-3 text-center space-y-1">
                        <div className="font-mono text-[11px] font-bold text-amber-500 bg-amber-500/10 py-1 px-2.5 rounded-full border border-amber-500/30">
                          855 • 220 • 123 • 855 • 372
                        </div>
                        <div className="text-[10px] text-slate-400">🌐 Internet</div>
                      </div>

                      <div className="text-center space-y-1">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-base">
                          👨
                        </div>
                        <div className="text-[11px] font-bold">Bob</div>
                      </div>
                    </div>

                    {/* Hacker interception card */}
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1.5 text-center">
                      <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5">
                        <span>🥷 Hacker chặn được ciphertext:</span>
                        <code className="font-mono bg-rose-500/20 px-2 py-0.5 rounded">855 • 220 • 123 • 855 • 372</code>
                      </div>
                      <div className="text-xs font-semibold text-rose-500 flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Không có Private Key → Không thể giải mã!</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Ciphertext <code className="font-mono font-bold text-amber-500">855 • 220 • 123 • 855 • 372</code> trông như một dãy số vô nghĩa. Ngay cả siêu máy tính cũng không thể brute-force RSA-2048 trong thời gian hợp lý.
                  </p>
                </motion.div>
              )}

              {activeStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-600 text-white">B5</span>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                        Bob giải mã — thu lại plaintext
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Chỉ Private Key của Bob mới mở được tin nhắn này
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Bob nhận ciphertext và dùng <strong className="text-purple-600 font-mono font-bold">Private Key (d=2753)</strong> để giải mã.
                  </p>

                  {/* Decryption Visual Box */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-wider">Bob nhận được</span>
                      <span className="font-mono font-bold text-amber-500">855 • 220 • 123 • 855 • 372</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-center font-mono text-xs text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20 flex items-center justify-center gap-2">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Decrypt(c, d=2753, n=3233)</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-wider">Plaintext khôi phục</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-emerald-500 tracking-widest text-base">H E L L O</span>
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Khớp hoàn toàn!
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Entire Pipeline Summary */}
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                    <div className="font-bold text-slate-500 uppercase text-[10px]">Toàn bộ luồng dữ liệu:</div>
                    <div className="text-slate-800 dark:text-slate-200">
                      <span className="text-emerald-500 font-bold">&quot;HELLO&quot;</span> → encrypt →{' '}
                      <span className="text-amber-500 font-bold">&quot;855 • 220 • 123 • 855 • 372&quot;</span> → decrypt →{' '}
                      <span className="text-emerald-500 font-bold">&quot;HELLO&quot;</span> ✅
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Navigation Buttons & Progress Dots */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                disabled={activeStep === 1}
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ← Trước
              </button>

              {/* Step dots */}
              <div className="flex items-center gap-1.5">
                {steps.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStep(s.id)}
                    className={`h-2 rounded-full transition-all ${
                      activeStep === s.id
                        ? 'w-6 bg-indigo-600'
                        : activeStep > s.id
                        ? 'w-2 bg-emerald-500'
                        : 'w-2 bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {activeStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => Math.min(prev + 1, 5))}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all"
                >
                  Tiếp →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hoàn thành!</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Completion Celebration Banner (shown when on step 5) */}
        {activeStep === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1 text-xs"
          >
            <div className="font-bold text-emerald-700 dark:text-emerald-300 text-sm flex items-center justify-center gap-1.5">
              <span>🎉</span>
              <span>Bạn đã hiểu quy trình RSA!</span>
            </div>
            <div className="font-mono text-slate-600 dark:text-slate-400">
              <span className="text-emerald-500 font-bold">&quot;HELLO&quot;</span> → encrypt →{' '}
              <span className="text-amber-500 font-bold">&quot;855 • 220 • 123 • 855 • 372&quot;</span> → decrypt →{' '}
              <span className="text-emerald-500 font-bold">&quot;HELLO&quot;</span> ✅
            </div>
          </motion.div>
        )}
      </SpotlightCard>

      {/* 3. Real-world Metaphors (Ví dụ trong thực tế) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span>Ví dụ trong thực tế</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Metaphor 1 */}
          <SpotlightCard 
            spotlightColor="rgba(99, 102, 241, 0.16)"
            className="glass-card p-6 space-y-3 text-center shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mx-auto flex items-center justify-center text-2xl shadow-sm">
              📭
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              Hộp thư có khóa
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Public Key là địa chỉ hộp thư — ai cũng biết và gửi thư vào được. Private Key là chìa khóa — chỉ bạn mở ra đọc.
            </p>
          </SpotlightCard>

          {/* Metaphor 2 */}
          <SpotlightCard 
            spotlightColor="rgba(245, 158, 11, 0.16)"
            className="glass-card p-6 space-y-3 text-center shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 mx-auto flex items-center justify-center text-2xl shadow-sm">
              🔒
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              Niêm phong phong bì
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Bất kỳ ai cũng có thể niêm phong (mã hóa bằng public key), nhưng chỉ người có con dấu gốc (private key) mới mở được.
            </p>
          </SpotlightCard>

          {/* Metaphor 3 */}
          <SpotlightCard 
            spotlightColor="rgba(168, 85, 247, 0.16)"
            className="glass-card p-6 space-y-3 text-center shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 mx-auto flex items-center justify-center text-2xl shadow-sm">
              ✍️
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              Chữ ký tay
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Bạn ký bằng private key → bất kỳ ai có public key đều xác minh được chữ ký đó là của bạn, nhưng không ai giả mạo được.
            </p>
          </SpotlightCard>
        </div>
      </div>

      {/* 4. Module Bottom Navigation */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800">
        <button
          type="button"
          disabled
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 opacity-50 cursor-not-allowed"
        >
          ← Trước
        </button>

        {/* Module progress dots (1 of 4 active) */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
        </div>

        <Link
          href="/rsa/math"
          prefetch={true}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition-all"
        >
          <span>Tiếp theo →</span>
        </Link>
      </div>
    </div>
  );
}
