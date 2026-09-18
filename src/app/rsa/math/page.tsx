'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, AlertTriangle, Key, Lock, ChevronDown, ChevronUp, Check, ArrowRight } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useTranslation } from '@/lib/i18n/useTranslation';

// Math helpers
function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function modPow(base: number, exp: number, mod: number): number {
  if (mod === 1) return 0;
  let res = BigInt(1);
  let b = BigInt(base) % BigInt(mod);
  let e = BigInt(exp);
  const m = BigInt(mod);

  while (e > BigInt(0)) {
    if (e % BigInt(2) === BigInt(1)) res = (res * b) % m;
    e = e / BigInt(2);
    b = (b * b) % m;
  }
  return Number(res);
}

interface EuclidStep {
  step: number;
  r: number;
  q: number;
  s: number;
  t: number;
  new_r: number;
}

function computeExtendedEuclid(e: number, phi: number): { d: number; steps: EuclidStep[] } {
  let r0 = phi, r1 = e;
  let s0 = 1, s1 = 0;
  let t0 = 0, t1 = 1;
  const steps: EuclidStep[] = [];
  let stepCount = 1;

  steps.push({ step: stepCount++, r: r0, q: Math.floor(r0 / r1), s: s0, t: t0, new_r: r1 });

  while (r1 !== 0) {
    const q = Math.floor(r0 / r1);
    const r2 = r0 % r1;
    const s2 = s0 - q * s1;
    const t2 = t0 - q * t1;

    r0 = r1; r1 = r2;
    s0 = s1; s1 = s2;
    t0 = t1; t1 = t2;

    if (r1 !== 0) {
      steps.push({ step: stepCount++, r: r0, q: Math.floor(r0 / r1), s: s0, t: t0, new_r: r1 });
    }
  }

  let d = t0 % phi;
  if (d < 0) d += phi;
  return { d, steps };
}

