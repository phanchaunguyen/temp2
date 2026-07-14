import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { to: '/', icon: 'home', label: 'Trang chủ' },
  { to: '/courts', icon: 'search', label: 'Tìm kiếm' },
  { to: '/bookings', icon: 'event', label: 'Đặt sân của tôi' },
  { to: '/payments', icon: 'payments', label: 'Thanh toán' },
];

export function SideNavBar() {
  const { isAuthenticated } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-[320px] bg-surface-container-lowest border-r border-outline-variant shadow-sm z-50 flex flex-col p-6 gap-stack-lg">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-headline-md font-bold text-primary">BookingCourts</h1>
        <p className="text-label-sm text-on-surface-variant">Nền tảng đặt sân hiện đại</p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-full font-bold transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary-container scale-95'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:scale-[1.02]'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-label-md">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <NavLink
          to="/courts"
          className="bg-primary text-on-primary py-4 px-6 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Đặt sân ngay
        </NavLink>

        <div className="mt-6 flex flex-col gap-1">
          {isAuthenticated ? (
            <NavLink
              to="/account"
              className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-primary transition-colors text-label-sm"
            >
              <span className="material-symbols-outlined">person</span>
              Tài khoản
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-primary transition-colors text-label-sm"
            >
              <span className="material-symbols-outlined">login</span>
              Đăng nhập
            </NavLink>
          )}
          <a href="#" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-primary transition-colors text-label-sm">
            <span className="material-symbols-outlined">help</span>
            Hỗ trợ
          </a>
        </div>
      </div>
    </aside>
  );
}
