import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ username, email, password, full_name: fullName });
      navigate('/confirm', { state: { username } });
    } catch {
      setError('Không thể đăng ký. Username hoặc Email có thể đã được sử dụng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-headline-md font-bold text-primary">Tạo tài khoản</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Bắt đầu hành trình cầu lông của bạn</p>
        </div>

        {error && <div className="bg-error-container text-on-error-container rounded-lg px-4 py-3 text-label-md">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-label-sm text-on-surface-variant">Tên đăng nhập</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
              placeholder="Tên đăng nhập của bạn"
            />
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant">Họ và tên</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
              placeholder="NguyenVanA@email.com"
            />
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant">Mật khẩu</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
              placeholder="Tối thiểu 8 ký tự"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 disabled:opacity-60 mt-2"
          >
            {isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-label-sm text-on-surface-variant">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}