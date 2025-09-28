# Hướng dẫn cấu hình Google Video Intelligence API

## Bước 1: Tạo Google Cloud Project
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Kích hoạt Video Intelligence API

## Bước 2: Tạo API Key
1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy API key được tạo
4. (Tùy chọn) Giới hạn API key cho Video Intelligence API

## Bước 3: Cấu hình trong dự án
Tạo file `.env.local` trong thư mục root của dự án:

```env
GOOGLE_VIDEO_INTELLIGENCE_API_KEY=your_actual_api_key_here
```

## Bước 4: Kiểm tra
- Khởi động lại server: `npm run dev`
- Truy cập `/video` và upload video để test
- Nếu API key hợp lệ, sẽ sử dụng Google API thực
- Nếu không, sẽ sử dụng mock data để demo

## Lưu ý
- API key cần có quyền truy cập Video Intelligence API
- Có thể có giới hạn quota/chi phí
- Mock data sẽ được sử dụng khi API key không hợp lệ
