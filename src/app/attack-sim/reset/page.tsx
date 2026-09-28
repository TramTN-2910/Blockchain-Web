'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  RefreshCw, 
  Cpu, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Coins,
  Play
} from 'lucide-react';
import Link from 'next/link';

export default function ReMineAndResetPage() {
  const { language } = useLanguageStore();
  const { blockchain, reMineBlockchain, resetAllLifecycleData } = useBlockchainLifecycleStore();

  const [isMining, setIsMining] = useState(false);
  const [mineProgress, setMineProgress] = useState(0);

  const handleReMine = () => {
    setIsMining(true);
    setMineProgress(10);

    const interval = setInterval(() => {
      setMineProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          reMineBlockchain();
          setIsMining(false);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const isChainValid = blockchain.every((b) => b.isValid);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-rose-950/40 to-slate-900 border border-red-800/40">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-[11px] font-extrabold text-rose-300 whitespace-nowrap tracking-wider shrink-0">
              ATK 5
            </span>
            <span>
              {language === 'vi' ? 'Mô Phỏng Tấn Công • Đào Lại & Khôi Phục' : 'Attack Sim • Re-mine & Reset'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Mô Phỏng Tấn Công 51% & Đào Lại Chuỗi (Re-mining Attack)' : '51% Attack & Re-mining Simulator'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Để hợp thức hóa một khối bị sửa, kẻ tấn công phải đào lại toàn bộ các khối phía sau để vượt qua chuỗi trung thực.'
              : 'To validate a tampered block, an attacker must re-calculate nonces and hashes for all subsequent blocks.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetAllLifecycleData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'vi' ? 'Khôi Phục Mặc Định' : 'Factory Reset'}
          </button>
          <Link
            href="/network-nodes/nodes"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Mạng Lưới Nodes' : 'Network Nodes'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Control Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Re-mine Action Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                {language === 'vi' ? 'Tấn Công Đào Lại Toàn Chuỗi (Re-mine)' : 'Re-mine Full Blockchain'}
              </h2>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                PoW / PoS Brute Force
              </span>
            </div>

            <p className="text-xs text-slate-400">
              {language === 'vi'
                ? 'Tính toán lại Proof-of-Work/PoS, cập nhật PreviousHash mới cho toàn bộ các khối từ điểm bị sửa đến khối mới nhất.'
                : 'Recomputes PoW/PoS nonces and rewires PreviousHash links for all blocks to forge a newly valid chain.'}
            </p>

            {isMining && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-amber-300">
                  <span>{language === 'vi' ? 'Đang tính toán Nonce & Hash...' : 'Computing Hashes...'}</span>
                  <span>{mineProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
                    style={{ width: `${mineProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleReMine}
            disabled={isMining}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all ${
              isMining
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
            }`}
          >
            <Cpu className="w-4 h-4" />
            {isMining
              ? (language === 'vi' ? 'Đang Đào Lại Chuỗi...' : 'Re-mining in progress...')
              : (language === 'vi' ? 'Bắt Đầu Đào Lại (Re-mine Chain)' : 'Start Re-mining Chain')}
          </button>
        </div>

        {/* Factory Reset Action Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-400" />
                {language === 'vi' ? 'Khôi Phục Trạng Thái Ban Đầu' : 'Factory Reset Ledger'}
              </h2>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Safe State
              </span>
            </div>

            <p className="text-xs text-slate-400">
              {language === 'vi'
                ? 'Khôi phục lại chuỗi khối nguyên bản (Genesis + Block 1), nạp lại số dư ví gốc và dọn sạch Mempool.'
                : 'Resets the ledger back to clean Genesis + Block 1, restores default balances, and clears temporary mempools.'}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Alice: 100 COIN, Bob: 50 COIN, Charlie: 25 COIN</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>2 Blocks hợp lệ, 6 Nodes P2P hoạt động bình thường</span>
              </div>
            </div>
          </div>

          <button
            onClick={resetAllLifecycleData}
            className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            {language === 'vi' ? 'Khôi Phục Toàn Bộ Hệ Thống' : 'Reset Everything'}
          </button>
        </div>
      </div>

      {/* Current Chain Status */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            {language === 'vi' ? 'Trạng Thái Sổ Cái Hiện Tại' : 'Current Chain Status'}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isChainValid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {isChainValid ? 'Chain Valid' : 'Chain Broken'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {blockchain.map((b) => (
            <div key={b.index} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-mono">Block #{b.index}</span>
                <span className={b.isValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {b.isValid ? 'Valid' : 'Tampered'}
                </span>
              </div>
              <div className="font-mono text-[10px] text-slate-400 truncate">
                Hash: {b.hash}
              </div>
              <div className="font-mono text-[10px] text-slate-500 truncate">
                Prev: {b.header.previousHash}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
