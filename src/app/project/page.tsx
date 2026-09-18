'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Hash,
  Activity,
  Pickaxe,
  Boxes,
  Gauge,
  Bot,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function ProjectPage() {
  const { t, language } = useTranslation();
  const proj = t.project || ({} as any);

  const features = [
    {
      title: proj.feature1_title || 'Minh họa SHA-256',
      href: '/hash/interaction',
      icon: Hash,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-950/60',
      description: proj.feature1_desc || 'Trình diễn trực tiếp quá trình băm dữ liệu theo thời gian thực. Bất kỳ ký tự nào được nhập đều trả về kết quả 256-bit cố định.',
      lineColor: 'from-blue-600 to-indigo-600',
    },
    {
      title: proj.feature2_title || 'Hiệu ứng Avalanche',
      href: '/hash/avalanche',
      icon: Activity,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/60',
      description: proj.feature2_desc || 'Phân tích mức độ thay đổi của luồng bit. Chỉ một sự thay đổi nhỏ ở đầu vào sẽ làm xáo trộn hoàn toàn đầu ra.',
      lineColor: 'from-indigo-600 to-purple-600',
    },
    {
      title: proj.feature3_title || 'Giả lập Khai thác khối',
      href: '/mining/simulator',
      icon: Pickaxe,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-950/60',
      description: proj.feature3_desc || 'Trải nghiệm cơ chế Proof-of-Work. Tìm kiếm giá trị Nonce phù hợp để tạo ra mã băm thỏa mãn độ khó mạng lưới.',
      lineColor: 'from-amber-500 to-orange-600',
    },
    {
      title: proj.feature4_title || 'Khám phá Chuỗi khối',
      href: '/mining/explorer',
      icon: Boxes,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/60',
      description: proj.feature4_desc || 'Mô phỏng một chuỗi khối cơ bản. Can thiệp vào dữ liệu khối sẽ làm phá vỡ tính toàn vẹn của các khối kế tiếp.',
      lineColor: 'from-emerald-500 to-teal-600',
    },
    {
      title: proj.feature5_title || 'Tùy chỉnh Độ khó',
      href: '/mining/difficulty',
      icon: Gauge,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/60',
      description: proj.feature5_desc || 'Minh họa lý do mạng lưới Bitcoin tự động thay đổi độ khó khai thác để duy trì thời gian tạo khối ổn định ở mức 10 phút.',
      lineColor: 'from-purple-600 to-pink-600',
    },
    {
      title: proj.feature6_title || 'Trợ lý AI Chatbot',
      href: '/chatbot',
      icon: Bot,
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      iconBg: 'bg-cyan-100 dark:bg-cyan-950/60',
      description: proj.feature6_desc || 'Tích hợp chatbot trí tuệ nhân tạo hỗ trợ giải đáp thắc mắc về chuỗi khối, hàm băm và các khái niệm liên quan ngay trên nền tảng.',
      lineColor: 'from-cyan-500 to-blue-600',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      
      {/* Hero Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>{proj.badge || 'NGHIÊN CỨU KHOA HỌC SINH VIÊN'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          {proj.title || 'Dự án NCKH HubBlock'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          {proj.subtitle || 'Dự án nhằm trực quan hóa tối đa các kiến thức phức tạp như hàm băm, mã hóa và giao thức đồng thuận - các công nghệ cốt lõi của chuỗi khối - một cách sinh động, hỗ trợ giảng dạy và tự học.'}
        </p>
      </motion.div>

      {/* Section Header with vertical bar */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center gap-3"
        >
          <div className="w-1.5 h-6 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {language === 'en' ? 'Core Interactive Modules' : 'Các Nội Dung Trực Quan Hóa'}
          </h2>
        </motion.div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="h-full"
              >
                <Link
                  href={item.href}
                  className="block h-full"
                >
                  <SpotlightCard className="group rounded-3xl p-6 sm:p-7 border border-indigo-100/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl shadow-purple-500/5 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col justify-between h-full relative" spotlightColor="rgba(99, 102, 241, 0.16)">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${item.iconColor}`} />
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Gradient underline accent */}
                    <div className={`mt-5 h-1 w-16 group-hover:w-full rounded-full bg-gradient-to-r ${item.lineColor} transition-all duration-300`}></div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
