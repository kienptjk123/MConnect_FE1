# Video Analysis Feature

## Tổng quan
Tính năng phân tích video sử dụng Google Video Intelligence AI để phát hiện các nội dung vi phạm trong video.

## Các loại vi phạm được phát hiện
- **Bạo lực**: Cảnh đánh nhau, vũ khí, máu, thương tích
- **Nội dung khiêu dâm**: Nội dung gợi cảm, khỏa thân
- **Trang phục không phù hợp**: Áo tắm, đồ lót, trang phục hở hang
- **Trẻ em không an toàn**: Trẻ em dưới 5 tuổi trong môi trường nguy hiểm
- **Ngôn từ không phù hợp**: Từ ngữ tục tĩu, xúc phạm
- **Hành động nguy hiểm**: Các hoạt động có thể gây thương tích

## Cách sử dụng
1. Truy cập `/video`
2. Upload file video (hỗ trợ các định dạng video phổ biến)
3. Click "Bắt đầu phân tích"
4. Xem kết quả phân tích chi tiết

## Cấu hình API
- Tạo file `.env.local` với API key Google Video Intelligence
- Xem `GOOGLE_API_SETUP.md` để biết chi tiết

## Mock Data
Khi API key không hợp lệ, hệ thống sẽ sử dụng mock data để demo với:
- 60% khả năng phát hiện vi phạm
- 6 loại vi phạm khác nhau
- Nội dung được phát hiện ngẫu nhiên
- Thời gian phân tích nhanh (< 1s)

## API Endpoints
- `POST /api/video/analyze`: Phân tích video và trả về kết quả

## Components
- `src/app/(public)/(guest)/video/page.tsx`: Trang chính
- `src/app/api/video/analyze/route.ts`: API endpoint
- `src/types/video.types.ts`: Type definitions
