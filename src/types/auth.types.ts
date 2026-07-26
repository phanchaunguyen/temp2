export interface User {
  user_id: string;
  cognito_sub: string;
  username: string;
  email: string;
  full_name: string;
}

// 1. POST /api/v1/auth/register
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
}
export interface RegisterResponse {
  user_id: string;
  message: string; // "Success"
}

export interface ConfirmRequest {
  username: string; 
  code: string;     // The 6-digit OTP code
}

export interface ConfirmResponse {
  message: string;
}

// 2. POST /api/v1/auth/login
export interface LoginRequest {
  identifier: string;
  password: string;
}
export interface AuthTokens {
  access_token: string; // Cognito JWT, ~15 min TTL
  refresh_token: string; // revokable
}
export interface LoginResponse extends AuthTokens {
  user_data: User;
}

// 3. POST /api/v1/auth/oauth
export type OAuthProvider = 'google' | 'facebook';
export interface OAuthRequest {
  provider: OAuthProvider;
  auth_code: string;
}
export interface OAuthResponse extends AuthTokens {
  user_data: User;
}

// 4. POST /api/v1/auth/refresh
export interface RefreshRequest {
  refresh_token: string;
}
export interface RefreshResponse {
  access_token: string;
}

// 5. POST /api/v1/auth/logout — Bearer token header only, 204 No Content



export interface AuthServiceContract {
  register: (payload: RegisterRequest) => Promise<RegisterResponse>;
  login: (payload: LoginRequest) => Promise<LoginResponse>;
  confirmRegistration: (payload: ConfirmRequest) => Promise<ConfirmResponse>;
  oauth: (payload: OAuthRequest) => Promise<OAuthResponse>;
  refresh: (payload: RefreshRequest) => Promise<RefreshResponse>;
  logout: () => Promise<void>;
}