export default function RsaMathPage() {
  const { t } = useTranslation();
  const pg = (t as any).rsa_math || {};

  const [p, setP] = useState<number>(17);
  const [q, setQ] = useState<number>(11);
  const [selectedE, setSelectedE] = useState<number>(7);
  const [customEInput, setCustomEInput] = useState<string>('7');
  const [showEuclidSteps, setShowEuclidSteps] = useState<boolean>(true);
  const [messageM, setMessageM] = useState<number>(21);

  const presets = [
    { label: pg.preset_simple || 'p=17, q=11 (Simple)', p: 17, q: 11, e: 7, m: 21 },
    { label: pg.preset_classic || 'p=13, q=11 (Classic)', p: 13, q: 11, e: 7, m: 15 },
    { label: pg.preset_medium || 'p=23, q=19 (Medium)', p: 23, q: 19, e: 5, m: 42 },
    { label: pg.preset_large || 'p=61, q=53 (Larger)', p: 61, q: 53, e: 17, m: 72 },
    { label: pg.preset_advanced || 'p=89, q=97 (Advanced)', p: 89, q: 97, e: 5, m: 100 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setP(preset.p); setQ(preset.q);
    setSelectedE(preset.e); setCustomEInput(String(preset.e));
    setMessageM(preset.m);
  };

  const isPPrime = isPrime(p);
  const isQPrime = isPrime(q);
  const n = p * q;
  const phi = (p - 1) * (q - 1);

  const validEChoices = useMemo(() => {
    const choices: number[] = [];
    if (phi <= 2) return [3];
    for (let candidate = 3; candidate < Math.min(phi, 35); candidate += 2) {
      if (gcd(candidate, phi) === 1) choices.push(candidate);
    }
    return choices;
  }, [phi]);

  const isEValid = selectedE > 1 && selectedE < phi && gcd(selectedE, phi) === 1;

  const { d, steps } = useMemo(() => {
    if (!isEValid || phi <= 1) return { d: 0, steps: [] };
    return computeExtendedEuclid(selectedE, phi);
  }, [selectedE, phi, isEValid]);

  const isMValid = messageM > 0 && messageM < n;
  const ciphertextC = isMValid && isEValid ? modPow(messageM, selectedE, n) : 0;
  const decryptedM = isMValid && isEValid ? modPow(ciphertextC, d, n) : 0;

  return (
    <div className="space-y-8 pt-2">
      {/* Header */}
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {pg.title || 'RSA Step-by-Step Visualizer'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          {pg.subtitle || 'Enter two prime numbers p and q, then watch each RSA key computation step and encrypt/decrypt.'}
        </p>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{pg.presets_label || 'QUICK PRESETS:'}</div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-300 transition-all shadow-sm"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1 */}
      <SpotlightCard spotlightColor="rgba(99, 102, 241, 0.16)" className="glass-card p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">1</div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{pg.step1_title || 'Choose two prime numbers p and q'}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{ label: 'p', val: p, setVal: setP, isPrime: isPPrime }, { label: 'q', val: q, setVal: setQ, isPrime: isQPrime }].map(({ label, val, setVal, isPrime: prime }) => (
            <div key={label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500">{label}</label>
                {prime ? (
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {pg.is_prime || '(Is Prime)'}
                  </span>
                ) : (
                  <span className="text-[11px] text-rose-500 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {pg.not_prime || '(Not a prime number!)'}
                  </span>
                )}
              </div>
              <input
                type="number"
                value={val}
                onChange={(e) => setVal(Math.max(2, Number(e.target.value)))}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          ))}
        </div>

        <button type="button" className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 text-xs flex items-center gap-1.5 transition-all">
          <Sparkles className="w-4 h-4" />
          <span>{pg.btn_compute || 'Compute RSA'}</span>
        </button>
      </SpotlightCard>

      {/* Step 2 */}
      <SpotlightCard spotlightColor="rgba(168, 85, 247, 0.16)" className="glass-card p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">2</div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{pg.step2_title || 'Compute n and φ(n)'}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase font-sans">N = P × Q</div>
            <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">{p} × {q} = {n}</div>
            <div className="text-[11px] text-slate-400 font-sans">Modulus (public)</div>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase font-sans">Φ(N) = (P-1)(Q-1)</div>
            <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">({p - 1}) × ({q - 1}) = {phi}</div>
            <div className="text-[11px] text-slate-400 font-sans">Euler totient function</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {pg.phi_hint || '💡 φ(n) (phi): counts integers coprime to n in range [1, n). This is RSA\'s "secret number".'}
        </div>
      </SpotlightCard>

      {/* Step 3 */}
      <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.16)" className="glass-card p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">3</div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{pg.step3_title || 'Conditions for choosing e:'}</h3>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          {(pg.e_condition || 'Condition: 1 < e < φ(n) = {phi} and gcd(e, φ(n)) = 1').replace('{phi}', String(phi))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {validEChoices.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => { setSelectedE(val); setCustomEInput(String(val)); }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                selectedE === val
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-500'
              }`}
            >
              e = {val}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <input
            type="number"
            value={customEInput}
            onChange={(e) => setCustomEInput(e.target.value)}
            className="w-32 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-sm font-bold"
          />
          <button
            type="button"
            onClick={() => { const parsed = Number(customEInput); if (parsed) setSelectedE(parsed); }}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          >
            {pg.btn_apply || 'Apply'}
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-xs font-bold text-amber-500">e (public exponent): {selectedE}</div>
          {isEValid && (
            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> gcd({selectedE}, {phi}) = 1 — {pg.e_valid || 'valid'}
            </div>
          )}
        </div>
      </SpotlightCard>

      {/* Step 4 */}
      <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.16)" className="glass-card p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">4</div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{pg.step4_title || 'Compute private exponent d — Extended Euclid'}</h3>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          {pg.d_find || 'Find d such that'} <span className="text-indigo-600 font-bold">{selectedE} × d ≡ 1 (mod {phi})</span>
        </div>

        <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800 space-y-2">
          <div className="text-[11px] font-bold text-purple-600 uppercase font-sans">D (PRIVATE EXPONENT)</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">d = {d}</div>
          <div className="text-xs text-emerald-600 font-mono flex items-center gap-1">
            {pg.verify_label || 'Verify:'} {selectedE} × {d} = {selectedE * d} ≡ 1 (mod {phi}) <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowEuclidSteps(!showEuclidSteps)}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all"
        >
          {showEuclidSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{showEuclidSteps ? (pg.btn_hide_euclid || 'Hide Extended Euclid Steps') : (pg.btn_show_euclid || 'Show Extended Euclid Steps')}</span>
        </button>

        {showEuclidSteps && (
          <div className="overflow-x-auto pt-1">
            <div className="text-xs text-slate-500 font-mono mb-2">
              {pg.d_find || 'Find d such that'} <strong className="text-indigo-600">{selectedE} × d ≡ 1 (mod {phi})</strong>
            </div>
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-left">
                  <th className="py-2 px-3">STEP</th>
                  <th className="py-2 px-3">R</th>
                  <th className="py-2 px-3">Q</th>
                  <th className="py-2 px-3">S</th>
                  <th className="py-2 px-3">T</th>
                  <th className="py-2 px-3">NEW_R</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((row) => (
                  <tr key={row.step} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 px-3 text-slate-400">{row.step}</td>
                    <td className="py-2 px-3 font-semibold">{row.r}</td>
                    <td className="py-2 px-3">{row.q}</td>
                    <td className="py-2 px-3 text-indigo-600">{row.s}</td>
                    <td className="py-2 px-3 text-purple-600 font-bold">{row.t}</td>
                    <td className="py-2 px-3">{row.new_r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SpotlightCard>

      {/* Step 5 */}
      <SpotlightCard spotlightColor="rgba(6, 182, 212, 0.16)" className="glass-card p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">5</div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{pg.step5_title || '📋 RSA Key Summary'}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 font-sans">
              <Key className="w-4 h-4" /><span>Public Key</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-amber-500/20">
              <span className="text-slate-500 font-sans">e</span>
              <span className="font-bold text-amber-600">{selectedE}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-amber-500/20">
              <span className="text-slate-500 font-sans">n</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{n}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans pt-1">{pg.pub_share || 'Share publicly → (e, n)'}</div>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 font-sans">
              <Lock className="w-4 h-4" /><span>Private Key</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-purple-500/20">
              <span className="text-slate-500 font-sans">d</span>
              <span className="font-bold text-purple-600">{d}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-purple-500/20">
              <span className="text-slate-500 font-sans">n</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{n}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans pt-1">{pg.priv_keep || 'Keep secret → (d, n)'}</div>
          </div>
        </div>
      </SpotlightCard>

      {/* Step 6 */}
      <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.16)" className="glass-card p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">6</div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{pg.step6_title || '🔒 Encrypt & Decrypt'}</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">
            {(pg.m_label || 'Enter integer M (0 < M < n = {n})').replace('{n}', String(n))}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={messageM}
              onChange={(e) => setMessageM(Math.max(1, Number(e.target.value)))}
              className="w-48 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-sm font-bold"
            />
            {isMValid && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> {pg.m_valid || 'Valid'}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 font-mono">
          <div className="p-4 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5 text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase font-sans">C = M^E MOD N (ENCRYPT WITH PUBLIC KEY)</div>
            <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
              {messageM}<sup>{selectedE}</sup> mod {n} = <span className="text-amber-500 font-black">{ciphertextC}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5 text-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase font-sans">M&apos; = C^D MOD N (DECRYPT WITH PRIVATE KEY)</div>
            <div className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
              {ciphertextC}<sup>{d}</sup> mod {n} = <span className="text-purple-600 font-black">{decryptedM}</span>
            </div>
          </div>
        </div>

        {decryptedM === messageM && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{(pg.decrypt_success || "M' = M = {m} — Decryption successful!").replace('{m}', String(messageM))}</span>
          </div>
        )}
      </SpotlightCard>

      {/* Bottom Nav */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800">
        <Link href="/rsa/theory" prefetch={true} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
          {pg.nav_prev || '← Back'}
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
        </div>
        <Link href="/rsa/real-world" prefetch={true} className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition-all">
          <span>{pg.nav_next || 'Next →'}</span>
        </Link>
      </div>
    </div>
  );
}
