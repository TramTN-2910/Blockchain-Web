'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  Link as LinkIcon, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Unlock, 
  Zap, 
  ShieldCheck, 
  Boxes 
} from 'lucide-react';
import Link from 'next/link';

export default function BlockchainSimPrevHashPage() {
  const { language } = useLanguageStore();
  const { blockchain, linkBlockHandshake } = useBlockchainLifecycleStore();

  const block1 = blockchain[0] || {
    index: 0,
    hash: '0000abc1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    header: { nonce: 1042, timestamp: 1700000000000 }
  };
  const block2 = blockchain[1] || {
    index: 1,
    hash: '0000def78901234567890abcdef1234567890abcdef1234567890abcdef123456',
    header: { previousHash: block1.hash, nonce: 8941, timestamp: 1700000050000 }
  };

  const [isLinked, setIsLinked] = useState<boolean>(true);
  const [animatingBeam, setAnimatingBeam] = useState<boolean>(false);

  const handleTriggerHandshake = () => {
    setAnimatingBeam(true);
    setTimeout(() => {
      setIsLinked(true);
      linkBlockHandshake(1);
      setAnimatingBeam(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-cyan-950/40 to-slate-900 border border-blue-800/40">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[11px] font-extrabold text-blue-300 whitespace-nowrap tracking-wider shrink-0">
              SIM 4
            </span>
            <span>{language === 'vi' ? 'Mô Phỏng Blockchain • Previous Hash' : 'Blockchain Sim • Previous Hash'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Liên Kết Mắt Xích & Con Trỏ Ngược' : 'Cryptographic Linkage & Reverse Pointers'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Current Hash của khối trước được nhúng chặt chẽ vào Previous Hash của khối sau để tạo thành mắt xích bất biến.'
              : 'Current hash of previous block is strictly embedded into the next block header as Previous Hash.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/blockchain-sim/pos"
            prefetch={true}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>{language === 'vi' ? 'Sang Đồng Thuận PoS' : 'Next: PoS Consensus'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-cyan-400" />
            {language === 'vi'
              ? 'Đấu Nối Con Trỏ Ngược (Reverse Pointer) Giữa 2 Khối'
              : 'Reverse Pointer Handshake Between 2 Blocks'}
          </h2>

          <div className="flex items-center gap-2">
            {!isLinked ? (
              <button
                onClick={handleTriggerHandshake}
                disabled={animatingBeam}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold shadow-lg flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Đấu Nối Mắt Xích' : 'Connect Link'}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsLinked(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                {language === 'vi' ? 'Thử Ngắt Liên Kết' : 'Break Link'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Block #1 */}
          <div className="p-6 rounded-3xl bg-slate-950/90 border-2 border-cyan-500/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-cyan-600 text-white font-bold font-mono text-xs flex items-center justify-center">#1</span>
                <span className="text-sm font-bold text-white">
                  {language === 'vi' ? 'Khối Nguồn (Block #1)' : 'Source Block (Block #1)'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-bold bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800">
                <Lock className="w-3 h-3" />
                <span>{language === 'vi' ? 'ĐÃ KHÓA (LOCKED)' : 'LOCKED'}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono text-slate-400">
              <div>Nonce: <span className="text-slate-200">{block1.header.nonce}</span></div>
              <div>Timestamp: <span className="text-slate-200">{block1.header.timestamp}</span></div>
            </div>

            <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/60 space-y-1">
              <div className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Current Block Hash:
              </div>
              <div className="font-mono text-xs text-cyan-300 break-all font-bold">{block1.hash}</div>
            </div>
          </div>

          {/* Block #2 */}
          <div
            className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${
              isLinked ? 'bg-slate-950/90 border-emerald-500/80 shadow-xl' : 'bg-amber-950/20 border-amber-500/80 shadow-xl'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-xl font-bold font-mono text-xs flex items-center justify-center text-white ${isLinked ? 'bg-emerald-600' : 'bg-amber-600'}`}>#2</span>
                <span className="text-sm font-bold text-white">
                  {language === 'vi' ? 'Khối Đích (Block #2)' : 'Target Block (Block #2)'}
                </span>
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${isLinked ? 'text-emerald-400 bg-emerald-950 border-emerald-800' : 'text-amber-400 bg-amber-950 border-amber-800'}`}>
                {isLinked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                <span>
                  {isLinked
                    ? (language === 'vi' ? 'LIÊN KẾT HOÀN TẤT' : 'LINKED')
                    : (language === 'vi' ? 'CHỜ ĐẤU NỐI' : 'WAITING LINK')}
                </span>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border space-y-1 ${isLinked ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-amber-950/40 border-dashed border-amber-500/80'}`}>
              <div className="text-[10px] uppercase font-bold text-slate-400">Previous Block Hash:</div>
              <div className="font-mono text-xs break-all font-bold text-emerald-300">
                {isLinked ? block1.hash : '0000000000000000000000000000000000000000000000000000000000000000'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Calculated Block Hash:</div>
              <div className="font-mono text-xs text-purple-300 break-all font-bold">
                {isLinked ? block2.hash : (language === 'vi' ? '----------------- CHƯA BĂM -----------------' : '----------------- UNHASHED -----------------')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
