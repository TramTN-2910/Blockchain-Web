'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Wallet, Key, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TheoryWalletPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Wallet className="w-4 h-4" />
          <span>{language === 'vi' ? 'Lý Thuyết Cốt Lõi • Phần 2' : 'Core Theory • Part 2'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'vi' ? 'Ví Điện Tử & Cặp Khóa Mật Mã' : 'Cryptographic Wallets & Keypairs'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'Ví Blockchain không lưu tiền như tài khoản ngân hàng truyền thống, mà quản lý cặp khóa mật mã: Private Key (Khóa bí mật) và Public Key (Khóa công khai) được sinh ra từ Seed Phrase.'
            : 'A blockchain wallet does not store physical coins; rather, it securely stores cryptographic keypairs: Private Keys and Public Keys derived from Seed Phrases.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="text-xs font-bold font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded w-fit">
            BIP-39 Mnemonic
          </div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Cụm Từ Khôi Phục (Seed Phrase)' : 'Seed Phrase (12/24 words)'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Chuỗi 12 hoặc 24 từ tiếng Anh dễ đọc đóng vai trò là "gốc" để sinh ra tất cả các Private Key một cách xác định (Deterministic).'
              : 'A human-readable sequence of 12 or 24 words acting as master entropy to deterministically derive all private keys.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-red-900/40 bg-red-950/10 space-y-3">
          <div className="text-xs font-bold font-mono text-red-400 bg-red-950 px-2 py-0.5 rounded w-fit">
            256-bit Private Key
          </div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Khóa Bí Mật (Private Key)' : 'Private Key (Secret)'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Số nguyên 256-bit tuyệt mật dùng để ký xác nhận mọi giao dịch chuyển tiền. Bất kỳ ai có Private Key đều có toàn quyền kiểm soát số dư trong ví.'
              : 'A secret 256-bit integer used to sign transactions. Anyone holding the private key possesses unilateral control of the funds.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded w-fit">
            Public Address (0x...)
          </div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Địa Chỉ Ví Công Khai' : 'Public Wallet Address'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Rút gọn từ Public Key qua hàm băm Keccak-256. Đây là chuỗi định danh công khai dùng để nhận tài sản từ người khác.'
              : 'Derived from Public Key through Keccak-256 hashing. It is publicly shared to receive incoming transaction values.'}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link href="/theory/blockchain" className="text-xs font-semibold text-slate-400 hover:text-white">
          {language === 'vi' ? '← Quay lại Blockchain' : '← Back to Blockchain'}
        </Link>
        <Link
          href="/theory/transaction"
          prefetch={true}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
        >
          <span>{language === 'vi' ? 'Học Tiếp: Giao Dịch' : 'Next: Transaction Theory'}</span>
        </Link>
      </div>
    </div>
  );
}
