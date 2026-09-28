'use client';

import React, { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { computeMerkleTree } from '@/lib/crypto/lifecycleCrypto';
import { 
  GitFork, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Layers, 
  AlertTriangle 
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BlockchainSimMerkleTreePage() {
  const { language } = useLanguageStore();

  const [leafTxs, setLeafTxs] = useState([
    { id: 'tx_1', from: 'Alice', to: 'Bob', amount: 10 },
    { id: 'tx_2', from: 'Bob', to: 'Charlie', amount: 5 },
    { id: 'tx_3', from: 'Charlie', to: 'David', amount: 15 },
    { id: 'tx_4', from: 'David', to: 'Eva', amount: 20 }
  ]);

  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newAmount, setNewAmount] = useState<number>(10);
  const [tamperedIndex, setTamperedIndex] = useState<number | null>(null);
  const [copiedRoot, setCopiedRoot] = useState(false);

  const merkleResult = computeMerkleTree(leafTxs);

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrom || !newTo) return;
    setLeafTxs([
      ...leafTxs,
      { id: `tx_${Date.now()}`, from: newFrom, to: newTo, amount: newAmount }
    ]);
    setNewFrom('');
    setNewTo('');
  };

  const handleRemoveTx = (index: number) => {
    setLeafTxs(leafTxs.filter((_, i) => i !== index));
  };

  const handleTamper = (index: number) => {
    setLeafTxs(
      leafTxs.map((tx, i) => (i === index ? { ...tx, amount: tx.amount + 100 } : tx))
    );
    setTamperedIndex(index);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRoot(true);
    setTimeout(() => setCopiedRoot(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900 border border-emerald-800/40">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[11px] font-extrabold text-emerald-300 whitespace-nowrap tracking-wider shrink-0">
              SIM 3
            </span>
            <span>{language === 'vi' ? 'Mô Phỏng Blockchain • Cây Merkle' : 'Blockchain Sim • Merkle Tree'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Gom Cụm Giao Dịch & Cây Nhị Phân Merkle Root' : 'Binary Merkle Tree & Root Aggregation'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Gom cặp băm nhị phân từ lá lên đỉnh, tự động xử lý số lẻ và kiểm chứng sự lan truyền thay đổi.'
              : 'Pairwise binary hashing from leaf to root with odd-leaf duplication and cascade diff tracking.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/blockchain-sim/previous-hash"
            prefetch={true}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>{language === 'vi' ? 'Sang Previous Hash' : 'Next: Previous Hash'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              {language === 'vi' ? 'Thêm Giao Dịch Lá' : 'Add Leaf Transaction'}
            </h2>

            <form onSubmit={handleAddTx} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="From"
                  value={newFrom}
                  onChange={(e) => setNewFrom(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="To"
                  value={newTo}
                  onChange={(e) => setNewTo(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <input
                type="number"
                min="1"
                placeholder={language === 'vi' ? 'Số lượng' : 'Amount'}
                value={newAmount}
                onChange={(e) => setNewAmount(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                + {language === 'vi' ? 'Thêm Vào Cây' : 'Add to Merkle Tree'}
              </button>
            </form>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {language === 'vi' ? 'Giao Dịch Lá' : 'Leaf Transactions'} ({leafTxs.length})
              </h3>
              {leafTxs.length % 2 !== 0 && (
                <span className="text-[10px] text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded">
                  {language === 'vi' ? 'Số lẻ ➔ Nhân đôi lá cuối' : 'Odd count ➔ Duplicate last'}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {leafTxs.map((tx, idx) => (
                <div
                  key={tx.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    tamperedIndex === idx ? 'bg-rose-950/30 border-rose-800' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">Tx#{idx + 1}: {tx.from} ➔ {tx.to}</div>
                    <div className="text-xs font-mono text-emerald-400 font-bold">{tx.amount} HUB</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleTamper(idx)}
                      className="px-2 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 text-[10px] font-bold border border-amber-700 transition-colors"
                    >
                      {language === 'vi' ? 'Sửa (+100)' : 'Tamper (+100)'}
                    </button>
                    {leafTxs.length > 1 && (
                      <button onClick={() => handleRemoveTx(idx)} className="p-1 rounded text-slate-500 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-950 border border-emerald-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  MERKLE ROOT HASH
                </span>
                <button onClick={() => handleCopy(merkleResult.root)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                  {copiedRoot ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRoot ? (language === 'vi' ? 'Đã chép' : 'Copied') : (language === 'vi' ? 'Sao chép' : 'Copy')}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-900 font-mono text-xs text-emerald-300 break-all font-bold">
                {merkleResult.root}
              </div>
            </div>

            <div className="space-y-6 pt-2">
              {merkleResult.levels.slice().reverse().map((level, lvlIdx) => {
                const actualLevelNum = merkleResult.levels.length - 1 - lvlIdx;
                const isRoot = actualLevelNum === merkleResult.levels.length - 1;

                return (
                  <div key={actualLevelNum} className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {isRoot
                        ? (language === 'vi' ? 'Tầng Đỉnh: Merkle Root' : 'Top Level: Merkle Root')
                        : actualLevelNum === 0
                        ? (language === 'vi' ? 'Tầng Lá: Giao Dịch Gốc' : 'Leaves Level: Leaf Transactions')
                        : (language === 'vi' ? `Tầng Trung Gian #${actualLevelNum}` : `Intermediate Level #${actualLevelNum}`)}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {level.map((node) => (
                        <motion.div
                          key={node.id}
                          layout
                          className={`p-3 rounded-2xl border text-center font-mono space-y-1 min-w-[140px] max-w-[220px] ${
                            isRoot ? 'bg-emerald-950 border-emerald-600 shadow-lg' : 'bg-slate-950 border-slate-800'
                          }`}
                        >
                          <div className="text-[10px] font-bold text-slate-400 truncate">{node.label || node.id}</div>
                          <div className="text-[11px] font-bold text-cyan-300 truncate">{node.hash.slice(0, 8)}...{node.hash.slice(-6)}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
