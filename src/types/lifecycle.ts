export interface Wallet {
  id: string;
  name: string;
  privateKey: string;
  publicKey: string;
  address: string;
  balance: number;
  seedPhrase: string;
  createdAt: number;
}

export interface TransactionSignature {
  r: string;
  s: string;
  v: number;
}

export interface Transaction {
  id: string; // TxID = SHA256(From + To + Amount + Nonce + Timestamp + Data)
  from: string;
  to: string;
  amount: number;
  gasFee: number;
  nonce: number;
  timestamp: number;
  data: string;
  status: 'draft' | 'signed' | 'pending' | 'confirmed' | 'rejected';
  signature?: TransactionSignature;
}

export interface NetworkNode {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'syncing';
  connectedNodeIds: string[];
  latencyMs: number;
  receivedTxIds: string[];
}

export interface MerkleStepNode {
  id: string;
  hash: string;
  label?: string;
  level: number;
  leftId?: string;
  rightId?: string;
  isModified?: boolean;
}

export interface BlockHeader {
  version: string;
  index: number;
  previousHash: string;
  merkleRoot: string;
  timestamp: number;
  difficulty: number;
  nonce: number;
}

export interface CoinbaseTx {
  to: string;
  reward: number;
  gasTotal: number;
}

export interface LifecycleBlock {
  index: number;
  header: BlockHeader;
  coinbase: CoinbaseTx;
  transactions: Transaction[];
  hash: string;
  isValid: boolean;
  proposer?: string;
}

export interface Validator {
  id: string;
  name: string;
  address: string;
  stakeAmount: number;
  status: 'active' | 'jailed' | 'slashed';
  blocksProduced: number;
  totalRewards: number;
  color: string;
}

export interface LifecycleStepInfo {
  step: number;
  id: string;
  title: string;
  titleVi: string;
  path: string;
  badge: string;
  descriptionVi: string;
  descriptionEn: string;
  icon: string;
}
