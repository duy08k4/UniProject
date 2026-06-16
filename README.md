# Xây dựng trang web hỗ trợ Khoa Môi trường và Tài nguyên quản lý đồ án tốt nghiệp - Giao diện (Frontend)

Tài liệu này hướng dẫn các bước để khởi chạy giao diện người dùng (UniProject) trên máy cục bộ, kết nối với máy chủ Backend để thực hiện Demo.

## 1. Yêu cầu hệ thống

- **Node.js:** Phiên bản 18.x hoặc cao hơn.
- **Trình quản lý gói:** npm.

## 2. Cấu hình môi trường (.env)

Tạo tệp `.env` tại thư mục gốc của dự án `UniProject` để định nghĩa đường dẫn kết nối đến API:

```env
# Địa chỉ máy chủ Backend đang chạy cục bộ
VITE_API_URL_LOCAL=http://localhost:3000

# (Tùy chọn) Địa chỉ máy chủ khi đã triển khai chính thức
VITE_API_URL=https://your-production-url.com
```

## 3. Các bước cài đặt và khởi chạy

1. **Cài đặt thư viện phụ thuộc**:Đảm bảo bạn đang ở trong thư mục dự án và chạy lệnh:

   ```bash
   npm install
   ```

2. **Khởi chạy giao diện người dùng**:Sử dụng Vite để chạy ứng dụng ở chế độ phát triển:

   ```bash
   npm run dev
   ```

   *Mặc định giao diện sẽ chạy tại địa chỉ: http://localhost:5173*

## 4. Các vai trò đăng nhập thử nghiệm (Demo)

Ứng dụng thực hiện phân quyền dựa trên tài khoản, bạn có thể thử nghiệm các giao diện khác nhau bằng cách đăng nhập với các vai trò:

- **Quản trị viên (Admin/RoomAdmin):** Quản lý lớp học, hội đồng và bảng điểm.
- **Giảng viên (Lecturer):** Duyệt đề tài và nhập điểm.
- **Sinh viên (Student):** Đăng ký đề tài và nộp báo cáo.

## 5. Danh mục công nghệ chính

- **Cốt lõi:** React 19, Vite.
- **Giao diện:** PrimeReact, TailwindCSS.
- **Quản lý trạng thái:** Redux Toolkit.
- **Biểu đồ:** Recharts.