import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Wallet, Transaction, NetworkNode, LifecycleBlock, Validator } from '@/types/lifecycle';
import {
  generateWalletFromSeed,
  computeTxHash,
  signTransaction as cryptoSignTx,
  verifySignature,
  computeMerkleTree,
  computeBlockHash,
  runPoSSelection
} from '@/lib/crypto/lifecycleCrypto';

interface LifecycleState {
  journeyStep: number;
  wallets: Wallet[];
  activeWalletId: string;
  transactions: Transaction[];
  mempool: Transaction[];
  nodes: NetworkNode[];
  networkLatencyMs: number;
  blockchain: LifecycleBlock[];
  validators: Validator[];
  lastPoSResult: {
    winner?: Validator;
    winningTicket?: number;
    totalStake?: number;
    probabilities?: { id: string; name: string; percentage: number }[];
  } | null;

  // Actions
  setJourneyStep: (step: number) => void;
  createWallet: (name?: string, seedPhrase?: string) => Wallet;
  faucetAirdrop: (walletId: string, amount?: number) => void;
  setActiveWallet: (walletId: string) => void;
  removeWallet: (walletId: string) => void;
  
  createDraftTransaction: (params: { from: string; to: string; amount: number; gasFee: number; data?: string }) => Transaction;
  signDraftTransaction: (txId: string) => boolean;
  tamperDraftTransaction: (txId: string, alteredAmount: number) => Transaction | null;
  broadcastToMempool: (txId: string) => { success: boolean; reason?: string };
  clearMempool: () => void;

  toggleNodeStatus: (nodeId: string) => void;
  toggleNodeConnection: (sourceId: string, targetId: string) => void;
  setNetworkLatency: (latencyMs: number) => void;
  simulateBroadcastToNodes: (txId: string) => void;

  createBlockFromMempool: (selectedTxIds?: string[], proposerName?: string) => LifecycleBlock;
  linkBlockHandshake: (blockIndex: number) => void;
  tamperBlockData: (blockIndex: number, alteredTxIndex: number, alteredAmount: number) => void;
  reMineBlockchain: () => void;
  resetAllLifecycleData: () => void;

  updateValidatorStake: (validatorId: string, newStake: number) => void;
  runPoSProcess: () => Validator | null;
  slashValidator: (validatorId: string) => void;
}

// Dữ liệu mẫu ban đầu (Genesis seed data)
const defaultAlice = generateWalletFromSeed('apple banana cherry dragon eagle falcon garden hammer island jungle kangaroo lemon', 'Alice (Cá nhân)');
const defaultBob = generateWalletFromSeed('monkey noodle orange pilot queen rocket silver tiger uncle violin winter yellow', 'Bob (Cửa hàng)');
const defaultCharlie = generateWalletFromSeed('abandon ability able about above absent absorb abstract absurd abuse access accident', 'Charlie (Thương nhân)');

const initialWallets: Wallet[] = [
  { ...defaultAlice, id: 'wallet_alice', balance: 100, createdAt: Date.now() - 3600000 },
  { ...defaultBob, id: 'wallet_bob', balance: 50, createdAt: Date.now() - 3000000 },
  { ...defaultCharlie, id: 'wallet_charlie', balance: 25, createdAt: Date.now() - 2000000 }
];

const initialNodes: NetworkNode[] = [
  { id: 'node_hanoi', name: 'Node Hà Nội', location: 'Việt Nam', status: 'online', connectedNodeIds: ['node_hcm', 'node_tokyo'], latencyMs: 25, receivedTxIds: [] },
  { id: 'node_hcm', name: 'Node TP.HCM', location: 'Việt Nam', status: 'online', connectedNodeIds: ['node_hanoi', 'node_singapore'], latencyMs: 15, receivedTxIds: [] },
  { id: 'node_singapore', name: 'Node Singapore', location: 'Đông Nam Á', status: 'online', connectedNodeIds: ['node_hcm', 'node_tokyo', 'node_frankfurt'], latencyMs: 45, receivedTxIds: [] },
  { id: 'node_tokyo', name: 'Node Tokyo', location: 'Nhật Bản', status: 'online', connectedNodeIds: ['node_hanoi', 'node_singapore', 'node_sf'], latencyMs: 80, receivedTxIds: [] },
  { id: 'node_frankfurt', name: 'Node Frankfurt', location: 'Đức', status: 'online', connectedNodeIds: ['node_singapore', 'node_sf'], latencyMs: 160, receivedTxIds: [] },
  { id: 'node_sf', name: 'Node San Francisco', location: 'Mỹ', status: 'online', connectedNodeIds: ['node_tokyo', 'node_frankfurt'], latencyMs: 190, receivedTxIds: [] }
];

