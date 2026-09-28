'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Box, Layers, Link as LinkIcon, Cpu, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TheoryBlockPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Box className="w-4 h-4" />
          <span>{language === 'vi' ? 'Lý Thuyết Cốt Lõi • Phần 6' : 'Core Theory • Part 6'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'vi' ? 'Cấu Trúc Khối (Block Architecture)' : 'Block Anatomy & Packaging'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'Mỗi khối trong Blockchain gồm hai thành phần chính: Tiêu đề khối (Block Header) chứa các siêu dữ liệu mật mã và Thân khối (Block Body) chứa danh sách các giao dịch.'
            : 'Each block comprises two primary sections: the Block Header containing cryptographic metadata and the Block Body containing verified transactions.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            {language === 'vi' ? '1. Tiêu Đề Khối (Block Header - 80 bytes)' : '1. Block Header (80 bytes)'}
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>• <strong>Block Version:</strong> {language === 'vi' ? 'Phiên bản giao thức của khối.' : 'Protocol version rules.'}</li>
            <li>• <strong>Previous Block Hash:</strong> {language === 'vi' ? 'Mã băm liên kết đến khối đứng trước.' : '256-bit hash pointer to parent block.'}</li>
            <li>• <strong>Merkle Root Hash:</strong> {language === 'vi' ? 'Mã băm tóm lược toàn bộ giao dịch trong khối.' : 'Cryptographic root hash of all transactions.'}</li>
            <li>• <strong>Timestamp:</strong> {language === 'vi' ? 'Thời gian tạo khối dạng Unix epoch.' : 'Unix epoch timestamp of block generation.'}</li>
            <li>• <strong>Difficulty Target:</strong> {language === 'vi' ? 'Ngưỡng độ khó khai thác hoặc điều kiện đồng thuận.' : 'Target threshold for mining difficulty.'}</li>
            <li>• <strong>Nonce:</strong> {language === 'vi' ? 'Số ngẫu nhiên tìm kiếm giá trị băm hợp lệ.' : 'Arbitrary number iterated to solve target difficulty.'}</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4" />
            {language === 'vi' ? '2. Thân Khối (Block Body)' : '2. Block Body'}
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>• <strong>Coinbase Transaction:</strong> {language === 'vi' ? 'Giao dịch đầu tiên tạo tiền thưởng khối cho Validator/Thợ đào.' : 'First transaction minting newly created block reward tokens.'}</li>
            <li>• <strong>Transaction Counter:</strong> {language === 'vi' ? 'Tổng số lượng giao dịch được gom vào khối.' : 'Total number of transactions packed into the block.'}</li>
            <li>• <strong>Transaction Payload List:</strong> {language === 'vi' ? 'Danh sách toàn bộ các giao dịch chuyển tiền đã được xác minh.' : 'Array of validated transactions included in the block.'}</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link href="/theory/digital-signature" className="text-xs font-semibold text-slate-400 hover:text-white">
          {language === 'vi' ? '← Quay lại Chữ ký số' : '← Back to Digital Signature'}
        </Link>
        <Link
          href="/theory/consensus"
          prefetch={true}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
        >
          <span>{language === 'vi' ? 'Học Tiếp: Cơ Chế Đồng Thuận' : 'Next: Consensus Theory'}</span>
        </Link>
      </div>
    </div>
  );
}
