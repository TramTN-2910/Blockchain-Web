'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  BookOpen, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Boxes, 
  Flame, 
  Server, 
  GraduationCap,
  ExternalLink
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
    color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
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
    color: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
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
    color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
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
    color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
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
    color: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
    links: [
      { labelVi: 'Giả Mạo Giao Dịch', labelEn: 'Tamper TX', href: '/attack-sim/tamper-tx' },
      { labelVi: 'Can Thiệp Thân Khối', labelEn: 'Tamper Block', href: '/attack-sim/tamper-block' },
      { labelVi: 'Phân Tích Băm Avalanche', labelEn: 'Check Hash Diff', href: '/attack-sim/check-hash' },
      { labelVi: 'Kiểm Tra Chuỗi Cascade', labelEn: 'Check Chain Cascade', href: '/attack-sim/check-chain' },
      { labelVi: 'Đào Lại 51% & Khôi Phục', labelEn: 'Re-mine & Reset', href: '/attack-sim/reset' }
    ]
  },
  {
    titleVi: '6. Mạng Lưới P2P & Nodes',
    titleEn: '6. P2P Mesh Network & Nodes',
    descVi: 'Bản đồ Topology phân tán, ma trận liên kết ngang hàng, lan truyền Gossip và đồng bộ sổ cái.',
    descEn: 'Mesh topology graph, peer link matrix, gossip flooding simulator, and state sync console.',
    icon: Server,
    color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    links: [
      { labelVi: 'Danh Sách Nút', labelEn: 'Node Registry', href: '/network-nodes/nodes' },
      { labelVi: 'Sơ Đồ Mạng P2P', labelEn: 'Mesh Topology', href: '/network-nodes/network' },
      { labelVi: 'Quản Lý Kết Nối', labelEn: 'Peer Matrix', href: '/network-nodes/connections' },
      { labelVi: 'Lan Truyền Gossip', labelEn: 'Gossip Broadcast', href: '/network-nodes/broadcast' },
      { labelVi: 'Đồng Bộ Sổ Cái', labelEn: 'Ledger Sync', href: '/network-nodes/sync' },
      { labelVi: 'Nhật Ký Mạng Lưới', labelEn: 'Event Logs Console', href: '/network-nodes/logs' }
    ]
  }
];

export default function DocsPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-800/40">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[11px] font-extrabold text-purple-300 whitespace-nowrap tracking-wider shrink-0">
              ABOUT 4
            </span>
            <span>
              {language === 'vi' ? 'Về Chúng Tôi • Tài Liệu & Hướng Dẫn' : 'About Us • Documentation'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Hướng Dẫn Sử Dụng & Tra Cứu Toàn Diện (Docs)' : 'User Guide & Comprehensive Docs'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Mục lục tổng hợp liên kết điều hướng nhanh tới tất cả các trạm thí nghiệm và học phần lý thuyết.'
              : 'Complete table of contents and quick jump index to all theory and interactive simulation labs.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/quiz"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Làm Bài Trắc Nghiệm' : 'Take Quiz'}</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DOC_SECTIONS.map((section, idx) => {
          const IconComponent = section.icon;

          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${section.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-sm">
                    {language === 'vi' ? section.titleVi : section.titleEn}
                  </h3>
                </div>

                <p className="text-xs text-slate-400">
                  {language === 'vi' ? section.descVi : section.descEn}
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-800">
                {section.links.map((link, linkIdx) => (
                  <Link
                    key={linkIdx}
                    href={link.href}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950 hover:bg-purple-950/40 text-xs text-slate-300 hover:text-purple-300 border border-slate-800/80 transition-colors"
                  >
                    <span>{language === 'vi' ? link.labelVi : link.labelEn}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
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
