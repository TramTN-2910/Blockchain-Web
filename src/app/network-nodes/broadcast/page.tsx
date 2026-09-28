'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  Radio, 
  Send, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  Server, 
  Zap, 
  Activity,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function GossipBroadcastPage() {
  const { language } = useLanguageStore();
  const { nodes, transactions, networkLatencyMs, setNetworkLatency, simulateBroadcastToNodes } = useBlockchainLifecycleStore();

  const [originNodeId, setOriginNodeId] = useState('node_hanoi');
  const [selectedTxId, setSelectedTxId] = useState(transactions[0]?.id || 'tx_test_sample_12345');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [currentHop, setCurrentHop] = useState<number>(-1);
  const [reachedNodes, setReachedNodes] = useState<string[]>([]);

  const handleStartBroadcast = () => {
    setIsBroadcasting(true);
    setCurrentHop(0);
    setReachedNodes([originNodeId]);

    // Hop 1: Direct peers of origin
    const originNode = nodes.find((n) => n.id === originNodeId);
    const hop1Peers = originNode ? originNode.connectedNodeIds : [];

    setTimeout(() => {
      setCurrentHop(1);
      setReachedNodes((prev) => [...new Set([...prev, ...hop1Peers])]);

      // Hop 2: Peers of hop 1
      setTimeout(() => {
        const hop2Peers = nodes
          .filter((n) => hop1Peers.includes(n.id))
          .flatMap((n) => n.connectedNodeIds);

        setCurrentHop(2);
        setReachedNodes((prev) => [...new Set([...prev, ...hop2Peers])]);

        // Hop 3: Complete flooding
        setTimeout(() => {
          setCurrentHop(3);
          const allOnline = nodes.filter((n) => n.status === 'online').map((n) => n.id);
          setReachedNodes(allOnline);
          simulateBroadcastToNodes(selectedTxId);
          setIsBroadcasting(false);
        }, networkLatencyMs * 4);
      }, networkLatencyMs * 3);
    }, networkLatencyMs * 2);
  };

  const deliveryRate = Math.round((reachedNodes.length / nodes.length) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900 border border-emerald-800/40">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[11px] font-extrabold text-emerald-300 whitespace-nowrap tracking-wider shrink-0">
              NET 4
            </span>
            <span>
              {language === 'vi' ? 'Mạng Lưới Nodes • Lan Truyền Gossip' : 'Network & Nodes • Gossip Broadcast'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Mô Phỏng Giao Thức Lan Truyền Mạng Lưới (Gossip Protocol)' : 'Gossip Protocol & Broadcast Simulator'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Quan sát quá trình một giao dịch lan tỏa qua các tầng Hop trong mạng phân tán không cần máy chủ trung tâm.'
              : 'Witness decentralized transaction propagation across peer network hops without any central server.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/network-nodes/sync"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Đồng Bộ Sổ Cái' : 'Ledger Sync'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Broadcast Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Config */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            {language === 'vi' ? '1. Điểm Phát Gốc (Origin Node)' : '1. Origin Node'}
          </h2>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">{language === 'vi' ? 'Chọn nút phát sóng:' : 'Select broadcast origin:'}</label>
            <select
              value={originNodeId}
              onChange={(e) => setOriginNodeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
            >
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name} ({node.location})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{language === 'vi' ? 'Độ Trễ Mạng (Latency):' : 'Network Latency:'}</span>
              <span className="font-mono text-cyan-300 font-bold">{networkLatencyMs} ms</span>
            </div>
            <input
              type="range"
              min={10}
              max={200}
              step={10}
              value={networkLatencyMs}
              onChange={(e) => setNetworkLatency(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* Step 2: Transaction Selection */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            {language === 'vi' ? '2. Gói Tin Giao Dịch' : '2. Transaction Payload'}
          </h2>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">{language === 'vi' ? 'Chọn giao dịch phát:' : 'Select transaction to broadcast:'}</label>
            <select
              value={selectedTxId}
              onChange={(e) => setSelectedTxId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
            >
              {transactions.map((tx, idx) => (
                <option key={tx.id || idx} value={tx.id}>
                  Tx #{idx + 1} ({tx.amount} COIN)
                </option>
              ))}
              <option value="test_packet_random">Sample Gossip Packet #99</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Broadcast Payload:</div>
            <div className="font-mono text-[11px] text-slate-300 truncate">{selectedTxId}</div>
          </div>
        </div>

        {/* Step 3: Trigger Broadcast */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-teal-400" />
              {language === 'vi' ? '3. Kích Hoạt Lan Truyền' : '3. Trigger Flood'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'vi'
                ? 'Nhấn nút để truyền gói tin qua các nút lân cận theo mô hình lây lan dịch bệnh (Epidemic/Gossip).'
                : 'Broadcast transaction packet to all connected peers using epidemic gossip propagation.'}
            </p>
          </div>

          <button
            onClick={handleStartBroadcast}
            disabled={isBroadcasting}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all ${
              isBroadcasting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            <Send className="w-4 h-4" />
            {isBroadcasting
              ? (language === 'vi' ? `Đang Lan Truyền (Hop ${currentHop})...` : `Flooding (Hop ${currentHop})...`)
              : (language === 'vi' ? 'Bắt Đầu Lan Truyền Gossip' : 'Start Gossip Flood')}
          </button>
        </div>
      </div>

      {/* Gossip Propagation Visual Status */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            {language === 'vi' ? 'Trạng Thái Tiếp Nhận Gói Tin Của Toàn Mạng' : 'Network Packet Delivery Status'}
          </h2>
          <span className="font-mono text-xs font-bold text-emerald-400">
            {reachedNodes.length} / {nodes.length} Nodes ({deliveryRate}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${deliveryRate}%` }}
          />
        </div>

        {/* Grid of Nodes with Received Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {nodes.map((node) => {
            const hasReceived = reachedNodes.includes(node.id);
            const isOrigin = originNodeId === node.id;

            return (
              <div
                key={node.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isOrigin
                    ? 'border-cyan-500 bg-cyan-950/30 shadow-lg shadow-cyan-950/20'
                    : hasReceived
                    ? 'border-emerald-500/60 bg-emerald-950/30 shadow-lg shadow-emerald-950/20'
                    : 'border-slate-800 bg-slate-950/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-xs">{node.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    isOrigin
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : hasReceived
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isOrigin ? 'Origin' : hasReceived ? 'Delivered' : 'Waiting'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{node.location}</span>
                  <span className="font-mono text-slate-300">{node.latencyMs}ms</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
