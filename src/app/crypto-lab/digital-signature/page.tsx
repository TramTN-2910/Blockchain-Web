'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { signTransaction as cryptoSignTx } from '@/lib/crypto/lifecycleCrypto';
import { sha256 } from 'js-sha256';
import { FileSignature, Key, ShieldCheck, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CryptoLabDigitalSignaturePage() {
  const { language } = useLanguageStore();
  const { wallets, activeWalletId } = useBlockchainLifecycleStore();

  const activeWallet = wallets.find((w) => w.id === activeWalletId) || wallets[0];

  const [message, setMessage] = useState(language === 'vi' ? 'Alice chuyển cho Bob 50 HUB token' : 'Alice transfers 50 HUB tokens to Bob');
  const [signature, setSignature] = useState<{ r: string; s: string; v: number } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const messageHash = sha256(message);

  const handleSignMessage = () => {
    if (!activeWallet) return;
    const sig = cryptoSignTx(messageHash, activeWallet.privateKey);
    setSignature(sig);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-800/40">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[11px] font-extrabold text-purple-300 whitespace-nowrap tracking-wider shrink-0">
              LAB 3
            </span>
            <span>{language === 'vi' ? 'Phòng TN Mật Mã • Ký Số' : 'Crypto Lab • Signer'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Ký Số Thông Điệp Với ECDSA (secp256k1)' : 'ECDSA Digital Signature Generator'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Nhập thông điệp văn bản bất kỳ, tính mã băm và dùng Private Key của ví đang chọn để sinh chữ ký số (r, s, v).'
              : 'Sign arbitrary messages with active wallet Private Key using secp256k1 elliptic curve digital signatures.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/crypto-lab/signature-verification"
            prefetch={true}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>{language === 'vi' ? 'Sang Lab: Xác Minh Chữ Ký' : 'Next: Verification Lab'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Message Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-purple-400" />
            {language === 'vi' ? '1. Soạn Thảo Thông Điệp Cần Ký' : '1. Draft Message to Sign'}
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400">
                {language === 'vi' ? 'Ví đang chọn (Người ký):' : 'Active Signer Wallet:'}
              </label>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center justify-between">
                <span>{activeWallet?.name}</span>
                <span className="text-slate-500 text-[11px]">{activeWallet?.address.slice(0, 12)}...</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400">
                {language === 'vi' ? 'Nội dung thông điệp:' : 'Message Payload:'}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Message SHA-256 Hash:</div>
              <div className="font-mono text-xs text-purple-300 break-all">{messageHash}</div>
            </div>

            <button
              onClick={handleSignMessage}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Ký Thông Điệp Bằng Private Key' : 'Sign Message with Private Key'}</span>
            </button>
          </div>
        </div>

        {/* Output Signature Display */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {language === 'vi' ? '2. Kết Quả Chữ Ký Số ECDSA' : '2. Generated ECDSA Signature'}
            </h2>
            {signature && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                SIGNED ✅
              </span>
            )}
          </div>

          {signature ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-800/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Signature Parameter (r):</span>
                <div className="text-emerald-300 break-all">{signature.r}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-800/60 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Signature Parameter (s):</span>
                <div className="text-emerald-300 break-all">{signature.s}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-800/60 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Recovery ID (v):</span>
                <div className="text-emerald-300 font-bold">{signature.v}</div>
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2 text-slate-500 text-xs">
              <Key className="w-8 h-8 mx-auto text-slate-600" />
              <div>
                {language === 'vi'
                  ? 'Bấm nút "Ký Thông Điệp" ở bên trái để sinh chữ ký số (r, s, v).'
                  : 'Click "Sign Message with Private Key" on the left to generate (r, s, v).'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
