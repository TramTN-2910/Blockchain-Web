'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { computeTxHash, verifySignature, signTransaction } from '@/lib/crypto/lifecycleCrypto';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Flame, 
  RefreshCw,
  Cpu,
  Lock,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function TamperTransactionPage() {
  const { language } = useLanguageStore();
  const { transactions, wallets } = useBlockchainLifecycleStore();

  const sampleTx = transactions[0] || {
    id: '0x1234abcd5678ef0123456789abcdef0123456789abcdef0123456789abcdef01',
    from: wallets[0]?.address || '0xAliceWalletAddress789',
    to: wallets[1]?.address || '0xBobWalletAddress123',
    amount: 50,
    gasFee: 2,
    nonce: 1,
    timestamp: Date.now()
  };

  const [fromAddr, setFromAddr] = useState(sampleTx.from);
  const [toAddr, setToAddr] = useState(sampleTx.to);
  const [amount, setAmount] = useState(sampleTx.amount);
  const [gasFee, setGasFee] = useState(sampleTx.gasFee);
  const [isTampered, setIsTampered] = useState(false);

  // Original transaction hash & signature
  const originalHash = computeTxHash({
    from: sampleTx.from,
    to: sampleTx.to,
    amount: sampleTx.amount,
    gasFee: sampleTx.gasFee,
    nonce: sampleTx.nonce,
    timestamp: sampleTx.timestamp
  });

  const senderWallet = wallets.find((w) => w.address.toLowerCase() === fromAddr.toLowerCase()) || wallets[0];
  const originalSignature = sampleTx.signature || signTransaction(originalHash, senderWallet?.privateKey || '0x1111222233334444555566667777888899990000');

  // Current tampered hash
  const currentHash = computeTxHash({
    from: fromAddr,
    to: toAddr,
    amount: Number(amount),
    gasFee: Number(gasFee),
    nonce: sampleTx.nonce,
    timestamp: sampleTx.timestamp
  });

  const isValidSignature = currentHash === originalHash && verifySignature(currentHash, originalSignature, senderWallet?.privateKey || '0x1111222233334444555566667777888899990000');

  const handleTamperAmount = () => {
    setAmount(9999);
    setIsTampered(true);
  };

  const handleTamperRecipient = () => {
    setToAddr('0xHackerMaliciousAddress9999999999999999');
    setIsTampered(true);
  };

  const handleReset = () => {
    setFromAddr(sampleTx.from);
    setToAddr(sampleTx.to);
    setAmount(sampleTx.amount);
    setGasFee(sampleTx.gasFee);
    setIsTampered(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-rose-950/40 to-slate-900 border border-red-800/40">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-[11px] font-extrabold text-rose-300 whitespace-nowrap tracking-wider shrink-0">
              ATK 1
            </span>
            <span>
              {language === 'vi' ? 'Mô Phỏng Tấn Công • Giả Mạo Giao Dịch' : 'Attack Sim • Tamper Transaction'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Giả Mạo Giao Dịch Trong Mempool (Tamper TX)' : 'Tamper Pending Transaction in Mempool'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Thử can thiệp chỉnh sửa số tiền hoặc người nhận trong giao dịch đã ký và quan sát cơ chế phòng vệ ECDSA.'
              : 'Modify transaction payload after signing and observe ECDSA cryptographic rejection.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'vi' ? 'Đặt Lại Bản Gốc' : 'Reset Original'}
          </button>
          <Link
            href="/attack-sim/tamper-block"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Giả Mạo Khối' : 'Tamper Block'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Interactive Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Tamper Controls */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              {language === 'vi' ? 'Bảng Can Thiệp Dữ Liệu Giao Dịch' : 'Transaction Payload Interception'}
            </h2>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
              MITM Attack Mode
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {language === 'vi' ? 'Địa chỉ gửi (Sender - Fixed by Signer)' : 'Sender Address'}
              </label>
              <input
                type="text"
                value={fromAddr}
                disabled
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 font-mono text-slate-400 text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-semibold">
                  {language === 'vi' ? 'Địa chỉ nhận (Recipient - To)' : 'Recipient Address'}
                </label>
                <button
                  onClick={handleTamperRecipient}
                  className="text-rose-400 hover:text-rose-300 text-[11px] font-bold underline"
                >
                  {language === 'vi' ? 'Giả mạo Hacker' : 'Tamper to Hacker'}
                </button>
              </div>
              <input
                type="text"
                value={toAddr}
                onChange={(e) => {
                  setToAddr(e.target.value);
                  setIsTampered(true);
                }}
                className={`w-full bg-slate-950 rounded-xl px-3 py-2.5 font-mono text-xs border transition-colors ${
                  toAddr !== sampleTx.to ? 'border-rose-500 text-rose-300 bg-rose-950/20' : 'border-slate-800 text-slate-200'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold">
                    {language === 'vi' ? 'Số tiền chuyển (Amount)' : 'Amount'}
                  </label>
                  <button
                    onClick={handleTamperAmount}
                    className="text-rose-400 hover:text-rose-300 text-[11px] font-bold underline"
                  >
                    {language === 'vi' ? 'Tăng 9999' : 'Set 9999'}
                  </button>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                    setIsTampered(true);
                  }}
                  className={`w-full bg-slate-950 rounded-xl px-3 py-2.5 font-mono text-xs border transition-colors ${
                    Number(amount) !== sampleTx.amount ? 'border-rose-500 text-rose-300 bg-rose-950/20' : 'border-slate-800 text-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  {language === 'vi' ? 'Gas Fee' : 'Gas Fee'}
                </label>
                <input
                  type="number"
                  value={gasFee}
                  onChange={(e) => {
                    setGasFee(Number(e.target.value));
                    setIsTampered(true);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 font-mono text-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleTamperAmount}
              className="flex-1 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              {language === 'vi' ? 'Sửa Thành 9,999 COIN' : 'Tamper: 9,999 COIN'}
            </button>
            <button
              onClick={handleTamperRecipient}
              className="flex-1 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              {language === 'vi' ? 'Đổi Ví Hacker' : 'Tamper: Hacker Addr'}
            </button>
          </div>
        </div>

        {/* Right: Cryptographic Verification & Rejection Result */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-indigo-400" />
              {language === 'vi' ? 'Xác Minh Chữ Ký ECDSA & Mã Băm' : 'ECDSA Signature Verification Engine'}
            </h2>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">
                  {language === 'vi' ? 'Mã Băm Giao Dịch Gốc (Original TX Hash)' : 'Original TX Hash'}
                </div>
                <div className="font-mono text-[11px] text-slate-300 break-all">
                  {originalHash}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] uppercase font-semibold">
                  <span className={currentHash !== originalHash ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    {language === 'vi' ? 'Mã Băm Hiện Tại (Current TX Hash)' : 'Current TX Hash'}
                  </span>
                  {currentHash !== originalHash && (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      Hash Mismatch (Avalanche Effect)
                    </span>
                  )}
                </div>
                <div className={`font-mono text-[11px] break-all ${
                  currentHash !== originalHash ? 'text-rose-400 font-bold' : 'text-slate-300'
                }`}>
                  {currentHash}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">
                  {language === 'vi' ? 'Chữ Ký ECDSA Kèm Theo (Gắn với Hash Gốc)' : 'ECDSA Signature Attached'}
                </div>
                <div className="font-mono text-[11px] text-purple-300 break-all">
                  r: {originalSignature?.r} <br />
                  s: {originalSignature?.s} (v: {originalSignature?.v})
                </div>
              </div>
            </div>
          </div>

          {/* Verification Banner */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isValidSignature
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/60 text-rose-200 shadow-xl shadow-rose-900/20'
          }`}>
            <div className="flex items-center gap-3">
              {isValidSignature ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400 shrink-0 animate-pulse" />
              )}
              <div>
                <div className="font-bold text-sm">
                  {isValidSignature
                    ? (language === 'vi' ? 'Chữ Ký Hợp Lệ - Được Phép Vào Mempool' : 'Valid Signature - Accepted to Mempool')
                    : (language === 'vi' ? 'Chữ Ký Không Khớp! Bị Toàn Mạng Từ Chối' : 'Invalid Signature! Rejected by Network')}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {isValidSignature
                    ? (language === 'vi'
                        ? 'Dữ liệu giao dịch trùng khớp hoàn toàn với hash lúc người gửi ký private key.'
                        : 'Payload matches the original digest signed with sender private key.')
                    : (language === 'vi'
                        ? 'Kẻ tấn công không thể tạo lại chữ ký ECDSA hợp lệ nếu không có Private Key của người gửi.'
                        : 'Attacker cannot forge a valid ECDSA signature without the sender private key.')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
