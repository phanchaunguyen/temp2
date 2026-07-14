## Cài đặt & chạy thử

```bash
npm install
cd tới thư mục badminton-booking-app
npm run dev
```

## Cấu trúc thư mục

```
src/
├── types/                  # Kiểu dữ liệu khớp chính xác input/output từng endpoint
│   ├── auth.types.ts        # 5 endpoint /auth/*
│   ├── booking.types.ts     # 6 endpoint /courts, /bookings/*
│   ├── payment.types.ts     # 4 endpoint /payments/*
│   └── common.types.ts      # PaginatedResponse<T>, ApiError dùng chung
│
├── services/                # Lớp gọi API (1 hàm = 1 endpoint), tách biệt khỏi UI
│   ├── api.ts                # axios instance + interceptor gắn Bearer token + auto refresh
│   ├── auth.service.ts       # register, login, oauth, refresh, logout
│   ├── booking.service.ts    # searchCourts, getAvailability, createBooking, updateBooking, cancelBooking, getMyBookings
│   └── payment.service.ts    # createPayment, getPayment, getMyPayments
│
├── hooks/                    # Custom hooks bọc service + quản lý loading/error state
│   ├── useCourts.ts           # useCourts(), useCourtAvailability()
│   ├── useBookings.ts         # useMyBookings(), useBookingActions()
│   └── usePayments.ts         # usePaymentHistory(), usePayment(), useCreatePayment()
│
├── contexts/
│   └── AuthContext.tsx        # Session toàn cục: user, token, login/logout
│
├── components/
│   ├── layout/                # SideNavBar, TopNavBar, Footer, MainLayout (giữ nguyên bố cục gốc)
│   ├── courts/                # CourtCard, AvailabilityGrid (chọn khung giờ)
│   ├── bookings/               # BookingCard (sửa/hủy/thanh toán)
│   ├── payments/                # PaymentCard
│   └── common/                  # Pagination, LoadingSpinner, ErrorBanner, EmptyState, StatusBadges
│
├── pages/                     # 1 trang = 1 luồng nghiệp vụ
│   ├── HomePage.tsx             # Trang chủ + sân nổi bật (GET /courts)
│   ├── auth/
│   │   ├── LoginPage.tsx         # POST /auth/login, /auth/oauth
│   │   └── RegisterPage.tsx      # POST /auth/register
│   ├── courts/
│   │   ├── CourtSearchPage.tsx   # GET /courts (lọc + phân trang)
│   │   └── CourtDetailPage.tsx   # GET /courts/{id}/availability, POST /bookings
│   ├── bookings/
│   │   ├── MyBookingsPage.tsx    # GET /bookings/me, PUT & DELETE /bookings/{id}
│   │   └── BookingCheckoutPage.tsx # POST /payments
│   └── payments/
│       ├── PaymentHistoryPage.tsx # GET /payments
│       └── PaymentDetailPage.tsx  # GET /payments/{id} (poll khi PENDING, cập nhật qua webhook phía server)
│
├── routes/
│   ├── AppRouter.tsx           # Khai báo route, ánh xạ 1-1 tới các trang trên
│   └── ProtectedRoute.tsx      # Chặn truy cập khi chưa đăng nhập (đặt sân, thanh toán)
│
├── App.tsx                    # BrowserRouter + AuthProvider
├── main.tsx                   # Điểm khởi chạy
└── index.css                  # Tailwind directives + style dùng chung (giữ token màu/spacing gốc)
```

## Ánh xạ API 

| # | Endpoint | Method | File xử lý |
|---|----------|--------|-----------|
| 1 | `/api/v1/auth/register` | POST | `services/auth.service.ts` → `pages/auth/RegisterPage.tsx` |
| 2 | `/api/v1/auth/login` | POST | `services/auth.service.ts` → `pages/auth/LoginPage.tsx` |
| 3 | `/api/v1/auth/oauth` | POST | `services/auth.service.ts` → `pages/auth/LoginPage.tsx` |
| 4 | `/api/v1/auth/refresh` | POST | `services/api.ts` (tự động khi gặp 401) |
| 5 | `/api/v1/auth/logout` | POST | `services/auth.service.ts` → `components/layout/TopNavBar.tsx` |
| 6 | `/api/v1/courts` | GET | `services/booking.service.ts` → `hooks/useCourts.ts` → `HomePage`, `CourtSearchPage` |
| 7 | `/api/v1/courts/{id}/availability` | GET | `hooks/useCourts.ts` → `pages/courts/CourtDetailPage.tsx` |
| 8 | `/api/v1/bookings` | POST | `hooks/useBookings.ts` → `CourtDetailPage.tsx` (409 Conflict hiển thị inline) |
| 9 | `/api/v1/bookings/{id}` | PUT | `hooks/useBookings.ts` → `MyBookingsPage.tsx` (modal đổi giờ) |
| 10 | `/api/v1/bookings/{id}` | DELETE | `hooks/useBookings.ts` → `MyBookingsPage.tsx` (nút hủy) |
| 11 | `/api/v1/bookings/me` | GET | `hooks/useBookings.ts` → `MyBookingsPage.tsx` |
| 12 | `/api/v1/payments` | POST | `hooks/usePayments.ts` → `BookingCheckoutPage.tsx` |
| 13 | `/api/v1/payments/webhook` | POST | Không gọi từ SPA — xử lý phía server (API Gateway → Lambda → RDS → SNS); `PaymentDetailPage.tsx` chỉ poll kết quả |
| 14 | `/api/v1/payments/{id}` | GET | `hooks/usePayments.ts` → `PaymentDetailPage.tsx` |
| 15 | `/api/v1/payments` | GET | `hooks/usePayments.ts` → `PaymentHistoryPage.tsx` |
