import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { LoginRequest, OAuthRequest, RegisterRequest, User } from '@/types/auth.types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  loginWithOAuth: (payload: OAuthRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = 'user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem('access_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const persistSession = (userData: User, accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await authService.login(payload);
    persistSession(res.user_data, res.access_token, res.refresh_token);
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    await authService.register(payload);
    // Cognito requires email confirmation before first login in this design.
  }, []);

  const loginWithOAuth = useCallback(async (payload: OAuthRequest) => {
    const res = await authService.oauth(payload);
    persistSession(res.user_data, res.access_token, res.refresh_token);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout(); // Cognito GlobalSignOut
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, loginWithOAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
