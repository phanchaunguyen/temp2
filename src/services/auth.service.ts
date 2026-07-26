import { apiClient } from './api';
import { mockAuthService } from '@/mocks/mockAuthService';
import {
  LoginRequest,
  LoginResponse,
  OAuthRequest,
  OAuthResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/types/auth.types';

import { 
  signIn, 
  signUp, 
  signOut, 
  confirmSignUp, 
  fetchAuthSession, 
  fetchUserAttributes 
} from 'aws-amplify/auth';


// When VITE_USE_MOCK_API=true (see .env), all calls are served from an
// in-browser localStorage mock instead of hitting the real FastAPI backend.
// This lets the UI be tested end-to-end before the backend is deployed.
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

const realAuthService = {
  // 1. POST /api/v1/auth/register
  register: (payload: RegisterRequest) =>
    apiClient.post<RegisterResponse>('/auth/register', payload).then((r) => r.data),

  // 2. POST /api/v1/auth/login
  login: (payload: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', payload).then((r) => r.data),

  // 3. POST /api/v1/auth/oauth
  oauth: (payload: OAuthRequest) =>
    apiClient.post<OAuthResponse>('/auth/oauth', payload).then((r) => r.data),

  // 4. POST /api/v1/auth/refresh
  refresh: (payload: RefreshRequest) =>
    apiClient.post<RefreshResponse>('/auth/refresh', payload).then((r) => r.data),

  // 5. POST /api/v1/auth/logout
  logout: () => apiClient.post<void>('/auth/logout'),
};

export const authService = USE_MOCK ? mockAuthService : realAuthService;