const initialValidators: Validator[] = [
  { id: 'val_alpha', name: 'Validator Alpha (Node 1)', address: initialWallets[0].address, stakeAmount: 500, status: 'active', blocksProduced: 12, totalRewards: 24, color: '#38bdf8' },
  { id: 'val_beta', name: 'Validator Beta (Node 2)', address: initialWallets[1].address, stakeAmount: 300, status: 'active', blocksProduced: 7, totalRewards: 14, color: '#a855f7' },
  { id: 'val_gamma', name: 'Validator Gamma (Node 3)', address: initialWallets[2].address, stakeAmount: 150, status: 'active', blocksProduced: 3, totalRewards: 6, color: '#22c55e' },
  { id: 'val_delta', name: 'Validator Delta (Node 4)', address: '0x9999888877776666555544443333222211110000', stakeAmount: 50, status: 'active', blocksProduced: 1, totalRewards: 2, color: '#f59e0b' }
];

// Khởi tạo Genesis Block và Khối 1 mẫu
const genesisHeader = {
  version: '1.0.0',
  index: 0,
  previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
  merkleRoot: '0000genesismerkle00000000000000000000000000000000000000000000000000',
  timestamp: 1700000000000,
  difficulty: 2,
  nonce: 1042
};
const genesisHash = computeBlockHash(genesisHeader);
const genesisBlock: LifecycleBlock = {
  index: 0,
  header: genesisHeader,
  coinbase: { to: initialWallets[0].address, reward: 50, gasTotal: 0 },
  transactions: [],
  hash: genesisHash,
  isValid: true,
  proposer: 'Satoshi (Genesis)'
};

const block1Txs: Transaction[] = [
  {
    id: computeTxHash({ from: initialWallets[0].address, to: initialWallets[1].address, amount: 20, gasFee: 2, nonce: 1, timestamp: 1700000050000, data: 'Genesis Airdrop' }),
    from: initialWallets[0].address,
    to: initialWallets[1].address,
    amount: 20,
    gasFee: 2,
    nonce: 1,
    timestamp: 1700000050000,
    data: 'Genesis Airdrop',
    status: 'confirmed',
    signature: cryptoSignTx(computeTxHash({ from: initialWallets[0].address, to: initialWallets[1].address, amount: 20, gasFee: 2, nonce: 1, timestamp: 1700000050000, data: 'Genesis Airdrop' }), initialWallets[0].privateKey)
  }
];
const merkle1 = computeMerkleTree(block1Txs);
const header1 = {
  version: '1.0.0',
  index: 1,
  previousHash: genesisHash,
  merkleRoot: merkle1.root,
  timestamp: 1700000100000,
  difficulty: 2,
  nonce: 19482
};
const hash1 = computeBlockHash(header1);
const initialBlock1: LifecycleBlock = {
  index: 1,
  header: header1,
  coinbase: { to: initialWallets[0].address, reward: 2, gasTotal: 2 },
  transactions: block1Txs,
  hash: hash1,
  isValid: true,
  proposer: 'Validator Alpha'
};

