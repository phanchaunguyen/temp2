export function Footer() {
  return (
    <footer className="mt-auto bg-surface-container border-t border-outline-variant py-stack-lg px-gutter flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex flex-col items-center md:items-start gap-2">
        <span className="text-label-md font-bold text-on-surface">BookingCourts</span>
        <p className="text-label-sm text-on-tertiary-fixed-variant">© 2026 BookingCourts. Nền tảng thể thao hiện đại.</p>
      </div>
      <div className="flex items-center gap-8">
        <a className="text-label-sm text-on-tertiary-fixed-variant hover:text-primary transition-colors" href="#">Điều khoản dịch vụ</a>
        <a className="text-label-sm text-on-tertiary-fixed-variant hover:text-primary transition-colors" href="#">Chính sách bảo mật</a>
        <a className="text-label-sm text-on-tertiary-fixed-variant hover:text-primary transition-colors" href="#">Liên hệ</a>
      </div>
    </footer>
  );
}
