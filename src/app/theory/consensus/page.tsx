'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { ShieldCheck, Pickaxe, Coins, Scale, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TheoryConsensusPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>{language === 'vi' ? 'Lý Thuyết Cốt Lõi • Phần 7' : 'Core Theory • Part 7'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'vi' ? 'Cơ Chế Đồng Thuận (Consensus Mechanisms)' : 'Consensus Mechanisms'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'Cơ chế đồng thuận là tập hợp các quy tắc và thuật toán kinh tế giúp các Node độc lập trong mạng lưới phân tán thống nhất trạng thái sổ cái duy nhất mà không cần tin tưởng lẫn nhau.'
            : 'Consensus mechanisms are algorithmic and economic rules ensuring distributed nodes agree on a single source of truth without central trust.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PoW */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase font-mono bg-amber-950 px-2 py-0.5 rounded">
              Proof of Work (PoW)
            </span>
            <Pickaxe className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Bằng Chứng Công Việc' : 'Proof of Work'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Thợ đào (Miners) cạnh tranh giải câu đố toán học tìm Nonce thỏa mãn độ khó (Difficulty Target). Tiêu tốn nhiều năng lượng điện toán nhưng bảo mật tuyệt đối (áp dụng trên Bitcoin).'
              : 'Miners compete to solve mathematical puzzles by finding a valid Nonce below the Difficulty Target. Highly energy-intensive but proven secure (Bitcoin model).'}
          </p>
        </div>

        {/* PoS */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase font-mono bg-emerald-950 px-2 py-0.5 rounded">
              Proof of Stake (PoS)
            </span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Bằng Chứng Cổ Phần' : 'Proof of Stake'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Validator đặt cọc (Stake) tài sản token để tham gia quay số ngẫu nhiên có trọng số để được chọn đúc khối. Tiết kiệm 99.9% năng lượng, có cơ chế phạt Slashing khi gian lận (Ethereum 2.0).'
              : 'Validators lock up (stake) tokens to participate in pseudo-random weighted proposer selection. 99.9% energy efficient with slashing penalties for dishonest actors (Ethereum 2.0).'}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link href="/theory/block" className="text-xs font-semibold text-slate-400 hover:text-white">
          {language === 'vi' ? '← Quay lại Khối' : '← Back to Block'}
        </Link>
        <Link
          href="/theory/network"
          prefetch={true}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
        >
          <span>{language === 'vi' ? 'Học Tiếp: Mạng Lưới P2P' : 'Next: P2P Network Theory'}</span>
        </Link>
      </div>
    </div>
  );
}
