'use client';

import React, { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { sha256 } from '@/lib/crypto/lifecycleCrypto';
import { 
  Hash, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  AlertOctagon,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function CheckHashIntegrityPage() {
  const { language } = useLanguageStore();

  const [inputA, setInputA] = useState('Blockchain Ledger Transaction: Alice sends Bob 100 COIN');
  const [inputB, setInputB] = useState('Blockchain Ledger Transaction: Alice sends Bob 101 COIN');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const hashA = sha256(inputA);
  const hashB = sha256(inputB);

  // Compare diff character by character
  let diffCount = 0;
  for (let i = 0; i < 64; i++) {
    if (hashA[i] !== hashB[i]) diffCount++;
  }
  const diffPercentage = Math.round((diffCount / 64) * 100);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-rose-950/40 to-slate-900 border border-red-800/40">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-[11px] font-extrabold text-rose-300 whitespace-nowrap tracking-wider shrink-0">
              ATK 3
            </span>
            <span>
              {language === 'vi' ? 'Mô Phỏng Tấn Công • Kiểm Tra Mã Băm' : 'Attack Sim • Check Hash Integrity'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Phân Tích Hiệu Ứng Thác Đổ (Avalanche Hash Diff)' : 'Avalanche Hash Diff Analyzer'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'So sánh độ biến thiên mã băm SHA-256 khi chỉ thay đổi 1 ký tự dữ liệu (Avalanche Effect).'
              : 'Analyze SHA-256 avalanche effect when altering a single character in the payload.'}
          </p>
        </div>

        <Link
          href="/attack-sim/check-chain"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 text-xs font-bold transition-all"
        >
          <span>{language === 'vi' ? 'Kiểm Tra Chuỗi' : 'Check Chain'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Hash className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{language === 'vi' ? 'Độ Dài Hash Chuẩn' : 'Hash Length'}</div>
            <div className="text-xl font-black text-white">256 bits (64 hex)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{language === 'vi' ? 'Số Ký Tự Khác Biệt' : 'Diff Characters'}</div>
            <div className="text-xl font-black text-rose-400">{diffCount} / 64 hex</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{language === 'vi' ? 'Tỉ Lệ Đảo Băm (Avalanche)' : 'Avalanche Flip Rate'}</div>
            <div className="text-xl font-black text-purple-300">{diffPercentage}%</div>
          </div>
        </div>
      </div>

      {/* Side by side comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sample A */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">
              {language === 'vi' ? 'Dữ Liệu Gốc A (Original Payload)' : 'Original Payload A'}
            </h3>
            <button
              onClick={() => handleCopy(hashA, 'hashA')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedHash === 'hashA' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Hash
            </button>
          </div>

          <textarea
            rows={3}
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
          />

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
              SHA-256 Digest (A):
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-blue-300 break-all">
              {hashA}
            </div>
          </div>
        </div>

        {/* Sample B */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider">
              {language === 'vi' ? 'Dữ Liệu Giả Mạo B (Tampered Payload)' : 'Tampered Payload B'}
            </h3>
            <button
              onClick={() => handleCopy(hashB, 'hashB')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedHash === 'hashB' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Hash
            </button>
          </div>

          <textarea
            rows={3}
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
            className="w-full bg-slate-950 border border-rose-500/40 rounded-2xl p-3 text-xs text-rose-200 font-mono focus:border-rose-500 focus:outline-none"
          />

          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
              SHA-256 Digest (B):
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-rose-900/40 font-mono text-xs text-rose-300 break-all">
              {hashB}
            </div>
          </div>
        </div>
      </div>

      {/* Bit by bit visual diff */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          {language === 'vi' ? 'Trực Quan Hóa Từng Ký Tự Hex Bị Thay Đổi' : 'Hex Character Diff Matrix'}
        </h3>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="grid grid-cols-8 sm:grid-cols-16 md:grid-cols-32 gap-1 font-mono text-center text-xs">
            {hashB.split('').map((char, index) => {
              const isDiff = char !== hashA[index];
              return (
                <div
                  key={index}
                  className={`p-1.5 rounded font-bold transition-all ${
                    isDiff
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                  title={`Pos ${index}: '${hashA[index]}' -> '${char}'`}
                >
                  {char}
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-slate-400">
          {language === 'vi'
            ? '💡 Chú thích: Các ô màu đỏ biểu thị vị trí ký tự Hex bị đảo lộn hoàn toàn sau khi chỉ sửa 1 ký tự dữ liệu đầu vào. Đây là tính chất then chốt khiến Blockchain không thể bị can thiệp lén lút.'
            : '💡 Red cells represent flipped hex characters caused by altering a single byte in input. This avalanche effect guarantees blockchain tamper-evidence.'}
        </p>
      </div>
    </div>
  );
}
