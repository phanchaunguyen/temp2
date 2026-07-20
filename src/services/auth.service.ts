import { apiClient } from './api';
import { signIn, signUp, signOut, confirmSignUp } from 'aws-amplify/auth';
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

// When VITE_USE_MOCK_API=true (see .env), all calls are served from an
// in-browser localStorage mock instead of hitting the real FastAPI backend.
// This lets the UI be tested end-to-end before the backend is deployed.
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

//////////////////////////// LEGACY ////////////////////////////////////
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

  // 5. POST /api/v1/auth/logout — Bearer token via interceptor, returns 204
  logout: () => apiClient.post<void>('/auth/logout'),
};
//////////////////////////// LEGACY ////////////////////////////////////




const cognitoAuthService = {
  register: async (payload: RegisterRequest): Promise<any> => {
    // AWS Amplify v6 sign up
    const { isSignUpComplete, nextStep } = await signUp({
      username: payload.username,
      password: payload.password,
      options: {
        userAttributes: {
          email: payload.email,
          // full name will be added here if needed
          // name: payload.full_name 
        }
      }
    });
    return { message: 'Success', isSignUpComplete, nextStep };
  },

  // Cognito forced email verification.
  confirmRegistration: async (username: string, confirmationCode: string) => {
    const { isSignUpComplete, nextStep } = await confirmSignUp({ username, confirmationCode });
    return { isSignUpComplete, nextStep };
  },

  login: async (payload: LoginRequest): Promise<any> => {
    const { isSignedIn, nextStep } = await signIn({
      username: payload.username,
      password: payload.password,
    });
    
    // Amplify automatically handles storing the JWT tokens in local storage
    // Do not return the tokens here manually
    return { message: 'Login successful', isSignedIn, nextStep };
  },

  // Fallback to legacy for OAuth authen
  oauth: realAuthService.oauth, 

  refresh: async (payload: RefreshRequest): Promise<any> => {
    // Amplify automatically refreshes tokens when using fetchAuthSession()
    return { access_token: 'handled-by-amplify' };
  },

  logout: async (): Promise<void> => {
    // Clears the Cognito session from the browser
    await signOut(); 
    
    // await realAuthService.logout();
  },
};




export const authService = USE_MOCK ? mockAuthService : cognitoAuthService;
