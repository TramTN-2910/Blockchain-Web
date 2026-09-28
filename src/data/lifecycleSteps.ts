import { LifecycleStepInfo } from '@/types/lifecycle';

export const LIFECYCLE_STEPS: LifecycleStepInfo[] = [
  {
    step: 1,
    id: 'wallet',
    title: 'Wallet Creation & Faucet',
    titleVi: 'Khởi Tạo Ví & Cấp Tiền Faucet',
    path: '/lifecycle/wallet',
    badge: 'ECDSA secp256k1',
    descriptionVi: 'Sinh cặp khóa bí mật/công khai, cụm từ khôi phục 12 từ (BIP-39), địa chỉ 0x và nhận 100 HUB thử nghiệm.',
    descriptionEn: 'Generate private/public keypair, 12-word BIP-39 mnemonic, 0x address and request 100 HUB testnet faucet.',
    icon: 'Wallet'
  },
  {
    step: 2,
    id: 'transaction',
    title: 'Tx Simulator & ECDSA Signer',
    titleVi: 'Tạo & Ký Số Giao Dịch',
    path: '/lifecycle/transaction',
    badge: 'Digital Signature (r, s, v)',
    descriptionVi: 'Nhập người nhận, số lượng, phí Gas và thực hiện ký số bằng Private Key để đảm bảo tính bất khả chối cãi.',
    descriptionEn: 'Specify receiver, amount, gas fee and sign using sender Private Key for cryptographic non-repudiation.',
    icon: 'FileSignature'
  },
  {
    step: 3,
    id: 'hash',
    title: 'Deep SHA-256 Cryptography',
    titleVi: 'Khám Phá Mật Mã Học SHA-256',
    path: '/lifecycle/hash',
    badge: '6-Step Compression Matrix',
    descriptionVi: 'Mổ xẻ 6 bước nén nội bộ của SHA-256, đo lường hiệu ứng tuyết lở và so sánh ma trận 6 thuật toán băm.',
    descriptionEn: 'Deconstruct SHA-256 6 compression phases, measure avalanche effect and compare 6 hash algorithms.',
    icon: 'Binary'
  },
  {
    step: 4,
    id: 'merkle',
    title: 'Visual Merkle Root',
    titleVi: 'Gom Cụm & Cây Merkle',
    path: '/lifecycle/merkle',
    badge: 'Binary Hash Tree',
    descriptionVi: 'Ghép cặp các giao dịch thành cây nhị phân, tự động xử lý số lẻ và kiểm chứng sự lan truyền thay đổi dữ liệu.',
    descriptionEn: 'Pair transactions into a binary hash tree, handle odd leaves and test cryptographic tamper propagation.',
    icon: 'GitFork'
  },
  {
    step: 5,
    id: 'block',
    title: 'Block Assembly & Header',
    titleVi: 'Đóng Gói & Cấu Trúc Khối',
    path: '/lifecycle/block',
    badge: 'Double SHA-256 Header',
    descriptionVi: 'Lắp ráp Header (Version, PrevHash, MerkleRoot, Nonce) cùng Body (Coinbase + Tx list) thành Block chuẩn.',
    descriptionEn: 'Assemble Header (Version, PrevHash, MerkleRoot, Nonce) and Body (Coinbase + Tx list) into a valid block.',
    icon: 'Box'
  },
  {
    step: 6,
    id: 'p2p',
    title: 'P2P Network & Gossip Protocol',
    titleVi: 'Mạng Ngang Hàng P2P & Lan Truyền',
    path: '/lifecycle/p2p',
    badge: 'Gossip Broadcast Mesh',
    descriptionVi: 'Đồ thị mạng lưới phân tán đa node, mô phỏng độ trễ truyền tin và khử lặp gói tin khi broadcast.',
    descriptionEn: 'Interactive multi-node mesh network, simulate propagation latency and broadcast deduplication.',
    icon: 'Network'
  },
  {
    step: 7,
    id: 'mempool',
    title: 'Mempool Priority Queue',
    titleVi: 'Hàng Đợi Mempool & Phí Gas',
    path: '/lifecycle/mempool',
    badge: 'Gas Priority Sorting',
    descriptionVi: 'Quản lý hàng chờ giao dịch Pending, sắp xếp theo mức độ ưu tiên Phí Gas hoặc thời gian đến trước (FIFO).',
    descriptionEn: 'Manage pending transaction pool, sort by highest gas fee priority or FIFO arrival time.',
    icon: 'Layers'
  },
  {
    step: 8,
    id: 'handshake',
    title: '2-Block Handshake',
    titleVi: 'Liên Kết Mắt Xích Khối',
    path: '/lifecycle/handshake',
    badge: 'Reverse Pointer Neon Link',
    descriptionVi: 'Trực quan hóa luồng ánh sáng neon truyền Current Hash khối trước cắm vào Previous Hash khối sau.',
    descriptionEn: 'Visualize neon photon stream linking Current Hash of previous block into Previous Hash of candidate block.',
    icon: 'Link'
  },
  {
    step: 9,
    id: 'pos',
    title: 'Proof of Stake Consensus',
    titleVi: 'Đồng Thuận Bằng Chứng Cổ Phần',
    path: '/lifecycle/pos',
    badge: 'Weighted Lottery & Slashing',
    descriptionVi: 'Xổ số chọn Validator đúc khối theo tỷ lệ trọng số Stake, trả thưởng Staking và cơ chế phạt Slashing.',
    descriptionEn: 'Weighted lottery selecting block proposers by stake ratio, distribute staking rewards and apply slashing.',
    icon: 'ShieldCheck'
  },
  {
    step: 10,
    id: 'tamper',
    title: 'Tamper Detection & Re-mining',
    titleVi: 'Phát Hiện Gian Lận & Đào Lại Chuỗi',
    path: '/lifecycle/tamper',
    badge: 'Chain Invalidation & 51% Attack',
    descriptionVi: 'Sửa đổi dữ liệu lịch sử để kích hoạt đứt gãy chuỗi hàng loạt và thử nghiệm sức mạnh tính toán để đào lại.',
    descriptionEn: 'Modify historical data to trigger cascade chain invalidation and experiment with re-mining effort.',
    icon: 'AlertTriangle'
  }
];
