'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Boxes, 
  Flame, 
  GraduationCap,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface DocSection {
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  icon: any;
  color: string;
  links: { labelVi: string; labelEn: string; href: string }[];
}

const DOC_SECTIONS: DocSection[] = [
  {
    titleVi: '1. Giới Thiệu & Mục Tiêu Đề Tài',
    titleEn: '1. Introduction & Objectives',
    descVi: 'Tổng quan nền tảng trực quan hóa chuỗi khối, luồng học tập và công nghệ.',
    descEn: 'Platform overview, structured learning workflows, and technology stack.',
    icon: Sparkles,
    color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/20 border-purple-200 dark:border-purple-500/30',
    links: [
      { labelVi: 'Tổng Quan Hệ Thống', labelEn: 'System Overview', href: '/intro/overview' },
      { labelVi: 'Mục Tiêu Nghiên Cứu', labelEn: 'Project Goals', href: '/intro/goals' },
      { labelVi: 'Quy Trình Học Tập', labelEn: 'Learning Workflow', href: '/intro/workflow' },
      { labelVi: 'Tech Stack', labelEn: 'Tech Stack', href: '/intro/tech-stack' }
    ]
  },
  {
    titleVi: '2. Cơ Sở Lý Thuyết Toàn Diện',
    titleEn: '2. Theoretical Foundations',
    descVi: 'Khái niệm nền tảng từ Ví, Giao dịch, Mã băm đến Thuật toán đồng thuận & Mạng P2P.',
    descEn: 'Foundational concepts from Wallets, Hashes to Consensus and P2P networks.',
    icon: GraduationCap,
    color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30',
    links: [
      { labelVi: 'Khái Niệm Blockchain', labelEn: 'Blockchain Theory', href: '/theory/blockchain' },
      { labelVi: 'Ví & Cặp Khóa', labelEn: 'Wallets & Keys', href: '/theory/wallet' },
      { labelVi: 'Giao Dịch & Phí Gas', labelEn: 'Transactions & Gas', href: '/theory/transaction' },
      { labelVi: 'Hàm Băm SHA-256', labelEn: 'SHA-256 Hash', href: '/theory/hash' },
      { labelVi: 'Chữ Ký Số ECDSA', labelEn: 'Digital Signature', href: '/theory/digital-signature' },
      { labelVi: 'Cấu Trúc Khối', labelEn: 'Block Anatomy', href: '/theory/block' },
      { labelVi: 'Cơ Chế Đồng Thuận PoS', labelEn: 'PoS Consensus', href: '/theory/consensus' },
      { labelVi: 'Mạng Ngang Hàng P2P', labelEn: 'P2P Network', href: '/theory/network' }
    ]
  },
  {
    titleVi: '3. Phòng Thí Nghiệm Mật Mã (Crypto Lab)',
    titleEn: '3. Cryptographic Lab',
    descVi: 'Tương tác trực tiếp tạo ví BIP-39, băm SHA-256, ký và xác minh chữ ký ECDSA.',
    descEn: 'Interactive labs for BIP-39 wallet creation, SHA-256 hash, and ECDSA signature verification.',
    icon: ShieldCheck,
    color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/20 border-cyan-200 dark:border-cyan-500/30',
    links: [
      { labelVi: 'Trình Tạo Ví BIP-39', labelEn: 'BIP-39 Wallet Lab', href: '/crypto-lab/wallet' },
      { labelVi: 'Thí Nghiệm Băm SHA-256', labelEn: 'SHA-256 Lab', href: '/crypto-lab/hash' },
      { labelVi: 'Ký Số Giao Dịch ECDSA', labelEn: 'ECDSA Signing Lab', href: '/crypto-lab/digital-signature' },
      { labelVi: 'Xác Minh Chữ Ký Số', labelEn: 'Signature Verification Lab', href: '/crypto-lab/signature-verification' }
    ]
  },
  {
    titleVi: '4. Mô Phỏng Blockchain Sandbox',
    titleEn: '4. Blockchain Simulation Sandbox',
    descVi: 'Khởi tạo giao dịch, hàng đợi Mempool, gom cây Merkle, chọn Validator PoS và đóng khối.',
    descEn: 'Create transactions, queue mempool, build Merkle tree, select PoS validators, and explore chain.',
    icon: Boxes,
    color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/30',
    links: [
      { labelVi: 'Tạo Giao Dịch', labelEn: 'Transaction Lab', href: '/blockchain-sim/transaction' },
      { labelVi: 'Hàng Đợi Mempool', labelEn: 'Mempool Queue', href: '/blockchain-sim/mempool' },
      { labelVi: 'Cây Merkle Tree', labelEn: 'Merkle Tree', href: '/blockchain-sim/merkle-tree' },
      { labelVi: 'Liên Kết Previous Hash', labelEn: 'Previous Hash', href: '/blockchain-sim/previous-hash' },
      { labelVi: 'Đồng Thuận PoS', labelEn: 'PoS Staking', href: '/blockchain-sim/pos' },
      { labelVi: 'Lắp Ráp Khối', labelEn: 'Block Assembly', href: '/blockchain-sim/block' },
      { labelVi: 'Khám Phá Chuỗi Khối', labelEn: 'Chain Explorer', href: '/blockchain-sim/blockchain' }
    ]
  },
  {
    titleVi: '5. Mô Phỏng Tấn Công & Phòng Thủ',
    titleEn: '5. Attack & Defense Simulation',
    descVi: 'Can thiệp sửa giao dịch, giả mạo thân khối, hiệu ứng Avalanche và đào lại 51%.',
    descEn: 'Tamper transactions, modify block history, inspect avalanche effect, and simulate 51% re-mining.',
    icon: Flame,
    color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/20 border-rose-200 dark:border-rose-500/30',
    links: [
      { labelVi: 'Can Thiệp Giao Dịch', labelEn: 'Tamper Transaction', href: '/attack-sim/tamper-tx' },
      { labelVi: 'Sửa Đổi Thân Khối', labelEn: 'Tamper Block', href: '/attack-sim/tamper-block' },
      { labelVi: 'Kiểm Tra Chuỗi', labelEn: 'Check Chain Integrity', href: '/attack-sim/check-chain' },
      { labelVi: 'Kiểm Tra Hash', labelEn: 'Check Hash Propagation', href: '/attack-sim/check-hash' },
      { labelVi: 'Khôi Phục Trạng Thái Gốc', labelEn: 'Reset Chain State', href: '/attack-sim/reset' }
    ]
  }
];

