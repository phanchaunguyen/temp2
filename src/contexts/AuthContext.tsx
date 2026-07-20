import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { LoginRequest, OAuthRequest, RegisterRequest, User } from '@/types/auth.types';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

// interface AuthContextValue {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (payload: LoginRequest) => Promise<void>;
//   register: (payload: RegisterRequest) => Promise<void>;
//   loginWithOAuth: (payload: OAuthRequest) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// const USER_KEY = 'user_data';

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const stored = localStorage.getItem(USER_KEY);
//     const token = localStorage.getItem('access_token');
//     if (stored && token) {
//       setUser(JSON.parse(stored));
//     }
//     setIsLoading(false);
//   }, []);

//   const persistSession = (userData: User, accessToken: string, refreshToken: string) => {
//     localStorage.setItem('access_token', accessToken);
//     localStorage.setItem('refresh_token', refreshToken);
//     localStorage.setItem(USER_KEY, JSON.stringify(userData));
//     setUser(userData);
//   };

//   const login = useCallback(async (payload: LoginRequest) => {
//     const res = await authService.login(payload);
//     persistSession(res.user_data, res.access_token, res.refresh_token);
//   }, []);

//   const register = useCallback(async (payload: RegisterRequest) => {
//     await authService.register(payload);
//     // Cognito requires email confirmation before first login in this design.
//   }, []);

//   const loginWithOAuth = useCallback(async (payload: OAuthRequest) => {
//     const res = await authService.oauth(payload);
//     persistSession(res.user_data, res.access_token, res.refresh_token);
//   }, []);

//   const logout = useCallback(async () => {
//     try {
//       await authService.logout(); // Cognito GlobalSignOut
//     } finally {
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       localStorage.removeItem(USER_KEY);
//       setUser(null);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ user, isAuthenticated: !!user, isLoading, login, register, loginWithOAuth, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// }








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
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (USE_MOCK) {
          // 1. Mock Environment: Load from LocalStorage
          const stored = localStorage.getItem(USER_KEY);
          if (stored) setUser(JSON.parse(stored));
        } else {
          // 2. Real Environment: Fetch session from Cognito
          const currentUser = await getCurrentUser();
          const attributes = await fetchUserAttributes();
          
          setUser({
            user_id: currentUser.userId,
            cognito_sub: currentUser.userId,
            username: currentUser.username,
            email: attributes.email || '',
            full_name: attributes.name || '',
            // password: '', 
          });
        }
      } catch (error) {
        // No active session found; user remains null
        console.debug('No active session.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const persistMockSession = (userData: User, accessToken?: string, refreshToken?: string) => {
    if (accessToken) localStorage.setItem('access_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await authService.login(payload);
    
    if (USE_MOCK && res.user_data) {
      persistMockSession(res.user_data, res.access_token, res.refresh_token);
    } else {
      // After successful Cognito login, fetch the user data
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      setUser({
        user_id: currentUser.userId,
        cognito_sub: currentUser.userId,
        username: currentUser.username,
        email: attributes.email || '',
        full_name: attributes.name || '',
        // password: '',
      });
    }
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    await authService.register(payload);
  }, []);

  // NEW: Added confirmRegistration
  const confirmRegistration = useCallback(async (username: string, code: string) => {
    // Note: Assuming you added confirmRegistration to your mockAuthService as well, 
    // or you can conditionally bypass it for mocks.
    // @ts-ignore - bypassing type check if you didn't add it to mockAuthService yet
    await authService.confirmRegistration(username, code);
  }, []);

  const loginWithOAuth = useCallback(async (payload: OAuthRequest) => {
    const res = await authService.oauth(payload);
    persistMockSession(res.user_data, res.access_token, res.refresh_token);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout(); 
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, confirmRegistration, loginWithOAuth, logout }}
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


