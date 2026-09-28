export interface SubNavTab {
  id: string;
  titleVi: string;
  titleEn: string;
  path: string;
  icon?: string;
  badge?: string;
}

export interface MainCategory {
  id: string;
  titleVi: string;
  titleEn: string;
  basePath: string;
  defaultSubPath: string;
  icon: string;
  descriptionVi: string;
  descriptionEn: string;
  subTabs: SubNavTab[];
}

export const MAIN_NAVIGATION: MainCategory[] = [
  {
    id: 'intro',
    titleVi: 'Giới thiệu đồ án',
    titleEn: 'Project Intro',
    basePath: '/intro',
    defaultSubPath: '/intro/overview',
    icon: 'BookOpen',
    descriptionVi: 'Giới thiệu mục đích, phạm vi và công nghệ của website',
    descriptionEn: 'Introduction to website purpose, scope and core technologies',
    subTabs: [
      { id: 'overview', titleVi: 'Tổng quan', titleEn: 'Overview', path: '/intro/overview' },
      { id: 'goals', titleVi: 'Mục tiêu', titleEn: 'Goals', path: '/intro/goals' },
      { id: 'workflow', titleVi: 'Quy trình', titleEn: 'Workflow', path: '/intro/workflow' },
      { id: 'tech-stack', titleVi: 'Công nghệ', titleEn: 'Tech Stack', path: '/intro/tech-stack' },
    ]
  },
  {
    id: 'theory',
    titleVi: 'Lý thuyết Blockchain',
    titleEn: 'Blockchain Theory',
    basePath: '/theory',
    defaultSubPath: '/theory/blockchain',
    icon: 'GraduationCap',
    descriptionVi: 'Trình bày khái niệm ngắn gọn về các thành phần Blockchain',
    descriptionEn: 'Concise theoretical concepts of core Blockchain building blocks',
    subTabs: [
      { id: 'blockchain', titleVi: 'Chuỗi khối', titleEn: 'Blockchain', path: '/theory/blockchain' },
      { id: 'wallet', titleVi: 'Ví & Cặp khóa', titleEn: 'Wallet & Keys', path: '/theory/wallet' },
      { id: 'transaction', titleVi: 'Giao dịch', titleEn: 'Transaction', path: '/theory/transaction' },
      { id: 'hash', titleVi: 'Hàm băm', titleEn: 'Hash / SHA-256', path: '/theory/hash' },
      { id: 'digital-signature', titleVi: 'Chữ ký số', titleEn: 'Digital Signature', path: '/theory/digital-signature' },
      { id: 'block', titleVi: 'Cấu trúc khối', titleEn: 'Block Anatomy', path: '/theory/block' },
      { id: 'consensus', titleVi: 'Đồng thuận', titleEn: 'Consensus (PoS/PoW)', path: '/theory/consensus' },
      { id: 'network', titleVi: 'Mạng P2P', titleEn: 'P2P Network', path: '/theory/network' },
    ]
  },
  {
    id: 'crypto-lab',
    titleVi: 'Phòng TN Mật mã',
    titleEn: 'Cryptography Lab',
    basePath: '/crypto-lab',
    defaultSubPath: '/crypto-lab/wallet',
    icon: 'ShieldCheck',
    descriptionVi: 'Mô phỏng tạo ví, tạo Hash, ký và xác minh chữ ký số',
    descriptionEn: 'Simulate wallet creation, hash generation, digital signing and verification',
    subTabs: [
      { id: 'wallet', titleVi: 'Tạo ví BIP-39', titleEn: 'BIP-39 Wallet', path: '/crypto-lab/wallet' },
      { id: 'hash', titleVi: 'Thí nghiệm băm', titleEn: 'SHA-256 Hash', path: '/crypto-lab/hash' },
      { id: 'digital-signature', titleVi: 'Ký số ECDSA', titleEn: 'ECDSA Signature', path: '/crypto-lab/digital-signature' },
      { id: 'signature-verification', titleVi: 'Xác minh chữ ký', titleEn: 'Signature Verifier', path: '/crypto-lab/signature-verification' },
    ]
  },
  {
    id: 'blockchain-sim',
    titleVi: 'Mô phỏng Blockchain',
    titleEn: 'Blockchain Sim',
    basePath: '/blockchain-sim',
    defaultSubPath: '/blockchain-sim/transaction',
    icon: 'Layers',
    descriptionVi: 'Mô phỏng quy trình tạo giao dịch và hình thành Blockchain',
    descriptionEn: 'Simulate transaction creation pipeline and block assembly into ledger',
    subTabs: [
      { id: 'transaction', titleVi: 'Soạn giao dịch', titleEn: 'Draft Tx', path: '/blockchain-sim/transaction' },
      { id: 'mempool', titleVi: 'Hàng đợi Mempool', titleEn: 'Mempool Queue', path: '/blockchain-sim/mempool' },
      { id: 'merkle-tree', titleVi: 'Cây Merkle', titleEn: 'Merkle Tree', path: '/blockchain-sim/merkle-tree' },
      { id: 'previous-hash', titleVi: 'Mắt xích PrevHash', titleEn: 'Previous Hash', path: '/blockchain-sim/previous-hash' },
      { id: 'pos', titleVi: 'Đồng thuận PoS', titleEn: 'PoS Staking', path: '/blockchain-sim/pos' },
      { id: 'block', titleVi: 'Đóng gói khối', titleEn: 'Block Assembly', path: '/blockchain-sim/block' },
      { id: 'blockchain', titleVi: 'Khám phá chuỗi', titleEn: 'Chain Explorer', path: '/blockchain-sim/blockchain' },
    ]
  },
  {
    id: 'attack-sim',
    titleVi: 'Mô phỏng Tấn công',
    titleEn: 'Attack Simulation',
    basePath: '/attack-sim',
    defaultSubPath: '/attack-sim/tamper-tx',
    icon: 'AlertTriangle',
    descriptionVi: 'Mô phỏng thay đổi dữ liệu và phát hiện dữ liệu bị thay đổi',
    descriptionEn: 'Simulate historical tampering and cascade invalidation detection',
    subTabs: [
      { id: 'tamper-tx', titleVi: 'Sửa Giao dịch', titleEn: 'Tamper Tx', path: '/attack-sim/tamper-tx' },
      { id: 'tamper-block', titleVi: 'Sửa Khối', titleEn: 'Tamper Block', path: '/attack-sim/tamper-block' },
      { id: 'check-hash', titleVi: 'So sánh Hash', titleEn: 'Check Hash Diff', path: '/attack-sim/check-hash' },
      { id: 'check-chain', titleVi: 'Kiểm toán Chuỗi', titleEn: 'Check Chain Link', path: '/attack-sim/check-chain' },
      { id: 'reset', titleVi: 'Đào lại & Reset', titleEn: 'Re-mine & Reset', path: '/attack-sim/reset' },
    ]
  },
  {
    id: 'network-nodes',
    titleVi: 'Cấu hình Mạng & Node',
    titleEn: 'Network & Nodes',
    basePath: '/network-nodes',
    defaultSubPath: '/network-nodes/nodes',
    icon: 'Network',
    descriptionVi: 'Mô phỏng các Node kết nối, truyền và đồng bộ dữ liệu',
    descriptionEn: 'Simulate peer node connectivity, gossip propagation and ledger synchronization',
    subTabs: [
      { id: 'nodes', titleVi: 'Danh sách Node', titleEn: 'Node Registry', path: '/network-nodes/nodes' },
      { id: 'network', titleVi: 'Sơ đồ P2P', titleEn: 'P2P Topology', path: '/network-nodes/network' },
      { id: 'connections', titleVi: 'Quản lý Kết nối', titleEn: 'Peer Matrix', path: '/network-nodes/connections' },
      { id: 'broadcast', titleVi: 'Lan truyền Gossip', titleEn: 'Gossip Broadcast', path: '/network-nodes/broadcast' },
      { id: 'sync', titleVi: 'Đồng bộ Sổ cái', titleEn: 'Ledger Sync', path: '/network-nodes/sync' },
      { id: 'logs', titleVi: 'Nhật ký Mạng', titleEn: 'Network Logs', path: '/network-nodes/logs' },
    ]
  },
  {
    id: 'about-us',
    titleVi: 'Về chúng tôi',
    titleEn: 'About Us',
    basePath: '/about-us',
    defaultSubPath: '/about-us/team',
    icon: 'Users',
    descriptionVi: 'Thông tin nhóm, phân công công việc và tài liệu dự án',
    descriptionEn: 'Research team members, task assignments, tech stack and documentation',
    subTabs: [
      { id: 'team', titleVi: 'Thành viên', titleEn: 'Team Members', path: '/about-us/team' },
      { id: 'assignments', titleVi: 'Phân công WBS', titleEn: 'Assignments', path: '/about-us/assignments' },
      { id: 'technology', titleVi: 'Kiến trúc Công nghệ', titleEn: 'Tech Stack', path: '/about-us/technology' },
      { id: 'docs', titleVi: 'Tài liệu Hướng dẫn', titleEn: 'Documentation', path: '/about-us/docs' },
    ]
  }
];
