## MConnect FE

Nền tảng kết nối Mentor–Mentee, học tập và làm việc theo kinh nghiệm. Dự án được xây dựng bằng Next.js (App Router), tập trung vào trải nghiệm realtime (chat, thông báo, cuộc gọi) và hệ sinh thái khóa học, blog, lịch làm việc.

### Điểm nổi bật
- **Xác thực & phân quyền**: Login/Đăng ký/Quên mật khẩu/Xác minh email, refresh token, middleware điều hướng theo vai trò `ADMIN | STAFF | MENTOR | MENTEE | Guest`.
- **Bảng điều khiển theo vai trò**: Không gian làm việc riêng cho `Admin`, `Staff`, `Mentor`, `Mentee` tại `src/app/manage/*`.
- **Khóa học**: CRUD Category/Label/Course, Course Builder, trang khám phá và học tập cho Mentee.
- **Blog & Forum**: Quản trị bài viết (Admin/Staff) và hiển thị cho người dùng.
- **Chat realtime**: Room, gõ phím, đọc tin, thông báo bạn bè (Socket.IO).
- **Cuộc gọi VOICE/VIDEO**: WebRTC với STUN/TURN, luồng tín hiệu qua Socket.IO.
- **Lịch & Lịch làm việc**: FullCalendar, đặt lịch Mentor, quản lý lịch (mentee/mentor schedule).
- **Thông báo**: Realtime notification, dropdown thông báo theo vai trò.
- **Thanh toán**: Tích hợp VNPay (thư mục `src/app/payment/vnpay`).
- **3D & Media**: Tích hợp Three.js/React Three Fiber, nén model (draco/basis), trình phát media.
- **Hiệu năng & UI/UX**: TanStack Query/React Table, Radix UI, Tailwind v4, TipTap editor, GSAP/Framer Motion, Lenis smooth scroll.

---

## Kiến trúc & Công nghệ

- **Framework**: Next.js 15 (App Router, `output: 'standalone'`), React 19, TypeScript 5.
- **State/Server**: TanStack React Query v5, Zustand stores.
- **UI**: Tailwind CSS v4, Radix UI primitives, shadcn-like `src/components/ui`, TipTap editor.
- **Realtime**: `socket.io-client` (client), context `SocketProvider` quản lý kết nối và sự kiện.
- **WebRTC**: `useWebRTC` hook, STUN Google và TURN `turn.developgenderhealth.io.vn`.
- **Auth**: JWT, refresh flow, Next middleware (role-based guard), API routes proxy `src/app/api/auth/*`.
- **HTTP**: Wrapper `src/lib/http.ts` quản lý token, tự refresh/đăng xuất.
- **Forms/Validation**: `react-hook-form`, `zod`, `@hookform/resolvers`.
- **Data Table/Calendar**: `@tanstack/react-table`, FullCalendar.
- **3D/Media**: `three`, `@react-three/fiber`, `@react-three/drei`, decoders (draco/basis), `@vidstack/react`/artplayer.
- **Khác**: GSAP, Framer Motion, date-fns, Firebase (cấu hình `src/config/firebase-config.ts`).

Thư mục chính:
- `src/app`: routing, trang công khai `(public)`, nhóm auth, trang theo vai trò trong `manage/*`, API routes `app/api/auth/*` (login/logout/refresh/token/verify...).
- `src/apiRequests`: lớp gọi API phía client theo domain (auth, course, chat, payment, profile...).
- `src/components`: UI components, providers, Call/Chat UI, editor, upload, v.v.
- `src/hooks`: `useWebRTC`, `useProfile`, `useMobile`...
- `src/lib`: `http.ts` (fetch wrapper), utils, throttle.
- `src/stores`: Zustand stores (profileStore, friendsStore, notificationStore...).
- `src/schemaValidations`: `zod` schema cho dữ liệu form/API.
- `src/middleware.ts`: phân quyền và điều hướng theo token/role.
- `next.config.ts`: cấu hình Next.js (images remote, experimental flags, standalone build).

---

## Tính năng chi tiết (theo module)

### Xác thực & Phân quyền
- Trang: `/(public)/(auth)/*` gồm login, register, verify email, forgot/reset password, OAuth Google callback.
- API routes: `app/api/auth/*` proxy đến backend: `login`, `register`, `token`, `refresh-token`, `verify-email`, `forgot-password`, `reset-password`, `verify-forgot-password`, `logout`.
- Middleware `src/middleware.ts`:
  - Bảo vệ các đường dẫn `manage/*` theo vai trò.
  - Tự động điều hướng đến `/refresh-token` khi hết hạn access token.
  - Chặn truy cập các trang chưa đăng nhập đối với user đã đăng nhập.
- HTTP client `src/lib/http.ts` tự gắn Authorization, xử lý 401, chuyển hướng refresh/logout, lưu `accessToken`/`refreshToken` vào localStorage.

### Mentee
- Dashboard, hồ sơ, khám phá mentor, khóa học, gói kinh nghiệm làm việc.
- Lịch học/lịch làm việc (FullCalendar), giỏ hàng/đơn hàng, thông báo, nhắn tin.

### Mentor
- Dashboard, quản lý lịch làm việc, quản lý gói kinh nghiệm, Single Session.
- Quản trị nội dung khóa học: Category/Label/Course, Course Builder.

