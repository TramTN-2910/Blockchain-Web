# Tài Liệu Yêu Cầu Dự Án, Tiến Độ & Kế Hoạch Triển Khai (HubBlock)

Tài liệu này tổng hợp toàn bộ Yêu cầu Tính năng, Kiến trúc Công nghệ, Tiến độ Đã thực hiện và Kế hoạch Tiếp theo nhằm đảm bảo không bao giờ bị quên context trong quá trình phát triển.

---

## 📌 1. Yêu Cầu Nền Tảng (Core Requirements)

### 🎨 1.1. Giao diện & Trải nghiệm Người dùng (UI/UX & Aesthetics)
- **Thiết kế**: Phong cách hiện đại (Glassmorphism, Gradient Text, Smooth animations).
- **Chủ đề (Theme)**: Hỗ trợ **Dark Mode** và **Light Mode** với chuyển đổi mượt mà.
- **Đa ngôn ngữ (i18n)**: Hỗ trợ **Tiếng Việt (VN)** và **Tiếng Anh (EN)** trên toàn bộ thanh điều hướng, bài học và câu hỏi quiz.
- **Thanh Điều Hướng (Navbar) & Phân quyền**:
  - Cố định trên đỉnh (Sticky Header backdrop-blur).
  - Định dạng **chữ nằm strictly trên 1 hàng (`whitespace-nowrap`)**, không xuống dòng.
  - **Đã loại bỏ** nút "Ôn tập câu sai" và nút công khai "Admin" khỏi thanh Navbar.
  - **Phân quyền Admin theo Role**: Để vào trang `/admin`, người dùng phải đăng nhập tài khoản có vai trò `role: admin`. Nút tắt Admin trên Navbar chỉ hiển thị khi đã đăng nhập tài khoản Admin.
  - **Cơ chế Active Link theo Module Prefix**: Kiểm tra tiền tố đường dẫn (`prefix: '/hash'`, `prefix: '/mining'`, `prefix: '/rsa'`, `prefix: '/quiz'`) giúp tab chính trên Navbar luôn giữ trạng thái active khi chuyển đổi giữa bất kỳ sub-tab nào.
