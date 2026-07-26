import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { apiClient } from '@/services/api';
import { LoginRequest, OAuthRequest, RegisterRequest, User } from '@/types/auth.types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  confirmRegistration: (username: string, code: string) => Promise<void>; 
  loginWithOAuth: (payload: OAuthRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const USER_KEY = 'user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to persist session tokens and user profile
  const persistSession = (userData: User, accessToken: string, refreshToken?: string) => {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem('access_token');

      if (storedUser && token) {
        try {
          // Optional: Verify token validity against /users/me
          const response = await apiClient.get('/users/me');
          setUser(response.data);
        } catch {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem(USER_KEY);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await authService.login(payload);
    persistSession(res.user_data, res.access_token, res.refresh_token);
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    await authService.register(payload);
  }, []);

  const confirmRegistration = useCallback(async (username: string, code: string) => {
    await authService.confirmRegistration({ username, code });
  }, []);

  const loginWithOAuth = useCallback(async (payload: OAuthRequest) => {
    const res = await authService.oauth(payload);
    persistSession(res.user_data, res.access_token, res.refresh_token);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        register, 
        confirmRegistration, 
        loginWithOAuth, 
        logout 
      }}
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