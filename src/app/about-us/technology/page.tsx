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
    color: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
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
    color: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
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
    color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
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
    color: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
    items: [
      { name: 'Gemini AI API', descVi: 'Tích hợp mô hình AI giải đáp thắc mắc chuyên sâu về cơ chế chuỗi khối.', descEn: 'Deep blockchain explanation engine powered by Gemini AI API.' },
      { name: 'AI Quiz Question Parser', descVi: 'Công cụ Admin tự động phân tích và nhập câu hỏi trắc nghiệm bằng AI.', descEn: 'Automated AI-assisted quiz question generator and importer.' }
    ]
  }
];

export default function TechnologyPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-800/40">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[11px] font-extrabold text-purple-300 whitespace-nowrap tracking-wider shrink-0">
              ABOUT 3
            </span>
            <span>
              {language === 'vi' ? 'Về Chúng Tôi • Kiến Trúc Công Nghệ' : 'About Us • Tech Stack'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Kiến Trúc Toàn Diện Của Hệ Thống (System Architecture)' : 'Full-Stack System Architecture'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Mô hình phân tầng công nghệ từ giao diện trực quan hóa, động cơ mật mã học đến trợ lý AI.'
              : 'Multi-layer technical architecture spanning visualization, cryptographic engine, and AI assistant.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about-us/docs"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Tài Liệu Hướng Dẫn' : 'Docs & Guides'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Tech Architecture Stack */}
      <div className="space-y-6">
        {TECH_LAYERS.map((layer, idx) => {
          const IconComponent = layer.icon;

          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${layer.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {language === 'vi' ? layer.titleVi : layer.titleEn}
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-bold uppercase">
                  {layer.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {layer.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="font-bold text-white text-xs">{item.name}</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      {language === 'vi' ? item.descVi : item.descEn}
                    </div>
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