export default function DocsIndexPage() {
  const { language } = useLanguageStore();
  const isEn = language === 'en';

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-100/70 via-indigo-100/60 to-slate-100/80 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-slate-900 border border-purple-200/80 dark:border-purple-800/40 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[11px] font-extrabold text-purple-700 dark:text-purple-300 whitespace-nowrap tracking-wider shrink-0">
              ABOUT 4
            </span>
            <span>
              {isEn ? 'About Us • Documentation Map' : 'Về Chúng Tôi • Bản Đồ Tài Liệu'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isEn ? 'Complete Documentation & Simulation Directory' : 'Hệ Thống Bản Đồ Tài Liệu & Phân Hệ Mô Phỏng'}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {isEn
              ? 'Comprehensive index connecting theoretical articles, cryptographic labs, sandbox simulations, and assessment modules.'
              : 'Mục lục kết nối toàn diện tất cả các bài học lý thuyết, phòng thí nghiệm mật mã và bài kiểm tra trắc nghiệm.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/quiz"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 text-xs font-bold transition-all"
          >
            <span>{isEn ? 'Take Assessment' : 'Trung Tâm Quiz'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DOC_SECTIONS.map((sec, idx) => {
          const IconComponent = sec.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${sec.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      {isEn ? sec.titleEn : sec.titleVi}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEn ? sec.descEn : sec.descVi}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sec.links.map((link, lIdx) => (
                  <Link
                    key={lIdx}
                    href={link.href}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/60 dark:border-slate-800/60 hover:border-purple-300 dark:hover:border-purple-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 transition-all group"
                  >
                    <span className="truncate">{isEn ? link.labelEn : link.labelVi}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