### Staff/Admin
- Dashboard, quản trị Mentee/Mentor, phê duyệt hồ sơ Mentor.
- Quản trị Blog/Tag, quản trị nội dung hệ thống.

### Chat & Cuộc gọi
- Socket events: gửi/nhận tin, trạng thái gõ, đánh dấu đã đọc, bạn bè online/offline.
- WebRTC: gọi voice/video, exchange offer/answer/ICE qua Socket.IO, TURN cấu hình sẵn.

### Thanh toán
- VNPay: màn hình thanh toán/return (`src/app/payment/vnpay/*`).

### 3D/Media
- Tải model glb (viking, village) trong `public/model`, kèm decoder Draco/Basis.
- Hiển thị bằng React Three Fiber/Drei; assets nằm trong `public/*` và `out/*` khi export.

---

## Yêu cầu hệ thống
- Node.js 20+
- npm 10+ (sử dụng `npm ci` để đồng bộ đúng lockfile)

---

## Biến môi trường
Định nghĩa trong `src/config.ts` (validate bằng `zod`). Tạo file `.env.local` khi chạy dev hoặc export trong Docker build.

```env
NEXT_PUBLIC_API_ENDPOINT=https://your-backend.example.com
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI=https://your-backend.example.com/users/oauth/google
```

Lưu ý: Dockerfile đang đặt sẵn giá trị build-time cho các biến trên. Bạn có thể override bằng build args hoặc sửa Dockerfile nếu cần.

---

## Cách chạy dự án (Local)

1) Cài dependencies
```bash
npm ci
```

2) Chạy dev (Turbopack)
```bash
npm run dev
# http://localhost:3000
```

3) Build & start production
```bash
npm run build
npm run start
# http://localhost:3000
```

---

## Docker

Dockerfile multi-stage đã có sẵn ở root.

### Build image
```bash
docker build \
  --build-arg NEXT_PUBLIC_API_ENDPOINT=https://your-backend.example.com \
  --build-arg NEXT_PUBLIC_URL=https://your-frontend.example.com \
  --build-arg NEXT_PUBLIC_SOCKET_URL=https://your-backend.example.com \
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id \
  --build-arg NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI=https://your-backend.example.com/users/oauth/google \
  -t mconnect-fe:latest .
```

Lưu ý: Dockerfile hiện đang `ENV` cứng một số biến. Nếu muốn dùng build-arg, hãy thay các dòng `ENV` bằng `ARG` + `ENV` tương ứng, hoặc sửa giá trị trực tiếp.

### Run container
```bash
docker run -d --name mconnect-fe -p 3000:3000 mconnect-fe:latest
# Truy cập http://localhost:3000
```

### Docker Compose (ví dụ)
```yaml
services:
  mconnect-fe:
    image: mconnect-fe:latest
    build:
      context: .
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_ENDPOINT: https://your-backend.example.com
      NEXT_PUBLIC_URL: https://your-frontend.example.com
      NEXT_PUBLIC_SOCKET_URL: https://your-backend.example.com
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: your-google-client-id
      NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI: https://your-backend.example.com/users/oauth/google
```

---

## CI/CD (ví dụ GitHub Actions)

Workflow ví dụ build & push Docker image. Sửa `REGISTRY`, `IMAGE_NAME`, secrets phù hợp.

```yaml
name: ci-cd

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install deps
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

  docker:
    runs-on: ubuntu-latest
    needs: build
    env:
      REGISTRY: ghcr.io
      IMAGE_NAME: ${{ github.repository }}
    steps:
      - uses: actions/checkout@v4

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
          build-args: |
            NEXT_PUBLIC_API_ENDPOINT=${{ secrets.NEXT_PUBLIC_API_ENDPOINT }}
            NEXT_PUBLIC_URL=${{ secrets.NEXT_PUBLIC_URL }}
            NEXT_PUBLIC_SOCKET_URL=${{ secrets.NEXT_PUBLIC_SOCKET_URL }}
            NEXT_PUBLIC_GOOGLE_CLIENT_ID=${{ secrets.NEXT_PUBLIC_GOOGLE_CLIENT_ID }}
            NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI=${{ secrets.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI }}
```

Triển khai: tùy môi trường (Kubernetes, VM, Docker host), kéo image `latest` và chạy với port 3000.

---

## Scripts
- `npm run dev`: chạy dev server (Turbopack)
- `npm run build`: build production
- `npm run start`: khởi chạy server production
- `npm run export`: export static (chỉ áp dụng cho một số trang tĩnh)
- `npm run lint`: chạy ESLint

---

## Lưu ý triển khai
- Cấu hình CORS và domain cho Socket.IO matching với `NEXT_PUBLIC_SOCKET_URL`.
- Cấu hình TURN server thực tế cho WebRTC nếu gọi video/voice qua internet (đã có mẫu trong `useWebRTC`).
- Đảm bảo backend cung cấp các endpoint trùng với `apiRequests/*` và các route auth proxy.
- Kiểm tra quyền truy cập qua cookie `role`, `accessToken`, `refreshToken` vì middleware sử dụng cookies để quyết định điều hướng.

---

## Giấy phép
Nội dung mã nguồn thuộc về nhóm dự án. Vui lòng liên hệ chủ kho để biết điều khoản sử dụng.
