'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  Trophy, 
  Coins, 
  Zap, 
  ArrowRight, 
  Sliders, 
  RotateCw, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BlockchainSimPoSPage() {
  const { language } = useLanguageStore();
  const { validators, updateValidatorStake, runPoSProcess, slashValidator } = useBlockchainLifecycleStore();

  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<any>(null);

  const totalStake = validators.reduce((sum, v) => sum + (v.status === 'active' ? v.stakeAmount : 0), 0);

  const handleSpin = () => {
    setIsSpinning(true);
    setWinner(null);
    setTimeout(() => {
      const win = runPoSProcess();
      setWinner(win);
      setIsSpinning(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-purple-950/40 to-slate-900 border border-emerald-800/40">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[11px] font-extrabold text-emerald-300 whitespace-nowrap tracking-wider shrink-0">
              SIM 5
            </span>
            <span>{language === 'vi' ? 'Mô Phỏng Blockchain • Đồng Thuận PoS' : 'Blockchain Sim • PoS Consensus'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Xổ Số Trọng Số Cổ Phần & Chế Tài Slashing' : 'Weighted Stake Lottery & Slashing Mechanism'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Mô phỏng cơ chế lựa chọn Validator đúc khối theo tỷ lệ Stake, nhận thưởng và phạt vi phạm.'
              : 'Simulate validator block-proposer selection by stake weight, block rewards, and slashing penalties.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/blockchain-sim/block"
            prefetch={true}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>{language === 'vi' ? 'Sang Đóng Gói Khối' : 'Next: Block Assembly'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                {language === 'vi' ? 'Cổ Phần Staking' : 'Validator Staking Weights'}
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                {language === 'vi' ? 'Tổng:' : 'Total:'} {totalStake} HUB
              </span>
            </div>

            <div className="space-y-3">
              {validators.map((val) => {
                const percent = totalStake > 0 && val.status === 'active' ? Math.round((val.stakeAmount / totalStake) * 100) : 0;
                return (
                  <div key={val.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: val.color }} />
                        <span className="text-xs font-bold text-white">{val.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-cyan-300">{percent}%</span>
                        {val.status === 'slashed' ? (
                          <span className="text-[10px] text-rose-400 font-bold bg-rose-950 px-2 py-0.5 rounded">SLASHED</span>
                        ) : (
                          <button
                            onClick={() => slashValidator(val.id)}
                            className="p-1 rounded text-slate-500 hover:text-amber-400"
                            title={language === 'vi' ? 'Phạt vi phạm 20% Stake' : 'Slash 20% Stake'}
                          >
                            <Zap className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="50"
                        disabled={val.status === 'slashed'}
                        value={val.stakeAmount}
                        onChange={(e) => updateValidatorStake(val.id, Number(e.target.value))}
                        className="flex-1 accent-emerald-500 cursor-pointer disabled:opacity-30"
                      />
                      <span className="text-xs font-mono text-emerald-400 font-bold w-16 text-right">{val.stakeAmount} HUB</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                {language === 'vi' ? 'Vòng Quay Trọng Số Validator' : 'Validator Weighted Selection'}
              </h2>
              <button
                onClick={handleSpin}
                disabled={isSpinning || totalStake === 0}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{language === 'vi' ? 'Quay Số Đúc Khối' : 'Run PoS Selection'}</span>
              </button>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4">
              {isSpinning ? (
                <div className="space-y-3 py-6">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
                  <div className="text-xs font-bold text-slate-300 animate-pulse">
                    {language === 'vi' ? 'Đang quay số ngẫu nhiên theo tỷ lệ Stake...' : 'Simulating lottery weighted by stake percentage...'}
                  </div>
                </div>
              ) : winner ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3 py-4">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div className="text-lg font-bold text-white">
                    {winner.name} {language === 'vi' ? 'Chiến Thắng!' : 'Selected as Proposer!'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {language === 'vi'
                      ? 'Được quyền đóng gói khối tiếp theo và nhận thưởng '
                      : 'Authorized to propose the next block and awarded '}
                    <span className="text-emerald-400 font-bold font-mono">+2 HUB</span>.
                  </div>
                </motion.div>
              ) : (
                <div className="py-8 space-y-2 text-slate-500 text-xs">
                  <Coins className="w-8 h-8 mx-auto text-slate-600" />
                  <div>
                    {language === 'vi'
                      ? 'Bấm "Quay Số Đúc Khối" để mô phỏng thuật toán PoS.'
                      : 'Click "Run PoS Selection" to simulate the consensus lottery.'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
