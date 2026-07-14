import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface TopNavBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function TopNavBar({ searchValue = '', onSearchChange }: TopNavBarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // calls Cognito GlobalSignOut via /api/v1/auth/logout
    navigate('/login');
  };

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-320px)] flex justify-between items-center h-16 px-gutter bg-surface/80 backdrop-blur-md z-40">
      <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-full w-96">
        <span className="material-symbols-outlined text-outline">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 text-label-md w-full ml-2"
          placeholder="Tìm sân cầu lông, địa điểm..."
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors" onClick={() => navigate('/bookings')}>
          <span className="material-symbols-outlined">history</span>
        </button>
        <div className="h-8 w-px bg-outline-variant mx-2" />

        {isAuthenticated ? (
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="hidden lg:block text-right">
              <p className="text-label-md text-on-surface">{user?.full_name}</p>
              <p className="text-label-sm text-primary">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-on-surface-variant hover:text-error transition-colors"
              title="Đăng xuất"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-on-primary px-5 py-2 rounded-full font-bold text-label-md hover:opacity-90"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}
