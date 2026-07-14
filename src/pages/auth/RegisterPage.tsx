import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ email, password, full_name: fullName });
      setSuccess(true);
    } catch {
      setError('Không thể đăng ký. Email có thể đã được sử dụng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-4 text-center">
          <span className="material-symbols-outlined text-6xl text-primary">mark_email_read</span>
          <h1 className="text-headline-md font-bold text-on-surface">Kiểm tra email của bạn</h1>
          <p className="text-body-md text-on-surface-variant">
            Chúng tôi đã gửi mã xác nhận đến <span className="font-bold">{email}</span>. Xác nhận tài khoản để bắt đầu đặt sân.
          </p>
          <Link to="/login" className="text-primary font-bold hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-headline-md font-bold text-primary">Tạo tài khoản</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Bắt đầu hành trình cầu lông của bạn</p>
        </div>

        {error && <div className="bg-error-container text-on-error-container rounded-lg px-4 py-3 text-label-md">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              placeholder="ban@email.com"
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
            className="bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 disabled:opacity-60"
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
