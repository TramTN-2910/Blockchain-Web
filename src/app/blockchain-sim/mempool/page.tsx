'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  Flame, 
  ArrowUpDown, 
  Trash2, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  Coins 
} from 'lucide-react';
import Link from 'next/link';

export default function BlockchainSimMempoolPage() {
  const { language } = useLanguageStore();
  const { 
    mempool, 
    clearMempool, 
    createDraftTransaction, 
    signDraftTransaction, 
    broadcastToMempool, 
    wallets 
  } = useBlockchainLifecycleStore();

  const [sortBy, setSortBy] = useState<'gas' | 'time'>('gas');
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  const sortedMempool = [...mempool].sort((a, b) => {
    if (sortBy === 'gas') return b.gasFee - a.gasFee;
    return a.timestamp - b.timestamp;
  });

  const handleCreateDummyTx = () => {
    if (wallets.length < 2) return;
    const randomSender = wallets[Math.floor(Math.random() * wallets.length)];
    const receiverPool = wallets.filter((w) => w.id !== randomSender.id);
    const randomReceiver = receiverPool[0] || wallets[0];
    const randomAmount = Math.floor(Math.random() * 25) + 5;
    const randomGas = Math.floor(Math.random() * 20) + 2;

    const tx = createDraftTransaction({
      from: randomSender.address,
      to: randomReceiver.address,
      amount: randomAmount,
      gasFee: randomGas,
      data: `Auto Tx #${mempool.length + 1}`
    });
    signDraftTransaction(tx.id);
    broadcastToMempool(tx.id);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTxId(text);
    setTimeout(() => setCopiedTxId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900 border border-amber-800/40">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[11px] font-extrabold text-amber-300 whitespace-nowrap tracking-wider shrink-0">
              SIM 2
            </span>
            <span>{language === 'vi' ? 'Mô Phỏng Blockchain • Hàng Đợi Mempool' : 'Blockchain Sim • Mempool Queue'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Hàng Đợi Giao Dịch & Ưu Tiên Phí Gas' : 'Mempool Queue & Gas Fee Prioritization'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Quan sát cách Validator sắp xếp các giao dịch chờ xử lý theo phí Gas cao nhất hoặc thời gian.'
              : 'Observe how validators order pending transactions by highest gas fees or arrival timestamps.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/blockchain-sim/merkle-tree"
            prefetch={true}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>{language === 'vi' ? 'Sang Cây Merkle' : 'Next: Merkle Tree'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-semibold">
            {language === 'vi' ? 'Sắp xếp theo:' : 'Sort By:'}
          </span>
          <button
            onClick={() => setSortBy(sortBy === 'gas' ? 'time' : 'gas')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-amber-400 hover:bg-slate-800 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>
              {sortBy === 'gas'
                ? (language === 'vi' ? 'Phí Gas Cao Nhất' : 'Highest Gas Fee')
                : (language === 'vi' ? 'Thời Gian (FIFO)' : 'Timestamp (FIFO)')}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCreateDummyTx}
            className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
          >
            + {language === 'vi' ? 'Thêm Tx Mẫu' : 'Add Sample Tx'}
          </button>
          {mempool.length > 0 && (
            <button
              onClick={clearMempool}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
              title={language === 'vi' ? 'Dọn sạch Mempool' : 'Clear Mempool'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mempool Cards List */}
      <div className="space-y-3">
        {sortedMempool.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <Flame className="w-10 h-10 mx-auto text-slate-600" />
            <div className="text-sm font-bold text-slate-400">
              {language === 'vi' ? 'Mempool hiện đang trống!' : 'Mempool is currently empty!'}
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === 'vi'
                ? 'Hãy soạn giao dịch mới hoặc bấm "+ Thêm Tx Mẫu" để đẩy giao dịch vào hàng đợi.'
                : 'Create a draft transaction or click "+ Add Sample Tx" to populate the mempool.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedMempool.map((tx, idx) => (
              <div
                key={tx.id || idx}
                className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                    Queue #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>{tx.gasFee} Gwei</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{language === 'vi' ? 'Số tiền:' : 'Amount:'}</span>
                    <span className="font-bold text-emerald-400 font-mono">+{tx.amount} HUB</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>From:</span>
                    <span className="font-mono text-slate-300 text-[11px]">{tx.from.slice(0, 10)}...</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>To:</span>
                    <span className="font-mono text-slate-300 text-[11px]">{tx.to.slice(0, 10)}...</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                  <button
                    onClick={() => handleCopy(tx.id)}
                    className="hover:text-slate-300 flex items-center gap-1"
                  >
                    {copiedTxId === tx.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>TxID: {tx.id.slice(0, 8)}...</span>
                  </button>
                  <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
