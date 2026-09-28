'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { FileSignature, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TheoryDigitalSignaturePage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <FileSignature className="w-4 h-4" />
          <span>{language === 'vi' ? 'Lý Thuyết Cốt Lõi • Phần 5' : 'Core Theory • Part 5'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'vi' ? 'Chữ Ký Số ECDSA (Digital Signature)' : 'ECDSA Digital Signatures'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'Chữ ký số là cơ chế mật mã học cho phép người gửi dùng Private Key để ký giao dịch, và bất kỳ ai trong mạng lưới có thể dùng Public Key của người gửi để xác minh tính chính chủ mà không làm lộ Private Key.'
            : 'Digital signatures allow transaction creators to sign messages with Private Keys, while network peers can verify non-repudiation using the Public Key without exposing the secret key.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-cyan-400 font-mono">
            {language === 'vi' ? '1. Ký Giao Dịch (Sign)' : '1. Sign Tx'}
          </div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Sinh Cặp (r, s, v)' : 'Generate (r, s, v)'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Thuật toán ECDSA (secp256k1) băm TxData và kết hợp với Private Key để tạo ra chữ ký số dạng 2 số nguyên lớn r và s.'
              : 'ECDSA secp256k1 hashes the transaction payload and combines it with Private Key to output large integer signature scalars (r, s).'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-emerald-400 font-mono">
            {language === 'vi' ? '2. Xác Minh (Verify)' : '2. Public Verification'}
          </div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Kiểm Chứng Công Khai' : 'Zero-Knowledge Proof'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Các Node mạng dùng Public Key của người gửi để giải ngược phép toán đường cong elliptic và kiểm chứng chữ ký khớp 100% với dữ liệu.'
              : 'Peers apply the Public Key against elliptic curve math to verify the signature strictly matches without leaking private credentials.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-purple-400 font-mono">
            {language === 'vi' ? '3. Bất Khả Chối Cãi' : '3. Non-Repudiation'}
          </div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Không Thể Giả Mạo' : 'Tamper-Proof'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Chỉ người sở hữu Private Key mới có thể tạo ra chữ ký hợp lệ. Bất kỳ ai sửa đổi số tiền hay địa chỉ thì chữ ký lập tức bị vô hiệu hóa.'
              : 'Only the legitimate Private Key holder can forge valid signatures. Altering amounts or recipients instantly invalidates the signature.'}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link href="/theory/hash" className="text-xs font-semibold text-slate-400 hover:text-white">
          {language === 'vi' ? '← Quay lại Hash' : '← Back to Hash'}
        </Link>
        <Link
          href="/theory/block"
          prefetch={true}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
        >
          <span>{language === 'vi' ? 'Học Tiếp: Cấu Trúc Khối' : 'Next: Block Theory'}</span>
        </Link>
      </div>
    </div>
  );
}
