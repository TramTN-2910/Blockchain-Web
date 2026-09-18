import { Question, QuizTopic } from '@/types/quiz';

export const QUIZ_TOPICS: QuizTopic[] = [
  {
    slug: 'hash',
    name_vn: 'Hàm băm & SHA-256',
    icon: 'Hash',
    total_questions: 74,
    easy_count: 32,
    medium_count: 28,
    hard_count: 14,
  },
  {
    slug: 'mining',
    name_vn: 'Khai thác & PoW',
    icon: 'Pickaxe',
    total_questions: 67,
    easy_count: 29,
    medium_count: 25,
    hard_count: 13,
  },
  {
    slug: 'rsa',
    name_vn: 'Mã hoá RSA',
    icon: 'LockKeyhole',
    total_questions: 55,
    easy_count: 23,
    medium_count: 20,
    hard_count: 12,
  },
  {
    slug: 'merkle',
    name_vn: 'Cây Merkle',
    icon: 'Trees',
    total_questions: 45,
    easy_count: 19,
    medium_count: 17,
    hard_count: 9,
  },
  {
    slug: 'blockchain',
    name_vn: 'Cơ bản Blockchain',
    icon: 'Link2',
    total_questions: 69,
    easy_count: 32,
    medium_count: 24,
    hard_count: 13,
  },
  {
    slug: 'cryptography',
    name_vn: 'Mật mã học',
    icon: 'Binary',
    total_questions: 55,
    easy_count: 26,
    medium_count: 18,
    hard_count: 11,
  },
  {
    slug: 'p2p',
    name_vn: 'Mạng P2P & Node',
    icon: 'Globe',
    total_questions: 46,
    easy_count: 22,
    medium_count: 15,
    hard_count: 9,
  },
  {
    slug: 'smart-contract',
    name_vn: 'Smart Contract',
    icon: 'ScrollText',
    total_questions: 44,
    easy_count: 21,
    medium_count: 15,
    hard_count: 8,
  },
  {
    slug: 'security',
    name_vn: 'Bảo mật',
    icon: 'ShieldCheck',
    total_questions: 45,
    easy_count: 19,
    medium_count: 16,
    hard_count: 10,
  },
];

