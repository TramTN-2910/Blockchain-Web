'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function MiningTheoryPage() {
  const { t, language } = useTranslation();
  const theory = t.theory_mining || ({} as any);

  const diffRows = [
    { diff: 1, prefix: '0', suffix: 'xxxxxxxxxx', tries: language === 'en' ? '~16 attempts' : '~16 lần thử' },
    { diff: 2, prefix: '00', suffix: 'xxxxxxxxx', tries: language === 'en' ? '~256 attempts' : '~256 lần thử' },
    { diff: 3, prefix: '000', suffix: 'xxxxxxxx', tries: language === 'en' ? '~4,096 attempts' : '~4.096 lần thử' },
    { diff: 4, prefix: '0000', suffix: 'xxxxxxx', tries: language === 'en' ? '~65,536 attempts' : '~65.536 lần thử' },
    { diff: 5, prefix: '00000', suffix: 'xxxxxx', tries: language === 'en' ? '~1,048,576 attempts' : '~1.048.576 lần thử' },
  ];

  return (
    <div className="space-y-6 pt-2 w-full">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
          {theory.badge || 'HỆ TRI THỨC'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {theory.title || 'Lý Thuyết Khai Thác'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {theory.subtitle || 'Tìm hiểu cách thợ đào giải bài toán Proof of Work, ý nghĩa Nonce và tính bất biến Blockchain.'}
        </p>
      </div>

      {/* Cards List */}
      <div className="space-y-6">
        
        {/* Card 1 */}
        <SpotlightCard 
          spotlightColor="rgba(168, 85, 247, 0.18)"
          className="glass-card p-6 sm:p-7 space-y-4 border-l-4 border-l-purple-600 shadow-lg"
        >
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wider uppercase">
            {theory.what_is_mining?.badge || 'KHÁI NIỆM 01'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {theory.what_is_mining?.title || 'Khai thác là gì?'}
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {theory.what_is_mining?.desc || 'Khai thác (Mining) là quá trình tìm một giá trị nonce (số nguyên bắt đầu từ 0) sao cho khi băm toàn bộ nội dung khối, kết quả bắt đầu bằng đủ số 0 theo yêu cầu.'}
          </p>

          <div className="p-4 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
            <div>
              <span className="text-purple-600 dark:text-purple-400 font-bold">SHA256</span>(index + timestamp + data + prevHash + <span className="text-amber-500 font-bold">nonce</span>)
            </div>
            <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
              <span>→ &quot;000abc91f...&quot;</span>
              <span className="flex items-center gap-0.5"><Check className="w-4 h-4" /> {theory.what_is_mining?.valid || 'Hợp lệ'}</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 2 */}
        <SpotlightCard 
          spotlightColor="rgba(245, 158, 11, 0.18)"
          className="glass-card p-6 sm:p-7 space-y-4 border-l-4 border-l-amber-500 shadow-lg"
        >
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase">
            {theory.what_is_nonce?.badge || 'KHÁI NIỆM 02'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {theory.what_is_nonce?.title || 'Nonce là gì?'}
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {theory.what_is_nonce?.desc_1 || 'Nonce (Number used ONCE) là con số duy nhất thợ đào có thể thay đổi, bắt đầu từ 0 tăng dần. Thợ đào thử từng giá trị cho đến khi tìm được mã băm hợp lệ.'}
          </p>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {theory.what_is_nonce?.desc_2 || 'Không thể dự đoán trước nonce cần tìm. Đây là lý do khai thác tiêu tốn rất nhiều tài nguyên tính toán.'}
          </p>
        </SpotlightCard>

        {/* Card 3 */}
        <SpotlightCard 
          spotlightColor="rgba(99, 102, 241, 0.18)"
          className="glass-card p-6 sm:p-7 space-y-5 border-l-4 border-l-indigo-600 shadow-lg"
        >
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
            {theory.difficulty_mechanics?.badge || 'KHÁI NIỆM 03'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {theory.difficulty_mechanics?.title || 'Độ khó hoạt động ra sao?'}
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {theory.difficulty_mechanics?.desc || 'Độ khó quy định số lượng số 0 bắt buộc ở đầu mã băm. Cứ thêm 1 số 0 ở đầu, độ khó và số lần thử trung bình lại tăng gấp 16 lần (hệ cơ số 16 Hex).'}
          </p>

          <div className="space-y-2.5 pt-2">
            {diffRows.map((row) => (
              <div
                key={row.diff}
                className="flex items-center justify-between p-3 sm:px-4 sm:py-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">Diff = {row.diff}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{row.prefix}</span>
                  <span className="text-slate-400 dark:text-slate-500">{row.suffix}</span>
                </div>
                <div className="text-amber-600 dark:text-amber-400 font-semibold font-sans">
                  {row.tries}
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>

        {/* Card 4 */}
        <SpotlightCard 
          spotlightColor="rgba(6, 182, 212, 0.18)"
          className="glass-card p-6 sm:p-7 space-y-4 border-l-4 border-l-cyan-500 shadow-lg"
        >
          <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-wider uppercase">
            {theory.blockchain_immutability?.badge || 'KHÁI NIỆM 04'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {theory.blockchain_immutability?.title || 'Bảo mật chuỗi khối được đảm bảo thế nào?'}
          </h2>
          <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {theory.blockchain_immutability?.desc || 'Mỗi khối lưu trữ mã băm của khối trước đó (prevHash). Nếu kẻ tấn công muốn sửa dữ liệu khối trong quá khứ, toàn bộ mã băm phía sau sẽ bị hỏng và buộc phải đào lại từ đầu.'}
          </p>
        </SpotlightCard>

      </div>
    </div>
  );
}
