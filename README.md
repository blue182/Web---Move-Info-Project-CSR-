# Movie Info Project (CSR)

## Công Nghệ
- **HTML5**: Cung cấp cấu trúc trang web.
- **Vue.js 3**: Framework JavaScript cho Client-Side Rendering, xử lý giao diện người dùng.
- **Bootstrap 5.3**: Framework CSS giúp tạo giao diện đáp ứng và dễ sử dụng.
- **JavaScript (ES6)**: Xử lý logic ứng dụng, tương tác với API và các tính năng phía client.
- **Fetch API**: Để thực hiện các yêu cầu HTTP, lấy và xử lý dữ liệu từ server.
- **API Server**: Dữ liệu phim được lấy từ API tại `http://matuan.online:2422/api/`.

## Mô Tả
**Movie Info** là một ứng dụng web cung cấp thông tin về các bộ phim, bao gồm chi tiết phim, diễn viên, đánh giá và các bộ phim phổ biến. Người dùng có thể tra cứu thông tin về các bộ phim yêu thích của mình thông qua các tính năng tìm kiếm, phân trang và xem thông tin chi tiết phim. Dự án sử dụng Vue.js để xây dựng giao diện động, giúp người dùng có trải nghiệm mượt mà mà không cần tải lại trang.

### Các Tính Năng Chính:
- **Tìm kiếm phim**: Người dùng có thể tìm kiếm các bộ phim thông qua tên hoặc tên diễn viên.
- **Thông tin chi tiết phim**: Xem các thông tin chi tiết của từng bộ phim, bao gồm tên, diễn viên, đạo diễn, ngày phát hành và nhiều thông tin khác.
- **Danh sách phim phổ biến**: Hiển thị các bộ phim phổ biến hoặc có doanh thu cao nhất.
- **Đánh giá phim**: Người dùng có thể xem các đánh giá của từng bộ phim.
- **API tương tác**: Dữ liệu phim được lấy thông qua các yêu cầu HTTP từ API, cho phép tìm kiếm và phân trang.

### Kiến Trúc
- **Client-Side Rendering (CSR)**: Ứng dụng này sử dụng Vue.js để render giao diện phía client. Các yêu cầu HTTP được gửi đến server để lấy dữ liệu và sau đó render trang mà không cần tải lại toàn bộ.
- **Phân trang và Tìm kiếm**: Dữ liệu được phân trang và có thể tìm kiếm theo các tiêu chí khác nhau, như tên phim hoặc tên diễn viên.

---

### Cài Đặt và Chạy Dự Án

1. **Cài Đặt**:
   - Tải về và cài đặt các phụ thuộc bằng cách chạy:
     ```bash
     npm install
     ```

2. **Chạy Dự Án**:
   - Chạy ứng dụng với lệnh:
     ```bash
     npm run dev
     ```
   - Ứng dụng sẽ chạy tại địa chỉ `http://localhost:3000`.

---

### Liên Hệ
- GitHub: https://github.com/blue182

