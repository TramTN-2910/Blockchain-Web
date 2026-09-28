'use client';

import React, { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { sha256 } from 'js-sha256';
import { Hash, Sparkles, ArrowRight, Layers, Cpu, BarChart2 } from 'lucide-react';
import Link from 'next/link';

interface StepInfo {
  step: number;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
}

const SHA256_STEPS: StepInfo[] = [
  { step: 1, titleVi: 'Bước 1: Padding Bit (Đệm bit)', titleEn: 'Step 1: Bit Padding', descVi: 'Thêm bit 1 vào cuối thông điệp, sau đó đệm các bit 0 sao cho độ dài ≡ 448 (mod 512).', descEn: 'Append single bit 1 followed by bit 0s until message length ≡ 448 (mod 512).' },
  { step: 2, titleVi: 'Bước 2: Nối Chiều Dài (Append Length)', titleEn: 'Step 2: Append Length', descVi: 'Gắn thêm 64 bit biểu diễn độ dài ban đầu của dữ liệu vào cuối để đủ bội số 512 bit.', descEn: 'Append 64-bit integer representing original message length to form 512-bit block multiples.' },
  { step: 3, titleVi: 'Bước 3: Khởi Tạo 8 Biến Trạng Thái', titleEn: 'Step 3: Init 8 State Variables', descVi: 'Khởi tạo 8 thanh ghi 32-bit (H0...H7) từ phần thập phân của căn bậc hai của 8 số nguyên tố đầu tiên.', descEn: 'Initialize 8 32-bit state registers (H0..H7) from fractional parts of square roots of first 8 primes.' },
  { step: 4, titleVi: 'Bước 4: Mở Rộng 64 Từ (Message Schedule)', titleEn: 'Step 4: 64-Word Message Schedule', descVi: 'Từ 16 từ 32-bit ban đầu (W0..W15), dùng hàm σ0 và σ1 mở rộng ra mảng 64 từ (W0..W63).', descEn: 'Expand 16 original 32-bit words into 64 words using bitwise transformation functions.' },
  { step: 5, titleVi: 'Bước 5: Vòng Lặp Nén 64 Vòng', titleEn: 'Step 5: 64-Round Compression Loop', descVi: 'Thực hiện 64 vòng lặp nén đảo bit với 64 hằng số K_t và các hàm logic Ch, Maj, Σ0, Σ1.', descEn: 'Run 64 compression rounds using round constants Kt and logic functions (Ch, Maj, Σ0, Σ1).' },
  { step: 6, titleVi: 'Bước 6: Đầu Ra Mã Băm (Final Hash Output)', titleEn: 'Step 6: Final Hash Digest', descVi: 'Cộng tích lũy các giá trị băm trung gian và nối ghép 8 từ thành chuỗi băm 64 ký tự Hex (256 bits).', descEn: 'Add intermediate hash values and concatenate 8 registers into a 64-char hex string (256 bits).' }
];

export default function CryptoLabHashPage() {
  const { language } = useLanguageStore();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [inputA, setInputA] = useState('Blockchain Technology');
  const [inputB, setInputB] = useState('blockchain technology');

  const hashA = sha256(inputA);
  const hashB = sha256(inputB);

  const diffPercent = React.useMemo(() => {
    let diff = 0;
    for (let i = 0; i < 64; i++) {
      if (hashA[i] !== hashB[i]) diff++;
    }
    return Math.round((diff / 64) * 100);
  }, [hashA, hashB]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-slate-900 border border-blue-800/40">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[11px] font-extrabold text-blue-300 whitespace-nowrap tracking-wider shrink-0">
              LAB 2
            </span>
            <span>{language === 'vi' ? 'Phòng TN Mật Mã • Tạo Hash' : 'Crypto Lab • Hash Simulator'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Tạo Mã Băm SHA-256 & 6 Bước Nén' : 'SHA-256 Generator & 6-Phase Engine'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Mổ xẻ 6 bước nén nội bộ, quan sát hiệu ứng tuyết lở trực quan và đối sánh ma trận 6 thuật toán băm.'
              : 'Deconstruct SHA-256 internal compression, observe avalanche effect and compare hash algorithms.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/crypto-lab/digital-signature"
            prefetch={true}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>{language === 'vi' ? 'Sang Lab: Ký Số' : 'Next: Digital Signature Lab'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 6-Step Compression */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          {language === 'vi' ? '6 Giai Đoạn Nén Dữ Liệu Nội Bộ Của SHA-256' : '6 Internal Data Compression Phases of SHA-256'}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SHA256_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeStep === s.step
                  ? 'bg-cyan-950 border-cyan-500/80 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-bold uppercase text-cyan-400">Step {s.step}</div>
              <div className="text-xs font-bold text-white truncate mt-0.5">
                {language === 'vi' ? s.titleVi.split(':')[1] || s.titleVi : s.titleEn.split(':')[1] || s.titleEn}
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="text-sm font-bold text-white">
            {language === 'vi' ? SHA256_STEPS[activeStep - 1].titleVi : SHA256_STEPS[activeStep - 1].titleEn}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {language === 'vi' ? SHA256_STEPS[activeStep - 1].descVi : SHA256_STEPS[activeStep - 1].descEn}
          </div>
        </div>
      </div>

      {/* Avalanche Lab */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            {language === 'vi' ? 'Hiệu Ứng Tuyết Lở (Avalanche Effect)' : 'Avalanche Effect Inspection'}
          </h2>
          <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-xs font-bold text-purple-300">
            {diffPercent}% {language === 'vi' ? 'Bits Khác Biệt' : 'Bits Flipped'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="text-xs font-semibold text-cyan-400">
              {language === 'vi' ? 'Đầu vào A' : 'Input Payload A'}
            </label>
            <input
              type="text"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-cyan-500"
            />
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 break-all">
              {hashA}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="text-xs font-semibold text-purple-400">
              {language === 'vi' ? 'Đầu vào B (Đổi chữ hoa/thường)' : 'Input Payload B (Slight Variation)'}
            </label>
            <input
              type="text"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-purple-500"
            />
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs break-all">
              {hashB.split('').map((c, i) => (
                <span key={i} className={c !== hashA[i] ? 'text-rose-400 font-bold bg-rose-950 px-0.5 rounded' : 'text-slate-400'}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
