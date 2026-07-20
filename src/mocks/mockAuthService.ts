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
} from '@/types/auth.types';

function makeTokens(userId: string) {
  return {
    access_token: `mock-access-${userId}-${Date.now()}`,
    refresh_token: `mock-refresh-${userId}`,
  };
}

export const mockAuthService = {
  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    if (userStore.findByEmail(payload.email)) {
      return Promise.reject({ response: { status: 409, data: { detail: 'Email đã được sử dụng.' } } });
    }
    if (userStore.findByUsername(payload.username)) {
      return Promise.reject({ response: { status: 409, data: { detail: 'Tên người dùng đã được sử dụng.' } } });
    }
    const user_id = newId('user');
    const user: User & { password: string; username: string } = {
      user_id,
      cognito_sub: newId('sub'),
      username: payload.username, 
      email: payload.email,
      full_name: payload.full_name,
      password: payload.password,
    };
    userStore.save([...userStore.all(), user]);
    return delay({ user_id, message: 'Success' });
  },

  // login: async (payload: LoginRequest): Promise<LoginResponse> => {
  //   const user = userStore.findByEmail(payload.email);
  //   if (!user || user.password !== payload.password) {
  //     return Promise.reject({ response: { status: 401, data: { detail: 'Email hoặc mật khẩu không đúng.' } } });
  //   }
  //   const { password, ...user_data } = user;
  //   return delay({ ...makeTokens(user.user_id), user_data });
  // },

  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    
    const users = userStore.all();
    const user = users.find(u => u.username === payload.username); 

    if (!user || user.password !== payload.password) {
      return Promise.reject({ response: { status: 401, data: { detail: 'Username hoặc mật khẩu không đúng.' } } });
    }
    
    const { password, ...user_data } = user;
    return delay({ ...makeTokens(user.user_id), user_data });
  },

  // Demo OAuth: auto-provisions a user for the chosen provider, no real redirect.
  oauth: async (payload: OAuthRequest): Promise<OAuthResponse> => {
    const email = `${payload.provider}.demo@bookingcourts.vn`;
    let user = userStore.findByEmail(email);
    if (!user) {
      user = {
        user_id: newId('user'),
        cognito_sub: newId('sub'),
        username: `${payload.provider}-demo`,
        email,
        full_name: payload.provider === 'google' ? 'Google Demo User' : 'Facebook Demo User',
        password: '',
      };
      userStore.save([...userStore.all(), user]);
    }
    const { password, ...user_data } = user;
    return delay({ ...makeTokens(user.user_id), user_data });
  },

  refresh: async (payload: RefreshRequest): Promise<RefreshResponse> => {
    if (!payload.refresh_token?.startsWith('mock-refresh-')) {
      return Promise.reject({ response: { status: 401, data: { detail: 'Refresh token không hợp lệ.' } } });
    }
    return delay({ access_token: `mock-access-${Date.now()}` });
  },

  logout: async (): Promise<void> => {
    return delay(undefined, 200);
  },
};
