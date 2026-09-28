'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { generateMnemonic } from '@/lib/crypto/lifecycleCrypto';
import {
  Wallet as WalletIcon,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Droplets,
  Plus,
  Trash2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Coins
} from 'lucide-react';
import Link from 'next/link';

export default function CryptoLabWalletPage() {
  const { language } = useLanguageStore();
  const {
    wallets,
    activeWalletId,
    createWallet,
    faucetAirdrop,
    setActiveWallet,
    removeWallet
  } = useBlockchainLifecycleStore();

  const [walletName, setWalletName] = useState('');
  const [seedInput, setSeedInput] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [faucetSuccess, setFaucetSuccess] = useState(false);

  const activeWallet = wallets.find((w) => w.id === activeWalletId) || wallets[0];

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    createWallet(walletName.trim() || undefined, seedInput.trim() || undefined);
    setWalletName('');
    setSeedInput('');
  };

  const handleGenerateRandomSeed = () => {
    setSeedInput(generateMnemonic(12));
  };

  const handleFaucet = (walletId: string) => {
    faucetAirdrop(walletId, 100);
    setFaucetSuccess(true);
    setTimeout(() => setFaucetSuccess(false), 2500);
  };

  const toggleShowKey = (walletId: string) => {
    setShowPrivateKey((prev) => ({ ...prev, [walletId]: !prev[walletId] }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-900 border border-cyan-800/40">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-[11px] font-extrabold text-cyan-300 whitespace-nowrap tracking-wider shrink-0">
              LAB 1
            </span>
            <span>{language === 'vi' ? 'Phòng TN Mật Mã • Tạo Ví' : 'Crypto Lab • Wallet Generator'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Khởi Tạo Ví & Quản Lý Khóa ECDSA' : 'Wallet & ECDSA Keypair Sandbox'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Sinh ngẫu nhiên hoặc tạo xác định từ Seed Phrase 12 từ theo chuẩn đường cong elliptic secp256k1 (Bitcoin/Ethereum).'
              : 'Generate random or deterministic keypairs from 12-word BIP-39 mnemonic seed phrases using ECDSA secp256k1.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/crypto-lab/hash"
            prefetch={true}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>{language === 'vi' ? 'Sang Lab: Tạo Hash' : 'Next: Hash Lab'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create & Import Wallet Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              {language === 'vi' ? 'Tạo / Khôi Phục Ví Mới' : 'Create / Restore Wallet'}
            </h2>

            <form onSubmit={handleCreateNew} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'vi' ? 'Tên gợi nhớ của ví' : 'Wallet Name'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'vi' ? 'VD: Ví Alice...' : 'e.g. Alice Wallet...'}
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {language === 'vi' ? 'Cụm từ Seed Phrase (12 từ)' : 'Seed Phrase (12 words)'}
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomSeed}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{language === 'vi' ? 'Sinh ngẫu nhiên' : 'Random'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder={language === 'vi' ? 'Để trống để tự động sinh ngẫu nhiên...' : 'Leave blank for random generation...'}
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Khởi Tạo Cặp Khóa ECDSA' : 'Generate ECDSA Keypair'}</span>
              </button>
            </form>
          </div>

          {/* Multi-wallet list switcher */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {language === 'vi' ? 'Danh Sách Ví Trong Phiên' : 'Session Wallets'} ({wallets.length})
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {wallets.map((w) => {
                const isActive = w.id === activeWalletId;
                return (
                  <div
                    key={w.id}
                    onClick={() => setActiveWallet(w.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-0.5 overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                        <span className="text-xs font-bold text-white truncate">{w.name}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate">
                        {w.address.slice(0, 10)}...{w.address.slice(-6)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-emerald-400">
                        {w.balance} HUB
                      </span>
                      {wallets.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeWallet(w.id);
                          }}
                          className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Wallet Inspection & Faucet */}
        <div className="lg:col-span-2 space-y-6">
          {activeWallet ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              {/* Active Wallet Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <WalletIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{activeWallet.name}</h2>
                      <span className="px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-800 text-[10px] text-cyan-300 font-bold">
                        ACTIVE WALLET
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {language === 'vi' ? 'Ví đang được kích hoạt để ký giao dịch' : 'Currently active wallet for signing'}
                    </div>
                  </div>
                </div>

                {/* Balance & Faucet Button */}
                <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                  <div className="text-right px-2">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">
                      {language === 'vi' ? 'Số Dư' : 'Balance'}
                    </div>
                    <div className="text-base font-extrabold text-emerald-400 font-mono">
                      {activeWallet.balance} HUB
                    </div>
                  </div>

                  <button
                    onClick={() => handleFaucet(activeWallet.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>+100 Faucet</span>
                  </button>
                </div>
              </div>

              {/* Faucet Success Toast */}
              <AnimatePresence>
                {faucetSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2"
                  >
                    <Coins className="w-4 h-4 text-emerald-400 animate-bounce" />
                    <span>
                      {language === 'vi'
                        ? 'Đã nạp thành công 100 HUB testnet vào ví!'
                        : 'Successfully claimed 100 testnet HUB!'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Detailed Cryptographic Fields */}
              <div className="space-y-4">
                {/* Seed Phrase */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {language === 'vi' ? 'Seed Phrase (12 từ BIP-39)' : 'BIP-39 Mnemonic (12 Words)'}
                    </span>
                    <button
                      onClick={() => handleCopy(activeWallet.seedPhrase, 'seed')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedField === 'seed' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'seed' ? (language === 'vi' ? 'Đã chép' : 'Copied') : (language === 'vi' ? 'Sao chép' : 'Copy')}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 break-words">
                    {activeWallet.seedPhrase}
                  </div>
                </div>

                {/* Public Address 0x */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                      <WalletIcon className="w-3.5 h-3.5" />
                      {language === 'vi' ? 'Địa Chỉ Ví Công Khai (0x...)' : 'Public Wallet Address (0x...)'}
                    </span>
                    <button
                      onClick={() => handleCopy(activeWallet.address, 'address')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedField === 'address' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'address' ? (language === 'vi' ? 'Đã chép' : 'Copied') : (language === 'vi' ? 'Sao chép' : 'Copy')}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all font-bold">
                    {activeWallet.address}
                  </div>
                </div>

                {/* Public Key */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5" />
                      {language === 'vi' ? 'Khóa Công Khai (512-bit / secp256k1)' : 'Public Key (512-bit / secp256k1)'}
                    </span>
                    <button
                      onClick={() => handleCopy(activeWallet.publicKey, 'pubkey')}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedField === 'pubkey' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'pubkey' ? (language === 'vi' ? 'Đã chép' : 'Copied') : (language === 'vi' ? 'Sao chép' : 'Copy')}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-purple-300 break-all">
                    {activeWallet.publicKey}
                  </div>
                </div>

                {/* Private Key */}
                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {language === 'vi' ? 'Khóa Bí Mật (Private Key) • Tuyệt Mật' : 'Private Key (256-bit) • Strictly Secret'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleShowKey(activeWallet.id)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {showPrivateKey[activeWallet.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showPrivateKey[activeWallet.id] ? (language === 'vi' ? 'Ẩn' : 'Hide') : (language === 'vi' ? 'Hiện' : 'Show')}</span>
                      </button>
                      <button
                        onClick={() => handleCopy(activeWallet.privateKey, 'privkey')}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedField === 'privkey' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'privkey' ? (language === 'vi' ? 'Đã chép' : 'Copied') : (language === 'vi' ? 'Sao chép' : 'Copy')}</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-red-900/40 font-mono text-xs text-red-300 break-all">
                    {showPrivateKey[activeWallet.id]
                      ? activeWallet.privateKey
                      : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