export const useBlockchainLifecycleStore = create<LifecycleState>()(
  persist(
    (set, get) => ({
      journeyStep: 0,
      wallets: initialWallets,
      activeWalletId: initialWallets[0].id,
      transactions: block1Txs,
      mempool: [],
      nodes: initialNodes,
      networkLatencyMs: 45,
      blockchain: [genesisBlock, initialBlock1],
      validators: initialValidators,
      lastPoSResult: null,

      setJourneyStep: (step) => set({ journeyStep: step }),

      createWallet: (name, seedPhrase) => {
        const walletName = name || `Ví #${get().wallets.length + 1}`;
        const newWalletData = generateWalletFromSeed(seedPhrase, walletName);
        const newWallet: Wallet = {
          ...newWalletData,
          id: `wallet_${Date.now()}`,
          createdAt: Date.now()
        };
        set((state) => ({
          wallets: [newWallet, ...state.wallets],
          activeWalletId: newWallet.id
        }));
        return newWallet;
      },

      faucetAirdrop: (walletId, amount = 100) => {
        set((state) => ({
          wallets: state.wallets.map((w) =>
            w.id === walletId ? { ...w, balance: w.balance + amount } : w
          )
        }));
      },

      setActiveWallet: (walletId) => set({ activeWalletId: walletId }),

      removeWallet: (walletId) => {
        set((state) => {
          const remaining = state.wallets.filter((w) => w.id !== walletId);
          return {
            wallets: remaining,
            activeWalletId: state.activeWalletId === walletId ? (remaining[0]?.id || '') : state.activeWalletId
          };
        });
      },

      createDraftTransaction: ({ from, to, amount, gasFee, data = '' }) => {
        const state = get();
        const senderWallet = state.wallets.find((w) => w.address.toLowerCase() === from.toLowerCase());
        const senderNonce = state.transactions.filter((tx) => tx.from.toLowerCase() === from.toLowerCase()).length + 1;
        const timestamp = Date.now();
        const txHash = computeTxHash({ from, to, amount, gasFee, nonce: senderNonce, timestamp, data });

        const newTx: Transaction = {
          id: txHash,
          from,
          to,
          amount,
          gasFee,
          nonce: senderNonce,
          timestamp,
          data,
          status: 'draft'
        };

        set((s) => ({
          transactions: [newTx, ...s.transactions]
        }));
        return newTx;
      },

      signDraftTransaction: (txId) => {
        const state = get();
        const tx = state.transactions.find((t) => t.id === txId);
        if (!tx) return false;

        const senderWallet = state.wallets.find((w) => w.address.toLowerCase() === tx.from.toLowerCase());
        if (!senderWallet) return false;

        const sig = cryptoSignTx(tx.id, senderWallet.privateKey);
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === txId ? { ...t, signature: sig, status: 'signed' } : t
          )
        }));
        return true;
      },

      tamperDraftTransaction: (txId, alteredAmount) => {
        const state = get();
        const tx = state.transactions.find((t) => t.id === txId);
        if (!tx) return null;

        const newHash = computeTxHash({
          from: tx.from,
          to: tx.to,
          amount: alteredAmount,
          gasFee: tx.gasFee,
          nonce: tx.nonce,
          timestamp: tx.timestamp,
          data: tx.data
        });

        // Giữ lại signature cũ nhưng id (hash mới) đã thay đổi -> Dẫn đến mismatch chữ ký
        const tamperedTx: Transaction = {
          ...tx,
          id: newHash,
          amount: alteredAmount,
          status: 'draft'
        };

        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === txId ? tamperedTx : t))
        }));

        return tamperedTx;
      },

      broadcastToMempool: (txId) => {
        const state = get();
        const tx = state.transactions.find((t) => t.id === txId);
        if (!tx) return { success: false, reason: 'TX_NOT_FOUND' };
        if (!tx.signature) return { success: false, reason: 'NO_SIGNATURE' };

        const senderWallet = state.wallets.find((w) => w.address.toLowerCase() === tx.from.toLowerCase());
        if (!senderWallet) return { success: false, reason: 'SENDER_NOT_FOUND' };

        // Kiểm tra tính hợp lệ của chữ ký số ECDSA (tx.id vs signature)
        const isValidSig = verifySignature(tx.id, tx.signature, senderWallet.privateKey);

        if (!isValidSig) {
          // Đánh dấu giao dịch bị từ chối
          set((s) => ({
            transactions: s.transactions.map((t) => (t.id === txId ? { ...t, status: 'rejected' } : t))
          }));
          return { success: false, reason: 'INVALID_SIGNATURE' };
        }

        // Kiểm tra số dư ví gửi
        if (senderWallet.balance < tx.amount + tx.gasFee) {
          set((s) => ({
            transactions: s.transactions.map((t) => (t.id === txId ? { ...t, status: 'rejected' } : t))
          }));
          return { success: false, reason: 'INSUFFICIENT_BALANCE' };
        }

        // Giao dịch hợp lệ: trừ tạm số dư và đưa vào Mempool
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === txId ? { ...t, status: 'pending' } : t)),
          mempool: [tx, ...s.mempool.filter((m) => m.id !== txId)],
          wallets: s.wallets.map((w) =>
            w.address.toLowerCase() === tx.from.toLowerCase()
              ? { ...w, balance: Math.max(0, w.balance - (tx.amount + tx.gasFee)) }
              : w
          )
        }));

        return { success: true };
      },

      clearMempool: () => set({ mempool: [] }),

      toggleNodeStatus: (nodeId) => {
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === nodeId ? { ...n, status: n.status === 'online' ? 'offline' : 'online' } : n
          )
        }));
      },

      toggleNodeConnection: (sourceId, targetId) => {
        set((s) => ({
          nodes: s.nodes.map((n) => {
            if (n.id === sourceId) {
              const isConnected = n.connectedNodeIds.includes(targetId);
              return {
                ...n,
                connectedNodeIds: isConnected
                  ? n.connectedNodeIds.filter((id) => id !== targetId)
                  : [...n.connectedNodeIds, targetId]
              };
            }
            if (n.id === targetId) {
              const isConnected = n.connectedNodeIds.includes(sourceId);
              return {
                ...n,
                connectedNodeIds: isConnected
                  ? n.connectedNodeIds.filter((id) => id !== sourceId)
                  : [...n.connectedNodeIds, sourceId]
              };
            }
            return n;
          })
        }));
      },

      setNetworkLatency: (latencyMs) => set({ networkLatencyMs: latencyMs }),

      simulateBroadcastToNodes: (txId) => {
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.status === 'online' ? { ...n, receivedTxIds: [...new Set([...n.receivedTxIds, txId])] } : n
          )
        }));
      },

      createBlockFromMempool: (selectedTxIds, proposerName = 'Validator Alpha') => {
        const state = get();
        const txsToInclude = selectedTxIds && selectedTxIds.length > 0
          ? state.mempool.filter((tx) => selectedTxIds.includes(tx.id))
          : state.mempool.slice(0, 5); // Tự động lấy tối đa 5 Tx

        const prevBlock = state.blockchain[state.blockchain.length - 1] || genesisBlock;
        const merkle = computeMerkleTree(txsToInclude);
        const totalGas = txsToInclude.reduce((sum, t) => sum + t.gasFee, 0);

        const newHeader = {
          version: '1.0.0',
          index: state.blockchain.length,
          previousHash: prevBlock.hash,
          merkleRoot: merkle.root,
          timestamp: Date.now(),
          difficulty: 2,
          nonce: Math.floor(Math.random() * 50000)
        };

        const newHash = computeBlockHash(newHeader);
        const newBlock: LifecycleBlock = {
          index: newHeader.index,
          header: newHeader,
          coinbase: { to: state.wallets[0]?.address || '0x0', reward: 2, gasTotal: totalGas },
          transactions: txsToInclude.map((t) => ({ ...t, status: 'confirmed' })),
          hash: newHash,
          isValid: true,
          proposer: proposerName
        };

        // Cập nhật số dư người nhận và xóa khỏi Mempool
        const updatedMempool = state.mempool.filter(
          (m) => !txsToInclude.some((inc) => inc.id === m.id)
        );

        set((s) => {
          const updatedWallets = [...s.wallets];
          txsToInclude.forEach((tx) => {
            const receiver = updatedWallets.find((w) => w.address.toLowerCase() === tx.to.toLowerCase());
            if (receiver) receiver.balance += tx.amount;
          });

          return {
            blockchain: [...s.blockchain, newBlock],
            mempool: updatedMempool,
            wallets: updatedWallets
          };
        });

        return newBlock;
      },

      linkBlockHandshake: (blockIndex) => {
        set((s) => {
          if (blockIndex <= 0 || blockIndex >= s.blockchain.length) return s;
          const chain = [...s.blockchain];
          const prevBlock = chain[blockIndex - 1];
          const currBlock = chain[blockIndex];

          const updatedHeader = { ...currBlock.header, previousHash: prevBlock.hash };
          const updatedHash = computeBlockHash(updatedHeader);

          chain[blockIndex] = {
            ...currBlock,
            header: updatedHeader,
            hash: updatedHash,
            isValid: true
          };

          return { blockchain: chain };
        });
      },

      tamperBlockData: (blockIndex, alteredTxIndex, alteredAmount) => {
        set((s) => {
          if (blockIndex < 0 || blockIndex >= s.blockchain.length) return s;
          const chain = [...s.blockchain];
          const targetBlock = { ...chain[blockIndex] };

          if (targetBlock.transactions[alteredTxIndex]) {
            targetBlock.transactions = targetBlock.transactions.map((tx, idx) =>
              idx === alteredTxIndex ? { ...tx, amount: alteredAmount } : tx
            );
          }

          // Tính lại Merkle Root và Hash mới cho Block bị sửa
          const newMerkle = computeMerkleTree(targetBlock.transactions);
          targetBlock.header = { ...targetBlock.header, merkleRoot: newMerkle.root };
          targetBlock.hash = computeBlockHash(targetBlock.header);
          targetBlock.isValid = false; // Đánh dấu khối bị sửa
          chain[blockIndex] = targetBlock;

          // Đánh dấu đỏ toàn bộ các khối phía sau (Broken Chain)
          for (let i = blockIndex + 1; i < chain.length; i++) {
            chain[i] = { ...chain[i], isValid: false };
          }

          return { blockchain: chain };
        });
      },

      reMineBlockchain: () => {
        set((s) => {
          const chain = [...s.blockchain];
          for (let i = 1; i < chain.length; i++) {
            const prev = chain[i - 1];
            const curr = { ...chain[i] };
            curr.header = {
              ...curr.header,
              previousHash: prev.hash,
              nonce: Math.floor(Math.random() * 90000)
            };
            curr.hash = computeBlockHash(curr.header);
            curr.isValid = true;
            chain[i] = curr;
          }
          return { blockchain: chain };
        });
      },

      resetAllLifecycleData: () => {
        set({
          journeyStep: 0,
          wallets: initialWallets,
          activeWalletId: initialWallets[0].id,
          transactions: block1Txs,
          mempool: [],
          nodes: initialNodes,
          networkLatencyMs: 45,
          blockchain: [genesisBlock, initialBlock1],
          validators: initialValidators,
          lastPoSResult: null
        });
      },

      updateValidatorStake: (validatorId, newStake) => {
        set((s) => ({
          validators: s.validators.map((v) =>
            v.id === validatorId ? { ...v, stakeAmount: Math.max(0, newStake) } : v
          )
        }));
      },

      runPoSProcess: () => {
        const state = get();
        try {
          const result = runPoSSelection(state.validators);
          set((s) => ({
            lastPoSResult: result,
            validators: s.validators.map((v) =>
              v.id === result.winner.id
                ? { ...v, blocksProduced: v.blocksProduced + 1, totalRewards: v.totalRewards + 2 }
                : v
            )
          }));
          return result.winner;
        } catch (e) {
          return null;
        }
      },

      slashValidator: (validatorId) => {
        set((s) => ({
          validators: s.validators.map((v) =>
            v.id === validatorId
              ? {
                  ...v,
                  status: 'slashed',
                  stakeAmount: Math.floor(v.stakeAmount * 0.8) // Phạt 20%
                }
              : v
          )
        }));
      }
    }),
    {
      name: 'hubblock-lifecycle-storage'
    }
  )
);
