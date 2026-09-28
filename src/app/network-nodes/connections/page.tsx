'use client';

import React from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  Network, 
  Link2, 
  Unlink, 
  ArrowRight, 
  Server, 
  Check, 
  X,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function PeerConnectionsPage() {
  const { language } = useLanguageStore();
  const { nodes, toggleNodeConnection } = useBlockchainLifecycleStore();

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900 border border-emerald-800/40">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[11px] font-extrabold text-emerald-300 whitespace-nowrap tracking-wider shrink-0">
              NET 3
            </span>
            <span>
              {language === 'vi' ? 'Mạng Lưới Nodes • Quản Lý Kết Nối' : 'Network & Nodes • Peer Connections'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Ma Trận & Quản Lý Kết Nối Ngang Hàng (P2P Link Matrix)' : 'P2P Link Matrix & Peer Management'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Tùy chỉnh bật/tắt các đường kết nối P2P trực tiếp giữa từng cặp nút để thử nghiệm phân mảnh mạng lưới.'
              : 'Toggle direct peer connections between nodes to simulate network partitioning and isolation.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/network-nodes/broadcast"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Lan Truyền Gossip' : 'Gossip Broadcast'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Peer Connection Matrix Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-teal-400" />
            {language === 'vi' ? 'Bảng Ma Trận Kết Nối Giữa Các Nút' : 'Peer Interconnection Matrix'}
          </h2>
          <span className="text-xs text-slate-400">
            {language === 'vi' ? 'Bấm vào ô để bật / ngắt kết nối giữa 2 Node' : 'Click a cell to connect / disconnect peers'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-950/80 rounded-tl-2xl">
                  Node / Peer
                </th>
                {nodes.map((node) => (
                  <th key={node.id} className="p-3 text-xs font-bold text-slate-300 bg-slate-950/80">
                    <div className="truncate max-w-[100px]">{node.name.replace('Node ', '')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nodes.map((sourceNode, rIdx) => (
                <tr key={sourceNode.id} className="border-t border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 text-left text-xs font-bold text-white flex items-center gap-2 bg-slate-950/40">
                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{sourceNode.name}</span>
                  </td>

                  {nodes.map((targetNode) => {
                    const isSelf = sourceNode.id === targetNode.id;
                    const isConnected = sourceNode.connectedNodeIds.includes(targetNode.id);

                    if (isSelf) {
                      return (
                        <td key={targetNode.id} className="p-3 bg-slate-950/20 text-slate-700 font-mono text-xs">
                          -
                        </td>
                      );
                    }

                    return (
                      <td key={targetNode.id} className="p-2">
                        <button
                          onClick={() => toggleNodeConnection(sourceNode.id, targetNode.id)}
                          className={`w-full py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                            isConnected
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30'
                              : 'bg-slate-950 text-slate-600 border border-slate-800 hover:bg-slate-800 hover:text-slate-300'
                          }`}
                        >
                          {isConnected ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                          <span className="text-[10px]">{isConnected ? 'Linked' : 'Off'}</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Peer Quick Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <div key={node.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                {node.name}
              </h3>
              <span className="text-xs text-purple-300 font-mono font-bold">
                {node.connectedNodeIds.length} peers
              </span>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'vi' ? 'Kết Nối Trực Tiếp Tới:' : 'Direct Peers:'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {node.connectedNodeIds.map((peerId) => {
                  const peerNode = nodes.find((n) => n.id === peerId);
                  return (
                    <span
                      key={peerId}
                      className="px-2.5 py-1 rounded-lg bg-teal-950/60 text-teal-300 border border-teal-800/60 text-[11px] font-mono flex items-center gap-1"
                    >
                      <Link2 className="w-3 h-3 text-teal-400" />
                      {peerNode?.name.replace('Node ', '') || peerId}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
