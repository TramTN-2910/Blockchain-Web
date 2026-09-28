'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Cpu, Code, Database, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function IntroTechStackPage() {
  const { language } = useLanguageStore();

  const technologies = [
    {
      categoryVi: 'Kiến Trúc Frontend',
      categoryEn: 'Frontend Core',
      stack: 'Next.js 14 (App Router) + React 18 + TypeScript',
      descVi: 'Kiến trúc Server/Client Components tối ưu hiệu năng, SSR và typing an toàn.',
      descEn: 'High-performance Server/Client Component architecture with SSR and strict static typing.'
    },
    {
      categoryVi: 'Đồ Họa & Chuyển Động',
      categoryEn: 'Animation & Graphics',
      stack: 'Framer Motion + HTML5 Canvas 60 FPS + Inline SVG',
      descVi: 'Trực quan hóa mạng lưới hạt photon, đồ thị cây nhị phân và sliding tabs mượt mà.',
      descEn: '60 FPS photon particle network visualizer, binary tree charts and smooth sliding tabs.'
    },
    {
      categoryVi: 'Trạng Thái & Lưu Trữ',
      categoryEn: 'State & Persistence',
      stack: 'Zustand Store + LocalStorage Middleware',
      descVi: 'Quản lý trạng thái ví, mempool, chuỗi khối và đồng bộ xuyên suốt các phòng thí nghiệm.',
      descEn: 'Lightweight reactive state management for wallets, mempools, and persistent blockchain state.'
    },
    {
      categoryVi: 'Động Cơ Mật Mã Học',
      categoryEn: 'Crypto Engines',
      stack: 'js-sha256 + ECDSA secp256k1 + Keccak-256 + BIP-39',
      descVi: 'Thuật toán mật mã học chạy 100% phía client, bảo đảm tốc độ tức thì không độ trễ mạng.',
      descEn: 'Client-side cryptographic execution enabling zero-latency calculations with real-time feedback.'
    },
    {
      categoryVi: 'Thiết Kế & Giao Diện',
      categoryEn: 'Styling & Theming',
      stack: 'Tailwind CSS + Dark/Light Theme (@theme-toggles)',
      descVi: 'Giao diện Fintech/Cyberpunk Glassmorphism chuẩn UI/UX cao cấp.',
      descEn: 'Modern Glassmorphism Cyberpunk UI/UX design system with seamless Dark/Light theming.'
    },
    {
      categoryVi: 'Trí Tuệ Nhân Tạo & API',
      categoryEn: 'AI & Backend API',
      stack: 'Mistral AI SDK + Supabase PostgreSQL Client',
      descVi: 'Trợ lý AI bóc tách đề thi thông minh và lưu trữ ngân hàng câu hỏi kiểm tra.',
      descEn: 'Smart AI-assisted exam parser and centralized cloud PostgreSQL database for questions.'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>{language === 'vi' ? 'Kiến Trúc Kỹ Thuật' : 'Technology Architecture'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'vi' ? 'Ngăn Xếp Công Nghệ (Tech Stack)' : 'Platform Technology Stack'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'Tổng hợp các công nghệ Web hiện đại và thư viện mật mã học chuyên dụng được ứng dụng trong quá trình phát triển HubBlock.'
            : 'Modern web technologies and specialized cryptographic libraries powering the HubBlock simulation platform.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {technologies.map((t, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2.5 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-800/60">
              {language === 'vi' ? t.categoryVi : t.categoryEn}
            </span>
            <h3 className="text-sm font-bold text-white font-mono mt-1">
              {t.stack}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'vi' ? t.descVi : t.descEn}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link
          href="/intro/workflow"
          prefetch={true}
          className="text-xs font-semibold text-slate-400 hover:text-white"
        >
          {language === 'vi' ? '← Quay lại Quy trình' : '← Back to Workflow'}
        </Link>
        <Link
          href="/theory/blockchain"
          prefetch={true}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
        >
          <span>{language === 'vi' ? 'Sang Thanh 2: Lý Thuyết Blockchain' : 'Explore Theory Module'}</span>
        </Link>
      </div>
    </div>
  );
}
