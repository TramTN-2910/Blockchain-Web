'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Building2,
  Mail,
  Phone,
  Sparkles,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import TeamSection from '@/components/team/TeamSection';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function TeamPage() {
  const { t, language } = useTranslation();
  const team = t.team || ({} as any);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      
      {/* Top University & Faculty Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Card 1: University */}
        <SpotlightCard className="rounded-2xl p-5 border border-purple-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md flex items-center gap-4 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all" spotlightColor="rgba(99, 102, 241, 0.16)">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {team.school_title || 'Trường Đại học Ngân hàng TP.HCM'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {team.school_sub || 'Ho Chi Minh University of Banking (HUB) • Est. 1976'}
            </p>
          </div>
        </SpotlightCard>

        {/* Card 2: Faculty */}
        <SpotlightCard className="rounded-2xl p-5 border border-purple-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md flex items-center gap-4 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all" spotlightColor="rgba(168, 85, 247, 0.16)">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-800/80 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {team.faculty_title || 'Khoa Khoa học Dữ liệu trong Kinh doanh'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {team.faculty_sub || 'Trường Đại học Ngân hàng TP.HCM'}
            </p>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* Main Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>{team.badge || 'ĐỘI NGŨ PHÁT TRIỂN & NGHIÊN CỨU'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          {team.title || 'Đội ngũ Thực hiện Đề tài'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          {team.subtitle || 'Nhóm sinh viên khoa Khoa học dữ liệu trong kinh doanh quan tâm tới việc trực quan hóa các khái niệm về chuỗi khối và an toàn bảo mật.'}
        </p>
      </motion.div>

      {/* Team Members Section */}
      <TeamSection />

      {/* Research Mission Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <SpotlightCard className="rounded-3xl p-8 sm:p-10 border border-cyan-200/70 dark:border-slate-800 bg-gradient-to-b from-cyan-50/60 to-purple-50/40 dark:from-slate-900/80 dark:to-cyan-950/20 shadow-xl text-center space-y-3 max-w-4xl mx-auto" spotlightColor="rgba(6, 182, 212, 0.18)">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>{language === 'en' ? 'Blockchain Research Initiative' : 'Dự Án Nghiên Cứu Công Nghệ Chuỗi Khối'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {language === 'en' ? 'Visual Cryptography & Blockchain Architecture' : 'Trực Quan Hóa Mật Mã Học & Blockchain'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Engineered to provide an interactive, accessible, and intuitive learning platform for students, faculty, and technology researchers.'
              : 'Nền tảng được xây dựng với mục tiêu mang đến công cụ học tập, mô phỏng tương tác trực quan và dễ tiếp cận nhất cho sinh viên, giảng viên và cộng đồng nghiên cứu công nghệ.'}
          </p>
        </SpotlightCard>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6 pt-4 text-center"
      >
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
            {language === 'en' ? 'CONTACT & COLLABORATION' : 'THÔNG TIN LIÊN LẠC'}
          </span>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            <span>vtkteam2005@gmail.com</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto text-left">
          {/* Card 1: Instructor */}
          <SpotlightCard className="rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm space-y-2" spotlightColor="rgba(99, 102, 241, 0.14)">
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              TS. Nguyễn Hoài Đức
            </h4>
            <p className="text-xs font-medium text-slate-500">
              {team.advisor_role || (language === 'en' ? 'Faculty Advisor' : 'Giảng viên hướng dẫn')}
            </p>
            <div className="space-y-1 pt-1 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>ducnh@hub.edu.vn</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                <span>000 111 2224</span>
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2: Team Leader */}
          <SpotlightCard className="rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm space-y-2" spotlightColor="rgba(99, 102, 241, 0.14)">
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              Lâm Tuấn Vũ
            </h4>
            <p className="text-xs font-medium text-slate-500">
              {language === 'en' ? 'Team Lead • Backend Engineer' : 'Nhóm trưởng'}
            </p>
            <div className="space-y-1 pt-1 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>vtkteam2005@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                <span>0867900730</span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </motion.div>

    </div>
  );
}
