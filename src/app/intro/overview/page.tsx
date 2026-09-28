'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/useLanguageStore';
import { BookOpen, Sparkles, Shield, Cpu, ArrowRight, Layers, Lock, Zap } from 'lucide-react';
import Link from 'next/link';

export default function IntroOverviewPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-purple-950/40 to-slate-900/90 border border-purple-800/40 p-6 sm:p-10 shadow-2xl">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>HubBlock • Đại học Ngân hàng TP.HCM (HUB)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            {language === 'vi'
              ? 'Tổng Quan Dự Án Mô Phỏng Blockchain'
              : 'Blockchain Simulation Platform Overview'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {language === 'vi'
              ? 'Nền tảng trực quan hóa tương tác chuyên sâu về Mật mã học (Cryptography), Cấu trúc Khối, Cơ chế Đồng thuận (PoS/PoW) và Mạng lưới ngang hàng (P2P Mesh). Dự án được thiết kế nhằm xóa bỏ rào cản lý thuyết trừu tượng, mang đến trải nghiệm học tập thực nghiệm sống động.'
              : 'An in-depth interactive visualization platform for Cryptography, Block Structures, Consensus Mechanisms (PoS/PoW) and Peer-to-Peer Networks, bridging the gap between theoretical knowledge and practical comprehension.'}
          </p>
        </div>
      </div>

      {/* 3 Core Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {language === 'vi' ? 'Mật Mã Học Thực Nghiệm' : 'Hands-on Cryptography'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Mổ xẻ từng bit trong 6 bước nén SHA-256, sinh khóa ECDSA secp256k1 và kiểm chứng chữ ký số thời gian thực.'
              : 'Deconstruct SHA-256 compression bitwise, generate ECDSA secp256k1 keys and verify digital signatures in real-time.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {language === 'vi' ? 'Chuỗi Khối Tương Tác' : 'Interactive Blockchain'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Tự tay đóng gói giao dịch, ghép cây Merkle, thiết lập Previous Hash và trải nghiệm cơ chế PoS có trọng số.'
              : 'Package transactions, assemble Merkle Trees, wire Previous Hashes and explore weighted PoS consensus.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {language === 'vi' ? 'Mô Phỏng Tấn Công & Phòng Thủ' : 'Attack & Security Simulator'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Thử nghiệm can thiệp sửa đổi giao dịch trong quá khứ để quan sát chuỗi bị đứt gãy và chi phí tính toán khi đào lại.'
              : 'Tamper historical transactions to witness chain invalidation and calculate computational cost of re-mining.'}
          </p>
        </div>
      </div>

      {/* CTA to next sub-tab */}
      <div className="flex justify-end">
        <Link
          href="/intro/goals"
          prefetch={true}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
        >
          <span>{language === 'vi' ? 'Xem Mục Tiêu Đề Tài' : 'View Project Goals'}</span>
        </Link>
      </div>
    </div>
  );
}
