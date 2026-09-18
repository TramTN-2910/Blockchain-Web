'use client';

import React, { useState } from 'react';
import { sha256 } from 'js-sha256';
import { Plus, RotateCcw, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Pickaxe } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface Block {
  id: number;
  label: string;
  timestamp: string;
  data: string;
  nonce: number;
  previousHash: string;
  hash: string;
  isGenesis?: boolean;
  isTampered?: boolean;
}

export default function MiningExplorerPage() {
  const { t } = useTranslation();
  const pg = (t as any).mining_explorer || {};

  const difficulty = 3;
  const targetPrefix = '0'.repeat(difficulty);

  const mineBlockData = (id: number, data: string, prevHash: string, timestamp: string): { nonce: number; hash: string } => {
    let testNonce = 0;
    while (testNonce < 100000) {
      const h = sha256(`block:${id}:${timestamp}:${data}:${prevHash}:${testNonce}`);
      if (h.startsWith(targetPrefix)) {
        return { nonce: testNonce, hash: h };
      }
      testNonce++;
    }
    const fallbackHash = sha256(`block:${id}:${timestamp}:${data}:${prevHash}:0`);
    return { nonce: 0, hash: fallbackHash };
  };

  const initialGenesisHash = '8972524828e19bf1841a54522a9477e77b102ef75e34747124976fae69e46a78';
  const initialBlock1 = mineBlockData(1, 'Block #1', initialGenesisHash, '12:05:07');

  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: 0,
      label: pg.block_genesis_label || 'GENESIS BLOCK',
      timestamp: '12:05:06',
      data: 'Genesis Block - HubBlock...',
      nonce: 0,
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      hash: initialGenesisHash,
      isGenesis: true,
      isTampered: false,
    },
    {
      id: 1,
      label: `${pg.block_label_prefix || 'BLOCK #'}1`,
      timestamp: '12:05:07',
      data: 'Block #1',
      nonce: initialBlock1.nonce,
      previousHash: initialGenesisHash,
      hash: initialBlock1.hash,
      isGenesis: false,
      isTampered: false,
    },
  ]);

  const [activeTamperBlockId, setActiveTamperBlockId] = useState<number | null>(null);
  const [tamperInput, setTamperInput] = useState('123');

  const checkChainValidity = () => {
    for (let i = 0; i < blocks.length; i++) {
      const current = blocks[i];
      if (current.isGenesis) continue;
      const prev = blocks[i - 1];
      if (current.previousHash !== prev.hash) return false;
      if (!current.hash.startsWith(targetPrefix)) return false;
      if (current.isTampered) return false;
    }
    return true;
  };

  const isChainValid = checkChainValidity();

  const handleAddBlock = () => {
    const prevBlock = blocks[blocks.length - 1];
    const newId = prevBlock.id + 1;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const blockData = `Block #${newId}`;

    const mined = mineBlockData(newId, blockData, prevBlock.hash, timeStr);

    const newBlock: Block = {
      id: newId,
      label: `${pg.block_label_prefix || 'BLOCK #'}${newId}`,
      timestamp: timeStr,
      data: blockData,
      nonce: mined.nonce,
      previousHash: prevBlock.hash,
      hash: mined.hash,
      isGenesis: false,
      isTampered: false,
    };

    setBlocks([...blocks, newBlock]);
  };

  const handleResetChain = () => {
    const b1 = mineBlockData(1, 'Block #1', initialGenesisHash, '12:05:07');
    setBlocks([
      {
        id: 0,
        label: pg.block_genesis_label || 'GENESIS BLOCK',
        timestamp: '12:05:06',
        data: 'Genesis Block - HubBlock...',
        nonce: 0,
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        hash: initialGenesisHash,
        isGenesis: true,
        isTampered: false,
      },
      {
        id: 1,
        label: `${pg.block_label_prefix || 'BLOCK #'}1`,
        timestamp: '12:05:07',
        data: 'Block #1',
        nonce: b1.nonce,
        previousHash: initialGenesisHash,
        hash: b1.hash,
        isGenesis: false,
        isTampered: false,
      },
    ]);
    setActiveTamperBlockId(null);
  };

  const handleExecuteTamper = () => {
    if (activeTamperBlockId === null) return;

    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id === activeTamperBlockId) {
          const newHash = sha256(`block:${block.id}:${block.timestamp}:${tamperInput}:${block.previousHash}:${block.nonce}`);
          return { ...block, data: tamperInput, hash: newHash, isTampered: true };
        }
        return block;
      })
    );
  };

  const handleReMineBlock = (blockId: number) => {
    setBlocks((prev) => {
      const updated = [...prev];
      const targetIndex = updated.findIndex((b) => b.id === blockId);
      if (targetIndex === -1) return prev;

      const targetBlock = updated[targetIndex];
      const prevHash = targetIndex > 0 ? updated[targetIndex - 1].hash : targetBlock.previousHash;
      const mined = mineBlockData(targetBlock.id, targetBlock.data, prevHash, targetBlock.timestamp);

      updated[targetIndex] = {
        ...targetBlock,
        previousHash: prevHash,
        nonce: mined.nonce,
        hash: mined.hash,
        isTampered: false,
      };

      for (let i = targetIndex + 1; i < updated.length; i++) {
        updated[i].previousHash = updated[i - 1].hash;
      }

      return updated;
    });

    if (activeTamperBlockId === blockId) {
      setActiveTamperBlockId(null);
    }
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
          {pg.badge || 'CHAIN STATUS'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {pg.title || 'Blockchain Explorer'}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          {pg.subtitle || 'Explore the blockchain — add new blocks, try tampering, and restore the chain'}
        </p>
      </div>

      {/* Actions & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAddBlock}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 text-xs sm:text-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{pg.btn_add_block || 'Add Block'}</span>
          </button>

          <button
            onClick={handleResetChain}
            className="px-4 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{pg.btn_reset || 'Reset Chain'}</span>
          </button>
        </div>

        {/* Chain Status Pill */}
        <div
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all ${
            isChainValid
              ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30'
              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 animate-pulse'
          }`}
        >
          {isChainValid ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-cyan-500" />
              <span>{pg.chain_valid || 'Chain is valid — all hashes match'}</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>{pg.chain_invalid || 'Chain is invalid — hash linkage broken'}</span>
            </>
          )}
        </div>
      </div>

      {/* Horizontal Connected Blocks Flow */}
      <div className="overflow-x-auto pb-4 pt-2">
        <div className="flex items-center gap-4 min-w-max">
          {blocks.map((block, index) => {
            const isBlockValid =
              block.isGenesis ||
              (block.hash.startsWith(targetPrefix) &&
                !block.isTampered &&
                block.previousHash === blocks[index - 1]?.hash);

            return (
              <React.Fragment key={block.id}>
                <SpotlightCard
                  spotlightColor={
                    !isBlockValid
                      ? 'rgba(244, 63, 94, 0.2)'
                      : block.isGenesis
                      ? 'rgba(168, 85, 247, 0.18)'
                      : 'rgba(6, 182, 212, 0.18)'
                  }
                  className={`w-72 sm:w-80 rounded-2xl p-5 space-y-4 border-2 transition-all glass-card ${
                    isBlockValid
                      ? block.isGenesis
                        ? 'border-purple-300 dark:border-purple-800/80 shadow-purple-500/5'
                        : 'border-cyan-400 dark:border-cyan-700 shadow-cyan-500/5'
                      : 'border-rose-500 bg-rose-500/5 shadow-lg shadow-rose-500/10'
                  }`}
                >
                  {/* Block Header */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        block.isGenesis
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                          : isBlockValid
                          ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30'
                          : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      <span>{block.label}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isBlockValid ? 'bg-cyan-500' : 'bg-rose-500'}`}></span>
                    </div>

                    {!isBlockValid && (
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                        {pg.hash_error || 'HASH ERROR'}
                      </span>
                    )}
                  </div>

                  {/* Block Properties */}
                  <div className="space-y-2.5 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase font-sans">{pg.field_time || 'TIMESTAMP'}</div>
                      <div className="p-2 rounded-lg bg-slate-100/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 truncate">{block.timestamp}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase font-sans">{pg.field_data || 'DATA'}</div>
                      <div className="p-2 rounded-lg bg-slate-100/70 dark:bg-slate-900/70 text-slate-800 dark:text-slate-200 font-semibold truncate">{block.data}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase font-sans">NONCE</div>
                      <div className={`p-2 rounded-lg text-slate-800 dark:text-slate-200 font-bold ${isBlockValid ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-slate-100/70 dark:bg-slate-900/70'}`}>{block.nonce}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase font-sans">{pg.field_hash || 'HASH'}</div>
                      <div className={`p-2 rounded-lg truncate ${isBlockValid ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold'}`}>{block.hash.slice(0, 14)}...</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase font-sans">{pg.field_prev_hash || 'PREV HASH'}</div>
                      <div className="p-2 rounded-lg bg-slate-100/70 dark:bg-slate-900/70 text-slate-400 truncate">{block.previousHash.slice(0, 14)}...</div>
                    </div>
                  </div>

                  {/* Actions */}
                  {!block.isGenesis && (
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveTamperBlockId(block.id);
                          setTamperInput(block.data);
                        }}
                        className="w-full py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all text-center"
                      >
                        {pg.btn_tamper || 'TAMPER'}
                      </button>

                      {!isBlockValid && (
                        <button
                          onClick={() => handleReMineBlock(block.id)}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center gap-1 transition-all flex-shrink-0"
                        >
                          <Pickaxe className="w-3.5 h-3.5" />
                          <span>{pg.btn_remine || 'Re-mine'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </SpotlightCard>

                {/* Arrow Connector */}
                {index < blocks.length - 1 && (
                  <div className="flex items-center text-cyan-500 dark:text-cyan-400">
                    <ArrowRight className="w-6 h-6 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Tamper Control Panel */}
      {activeTamperBlockId !== null && (
        <SpotlightCard
          spotlightColor="rgba(244, 63, 94, 0.2)"
          className="glass-card p-6 sm:p-7 space-y-4 border-l-4 border-l-rose-500 shadow-xl"
        >
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span>{(pg.tamper_title || 'Tamper Block #')}{activeTamperBlockId}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {pg.tamper_subtitle || 'Enter new data — the hash will no longer match → the blockchain becomes invalid'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={tamperInput}
              onChange={(e) => setTamperInput(e.target.value)}
              placeholder={pg.tamper_placeholder || 'Enter tampered data...'}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExecuteTamper}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-500/25 text-xs whitespace-nowrap transition-all"
              >
                {pg.btn_execute_tamper || 'TAMPER'}
              </button>
              <button
                onClick={() => setActiveTamperBlockId(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs whitespace-nowrap transition-all"
              >
                {pg.btn_cancel || 'Cancel'}
              </button>
            </div>
          </div>
        </SpotlightCard>
      )}
    </div>
  );
}
