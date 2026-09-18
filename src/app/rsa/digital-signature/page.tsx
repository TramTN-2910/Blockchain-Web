'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { sha256 } from 'js-sha256';
import {
  FileSignature,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  ArrowRight,
  RotateCcw,
  Key,
  Hash,
  FileText,
  Lock,
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useTranslation } from '@/lib/i18n/useTranslation';

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes.buffer;
}

export default function RsaDigitalSignaturePage() {
  const { t } = useTranslation();
  const pg = (t as any).rsa_digital_signature || {};

  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [messageToSign, setMessageToSign] = useState<string>('Hello, Blockchain!');
  const [signedMessageText, setSignedMessageText] = useState<string>('Hello, Blockchain!');
  const [messageHash, setMessageHash] = useState<string>('');
  const [signatureBase64, setSignatureBase64] = useState<string>('');
  const [isSigning, setIsSigning] = useState<boolean>(false);

  const [verifyMessageInput, setVerifyMessageInput] = useState<string>('Hello, Blockchain!');
  const [verificationStatus, setVerificationStatus] = useState<'valid' | 'invalid' | 'idle'>('idle');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const generateKeys = useCallback(async () => {
    setIsGenerating(true);
    try {
      const keys = await window.crypto.subtle.generateKey(
        { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
        true,
        ['sign', 'verify']
      );
      setKeyPair(keys);

      const text = messageToSign || 'Hello, Blockchain!';
      setMessageHash(sha256(text));

      const data = new TextEncoder().encode(text);
      const sigBuffer = await window.crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, keys.privateKey, data);
      const b64 = arrayBufferToBase64(sigBuffer);
      setSignatureBase64(b64);
      setSignedMessageText(text);
      setVerifyMessageInput(text);
      setVerificationStatus('valid');
    } catch (err) {
      console.error('Error in keygen/signing:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [messageToSign]);

  useEffect(() => { generateKeys(); }, [generateKeys]);

  const handleSign = async () => {
    if (!keyPair?.privateKey || !messageToSign) return;
    setIsSigning(true);
    try {
      setMessageHash(sha256(messageToSign));
      const data = new TextEncoder().encode(messageToSign);
      const sigBuffer = await window.crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, keyPair.privateKey, data);
      const b64 = arrayBufferToBase64(sigBuffer);
      setSignatureBase64(b64);
      setSignedMessageText(messageToSign);
      setVerifyMessageInput(messageToSign);
      setVerificationStatus('valid');
    } catch (err) {
      console.error('Signing failed:', err);
    } finally {
      setIsSigning(false);
    }
  };

  const handleVerify = async () => {
    if (!keyPair?.publicKey || !signatureBase64) return;
    setIsVerifying(true);
    try {
      const data = new TextEncoder().encode(verifyMessageInput);
      const sigBuffer = base64ToArrayBuffer(signatureBase64);
      const isValid = await window.crypto.subtle.verify({ name: 'RSASSA-PKCS1-v1_5' }, keyPair.publicKey, sigBuffer, data);
      setVerificationStatus(isValid ? 'valid' : 'invalid');
    } catch (err) {
      console.error('Verification error:', err);
      setVerificationStatus('invalid');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-8 pt-2">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-slate-900/80 border border-indigo-200/70 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>{pg.notice_title || 'This demo uses RSA — real Blockchain uses ECDSA'}</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {pg.notice_desc || 'In practice, Bitcoin uses ECDSA (Elliptic Curve Digital Signature Algorithm). This demo uses RSA-2048 to illustrate the concept as it is easier to understand.'}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">📜 RSA (Demo)</span>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">📱 ECDSA (Blockchain)</span>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {pg.title || 'Digital Signature & Blockchain'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          {pg.subtitle || "Blockchain doesn't sign the full transaction data — only its hash. This makes verification faster and more secure."}
        </p>
      </div>

      {/* How Blockchain Uses Signatures */}
      <SpotlightCard spotlightColor="rgba(99, 102, 241, 0.16)" className="glass-card p-6 sm:p-7 space-y-4 border-l-4 border-l-indigo-600 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>📜</span>
          <span>{pg.how_blockchain_uses || 'How Blockchain Uses Digital Signatures'}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono text-center font-bold text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-nowrap">
          Transaction → Merkle Tree → Root Hash → Digital Signature (ECDSA) → Signature
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong>{pg.why_hash || 'Why only sign the hash? RSA signatures can only process small data (a few KB). By signing the Merkle Root hash (32 bytes), you authenticate the entire block even with thousands of transactions.'}</strong>
        </p>
      </SpotlightCard>

      {/* Step 1: Generate Keys */}
      <SpotlightCard spotlightColor="rgba(168, 85, 247, 0.16)" className="glass-card p-6 sm:p-7 space-y-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">1</div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{pg.step1_title || '1. Generate digital signature key pair'}</h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={generateKeys}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? (pg.btn_generating || 'Generating keys...') : (pg.btn_generate || 'Generate New Keys')}</span>
          </button>
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">✅ RSASSA-PKCS1-v1_5 • SHA-256</span>
        </div>
      </SpotlightCard>

      {/* Step 2: Sign */}
      <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.16)" className="glass-card p-6 sm:p-7 space-y-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">2</div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{pg.step2_title || '2. Sign the message'}</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">{pg.message_label || 'MESSAGE TO SIGN'}</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={messageToSign}
              onChange={(e) => setMessageToSign(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSign}
              disabled={isSigning || !messageToSign}
              className="px-5 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <FileSignature className="w-4 h-4" />
              <span>{pg.btn_sign || 'Sign'}</span>
            </button>
          </div>
        </div>

        {/* Signing Flow Diagram */}
        <div className="p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[550px] gap-2 text-center text-xs">
            {[
              { icon: <FileText className="w-4 h-4" />, label: 'Message', sub: `${messageToSign.slice(0, 12)}...`, color: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600' },
              { icon: <span className="font-bold">#</span>, label: 'SHA-256 Hash', sub: `${messageHash.slice(0, 8)}...`, color: 'bg-amber-50 dark:bg-amber-950 text-amber-600' },
              { icon: <Lock className="w-4 h-4" />, label: 'Sign', sub: 'Private Key', color: 'bg-purple-50 dark:bg-purple-950 text-purple-600' },
              { icon: <FileSignature className="w-4 h-4" />, label: 'Signature', sub: `${signatureBase64.slice(0, 8)}...`, color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' },
            ].map((box, i, arr) => (
              <React.Fragment key={i}>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 flex-1">
                  <div className={`w-7 h-7 rounded-lg ${box.color} mx-auto flex items-center justify-center`}>{box.icon}</div>
                  <div className="font-bold text-slate-700 dark:text-slate-300">{box.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{box.sub}</div>
                </div>
                {i < arr.length - 1 && <div className="text-slate-400 font-bold">→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">{pg.hash_label || 'SHA-256 HASH OF MESSAGE'}</div>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-xs text-indigo-600 dark:text-indigo-400 break-all border border-slate-200 dark:border-slate-800">
            {messageHash || (pg.no_hash || 'Not hashed yet...')}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">{pg.signature_label || 'DIGITAL SIGNATURE (BASE64)'}</div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 font-mono text-xs text-amber-700 dark:text-amber-300 break-all leading-relaxed">
            {signatureBase64 || (pg.no_signature || 'No signature yet...')}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">256 bytes = 2048-bit RSA signature</div>
        </div>
      </SpotlightCard>

      {/* Step 3: Verify */}
      <SpotlightCard spotlightColor="rgba(6, 182, 212, 0.16)" className="glass-card p-6 sm:p-7 space-y-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">3</div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{pg.step3_title || '3. Verify the signature'}</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">{pg.verify_label || 'MESSAGE TO VERIFY'}</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={verifyMessageInput}
              onChange={(e) => setVerifyMessageInput(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying || !signatureBase64}
              className="px-5 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-xs flex items-center gap-1.5 transition-all"
            >
              <span>{pg.btn_verify || '🔍 Verify'}</span>
            </button>
          </div>
        </div>

        {/* Tamper test buttons */}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setVerifyMessageInput(signedMessageText)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50">
            {pg.btn_restore || '✅ Restore original'}
          </button>
          <button type="button" onClick={() => setVerifyMessageInput(verifyMessageInput + '!!!')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50">
            {pg.btn_add_exclamation || '✏️ Append "!!!"'}
          </button>
          <button type="button" onClick={() => setVerifyMessageInput(verifyMessageInput.toUpperCase())} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50">
            {pg.btn_uppercase || '🔠 UPPERCASE'}
          </button>
          <button type="button" onClick={() => setVerifyMessageInput('')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50">
            {pg.btn_clear || '🧹 Clear'}
          </button>
        </div>

        {/* Verification Result */}
        {verificationStatus === 'valid' ? (
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-800 dark:text-cyan-300 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">✓</div>
            <div>
              <div className="font-bold text-sm text-cyan-900 dark:text-cyan-100">{pg.sig_valid_title || 'SIGNATURE VALID'}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{pg.sig_valid_desc || 'The message is unaltered and signed by the correct private key'}</div>
            </div>
          </div>
        ) : verificationStatus === 'invalid' ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold flex-shrink-0">✕</div>
            <div>
              <div className="font-bold text-sm text-rose-900 dark:text-rose-100">{pg.sig_invalid_title || 'SIGNATURE INVALID'}</div>
              <div className="text-xs text-rose-600 dark:text-rose-400">{pg.sig_invalid_desc || 'The message has been altered or the signature does not match the Public Key!'}</div>
            </div>
          </div>
        ) : null}
      </SpotlightCard>

      {/* Callout Note */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>{pg.callout_title || 'RSA in Blockchain:'}</span>
        </div>
        <p>{pg.callout_desc || 'In Bitcoin/Ethereum, senders sign transactions with their private key (usually ECDSA, a variant of RSA). The entire network verifies signatures with the public key — no trusted third party needed. This is the foundation of "trustless" in crypto.'}</p>
      </div>

      {/* Bottom Nav */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800">
        <Link href="/rsa/real-world" prefetch={true} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
          {pg.nav_prev || '← Back'}
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
        </div>
        <Link href="/quiz" prefetch={true} className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition-all">
          <span>{pg.nav_quiz || 'Go to Quiz Review →'}</span>
        </Link>
      </div>
    </div>
  );
}
