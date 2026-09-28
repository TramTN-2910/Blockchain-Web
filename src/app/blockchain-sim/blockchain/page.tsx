'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { LifecycleBlock } from '@/types/lifecycle';
import { 
  Boxes, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  Hash, 
  Layers, 
  ArrowRight, 
  Eye, 
  PlusCircle, 
  Check, 
  Copy, 
  ShieldCheck,
  Zap,
  FileCode
} from 'lucide-react';
import Link from 'next/link';

export default function BlockchainSimExplorerPage() {
  const { language } = useLanguageStore();
  const { blockchain, mempool, createBlockFromMempool } = useBlockchainLifecycleStore();

  const [selectedBlock, setSelectedBlock] = useState<LifecycleBlock | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const isChainValid = blockchain.every((b) => b.isValid);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-800/40">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[11px] font-extrabold text-blue-300 whitespace-nowrap tracking-wider shrink-0">
              SIM 7
            </span>
            <span>
              {language === 'vi' ? 'Mô Phỏng Blockchain • Sổ Cái Chuỗi Khối' : 'Blockchain Sim • Blockchain Explorer'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Khám Phá Sổ Cái Chuỗi Khối (Blockchain Explorer)' : 'Blockchain Ledger & Block Explorer'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Trực quan hóa cấu trúc liên kết chuỗi khối bất biến, kiểm tra hash liên kết và chi tiết từng giao dịch.'
              : 'Visualize the immutable block chain linkage, inspect linked hashes and transaction details.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => createBlockFromMempool()}
            disabled={mempool.length === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              mempool.length > 0
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            {language === 'vi' ? `Đóng Khối (${mempool.length} txs)` : `Mine Block (${mempool.length} txs)`}
          </button>
          <Link
            href="/attack-sim/tamper-tx"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Thử Giả Mạo' : 'Tamper Sim'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Chain Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{language === 'vi' ? 'Tổng số Khối' : 'Total Blocks'}</div>
            <div className="text-xl font-black text-white">{blockchain.length} Blocks</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isChainValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {isChainValid ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-xs text-slate-400">{language === 'vi' ? 'Tính toàn vẹn Chuỗi' : 'Chain Integrity'}</div>
            <div className={`text-base font-bold ${isChainValid ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isChainValid
                ? (language === 'vi' ? '100% Khớp Hợp Lệ' : '100% Valid Chain')
                : (language === 'vi' ? 'Bị Vi Phạm / Lệch Hash' : 'Broken Chain')}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{language === 'vi' ? 'Đang chờ (Mempool)' : 'Pending (Mempool)'}</div>
            <div className="text-xl font-black text-amber-300">{mempool.length} Txs</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">{language === 'vi' ? 'Tổng Giao dịch Đã Lưu' : 'Confirmed Txs'}</div>
            <div className="text-xl font-black text-purple-300">
              {blockchain.reduce((acc, b) => acc + b.transactions.length, 0)} Txs
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Blockchain Visual Timeline */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-400" />
            {language === 'vi' ? 'Dãy Khối Liên Kết (Block Chain Sequence)' : 'Block Chain Sequence'}
          </h2>
          <span className="text-xs text-slate-400">
            {language === 'vi' ? 'Click vào khối để xem chi tiết bên dưới' : 'Click a block to inspect below'}
          </span>
        </div>

        <div className="overflow-x-auto pb-4 pt-2">
          <div className="flex items-center gap-4 min-w-max">
            {blockchain.map((block, idx) => {
              const isGenesis = block.index === 0;
              const isSelected = selectedBlock?.index === block.index;

              return (
                <React.Fragment key={block.index}>
                  {/* Block Card */}
                  <div
                    onClick={() => setSelectedBlock(block)}
                    className={`cursor-pointer w-72 rounded-2xl p-4 transition-all duration-200 border-2 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/40 shadow-xl shadow-blue-500/20 scale-105'
                        : block.isValid
                        ? 'border-slate-700 bg-slate-950 hover:border-blue-400/60'
                        : 'border-rose-500 bg-rose-950/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isGenesis
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {isGenesis ? 'Genesis #0' : `Block #${block.index}`}
                        </span>
                      </div>
                      <span className={`flex items-center gap-1 text-[11px] font-bold ${
                        block.isValid ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {block.isValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        {block.isValid ? 'Valid' : 'Tampered'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">{language === 'vi' ? 'Mã Băm Khối (Hash)' : 'Block Hash'}</div>
                        <div className="font-mono text-[11px] text-blue-300 truncate bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          {block.hash}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold">{language === 'vi' ? 'Previous Hash' : 'Previous Hash'}</div>
                        <div className="font-mono text-[11px] text-slate-400 truncate bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          {block.header.previousHash}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{block.transactions.length} Tx(s)</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(block.header.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Connector Arrow */}
                  {idx < blockchain.length - 1 && (
                    <div className="flex flex-col items-center justify-center text-slate-600">
                      <div className="h-0.5 w-6 bg-gradient-to-r from-blue-500 to-slate-700" />
                      <ArrowRight className="w-4 h-4 -ml-1 text-blue-400" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Block Details Modal / Panel */}
      {selectedBlock && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-blue-500/40 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {language === 'vi'
                    ? `Chi Tiết Khối #${selectedBlock.index} ${selectedBlock.index === 0 ? '(Genesis Block)' : ''}`
                    : `Block #${selectedBlock.index} Details ${selectedBlock.index === 0 ? '(Genesis Block)' : ''}`}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'vi' ? 'Xem cấu trúc Header, Merkle Root và các giao dịch bên trong khối' : 'Inspect Block Header, Merkle Root, and contained transactions'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedBlock(null)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700"
            >
              {language === 'vi' ? 'Đóng' : 'Close'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Header Metadata */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {language === 'vi' ? 'Tiêu Đề Khối (Block Header)' : 'Block Header'}
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Block Index:</span>
                  <span className="font-mono text-white font-bold">{selectedBlock.index}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Version:</span>
                  <span className="font-mono text-white">{selectedBlock.header.version}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-mono text-white">{new Date(selectedBlock.header.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Difficulty:</span>
                  <span className="font-mono text-amber-400 font-bold">{selectedBlock.header.difficulty}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Nonce:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedBlock.header.nonce}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-900">
                  <span className="text-slate-400">Proposer:</span>
                  <span className="font-mono text-purple-300 font-bold">{selectedBlock.proposer}</span>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Merkle Root:</span>
                    <button
                      onClick={() => handleCopy(selectedBlock.header.merkleRoot, 'merkle')}
                      className="text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {copiedText === 'merkle' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-cyan-300 break-all bg-slate-900 p-2 rounded border border-slate-800">
                    {selectedBlock.header.merkleRoot}
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions In Block */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  {language === 'vi'
                    ? `Danh Sách Giao Dịch (${selectedBlock.transactions.length})`
                    : `Transactions (${selectedBlock.transactions.length})`}
                </h4>
                {selectedBlock.coinbase && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Coinbase +{selectedBlock.coinbase.reward} COIN
                  </span>
                )}
              </div>

              {selectedBlock.transactions.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  {language === 'vi' ? 'Khối Genesis không chứa giao dịch thường' : 'Genesis block has no standard user transactions'}
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedBlock.transactions.map((tx, idx) => (
                    <div key={tx.id || idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-purple-400 font-bold">Tx #{idx + 1}</span>
                        <span className="font-bold text-emerald-400">+{tx.amount} COIN</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>From: <span className="font-mono text-slate-300">{tx.from.slice(0, 10)}...</span></span>
                        <span>To: <span className="font-mono text-slate-300">{tx.to.slice(0, 10)}...</span></span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 truncate">
                        ID: {tx.id}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
