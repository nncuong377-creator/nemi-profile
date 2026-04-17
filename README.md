# NEMI — Digital Profile

Trang hồ sơ cá nhân cao cấp xây dựng với Next.js 14, Framer Motion, và tsParticles.

---

## 🚀 Chạy trên máy (localhost)

```bash
npm install
npm run dev
```

Mở trình duyệt: **http://localhost:3000**

> **Lưu ý về localhost**: Link `localhost:3000` chỉ hoạt động trên **máy tính của bạn**.
> Người khác KHÔNG thể truy cập vào link này. Muốn chia sẻ cho người khác → bạn cần **deploy**.

---

## 🔌 Cấu hình Telegram

1. Copy file `.env.local.example` thành `.env.local`
2. Điền token và chat ID:

```bash
cp .env.local.example .env.local
```

Chỉnh sửa `.env.local`:
```
TELEGRAM_BOT_TOKEN=your_actual_token
TELEGRAM_CHAT_ID=your_actual_chat_id
```

**Cách lấy token và chat ID:**
- **Bot Token**: Chat với [@BotFather](https://t.me/BotFather) → `/newbot` → copy token
- **Chat ID**: Chat với [@userinfobot](https://t.me/userinfobot) → copy số "Id"

---

## 🌐 Deploy lên Internet (Vercel — KHUYẾN NGHỊ)

### Tại sao chọn Vercel?

| Phương án | Chi phí | Ưu điểm | Nhược điểm |
|-----------|---------|---------|------------|
| **Vercel** ✅ | Miễn phí | Deploy 1-click, HTTPS tự động, CDN toàn cầu, 24/7, tối ưu Next.js | Giới hạn 100GB bandwidth/tháng (đủ dùng cá nhân) |
| Netlify | Miễn phí | Tương tự Vercel | Chậm hơn với Next.js |
| Ngrok | Miễn phí (giới hạn) | Expose localhost nhanh | Phụ thuộc máy bạn bật, link đổi mỗi lần, KHÔNG 24/7 |
| VPS (DigitalOcean) | $6/tháng | Full control | Phải tự quản lý server |
| GitHub Pages | Miễn phí | Đơn giản | **Không chạy được API routes** → mất tính năng Telegram |

### Hướng dẫn deploy Vercel (5 phút)

**Bước 1**: Push code lên GitHub
```bash
git init
git add .
git commit -m "Initial commit"
# Tạo repo trên github.com rồi:
git remote add origin https://github.com/YOUR_USERNAME/nemi-profile.git
git push -u origin main
```

**Bước 2**: Deploy
1. Vào [vercel.com](https://vercel.com) → Đăng nhập bằng GitHub
2. Click **"Add New Project"** → Chọn repo `nemi-profile`
3. Click **"Deploy"** (Vercel tự detect Next.js)

**Bước 3**: Thêm biến môi trường
1. Vào **Project Settings** → **Environment Variables**
2. Thêm 2 biến:
   - `TELEGRAM_BOT_TOKEN` = token của bạn
   - `TELEGRAM_CHAT_ID` = chat ID của bạn
3. Click **Save** → **Redeploy**

**Kết quả**: Bạn sẽ có link dạng `your-project.vercel.app`
- ✅ Chạy 24/7, không phụ thuộc máy bạn
- ✅ HTTPS tự động
- ✅ CDN toàn cầu (tải nhanh ở mọi nơi)
- ✅ Tự động deploy khi bạn push code mới lên GitHub

---

## 🎨 Cá nhân hóa

### Thay thông tin cá nhân

Mở `components/Hero.tsx`, tìm và sửa:
```tsx
const nameChars = "[TÊN CỦA BẠN]".split(""); // → Thay tên thật của bạn
const ROLES = [
  "Thành viên NEMI",
  "Creative Designer",   // → Thay bằng chức vụ thật
  ...
]
```

### Thay avatar
Upload ảnh của bạn vào `public/avatar.jpg`, sau đó sửa trong `Hero.tsx`:
```tsx
src="/avatar.jpg"  // đã đúng, chỉ cần upload file
```

### Thay links mạng xã hội
Mở `components/SocialLinks.tsx`, sửa các URL:
```tsx
{ url: "https://facebook.com/YOUR_PROFILE" }
{ url: "https://zalo.me/YOUR_PHONE" }
{ url: "https://linkedin.com/in/YOUR_PROFILE" }
```

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Particles**: @tsparticles/react
- **Fireworks**: canvas-confetti
- **Fonts**: Inter + Playfair Display (Google Fonts)
- **API**: Next.js Route Handlers → Telegram Bot API

## 📁 Cấu trúc

```
├── app/
│   ├── page.tsx              # Trang chính
│   ├── layout.tsx            # Layout + SEO metadata
│   ├── globals.css           # Global styles + custom animations
│   └── api/send-message/     # API gửi Telegram
├── components/
│   ├── Hero.tsx              # Section giới thiệu + typing animation
│   ├── SocialLinks.tsx       # Magnetic cards mạng xã hội
│   ├── FireworksButton.tsx   # Nút tặng quà + pháo hoa
│   ├── MessageForm.tsx       # Form lời nhắn + glassmorphism
│   ├── MiniGame.tsx          # Game bắt sao (30 giây)
│   └── ParticleBackground.tsx # Background particles
├── lib/
│   └── telegram.ts           # Logic gửi Telegram
└── public/
    └── avatar.svg            # Avatar placeholder
```
