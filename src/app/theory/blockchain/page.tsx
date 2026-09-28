'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Layers, Database, Lock, Globe, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TheoryBlockchainPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>{language === 'vi' ? 'Lý Thuyết Cốt Lõi • Phần 1' : 'Core Theory • Part 1'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'vi' ? 'Công Nghệ Chuỗi Khối (Blockchain)' : 'Blockchain Fundamentals'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'Blockchain là một cuốn sổ cái số phân tán (Distributed Ledger), phi tập trung và bất biến, lưu trữ dữ liệu dưới dạng các khối (blocks) được liên kết chặt chẽ bằng mật mã học.'
            : 'Blockchain is a decentralized, immutable distributed ledger that stores information in cryptographically linked batches called blocks.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? '1. Tính Phi Tập Trung (Decentralization)' : '1. Decentralization'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Không có máy chủ trung tâm đơn lẻ nào kiểm soát mạng lưới. Dữ liệu được sao chép và đồng bộ hóa đồng thời trên hàng nghìn Node máy tính độc lập trên khắp thế giới.'
              : 'No single central authority controls the network. The ledger is replicated across thousands of independent nodes worldwide.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? '2. Tính Bất Biến & Chống Gian Lận (Immutability)' : '2. Immutability'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Khi một khối đã được mạng lưới đồng thuận chấp thuận, không ai có thể âm thầm sửa đổi dữ liệu vì bất kỳ sự thay đổi nào cũng làm hỏng liên kết Previous Hash của các khối tiếp theo.'
              : 'Once recorded, block data cannot be altered retroactively without recalculating all subsequent blocks and gaining network consensus.'}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <span />
        <Link
          href="/theory/wallet"
          prefetch={true}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
        >
          <span>{language === 'vi' ? 'Học Tiếp: Ví Điện Tử' : 'Next: Wallet Theory'}</span>
        </Link>
      </div>
    </div>
  );
}
