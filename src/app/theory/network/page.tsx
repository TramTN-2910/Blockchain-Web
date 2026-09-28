'use client';

import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Network, Globe, Radio, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TheoryNetworkPage() {
  const { language } = useLanguageStore();

  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Network className="w-4 h-4" />
          <span>{language === 'vi' ? 'Lý Thuyết Cốt Lõi • Phần 8' : 'Core Theory • Part 8'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'vi' ? 'Mạng Ngang Hàng P2P & Lan Truyền Dữ Liệu' : 'Peer-to-Peer (P2P) Networks & Gossip'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'Mạng lưới Blockchain vận hành trên kiến trúc mạng ngang hàng P2P Mesh, nơi mỗi Node máy tính vừa là máy khách (Client) vừa là máy chủ (Server), liên tục trao đổi dữ liệu qua giao thức tin đồn (Gossip Protocol).'
            : 'Blockchain runs on a peer-to-peer mesh architecture where each node acts as both client and server, continuously relaying blocks and transactions via gossip protocols.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Radio className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Giao Thức Gossip' : 'Gossip Protocol'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Khi 1 Node nhận giao dịch mới, nó xác minh và phát tán ngay cho các Node hàng xóm. Thông tin lan truyền cấp số nhân khắp toàn cầu chỉ trong vài giây.'
              : 'When a node validates a new transaction, it immediately propagates it to adjacent peers, flooding the global network exponentially within seconds.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Độ Trễ Mạng (Latency)' : 'Propagation Latency'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Khoảng cách địa lý tạo ra độ trễ lan truyền. Mạng lưới cần cơ chế đồng thuận để giải quyết việc các node nhận dữ liệu ở các thời điểm khác nhau.'
              : 'Physical distance introduces propagation delays. Consensus algorithms mathematically resolve temporal discrepancies across asynchronous nodes.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <RefreshCw className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">
            {language === 'vi' ? 'Đồng Bộ Sổ Cái (Sync)' : 'Ledger State Sync'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'vi'
              ? 'Các Node mới gia nhập sẽ tải toàn bộ lịch sử khối từ các Peer lân cận để tự kiểm chứng và đồng bộ trạng thái sổ cái mới nhất.'
              : 'Newly joined nodes download complete block history from neighboring peers to independently verify and sync the canonical ledger.'}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Link href="/theory/consensus" className="text-xs font-semibold text-slate-400 hover:text-white">
          {language === 'vi' ? '← Quay lại Đồng thuận' : '← Back to Consensus'}
        </Link>
        <Link
          href="/crypto-lab/wallet"
          prefetch={true}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all"
        >
          <span>{language === 'vi' ? 'Vào Phòng TN Mật Mã' : 'Enter Crypto Lab'}</span>
        </Link>
      </div>
    </div>
  );
}
