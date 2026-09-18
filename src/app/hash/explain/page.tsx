'use client';

import React from 'react';
import { Lock, Edit3, MinusCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

export default function HashExplainPage() {
  const { t } = useTranslation();
  const theory = t.theory_hash || ({} as any);

  return (
    <div className="space-y-6 w-full">
      
      {/* Card 1: Hàm Băm Mật Mã Là Gì? */}
      <SpotlightCard 
        spotlightColor="rgba(168, 85, 247, 0.18)"
        className="glass-card p-6 sm:p-8 space-y-4 shadow-lg"
      >
        <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {theory.what_is_hash?.title || 'Hàm Băm Mật Mã Là Gì?'}
          </h2>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {theory.what_is_hash?.desc || 'Một hàm băm mật mã là thuật toán toán học ánh xạ dữ liệu có kích thước bất kỳ thành một chuỗi bit độ dài cố định — gọi là "mã băm" hay "đại diện tóm tắt".'}
        </p>

        <div className="p-4 rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/50 dark:bg-slate-900/80 font-mono text-xs space-y-1 text-purple-900 dark:text-purple-300">
          <div>{theory.what_is_hash?.example_hello || 'SHA256("Hello") → 185f8db32921bd46d35c4f64...'}</div>
          <div>{theory.what_is_hash?.example_1tb || 'SHA256("1 TB file") → cũng là 64 ký tự hex'}</div>
        </div>
      </SpotlightCard>

      {/* Card 2: Đầu Ra Độ Dài Cố Định */}
      <SpotlightCard 
        spotlightColor="rgba(99, 102, 241, 0.18)"
        className="glass-card p-6 sm:p-8 space-y-3 shadow-lg"
      >
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60">
            <Edit3 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {theory.fixed_length?.title || 'Đầu Ra Độ Dài Cố Định'}
          </h2>
        </div>

        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {theory.fixed_length?.desc || 'SHA-256 luôn tạo ra đúng 256 bits = 32 bytes = 64 ký tự hex.'}
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {theory.fixed_length?.sub || 'Tính chất này giúp dễ dàng so sánh và lưu trữ mã băm — bạn luôn biết chính xác cần bao nhiêu không gian bộ nhớ.'}
        </p>
      </SpotlightCard>

      {/* Card 3: Hàm Một Chiều (Kháng tiền ảnh) */}
      <SpotlightCard 
        spotlightColor="rgba(244, 63, 94, 0.18)"
        className="glass-card p-6 sm:p-8 space-y-3 shadow-lg"
      >
        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60">
            <MinusCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {theory.one_way?.title || 'Hàm Một Chiều (Kháng tiền ảnh)'}
          </h2>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {theory.one_way?.desc || 'Việc đảo ngược một mã băm là bất khả thi về mặt tính toán — không thể tìm ra đầu vào gốc từ một mã băm đầu ra.'}
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {theory.one_way?.sub || 'Có 2^256 đầu ra SHA-256 có thể sinh ra. Việc tìm ngược đầu vào bằng vét cạn sẽ mất nhiều thời gian hơn cả tuổi thọ vũ trụ.'}
        </p>
      </SpotlightCard>

      {/* Card 4: Hiệu ứng Avalanche */}
      <SpotlightCard 
        spotlightColor="rgba(6, 182, 212, 0.18)"
        className="glass-card p-6 sm:p-8 space-y-4 shadow-lg"
      >
        <div className="flex items-center gap-3 text-cyan-600 dark:text-cyan-400">
          <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/60">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {theory.avalanche?.title || 'Hiệu ứng Avalanche'}
          </h2>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {theory.avalanche?.desc || 'Thay đổi chỉ 1 bit ở đầu vào sẽ làm ~50% số bit ở đầu ra thay đổi hoàn toàn ngẫu nhiên và không đoán trước được.'}
        </p>

        <div className="p-4 rounded-xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/40 dark:bg-slate-900/80 font-mono text-xs space-y-1 text-rose-900 dark:text-rose-300">
          <div>SHA256(&quot;<span className="font-bold text-slate-900 dark:text-slate-100">hello</span>&quot;) = <span className="text-indigo-600 dark:text-indigo-400 font-bold">2cf24dba...</span></div>
          <div>SHA256(&quot;<span className="font-bold text-rose-600 dark:text-rose-400">hellp</span>&quot;) = <span className="text-amber-600 dark:text-amber-400 font-bold">a7f891c4...</span> <span className="text-slate-500 font-sans">← hoàn toàn khác biệt!</span></div>
        </div>
      </SpotlightCard>

      {/* Card 5: Kháng Va Chạm */}
      <SpotlightCard 
        spotlightColor="rgba(16, 185, 129, 0.18)"
        className="glass-card p-6 sm:p-8 space-y-4 shadow-lg"
      >
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {theory.collision_resistance?.title || 'Kháng Va Chạm (Collision Resistance)'}
          </h2>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {theory.collision_resistance?.desc || 'Không thể tìm thấy hai đầu vào khác nhau x ≠ y sao cho SHA256(x) = SHA256(y).'}
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {theory.collision_resistance?.sub || 'Theo nghịch lý ngày sinh nhật (Birthday Attack), cần khoảng 2^128 phép thử để tìm thấy một va chạm — con số an toàn tuyệt đối trước mọi công nghệ máy tính hiện nay.'}
        </p>
      </SpotlightCard>

    </div>
  );
}
