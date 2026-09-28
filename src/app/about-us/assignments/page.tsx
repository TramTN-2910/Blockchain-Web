'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  Award
} from 'lucide-react';
import Link from 'next/link';

interface TaskAssignment {
  module: string;
  tasksVi: string;
  tasksEn: string;
  assignee: string;
  progress: number;
  weight: string;
}

const TASK_LIST: TaskAssignment[] = [
  {
    module: 'Kiến Trúc & Navigation',
    tasksVi: 'Tái cấu trúc 7 chuyên mục, thanh điều hướng ngang Sub-nav, tích hợp Dark/Light theme & Đa ngôn ngữ.',
    tasksEn: 'Restructure into 7 main categories, sliding horizontal sub-nav, Dark/Light theme & i18n support.',
    assignee: 'Trương Ngọc Trâm',
    progress: 100,
    weight: '15%'
  },
  {
    module: 'Crypto Lab (Mật Mã Học)',
    tasksVi: 'Xây dựng trình tạo ví BIP-39, băm SHA-256, ký & xác minh chữ ký điện tử ECDSA secp256k1.',
    tasksEn: 'BIP-39 seed generation, SHA-256 hashing, ECDSA secp256k1 sign & verification labs.',
    assignee: 'Thành viên 2',
    progress: 100,
    weight: '20%'
  },
  {
    module: 'Blockchain Simulation',
    tasksVi: 'Mô phỏng Giao dịch, Mempool hàng đợi, Cây Merkle Tree, Liên kết Previous Hash, Đồng thuận PoS & Explorer.',
    tasksEn: 'Transaction builder, Mempool queue, Merkle Tree builder, Previous Hash linkage, PoS & Explorer.',
    assignee: 'Trương Ngọc Trâm',
    progress: 100,
    weight: '25%'
  },
  {
    module: 'Mô Phỏng Tấn Công (Attack Sim)',
    tasksVi: 'Giả mạo TX trong Mempool, Can thiệp thân khối, Hiệu ứng thác đổ Avalanche Diff, Cascade Validator & Re-mining 51%.',
    tasksEn: 'Tamper TX in mempool, Block data injection, Avalanche Diff analyzer, Cascade Validator & 51% Re-mining.',
    assignee: 'Trương Ngọc Trâm & TV 2',
    progress: 100,
    weight: '15%'
  },
  {
    module: 'Mạng Lưới P2P & Nodes',
    tasksVi: 'Sơ đồ Mesh Topology SVG, Ma trận kết nối Peer, Giao thức lan truyền Gossip, Đồng bộ khối & Logs console.',
    tasksEn: 'SVG Mesh Topology, Peer Connection Matrix, Gossip broadcast flooding, State sync & Logs console.',
    assignee: 'Trương Ngọc Trâm',
    progress: 100,
    weight: '15%'
  },
  {
    module: 'UI/UX & Hệ Thống Quiz',
    tasksVi: 'Thiết kế Neon Glassmorphism, Micro-animations Framer Motion, Ngân hàng câu hỏi trắc nghiệm & Admin AI Import.',
    tasksEn: 'Neon Glassmorphism UI, Framer Motion animations, Quiz question bank & Admin AI Import tool.',
    assignee: 'Thành viên 3',
    progress: 100,
    weight: '10%'
  }
];

export default function TaskAssignmentsPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-800/40">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[11px] font-extrabold text-purple-300 whitespace-nowrap tracking-wider shrink-0">
              ABOUT 2
            </span>
            <span>
              {language === 'vi' ? 'Về Chúng Tôi • Phân Công Nhiệm Vụ' : 'About Us • Task Matrix'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Ma Trận Phân Công Công Việc & Tiến Độ (WBS)' : 'Work Breakdown Structure & Tasks'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Chi tiết bảng phân bổ hạng mục nghiên cứu, trọng số đóng góp và tình trạng hoàn thành 100% của đề tài.'
              : 'Detailed breakdown of research modules, contribution weights, and milestone completion status.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about-us/technology"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Kiến Trúc Công Nghệ' : 'Tech Architecture'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Progress Metric Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{language === 'vi' ? 'Tổng Số Hạng Mục' : 'Total Modules'}</div>
            <div className="text-xl font-black text-white">6 Hạng Mục Lớn</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{language === 'vi' ? 'Tiến Độ Tổng Thể' : 'Overall Progress'}</div>
            <div className="text-xl font-black text-emerald-400">100% Hoàn Thành</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{language === 'vi' ? 'Đánh Giá Đạt Chuẩn' : 'Milestone Score'}</div>
            <div className="text-xl font-black text-blue-300">Grade A+ (Xuất sắc)</div>
          </div>
        </div>
      </div>

      {/* Task Matrix Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          {language === 'vi' ? 'Bảng Chi Tiết Phân Công Nhiệm Vụ' : 'Detailed Task Matrix'}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-left uppercase text-[10px] tracking-wider">
                <th className="p-3">Hạng Mục</th>
                <th className="p-3">Nội Dung Thực Hiện</th>
                <th className="p-3">Phụ Trách</th>
                <th className="p-3 text-center">Trọng Số</th>
                <th className="p-3 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {TASK_LIST.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-bold text-white whitespace-nowrap">{item.module}</td>
                  <td className="p-3 text-slate-300">
                    {language === 'vi' ? item.tasksVi : item.tasksEn}
                  </td>
                  <td className="p-3 font-mono text-purple-300 whitespace-nowrap">{item.assignee}</td>
                  <td className="p-3 text-center font-mono text-cyan-300 font-bold">{item.weight}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      100% Done
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
