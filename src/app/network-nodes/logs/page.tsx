'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  Terminal, 
  Trash2, 
  Download, 
  ArrowRight, 
  Filter, 
  Activity, 
  Radio, 
  Boxes, 
  Server
} from 'lucide-react';
import Link from 'next/link';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'gossip' | 'block' | 'peer' | 'system';
  node: string;
  message: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: '1', timestamp: '17:00:01', type: 'system', node: 'System Core', message: 'P2P Network Engine initialized with 6 active nodes.' },
  { id: '2', timestamp: '17:00:04', type: 'peer', node: 'Node Hà Nội', message: 'Handshake accepted from Node TP.HCM (Latency: 25ms).' },
  { id: '3', timestamp: '17:00:08', type: 'peer', node: 'Node Singapore', message: 'Gossip routing table updated: 3 neighbors linked.' },
  { id: '4', timestamp: '17:00:15', type: 'gossip', node: 'Node TP.HCM', message: 'Gossip TX packet received (ID: 0x8a92f4...). Relaying to peers.' },
  { id: '5', timestamp: '17:00:22', type: 'block', node: 'Validator Alpha', message: 'Block #1 verified and committed to canonical chain.' },
  { id: '6', timestamp: '17:00:30', type: 'peer', node: 'Node Tokyo', message: 'Keep-alive ping acknowledged from Node San Francisco (190ms).' }
];

export default function NetworkLogsPage() {
  const { language } = useLanguageStore();
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    if (selectedType === 'all') return true;
    return log.type === selectedType;
  });

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleAddSampleLog = () => {
    const newLog: LogEntry = {
      id: String(Date.now()),
      timestamp: new Date().toLocaleTimeString(),
      type: 'gossip',
      node: 'Node Hà Nội',
      message: `Simulated Gossip Packet Ping from Peer (Nonce: ${Math.floor(Math.random() * 99999)})`
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900 border border-emerald-800/40">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[11px] font-extrabold text-emerald-300 whitespace-nowrap tracking-wider shrink-0">
              NET 6
            </span>
            <span>
              {language === 'vi' ? 'Mạng Lưới Nodes • Nhật Ký Mạng' : 'Network & Nodes • Event Logs'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Nhật Ký Sự Kiện Mạng Lưới P2P (Network Event Logs)' : 'P2P Network Event Logs Console'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Theo dõi dòng dữ liệu thời gian thực ghi nhận các sự kiện bắt tay (handshake), phát sóng (gossip) và đồng bộ khối.'
              : 'Real-time telemetry stream capturing peer handshakes, gossip packet relays, and block synchronizations.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddSampleLog}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition-all"
          >
            {language === 'vi' ? 'Tạo Sự Kiện Mẫu' : 'Emit Sample Event'}
          </button>
          <Link
            href="/about-us/team"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Về Chúng Tôi' : 'About Us'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Console Card */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {(['all', 'gossip', 'block', 'peer', 'system'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  selectedType === type
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearLogs}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs transition-colors"
              title="Xóa log"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Logs Terminal Window */}
        <div className="space-y-2 font-mono text-xs max-h-[450px] overflow-y-auto pr-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-600">
              {language === 'vi' ? 'Không có sự kiện nào trong danh mục này' : 'No logs recorded for this filter'}
            </div>
          ) : (
            filteredLogs.map((log) => {
              const typeColor =
                log.type === 'gossip'
                  ? 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60'
                  : log.type === 'block'
                  ? 'text-purple-400 bg-purple-950/40 border-purple-800/60'
                  : log.type === 'peer'
                  ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60'
                  : 'text-slate-400 bg-slate-900 border-slate-800';

              return (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-[11px] shrink-0">{log.timestamp}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${typeColor}`}>
                      {log.type}
                    </span>
                    <span className="text-slate-300 font-semibold">{log.node}:</span>
                    <span className="text-slate-200">{log.message}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
