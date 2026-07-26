import { FormEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login, loginWithOAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(''); // Accepts email, phone, or username
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Matches backend LoginRequest schema
      await login({ identifier, password });
      navigate('/');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (detail === 'User is not confirmed. Please verify your account.') {
        setError('Tài khoản chưa được xác thực. Vui lòng kiểm tra email hoặc SMS.');
      } else if (detail === 'Incorrect username or password') {
        setError('Tài khoản hoặc mật khẩu không đúng.');
      } else {
        setError(detail || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setError(null);
    try {
      await loginWithOAuth({ provider, auth_code: 'mock_auth_code' });
      navigate('/');
    } catch {
      setError(`Đăng nhập bằng ${provider} thất bại.`);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-headline-md font-bold text-primary">BookingCourts</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Đăng nhập để tiếp tục</p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container rounded-lg px-4 py-3 text-label-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-label-sm text-on-surface-variant">Tên đăng nhập / Email / Số điện thoại</label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
              placeholder="Nhập email, SĐT hoặc tên đăng nhập"
            />
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant">Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 disabled:opacity-60"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px bg-outline-variant flex-1" />
          <span className="text-label-sm text-on-surface-variant">hoặc</span>
          <div className="h-px bg-outline-variant flex-1" />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            className="border border-outline-variant py-3 rounded-lg font-bold text-label-md hover:bg-surface-container-low transition-colors"
          >
            Tiếp tục với Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('facebook')}
            className="border border-outline-variant py-3 rounded-lg font-bold text-label-md hover:bg-surface-container-low transition-colors"
          >
            Tiếp tục với Facebook
          </button>
        </div>

        <p className="text-center text-label-sm text-on-surface-variant">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}