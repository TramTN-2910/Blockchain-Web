'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Key, Lock, Unlock, Copy, Check, Eye, EyeOff, Sparkles, Shield, AlertCircle } from 'lucide-react';
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

export default function RsaRealWorldPage() {
  const { t } = useTranslation();
  const pg = (t as any).rsa_real_world || {};

  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [publicKeyPem, setPublicKeyPem] = useState<string>('');
  const [privateKeyPem, setPrivateKeyPem] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [expandPubKey, setExpandPubKey] = useState<boolean>(false);
  const [expandPrivKey, setExpandPrivKey] = useState<boolean>(false);
  const [copiedPub, setCopiedPub] = useState<boolean>(false);
  const [copiedPriv, setCopiedPriv] = useState<boolean>(false);

  const [plainText, setPlainText] = useState<string>('ahihi');
  const [cipherTextBase64, setCipherTextBase64] = useState<string>('');
  const [decryptedText, setDecryptedText] = useState<string>('');
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);

  const generateKeys = useCallback(async () => {
    setIsGenerating(true);
    try {
      const keys = await window.crypto.subtle.generateKey(
        { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
        true,
        ['encrypt', 'decrypt']
      );
      setKeyPair(keys);

      const spki = await window.crypto.subtle.exportKey('spki', keys.publicKey);
      const spkiB64 = arrayBufferToBase64(spki);
      setPublicKeyPem(`-----BEGIN PUBLIC KEY-----\n${spkiB64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`);

      const pkcs8 = await window.crypto.subtle.exportKey('pkcs8', keys.privateKey);
      const pkcs8B64 = arrayBufferToBase64(pkcs8);
      setPrivateKeyPem(`-----BEGIN PRIVATE KEY-----\n${pkcs8B64.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`);

      const encoder = new TextEncoder();
      const data = encoder.encode(plainText || 'ahihi');
      const cipherBuffer = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, keys.publicKey, data);
      setCipherTextBase64(arrayBufferToBase64(cipherBuffer));

      const decryptedBuffer = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, keys.privateKey, cipherBuffer);
      setDecryptedText(new TextDecoder().decode(decryptedBuffer));
    } catch (err) {
      console.error('Error generating RSA keys:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [plainText]);

  useEffect(() => { generateKeys(); }, [generateKeys]);

  const handleEncrypt = async () => {
    if (!keyPair?.publicKey || !plainText) return;
    setIsEncrypting(true);
    try {
      const data = new TextEncoder().encode(plainText);
      const cipherBuffer = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, keyPair.publicKey, data);
      setCipherTextBase64(arrayBufferToBase64(cipherBuffer));
      setDecryptedText('');
    } catch (err) {
      console.error('Encryption failed:', err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!keyPair?.privateKey || !cipherTextBase64) return;
    setIsDecrypting(true);
    try {
      const cipherBuffer = base64ToArrayBuffer(cipherTextBase64);
      const decryptedBuffer = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, keyPair.privateKey, cipherBuffer);
      setDecryptedText(new TextDecoder().decode(decryptedBuffer));
    } catch (err) {
      console.error('Decryption failed:', err);
      setDecryptedText(pg.decrypt_error || '[Error: Cannot decrypt this ciphertext with the Private Key]');
    } finally {
      setIsDecrypting(false);
    }
  };

  const copyToClipboard = (text: string, type: 'pub' | 'priv') => {
    navigator.clipboard.writeText(text);
    if (type === 'pub') { setCopiedPub(true); setTimeout(() => setCopiedPub(false), 2000); }
    else { setCopiedPriv(true); setTimeout(() => setCopiedPriv(false), 2000); }
  };

  const formatShortPem = (pem: string) => {
    const lines = pem.split('\n');
    if (lines.length <= 4) return pem;
    return `${lines[0]}\n${lines[1]}\n${pg.truncated || '... (truncated) ...'}\n${lines[lines.length - 2]}\n${lines[lines.length - 1]}`;
  };

  return (
    <div className="space-y-8 pt-2">
      {/* Header */}
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {pg.title || 'RSA-2048 In Your Browser'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          {pg.subtitle || 'Using Web Crypto API to generate a real 2048-bit RSA key pair, encrypt and decrypt directly in the browser — nothing sent to the server.'}
        </p>
      </div>

      {/* Key Generation Card */}
      <SpotlightCard className="glass-card p-6 sm:p-8 space-y-4 text-center border-2 border-indigo-100 dark:border-slate-800" spotlightColor="rgba(99, 102, 241, 0.16)">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center text-3xl shadow-sm">🔑</div>

        <div className="space-y-1">
          <div className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1.5">
            <Check className="w-5 h-5 text-emerald-500" />
            <span>{pg.key_pair_ready || 'RSA-2048 Key Pair Ready!'}</span>
          </div>
          <p className="text-xs text-slate-500">{pg.key_pair_desc || 'Public key and Private key are ready. You can generate a new key pair at any time.'}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            onClick={generateKeys}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? (pg.btn_generating || 'Generating RSA-2048...') : (pg.btn_generate || 'Generate New Keys')}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">{pg.badge_success || '✅ Generated successfully'}</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">RSA-OAEP</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">SHA-256</span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">2048-bit</span>
        </div>
      </SpotlightCard>

      {/* Public & Private Key Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { type: 'pub' as const, label: 'Public Key', icon: <Key className="w-4 h-4" />, color: 'text-amber-600', pem: publicKeyPem, expand: expandPubKey, setExpand: setExpandPubKey, copied: copiedPub },
          { type: 'priv' as const, label: 'Private Key', icon: <Lock className="w-4 h-4" />, color: 'text-purple-600', pem: privateKeyPem, expand: expandPrivKey, setExpand: setExpandPrivKey, copied: copiedPriv },
        ].map(({ type, label, icon, color, pem, expand, setExpand, copied }) => (
          <SpotlightCard key={type} className="glass-card p-5 space-y-3" spotlightColor={type === 'pub' ? 'rgba(245, 158, 11, 0.16)' : 'rgba(168, 85, 247, 0.16)'}>
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 text-xs font-bold ${color}`}>{icon}<span>{label}</span></div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setExpand(!expand)} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  {expand ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{expand ? (pg.btn_collapse || 'Collapse') : (pg.btn_expand || 'Expand')}</span>
                </button>
                <button type="button" onClick={() => copyToClipboard(pem, type)} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? (pg.btn_copied || 'Copied!') : (pg.btn_copy || 'Copy')}</span>
                </button>
              </div>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 font-mono text-[11px] text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap break-all border border-slate-200 dark:border-slate-800 max-h-48">
              {expand ? pem : formatShortPem(pem)}
            </pre>
            <div className="text-[10px] text-slate-400 font-mono">RSA-2048 • 256 bytes • 2048 bits • <span className={type === 'pub' ? 'text-amber-500' : 'text-purple-500'}>PKCS#8 / SPKI</span></div>
          </SpotlightCard>
        ))}
      </div>

      {/* Encrypt Card */}
      <SpotlightCard className="glass-card p-6 sm:p-7 space-y-4" spotlightColor="rgba(99, 102, 241, 0.16)">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
          <Lock className="w-4 h-4 text-indigo-600" />
          <span>{pg.encrypt_title || 'Encrypt (Public Key)'}</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">{pg.plaintext_label || 'PLAINTEXT (MAX ~200 CHARS)'}</label>
          <textarea
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
            rows={2}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder={pg.plaintext_placeholder || 'Enter message to encrypt...'}
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={handleEncrypt} disabled={isEncrypting || !plainText} className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 text-xs flex items-center gap-1.5 transition-all disabled:opacity-50">
            <Lock className="w-3.5 h-3.5" />
            <span>{pg.btn_encrypt || 'Encrypt'}</span>
          </button>
          <span className="text-xs text-slate-400">{plainText.length} {pg.chars_suffix || 'chars'}</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">CIPHERTEXT (BASE64)</label>
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 font-mono text-xs text-amber-700 dark:text-amber-300 break-all leading-relaxed">
            {cipherTextBase64 || (pg.no_cipher || 'No ciphertext yet...')}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">{cipherTextBase64.length} chars base64 • 256 bytes RSA-2048</div>
        </div>
      </SpotlightCard>

      {/* Decrypt Card */}
      <SpotlightCard className="glass-card p-6 sm:p-7 space-y-4" spotlightColor="rgba(168, 85, 247, 0.16)">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
          <Unlock className="w-4 h-4 text-purple-600" />
          <span>{pg.decrypt_title || 'Decrypt (Private Key)'}</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">CIPHERTEXT (BASE64)</label>
          <textarea
            value={cipherTextBase64}
            onChange={(e) => setCipherTextBase64(e.target.value)}
            rows={2}
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-xs text-slate-700 dark:text-slate-300 break-all focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <button type="button" onClick={handleDecrypt} disabled={isDecrypting || !cipherTextBase64} className="px-5 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 text-xs flex items-center gap-1.5 transition-all disabled:opacity-50">
            <Unlock className="w-3.5 h-3.5" />
            <span>{pg.btn_decrypt || 'Decrypt'}</span>
          </button>
        </div>

        {decryptedText && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">{pg.decrypt_result_label || 'DECRYPTED RESULT'}</label>
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-slate-900 dark:text-slate-100 font-bold text-sm flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>{decryptedText}</span>
            </div>
            {decryptedText === plainText && (
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 pt-1">
                <span>{pg.decrypt_match || '🎯 Exact match with original plaintext!'}</span>
              </div>
            )}
          </div>
        )}
      </SpotlightCard>

      {/* Security Note */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-amber-600" />
          <span>{pg.security_title || 'Security Note:'}</span>
        </div>
        <p>{pg.security_desc || 'All encryption happens in your browser. Keys and data are never sent to any server. Web Crypto API uses CPU hardware acceleration when available.'}</p>
      </div>

      {/* Bottom Nav */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800">
        <Link href="/rsa/math" prefetch={true} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
          {pg.nav_prev || '← Back'}
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
        </div>
        <Link href="/rsa/digital-signature" prefetch={true} className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition-all">
          <span>{pg.nav_next || 'Next →'}</span>
        </Link>
      </div>
    </div>
  );
}
