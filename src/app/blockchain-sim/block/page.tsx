'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { computeBlockHash, computeMerkleTree } from '@/lib/crypto/lifecycleCrypto';
import { Box, Sparkles, Cpu, Coins, ArrowRight, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function BlockchainSimBlockPage() {
  const { language } = useLanguageStore();
  const { blockchain, mempool, createBlockFromMempool, wallets } = useBlockchainLifecycleStore();

  const lastBlock = blockchain[blockchain.length - 1];

  const [version, setVersion] = useState('1.0.0');
  const [nonce, setNonce] = useState(10482);
  const [difficulty, setDifficulty] = useState(2);
  const [copiedHash, setCopiedHash] = useState(false);

  const includedTxs = mempool.length > 0 ? mempool.slice(0, 4) : [];
  const merkleData = computeMerkleTree(includedTxs.map((t) => ({ id: t.id, from: t.from, to: t.to, amount: t.amount })));

  const liveHeader = {
    version,
    index: blockchain.length,
    previousHash: lastBlock ? lastBlock.hash : '0000000000000000000000000000000000000000000000000000000000000000',
    merkleRoot: merkleData.root,
    timestamp: Date.now(),
    difficulty,
    nonce
  };

  const liveBlockHash = computeBlockHash(liveHeader);

  const handleAssemble = () => {
    createBlockFromMempool(includedTxs.map((t) => t.id));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-900 border border-indigo-800/40">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-[11px] font-extrabold text-indigo-300 whitespace-nowrap tracking-wider shrink-0">
              SIM 6
            </span>
            <span>{language === 'vi' ? 'Mô Phỏng Blockchain • Đóng Gói Khối' : 'Blockchain Sim • Block Assembly'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Lắp Ráp Tiêu Đề & Thân Khối (Block Assembly)' : 'Block Header & Body Assembly'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Lắp ghép Header và Body, chèn giao dịch Coinbase và băm mã khối Double SHA-256.'
              : 'Combine Header and Body payloads, insert Coinbase reward, and compute Double SHA-256.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/blockchain-sim/blockchain"
            prefetch={true}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>{language === 'vi' ? 'Sang Khám Phá Chuỗi' : 'Next: Chain Explorer'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              {language === 'vi' ? 'Thông Số Header' : 'Header Parameters'}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Block Index:</label>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-cyan-400">
                  Block #{blockchain.length}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400">Previous Hash:</label>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-purple-300 truncate">
                  {liveHeader.previousHash}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400">Merkle Root:</label>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 truncate">
                  {liveHeader.merkleRoot}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Nonce:</label>
                  <input
                    type="number"
                    value={nonce}
                    onChange={(e) => setNonce(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Difficulty:</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={difficulty}
                    onChange={(e) => setDifficulty(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono font-bold"
                  />
                </div>
              </div>

              <button
                onClick={handleAssemble}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Đóng Gói & Thêm Vào Chuỗi' : 'Pack & Commit Block'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  COMPUTED BLOCK HASH (Double SHA-256)
                </span>
                <button onClick={() => handleCopy(liveBlockHash)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHash ? (language === 'vi' ? 'Đã chép' : 'Copied') : (language === 'vi' ? 'Sao chép' : 'Copy')}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-indigo-900 font-mono text-xs text-indigo-300 break-all font-bold">
                {liveBlockHash}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                {language === 'vi' ? 'Thân Khối (Body)' : 'Block Body'}
              </h3>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-900/50 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-amber-400">
                    💰 {language === 'vi' ? 'Coinbase Tx (Thưởng đúc khối)' : 'Coinbase Tx (Mining Reward)'}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {language === 'vi' ? 'Người nhận:' : 'Recipient:'} {wallets[0]?.name || 'Validator'}
                  </div>
                </div>
                <div className="text-xs font-bold font-mono text-emerald-400">+2 HUB</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-slate-400">
                  {language === 'vi' ? 'Giao dịch từ Mempool' : 'Transactions from Mempool'} ({includedTxs.length}):
                </div>
                {includedTxs.length > 0 ? (
                  includedTxs.map((tx, idx) => (
                    <div key={tx.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
                      <div className="truncate text-slate-300">#{idx + 1}: {tx.from.slice(0, 8)}... ➔ {tx.to.slice(0, 8)}...</div>
                      <div className="text-emerald-400 font-bold">{tx.amount} HUB</div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-500 italic text-center">
                    {language === 'vi' ? 'Mempool trống. Khối sẽ chỉ gồm Coinbase Tx.' : 'Mempool empty. Block will only include Coinbase Tx.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
