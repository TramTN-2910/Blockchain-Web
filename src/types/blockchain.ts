export interface Sha256Result {
  input: string;
  hash: string;
  bitLength: number;
  hexCharCount: number;
}

export interface AvalancheComparison {
  originalInput: string;
  originalHash: string;
  modifiedInput: string;
  modifiedHash: string;
  differingBitsCount: number;
  percentageChanged: number;
}

export interface MerkleNode {
  id: string;
  hash: string;
  data?: string;
  left?: MerkleNode;
  right?: MerkleNode;
  isRoot?: boolean;
}

export interface BlockData {
  index: number;
  timestamp: number;
  transactions: string[];
  previousHash: string;
  nonce: number;
  hash: string;
  difficulty: number;
}

export interface RsaKeyPair {
  publicKey: { e: number; n: number };
  privateKey: { d: number; n: number };
  p: number;
  q: number;
  phi: number;
}
