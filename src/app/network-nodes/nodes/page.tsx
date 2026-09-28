'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  Server, 
  Globe, 
  Power, 
  Activity, 
  Cpu, 
  Radio, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Wifi
} from 'lucide-react';
import Link from 'next/link';

export default function NodeRegistryPage() {
  const { language } = useLanguageStore();
  const { nodes, toggleNodeStatus } = useBlockchainLifecycleStore();

  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');

  const filteredNodes = nodes.filter((n) => {
    if (filter === 'online') return n.status === 'online';
    if (filter === 'offline') return n.status === 'offline';
    return true;
  });

  const onlineCount = nodes.filter((n) => n.status === 'online').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900 border border-emerald-800/40">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[11px] font-extrabold text-emerald-300 whitespace-nowrap tracking-wider shrink-0">
              NET 1
            </span>
            <span>
              {language === 'vi' ? 'Mạng Lưới Nodes • Danh Sách Nút' : 'Network & Nodes • Node Registry'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Danh Sách & Trạng Thái Các Nút Mạng (Node Registry)' : 'Node Registry & Topology States'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Quản lý các Full Node phân tán toàn cầu, theo dõi độ trễ (latency), kết nối ngang hàng P2P và trạng thái bật/tắt.'
              : 'Monitor global distributed Full Nodes, track latency, peer connections, and toggle node online states.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/network-nodes/network"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Sơ Đồ Mạng P2P' : 'P2P Graph'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Network Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{language === 'vi' ? 'Tổng Số Nút' : 'Total Nodes'}</div>
            <div className="text-xl font-black text-white">{nodes.length} Nodes</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{language === 'vi' ? 'Đang Hoạt Động (Online)' : 'Online Nodes'}</div>
            <div className="text-xl font-black text-emerald-400">{onlineCount} / {nodes.length} Active</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{language === 'vi' ? 'Khu Vực Phân Bổ' : 'Regions Covered'}</div>
            <div className="text-xl font-black text-cyan-300">4 Continents</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'online', 'offline'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === tab
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab === 'all'
              ? (language === 'vi' ? 'Tất Cả Nút' : 'All Nodes')
              : tab === 'online'
              ? (language === 'vi' ? 'Đang Online' : 'Online Only')
              : (language === 'vi' ? 'Đang Tắt (Offline)' : 'Offline Only')}
          </button>
        ))}
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNodes.map((node) => {
          const isOnline = node.status === 'online';

          return (
            <div
              key={node.id}
              className={`p-6 rounded-3xl border transition-all ${
                isOnline
                  ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50'
                  : 'bg-slate-950/60 border-slate-800/60 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{node.name}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-500" />
                      {node.location}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleNodeStatus(node.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    isOnline
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-emerald-950/40 hover:text-emerald-400 hover:border-emerald-500/40'
                  }`}
                  title={isOnline ? (language === 'vi' ? 'Bấm để tắt nút (Offline)' : 'Click to set Offline') : (language === 'vi' ? 'Bấm để bật nút (Online)' : 'Click to set Online')}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-slate-400">
                  <span>{language === 'vi' ? 'Trạng Thái Mạng:' : 'Network State:'}</span>
                  <span className={`font-bold flex items-center gap-1 ${
                    isOnline ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isOnline ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {isOnline ? (language === 'vi' ? 'Online (Hoạt động)' : 'Online (Active)') : (language === 'vi' ? 'Offline (Tắt)' : 'Offline (Down)')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>{language === 'vi' ? 'Độ Trễ Ping:' : 'Ping Latency:'}</span>
                  <span className="font-mono text-cyan-300 flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-cyan-400" />
                    {isOnline ? `${node.latencyMs} ms` : (language === 'vi' ? 'Mất kết nối' : 'Disconnected')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>{language === 'vi' ? 'Kết Nối Ngang Hàng (Peers):' : 'Direct Peers:'}</span>
                  <span className="font-bold text-purple-300">{node.connectedNodeIds.length} Peers</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>{language === 'vi' ? 'Giao Dịch Đã Nhận:' : 'Cached Txs:'}</span>
                  <span className="font-bold text-amber-300">{node.receivedTxIds.length} Txs Cached</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
