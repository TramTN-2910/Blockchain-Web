/**
 * Curated Blockchain & Cryptography RAG Knowledge Base for HubBlock AI Assistant
 */

export const BLOCKCHAIN_KNOWLEDGE_BASE = `
# TÀI LIỆU TRI THỨC CHUYÊN SÂU BLOCKCHAIN & MẬT MÃ HỌC (HUBBLOCK KNOWLEDGE BASE)

## 1. HÀM BĂM MẬT MÃ HỌC & SHA-256 (SECURE HASH ALGORITHM 256-BIT)
- **Định nghĩa**: SHA-256 là hàm băm mật mã học một chiều thuộc họ SHA-2 do NSA thiết kế và được NIST công bố chuẩn FIPS PUB 180-4 năm 2002.
- **Đầu ra**: Luôn cố định 256 bits = 32 bytes = 64 ký tự Hexadecimal (hệ cơ số 16), bất kể kích thước đầu vào từ 1 byte đến $2^{64}-1$ bits.
- **4 Tính chất cốt lõi**:
  1. *Độ dài cố định (Deterministic & Fixed Length)*: Bất kỳ đầu vào nào cũng cho ra đúng 64 ký tự hex (256 bits).
  2. *Hàm một chiều (Pre-image Resistance / One-Way)*: Cho trước mã băm H, không thể đảo ngược để tìm lại dữ liệu gốc x sao cho SHA256(x) = H (độ phức tạp $2^{256}$).
  3. *Kháng tiền ảnh bậc hai (Second Pre-image Resistance)*: Cho x, không thể tìm x' ≠ x sao cho SHA256(x) = SHA256(x').
  4. *Kháng va chạm (Collision Resistance)*: Không thể tìm bất kỳ cặp (x, y) nào sao cho SHA256(x) = SHA256(y). Theo nghịch lý ngày sinh nhật (Birthday Attack), độ phức tạp là $2^{128}$.
  5. *Hiệu ứng Tuyết lở (Avalanche Effect)*: Thay đổi dù chỉ 1 bit ở đầu vào (ví dụ đổi 1 dấu chấm, 1 chữ cái) sẽ khiến ~50% (khoảng 128/256 bits) đầu ra thay đổi hoàn toàn ngẫu nhiên và không đoán trước được.
- **Cấu trúc thuật toán SHA-256**:
  - *Message Padding*: Dữ liệu được đệm bit '1', sau đó các bit '0' và 64-bit ghi độ dài thông điệp gốc sao cho tổng độ dài chia hết cho 512 bits.
  - *Khởi tạo 8 biến băm (H0 - H7)*: Lấy từ phần thập phân của căn bậc hai 8 số nguyên tố đầu tiên (2, 3, 5, 7, 11, 13, 17, 19).
  - *Hằng số vòng (64 Constants K0 - K63)*: Lấy từ phần thập phân của căn bậc ba 64 số nguyên tố đầu tiên.
  - *64 vòng lặp (Compression Function)*: Sử dụng các hàm logic bitwise: Ch(x,y,z), Maj(x,y,z), $\Sigma_0(x)$, $\Sigma_1(x)$, $\sigma_0(x)$, $\sigma_1(x)$.

## 2. KHAI THÁC & CƠ CHẾ ĐỒNG THUẬN PROOF OF WORK (POW)
- **Proof of Work (Bằng chứng công việc)**: Cơ chế đồng thuận do Satoshi Nakamoto áp dụng trong Bitcoin để đạt được sự đồng thuận phi tập trung không cần bên trung gian tin cậy.
- **Bài toán khai thác (Mining Problem)**:
  - Thợ đào phải gom các giao dịch chưa xác nhận (Mempool), tạo Merkle Root, ghép với Header khối (Previous Block Hash, Timestamp, Bits/Difficulty, Nonce).
  - Thợ đào liên tục thay đổi giá trị **Nonce** (Number used once, 32-bit integer) và tính toán:
    $$\\text{Hash} = \\text{SHA256}(\\text{SHA256}(\\text{Block Header}))$$
  - Điều kiện hợp lệ: Mã băm đầu ra phải **nhỏ hơn hoặc bằng Target** của mạng (tương đương có số lượng số 0 ở đầu thỏa mãn độ khó).
- **Điều chỉnh Độ khó (Difficulty Adjustment)**:
  - Trong Bitcoin, độ khó được tự động điều chỉnh sau mỗi **2016 khối** (khoảng 2 tuần) để duy trì thời gian sinh khối trung bình là **10 phút/khối**.
  - Công thức: $\\text{New Difficulty} = \\text{Old Difficulty} \\times \\frac{\\text{Actual Time of 2016 Blocks}}{2016 \\times 10 \\text{ minutes}}$.
- **Các nguy cơ bảo mật PoW**:
  - *Tấn công 51% (51% Attack)*: Khi một thực thể kiểm soát >50% hashrate của mạng, họ có thể thực hiện Chi tiêu kép (Double Spending) và viết lại lịch sử khối gần nhất.
  - *Tấn công đào ích kỷ (Selfish Mining)*: Giữ bí mật khối đã đào để tạo lợi thế cạnh tranh chuỗi dài hơn.

## 3. CÂY MERKLE (MERKLE TREE / BINARY HASH TREE)
- **Định nghĩa**: Cấu trúc cây nhị phân trong đó mỗi nút lá là mã băm của một giao dịch cụ thể, và mỗi nút cha là mã băm của hai nút con nối lại: $\\text{Parent} = \\text{SHA256}(\\text{SHA256}(\\text{Left} \\ || \\ \\text{Right}))$.
- **Merkle Root**: Mã băm gốc duy nhất tại đỉnh cây, được lưu trữ trong Block Header để đại diện cho toàn bộ giao dịch trong khối.
- **Ưu điểm vượt trội**:
  - *Xác thực thanh toán đơn giản (SPV - Simplified Payment Verification)*: Nút nhẹ (Lightweight node / Light client) chỉ cần tải Block Header (80 bytes) và bằng chứng Merkle (Merkle Proof/Path).
  - *Độ phức tạp $O(\\log_2 N)$*: Để chứng minh một giao dịch nằm trong khối có $N$ giao dịch, chỉ cần cung cấp $\\log_2 N$ mã băm trung gian thay vì toàn bộ dữ liệu khối.

## 4. MẬT MÃ HỌC BẤT ĐỐI XỨNG & THUẬT TOÁN RSA
- **Mật mã học khóa công khai (Asymmetric Cryptography)**: Sử dụng cặp khóa toán học liên kết:
  - *Public Key (Khóa công khai)*: Dùng để mã hóa dữ liệu hoặc xác minh chữ ký số, có thể công khai cho tất cả mọi người.
  - *Private Key (Khóa bí mật)*: Dùng để giải mã hoặc tạo chữ ký số, tuyệt đối giữ bí mật.
- **5 Bước tạo khóa RSA**:
  1. Chọn 2 số nguyên tố lớn ngẫu nhiên phân biệt: $p$ và $q$.
  2. Tính modulus $n = p \\times q$. Độ dài của $n$ là độ dài khóa RSA.
  3. Tính phi hàm Euler: $\\phi(n) = (p - 1)(q - 1)$.
  4. Chọn số mũ công khai $e$ sao cho $1 < e < \\phi(n)$ và $\\gcd(e, \\phi(n)) = 1$ (thường chọn $e = 65537$ hoặc $e = 3, 17$).
  5. Tính số mũ bí mật $d$ là nghịch đảo modulo của $e$ theo modulo $\\phi(n)$: $d \\equiv e^{-1} \\pmod{\\phi(n)}$, tức là $(d \\times e) \\pmod{\\phi(n)} = 1$ (sử dụng thuật toán Euclid mở rộng).
- **Mã hóa và Giải mã RSA**:
  - Mã hóa (với thông điệp số $m < n$): $c = m^e \\pmod n$.
  - Giải mã: $m = c^d \\pmod n$.
- **Chữ ký số RSA (Digital Signature)**:
  - Người gửi băm thông điệp: $h = \\text{Hash}(M)$.
  - Ký bằng Private Key: $S = h^d \\pmod n$.
  - Người nhận xác minh bằng Public Key: $h' = S^e \\pmod n$. Nếu $h' == \\text{Hash}(M)$ thì chữ ký hợp lệ (đảm bảo tính Toàn vẹn - Integrity, Xác thực nguồn gốc - Authentication, và Chống chối bỏ - Non-repudiation).

## 5. CẤU TRÚC CHUỖI KHỐI & TÍNH BẤT BIẾN (IMMUTABILITY)
- **Cấu trúc Khối (Block)**:
  - *Block Header*: Version, Previous Block Hash (32 bytes), Merkle Root (32 bytes), Timestamp (4 bytes), Difficulty Bits (4 bytes), Nonce (4 bytes).
  - *Block Body*: Danh sách các giao dịch (Transactions).
- **Tính Bất biến (Immutability)**:
  - Khối sau luôn chứa mã băm của khối trước (\`PrevBlockHash\`).
  - Nếu kẻ gian sửa đổi dữ liệu dù chỉ 1 ký tự ở một khối trong quá khứ $\\rightarrow$ mã băm của khối đó thay đổi $\\rightarrow$ làm gãy toàn bộ liên kết băm của tất cả các khối kế tiếp.
  - Kẻ tấn công muốn gian lận buộc phải tính lại PoW cho khối đó và toàn bộ các khối phía sau nhanh hơn sức mạnh của phần còn lại của mạng lưới (điều gần như bất khả thi).

## 6. NỀN TẢNG GIÁO DỤC HUBBLOCK (VỀ ỨNG DỤNG NÀY)
- **Mục tiêu**: HubBlock là ứng dụng trực quan hóa mật mã học và mô phỏng Blockchain dành cho học tập và giảng dạy tại Trường Đại học Ngân hàng TP.HCM (HUB).
- **Các phân hệ chính**:
  - *Hash Simulator*: Mô phỏng SHA-256 trực tiếp, Phân tích Hiệu ứng Tuyết lở (Avalanche), Độ dài cố định, Cây Merkle trực quan.
  - *Mining Module*: Lý thuyết PoW, Giả lập Đào khối theo độ khó thời gian thực, Khám phá chuỗi khối (Block Explorer).
  - *RSA Cryptography*: Tính toán toán học từng bước (chọn p, q, n, phi, e, d), Mã hóa/Giải mã, Demo Chữ ký số.
  - *Quiz & Test*: Luyện tập trắc nghiệm theo chủ đề, Bài kiểm tra tính giờ 40 câu random, Hệ thống Spaced Repetition ôn tập câu làm sai.
`;
