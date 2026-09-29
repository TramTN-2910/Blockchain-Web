'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  CheckSquare, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Award
} from 'lucide-react';
import Link from 'next/link';

interface TaskAssignment {
  module: string;
  tasksVi: string;
  tasksEn: string;
  assignee: string;
  assigneeId?: string;
  progress: number;
}

const TASK_LIST: TaskAssignment[] = [
  {
    module: 'Wallet',
    tasksVi: 'Thiết kế quy trình tạo/quản lý ví và tương tác',
    tasksEn: 'Design wallet creation, management, and interaction flows',
    assignee: 'Phạm Nguyễn Gia Phúc',
    assigneeId: '031340240044',
    progress: 100
  },
  {
    module: 'Transaction',
    tasksVi: 'Mô phỏng tạo giao dịch và dữ liệu giao dịch',
    tasksEn: 'Simulate transaction creation and TX data structures',
    assignee: 'Phạm Nguyễn Gia Phúc',
    assigneeId: '031340240044',
    progress: 100
  },
  {
    module: 'Hash / SHA-256',
    tasksVi: 'Mô phỏng tạo Hash và thay đổi dữ liệu để so sánh',
    tasksEn: 'Simulate Hash generation and data variation comparison',
    assignee: 'Trần Thị Tuyết Nga',
    assigneeId: '031340240018',
    progress: 100
  },
  {
    module: 'Digital Signature',
    tasksVi: 'Mô phỏng ký giao dịch bằng khóa riêng',
    tasksEn: 'Simulate transaction signing with private key',
    assignee: 'Trần Thị Tuyết Nga',
    assigneeId: '031340240018',
    progress: 100
  },
  {
    module: 'Signature Verification',
    tasksVi: 'Mô phỏng xác minh chữ ký bằng khóa công khai',
    tasksEn: 'Simulate signature verification using public key',
    assignee: 'Trần Thị Tuyết Nga',
    assigneeId: '031340240018',
    progress: 100
  },
  {
    module: 'Mempool',
    tasksVi: 'Mô phỏng giao dịch chờ xử lý trước khi vào Block',
    tasksEn: 'Simulate pending transaction pool before block packing',
    assignee: 'Huỳnh Thanh Phong',
    assigneeId: '031340240023',
    progress: 100
  },
  {
    module: 'Network',
    tasksVi: 'Mô phỏng nhiều node kết nối và trao đổi dữ liệu trong mạng Blockchain',
    tasksEn: 'Simulate multi-node mesh connections & network data exchange',
    assignee: 'Huỳnh Thanh Phong',
    assigneeId: '031340240023',
    progress: 100
  },
  {
    module: 'Merkle Tree',
    tasksVi: 'Mô phỏng gom nhiều giao dịch và tạo Merkle Root',
    tasksEn: 'Simulate batching transactions & Merkle Root generation',
    assignee: 'Lê Minh Thư',
    assigneeId: '031340240030',
    progress: 100
  },
  {
    module: 'Block',
    tasksVi: 'Mô phỏng cấu trúc và quá trình tạo Block',
    tasksEn: 'Simulate block structure anatomy and block generation process',
    assignee: 'Lê Minh Thư',
    assigneeId: '031340240030',
    progress: 100
  },
  {
    module: 'Previous Hash',
    tasksVi: 'Mô phỏng liên kết Block bằng Previous Hash',
    tasksEn: 'Simulate cryptographically linking blocks via Previous Hash',
    assignee: 'Nguyễn Quang Vinh',
    assigneeId: '031340240039',
    progress: 100
  },
  {
    module: 'Blockchain',
    tasksVi: 'Mô phỏng chuỗi nhiều Block và kiểm tra liên kết',
    tasksEn: 'Simulate multi-block chain ledger and integrity verification',
    assignee: 'Nguyễn Quang Vinh',
    assigneeId: '031340240039',
    progress: 100
  },
  {
    module: 'Proof of Stake (PoS)',
    tasksVi: 'Mô phỏng Validator được chọn để xác nhận Block',
    tasksEn: 'Simulate validator selection & block validation in PoS',
    assignee: 'Hoàng Nhật Minh',
    assigneeId: '031340240017',
    progress: 100
  },
  {
    module: 'Tamper Detection',
    tasksVi: 'Mô phỏng sửa dữ liệu và phát hiện thay đổi',
    tasksEn: 'Simulate data tampering & blockchain alteration detection',
    assignee: 'Hoàng Nhật Minh',
    assigneeId: '031340240017',
    progress: 100
  }
];

export default function TaskAssignmentsPage() {
  const { language } = useLanguageStore();
  const isEn = language === 'en';

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-100/70 via-indigo-100/60 to-slate-100/80 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-slate-900 border border-purple-200/80 dark:border-purple-800/40 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[11px] font-extrabold text-purple-700 dark:text-purple-300 whitespace-nowrap tracking-wider shrink-0">
              ABOUT 2
            </span>
            <span>
              {isEn ? 'About Us • Task Matrix' : 'Về Chúng Tôi • Phân Công Nhiệm Vụ'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isEn ? 'Blockchain Core Functions & Task Matrix' : 'Tổng Hợp Các Chức Năng Cần Có Của Blockchain'}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {isEn
              ? 'Detailed breakdown of 13 core functional modules assigned to 6 research members (Deadline: Sep 26, 2026).'
              : 'Bảng phân công chi tiết 13 module chức năng cốt lõi cho 6 thành viên nghiên cứu (Deadline: 26/9/2026).'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about-us/technology"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 text-xs font-bold transition-all"
          >
            <span>{isEn ? 'Tech Architecture' : 'Kiến Trúc Công Nghệ'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Progress Metric Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{isEn ? 'Total Functions' : 'Tổng Số Chức Năng'}</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{isEn ? '13 Core Modules' : '13 Chức Năng Cốt Lõi'}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{isEn ? 'Overall Progress' : 'Tiến Độ Đề Tài'}</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{isEn ? '100% Completed' : '100% Hoàn Thành'}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{isEn ? 'Team Members' : 'Thành Viên Thực Hiện'}</div>
            <div className="text-xl font-black text-indigo-600 dark:text-blue-300">{isEn ? '6 Students' : '6 Sinh Viên'}</div>
          </div>
        </div>
      </div>

      {/* Task Matrix Table */}
      <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>{isEn ? 'WBS Task Matrix Table' : 'Bảng Phân Công Nhiệm Vụ (WBS Matrix)'}</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-left uppercase text-[10px] tracking-wider bg-slate-50 dark:bg-slate-950/40">
                <th className="p-3">Chức Năng</th>
                <th className="p-3">Nội Dung Thực Hiện</th>
                <th className="p-3">Người Phụ Trách</th>
                <th className="p-3 text-right">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {TASK_LIST.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-slate-800/80 text-purple-700 dark:text-purple-300 font-mono border border-purple-200/60 dark:border-slate-700/80 text-xs">
                      {item.module}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-200 font-medium">
                    {isEn ? item.tasksEn : item.tasksVi}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="font-bold text-slate-900 dark:text-white">{item.assignee}</div>
                    {item.assigneeId && (
                      <div className="text-[10px] font-mono text-purple-600 dark:text-purple-400">{item.assigneeId}</div>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/30">
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
