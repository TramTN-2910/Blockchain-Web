'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface Member {
  id: string;
  name: string;
  role_vn: string;
  role_en: string;
  avatar: string;
  avatarFallback: string;
  description_vn: string;
  description_en: string;
}

const MEMBERS: Member[] = [
  {
    id: 'vu-lam',
    name: 'Lâm Tuấn Vũ',
    role_vn: 'Trưởng nhóm • Lập trình viên Backend',
    role_en: 'Team Lead • Backend Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    avatarFallback: 'V',
    description_vn:
      'Phụ trách máy chủ Node.js, cài đặt thuật toán SHA-256, lõi logic chuỗi khối, cơ chế đồng thuận PoW và API hệ thống.',
    description_en:
      'Responsible for Node.js architecture, SHA-256 cryptographic core, blockchain consensus logic, and system APIs.',
  },
  {
    id: 'khiem-do',
    name: 'Đỗ Gia Khiêm',
    role_vn: 'Lập trình viên Frontend',
    role_en: 'Frontend Engineer & UI/UX',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    avatarFallback: 'K',
    description_vn:
      'Thiết kế và xây dựng giao diện tương tác cao cấp, hoạt ảnh Framer Motion, mô phỏng RSA/Mining và tối ưu hóa trải nghiệm đa thiết bị.',
    description_en:
      'Designed and engineered interactive simulations, Framer Motion animations, RSA & Mining playgrounds, and responsive experiences.',
  },
  {
    id: 'thang-nguyen',
    name: 'Nguyễn Vũ Thắng',
    role_vn: 'Nghiên cứu & Tài liệu',
    role_en: 'Researcher & Documentation',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    avatarFallback: 'T',
    description_vn:
      'Nghiên cứu chuyên sâu tài liệu kỹ thuật mật mã học SHA-256 & RSA, xây dựng bộ ngân hàng câu hỏi Quiz và biên soạn nội dung giáo dục.',
    description_en:
      'Conducted cryptographic research on SHA-256 & RSA standards, curated comprehensive Quiz question banks, and authored educational content.',
  },
];

// Team Member Card Component
function MemberCard({ member, isEn }: { member: Member; isEn: boolean }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group relative h-full rounded-3xl p-[1px] transition-all duration-300 hover:-translate-y-1"
    >
      {/* Glowing Purple-Cyan Gradient Border on Hover */}
      <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 opacity-20 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500 pointer-events-none" />

      {/* Card Inner Surface */}
      <SpotlightCard className="relative h-full rounded-3xl p-6 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-purple-100/80 dark:border-slate-800 shadow-xl shadow-purple-500/5 flex flex-col justify-between" spotlightColor="rgba(168, 85, 247, 0.18)">
        <div className="space-y-4 relative z-10">
          {/* Top row: Avatar on Left, Name & Role on Right */}
          <div className="flex items-center gap-4">
            {/* Member Photo */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl p-0.5 bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center font-black text-xl text-white">
                  {/* Fallback initial */}
                  <span className="absolute text-slate-700 dark:text-slate-200 font-bold">{member.avatarFallback}</span>
                  {/* Member photo */}
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Name & Role */}
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                {member.name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 leading-snug">
                {isEn ? member.role_en : member.role_vn}
              </p>
            </div>
          </div>

          {/* Bottom: Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            {isEn ? member.description_en : member.description_vn}
          </p>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export default function TeamSection() {
  const { t, language } = useTranslation();
  const team = t.team || ({} as any);
  const isEn = language === 'en';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
      },
    },
  };

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>{team.members_badge || 'Core Engineering Team'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {team.members_title || 'Thành Viên Nhóm Phát Triển'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
          {team.members_sub || 'Đội ngũ sinh viên chuyên ngành Khoa học Dữ liệu trong Kinh doanh với đam mê kiến tạo công cụ trực quan hóa mật mã học và Blockchain.'}
        </p>
      </div>

      {/* Staggered Grid of Member Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {MEMBERS.map((member) => (
          <MemberCard key={member.id} member={member} isEn={isEn} />
        ))}
      </motion.div>
    </section>
  );
}
