'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { GitMerge, ArrowRight, Wallet, FileSignature, Layers, Network, Box, ShieldCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function IntroWorkflowPage() {
  const { language } = useLanguageStore();

  const steps = [
    { num: '01', titleVi: 'Khởi Tạo Danh Tính', titleEn: 'Identity Generation', icon: Wallet, descVi: 'Sinh cặp khóa ECDSA secp256k1 & địa chỉ ví 0x từ Seed Phrase 12 từ.', descEn: 'Generate ECDSA secp256k1 keypair & 0x address from 12-word seed phrase.' },
    { num: '02', titleVi: 'Soạn Thảo & Ký Số', titleEn: 'Draft & Sign Tx', icon: FileSignature, descVi: 'Dùng Private Key ký số thông điệp giao dịch để đảm bảo tính bất biến.', descEn: 'Sign transaction payload using Private Key to ensure tamper-proof integrity.' },
    { num: '03', titleVi: 'Phát Tán & Mempool', titleEn: 'Gossip & Mempool', icon: Network, descVi: 'Lan truyền qua mạng P2P và xếp vào hàng đợi Mempool theo phí Gas.', descEn: 'Gossip broadcast across P2P network and prioritize in Mempool by gas fee.' },
    { num: '04', titleVi: 'Gom Cụm Merkle Tree', titleEn: 'Merkle Aggregation', icon: Layers, descVi: 'Ghép cặp các giao dịch thành cây nhị phân để sinh ra Merkle Root duy nhất.', descEn: 'Aggregate transactions into a binary hash tree to produce a single Merkle Root.' },
    { num: '05', titleVi: 'Đồng Thuận & Đóng Khối', titleEn: 'Consensus & Block', icon: Box, descVi: 'Validator được chọn (PoS) hoặc giải Nonce (PoW) đóng gói Header và Body.', descEn: 'Selected validator (PoS) packs Header and Body into candidate block.' },
    { num: '06', titleVi: 'Nối Chuỗi & Kháng Tấn Công', titleEn: 'Handshake & Security', icon: ShieldCheck, descVi: 'Khóa mắt xích bằng Previous Hash và kiểm tra phát hiện gian lận tự động.', descEn: 'Link blocks via Previous Hash and run automated tamper detection.' }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <GitMerge className="w-4 h-4" />
          <span>{language === 'vi' ? 'Kiến Trúc Luồng Hoạt Động' : 'End-to-End System Workflow'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'vi' ? 'Quy Trình Vận Hành Toàn Diện' : 'Comprehensive Lifecycle Workflow'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? '6 giai đoạn liên kết chặt chẽ mô phỏng cách một giao dịch được khởi tạo từ thiết bị người dùng đến khi được lưu trữ vĩnh viễn trên sổ cái phân tán.'
            : '6 tightly coupled stages demonstrating how a transaction originates from user device to permanent storage on distributed ledger.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <div key={idx} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {language === 'vi' ? `Giai đoạn ${s.num}` : `Phase ${s.num}`}
                </span>
                <IconComp className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {language === 'vi' ? s.titleVi : s.titleEn}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'vi' ? s.descVi : s.descEn}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link
          href="/intro/goals"
          prefetch={true}
          className="text-xs font-semibold text-slate-400 hover:text-white"
        >
          {language === 'vi' ? '← Quay lại Mục tiêu' : '← Back to Goals'}
        </Link>
        <Link
          href="/intro/tech-stack"
          prefetch={true}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
        >
          <span>{language === 'vi' ? 'Xem Ngăn Xếp Công Nghệ' : 'View Tech Stack'}</span>
        </Link>
      </div>
    </div>
  );
}
