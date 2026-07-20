import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ConfirmationPage() {
  const { confirmRegistration } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Grab the username passed from the RegisterPage via React Router state
  const stateUsername = location.state?.username || '';

  const [username, setUsername] = useState(stateUsername);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await confirmRegistration(username, code);
      // redirect to login page
      navigate('/login', { state: { message: 'Tài khoản đã được xác thực thành công!' } });
    } catch (err: any) {
      setError(err.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Xác thực tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vui lòng nhập mã xác thực được gửi đến email của bạn.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm sm:leading-6 text-gray-900">
                <span className="font-semibold text-gray-700">Username: </span>
                {username}
               </p>
            </div>
            <div>
              <label htmlFor="code" className="sr-only">Mã xác thực</label>
              <input
                id="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Mã xác thực 6 số"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Confirming...' : 'Confirm Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}