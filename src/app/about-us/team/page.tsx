'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  Building2, 
  GraduationCap, 
  Sparkles, 
  User, 
  Mail, 
  Github, 
  Award, 
  ArrowRight,
  ShieldCheck,
  Code2
} from 'lucide-react';
import Link from 'next/link';

interface TeamMember {
  name: string;
  id: string;
  tasksVi: string;
  tasksEn: string;
  color: string;
  avatarText: string;
}

const MEMBERS: TeamMember[] = [
  {
    name: 'Trần Thị Tuyết Nga',
    id: '031340240018',
    tasksVi: 'Phụ trách Hash/SHA-256 (tạo hash, thay đổi dữ liệu so sánh), Chữ ký số Digital Signature (ký bằng khóa riêng) và Xác minh chữ ký Signature Verification (khóa công khai).',
    tasksEn: 'In charge of Hash/SHA-256 (data hashing & comparison), Digital Signature (private key signing), and Signature Verification (public key verification).',
    color: 'from-pink-500 to-rose-500',
    avatarText: 'TN'
  },
  {
    name: 'Hoàng Nhật Minh',
    id: '031340240017',
    tasksVi: 'Phụ trách Cơ chế đồng thuận Proof of Stake - PoS (Validator xác nhận Block) và Phát hiện can thiệp Tamper Detection (sửa đổi dữ liệu, phát hiện thay đổi chuỗi).',
    tasksEn: 'In charge of Proof of Stake (PoS) consensus (validator selection & block validation) and Tamper Detection (tampering simulation & change detection).',
    color: 'from-amber-500 to-orange-500',
    avatarText: 'NM'
  },
  {
    name: 'Phạm Nguyễn Gia Phúc',
    id: '031340240044',
    tasksVi: 'Phụ trách Ví Wallet (quy trình tạo, quản lý ví và tương tác) và Giao dịch Transaction (mô phỏng tạo giao dịch, cấu trúc dữ liệu TX).',
    tasksEn: 'In charge of Wallet (creation, management & interaction workflows) and Transaction (transaction creation simulation & TX data structures).',
    color: 'from-indigo-500 to-purple-500',
    avatarText: 'GP'
  },
  {
    name: 'Huỳnh Thanh Phong',
    id: '031340240023',
    tasksVi: 'Phụ trách Mempool (giao dịch chờ xử lý trước khi vào Block) và Mạng Network (nhiều node kết nối, truyền tải và trao đổi dữ liệu trong mạng Blockchain).',
    tasksEn: 'In charge of Mempool (pending transaction queue before block inclusion) and P2P Network (multi-node connectivity, data exchange & propagation).',
    color: 'from-cyan-500 to-blue-500',
    avatarText: 'TP'
  },
  {
    name: 'Nguyễn Quang Vinh',
    id: '031340240039',
    tasksVi: 'Phụ trách Liên kết Previous Hash (xâu chuỗi các khối bằng hash khối trước) và Sổ cái Blockchain (chuỗi nhiều khối, kiểm tra tính toàn vẹn liên kết).',
    tasksEn: 'In charge of Previous Hash (block linkage via parent block hash) and Blockchain Ledger (multi-block chain simulation & integrity verification).',
    color: 'from-emerald-500 to-teal-500',
    avatarText: 'QV'
  },
  {
    name: 'Lê Minh Thư',
    id: '031340240030',
    tasksVi: 'Phụ trách Cấu trúc Block (quá trình đóng gói và tạo Block mới) và Cây Merkle Tree (gom nhóm nhiều giao dịch và tính toán Merkle Root).',
    tasksEn: 'In charge of Block Anatomy (block structure & block creation process) and Merkle Tree (grouping transactions & Merkle Root computation).',
    color: 'from-violet-500 to-fuchsia-500',
    avatarText: 'MT'
  }
];

export default function AboutTeamPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-800/40">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[11px] font-extrabold text-purple-300 whitespace-nowrap tracking-wider shrink-0">
              ABOUT 1
            </span>
            <span>
              {language === 'vi' ? 'Về Chúng Tôi • Đội Ngũ Nghiên Cứu' : 'About Us • Research Team'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Đội Ngũ Phát Triển & Nghiên Cứu Đề Tài' : 'Research & Development Team'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Sinh viên khoa Khoa học Dữ liệu trong Kinh doanh - Trường Đại học Ngân hàng TP.HCM (HUB).'
              : 'Faculty of Data Science in Business - Ho Chi Minh University of Banking (HUB).'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about-us/assignments"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Phân Công Nhiệm Vụ' : 'Task Matrix'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* University & Faculty Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">
              {language === 'vi' ? 'Trường Đại học Ngân hàng TP.HCM' : 'Ho Chi Minh University of Banking'}
            </h3>
            <p className="text-xs text-slate-400">
              HUB - Ho Chi Minh University of Banking • Est. 1976
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">
              {language === 'vi' ? 'Khoa Khoa học Dữ liệu trong Kinh doanh' : 'Faculty of Data Science in Business'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'vi' ? 'Chuyên ngành Công nghệ Tài chính & Khoa học Dữ liệu' : 'Fintech & Data Science Specialization'}
            </p>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MEMBERS.map((member, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${member.color} flex items-center justify-center font-black text-white text-lg shadow-lg`}>
                  {member.avatarText}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{member.name}</h3>
                  <div className="text-xs font-mono text-purple-300">{member.id}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'vi' ? member.tasksVi : member.tasksEn}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>HUB Research Team</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
