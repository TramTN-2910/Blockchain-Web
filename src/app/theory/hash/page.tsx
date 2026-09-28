'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Binary, ArrowRight, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function TheoryHashPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Binary className="w-4 h-4" />
          <span>{language === 'vi' ? 'Lý Thuyết Cốt Lõi • Phần 4' : 'Core Theory • Part 4'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'vi' ? 'Hàm Băm Mật Mã Học (Cryptographic Hash)' : 'Cryptographic Hash Functions'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'Hàm băm là thuật toán một chiều chuyển đổi dữ liệu đầu vào có kích thước bất kỳ thành một chuỗi ký tự có độ dài cố định (SHA-256 luôn cho ra 64 ký tự Hex = 256 bits).'
            : 'A cryptographic hash function converts arbitrary-length input data into a fixed-length string (SHA-256 always produces 64 hex characters = 256 bits).'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            {language === 'vi' ? '1. Tính Xác Định (Deterministic)' : '1. Deterministic Output'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Cùng một dữ liệu đầu vào luôn luôn cho ra một kết quả băm duy nhất, không bao giờ thay đổi theo thời gian hay thiết bị.'
              : 'The identical input always produces the exact same hash output across any machine or environment.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            {language === 'vi' ? '2. Kháng Tiền Ảnh (One-way / Pre-image Resistance)' : '2. Pre-image Resistance (One-way)'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Không thể đảo ngược từ chuỗi mã băm đầu ra để tìm lại dữ liệu gốc. Chi phí tính toán brute-force là xấp xỉ 2^256 phép thử.'
              : 'Computationally infeasible to reverse-engineer original payload from digest. Brute-forcing requires ~2^256 operations.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {language === 'vi' ? '3. Hiệu Ứng Tuyết Lở (Avalanche Effect)' : '3. Avalanche Effect'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Chỉ cần thay đổi 1 ký tự hoặc 1 bit ở đầu vào, mã băm đầu ra sẽ thay đổi hoàn toàn (~50% các bit bị đảo ngược).'
              : 'Flipping even a single bit in the input radically alters ~50% of the output bits unpredictably.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {language === 'vi' ? '4. Kháng Va Chạm (Collision Resistance)' : '4. Collision Resistance'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Về mặt thực tế, không thể tìm thấy hai dữ liệu đầu vào khác nhau mà lại tạo ra cùng một kết quả băm SHA-256.'
              : 'Practically impossible to discover two distinct input messages that hash into the same SHA-256 digest.'}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link href="/theory/transaction" className="text-xs font-semibold text-slate-400 hover:text-white">
          {language === 'vi' ? '← Quay lại Giao dịch' : '← Back to Transaction'}
        </Link>
        <Link
          href="/theory/digital-signature"
          prefetch={true}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
        >
          <span>{language === 'vi' ? 'Học Tiếp: Chữ Ký Số' : 'Next: Digital Signature Theory'}</span>
        </Link>
      </div>
    </div>
  );
}
