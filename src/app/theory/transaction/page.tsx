'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { FileSignature, ArrowRight, DollarSign, Clock, Hash } from 'lucide-react';
import Link from 'next/link';

export default function TheoryTransactionPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <FileSignature className="w-4 h-4" />
          <span>{language === 'vi' ? 'Lý Thuyết Cốt Lõi • Phần 3' : 'Core Theory • Part 3'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'vi' ? 'Cấu Trúc Giao Dịch (Transactions)' : 'Blockchain Transactions'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'Giao dịch là đơn vị thông điệp cơ bản ghi nhận việc chuyển tài sản hoặc tương tác dữ liệu giữa hai địa chỉ trên mạng lưới.'
            : 'A transaction is the atomic message payload that transfers value or executes smart contract state changes between two addresses.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-cyan-400">From & To</div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Địa Chỉ Gửi / Nhận' : 'Sender & Receiver Address'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Xác định rõ ràng ai là người chuyển và ai là người thụ hưởng thông qua địa chỉ công khai 0x.'
              : 'Explicitly identifies sender and recipient via public 0x hexadecimal addresses.'}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-emerald-400">Amount (HUB)</div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Số Lượng Chuyển' : 'Transfer Amount'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Giá trị token được chuyển giao, bắt buộc phải nhỏ hơn hoặc bằng số dư khả dụng của ví gửi.'
              : 'Quantity of tokens transferred, which must not exceed the sender available balance.'}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-amber-400">Gas Fee (Gwei)</div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Phí Giao Dịch' : 'Transaction Gas Fee'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Khoản thù lao chi trả cho Validator/Thợ đào để ưu tiên xác nhận và gom giao dịch vào khối.'
              : 'Incentive paid to validators or miners to prioritize and include the transaction in the next block.'}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-purple-400">Nonce Counter</div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Số Thứ Tự Giao Dịch' : 'Account Nonce'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Số nguyên tự tăng liên tục theo từng ví gửi, ngăn chặn tuyệt đối tấn công phát lại (Replay Attack).'
              : 'Strict sequential counter per account that prevents transaction replay attacks.'}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link href="/theory/wallet" className="text-xs font-semibold text-slate-400 hover:text-white">
          {language === 'vi' ? '← Quay lại Ví' : '← Back to Wallet'}
        </Link>
        <Link
          href="/theory/hash"
          prefetch={true}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
        >
          <span>{language === 'vi' ? 'Học Tiếp: Hàm Băm Hash' : 'Next: Hash Theory'}</span>
        </Link>
      </div>
    </div>
  );
}
