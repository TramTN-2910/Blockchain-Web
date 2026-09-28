/**
 * Curated Blockchain & Cryptography RAG Knowledge Base for HubBlock AI Assistant
 * Synchronized with all 7 HubBlock Modules & Interactive Sandboxes.
 */

export const BLOCKCHAIN_KNOWLEDGE_BASE = `
# TÀI LIỆU TRI THỨC CHUYÊN SÂU BLOCKCHAIN & MẬT MÃ HỌC (HUBBLOCK FULL KNOWLEDGE BASE)

## 1. HÀM BĂM MẬT MÃ HỌC & SHA-256 (SECURE HASH ALGORITHM 256-BIT)
- **Định nghĩa**: SHA-256 là hàm băm mật mã học một chiều thuộc họ SHA-2 do NSA thiết kế, được NIST công bố chuẩn FIPS PUB 180-4.
- **Đặc điểm đầu ra**: Luôn cố định đúng 256 bits = 32 bytes = 64 ký tự Hexadecimal, không phụ thuộc vào kích thước dữ liệu đầu vào.
- **5 Tính chất mật mã học quan trọng**:
  1. *Tính xác định (Deterministic)*: Cùng một đầu vào luôn tạo ra duy nhất một chuỗi băm đầu ra.
  2. *Hàm một chiều / Kháng tiền ảnh (Pre-image Resistance)*: Cho mã băm $H$, không thể tính ngược để tìm thông điệp gốc $m$ ($2^{256}$ phép tính).
  3. *Kháng tiền ảnh bậc hai (Second Pre-image Resistance)*: Cho trước $m_1$, bất khả thi để tìm $m_2 \\neq m_1$ sao cho $\\text{Hash}(m_1) = \\text{Hash}(m_2)$.
  4. *Kháng va chạm (Collision Resistance)*: Bất khả thi để tìm bất kỳ cặp $(m_1, m_2)$ bất kỳ nào có cùng mã băm ($2^{128}$ theo Nghịch lý ngày sinh nhật).
  5. *Hiệu ứng Tuyết lở (Avalanche Effect)*: Thay đổi dù chỉ 1 bit ở đầu vào sẽ làm đảo lộn ngẫu nhiên ~50% (khoảng 128/256 bits) mã băm đầu ra.
- **6 Bước nén dữ liệu nội bộ SHA-256**:
  1. *Đệm bit (Padding)*: Thêm bit '1', các bit '0' sao cho chiều dài $\\equiv 448 \\pmod{512}$.
  2. *Gắn chiều dài (Append Length)*: Thêm 64-bit số nguyên ghi độ dài thông điệp gốc để đạt bội số 512-bit.
  3. *Khởi tạo 8 biến trạng thái (H0..H7)*: Lấy từ phần thập phân căn bậc hai của 8 số nguyên tố đầu tiên (2, 3, 5, 7, 11, 13, 17, 19).
  4. *Mở rộng 64 từ (Message Schedule)*: Mở rộng 16 từ 32-bit (W0..W15) thành 64 từ (W0..W63) qua các hàm biến đổi bit $\\sigma_0, \\sigma_1$.
  5. *Vòng lặp nén 64 vòng (64-Round Compression Loop)*: Sử dụng 64 hằng số $K_t$ (từ căn bậc 3 của 64 số nguyên tố) cùng các hàm logic $Ch, Maj, \\Sigma_0, \\Sigma_1$.
  6. *Đầu ra mã băm (Final Digest)*: Cộng tích lũy và ghép nối 8 thanh ghi thành chuỗi 64 ký tự Hex.

## 2. VÍ ĐIỆN TỬ, KHÓA ECDSA & ĐỊA CHỈ BLOCKCHAIN
- **Mật mã học đường cong Elliptic (ECDSA secp256k1)**:
  - Sử dụng phương trình đường cong elliptic: $y^2 = x^3 + 7 \\pmod p$.
  - *Private Key (Khóa bí mật)*: Số nguyên 256-bit ngẫu nhiên bảo mật tuyệt đối, dùng để ký giao dịch.
  - *Public Key (Khóa công khai)*: Điểm $Q = d \\times G$ trên đường cong elliptic ($G$ là điểm sinh Generator Point).
- **Chuẩn BIP-39 (Mnemonic Seed Phrase)**:
  - Bộ 12 hoặc 24 từ tiếng Anh dễ nhớ đóng vai trò là entropy gốc để sinh ra tất cả khóa riêng một cách xác định (Deterministic).
- **Địa chỉ ví (0x Address)**:
  - Sinh từ Public Key bằng cách băm qua Keccak-256 (hoặc SHA-256 + RIPEMD-160 trong Bitcoin) và lấy 20 bytes cuối (40 ký tự hex) kèm tiền tố 0x.

## 3. CẤU TRÚC GIAO DỊCH, CHỮ KÝ SỐ & HÀNG ĐỢI MEMPOOL
- **Cấu trúc Giao dịch (Transaction Payload)**:
  - *From / To*: Địa chỉ ví gửi và ví nhận.
  - *Amount*: Số lượng token/tiền mã hóa chuyển giao.
  - *Gas Fee / Priority Fee*: Phí giao dịch chi trả cho Validator/Miner theo đơn vị Gwei.
  - *Nonce Counter*: Số thứ tự tự tăng cho mỗi ví, ngăn chặn hoàn toàn tấn công phát lại (Replay Attack).
  - *Digital Signature (r, s, v)*: Chữ ký số mật mã học do ví gửi tạo ra từ Private Key.
- **Hàng đợi Mempool (Memory Pool)**:
  - Nơi lưu trữ tạm thời các giao dịch hợp lệ vừa được phát tán vào mạng nhưng chưa được đóng gói vào khối.
  - Cơ chế ưu tiên: Giao dịch có phí Gas cao hơn sẽ được Validator ưu tiên chọn đóng gói trước (theo thứ tự Gas Fee Priority thay vì chỉ FIFO).

## 4. CÂY MERKLE & XÁC THỰC NHANH (MERKLE TREE & SPV)
- **Cấu trúc cây nhị phân (Binary Hash Tree)**:
  - Các giao dịch được băm ở tầng lá ($H_A, H_B, H_C, H_D$).
  - Ghép cặp và băm tiếp: $H_{AB} = \\text{SHA256}(H_A \\ || \\ H_B)$, $H_{CD} = \\text{SHA256}(H_C \\ || \\ H_D)$.
  - Nếu số lượng lá lẻ, lá cuối cùng được nhân đôi để ghép cặp.
  - Đỉnh cây là **Merkle Root**, đại diện bất biến cho toàn bộ giao dịch trong khối.
- **Xác thực thanh toán đơn giản (SPV Proof)**:
  - Cho phép Light Client kiểm tra 1 giao dịch có nằm trong khối hay không chỉ với độ phức tạp $O(\\log_2 N)$ bằng chứng băm (Merkle Path) mà không cần tải toàn bộ khối.

## 5. CẤU TRÚC KHỐI & CƠ CHẾ ĐỒNG THUẬN (POW & POS)
- **Cấu trúc Block tiêu chuẩn**:
  - *Block Header (80 bytes)*: Version, Previous Hash (32 bytes), Merkle Root (32 bytes), Timestamp (4 bytes), Difficulty Target / Bits (4 bytes), Nonce (4 bytes).
  - *Block Body*: Giao dịch Coinbase (thưởng đúc khối) và danh sách giao dịch payload.
- **Proof of Work (PoW - Bitcoin)**:
  - Thợ đào tìm Nonce sao cho $\\text{Double-SHA256}(\\text{Block Header}) \\le \\text{Target}$.
  - Độ khó tự động điều chỉnh sau mỗi 2016 khối (khoảng 2 tuần) để giữ thời gian sinh khối ổn định ~10 phút.
- **Proof of Stake (PoS - Ethereum 2.0)**:
  - Validator đặt cọc (Stake) tài sản token để tham gia quay số ngẫu nhiên có trọng số (Weighted Lottery Selection).
  - Tiết kiệm 99.9% năng lượng so với PoW. Có cơ chế phạt **Slashing** (tịch thu tiền cọc) đối với hành vi gian lận (Double Signing / Offline).

## 6. MẠNG LƯỚI NGANG HÀNG P2P & AN NINH CHUỖI KHỐI
- **Mạng P2P Mesh & Giao thức Gossip**:
  - Mỗi Node hoạt động vừa là Server vừa là Client, tự động xác thực và lan truyền khối/giao dịch cấp số nhân đến các nút láng giềng.
- **Các hình thức tấn công & phòng thủ**:
  - *Tấn công 51% (51% Attack / Majority Attack)*: Chiếm trên 50% sức mạnh khai thác/cổ phần để tổ chức Chi tiêu kép (Double Spending) hoặc viết lại lịch sử chuỗi.
  - *Sửa đổi dữ liệu khối (Tampering)*: Sửa 1 byte ở khối $N$ sẽ làm thay đổi Hash của khối $N$, khiến khối $N+1$ trỏ sai Previous Hash $\\rightarrow$ toàn bộ chuỗi từ $N+1$ trở đi bị vô hiệu hóa lập tức.
  - *Tấn công phân mảnh mạng (Network Partitioning)*: Cách ly nhóm node để tạo phân nhánh chuỗi cục bộ.

## 7. MẬT MÃ HỌC RSA & TOÁN HỌC KHÓA BẤT ĐỐI XỨNG
- **Các bước thiết lập RSA**:
  1. Chọn 2 số nguyên tố $p, q$.
  2. Modulus $n = p \\times q$.
  3. $\\phi(n) = (p - 1)(q - 1)$.
  4. Chọn $e$ nguyên tố cùng nhau với $\\phi(n)$ (thường là 65537 hoặc 3, 17).
  5. Tính khóa bí mật $d \\equiv e^{-1} \\pmod{\\phi(n)}$ bằng Euclid mở rộng.
- **Mã hóa**: $c = m^e \\pmod n$. **Giải mã**: $m = c^d \\pmod n$.
- **Ký số**: $S = \\text{Hash}(M)^d \\pmod n$. **Xác minh**: $\\text{Hash}' = S^e \\pmod n$.

## 8. HỆ SINH THÁI NỀN TẢNG HUBBLOCK (ĐH NGÂN HÀNG TP.HCM)
- **HubBlock** gồm 7 chuyên mục học tập trực quan tương tác:
  1. *Giới thiệu (Intro)*: Tổng quan đề tài SVNCKH, Mục tiêu, Ngăn xếp công nghệ, Quy trình 6 giai đoạn.
  2. *Lý thuyết (Theory)*: 8 bài học cốt lõi từ Khối, Chuỗi, Ví, Giao dịch, Hash, Chữ ký số, Đồng thuận, Mạng P2P.
  3. *Phòng TN Mật mã (Crypto Lab)*: Trực quan hóa Khởi tạo ví BIP-39, Ký số ECDSA, 6 bước nén SHA-256, Xác minh chữ ký.
  4. *Mô phỏng Blockchain (Sim)*: Thao tác Transaction, Mempool Gas Fee, Ghép cây Merkle, Mắt xích PrevHash, Đấu thầu PoS, Đóng gói Block, Khám phá chuỗi.
  5. *Mô phỏng Tấn công (Attack Sim)*: Thực hành Sửa đổi giao dịch, Tấn công sửa khối, Kiểm tra toàn vẹn chuỗi và Khôi phục trạng thái.
  6. *Mạng lưới & Nodes (Network & Nodes)*: Bản đồ mạng P2P Mesh, Quản lý liên kết, Lan truyền Gossip, Đồng bộ sổ cái, Nhật ký gói tin.
  7. *Về chúng tôi (About Us)*: Đội ngũ nghiên cứu HUB, Tài liệu hướng dẫn, Phân công nhiệm vụ, Báo cáo công nghệ.
`;