export const ALL_QUESTIONS: Question[] = [
  // 1. HASH & SHA-256
  {
    id: 'hash-01',
    topic_slug: 'hash',
    topic_name_vn: 'Hàm băm & SHA-256',
    type: 'single',
    question_vn: 'SHA-256 luôn tạo ra bao nhiêu ký tự hex?',
    difficulty: 'easy',
    options: [
      { id: 'opt-a', text_vn: '32', text_en: '32', is_correct: false },
      { id: 'opt-b', text_vn: '64', text_en: '64', is_correct: true },
      { id: 'opt-c', text_vn: '128', text_en: '128', is_correct: false },
      { id: 'opt-d', text_vn: '256', text_en: '256', is_correct: false },
    ],
    explanation_vn: 'SHA-256 tạo ra chuỗi nhị phân 256 bits, tương ứng với chính xác 64 ký tự hex (mỗi ký tự hex đại diện cho 4 bits: 256 / 4 = 64).',
  },
  {
    id: 'hash-02',
    topic_slug: 'hash',
    topic_name_vn: 'Hàm băm & SHA-256',
    type: 'single',
    question_vn: 'Hiệu ứng tuyết lở (Avalanche Effect) trong mật mã học nghĩa là gì?',
    difficulty: 'easy',
    options: [
      { id: 'opt-a', text_vn: 'Hàm băm chạy chậm dần theo thời gian khi dữ liệu tăng', text_en: 'Hash slows down', is_correct: false },
      { id: 'opt-b', text_vn: 'Chỉ cần thay đổi 1 bit đầu vào, giá trị băm đầu ra sẽ thay đổi hoàn toàn (~50% số bit)', text_en: 'Small change leads to ~50% bit flip', is_correct: true },
      { id: 'opt-c', text_vn: 'Kích thước mã băm tăng gấp đôi khi dữ liệu đầu vào tăng gấp đôi', text_en: 'Hash length doubles', is_correct: false },
      { id: 'opt-d', text_vn: 'Các khối blockchain bị sụp đổ liên hoàn khi mất điện', text_en: 'Chain collapse', is_correct: false },
    ],
    explanation_vn: 'Avalanche Effect đảm bảo tính không thể đoán trước: việc thay đổi dù chỉ 1 ký tự hay 1 bit đầu vào cũng làm đảo lộn hoàn toàn toàn bộ chuỗi băm đầu ra.',
  },
  {
    id: 'hash-03',
    topic_slug: 'hash',
    topic_name_vn: 'Hàm băm & SHA-256',
    type: 'single',
    question_vn: 'Tính chất "Một chiều" (Pre-image Resistance) của SHA-256 đảm bảo điều gì?',
    difficulty: 'medium',
    options: [
      { id: 'opt-a', text_vn: 'Dễ dàng tính H từ x, nhưng bất khả thi về mặt tính toán để tìm lại x từ H', text_en: 'Easy H(x), hard x from H', is_correct: true },
      { id: 'opt-b', text_vn: 'Chỉ có thể băm dữ liệu từ trái sang phải', text_en: 'Left to right only', is_correct: false },
      { id: 'opt-c', text_vn: 'Mỗi thông điệp chỉ được phép băm đúng 1 lần duy nhất', text_en: 'Hash once only', is_correct: false },
      { id: 'opt-d', text_vn: 'Dữ liệu băm không bao giờ bị xóa khỏi bộ nhớ', text_en: 'Never deleted', is_correct: false },
    ],
    explanation_vn: 'Pre-image Resistance (tính kháng tiền ảnh) đảm bảo rằng khi biết mã băm H = SHA256(x), không ai có thể giải ngược về thông điệp gốc x ngoại trừ phương pháp thử sai vét cạn.',
  },
  {
    id: 'hash-04',
    topic_slug: 'hash',
    topic_name_vn: 'Hàm băm & SHA-256',
    type: 'single',
    question_vn: 'Tính chất kháng va chạm (Collision Resistance) có nghĩa là gì?',
    difficulty: 'hard',
    options: [
      { id: 'opt-a', text_vn: 'Hai chuỗi dữ liệu khác nhau x ≠ y sẽ không bao giờ có thể tạo ra cùng mã băm H(x) = H(y)', text_en: 'Hard to find x != y with H(x) = H(y)', is_correct: true },
      { id: 'opt-b', text_vn: 'Hai máy đào không thể đào cùng 1 khối trong cùng một giây', text_en: 'No duplicate mining', is_correct: false },
      { id: 'opt-c', text_vn: 'Mạng ngang hàng không bị nghẽn đường truyền', text_en: 'No packet collision', is_correct: false },
      { id: 'opt-d', text_vn: 'Mã băm không bị xung đột với các địa chỉ ví Bitcoin', text_en: 'No wallet conflict', is_correct: false },
    ],
    explanation_vn: 'Về lý thuyết có vô số chuỗi đầu vào nên luôn tồn tại va chạm (theo nguyên lý Dirichlet), nhưng với không gian 2^256 của SHA-256, việc tìm ra một cặp va chạm là bất khả thi về mặt tính toán.',
  },

  // 2. MINING & POW
  {
    id: 'mining-01',
    topic_slug: 'mining',
    topic_name_vn: 'Khai thác & PoW',
    type: 'single',
    question_vn: 'Giá trị Nonce trong khai thác Proof of Work là gì?',
    difficulty: 'easy',
    options: [
      { id: 'opt-a', text_vn: 'Khóa bí mật của người đào khối', text_en: 'Private key', is_correct: false },
      { id: 'opt-b', text_vn: 'Số nguyên ngẫu nhiên tăng dần được điều chỉnh để mã băm khối thỏa mãn độ khó', text_en: 'Arbitrary number adjusted for difficulty', is_correct: true },
      { id: 'opt-c', text_vn: 'Phí giao dịch chuyển khoản', text_en: 'Transaction fee', is_correct: false },
      { id: 'opt-d', text_vn: 'Số lượng Bitcoin tối đa có thể đào', text_en: 'Max BTC supply', is_correct: false },
    ],
    explanation_vn: 'Nonce (Number used once) là trường số nguyên trong Block Header mà thợ đào liên tục thay đổi (0, 1, 2, ...) để tìm ra mã băm khối bắt đầu bằng số lượng số 0 theo yêu cầu độ khó.',
  },
  {
    id: 'mining-02',
    topic_slug: 'mining',
    topic_name_vn: 'Khai thác & PoW',
    type: 'single',
    question_vn: 'Khi độ khó (Target Difficulty) tăng thêm 1 số 0 ở đầu mã Hex, số lượt băm trung bình thay đổi như thế nào?',
    difficulty: 'medium',
    options: [
      { id: 'opt-a', text_vn: 'Tăng gấp 2 lần', text_en: '2x', is_correct: false },
      { id: 'opt-b', text_vn: 'Tăng gấp 10 lần', text_en: '10x', is_correct: false },
      { id: 'opt-c', text_vn: 'Tăng gấp 16 lần', text_en: '16x', is_correct: true },
      { id: 'opt-d', text_vn: 'Tăng gấp 256 lần', text_en: '256x', is_correct: false },
    ],
    explanation_vn: 'Trong hệ thập lục phân (Hexadecimal cơ số 16), xác suất để 1 ký tự hex bất kỳ rơi vào chữ số 0 là 1/16. Do đó mỗi chữ số 0 yêu cầu thêm ở đầu sẽ làm tăng độ khó trung bình lên 16 lần.',
  },
  {
    id: 'mining-03',
    topic_slug: 'mining',
    topic_name_vn: 'Khai thác & PoW',
    type: 'single',
    question_vn: 'Khối đầu tiên trong một blockchain được gọi là gì?',
    difficulty: 'easy',
    options: [
      { id: 'opt-a', text_vn: 'Alpha Block', text_en: 'Alpha Block', is_correct: false },
      { id: 'opt-b', text_vn: 'Genesis Block (Khối Nguyên thủy / Block #0)', text_en: 'Genesis Block', is_correct: true },
      { id: 'opt-c', text_vn: 'Root Block', text_en: 'Root Block', is_correct: false },
      { id: 'opt-d', text_vn: 'Master Block', text_en: 'Master Block', is_correct: false },
    ],
    explanation_vn: 'Genesis Block (Khối nguyên thủy #0) là khối khởi nguyên đầu tiên của chuỗi, có trường Previous Hash là chuỗi toàn số 0.',
  },
  {
    id: 'mining-04',
    topic_slug: 'mining',
    topic_name_vn: 'Khai thác & PoW',
    type: 'single',
    question_vn: 'Tại sao việc giả mạo một giao dịch trong một khối cũ lại làm đứt gãy toàn bộ chuỗi khối phía sau?',
    difficulty: 'hard',
    options: [
      { id: 'opt-a', text_vn: 'Vì mã băm của khối bị sửa đổi, khiến trường Previous Hash của tất cả các khối sau không còn khớp', text_en: 'Previous Hash mismatch propagates forward', is_correct: true },
      { id: 'opt-b', text_vn: 'Vì toàn bộ mạng P2P sẽ tự động tắt nguồn', text_en: 'Network shuts down', is_correct: false },
      { id: 'opt-c', text_vn: 'Vì số lượng Nonce bị xóa về 0', text_en: 'Nonce reset', is_correct: false },
      { id: 'opt-d', text_vn: 'Vì độ khó của mạng sẽ tự động nhảy lên vô cực', text_en: 'Infinite difficulty', is_correct: false },
    ],
    explanation_vn: 'Mỗi khối đều chứa Previous Hash của khối đứng trước. Sửa 1 byte ở khối N làm đổi Hash(N), khiến khối N+1 chứa Previous Hash sai lệch và không còn hợp lệ, kéo theo sự sụp đổ dây chuyền của cả chuỗi.',
  },

  // 3. RSA CRYPTOGRAPHY
  {
    id: 'rsa-01',
    topic_slug: 'rsa',
    topic_name_vn: 'Mã hoá RSA',
    type: 'single',
    question_vn: 'RSA khoá 4096 bit dùng khi?',
    difficulty: 'medium',
    options: [
      { id: 'opt-a', text_vn: 'Luôn luôn', text_en: 'Always', is_correct: false },
      { id: 'opt-b', text_vn: 'Cần bảo mật cao hơn 2048', text_en: 'Need higher security than 2048', is_correct: true },
      { id: 'opt-c', text_vn: 'Ko bao giờ', text_en: 'Never', is_correct: false },
      { id: 'opt-d', text_vn: 'Chỉ test', text_en: 'Only for testing', is_correct: false },
    ],
    explanation_vn: 'RSA-2048 là tiêu chuẩn an toàn hiện nay. RSA-4096 được sử dụng trong các hệ thống đòi hỏi cấp độ bảo mật quân sự hoặc lưu trữ dài hạn (Root CA, hạ tầng PKI quốc gia) với sự đánh đổi về tốc độ tính toán.',
  },
  {
    id: 'rsa-02',
    topic_slug: 'rsa',
    topic_name_vn: 'Mã hoá RSA',
    type: 'single',
    question_vn: 'Trong quy trình mã hóa RSA thông điệp gửi cho Bob, Alice cần sử dụng khóa nào?',
    difficulty: 'easy',
    options: [
      { id: 'opt-a', text_vn: 'Khóa công khai của Bob (Bob\'s Public Key)', text_en: 'Bob\'s Public Key', is_correct: true },
      { id: 'opt-b', text_vn: 'Khóa bí mật của Alice (Alice\'s Private Key)', text_en: 'Alice\'s Private Key', is_correct: false },
      { id: 'opt-c', text_vn: 'Khóa bí mật của Bob (Bob\'s Private Key)', text_en: 'Bob\'s Private Key', is_correct: false },
      { id: 'opt-d', text_vn: 'Khóa công khai của Alice (Alice\'s Public Key)', text_en: 'Alice\'s Public Key', is_correct: false },
    ],
    explanation_vn: 'Để đảm bảo tính bí mật, người gửi (Alice) dùng Khóa công khai của người nhận (Bob) để mã hóa. Chỉ Bob mới sở hữu Khóa bí mật tương ứng để giải mã thông điệp.',
  },
  {
    id: 'rsa-03',
    topic_slug: 'rsa',
    topic_name_vn: 'Mã hoá RSA',
    type: 'single',
    question_vn: 'Khi tạo Chữ ký số (Digital Signature), người ký sử dụng khóa nào để tạo chữ ký?',
    difficulty: 'medium',
    options: [
      { id: 'opt-a', text_vn: 'Khóa công khai của người nhận', text_en: 'Receiver public key', is_correct: false },
      { id: 'opt-b', text_vn: 'Khóa bí mật của người ký (Signer\'s Private Key)', text_en: 'Signer private key', is_correct: true },
      { id: 'opt-c', text_vn: 'Khóa đối xứng dùng chung', text_en: 'Shared key', is_correct: false },
      { id: 'opt-d', text_vn: 'Khóa công khai của chính mình', text_en: 'Own public key', is_correct: false },
    ],
    explanation_vn: 'Chữ ký số được tạo bằng cách mã hóa giá trị băm của tài liệu bằng Khóa bí mật (Private Key) của người gửi. Bất kỳ ai cũng có thể dùng Khóa công khai của người gửi để xác minh tính xác thực và tính toàn vẹn.',
  },
  {
    id: 'rsa-04',
    topic_slug: 'rsa',
    topic_name_vn: 'Mã hoá RSA',
    type: 'single',
    question_vn: 'Hàm số Euler phi(n) của n = p * q (với p, q là hai số nguyên tố) được tính bằng công thức nào?',
    difficulty: 'hard',
    options: [
      { id: 'opt-a', text_vn: 'phi(n) = (p - 1) * (q - 1)', text_en: 'phi(n) = (p - 1)(q - 1)', is_correct: true },
      { id: 'opt-b', text_vn: 'phi(n) = p * q - 1', text_en: 'phi(n) = p*q - 1', is_correct: false },
      { id: 'opt-c', text_vn: 'phi(n) = (p + 1) * (q + 1)', text_en: 'phi(n) = (p + 1)(q + 1)', is_correct: false },
      { id: 'opt-d', text_vn: 'phi(n) = (p * q) / 2', text_en: 'phi(n) = (p * q)/2', is_correct: false },
    ],
    explanation_vn: 'Với hai số nguyên tố p và q, hàm phi Euler cho biết số lượng các số nguyên dương nhỏ hơn n và nguyên tố cùng nhau với n, được tính là phi(n) = (p - 1) * (q - 1).',
  },

  // 4. MERKLE TREE
  {
    id: 'merkle-01',
    topic_slug: 'merkle',
    topic_name_vn: 'Cây Merkle',
    type: 'single',
    question_vn: 'Merkle Root (Gốc Merkle) trong Block Header có vai trò chính là gì?',
    difficulty: 'easy',
    options: [
      { id: 'opt-a', text_vn: 'Đại diện tóm tắt duy nhất và cô đọng cho toàn bộ các giao dịch có trong khối', text_en: 'Cryptographic summary of all transactions in block', is_correct: true },
      { id: 'opt-b', text_vn: 'Xác định thời gian khối được tạo ra', text_en: 'Timestamp', is_correct: false },
      { id: 'opt-c', text_vn: 'Lưu trữ mật khẩu của người đào khối', text_en: 'Miner password', is_correct: false },
      { id: 'opt-d', text_vn: 'Quy định số lượng đồng coin được phát hành', text_en: 'Supply cap', is_correct: false },
    ],
    explanation_vn: 'Merkle Root là giá trị băm đỉnh của cây Merkle, đại diện cho toàn bộ tập hợp giao dịch trong khối. Nếu một giao dịch bất kỳ bị thay đổi, Merkle Root sẽ thay đổi ngay lập tức.',
  },
  {
    id: 'merkle-02',
    topic_slug: 'merkle',
    topic_name_vn: 'Cây Merkle',
    type: 'single',
    question_vn: 'Nếu một khối chứa số lượng lá giao dịch lẻ (ví dụ 3 giao dịch: TxA, TxB, TxC), cây Merkle xử lý thế nào?',
    difficulty: 'medium',
    options: [
      { id: 'opt-a', text_vn: 'Tạo thêm 1 giao dịch rỗng', text_en: 'Add empty tx', is_correct: false },
      { id: 'opt-b', text_vn: 'Nhân đôi nút lá cuối cùng (TxC) để ghép cặp tạo thành số chẵn', text_en: 'Duplicate the last leaf', is_correct: true },
      { id: 'opt-c', text_vn: 'Hủy bỏ khối vì không hợp lệ', text_en: 'Reject block', is_correct: false },
      { id: 'opt-d', text_vn: 'Bỏ qua giao dịch thứ 3', text_en: 'Drop 3rd tx', is_correct: false },
    ],
    explanation_vn: 'Trong chuẩn thiết kế Bitcoin Merkle Tree, khi một tầng có số lượng nút lẻ, nút cuối cùng sẽ được nhân đôi (duplicate) để ghép cặp băm với chính nó.',
  },
  {
    id: 'merkle-03',
    topic_slug: 'merkle',
    topic_name_vn: 'Cây Merkle',
    type: 'single',
    question_vn: 'Độ phức tạp tính toán để kiểm tra một giao dịch có thuộc khối hay không bằng Merkle Proof (SPV) là bao nhiêu?',
    difficulty: 'hard',
    options: [
      { id: 'opt-a', text_vn: 'O(N) - Tuyến tính theo số lượng giao dịch', text_en: 'O(N)', is_correct: false },
      { id: 'opt-b', text_vn: 'O(log N) - Logarithm theo số lượng giao dịch', text_en: 'O(log N)', is_correct: true },
      { id: 'opt-c', text_vn: 'O(N^2) - Bậc hai', text_en: 'O(N^2)', is_correct: false },
      { id: 'opt-d', text_vn: 'O(1) - Hằng số', text_en: 'O(1)', is_correct: false },
    ],
    explanation_vn: 'Nhờ cấu trúc cây nhị phân, các ví nhẹ (SPV Node) chỉ cần tải log2(N) mã băm trung gian để chứng minh sự tồn tại của 1 giao dịch thay vì phải tải toàn bộ N giao dịch của khối.',
  },

  // 5. BLOCKCHAIN BASICS
  {
    id: 'bc-01',
    topic_slug: 'blockchain',
    topic_name_vn: 'Cơ bản Blockchain',
    type: 'single',
    question_vn: 'Blockchain là gì về bản chất công nghệ?',
    difficulty: 'easy',
    options: [
      { id: 'opt-a', text_vn: 'Một phần mềm diệt virus phi tập trung', text_en: 'Antivirus', is_correct: false },
      { id: 'opt-b', text_vn: 'Sổ cái phân tán (Distributed Ledger) lưu trữ dữ liệu theo chuỗi khối liên kết bằng mật mã học', text_en: 'Distributed ledger linked by cryptography', is_correct: true },
      { id: 'opt-c', text_vn: 'Một loại mạng xã hội mới', text_en: 'Social network', is_correct: false },
      { id: 'opt-d', text_vn: 'Cơ sở dữ liệu tập trung đặt tại máy chủ trung ương', text_en: 'Centralized DB', is_correct: false },
    ],
    explanation_vn: 'Blockchain là sổ cái số phân tán được chia sẻ giữa các nút trong mạng máy tính, lưu trữ thông tin dưới dạng các khối được liên kết bảo mật bằng các hàm băm mật mã.',
  },
  {
    id: 'bc-02',
    topic_slug: 'blockchain',
    topic_name_vn: 'Cơ bản Blockchain',
    type: 'single',
    question_vn: 'Vấn đề chi tiêu kép (Double Spending Problem) trong tiền kỹ thuật số được giải quyết nhờ cơ chế nào?',
    difficulty: 'medium',
    options: [
      { id: 'opt-a', text_vn: 'Sự đồng thuận phân tán và tính không thể đảo ngược của chuỗi Proof of Work', text_en: 'Consensus & PoW immutability', is_correct: true },
      { id: 'opt-b', text_vn: 'Một ngân hàng trung ương đứng ra kiểm duyệt từng giao dịch', text_en: 'Central bank', is_correct: false },
      { id: 'opt-c', text_vn: 'Khóa tài khoản của người gửi trong 24 giờ', text_en: 'Lock account', is_correct: false },
      { id: 'opt-d', text_vn: 'Mỗi người chỉ được phép gửi tiền 1 lần trong đời', text_en: 'One transaction per lifetime', is_correct: false },
    ],
    explanation_vn: 'Nhờ cơ chế đồng thuận PoW/PoS và quy tắc chuỗi dài nhất (Longest Chain Rule), mạng lưới thống nhất được thứ tự xuất hiện của các giao dịch, ngăn chặn việc 1 đồng coin bị gửi 2 lần.',
  },
  {
    id: 'bc-03',
    topic_slug: 'blockchain',
    topic_name_vn: 'Cơ bản Blockchain',
    type: 'single',
    question_vn: 'Tính bất biến (Immutability) của dữ liệu trên Blockchain được duy trì dựa trên yếu tố cốt lõi nào?',
    difficulty: 'hard',
    options: [
      { id: 'opt-a', text_vn: 'Hàm băm liên kết Previous Hash kết hợp sự đồng thuận của đa số nút mạng', text_en: 'Hash chaining + Majority consensus', is_correct: true },
      { id: 'opt-b', text_vn: 'Ổ cứng lưu trữ dữ liệu không thể xóa', text_en: 'Read-only HDD', is_correct: false },
      { id: 'opt-c', text_vn: 'Luật an ninh mạng quốc tế', text_en: 'International law', is_correct: false },
      { id: 'opt-d', text_vn: 'Cơ chế sao lưu dữ liệu lên đám mây của Google', text_en: 'Cloud backup', is_correct: false },
    ],
    explanation_vn: 'Tính bất biến đến từ sự kết hợp của mật mã học (chuỗi hàm băm liên kết) và kinh tế học mạng (chi phí để viết lại chuỗi dài hơn vượt quá lợi ích của kẻ tấn công).',
  },

  // 6. CRYPTOGRAPHY
  {
    id: 'crypto-01',
    topic_slug: 'cryptography',
    topic_name_vn: 'Mật mã học',
    type: 'single',
    question_vn: 'Sự khác biệt cốt lõi giữa mã hóa đối xứng (Symmetric) và bất đối xứng (Asymmetric) là gì?',
    difficulty: 'easy',
    options: [
      { id: 'opt-a', text_vn: 'Mã hóa đối xứng dùng chung 1 khóa, bất đối xứng dùng cặp khóa công khai và bí mật', text_en: 'Symmetric uses 1 key, asymmetric uses keypair', is_correct: true },
      { id: 'opt-b', text_vn: 'Mã hóa đối xứng chỉ chạy trên máy tính Windows', text_en: 'Windows only', is_correct: false },
      { id: 'opt-c', text_vn: 'Mã hóa bất đối xứng không thể giải mã được', text_en: 'Cannot decrypt', is_correct: false },
      { id: 'opt-d', text_vn: 'Mã hóa đối xứng chỉ dùng cho giao dịch Bitcoin', text_en: 'Bitcoin only', is_correct: false },
    ],
    explanation_vn: 'Mã hóa đối xứng (AES, DES) dùng cùng 1 khóa bí mật cho cả mã hóa và giải mã. Mã hóa bất đối xứng (RSA, ECC) sử dụng cặp khóa: Public Key để mã hóa/xác minh và Private Key để giải mã/ký.',
  },
  {
    id: 'crypto-02',
    topic_slug: 'cryptography',
    topic_name_vn: 'Mật mã học',
    type: 'single',
    question_vn: 'Thuật toán đường cong elliptic (ECDSA / secp256k1) được Bitcoin sử dụng chủ yếu để làm gì?',
    difficulty: 'medium',
    options: [
      { id: 'opt-a', text_vn: 'Tạo cặp khóa ví (Public/Private Key) và ký xác thực giao dịch', text_en: 'Keypair & signing', is_correct: true },
      { id: 'opt-b', text_vn: 'Tính toán Merkle Root', text_en: 'Calculate Merkle', is_correct: false },
      { id: 'opt-c', text_vn: 'Đo lường thời gian tạo khối', text_en: 'Block timer', is_correct: false },
      { id: 'opt-d', text_vn: 'Tăng tốc độ mạng P2P', text_en: 'P2P acceleration', is_correct: false },
    ],
    explanation_vn: 'Bitcoin sử dụng đường cong elliptic secp256k1 để sinh khóa và chữ ký số ECDSA nhằm chứng minh quyền sở hữu tài sản với độ dài khóa ngắn và hiệu năng vượt trội.',
  },

  // 7. P2P NETWORK & NODES
  {
    id: 'p2p-01',
    topic_slug: 'p2p',
    topic_name_vn: 'Mạng P2P & Node',
    type: 'single',
    question_vn: 'Full Node trong mạng lưới Blockchain có nhiệm vụ gì?',
    difficulty: 'easy',
    options: [
      { id: 'opt-a', text_vn: 'Lưu trữ toàn bộ lịch sử sổ cái và độc lập xác thực mọi giao dịch/khối theo quy tắc đồng thuận', text_en: 'Store full ledger & validate all blocks', is_correct: true },
      { id: 'opt-b', text_vn: 'Chỉ hiển thị số dư ví của cá nhân', text_en: 'Show balance only', is_correct: false },
      { id: 'opt-c', text_vn: 'Điều hành toàn bộ mạng lưới và có quyền sửa đổi số dư', text_en: 'Administer network', is_correct: false },
      { id: 'opt-d', text_vn: 'Cung cấp năng lượng điện cho các máy đào', text_en: 'Power supply', is_correct: false },
    ],
    explanation_vn: 'Full Node là xương sống của tính phi tập trung: mỗi full node độc lập tải về, lưu trữ toàn bộ chuỗi khối và kiểm tra tính hợp lệ của từng block mà không cần tin tưởng bất kỳ ai.',
  },
  {
    id: 'p2p-02',
    topic_slug: 'p2p',
    topic_name_vn: 'Mạng P2P & Node',
    type: 'single',
    question_vn: 'Giao thức lan truyền thông tin trong mạng P2P của Blockchain thường được gọi là gì?',
    difficulty: 'medium',
    options: [
      { id: 'opt-a', text_vn: 'Gossip Protocol (Giao thức lan truyền tin đồn)', text_en: 'Gossip protocol', is_correct: true },
      { id: 'opt-b', text_vn: 'Central Broadcast Protocol', text_en: 'Central broadcast', is_correct: false },
      { id: 'opt-c', text_vn: 'Master-Slave Protocol', text_en: 'Master-slave', is_correct: false },
      { id: 'opt-d', text_vn: 'FTP Transfer Protocol', text_en: 'FTP', is_correct: false },
    ],
    explanation_vn: 'Gossip Protocol giúp mỗi node khi nhận được một giao dịch/khối mới hợp lệ sẽ nhanh chóng lan truyền (relay) thông tin đó cho các node hàng xóm, giúp toàn mạng đạt trạng thái đồng bộ.',
  },

  // 8. SMART CONTRACTS
  {
    id: 'sc-01',
    topic_slug: 'smart-contract',
    topic_name_vn: 'Smart Contract',
    type: 'single',
    question_vn: 'Hợp đồng thông minh (Smart Contract) là gì?',
    difficulty: 'easy',
    options: [
      { id: 'opt-a', text_vn: 'Chương trình máy tính tự động thực thi các điều khoản khi các điều kiện định sẵn được thỏa mãn', text_en: 'Self-executing program when conditions met', is_correct: true },
      { id: 'opt-b', text_vn: 'Hợp đồng pháp lý ký bằng bút mực trên giấy', text_en: 'Paper contract', is_correct: false },
      { id: 'opt-c', text_vn: 'Một phần mềm trò chuyện tự động bằng AI', text_en: 'Chatbot', is_correct: false },
      { id: 'opt-d', text_vn: 'Hợp đồng mua bán card đồ họa đào coin', text_en: 'GPU purchase agreement', is_correct: false },
    ],
    explanation_vn: 'Smart Contract là mã nguồn được triển khai trực tiếp trên Blockchain (như Ethereum), tự động chạy và thanh toán mà không cần bên trung gian thứ ba can thiệp.',
  },
  {
    id: 'sc-02',
    topic_slug: 'smart-contract',
    topic_name_vn: 'Smart Contract',
    type: 'single',
    question_vn: 'Khái niệm "Gas" trong mạng Ethereum có ý nghĩa gì?',
    difficulty: 'medium',
    options: [
      { id: 'opt-a', text_vn: 'Đơn vị đo lường lượng tài nguyên tính toán cần thiết để thực thi giao dịch hoặc smart contract', text_en: 'Computational effort unit', is_correct: true },
      { id: 'opt-b', text_vn: 'Nhiên liệu đốt chạy máy phát điện đào coin', text_en: 'Generator fuel', is_correct: false },
      { id: 'opt-c', text_vn: 'Tên một token chuyên thanh toán tiền điện', text_en: 'Token for utility bills', is_correct: false },
      { id: 'opt-d', text_vn: 'Tốc độ quay của quạt tản nhiệt', text_en: 'Fan speed', is_correct: false },
    ],
    explanation_vn: 'Gas là đơn vị định lượng công sức tính toán của EVM. Người gửi phải trả phí Gas (tính bằng Gwei) để trả công cho thợ đào/validator và ngăn chặn các cuộc tấn công vòng lặp vô tận (DDoS).',
  },

  // 9. SECURITY
  {
    id: 'sec-01',
    topic_slug: 'security',
    topic_name_vn: 'Bảo mật',
    type: 'single',
    question_vn: 'Tấn công 51% (51% Attack) trong mạng Proof of Work là gì?',
    difficulty: 'medium',
    options: [
      { id: 'opt-a', text_vn: 'Kẻ tấn công kiểm soát hơn 50% tổng sức mạnh băm (Hashrate) của mạng, có khả năng thực hiện chi tiêu kép và viết lại chuỗi', text_en: 'Controlling >50% hashrate to double spend', is_correct: true },
      { id: 'opt-b', text_vn: 'Đánh cắp 51% số coin trong ví người khác', text_en: 'Steal 51% coins', is_correct: false },
      { id: 'opt-c', text_vn: 'Tấn công làm hỏng 51% màn hình máy tính của thợ đào', text_en: 'Monitor damage', is_correct: false },
      { id: 'opt-d', text_vn: 'Giảm 51% giá trị của đồng coin trên sàn giao dịch', text_en: 'Price dump', is_correct: false },
    ],
    explanation_vn: 'Khi nắm giữ >50% hashrate, kẻ tấn công có thể tạo ra chuỗi khối bí mật dài hơn chuỗi công khai, từ đó đảo ngược các giao dịch của chính mình để thực hiện double spending.',
  },
  {
    id: 'sec-02',
    topic_slug: 'security',
    topic_name_vn: 'Bảo mật',
    type: 'single',
    question_vn: 'Nguyên tắc an toàn quan trọng nhất khi quản lý ví tiền mã hóa cá nhân (Non-custodial Wallet) là gì?',
    difficulty: 'easy',
    options: [
      { id: 'opt-a', text_vn: 'Bảo mật tuyệt đối Cụm từ khôi phục (Seed Phrase / Private Key) và không bao giờ chia sẻ cho bất kỳ ai', text_en: 'Never share seed phrase or private key', is_correct: true },
      { id: 'opt-b', text_vn: 'Chụp ảnh Private Key đăng lên Facebook để lưu giữ', text_en: 'Post on social media', is_correct: false },
      { id: 'opt-c', text_vn: 'Đặt mật khẩu ví là 123456 cho dễ nhớ', text_en: 'Simple password', is_correct: false },
      { id: 'opt-d', text_vn: 'Gửi Private Key cho admin hỗ trợ kỹ thuật qua Telegram', text_en: 'Send to fake admin', is_correct: false },
    ],
    explanation_vn: '"Not your keys, not your coins". Private Key / Seed Phrase là bằng chứng duy nhất chứng minh quyền sở hữu tài sản. Ai có được cụm từ này đều có toàn quyền chuyển sạch tài sản.',
  },
];

// Fisher-Yates Shuffle Algorithm for true randomness
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Helper to generate truly randomized questions for Timed Test / Certification Exam
export function generateTestQuestions(count = 40, customQuestions: Question[] = []): Question[] {
  // Combine builtin questions and custom questions
  const fullPool = [...ALL_QUESTIONS, ...customQuestions];
  
  // Deduplicate pool by question text / ID
  const uniquePoolMap = new Map<string, Question>();
  fullPool.forEach((q) => {
    if (!uniquePoolMap.has(q.id)) {
      uniquePoolMap.set(q.id, q);
    }
  });
  const pool = Array.from(uniquePoolMap.values());

  // Shuffle the entire question pool
  const shuffledPool = shuffleArray(pool);
  const selected: Question[] = [];

  for (let i = 0; i < count; i++) {
    const baseQ = shuffledPool[i % shuffledPool.length];
    
    // Optionally shuffle options for maximum randomness while preserving correct answer
    const shuffledOptions = shuffleArray(baseQ.options || []);

    selected.push({
      ...baseQ,
      id: `test-q-${i + 1}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      options: shuffledOptions,
    });
  }

  // Shuffle final list once more
  return shuffleArray(selected);
}
