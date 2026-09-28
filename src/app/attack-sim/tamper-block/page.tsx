'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { computeMerkleTree, computeBlockHash } from '@/lib/crypto/lifecycleCrypto';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Boxes, 
  RefreshCw, 
  ArrowRight, 
  Flame, 
  GitCommit, 
  Layers,
  Cpu
} from 'lucide-react';
import Link from 'next/link';

export default function TamperBlockPage() {
  const { language } = useLanguageStore();
  const { blockchain, tamperBlockData, resetAllLifecycleData } = useBlockchainLifecycleStore();

  const [selectedBlockIndex, setSelectedBlockIndex] = useState(1);
  const [tamperedAmount, setTamperedAmount] = useState(500);

  const targetBlock = blockchain[selectedBlockIndex] || blockchain[0];
  const hasTxs = targetBlock?.transactions && targetBlock.transactions.length > 0;

  const handleTamper = () => {
    if (!hasTxs) return;
    tamperBlockData(selectedBlockIndex, 0, Number(tamperedAmount));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-rose-950/40 to-slate-900 border border-red-800/40">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-[11px] font-extrabold text-rose-300 whitespace-nowrap tracking-wider shrink-0">
              ATK 2
            </span>
            <span>
              {language === 'vi' ? 'Mô Phỏng Tấn Công • Giả Mạo Thân Khối' : 'Attack Sim • Tamper Block Data'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Can Thiệp Sửa Dữ Liệu Trong Khối Đã Đóng (Tamper Block)' : 'Tamper Historical Block Data'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Chỉnh sửa số dư hoặc giao dịch trong quá khứ và quan sát sự thay đổi tức thì của Merkle Root và Block Hash.'
              : 'Modify transaction amounts in confirmed blocks and witness the instant Merkle Root & Hash invalidation.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetAllLifecycleData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'vi' ? 'Khôi Phục Chuỗi Gốc' : 'Reset Chain'}
          </button>
          <Link
            href="/attack-sim/check-hash"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'So Sánh Hash' : 'Check Hash'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Block Selector */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Boxes className="w-4 h-4 text-blue-400" />
          {language === 'vi' ? 'Chọn Khối Cần Tấn Công Can Thiệp' : 'Select Target Block to Tamper'}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {blockchain.map((block) => (
            <button
              key={block.index}
              onClick={() => setSelectedBlockIndex(block.index)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedBlockIndex === block.index
                  ? 'border-rose-500 bg-rose-950/40 text-rose-200 shadow-lg shadow-rose-950/30'
                  : block.isValid
                  ? 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                  : 'border-rose-800/80 bg-rose-950/20 text-rose-400'
              }`}
            >
              <div className="text-xs font-black">
                {block.index === 0 ? 'Genesis #0' : `Block #${block.index}`}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {block.transactions.length} Tx(s)
              </div>
              <div className={`text-[10px] font-bold mt-1 ${block.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                {block.isValid ? 'Valid' : 'Tampered'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tampering Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Tamper Editor */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              {language === 'vi' ? `Can Thiệp Khối #${targetBlock?.index}` : `Tamper Block #${targetBlock?.index}`}
            </h3>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              Payload Injection
            </span>
          </div>

          {!hasTxs ? (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
              {language === 'vi'
                ? 'Khối Genesis không có giao dịch thường để sửa. Hãy chọn Khối #1 hoặc đóng khối mới!'
                : 'Genesis block has no user txs. Please select Block #1 or mine a new block!'}
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-slate-400 font-semibold">
                  {language === 'vi' ? 'Giao dịch mục tiêu (Tx #1 trong Block):' : 'Target Transaction (Tx #1 in Block):'}
                </div>
                <div className="font-mono text-slate-300 text-[11px] break-all">
                  From: {targetBlock.transactions[0].from}
                </div>
                <div className="font-mono text-slate-300 text-[11px] break-all">
                  To: {targetBlock.transactions[0].to}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <span className="text-slate-400 font-semibold">Số tiền hiện tại:</span>
                  <span className="font-bold text-amber-400 text-sm">{targetBlock.transactions[0].amount} COIN</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-2 font-semibold">
                  {language === 'vi' ? 'Số tiền giả mạo mới (Altered Amount):' : 'Altered Amount:'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={tamperedAmount}
                    onChange={(e) => setTamperedAmount(Number(e.target.value))}
                    className="flex-1 bg-slate-950 border border-rose-500/50 rounded-xl px-4 py-2.5 font-mono text-rose-300 text-sm focus:outline-none focus:border-rose-400"
                  />
                  <button
                    onClick={handleTamper}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
                  >
                    <Flame className="w-4 h-4" />
                    {language === 'vi' ? 'Ghi Đè Can Thiệp' : 'Inject Tamper'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Impact Analysis */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            {language === 'vi' ? 'Hậu Quả Can Thiệp Khối (Avalanche Impact)' : 'Avalanche Tamper Impact'}
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'vi' ? 'Cây Merkle (Merkle Root Mới)' : 'New Merkle Root'}
              </div>
              <div className="font-mono text-[11px] text-cyan-300 break-all">
                {targetBlock?.header?.merkleRoot}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                {language === 'vi' ? 'Block Hash Mới (Không còn bắt đầu bằng 00...)' : 'New Block Hash (Difficulty broken)'}
              </div>
              <div className={`font-mono text-[11px] break-all ${
                targetBlock?.isValid ? 'text-blue-300' : 'text-rose-400 font-bold'
              }`}>
                {targetBlock?.hash}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${
              targetBlock?.isValid
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/50 border-rose-500/50 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                {targetBlock?.isValid
                  ? (language === 'vi' ? 'Khối Nguyên Bản Chưa Bị Sửa' : 'Intact Block')
                  : (language === 'vi' ? 'Khối Đã Bị Vỡ Liên Kết (Invalidated Block)!' : 'Block Hash & Linkage Destroyed!')}
              </div>
              <p className="text-xs text-slate-400">
                {language === 'vi'
                  ? 'Khi 1 byte trong khối bị sửa, Merkle Root thay đổi hoàn toàn, làm thay đổi Block Hash. Khối tiếp theo sẽ trỏ vào một Previous Hash không tồn tại!'
                  : 'Modifying 1 byte changes the Merkle Root, changing the Block Hash. The next block will point to a non-existent Previous Hash!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
