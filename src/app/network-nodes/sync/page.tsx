'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  RefreshCcw, 
  Server, 
  ArrowRight, 
  CheckCircle2, 
  DownloadCloud, 
  Boxes, 
  Zap, 
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import Link from 'next/link';

export default function LedgerSyncPage() {
  const { language } = useLanguageStore();
  const { nodes, blockchain } = useBlockchainLifecycleStore();

  const maxChainHeight = blockchain.length;
  const [nodeHeights, setNodeHeights] = useState<Record<string, number>>({
    node_hanoi: maxChainHeight,
    node_hcm: maxChainHeight,
    node_singapore: maxChainHeight,
    node_tokyo: Math.max(1, maxChainHeight - 1),
    node_frankfurt: Math.max(1, maxChainHeight - 1),
    node_sf: 1
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const synced: Record<string, number> = {};
      nodes.forEach((n) => {
        synced[n.id] = maxChainHeight;
      });
      setNodeHeights(synced);
      setIsSyncing(false);
    }, 1500);
  };

  const handleDesync = () => {
    setNodeHeights({
      node_hanoi: maxChainHeight,
      node_hcm: maxChainHeight,
      node_singapore: maxChainHeight,
      node_tokyo: Math.max(1, maxChainHeight - 1),
      node_frankfurt: Math.max(1, maxChainHeight - 1),
      node_sf: 1
    });
  };

  const isAllSynced = Object.values(nodeHeights).every((h) => h === maxChainHeight);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900 border border-emerald-800/40">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[11px] font-extrabold text-emerald-300 whitespace-nowrap tracking-wider shrink-0">
              NET 5
            </span>
            <span>
              {language === 'vi' ? 'Mạng Lưới Nodes • Đồng Bộ Sổ Cái' : 'Network & Nodes • Ledger Sync'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Đồng Bộ Hóa Sổ Cái & Khối (Ledger State Sync)' : 'Ledger State Synchronization'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Mô phỏng cơ chế tải và xác minh khối của các nút mạng chậm (lagging nodes) để đạt trạng thái đồng thuận mới nhất.'
              : 'Simulate block downloading and state verification for lagging nodes to achieve canonical consensus.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDesync}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
          >
            {language === 'vi' ? 'Tạo Độ Lệch Khối' : 'Simulate Lag'}
          </button>
          <Link
            href="/network-nodes/logs"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Nhật Ký Mạng' : 'Network Logs'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isAllSynced ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400 animate-pulse'
          }`}>
            {isAllSynced ? <ShieldCheck className="w-6 h-6" /> : <RotateCw className="w-6 h-6 animate-spin" />}
          </div>
          <div>
            <div className="text-base font-bold text-white">
              {isAllSynced
                ? (language === 'vi' ? 'Trạng Thái: 100% Các Nút Đã Đồng Bộ Hoàn Hảo' : 'All Nodes Fully Synchronized')
                : (language === 'vi' ? 'Cảnh Báo: Một Số Nút Đang Bị Chậm Khối (Lagging)' : 'Notice: Some Nodes Are Lagging Behind')}
            </div>
            <div className="text-xs text-slate-400">
              {language === 'vi'
                ? `Chiều cao chuỗi chuẩn hiện tại (Canonical Height): ${maxChainHeight} Blocks`
                : `Current Canonical Block Height: ${maxChainHeight} Blocks`}
            </div>
          </div>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={isSyncing || isAllSynced}
          className={`w-full md:w-auto px-6 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all ${
            isAllSynced
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
          }`}
        >
          <DownloadCloud className="w-4 h-4" />
          {isSyncing
            ? (language === 'vi' ? 'Đang Đồng Bộ Khối...' : 'Syncing Blocks...')
            : (language === 'vi' ? 'Đồng Bộ Toàn Mạng (Full Sync)' : 'Run Full Sync')}
        </button>
      </div>

      {/* Nodes Sync Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => {
          const currentHeight = nodeHeights[node.id] || 1;
          const isSynced = currentHeight === maxChainHeight;
          const percentage = Math.round((currentHeight / maxChainHeight) * 100);

          return (
            <div key={node.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isSynced ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{node.name}</h3>
                    <div className="text-xs text-slate-400">{node.location}</div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  isSynced ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {isSynced ? 'Synced' : 'Lagging'}
                </span>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Chiều Cao Khối (Height):</span>
                  <span className="font-mono text-white font-bold">{currentHeight} / {maxChainHeight}</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isSynced ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
