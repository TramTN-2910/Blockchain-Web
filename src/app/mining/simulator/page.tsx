'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sha256 } from 'js-sha256';
import { Pickaxe, RotateCcw, CheckCircle, Flame } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function MiningSimulatorPage() {
  const { t, language } = useTranslation();
  const pg = (t as any).mining_simulator || {};

  const [data, setData] = useState('123');
  const [difficulty, setDifficulty] = useState(3);
  const [nonce, setNonce] = useState(0);
  const [currentHash, setCurrentHash] = useState('');
  const [isMining, setIsMining] = useState(false);
  const [minedSuccess, setMinedSuccess] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('0.000s');
  const [hashRate, setHashRate] = useState('0.000');
  const [totalTries, setTotalTries] = useState(0);

  const miningRef = useRef<boolean>(false);
  const targetPrefix = '0'.repeat(difficulty);

  const calculateHash = useCallback((currentData: string, currentNonce: number) => {
    return sha256(`block:1:${currentData}:${currentNonce}`);
  }, []);

  useEffect(() => {
    if (!isMining && !minedSuccess) {
      setCurrentHash(calculateHash(data, nonce));
    }
  }, [data, nonce, isMining, minedSuccess, calculateHash]);

  const locale = language === 'en' ? 'en-US' : 'vi-VN';

  const handleStartMining = () => {
    if (isMining) {
      miningRef.current = false;
      setIsMining(false);
      return;
    }

    setIsMining(true);
    setMinedSuccess(false);
    miningRef.current = true;

    let currentNonce = 0;
    const startTime = performance.now();
    let lastRenderTime = startTime;

    const mineBatch = () => {
      if (!miningRef.current) return;

      const batchSize = 350;
      for (let i = 0; i < batchSize; i++) {
        const hash = calculateHash(data, currentNonce);

        if (hash.startsWith(targetPrefix)) {
          const endTime = performance.now();
          const durationSec = Math.max((endTime - startTime) / 1000, 0.001);
          const rate = Math.round(currentNonce / durationSec);

          setNonce(currentNonce);
          setTotalTries(currentNonce);
          setCurrentHash(hash);
          setElapsedTime(`${durationSec.toFixed(3)}s`);
          setHashRate(rate.toLocaleString(locale));
          setMinedSuccess(true);
          setIsMining(false);
          miningRef.current = false;
          return;
        }

        currentNonce++;
      }

      const now = performance.now();
      if (now - lastRenderTime > 50) {
        const durationSec = Math.max((now - startTime) / 1000, 0.001);
        const rate = Math.round(currentNonce / durationSec);

        setNonce(currentNonce);
        setTotalTries(currentNonce);
        setCurrentHash(calculateHash(data, currentNonce));
        setElapsedTime(`${durationSec.toFixed(3)}s`);
        setHashRate(rate.toLocaleString(locale));
        lastRenderTime = now;
      }

      if (miningRef.current) {
        requestAnimationFrame(mineBatch);
      }
    };

    requestAnimationFrame(mineBatch);
  };

  const handleReset = () => {
    miningRef.current = false;
    setIsMining(false);
    setMinedSuccess(false);
    setNonce(0);
    setTotalTries(0);
    setElapsedTime('0.000s');
    setHashRate('0.000');
    setCurrentHash(calculateHash(data, 0));
  };

  const isHashValid = currentHash.startsWith(targetPrefix);

  return (
    <div className="space-y-6 pt-2">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
          {pg.badge || 'PROOF OF WORK'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {pg.title || 'Mining Simulator'}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          {pg.subtitle || 'Enter block data and click "Mine" to watch the nonce discovery process in real time'}
        </p>
      </div>

      {/* Control Card */}
      <SpotlightCard
        spotlightColor="rgba(99, 102, 241, 0.16)"
        className="glass-card p-6 sm:p-7 space-y-5 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Data input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {pg.block_data_label || 'BLOCK DATA'}
            </label>
            <input
              type="text"
              value={data}
              onChange={(e) => {
                setData(e.target.value);
                setMinedSuccess(false);
              }}
              placeholder={pg.block_data_placeholder || 'Enter block content...'}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {pg.difficulty_label || 'DIFFICULTY:'} {difficulty}
              </label>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                {pg.difficulty_range || '(Difficulty 1 - 4)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-xs sm:text-sm font-mono flex items-center gap-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono tracking-wider">
                  {targetPrefix}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {(pg.hash_prefix_hint || 'hash must start with {d} zeros').replace('{d}', String(difficulty))}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDifficulty(d);
                      setMinedSuccess(false);
                    }}
                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                      difficulty === d
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleStartMining}
            className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 flex items-center gap-2 text-xs sm:text-sm transition-all"
          >
            {isMining ? (
              <>
                <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
                <span>{pg.btn_stop || 'Stop Mining...'}</span>
              </>
            ) : (
              <>
                <Pickaxe className="w-4 h-4" />
                <span>{pg.btn_mine || 'Mine Block'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="px-5 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{pg.btn_reset || 'Reset'}</span>
          </button>
        </div>
      </SpotlightCard>

      {/* Live Mining Card */}
      <SpotlightCard
        spotlightColor="rgba(168, 85, 247, 0.16)"
        className="glass-card p-6 sm:p-8 space-y-6 text-center shadow-xl"
      >
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {pg.nonce_label || 'NONCE (ATTEMPTS)'}
          </div>
          <div className="text-5xl sm:text-6xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight font-sans">
            {nonce.toLocaleString(locale)}
          </div>
          {minedSuccess ? (
            <div className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-1.5 pt-1">
              <CheckCircle className="w-4 h-4 text-cyan-500" />
              <span>{(pg.found_msg || 'Valid hash found after {n} attempts!').replace('{n}', totalTries.toLocaleString(locale))}</span>
            </div>
          ) : isMining ? (
            <div className="text-xs sm:text-sm font-bold text-amber-500 flex items-center justify-center gap-1.5 pt-1">
              <Flame className="w-4 h-4 animate-spin" />
              <span>{pg.mining_msg || 'Computing nonce and SHA-256 hash...'}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400 pt-1">
              {pg.ready_msg || 'Ready to mine'}
            </div>
          )}
        </div>

        {/* Current Hash */}
        <div className="space-y-1.5 text-left max-w-2xl mx-auto">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {pg.current_hash_label || 'CURRENT HASH'}
          </div>
          <div className="p-4 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 font-mono text-xs sm:text-sm break-all">
            {currentHash ? (
              <>
                <span className={`font-bold ${isHashValid ? 'text-cyan-500 bg-cyan-500/20 px-1 py-0.5 rounded' : 'text-slate-400'}`}>
                  {currentHash.slice(0, difficulty)}
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  {currentHash.slice(difficulty)}
                </span>
              </>
            ) : (
              <span className="text-slate-400">---</span>
            )}
          </div>
          <div className="text-[11px] text-slate-400">
            {pg.target_hint || 'Target: hash must start with'} <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{targetPrefix}</strong>
          </div>
        </div>

        {/* 4 Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
            <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">{elapsedTime}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{pg.stat_time || 'ELAPSED'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
            <div className="text-xl sm:text-2xl font-bold text-amber-500">{hashRate}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{pg.stat_hashrate || 'HASHES/SEC'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
            <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalTries.toLocaleString(locale)}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{pg.stat_tries || 'ATTEMPTS'}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
            <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{difficulty}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{pg.stat_difficulty || 'DIFFICULTY'}</div>
          </div>
        </div>
      </SpotlightCard>

      {/* Principle Card */}
      <SpotlightCard
        spotlightColor="rgba(59, 130, 246, 0.16)"
        className="glass-card p-6 sm:p-7 space-y-2 border-l-4 border-l-indigo-600 shadow-lg"
      >
        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
          {pg.principle_badge || 'HOW IT WORKS'}
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {pg.principle_desc || 'Miners try millions of different nonce values until they find a hash beginning with the required number of zeros. This is the Proof of Work mechanism.'}
        </p>
      </SpotlightCard>
    </div>
  );
}
