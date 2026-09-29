'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  Code2, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Database, 
  Sparkles, 
  ArrowRight, 
  Server, 
  Bot,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface TechLayer {
  titleVi: string;
  titleEn: string;
  badge: string;
  icon: any;
  color: string;
  items: { name: string; descVi: string; descEn: string }[];
}

const TECH_LAYERS: TechLayer[] = [
  {
    titleVi: 'Tầng Trực Quan Hóa & Giao Diện (Presentation & UI/UX)',
    titleEn: 'Presentation & UI/UX Visualization Layer',
    badge: 'Frontend',
    icon: Code2,
    color: 'border-purple-200 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400',
    items: [
      { name: 'Next.js 14 App Router', descVi: 'Kiến trúc React Server Components tối ưu SEO & routing đa tầng.', descEn: 'React Server Components with optimized nested routing.' },
      { name: 'TypeScript', descVi: 'Định kiểu tĩnh nghiêm ngặt 100% cho mô hình dữ liệu Block & Transaction.', descEn: 'Strict static type checking for Block and Tx data schemas.' },
      { name: 'Tailwind CSS & Glassmorphism', descVi: 'Hệ thống thiết kế Neon Cyberpunk mượt mà, hỗ trợ Dark/Light mode.', descEn: 'Neon Cyberpunk design system with Dark/Light mode support.' },
      { name: 'Framer Motion & SVG Canvas', descVi: 'Mô phỏng đồ họa chuyển động lan truyền mạng và hiệu ứng băm.', descEn: 'Smooth graph animations for network flooding and hashing effects.' }
    ]
  },
  {
    titleVi: 'Tầng Quản Lý Trạng Thái & Bộ Nhớ (State & Persistence)',
    titleEn: 'State Management & Persistence Layer',
    badge: 'State Engine',
    icon: Database,
    color: 'border-blue-200 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400',
    items: [
      { name: 'Zustand Store', descVi: 'State management siêu nhẹ, reactive cho Mempool, Chuỗi khối & Nodes.', descEn: 'Lightweight reactive store for Mempool, Blockchain & Nodes.' },
      { name: 'LocalStorage Persistence', descVi: 'Tự động lưu trữ và phục hồi chuỗi khối người dùng tạo trên trình duyệt.', descEn: 'Automatic state hydration and persistence across browser sessions.' }
    ]
  },
  {
    titleVi: 'Tầng Động Cơ Mật Mã Học (Cryptography Core Engine)',
    titleEn: 'Cryptographic Core Engine',
    badge: 'Crypto Core',
    icon: ShieldCheck,
    color: 'border-emerald-200 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400',
    items: [
      { name: 'ECDSA secp256k1', descVi: 'Ký số và xác thực chữ ký điện tử elliptic curve tiêu chuẩn Bitcoin/Ethereum.', descEn: 'Elliptic Curve Digital Signature Algorithm (Bitcoin/Ethereum standard).' },
      { name: 'Double SHA-256', descVi: 'Thuật toán băm mật mã học một chiều chuẩn NIST FIPS 180-4.', descEn: 'NIST standard cryptographic one-way hashing function.' },
      { name: 'BIP-39 Mnemonic', descVi: 'Thuật toán sinh seed phrase 12 từ khóa khôi phục ví chuẩn quốc tế.', descEn: 'Standard 12-word mnemonic phrase wallet generator.' },
      { name: 'Binary Merkle Tree', descVi: 'Cây băm nhị phân kiểm toán giao dịch với độ phức tạp O(log N).', descEn: 'Cryptographic binary hash tree with O(log N) verification.' }
    ]
  },
  {
    titleVi: 'Tầng Trợ Lý Trí Tuệ Nhân Tạo (AI Intelligence Layer)',
    titleEn: 'AI Intelligence & Assistant Layer',
    badge: 'AI & Admin',
    icon: Bot,
    color: 'border-amber-200 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400',
    items: [
      { name: 'Gemini AI API', descVi: 'Tích hợp mô hình AI giải đáp thắc mắc chuyên sâu về cơ chế chuỗi khối.', descEn: 'Deep blockchain explanation engine powered by Gemini AI API.' },
      { name: 'AI Quiz Question Parser', descVi: 'Công cụ Admin tự động phân tích và nhập câu hỏi trắc nghiệm bằng AI.', descEn: 'Automated AI-assisted quiz question generator and importer.' }
    ]
  }
];

export default function TechnologyPage() {
  const { language } = useLanguageStore();
  const isEn = language === 'en';

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-100/70 via-indigo-100/60 to-slate-100/80 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-slate-900 border border-purple-200/80 dark:border-purple-800/40 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[11px] font-extrabold text-purple-700 dark:text-purple-300 whitespace-nowrap tracking-wider shrink-0">
              ABOUT 3
            </span>
            <span>
              {isEn ? 'About Us • Tech Stack' : 'Về Chúng Tôi • Kiến Trúc Công Nghệ'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isEn ? 'Full-Stack System Architecture' : 'Kiến Trúc Toàn Diện Của Hệ Thống (System Architecture)'}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {isEn
              ? 'Multi-tiered architectural layers from visualization and crypto engine to state persistence and AI intelligence.'
              : 'Mô hình phân tầng công nghệ từ giao diện trực quan hóa, động cơ mật mã học đến trợ lý AI.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about-us/docs"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 text-xs font-bold transition-all"
          >
            <span>{isEn ? 'System Docs' : 'Tài Liệu Hướng Dẫn'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Tech Layers Cards */}
      <div className="space-y-6">
        {TECH_LAYERS.map((layer, idx) => {
          const IconComponent = layer.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${layer.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {isEn ? layer.titleEn : layer.titleVi}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {layer.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {layer.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {item.name}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isEn ? item.descEn : item.descVi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
