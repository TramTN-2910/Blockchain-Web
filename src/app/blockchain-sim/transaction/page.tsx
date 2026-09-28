'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { verifySignature } from '@/lib/crypto/lifecycleCrypto';
import { 
  FileSignature, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  Zap, 
  ShieldAlert,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlockchainSimTransactionPage() {
  const { language } = useLanguageStore();
  const { 
    wallets, 
    activeWalletId, 
    transactions, 
    createDraftTransaction, 
    signDraftTransaction, 
    tamperDraftTransaction, 
    broadcastToMempool 
  } = useBlockchainLifecycleStore();

  const activeWallet = wallets.find((w) => w.id === activeWalletId) || wallets[0];
  const receiverWallets = wallets.filter((w) => w.id !== activeWallet?.id);

  const [fromAddress, setFromAddress] = useState(activeWallet?.address || '');
  const [toAddress, setToAddress] = useState(receiverWallets[0]?.address || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
  const [amount, setAmount] = useState<number>(20);
  const [gasFee, setGasFee] = useState<number>(2);
  const [memo, setMemo] = useState<string>('Thanh toán dịch vụ HUB');
  const [activeTxId, setActiveTxId] = useState<string | null>(transactions[0]?.id || null);
  const [copiedTxId, setCopiedTxId] = useState<boolean>(false);
  const [broadcastResult, setBroadcastResult] = useState<{ success: boolean; reason?: string } | null>(null);

  const activeTx = transactions.find((t) => t.id === activeTxId) || transactions[0];

  // Kiểm tra tính hợp lệ của chữ ký của activeTx
  const isSigValid = React.useMemo(() => {
    if (!activeTx || !activeTx.signature) return false;
    const sender = wallets.find((w) => w.address.toLowerCase() === activeTx.from.toLowerCase());
    if (!sender) return false;
    return verifySignature(activeTx.id, activeTx.signature, sender.privateKey);
  }, [activeTx, wallets]);

  const isSignatureMismatched = activeTx?.signature && !isSigValid;

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx = createDraftTransaction({
      from: fromAddress || activeWallet?.address || '',
      to: toAddress,
      amount: Number(amount),
      gasFee: Number(gasFee),
      data: memo
    });
    setActiveTxId(newTx.id);
    setBroadcastResult(null);
  };

  const handleSign = () => {
    if (!activeTx) return;
    const success = signDraftTransaction(activeTx.id);
    if (success) {
      setBroadcastResult(null);
    }
  };

  const handleTamper = () => {
    if (!activeTx) return;
    const tampered = tamperDraftTransaction(activeTx.id, activeTx.amount + 500);
    if (tampered) {
      setActiveTxId(tampered.id);
      setBroadcastResult(null);
    }
  };

  const handleBroadcast = () => {
    if (!activeTx) return;
    const result = broadcastToMempool(activeTx.id);
    setBroadcastResult(result);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTxId(true);
    setTimeout(() => setCopiedTxId(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-800/40">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[11px] font-extrabold text-purple-300 whitespace-nowrap tracking-wider shrink-0">
              SIM 1
            </span>
            <span>{language === 'vi' ? 'Mô Phỏng Blockchain • Tạo Giao Dịch' : 'Blockchain Sim • Draft Transaction'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Tạo & Ký Số Giao Dịch Chuyển HUB' : 'Draft & Sign HUB Transactions'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Soạn thảo gói thông điệp giao dịch, thực hiện ký số ECDSA và đẩy vào hàng đợi Mempool.'
              : 'Draft transaction payloads, generate ECDSA signatures, and broadcast to Mempool queue.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/blockchain-sim/mempool"
            prefetch={true}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>{language === 'vi' ? 'Sang Mempool' : 'Next: Mempool'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-5 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-purple-400" />
              {language === 'vi' ? 'Thiết Lập Giao Dịch' : 'Transaction Parameters'}
            </h2>

            <form onSubmit={handleCreateDraft} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {language === 'vi' ? 'Người Gửi (From):' : 'Sender (From):'}
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    {language === 'vi' ? 'Khả dụng:' : 'Available:'} {activeWallet?.balance || 0} HUB
                  </span>
                </div>
                <select
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono focus:border-purple-500"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.address}>
                      {w.name} ({w.balance} HUB) - {w.address.slice(0, 8)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'vi' ? 'Người Nhận (To):' : 'Recipient (To):'}
                </label>
                <select
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-purple-500"
                >
                  {receiverWallets.map((w) => (
                    <option key={w.id} value={w.address}>
                      {w.name} - {w.address}
                    </option>
                  ))}
                  <option value="0x742d35Cc6634C0532925a3b844Bc454e4438f44e">
                    External Address (0x742d...f44e)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {language === 'vi' ? 'Số Lượng (HUB):' : 'Amount (HUB):'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={activeWallet?.balance || 1000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      {language === 'vi' ? 'Phí Gas:' : 'Gas Fee:'}
                    </label>
                    <span className="text-[11px] font-mono text-amber-400 font-bold">{gasFee} Gwei</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={gasFee}
                    onChange={(e) => setGasFee(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'vi' ? 'Dữ Liệu Đính Kèm (Memo):' : 'Data Payload (Memo):'}
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Tạo Bản Thảo Giao Dịch' : 'Generate Transaction Draft'}</span>
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {activeTx ? (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {language === 'vi' ? 'Trạng Thái:' : 'Status:'}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                      activeTx.status === 'signed' && isSigValid
                        ? 'bg-emerald-950 border border-emerald-700 text-emerald-400'
                        : isSignatureMismatched
                        ? 'bg-rose-950 border border-rose-700 text-rose-400 animate-pulse'
                        : activeTx.status === 'pending'
                        ? 'bg-amber-950 border border-amber-700 text-amber-400'
                        : 'bg-slate-800 border border-slate-700 text-slate-300'
                    }`}
                  >
                    {isSignatureMismatched ? 'TAMPERED / MISMATCH' : activeTx.status.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(activeTx.id)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  {copiedTxId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>TxID: {activeTx.id.slice(0, 8)}...</span>
                </button>
              </div>

              {/* JSON Payload Block */}
              <div
                className={`p-4 rounded-2xl border font-mono text-xs space-y-1 overflow-x-auto ${
                  isSignatureMismatched ? 'bg-rose-950/20 border-rose-800/80' : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="text-slate-500">{'// Transaction Object'}</div>
                <div className="text-purple-300">{'{'}</div>
                <div className="pl-4 text-slate-300"><span className="text-cyan-400">"txHash":</span> "{activeTx.id}",</div>
                <div className="pl-4 text-slate-300"><span className="text-cyan-400">"from":</span> "{activeTx.from}",</div>
                <div className="pl-4 text-slate-300"><span className="text-cyan-400">"to":</span> "{activeTx.to}",</div>
                <div className="pl-4 text-slate-300">
                  <span className="text-cyan-400">"amount":</span>{' '}
                  <span className={isSignatureMismatched ? 'text-rose-400 font-bold bg-rose-950 px-1 rounded' : 'text-emerald-400 font-bold'}>
                    {activeTx.amount} HUB
                  </span>,
                </div>
                <div className="pl-4 text-slate-300"><span className="text-cyan-400">"gasFee":</span> <span className="text-amber-400">{activeTx.gasFee} Gwei</span>,</div>
                <div className="pl-4 text-slate-300"><span className="text-cyan-400">"nonce":</span> {activeTx.nonce}</div>
                <div className="text-purple-300">{'}'}</div>
              </div>

              {/* Digital Signature Panel */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isSignatureMismatched
                    ? 'bg-rose-950/30 border-rose-700 shadow-lg shadow-rose-500/10'
                    : isSigValid
                    ? 'bg-emerald-950/20 border-emerald-800/60'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    {isSignatureMismatched ? (
                      <AlertOctagon className="w-4 h-4 text-rose-400 animate-bounce" />
                    ) : isSigValid ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-slate-500" />
                    )}
                    {language === 'vi' ? 'Chữ Ký Số ECDSA' : 'ECDSA Digital Signature'}
                  </span>

                  {isSignatureMismatched ? (
                    <span className="text-[10px] text-rose-300 font-bold px-2 py-0.5 rounded bg-rose-900/80 border border-rose-700">
                      SIGNATURE MISMATCH ❌
                    </span>
                  ) : isSigValid ? (
                    <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-900/50">
                      VALID SIGNATURE ✅
                    </span>
                  ) : null}
                </div>

                {activeTx.signature ? (
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div><span className="text-emerald-400 font-bold">r:</span> {activeTx.signature.r}</div>
                    <div><span className="text-emerald-400 font-bold">s:</span> {activeTx.signature.s}</div>
                    <div><span className="text-emerald-400 font-bold">v:</span> {activeTx.signature.v}</div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    {language === 'vi' ? 'Giao dịch chưa được ký. Bấm "1. Ký Số" để hoàn tất.' : 'Transaction unsigned. Click "1. Sign" to sign.'}
                  </div>
                )}
              </div>

              {/* Action Buttons Cluster */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={handleSign}
                  disabled={isSigValid}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isSigValid
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? '1. Ký Số' : '1. Sign Tx'}</span>
                </button>

                <button
                  onClick={handleTamper}
                  disabled={!activeTx.signature}
                  className="py-2.5 px-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'vi' ? '2. Giả Mạo (+500 HUB)' : '2. Tamper (+500 HUB)'}</span>
                </button>

                <button
                  onClick={handleBroadcast}
                  disabled={!activeTx.signature || activeTx.status === 'pending'}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    !activeTx.signature || activeTx.status === 'pending'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? '3. Đẩy vào Mempool' : '3. Push to Mempool'}</span>
                </button>
              </div>

              {/* Toast Messages */}
              <AnimatePresence>
                {broadcastResult && broadcastResult.success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-700 text-purple-200 text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>{language === 'vi' ? 'Giao dịch hợp lệ đã được đưa vào Mempool!' : 'Valid transaction pushed to Mempool!'}</span>
                    </div>
                    <Link href="/blockchain-sim/mempool" className="font-bold underline text-white">
                      {language === 'vi' ? 'Xem Mempool' : 'View Mempool'}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {broadcastResult && !broadcastResult.success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-2xl bg-rose-950/90 border-2 border-rose-600 text-rose-200 text-xs space-y-1 shadow-2xl"
                  >
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>{language === 'vi' ? '⛔ MẠNG LƯỚI TỪ CHỐI GIAO DỊCH!' : '⛔ NETWORK REJECTED TRANSACTION!'}</span>
                    </div>
                    <p className="text-rose-300 text-xs">
                      {language === 'vi'
                        ? 'Chữ ký số không khớp với mã băm giao dịch mới sau khi bị sửa đổi.'
                        : 'Digital signature mismatch with modified payload hash.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
