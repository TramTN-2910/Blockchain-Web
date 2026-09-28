import { sha256 } from 'js-sha256';
export { sha256 };
import { Transaction, TransactionSignature, MerkleStepNode, Validator } from '@/types/lifecycle';

// BIP-39 Wordlist (Top 128 words for compact & fast client-side demo)
const BIP39_WORDS = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
  'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
  'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
  'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
  'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
  'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
  'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic',
  'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest',
  'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset',
  'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
  'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake'
];

/**
 * Sinh chuỗi 12 từ Mnemonic ngẫu nhiên
 */
export function generateMnemonic(wordCount = 12): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * BIP39_WORDS.length);
    words.push(BIP39_WORDS[randomIndex]);
  }
  return words.join(' ');
}

/**
 * Sinh cặp khóa ECDSA (secp256k1) & Địa chỉ ví (0x...) từ chuỗi Seed hoặc ngẫu nhiên
 */
export function generateWalletFromSeed(seedPhrase?: string, customName = 'Ví Mới') {
  const seed = seedPhrase && seedPhrase.trim().length > 0 
    ? seedPhrase.trim() 
    : generateMnemonic(12);

  // Sinh Private Key 256-bit (64 hex characters) từ Seed
  const privateKey = sha256(seed + '_secp256k1_private_key_salt');

  // Sinh Public Key 512-bit (128 hex characters uncompressed: 04 + X + Y)
  const pubX = sha256(privateKey + '_curve_x');
  const pubY = sha256(privateKey + '_curve_y');
  const publicKey = `04${pubX}${pubY}`;

  // Sinh Địa chỉ ví 0x + 40 hex chars (Keccak/SHA256 rút gọn 20 bytes cuối)
  const addressHash = sha256(publicKey);
  const address = `0x${addressHash.slice(24, 64)}`;

  return {
    name: customName,
    seedPhrase: seed,
    privateKey: `0x${privateKey}`,
    publicKey: `0x${publicKey}`,
    address,
    balance: 100, // Khởi tạo Faucet 100 HUB
  };
}

/**
 * Băm dữ liệu giao dịch thành TxHash (TxID)
 */
export function computeTxHash(tx: {
  from: string;
  to: string;
  amount: number;
  gasFee: number;
  nonce: number;
  timestamp: number;
  data?: string;
}): string {
  const rawString = `${tx.from.toLowerCase()}:${tx.to.toLowerCase()}:${tx.amount}:${tx.gasFee}:${tx.nonce}:${tx.timestamp}:${tx.data || ''}`;
  return sha256(rawString);
}

/**
 * Ký số giao dịch bằng Private Key theo chuẩn ECDSA (r, s, v)
 */
export function signTransaction(txHash: string, privateKey: string): TransactionSignature {
  // Mô phỏng thuật toán ký số ECDSA secp256k1 deterministically
  const cleanPriv = privateKey.replace(/^0x/, '');
  const r = sha256(`${txHash}_r_${cleanPriv}`);
  const s = sha256(`${txHash}_s_${cleanPriv}`);
  const v = 27 + (parseInt(r.slice(-1), 16) % 2); // 27 hoặc 28 (Recovery ID chuẩn Ethereum)

  return { r: `0x${r}`, s: `0x${s}`, v };
}

/**
 * Xác thực chữ ký số giao dịch bằng Public Key hoặc Address của người gửi
 */
export function verifySignature(txHash: string, signature: TransactionSignature, expectedPrivateKey: string): boolean {
  if (!signature || !signature.r || !signature.s) return false;
  const expectedSig = signTransaction(txHash, expectedPrivateKey);
  return signature.r === expectedSig.r && signature.s === expectedSig.s;
}

/**
 * Tính toán Cây Merkle (Merkle Tree) nhị phân từ danh sách giao dịch
 */