- **Trải Nghiệm Chuyển Động Siêu Mượt (Smooth Transitions & Zero Delay)**:
  - Sử dụng **Framer Motion Sliding Pill (`layoutId`)** cho cả Navbar chính (`header-active-pill`), Sub-nav Hash (`hash-active-pill`) và Sub-nav Mining (`mining-active-pill`), tạo hiệu ứng khối màu trượt êm ái khi đổi tab.
  - Tích hợp `prefetch={true}` trên toàn bộ `<Link>` để tải trước tài nguyên, triệt tiêu độ trễ khi chuyển tab (0ms delay).
  - Component [PageTransition.tsx](file:///d:/Projects/Blockchain/src/components/layout/PageTransition.tsx) bọc nội dung trang với hiệu ứng Fade-up nhẹ nhàng.
  - **Thanh Cuộn Custom & Chống Giật Trang (`scrollbar-gutter: stable`)**: Thay thế thanh cuộn thô của trình duyệt bằng thanh cuộn tùy chỉnh siêu mảnh (6px), bo tròn viền, đổi màu tím/xám mượt mà theo Dark/Light Mode. Giữ ổn định kích thước viewport 100% không bị dịch chuyển/nháy khi trang dài ra hoặc ngắn lại.
  - **Mạng Lưới Node Động Toàn Hệ Thống (`BlockchainBackground.tsx`)**: Chạy Canvas 60 FPS thuần với hiệu ứng các nút hạt tròn/khối vuông (Block) phát xung sáng, dây nối đổi màu theo cự ly, chùm xung dữ liệu (Data Packet / Photon Pulse) di chuyển dọc sợi dây, tương tác lực hút/đẩy với con trỏ chuột và 2 vùng ánh sáng khuếch tán đa chiều (Depth of field glow). Tích hợp ở lớp nền toàn cục `RootLayout` cho tất cả các trang web.

---

### ⚙️ 1.2. Quy Tắc Kiến Trúc Kỹ Thuật (Engineering Rules & Best Practices)
- **State Management**:
  - `useThemeStore`: Quản lý theme light/dark (persist: `hubblock-theme`).
  - `useLanguageStore`: Quản lý ngôn ngữ vi/en (persist: `hubblock-language`).
  - `useAuthStore`: Quản lý người dùng, trạng thái đăng nhập và role `admin` / `user` (persist: `hubblock-auth-state`).
  - `useQuizStore`: Quản lý bài thi và hàng đợi câu làm sai (persist: `hubblock-quiz-state`).
- **Route Handlers / API Configuration**:
  - Các endpoint API trong `/src/app/api/...` (như `/api/admin/ai-parse`) phải luôn khai báo:
    ```typescript
    export const dynamic = 'force-dynamic';
    ```
    để Next.js không thực hiện static generation tại thời điểm build và tránh lỗi `PageNotFoundError / Failed to collect page data`.
- **Layout & Sub-Navigation**:
  - Mỗi module lớn (`/hash`, `/mining`, `/rsa`) đều có component SubNav riêng biệt và `layout.tsx` bọc container chuẩn, kèm `PageTransition`.

---

### 🏛 1.3. Cấu trúc Các Module Chức Năng (25+ Màn hình)

#### 1. Nhóm Trang chung & Thông tin dự án (General & Info)
- `home` (`/`): Trang chủ giới thiệu HubBlock, live SHA-256 preview, 4 tính chất quan trọng, chatbot icon.
- `project` (`/project`): Trang tổng quan & mục lục nội dung dự án.
- `team` (`/team`): Giới thiệu nhóm phát triển (SVNCKH 2025 - Đại học Ngân hàng TP.HCM).
- `profile` (`/profile`): Hồ sơ cá nhân, biểu đồ tiến độ học tập và huy hiệu thành tích.
- `chatbot` (`/chatbot`): Màn hình trợ lý ảo AI giải đáp thắc mắc Blockchain.
- `login` (`/login`): Màn hình đăng nhập tài khoản, hỗ trợ chọn role `user` / `admin` và nút Đăng nhập nhanh Demo.

#### 2. Module Mô phỏng Hàm Băm (Hash SHA-256 Simulation)
- `hash_explain` (`/hash/explain`): Lý thuyết & 4 thẻ nguyên lý SHA-256.
- `hash_interaction` (`/hash/interaction`): Giao diện thử nghiệm băm chuỗi trực tiếp (64 ký tự Hex định dạng 4 block/dòng).
- `hash_avalanche` (`/hash/avalanche`): So sánh 2 chuỗi khác 1 ký tự, trực quan hóa % Avalanche & tô màu các ký tự khác biệt.
- `hash_dodaicodinh` (`/hash/fixed-length`): Minh họa 4 trường hợp thử nghiệm đầu ra luôn cố định 64 hex chars = 256 bits.
- `hash_merkletree` (`/hash/merkle-tree`): Mô phỏng Cây Merkle (Thêm/sửa/xóa giao dịch & tự động tính toán Root Hash).

#### 3. Module Đào khối & Khám phá chuỗi (Mining & Explorer)
- `mining_lythuyet` (`/mining/theory`): Hệ tri thức 5 khái niệm cốt lõi Proof of Work (PoW).
- `mining_difficult` (`/mining/difficulty`): Phòng thí nghiệm điều chỉnh target difficulty (1–5) & đo lường số lần thử / quy luật ×16.
- `mining_dao` (`/mining/simulator`): Trình mô phỏng giải Nonce đào khối trực quan thời gian thực (Hashes/s, thời gian, số lần thử, highlight mã băm hợp lệ).
- `mining_explore` (`/mining/explorer`): Trình khám phá chuỗi khối (Block Explorer), hỗ trợ thêm khối, **Giả mạo (Tamper)** làm đứt gãy chuỗi và **Đào lại (Re-mine)** phục hồi tính toàn vẹn.

#### 4. Module Mật mã bất đối xứng (RSA Cryptography)
- `rsa_toanhoc` (`/rsa/math`): Cơ sở toán học RSA (Số nguyên tố, modulo, hàm Euler).
- `rsa_lythuyet1 .. 5` (`/rsa/theory/[step]`): Chuỗi 5 màn hình lý thuyết chi tiết về tạo khóa, mã hóa và giải mã RSA.
- `rsa_chukyso` (`/rsa/digital-signature`): Chữ ký số (Digital Signature).
- `rsa_thucte` (`/rsa/real-world`): Kịch bản ứng dụng thực tế.

#### 5. Module Đánh giá & Kiểm tra (Quiz & Assessment)
- `quiz` (`/quiz`): Trung tâm danh mục câu hỏi ôn tập & thi thử.
- `quiz_practice` (`/quiz/practice`): Luyện tập tự do từng câu (phản hồi đúng/sai tức thì + giải thích).
- `quiz_test` (`/quiz/test`): Bài kiểm tra tính giờ (Single/Multiple choice).
- `quiz_test_result` (`/quiz/result/[id]`): Kết quả thi & phân tích chi tiết.
- `quiz_review_wrong` (`/quiz/review-wrong`): **Cơ chế lặp lại ngắt quãng (Spaced Repetition)** - Tự động gom các câu làm sai từ các bài test trước để luyện tập lại cho đến khi thành thạo.

#### 6. Trang Quản trị Admin (Admin Portal)
- `admin` (`/admin`): Dashboard quản lý đề thi (bảo vệ bởi `AdminLayout` Route Guard).
- `admin_ai_import` (`/admin/ai-import`): **Mistral AI Engine** - Dán văn bản thô -> AI tự động bóc tách thành danh sách câu hỏi, phương án đúng/sai & lời giải chi tiết.

---

## 📈 2. Báo Cáo Tiến Độ Hiện Tại (Current Progress)

| Module / Hạng mục | Trạng thái | Ghi chú |
| :--- | :---: | :--- |
| **Tech Stack Base Code** | ✅ 100% | Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Zustand, Supabase client, Mistral SDK. |
| **Nav Bar & Theme/i18n** | ✅ 100% | Căn chỉnh `whitespace-nowrap`, không tràn dòng, sliding motion pill, EN/VI, Dark/Light toggle. |
| **Module Trang chủ (Home)** | ✅ 100% | Đã dựng hoàn chỉnh theo Ảnh inspiration (Hero badge, Live SHA-256 box, Stat counters, 4 Cards). |
| **Module Hash SHA-256 (5 trang)** | ✅ 100% | Dựng chính xác 100% theo 5 ảnh inspiration (Explain, Interaction, Avalanche, Fixed length, Merkle Tree) + Sliding SubNav. |
| **Module Khai Thác & Chuỗi Khối (4 trang)** | ✅ 100% | Dựng hoàn tất 100% theo 4 ảnh inspiration (Lý thuyết PoW, Thí nghiệm độ khó 1-5, Mô phỏng đào Nonce, Trình khám phá & Giả mạo Block) + Sliding SubNav. |
| **Admin AI Text Parser Route & Role Guard** | ✅ 100% | Phân quyền Admin theo Role (`useAuthStore` + `AdminLayout`), Endpoint `/api/admin/ai-parse` bóc tách đề thi Mistral AI (`force-dynamic`). |
| **Review Wrong Questions Queue** | ✅ 100% | State Zustand + Trang `/quiz/review-wrong` hỗ trợ làm lại các câu bị sai. |
| **RSA Module (Mật mã bất đối xứng)** | ✅ 100% | Dựng hoàn tất 100% theo 5 ảnh inspiration (Lý thuyết 1–5 Quy trình Alice & Bob, Khóa Public/Private, Stepper tương tác, Ví dụ thực tế + Khung Toán học, Thực tế, Chữ ký số). |
| **Quiz & Test Assessment Module (4 trang)** | ✅ 100% | Dựng chính xác 100% theo 4 ảnh inspiration (Quiz Hub 9 chủ đề, Luyện tập tự do tức thì + Giải thích, Thi thử 40 câu tính giờ 60p, Báo cáo kết quả & Xem lại chi tiết 40 câu). |
| **Team, Project & Profile Modules (3 trang)** | ✅ 100% | Dựng chính xác 100% theo 3 ảnh inspiration (Về Nhóm HUB/DS, Nội dung 6 thẻ trực quan hóa, Hồ sơ học viên & Lịch sử thi) kèm hiệu ứng Framer Motion sinh động. |
| **Admin Management Suite (4 tabs)** | ✅ 100% | Dashboard thống kê tổng quan + Ngân hàng câu hỏi CRUD (tìm kiếm, lọc, JSON export/import, modal xem trước) + AI Text Parser Import đề thi + Quản lý học viên & Lịch sử thi toàn hệ thống. |

---

## 📅 3. Kế Hoạch Tiếp Theo (Upcoming Action Plan)

1. **Toàn bộ 31 routes & 7 Modules chính**: Đã hoàn tất 100% kiến trúc, giao diện chuẩn Web3/Fintech, animation Framer Motion, hệ thống câu hỏi trắc nghiệm, nền canvas phi tập trung và trung tâm quản trị Admin.


---

## 💻 4. Lệnh Chạy Dự Án

```bash
# Lệnh phát triển (Dev Server)
npm run dev

# Lệnh kiểm thử sản xuất (Production Build)
npm run build

# Lệnh khởi chạy server (Production Start)
npm run start
```
