'use client';

import React, { useState, useEffect } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  Network, 
  Globe, 
  Activity, 
  ArrowRight, 
  Radio, 
  Server, 
  Zap, 
  Play,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';

// Predefined 2D coordinates on virtual globe/canvas
const NODE_COORDINATES: Record<string, { x: number; y: number }> = {
  node_hanoi: { x: 260, y: 180 },
  node_hcm: { x: 280, y: 280 },
  node_singapore: { x: 380, y: 320 },
  node_tokyo: { x: 520, y: 150 },
  node_frankfurt: { x: 680, y: 220 },
  node_sf: { x: 800, y: 160 }
};

export default function P2PNetworkTopologyPage() {
  const { language } = useLanguageStore();
  const { nodes, toggleNodeStatus } = useBlockchainLifecycleStore();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node_hanoi');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900 border border-emerald-800/40">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[11px] font-extrabold text-emerald-300 whitespace-nowrap tracking-wider shrink-0">
              NET 2
            </span>
            <span>
              {language === 'vi' ? 'Mạng Lưới Nodes • Cấu Trúc P2P' : 'Network & Nodes • P2P Topology'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Sơ Đồ Mạng Lưới Phân Tán (P2P Mesh Topology)' : 'P2P Mesh Topology Interactive Graph'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Trực quan hóa cấu trúc liên kết phi tập trung, các đường truyền ngang hàng và dòng chảy gói tin dữ liệu liên tục.'
              : 'Interactive mesh graph showing decentralized node links and continuous data packet flows.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/network-nodes/connections"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Quản Lý Kết Nối' : 'Manage Links'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* SVG Topology Graph Canvas */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Network className="w-4 h-4 text-emerald-400" />
            {language === 'vi' ? 'Bản Đồ Mạng Lưới Toàn Cầu P2P' : 'Global P2P Network Map'}
          </div>
          <span className="text-xs text-slate-400">
            {language === 'vi' ? 'Nhấp vào nút để kiểm tra các đường liên kết' : 'Click a node to inspect peer connections'}
          </span>
        </div>

        <div className="relative w-full h-[400px] overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800/80">
          <svg className="w-full h-full" viewBox="0 0 950 420">
            {/* Grid Pattern Background */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.4" />
              </pattern>
              <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Connection Lines */}
            {nodes.map((node) => {
              const startPos = NODE_COORDINATES[node.id] || { x: 100, y: 100 };
              const isNodeOnline = node.status === 'online';

              return node.connectedNodeIds.map((targetId) => {
                const targetNode = nodes.find((n) => n.id === targetId);
                const isTargetOnline = targetNode?.status === 'online';
                const endPos = NODE_COORDINATES[targetId] || { x: 200, y: 200 };
                const isConnectedBoth = isNodeOnline && isTargetOnline;
                const isHighlighted = selectedNodeId === node.id || selectedNodeId === targetId;

                return (
                  <g key={`${node.id}-${targetId}`}>
                    <line
                      x1={startPos.x}
                      y1={startPos.y}
                      x2={endPos.x}
                      y2={endPos.y}
                      stroke={isConnectedBoth ? (isHighlighted ? '#34d399' : '#0f766e') : '#334155'}
                      strokeWidth={isHighlighted ? 2.5 : 1.5}
                      strokeDasharray={isConnectedBoth ? 'none' : '4,4'}
                      opacity={isConnectedBoth ? 0.7 : 0.25}
                    />
                    {/* Continuous Smooth Animated Packet */}
                    {isConnectedBoth && (
                      <g>
                        {/* Glow halo */}
                        <circle r="6" fill="#10b981" opacity="0.3">
                          <animateMotion
                            path={`M ${startPos.x} ${startPos.y} L ${endPos.x} ${endPos.y}`}
                            dur={`${((node.latencyMs || 50) / 40) + 3.2}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                        {/* Packet Core */}
                        <circle r="3.5" fill="#a7f3d0">
                          <animateMotion
                            path={`M ${startPos.x} ${startPos.y} L ${endPos.x} ${endPos.y}`}
                            dur={`${((node.latencyMs || 50) / 40) + 3.2}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      </g>
                    )}
                  </g>
                );
              });
            })}

            {/* Nodes Render */}
            {nodes.map((node) => {
              const pos = NODE_COORDINATES[node.id] || { x: 150, y: 150 };
              const isSelected = selectedNodeId === node.id;
              const isOnline = node.status === 'online';

              return (
                <g
                  key={node.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  {/* Invisible broad hit target to avoid mouseenter/mouseleave flicker */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="34"
                    fill="transparent"
                  />

                  {/* Glowing Outer Ring */}
                  {isSelected && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="26"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                  )}

                  {/* Hover Accent Ring */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="23"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />

                  {/* Node Circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="18"
                    fill={isOnline ? '#065f46' : '#1e293b'}
                    stroke={isOnline ? (isSelected ? '#34d399' : '#059669') : '#475569'}
                    strokeWidth="3"
                    className="group-hover:stroke-emerald-400 transition-colors duration-200"
                  />

                  {/* Node Icon/Dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="6"
                    fill={isOnline ? '#6ee7b7' : '#64748b'}
                    className="group-hover:fill-white transition-colors duration-200"
                  />

                  {/* Node Label */}
                  <text
                    x={pos.x}
                    y={pos.y + 32}
                    textAnchor="middle"
                    fill={isSelected ? '#34d399' : '#cbd5e1'}
                    fontSize="11"
                    fontWeight="bold"
                    className="font-mono select-none group-hover:fill-emerald-300 transition-colors duration-200"
                  >
                    {node.name}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 44}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9"
                    className="select-none group-hover:fill-slate-300 transition-colors duration-200"
                  >
                    {node.location}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Node Details Card */}
      {selectedNode && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              selectedNode.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
            }`}>
              <Server className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedNode.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  selectedNode.status === 'online'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {selectedNode.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                <span>Vị trí: <span className="text-slate-300 font-semibold">{selectedNode.location}</span></span>
                <span>Độ trễ: <span className="text-cyan-300 font-mono font-semibold">{selectedNode.latencyMs} ms</span></span>
                <span>Peers: <span className="text-purple-300 font-semibold">{selectedNode.connectedNodeIds.length} kết nối</span></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleNodeStatus(selectedNode.id)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
            >
              {selectedNode.status === 'online'
                ? (language === 'vi' ? 'Tắt Nút (Offline)' : 'Set Offline')
                : (language === 'vi' ? 'Bật Nút (Online)' : 'Set Online')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
