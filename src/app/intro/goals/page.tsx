'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Target, CheckCircle2, Award, BookCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function IntroGoalsPage() {
  const { language } = useLanguageStore();

  const goals = [
    {
      titleVi: '1. Nâng cao hiệu quả đào tạo công nghệ tài chính (Fintech)',
      titleEn: '1. Elevate Fintech & Blockchain Education',
      descVi: 'Cung cấp cho sinh viên công cụ trực quan hóa sống động để hiểu bản chất toán học và thuật toán mật mã thay vì chỉ đọc tài liệu lý thuyết suông.',
      descEn: 'Provide students with dynamic interactive tools to comprehend mathematical and algorithmic fundamentals rather than dry static text.'
    },
    {
      titleVi: '2. Tái hiện trọn vẹn quy trình Web3 chuẩn quốc tế',
      titleEn: '2. Replicate Real-World Web3 Protocols',
      descVi: 'Ứng dụng chính xác các chuẩn công nghệ: Khóa ECDSA secp256k1, địa chỉ 0x, Cây Merkle nhị phân Bitcoin Core và cơ chế PoS Slashing của Ethereum 2.0.',
      descEn: 'Accurately adhere to industry standards: ECDSA secp256k1 keys, 0x addresses, Bitcoin Core binary Merkle Trees and Ethereum 2.0 PoS Slashing.'
    },
    {
      titleVi: '3. Phục vụ Nghiên cứu Khoa học Sinh viên (SVNCKH 2025)',
      titleEn: '3. Student Scientific Research (SVNCKH 2025)',
      descVi: 'Đề tài nghiên cứu cấp Trường tại Đại học Ngân hàng TP.HCM, hướng đến việc xây dựng sản phẩm EdTech chất lượng cao mang tính ứng dụng thực tiễn.',
      descEn: 'University-level scientific research project at Banking University of HCMC (HUB), aiming to build a high-impact EdTech platform.'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>{language === 'vi' ? 'Mục Tiêu & Định Hướng Đề Tài' : 'Project Goals & Vision'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'vi' ? 'Mục Tiêu Dự Án HubBlock' : 'HubBlock Project Mission'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'Định hình một nền tảng học tập mở, dễ tiếp cận và đầy đủ công cụ mô phỏng để người học có thể tự tay thực hành mọi thao tác trong vòng đời chuỗi khối.'
            : 'Formulating an accessible, open educational platform equipped with complete sandbox tools for mastering the entire blockchain lifecycle.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-xs">
              0{idx + 1}
            </div>
            <h3 className="text-sm font-bold text-white">
              {language === 'vi' ? goal.titleVi : goal.titleEn}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'vi' ? goal.descVi : goal.descEn}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link
          href="/intro/overview"
          prefetch={true}
          className="text-xs font-semibold text-slate-400 hover:text-white"
        >
          {language === 'vi' ? '← Quay lại Tổng quan' : '← Back to Overview'}
        </Link>
        <Link
          href="/intro/workflow"
          prefetch={true}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
        >
          <span>{language === 'vi' ? 'Xem Quy Trình Hoạt Động' : 'View Workflow'}</span>
        </Link>
      </div>
    </div>
  );
}
