import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// export const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
// });

// // Attach Bearer token to every request (auth, booking, payment endpoints all need it
// // except register/login/oauth/refresh and the public court search).
// apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   const token = localStorage.getItem('access_token');
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // On a 401, try /auth/refresh once using the stored refresh_token, then retry.
// let isRefreshing = false;
// let pendingQueue: Array<() => void> = [];

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

//     if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
//       const refreshToken = localStorage.getItem('refresh_token');
//       if (!refreshToken) return Promise.reject(error);

//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve) => {
//           pendingQueue.push(() => resolve(apiClient(originalRequest)));
//         });
//       }

//       isRefreshing = true;
//       try {
//         const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
//           refresh_token: refreshToken,
//         });
//         localStorage.setItem('access_token', data.access_token);
//         pendingQueue.forEach((resolve) => resolve());
//         pendingQueue = [];
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );



export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to inject the Cognito token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Fetch the current session managed by AWS Amplify
      const session = await fetchAuthSession();
      
      // Grab the ID Token (or Access Token, depending on your backend setup)
      const token = session.tokens?.idToken?.toString();

      if (token) {
        // Attach the token to the Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // If there's an error fetching the session (e.g., user is not logged in),
      // just proceed with the request without a token.
      console.debug('No active Cognito session found.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);