export function computeMerkleTree(transactions: { id: string; from: string; to: string; amount: number }[]): {
  root: string;
  nodes: MerkleStepNode[];
  levels: MerkleStepNode[][];
} {
  if (!transactions || transactions.length === 0) {
    const emptyHash = sha256('empty_merkle_tree');
    return {
      root: emptyHash,
      nodes: [{ id: 'node_root', hash: emptyHash, label: 'Empty Root', level: 0 }],
      levels: [[{ id: 'node_root', hash: emptyHash, label: 'Empty Root', level: 0 }]]
    };
  }

  // Tầng lá (Leaves)
  let currentLevel: MerkleStepNode[] = transactions.map((tx, idx) => {
    const leafHash = tx.id ? tx.id : sha256(`${tx.from}:${tx.to}:${tx.amount}`);
    return {
      id: `leaf_${idx}`,
      hash: leafHash,
      label: `Tx#${idx + 1} (${tx.amount} HUB)`,
      level: 0
    };
  });

  const levels: MerkleStepNode[][] = [[...currentLevel]];
  let levelIndex = 1;

  while (currentLevel.length > 1) {
    const nextLevel: MerkleStepNode[] = [];

    // Nếu số lượng lá lẻ, nhân đôi nút cuối (Bitcoin protocol rule)
    const workingLevel = [...currentLevel];
    if (workingLevel.length % 2 !== 0) {
      const lastNode = workingLevel[workingLevel.length - 1];
      workingLevel.push({
        ...lastNode,
        id: `${lastNode.id}_dup`,
        label: `${lastNode.label} (Duplicate)`
      });
    }

    for (let i = 0; i < workingLevel.length; i += 2) {
      const left = workingLevel[i];
      const right = workingLevel[i + 1];
      const parentHash = sha256(left.hash + right.hash);
      const parentNode: MerkleStepNode = {
        id: `node_L${levelIndex}_${i / 2}`,
        hash: parentHash,
        label: `H(${left.id.slice(-2)} + ${right.id.slice(-2)})`,
        level: levelIndex,
        leftId: left.id,
        rightId: right.id
      };
      nextLevel.push(parentNode);
    }

    levels.push(nextLevel);
    currentLevel = nextLevel;
    levelIndex++;
  }

  const rootNode = currentLevel[0];
  const allNodes = levels.flat();

  return {
    root: rootNode.hash,
    nodes: allNodes,
    levels
  };
}

/**
 * Thuật toán PoS Weighted Lottery (Xổ số có trọng số cổ phần)
 */
export function runPoSSelection(validators: Validator[]): {
  winner: Validator;
  winningTicket: number;
  totalStake: number;
  probabilities: { id: string; name: string; percentage: number }[];
} {
  const activeValidators = validators.filter(v => v.status === 'active' && v.stakeAmount > 0);
  const totalStake = activeValidators.reduce((sum, v) => sum + v.stakeAmount, 0);

  if (totalStake === 0 || activeValidators.length === 0) {
    throw new Error('Không có Validator nào hợp lệ hoặc tổng stake = 0');
  }

  const probabilities = activeValidators.map(v => ({
    id: v.id,
    name: v.name,
    percentage: Math.round((v.stakeAmount / totalStake) * 1000) / 10
  }));

  // Tạo vé số ngẫu nhiên từ 0 đến totalStake
  const winningTicket = Math.random() * totalStake;
  let accumulatedStake = 0;
  let winner = activeValidators[0];

  for (const v of activeValidators) {
    accumulatedStake += v.stakeAmount;
    if (winningTicket <= accumulatedStake) {
      winner = v;
      break;
    }
  }

  return {
    winner,
    winningTicket: Math.round(winningTicket * 10) / 10,
    totalStake,
    probabilities
  };
}

/**
 * Băm Block Header
 */
export function computeBlockHash(header: {
  version: string;
  index: number;
  previousHash: string;
  merkleRoot: string;
  timestamp: number;
  difficulty: number;
  nonce: number;
}): string {
  const headerString = `${header.version}:${header.index}:${header.previousHash}:${header.merkleRoot}:${header.timestamp}:${header.difficulty}:${header.nonce}`;
  return sha256(sha256(headerString)); // Double SHA-256 chuẩn Bitcoin
}
