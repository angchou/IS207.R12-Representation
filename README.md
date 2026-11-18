# Demo Tối Ưu Hiệu Năng Frontend (React 19 • Next.js 15 • Tailwind CSS)

Hệ thống slide thuyết trình tương tác cho 4 thành viên. Toàn bộ số liệu trong bài thuyết trình được đo trực tiếp từ trình duyệt và server Next.js khi chạy thực tế (không dùng script dàn dựng hay số liệu giả định).

## Chạy dự án

```bash
cd /home/ciigan/.gemini/antigravity/scratch/frontend-opt-demo
npm run dev
# Hoặc chạy bản build production để đo dung lượng bundle/CSS đã tối ưu:
npm run build && npm run start
```

Mở trình duyệt tại: http://localhost:3000

## Điều khiển giao diện Slide

- **Chọn Thành viên:** Các nút vuông đánh số `1`, `2`, `3`, `4` trên thanh header.
- **Chọn Slide:** Các nút vuông đánh số `1` đến `5` (tương ứng mã `1.1`..`4.5`).
- **Phím tắt bàn phím:**
  - `←` / `→`: Chuyển slide trước / tiếp theo.
  - `F` (hoặc nút `[Toàn màn hình (F)]`): Bật/tắt chế độ trình chiếu toàn màn hình (Fullscreen API).
  - `Esc`: Thoát chế độ toàn màn hình.

## Cấu trúc 4 phần & Cơ chế đo thật

1. **Thành viên 1 (`1.1` – `1.5`): React Rendering**
   - `1.1`: Đọc `performance.getEntriesByType("resource")` để thống kê file JS, CSS, Font đã tải.
   - `1.2`: Render bảng DOM thật (500 / 1,500 / 3,000 dòng) và đo thời gian commit bằng `<React.Profiler>` khi đặt state ở Cha so với State Colocation.
   - `1.3`: Đo thời gian lọc & sắp xếp 5,000 sản phẩm thật với `useMemo`, `useCallback`, `React.memo`.
   - `1.4`: Tách chunk `HeavyChartModal.tsx` (chứa `date-fns` + `zod`) bằng `React.lazy()` thật (không dùng `setTimeout` giả) và bắt chunk mới qua `PerformanceResourceTiming`.
   - `1.5`: Biểu đồ nhật ký commit thực tế thu từ `<React.Profiler>`.
2. **Thành viên 2 (`2.1` – `2.5`): Kiến trúc Next.js**
   - `2.1`: Nạp 2 route thật `/rsc-demo` (Server Component) và `/client-demo` (`"use client"`) cùng chạy `date-fns` + `zod` để đo chênh lệch JS bundle thực tế.
   - `2.2`: Gọi 3 HTTP request thật tới `/api/demo/slow` theo kiểu tuần tự (Waterfall) và song song (`Promise.all`).
   - `2.3`: Đọc `ReadableStream` thật từ `/api/demo/stream` để đối chiếu TTFB và tiến trình nhận từng chunk giữa Streaming và Blocking.
   - `2.4`: Kiểm thử `unstable_cache` và xóa cache tức thì bằng `revalidateTag("demo-isr-product")` qua `/api/demo/cache`.
   - `2.5`: Đối chiếu tổng thể CSR vs RSC + Streaming từ số liệu vừa đo.
3. **Thành viên 3 (`3.1` – `3.5`): Core Web Vitals & SEO**
   - `3.1`: Đo LCP, INP, CLS của phiên hiện tại bằng `PerformanceObserver`.
   - `3.2`: Đo điểm Layout Shift (`layout-shift`) thật khi ảnh nạp trễ không giữ khung so với `next/image`.
   - `3.3`: Kiểm tra file font self-host bởi `next/font/local` và thời điểm thực thi `/analytics-mock.js` (`strategy="lazyOnload"`).
   - `3.4`: Đọc trực tiếp các thẻ `<title>`, `<meta>` và Open Graph đang có trong `document.head`.
   - `3.5`: Fetch thật ảnh gốc `/lab/hero-4k.jpg` (3840x2160) và endpoint `/_next/image?url=%2Flab%2Fhero-4k.jpg&w=1200&q=75` để so sánh byte thực tế và định dạng `image/avif` / `image/webp`.
4. **Thành viên 4 (`4.1` – `4.5`): Tailwind CSS & Tổng kết**
   - `4.1` & `4.2`: Server đọc trực tiếp file CSS trong `.next/static/css` (kích thước raw, gzip, số rule) và quét số class token trong toàn bộ `src/` qua `/api/demo/css-stats`.
   - `4.3`: Thử nghiệm trực tiếp `cva` + `clsx` + `tailwind-merge` (`cn()`) trên `<SmartButton />`.
   - `4.4`: Bảng tổng kết tự động tổng hợp toàn bộ số liệu đã đo thật từ các slide trước trong phiên.
   - `4.5`: Code thực tế của `cn()` kèm bảng kiểm toán toàn bộ tài nguyên phiên trình duyệt.
