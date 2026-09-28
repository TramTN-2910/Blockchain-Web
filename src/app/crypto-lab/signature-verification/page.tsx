'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { signTransaction, verifySignature } from '@/lib/crypto/lifecycleCrypto';
import { sha256 } from 'js-sha256';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function CryptoLabVerificationPage() {
  const { language } = useLanguageStore();
  const { wallets, activeWalletId } = useBlockchainLifecycleStore();

  const activeWallet = wallets.find((w) => w.id === activeWalletId) || wallets[0];

  const [message, setMessage] = useState(language === 'vi' ? 'Alice chuyển 50 HUB cho Bob' : 'Alice sends 50 HUB to Bob');
  const [tamperedMessage, setTamperedMessage] = useState(language === 'vi' ? 'Alice chuyển 500 HUB cho Bob' : 'Alice sends 500 HUB to Bob');
  const [useTampered, setUseTampered] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  // Sinh chữ ký mẫu cho message gốc
  const originalHash = sha256(message);
  const sampleSignature = activeWallet ? signTransaction(originalHash, activeWallet.privateKey) : null;

  const handleVerify = () => {
    if (!activeWallet || !sampleSignature) return;
    const testHash = sha256(useTampered ? tamperedMessage : message);
    const isValid = verifySignature(testHash, sampleSignature, activeWallet.privateKey);
    setVerificationResult(isValid);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900 border border-emerald-800/40">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[11px] font-extrabold text-emerald-300 whitespace-nowrap tracking-wider shrink-0">
              LAB 4
            </span>
            <span>{language === 'vi' ? 'Phòng TN Mật Mã • Xác Minh' : 'Crypto Lab • Signature Verifier'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Xác Minh Chữ Ký & Phát Hiện Giả Mạo' : 'Signature Verification & Tamper Detection'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Thử nghiệm xác minh chữ ký số với Public Key của người gửi và quan sát phản ứng khi nội dung bị chỉnh sửa trái phép.'
              : 'Verify digital signatures against sender Public Key and observe instant cryptographic tamper detection.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/blockchain-sim/transaction"
            prefetch={true}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>{language === 'vi' ? 'Sang Chuyên Mục 4: Mô Phỏng Blockchain' : 'Explore 4: Blockchain Sim'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Testing Controls */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {language === 'vi' ? '1. Chọn Dữ Liệu Kiểm Thử Xác Minh' : '1. Select Test Verification Payload'}
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="radio"
                  name="msgSelect"
                  checked={!useTampered}
                  onChange={() => {
                    setUseTampered(false);
                    setVerificationResult(null);
                  }}
                  className="accent-emerald-500"
                />
                <span>{language === 'vi' ? 'Thông điệp gốc (Hợp lệ):' : 'Original Message (Valid):'}</span>
              </label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300">
                "{message}"
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-rose-400 cursor-pointer">
                <input
                  type="radio"
                  name="msgSelect"
                  checked={useTampered}
                  onChange={() => {
                    setUseTampered(true);
                    setVerificationResult(null);
                  }}
                  className="accent-rose-500"
                />
                <span>{language === 'vi' ? 'Thông điệp bị kẻ tấn công sửa đổi (+500 HUB):' : 'Tampered Payload by Attacker (+500 HUB):'}</span>
              </label>
              <div className="p-3 rounded-xl bg-slate-950 border border-rose-900/60 text-xs font-mono text-rose-300">
                "{tamperedMessage}"
              </div>
            </div>

            <button
              onClick={handleVerify}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Chạy Thuật Toán Xác Minh (Verify Signature)' : 'Run Verification Algorithm'}</span>
            </button>
          </div>
        </div>

        {/* Verification Result Display */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {language === 'vi' ? '2. Kết Quả Xác Minh Từ Mạng Lưới' : '2. Network Verification Result'}
          </h2>

          <div className="flex-1 flex items-center justify-center py-6">
            {verificationResult === null ? (
              <div className="text-center text-slate-500 text-xs space-y-2">
                <ShieldCheck className="w-10 h-10 mx-auto text-slate-600" />
                <div>
                  {language === 'vi'
                    ? 'Bấm "Chạy Thuật Toán Xác Minh" để kiểm tra tính hợp lệ.'
                    : 'Click "Run Verification Algorithm" to test cryptographic validity.'}
                </div>
              </div>
            ) : verificationResult ? (
              <div className="p-6 rounded-3xl bg-emerald-950/60 border-2 border-emerald-500 text-center space-y-3 w-full shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <div className="text-base font-bold text-white">
                  {language === 'vi' ? 'XÁC MINH THÀNH CÔNG ✅' : 'VERIFICATION SUCCESSFUL ✅'}
                </div>
                <p className="text-xs text-emerald-300 leading-relaxed max-w-sm mx-auto">
                  {language === 'vi'
                    ? `Chữ ký số khớp 100% với Public Key của ${activeWallet?.name}. Thông điệp chưa hề bị chỉnh sửa.`
                    : `Digital signature matches 100% with ${activeWallet?.name}'s Public Key. The message is intact.`}
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-rose-950/60 border-2 border-rose-500 text-center space-y-3 w-full shadow-xl shadow-rose-500/20 animate-pulse">
                <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
                <div className="text-base font-bold text-rose-300">
                  {language === 'vi' ? 'XÁC MINH THẤT BẠI ❌' : 'VERIFICATION FAILED ❌'}
                </div>
                <p className="text-xs text-rose-300 leading-relaxed max-w-sm mx-auto">
                  {language === 'vi'
                    ? 'Chữ ký số KHÔNG KHỚP với nội dung thông điệp mới! Mạng lưới phát hiện gian lận và hủy bỏ.'
                    : 'Signature MISMATCH with altered message payload! Network detected tampering and rejected.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
