import { delay, newId, userStore } from './mockData';
import {
  LoginRequest,
  LoginResponse,
  OAuthRequest,
  OAuthResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  ConfirmRequest,
  ConfirmResponse,
  AuthServiceContract
} from '@/types/auth.types';

function makeTokens(userId: string) {
  return {
    access_token: `mock-access-${userId}-${Date.now()}`,
    refresh_token: `mock-refresh-${userId}`,
  };
}

export const mockAuthService: AuthServiceContract = {
  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    console.log('[MOCK] Register:', payload);
    return { user_id: 'mock-user-id', message: 'Success' };
  },

  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    console.log('[MOCK] Login:', payload);
    if (payload.identifier === 'demo_user' && payload.password === 'demo123456') {
      return {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user_data: {
          user_id: '1',
          cognito_sub: 'mock-cognito-sub',
          email: 'demo@example.com',
          username: 'demo_user',
          full_name: 'Demo User',
          phone_number: '0123456789',
        },
      };
    }
    throw new Error('Invalid credentials');
  },

  confirmRegistration: async (payload: ConfirmRequest): Promise<ConfirmResponse> => {
    console.log('[MOCK] Confirm Registration:', payload);
    return { message: 'Account confirmed successfully' };
  },

  oauth: async (payload: OAuthRequest): Promise<OAuthResponse> => {
    console.log('[MOCK] OAuth Login:', payload);
    return {
      access_token: 'mock-oauth-access-token',
      refresh_token: 'mock-oauth-refresh-token',
      user_data: {
        user_id: '2',
        cognito_sub: 'mock-oauth-sub',
        email: `oauth-${payload.provider}@example.com`,
        username: `oauth_${payload.provider}`,
        full_name: `${payload.provider} User`,
        phone_number: '0123456789',
      },
    };
  },

  refresh: async (payload: RefreshRequest): Promise<RefreshResponse> => {
    console.log('[MOCK] Refresh token:', payload.refresh_token);
    return { access_token: 'mock-new-access-token' };
  },

  logout: async (): Promise<void> => {
    console.log('[MOCK] Logout');
  },
};