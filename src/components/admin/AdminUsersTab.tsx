'use client';

import React, { useState } from 'react';
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Search,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  History,
  Trash2,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useAdminStore } from '@/store/useAdminStore';

export default function AdminUsersTab() {
  const { users, attempts, updateUserRole, deleteUser } = useAdminStore();
  const [searchUser, setSearchUser] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const toggleRole = (userId: string, currentRole: 'admin' | 'user') => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    updateUserRole(userId, nextRole);
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: USER ACCOUNTS TABLE */}
      <div className="space-y-4">
        
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Danh Sách Học Viên & Quản Trị Viên</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quản lý phân quyền tài khoản (Admin/User), điểm số trung bình và mức độ hoạt động.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Tìm tên hoặc email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <SpotlightCard className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden backdrop-blur-xl" spotlightColor="rgba(99, 102, 241, 0.12)">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Thành viên</th>
                  <th className="py-3.5 px-4">Vai trò</th>
                  <th className="py-3.5 px-4 text-center">Số bài đã thi</th>
                  <th className="py-3.5 px-4 text-center">Điểm TB</th>
                  <th className="py-3.5 px-4">Hoạt động</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* User info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          user.role === 'admin'
                            ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <>
                            <Shield className="w-3 h-3 text-purple-500" />
                            <span>Admin</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3 text-slate-400" />
                            <span>Học viên</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Quizzes taken */}
                    <td className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                      {user.quizzesTaken}
                    </td>

                    {/* Avg score */}
                    <td className="py-3 px-4 text-center font-extrabold text-indigo-600 dark:text-indigo-400">
                      {user.avgScore}%
                    </td>

                    {/* Last active */}
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                      {user.lastActive}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleRole(user.id, user.role)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Chuyển đổi vai trò Admin / User"
                        >
                          Đổi quyền
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => deleteUser(user.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpotlightCard>

      </div>

      {/* SECTION 2: GLOBAL ATTEMPTS & TEST HISTORY */}
      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-xl">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Lịch Sử Thi & Kiểm Duyệt Kết Quả Toàn Hệ Thống</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Theo dõi chi tiết các lượt làm bài, điểm số và thời gian nộp bài của học viên.
          </p>
        </div>

        <SpotlightCard className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden backdrop-blur-xl" spotlightColor="rgba(168, 85, 247, 0.12)">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4">Học viên</th>
                  <th className="py-3.5 px-4">Bài thi trắc nghiệm</th>
                  <th className="py-3.5 px-4 text-center">Điểm số</th>
                  <th className="py-3.5 px-4 text-center">Thời gian làm</th>
                  <th className="py-3.5 px-4 text-center">Kết quả</th>
                  <th className="py-3.5 px-4 text-right">Thời điểm nộp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {attempts.map((att) => {
                  const minutes = Math.floor(att.durationSeconds / 60);
                  const seconds = att.durationSeconds % 60;
                  const durationStr = `${minutes}p ${seconds < 10 ? '0' : ''}${seconds}s`;

                  return (
                    <tr key={att.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {att.userName}
                      </td>

                      {/* Title */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {att.quizTitle}
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {att.score}
                        </span>
                        <span className="text-slate-400 font-normal"> / {att.totalQuestions}</span>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 text-center text-slate-500 dark:text-slate-400">
                        {durationStr}
                      </td>

                      {/* Status badge */}
                      <td className="py-3.5 px-4 text-center">
                        {att.passed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>Đạt</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                            <XCircle className="w-3 h-3 text-rose-500" />
                            <span>Chưa đạt</span>
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-right text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {att.completedAt}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SpotlightCard>

      </div>

    </div>
  );
}
