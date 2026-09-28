'use client';

import React, { useState } from 'react';
import { useBlockchainLifecycleStore } from '@/store/useBlockchainLifecycleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { 
  GitBranch, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  ShieldAlert,
  SearchCheck,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function CheckChainIntegrityPage() {
  const { language } = useLanguageStore();
  const { blockchain, resetAllLifecycleData } = useBlockchainLifecycleStore();

  const [auditedLogs, setAuditedLogs] = useState<Array<{ blockIndex: number; valid: boolean; reason: string }>>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  const runAudit = () => {
    setIsAuditing(true);
    const logs: Array<{ blockIndex: number; valid: boolean; reason: string }> = [];

    for (let i = 0; i < blockchain.length; i++) {
      const block = blockchain[i];
      if (i === 0) {
        logs.push({
          blockIndex: 0,
          valid: true,
          reason: language === 'vi' ? 'Khối Genesis - Gốc tin cậy ban đầu' : 'Genesis Block - Initial trust root'
        });
      } else {
        const prevBlock = blockchain[i - 1];
        const hashMatch = block.header.previousHash === prevBlock.hash;
        const blockValid = block.isValid && hashMatch;

        if (blockValid) {
          logs.push({
            blockIndex: i,
            valid: true,
            reason: language === 'vi'
              ? `PreviousHash khớp với Hash Khối #${i - 1}`
              : `PreviousHash matches Block #${i - 1} Hash`
          });
        } else {
          logs.push({
            blockIndex: i,
            valid: false,
            reason: language === 'vi'
              ? `LỆCH LIÊN KẾT: PreviousHash (${block.header.previousHash.slice(0, 12)}...) != Hash Khối #${i - 1} (${prevBlock.hash.slice(0, 12)}...)`
              : `BROKEN LINK: PreviousHash mismatch with Block #${i - 1}`
          });
        }
      }
    }

    setTimeout(() => {
      setAuditedLogs(logs);
      setIsAuditing(false);
    }, 400);
  };

  const isWholeChainValid = blockchain.every((b) => b.isValid);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-rose-950/40 to-slate-900 border border-red-800/40">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-[11px] font-extrabold text-rose-300 whitespace-nowrap tracking-wider shrink-0">
              ATK 4
            </span>
            <span>
              {language === 'vi' ? 'Mô Phỏng Tấn Công • Kiểm Tra Chuỗi' : 'Attack Sim • Check Chain Cascade'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {language === 'vi' ? 'Kiểm Tra Toàn Vẹn Liên Kết Chuỗi (Cascade Validation)' : 'Chain Linkage Cascade Validator'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {language === 'vi'
              ? 'Kiểm toán tính liên kết mắt xích của chuỗi. Khi một khối bị sửa, toàn bộ các khối phía sau sẽ vỡ liên kết.'
              : 'Audit cryptographic block links. Tampering with one block instantly breaks all subsequent blocks.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetAllLifecycleData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'vi' ? 'Khôi Phục Chuỗi' : 'Reset Chain'}
          </button>
          <Link
            href="/attack-sim/reset"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 text-xs font-bold transition-all"
          >
            <span>{language === 'vi' ? 'Đào Lại Chuỗi' : 'Re-mine & Reset'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Audit Action Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isWholeChainValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400 animate-bounce'
          }`}>
            {isWholeChainValid ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-base font-bold text-white">
              {isWholeChainValid
                ? (language === 'vi' ? 'Trạng Thái: Chuỗi Khối Toàn Vẹn' : 'Status: Chain Perfectly Valid')
                : (language === 'vi' ? 'CẢNH BÁO: Phát Hiện Chuỗi Bị Phá Vỡ (Broken Cascade)' : 'ALERT: Broken Chain Linkage Detected')}
            </div>
            <div className="text-xs text-slate-400">
              {language === 'vi'
                ? `Tổng ${blockchain.length} khối. Bấm Kiểm Toán Mạng để quét lỗi liên kết.`
                : `Total ${blockchain.length} blocks. Click Run Audit to inspect hash links.`}
            </div>
          </div>
        </div>

        <button
          onClick={runAudit}
          disabled={isAuditing}
          className="w-full md:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
        >
          <SearchCheck className="w-4 h-4" />
          {isAuditing
            ? (language === 'vi' ? 'Đang Kiểm Toán...' : 'Auditing...')
            : (language === 'vi' ? 'Chạy Kiểm Toán Chuỗi (Run Audit)' : 'Run Chain Audit')}
        </button>
      </div>

      {/* Chain Visual Diagram */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          {language === 'vi' ? 'Sơ Đồ Mắt Xích Liên Kết (Linkage Diagram)' : 'Linkage Cascade Diagram'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blockchain.map((block, idx) => {
            const isGenesis = block.index === 0;
            const prev = idx > 0 ? blockchain[idx - 1] : null;
            const isPrevHashMismatch = prev && block.header.previousHash !== prev.hash;

            return (
              <div
                key={block.index}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  block.isValid && !isPrevHashMismatch
                    ? 'border-emerald-500/50 bg-emerald-950/20 shadow-emerald-950/20'
                    : 'border-rose-500 bg-rose-950/30 shadow-rose-950/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-slate-800 text-white">
                    {isGenesis ? 'Genesis #0' : `Block #${block.index}`}
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-bold ${
                    block.isValid && !isPrevHashMismatch ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {block.isValid && !isPrevHashMismatch ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Valid Link
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 animate-spin" />
                        Broken Link
                      </>
                    )}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Block Hash:</div>
                    <div className="font-mono text-[11px] text-slate-200 truncate bg-slate-950 p-1.5 rounded border border-slate-800">
                      {block.hash}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Previous Hash:</div>
                    <div className={`font-mono text-[11px] truncate p-1.5 rounded border ${
                      isPrevHashMismatch
                        ? 'bg-rose-950/50 text-rose-300 border-rose-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}>
                      {block.header.previousHash}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] flex justify-between text-slate-400">
                    <span>{block.transactions.length} Txs</span>
                    <span>Proposer: {block.proposer}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Log Results */}
      {auditedLogs.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <SearchCheck className="w-4 h-4 text-indigo-400" />
            {language === 'vi' ? 'Kết Quả Kiểm Toán Chi Tiết' : 'Audit Log Details'}
          </h3>

          <div className="space-y-2">
            {auditedLogs.map((log) => (
              <div
                key={log.blockIndex}
                className={`p-3.5 rounded-2xl border text-xs flex items-center gap-3 ${
                  log.valid
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/50 border-rose-500/50 text-rose-200 font-bold'
                }`}
              >
                {log.valid ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <XCircle className="w-4 h-4 shrink-0 text-rose-400" />}
                <div>
                  <span className="font-mono uppercase font-bold mr-2">Block #{log.blockIndex}:</span>
                  <span>{log.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
