import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login, loginWithOAuth } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ username, password });
      navigate('/');
    } catch {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // In production, auth_code comes back from the provider's OAuth redirect flow.
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
          {import.meta.env.VITE_USE_MOCK_API === 'true' && (
            <p className="text-label-sm text-on-surface-variant mt-2 bg-surface-container-low rounded-lg px-3 py-2">
              <span className="font-bold">demo_user / demo123456</span>, hoặc đăng ký tài khoản mới.
            </p>
          )}
        </div>

        {error && <div className="bg-error-container text-on-error-container rounded-lg px-4 py-3 text-label-md">{error}</div>}

        {import.meta.env.VITE_USE_MOCK_API === 'true' && (
          <button
            onClick={async () => {
              setUsername('demo_user');
              setPassword('demo123456');
              setError(null);
              setIsSubmitting(true);
              try {
                await login({ username: 'demo_user', password: 'demo123456' });
                navigate('/');
              } catch {
                setError('Không thể đăng nhập demo.');
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="bg-primary-container/20 text-primary border border-primary/30 py-3 rounded-lg font-bold text-label-md hover:bg-primary-container/30 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">bolt</span>
            Đăng nhập nhanh (tài khoản demo)
          </button>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-label-sm text-on-surface-variant">Tên đăng nhập</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
              placeholder="Nhập tên đăng nhập"
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
            onClick={() => handleOAuth('google')}
            className="border border-outline-variant py-3 rounded-lg font-bold text-label-md hover:bg-surface-container-low transition-colors"
          >
            Tiếp tục với Google
          </button>
          <button
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