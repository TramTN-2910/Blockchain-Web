'use client';

import React, { useState, useMemo } from 'react';
import { sha256 } from 'js-sha256';
import { 
  TreePine, 
  X, 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Crown,
  Link as LinkIcon,
  Leaf,
  Copy,
  Check,
  Lock,
  ArrowDown,
  Info,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface MerkleNode {
  id: string;
  level: number;
  index: number;
  hash: string;
  type: 'leaf' | 'internal' | 'root';
  label?: string;
  rawTx?: string;
  leftChild?: MerkleNode;
  rightChild?: MerkleNode;
  isDuplicated?: boolean;
}

export default function MerkleTreePage() {
  const { language } = useTranslation();
  const isVi = language === 'vi';

  const [transactions, setTransactions] = useState<string[]>([
    'Transaction A',
    'Transaction B',
    'Transaction C',
    'Transaction D',
  ]);

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedNode, setSelectedNode] = useState<MerkleNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleAddTransaction = () => {
    if (transactions.length >= 8) return;
    const nextChar = String.fromCharCode(65 + transactions.length);
    setTransactions([...transactions, `Transaction ${nextChar}`]);
  };

  const handleRemoveTransaction = (index: number) => {
    if (transactions.length <= 1) return;
    setTransactions(transactions.filter((_, idx) => idx !== index));
  };

  const handleUpdateTransaction = (index: number, val: string) => {
    const updated = [...transactions];
    updated[index] = val;
    setTransactions(updated);
  };

  // Build the hierarchical Merkle Tree data
  const { treeLayers, rootNode } = useMemo(() => {
    if (transactions.length === 0) {
      return { treeLayers: [], rootNode: null };
    }

    // Level 0: Leaves
    let currentLevelNodes: MerkleNode[] = transactions.map((tx, idx) => ({
      id: `leaf-${idx}`,
      level: 0,
      index: idx,
      hash: sha256(tx),
      type: 'leaf' as const,
      rawTx: tx,
      label: `Tx ${idx + 1}`
    }));

    const allLayers: MerkleNode[][] = [currentLevelNodes];
    let currentLevel = 1;

    while (currentLevelNodes.length > 1) {
      const nextLevelNodes: MerkleNode[] = [];

      for (let i = 0; i < currentLevelNodes.length; i += 2) {
        const left = currentLevelNodes[i];
        const right = currentLevelNodes[i + 1] || { 
          ...left, 
          id: `${left.id}-dup-${currentLevel}`, 
          isDuplicated: true 
        };
        const combinedHash = sha256(left.hash + right.hash);

        nextLevelNodes.push({
          id: `node-${currentLevel}-${Math.floor(i / 2)}`,
          level: currentLevel,
          index: Math.floor(i / 2),
          hash: combinedHash,
          type: 'internal' as const,
          leftChild: left,
          rightChild: right,
        });
      }

      currentLevelNodes = nextLevelNodes;
      allLayers.push(currentLevelNodes);
      currentLevel++;
    }

    // Set root type for the topmost node
    const root = allLayers[allLayers.length - 1][0];
    if (root) {
      root.type = 'root';
    }

    return { treeLayers: allLayers, rootNode: root };
  }, [transactions]);

  const formatHashShort = (h: string) => {
    if (!h) return '';
    return `${h.slice(0, 6)}...${h.slice(-6)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Layout calculations for rendering nodes and SVG connecting lines
  const totalTreeLevels = treeLayers.length;
  const maxLeafCount = treeLayers[0]?.length || 4;
  const canvasWidth = Math.max(760, maxLeafCount * 190);
  const rowHeight = 160;
  const topPadding = 70;
  const canvasHeight = Math.max(480, (totalTreeLevels - 1) * rowHeight + topPadding + 100);

  // Compute bottom-up symmetric (x, y) coordinates for each node
  const nodeCoordinates = useMemo(() => {
    const coords = new Map<string, { x: number; y: number }>();
    if (!treeLayers.length) return coords;

    // First, place leaf nodes evenly across canvasWidth
    const leafLayer = treeLayers[0];
    const leafCount = leafLayer.length;
    const leafY = topPadding + (totalTreeLevels - 1) * rowHeight;

    leafLayer.forEach((node, idx) => {
      const segmentWidth = canvasWidth / leafCount;
      const x = (idx + 0.5) * segmentWidth;
      coords.set(node.id, { x, y: leafY });
    });

    // Compute parent coordinates as the midpoint of children
    for (let layerIdx = 1; layerIdx < totalTreeLevels; layerIdx++) {
      const layer = treeLayers[layerIdx];
      const visualRow = totalTreeLevels - 1 - layerIdx;
      const y = topPadding + visualRow * rowHeight;

      layer.forEach((node) => {
        if (node.leftChild) {
          const leftPos = coords.get(node.leftChild.id);
          const rightPos = node.rightChild ? coords.get(node.rightChild.id) : leftPos;

          if (leftPos && rightPos) {
            const x = (leftPos.x + rightPos.x) / 2;
            coords.set(node.id, { x, y });
          } else if (leftPos) {
            coords.set(node.id, { x: leftPos.x, y });
          }
        }
      });
    }

    return coords;
  }, [treeLayers, totalTreeLevels, canvasWidth, rowHeight, topPadding]);

  // Generate SVG connection paths and plus (+) node positions
  const connections = useMemo(() => {
    const lines: Array<{
      id: string;
      parentId: string;
      leftChildId: string;
      rightChildId: string;
      parent: MerkleNode;
      left: MerkleNode;
      right: MerkleNode;
      parentPos: { x: number; y: number };
      leftPos: { x: number; y: number };
      rightPos: { x: number; y: number };
      plusPos: { x: number; y: number };
      pathLeft: string;
      pathRight: string;
      pathStem: string;
    }> = [];

    treeLayers.forEach((layer, layerIdx) => {
      if (layerIdx === 0) return; // leaves have no children

      layer.forEach((parentNode) => {
        if (!parentNode.leftChild) return;
        const pPos = nodeCoordinates.get(parentNode.id);
        const lPos = nodeCoordinates.get(parentNode.leftChild.id);
        const rPos = parentNode.rightChild ? nodeCoordinates.get(parentNode.rightChild.id) : lPos;

        if (!pPos || !lPos) return;
        const effectiveRPos = rPos || lPos;

        const parentCardHalfHeight = 30;
        const childCardTopOffset = 30;
        const plusY = pPos.y + parentCardHalfHeight + 32;
        const plusPos = { x: pPos.x, y: plusY };

        // Vertical stem from parent bottom to plus badge
        const pathStem = `M ${pPos.x} ${pPos.y + parentCardHalfHeight} L ${pPos.x} ${plusY - 12}`;

        // Smooth Bezier curve from plus badge to left child top
        const pathLeft = `M ${pPos.x} ${plusY + 12} C ${pPos.x} ${plusY + 38}, ${lPos.x} ${lPos.y - childCardTopOffset - 25}, ${lPos.x} ${lPos.y - childCardTopOffset}`;

        // Smooth Bezier curve from plus badge to right child top
        const pathRight = `M ${pPos.x} ${plusY + 12} C ${pPos.x} ${plusY + 38}, ${effectiveRPos.x} ${effectiveRPos.y - childCardTopOffset - 25}, ${effectiveRPos.x} ${effectiveRPos.y - childCardTopOffset}`;

        lines.push({
          id: `conn-${parentNode.id}`,
          parentId: parentNode.id,
          leftChildId: parentNode.leftChild.id,
          rightChildId: parentNode.rightChild?.id || parentNode.leftChild.id,
          parent: parentNode,
          left: parentNode.leftChild,
          right: parentNode.rightChild || parentNode.leftChild,
          parentPos: pPos,
          leftPos: lPos,
          rightPos: effectiveRPos,
          plusPos,
          pathLeft,
          pathRight,
          pathStem,
        });
      });
    });

    return lines;
  }, [treeLayers, nodeCoordinates]);

  // Check if a line is part of the active/hovered path
  const isLineHighlighted = (conn: typeof connections[0]) => {
    if (!hoveredNodeId && !selectedNode) return false;
    const targetId = hoveredNodeId || selectedNode?.id;
    return (
      conn.parentId === targetId ||
      conn.leftChildId === targetId ||
      conn.rightChildId === targetId
    );
  };

  return (
    <div className="space-y-8">
      
      {/* Top Theory Banner */}
      <SpotlightCard 
        spotlightColor="rgba(16, 185, 129, 0.16)"
        className="glass-card p-6 sm:p-8 space-y-6 shadow-xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <TreePine className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {isVi ? 'Cây Merkle là gì?' : 'What is a Merkle Tree?'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isVi ? 'Cấu trúc dữ liệu mật mã tối ưu cho xác thực Block Header' : 'Cryptographic data structure used in modern blockchain technology'}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isVi ? (
                <>Một <span className="font-bold text-purple-600 dark:text-purple-400">Cây Merkle</span> là cây băm nhị phân trong đó mỗi lá chứa băm của một giao dịch, và mỗi nút cha chứa băm của hai con. Cấu trúc này cho phép xác minh dữ liệu hiệu quả với độ phức tạp $O(\log N)$ và chống giả mạo tuyệt đối.</>
              ) : (
                <>A <span className="font-bold text-purple-600 dark:text-purple-400">Merkle Tree</span> is a binary hash tree where each leaf is the hash of a transaction, and each parent node is the hash of its concatenated children. This enables logarithmic $O(\log N)$ verification proofs.</>
              )}
            </p>

            {/* 3 Theory Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs flex items-center gap-2.5">
                <Leaf className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block text-[10px]">
                    {isVi ? 'NÚT LÁ' : 'LEAF NODES'}
                  </span>
                  <span className="text-slate-500 text-[11px]">SHA-256(Raw Tx)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs flex items-center gap-2.5">
                <LinkIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block text-[10px]">
                    {isVi ? 'NÚT CHA' : 'INTERNAL NODES'}
                  </span>
                  <span className="text-slate-500 text-[11px]">SHA-256(Left + Right)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs flex items-center gap-2.5">
                <Crown className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block text-[10px]">
                    {isVi ? 'GỐC MERKLE' : 'MERKLE ROOT'}
                  </span>
                  <span className="text-slate-500 text-[11px]">{isVi ? 'Đỉnh cây đại diện' : 'Summary Root Hash'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Summary Card */}
          <div className="p-6 rounded-2xl bg-indigo-50/60 dark:bg-[#0b0f19] border border-indigo-200/80 dark:border-purple-900/40 space-y-4 text-center shadow-lg">
            <div className="px-4 py-1.5 rounded-xl bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold inline-flex items-center gap-1.5 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isVi ? 'Gốc Merkle' : 'Merkle Root'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-blue-950/60 border border-blue-800/40 text-blue-700 dark:text-blue-300">
                Hash(A+B)
              </div>
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-blue-950/60 border border-blue-800/40 text-blue-700 dark:text-blue-300">
                Hash(C+D)
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-[9px] font-mono">
              {['Tx A', 'Tx B', 'Tx C', 'Tx D'].map((txName, i) => (
                <div key={i} className="p-1.5 rounded bg-slate-200 dark:bg-cyan-950/40 border border-cyan-800/40 text-cyan-700 dark:text-cyan-300">
                  {txName}
                </div>
              ))}
            </div>
          </div>

        </div>
      </SpotlightCard>

      {/* Main Interactive Merkle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Block Data Inputs (Matching Image 1) */}
        <SpotlightCard 
          spotlightColor="rgba(99, 102, 241, 0.16)"
          className="lg:col-span-4 glass-card p-6 space-y-5 shadow-xl bg-[#090d16]/95 border-slate-800"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-100">
              {isVi ? 'Dữ liệu Khối' : 'Block Data'}
            </h3>
            <p className="text-xs text-slate-400">
              {isVi ? 'Nhập các giao dịch để đưa vào Cây Merkle' : 'Enter transactions to include in the Merkle Tree'}
            </p>
          </div>

          <div className="space-y-3">
            {transactions.map((tx, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2.5 p-1 rounded-2xl bg-[#0e1320] border border-slate-800/80 hover:border-slate-700 transition-all focus-within:border-purple-500/60 focus-within:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
              >
                <span className="w-7 h-7 rounded-full border border-slate-700 bg-slate-900/90 text-slate-400 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 ml-1">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={tx}
                  onChange={(e) => handleUpdateTransaction(idx, e.target.value)}
                  className="flex-1 bg-transparent px-2 py-2 text-xs font-mono font-medium text-slate-200 outline-none focus:outline-none placeholder:text-slate-600"
                  placeholder={`Transaction ${String.fromCharCode(65 + idx)}`}
                />
                {transactions.length > 1 && (
                  <button
                    onClick={() => handleRemoveTransaction(idx)}
                    title={isVi ? "Xóa giao dịch" : "Remove transaction"}
                    className="w-7 h-7 rounded-lg mr-1 border border-rose-900/40 bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleAddTransaction}
            disabled={transactions.length >= 8}
            className="w-full py-2.5 rounded-2xl border border-dashed border-purple-500/40 hover:border-purple-400/80 bg-purple-950/10 hover:bg-purple-950/30 text-purple-300 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>+ {isVi ? 'Thêm Giao dịch' : 'Add Transaction'}</span>
          </button>

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-2 border-t border-slate-800">
            <span>{transactions.length} {isVi ? 'giao dịch' : 'transactions'}</span>
            <span>{isVi ? 'Tối đa 8' : 'Max 8'}</span>
          </div>

          {/* Quick Presets */}
          <div className="pt-1 flex items-center justify-between gap-2 text-[11px] font-mono">
            <span className="text-slate-500">{isVi ? 'Mẫu nhanh:' : 'Presets:'}</span>
            <div className="flex items-center gap-1.5">
              {[2, 4, 8].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    const sample = Array.from({ length: count }, (_, i) => `Transaction ${String.fromCharCode(65 + i)}`);
                    setTransactions(sample);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-all ${
                    transactions.length === count 
                      ? 'border-purple-500 bg-purple-950/60 text-purple-300 font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {count} Txs
                </button>
              ))}
            </div>
          </div>
        </SpotlightCard>

        {/* Right Column: Merkle Tree Visualization Canvas (Matching Image 1) */}
        <SpotlightCard 
          spotlightColor="rgba(168, 85, 247, 0.16)"
          className="lg:col-span-8 glass-card p-6 space-y-4 relative overflow-hidden shadow-2xl bg-[#070913] border-slate-800"
        >
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                {isVi ? 'Trực quan hóa Cây Merkle' : 'Merkle Tree Visualization'}
              </h3>
              <p className="text-xs text-slate-400">
                {isVi ? 'Nhấp vào nút để kiểm tra chi tiết · Dùng +/- để thu phóng' : 'Click any node to inspect · Use +/- buttons to zoom'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* SYNCED badge (Matching Image 1) */}
              <div className="px-3.5 py-1 rounded-full bg-purple-950/70 border border-purple-800/60 text-[11px] font-mono font-bold text-purple-300 flex items-center gap-2 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span>SYNCED</span>
              </div>
            </div>
          </div>

          {/* Canvas Controls Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 font-semibold shadow-inner">
              {Math.round(zoomLevel * 100)}%
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, Math.round((z + 0.1) * 10) / 10))}
                title={isVi ? "Phóng to" : "Zoom in"}
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.6, Math.round((z - 0.1) * 10) / 10))}
                title={isVi ? "Thu nhỏ" : "Zoom out"}
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                title={isVi ? "Đặt lại" : "Reset zoom"}
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-colors shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Tree Viewport with Blueprint Dot Grid Background */}
          <div 
            className="w-full overflow-x-auto rounded-2xl border border-slate-800/80 relative custom-scrollbar select-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
              backgroundColor: '#070913',
            }}
          >
            {/* Ambient Nebula Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-56 bg-purple-600/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[480px] h-56 bg-cyan-600/10 blur-3xl pointer-events-none" />

            {/* Transformable Canvas Container with Centering */}
            <div className="flex justify-center min-w-full">
              <div 
                className="relative transition-transform duration-200 origin-top py-8"
                style={{
                  width: `${canvasWidth}px`,
                  height: `${canvasHeight}px`,
                  transform: `scale(${zoomLevel})`,
                }}
              >
                
                {/* Level Markers on the background (Matching Image 1) */}
                {Array.from({ length: totalTreeLevels }).map((_, idx) => {
                  const visualRow = idx;
                  const layerIdx = totalTreeLevels - 1 - idx;
                  const y = topPadding + visualRow * rowHeight;
                  let levelName = '';
                  if (layerIdx === totalTreeLevels - 1) levelName = '- MERKLE ROOT -';
                  else if (layerIdx === 0) levelName = 'LEAF NODES';
                  else levelName = `LEVEL ${layerIdx}`;

                  return (
                    <div 
                      key={idx}
                      className="absolute left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-slate-500/80 select-none uppercase font-bold pointer-events-none"
                      style={{ top: `${y - 44}px` }}
                    >
                      {levelName}
                    </div>
                  );
                })}

                {/* SVG Connecting Lines Layer (Matching Image 1) */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
                >
                  <defs>
                    <filter id="glow-line" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="purple-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.75" />
                    </linearGradient>
                    <linearGradient id="highlight-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="1" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1" />
                    </linearGradient>
                  </defs>

                  {connections.map((conn) => {
                    const highlighted = isLineHighlighted(conn);

                    return (
                      <g key={conn.id}>
                        {/* Stem from parent to plus */}
                        <path
                          d={conn.pathStem}
                          stroke={highlighted ? '#c084fc' : '#818cf8'}
                          strokeWidth={highlighted ? "2.5" : "2"}
                          strokeDasharray="4 4"
                          className={highlighted ? "opacity-100 drop-shadow-[0_0_8px_#c084fc]" : "opacity-75"}
                        />
                        {/* Curve to left child */}
                        <path
                          d={conn.pathLeft}
                          stroke={highlighted ? 'url(#highlight-line-grad)' : 'url(#purple-line-grad)'}
                          strokeWidth={highlighted ? "2.5" : "2"}
                          strokeDasharray="5 5"
                          fill="none"
                          className={highlighted ? "opacity-100 drop-shadow-[0_0_10px_#a855f7]" : "opacity-80"}
                        />
                        {/* Curve to right child */}
                        <path
                          d={conn.pathRight}
                          stroke={highlighted ? 'url(#highlight-line-grad)' : 'url(#purple-line-grad)'}
                          strokeWidth={highlighted ? "2.5" : "2"}
                          strokeDasharray="5 5"
                          fill="none"
                          className={highlighted ? "opacity-100 drop-shadow-[0_0_10px_#a855f7]" : "opacity-80"}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Intermediate Combining (+) Operator Badges (Matching Image 1) */}
                {connections.map((conn) => {
                  const highlighted = isLineHighlighted(conn);

                  return (
                    <div
                      key={`plus-${conn.id}`}
                      className="absolute z-10 transition-transform duration-200"
                      style={{ 
                        left: `${conn.plusPos.x}px`, 
                        top: `${conn.plusPos.y}px`,
                        transform: highlighted ? 'translate(-50%, -50%) scale(1.15)' : 'translate(-50%, -50%) scale(1)'
                      }}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs transition-all ${
                        highlighted
                          ? 'border-purple-300 bg-[#25103f] text-white shadow-[0_0_16px_rgba(168,85,247,0.8)]'
                          : 'border-purple-400/80 bg-[#160c2b] text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                      }`}>
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}

                {/* Nodes Layer with Perfect Absolute Centering */}
                {treeLayers.map((layer) =>
                  layer.map((node) => {
                    const pos = nodeCoordinates.get(node.id);
                    if (!pos) return null;

                    const isRoot = node.type === 'root';
                    const isLeaf = node.type === 'leaf';
                    const isInternal = node.type === 'internal';
                    const isSelected = selectedNode?.id === node.id;
                    const isHovered = hoveredNodeId === node.id;

                    return (
                      <div
                        key={node.id}
                        className="absolute cursor-pointer z-20"
                        style={{ 
                          left: `${pos.x}px`, 
                          top: `${pos.y}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        onClick={() => setSelectedNode(node)}
                      >
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.25 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {/* Root Node Style (Matching Image 1) */}
                          {isRoot && (
                            <div className={`px-6 py-3.5 rounded-2xl border-2 transition-all min-w-[200px] text-center backdrop-blur-md ${
                              isSelected || isHovered
                                ? 'border-purple-400 bg-[#170e33]/95 shadow-[0_0_45px_rgba(168,85,247,0.65)] ring-2 ring-purple-400/50'
                                : 'border-purple-500/80 bg-[#0e0c22]/95 shadow-[0_0_30px_rgba(168,85,247,0.35)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]'
                            }`}>
                              <div className="text-[9px] font-mono tracking-widest text-purple-400 font-bold uppercase mb-1 flex items-center justify-center gap-1">
                                <Crown className="w-3 h-3 text-purple-400" />
                                <span>{isVi ? 'GỐC MERKLE' : 'MERKLE ROOT'}</span>
                              </div>
                              <div className="font-mono text-xs font-bold text-white tracking-wide">
                                {formatHashShort(node.hash)}
                              </div>
                            </div>
                          )}

                          {/* Internal Node Style (Matching Image 1) */}
                          {isInternal && (
                            <div className={`px-5 py-3 rounded-2xl border-2 transition-all min-w-[150px] text-center backdrop-blur-md ${
                              isSelected || isHovered
                                ? 'border-blue-400 bg-[#0e1d3d]/95 shadow-[0_0_35px_rgba(59,130,246,0.6)] ring-2 ring-blue-400/50'
                                : 'border-blue-500/70 bg-[#081226]/95 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]'
                            }`}>
                              <div className="font-mono text-xs font-bold text-slate-100">
                                {formatHashShort(node.hash)}
                              </div>
                              <div className="text-[9px] font-mono text-blue-400 font-semibold mt-1">
                                SHA-256(L+R)
                              </div>
                            </div>
                          )}

                          {/* Leaf Node Style (Matching Image 1) */}
                          {isLeaf && (
                            <div className={`px-4 py-3 rounded-2xl border-2 transition-all min-w-[130px] text-center backdrop-blur-md ${
                              isSelected || isHovered
                                ? 'border-cyan-400 bg-[#0b2736]/95 shadow-[0_0_35px_rgba(6,182,212,0.6)] ring-2 ring-cyan-400/50'
                                : 'border-cyan-500/70 bg-[#061a24]/95 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.45)]'
                            }`}>
                              <div className="font-mono text-xs font-bold text-cyan-200">
                                {formatHashShort(node.hash)}
                              </div>
                              {node.rawTx && (
                                <div className="text-[9px] font-mono text-slate-400 truncate max-w-[110px] mx-auto mt-1">
                                  {node.rawTx}
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </div>
                    );
                  })
                )}

              </div>
            </div>

          </div>

        </SpotlightCard>

      </div>

      {/* Node Detail Inspection Modal (Compact & Elegant) */}
      <AnimatePresence>
        {selectedNode && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] max-h-[85vh] overflow-y-auto no-scrollbar rounded-2xl bg-[#090d16] border border-blue-500/40 p-4 sm:p-5 space-y-3.5 shadow-[0_0_50px_rgba(99,102,241,0.3)] relative text-left"
            >
              {/* Header with Type Badge & Close Button */}
              <div className="flex items-center justify-between">
                {selectedNode.type === 'root' && (
                  <div className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/60 text-purple-300 font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    <span>MERKLE ROOT</span>
                  </div>
                )}
                {selectedNode.type === 'internal' && (
                  <div className="px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/60 text-blue-300 font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span>INTERNAL NODE</span>
                  </div>
                )}
                {selectedNode.type === 'leaf' && (
                  <div className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{selectedNode.isDuplicated ? 'DUPLICATED LEAF' : 'LEAF NODE'}</span>
                  </div>
                )}

                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* SHA-256 Hash Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="font-bold tracking-wider uppercase text-[10px]">SHA-256 HASH</span>
                  <button
                    onClick={() => copyToClipboard(selectedNode.hash)}
                    className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? (isVi ? 'Đã sao chép' : 'Copied!') : (isVi ? 'Sao chép' : 'Copy')}</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-[#060912] border border-slate-800 font-mono text-[11px] text-slate-200 break-all leading-relaxed select-all">
                  {selectedNode.hash}
                </div>
              </div>

              {/* Hash Combining Process Section */}
              {selectedNode.leftChild && (
                <div className="space-y-2.5 pt-0.5">
                  <div className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isVi ? 'QUY TRÌNH KẾT HỢP HASH' : 'HASH COMBINING PROCESS'}</span>
                  </div>

                  {/* Left & Right Child Preview Boxes */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-xl bg-[#081222] border border-blue-900/60 space-y-0.5">
                      <div className="text-[9px] font-mono font-bold text-blue-400 uppercase">LEFT</div>
                      <div className="font-mono text-[11px] text-slate-200 truncate font-semibold">
                        {formatHashShort(selectedNode.leftChild.hash)}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#081a24] border border-cyan-900/60 space-y-0.5">
                      <div className="text-[9px] font-mono font-bold text-cyan-400 uppercase">RIGHT</div>
                      <div className="font-mono text-[11px] text-slate-200 truncate font-semibold">
                        {formatHashShort(selectedNode.rightChild?.hash || selectedNode.leftChild.hash)}
                      </div>
                    </div>
                  </div>

                  {/* Concatenate Indicator */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="px-3 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/50 text-purple-300 font-mono text-[10px] font-bold flex items-center gap-1">
                      <Plus className="w-2.5 h-2.5" />
                      <span>CONCATENATE</span>
                    </div>
                    <ArrowDown className="w-3.5 h-3.5 text-purple-400" />
                  </div>

                  {/* SHA-256 Box */}
                  <div className="p-2 rounded-xl bg-[#140e28] border border-purple-500/40 text-center space-y-0.5">
                    <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-purple-300">
                      <Lock className="w-3 h-3" />
                      <span>SHA-256</span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 truncate px-1">
                      SHA-256({selectedNode.leftChild.hash.slice(0, 10)}... + { (selectedNode.rightChild?.hash || selectedNode.leftChild.hash).slice(0, 10) }...)
                    </div>
                  </div>

                  {/* Arrow down */}
                  <div className="flex justify-center">
                    <ArrowDown className="w-3.5 h-3.5 text-purple-400" />
                  </div>

                  {/* Result Box */}
                  <div className="p-2 rounded-xl bg-[#081224] border border-blue-500/40 text-center space-y-0.5">
                    <div className="text-[9px] font-mono font-bold text-blue-400 uppercase">RESULT</div>
                    <div className="font-mono text-[11px] font-bold text-blue-200 truncate">
                      {selectedNode.hash.slice(0, 22)}...
                    </div>
                  </div>
                </div>
              )}

              {/* For Leaf Nodes: Payload Hashing */}
              {selectedNode.type === 'leaf' && (
                <div className="space-y-2.5 pt-0.5">
                  <div className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isVi ? 'QUY TRÌNH BĂM GIAO DỊCH GỐC' : 'LEAF TRANSACTION HASHING'}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#081a24] border border-cyan-800/60 space-y-0.5">
                    <div className="text-[9px] font-mono font-bold text-cyan-400 uppercase">
                      {isVi ? 'DỮ LIỆU GIAO DỊCH GỐC' : 'RAW TRANSACTION DATA'}
                    </div>
                    <div className="font-mono text-[11px] text-slate-200 font-bold">
                      &quot;{selectedNode.rawTx}&quot;
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                  </div>

                  <div className="p-2 rounded-xl bg-[#140e28] border border-purple-500/40 text-center space-y-0.5">
                    <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-purple-300">
                      <Lock className="w-3 h-3" />
                      <span>SHA-256</span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-400">
                      SHA-256(&quot;{selectedNode.rawTx}&quot;)
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                  </div>

                  <div className="p-2 rounded-xl bg-[#081a24] border border-cyan-500/40 text-center space-y-0.5">
                    <div className="text-[9px] font-mono font-bold text-cyan-400 uppercase">LEAF HASH</div>
                    <div className="font-mono text-[11px] font-bold text-cyan-200 truncate">
                      {selectedNode.hash.slice(0, 22)}...
                    </div>
                  </div>
                </div>
              )}

              {/* How it's computed Callout Box */}
              <div className="p-3 rounded-xl bg-[#091122] border border-blue-900/60 space-y-1">
                <div className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  <Info className="w-3 h-3 text-blue-400" />
                  <span>{isVi ? 'CÁCH TÍNH TOÁN NÚT NÀY' : "HOW IT'S COMPUTED"}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedNode.type === 'leaf' && (
                    isVi 
                      ? "Nút lá này được tính bằng cách băm trực tiếp dữ liệu giao dịch bằng SHA-256. Mọi thay đổi 1 ký tự sẽ thay đổi toàn bộ mã băm."
                      : "This leaf node is computed as: SHA-256(Raw Transaction). Any modification to the transaction payload will alter the entire hash."
                  )}
                  {selectedNode.type === 'internal' && (
                    isVi
                      ? "Nút nội bộ này được tính toán dưới dạng: SHA-256(leftNode + rightNode), giúp kiểm chứng Merkle Proof dễ dàng mà không lộ dữ liệu."
                      : "This internal node is computed as: SHA-256(leftChild + rightChild). It allows verification of sub-trees without exposing all data."
                  )}
                  {selectedNode.type === 'root' && (
                    isVi
                      ? "Gốc Merkle đại diện tóm tắt mật mã của toàn bộ khối, được lưu trữ trong Block Header để phục vụ xác thực SPV."
                      : "The Merkle Root is the single cryptographic summary of all transactions in the block, stored in the Block Header."
                  )}
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
