import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// multiple requests failing simultaneously
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Push failed requests to a queue while the token is refreshing
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Execute the queued requests once the new token arrives
const onRefreshed = (accessToken: string) => {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
};

// REQUEST INTERCEPTOR: Attach the Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Handle 40Xs and auto-refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Add a custom flag to the request to prevent infinite loops
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if the error is 401, it hasn't been retried yet, and we aren't trying to refresh the token itself
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      // If there is no refresh token, force the user to log in
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // POST request to FastAPI refresh endpoint
          const res = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          const newAccessToken = res.data.access_token;
          
          // Save the new token
          localStorage.setItem('access_token', newAccessToken);
          
          // Tell all paused requests to resume with the new token
          isRefreshing = false;
          onRefreshed(newAccessToken);
          
        } catch (refreshError) {
          // If the refresh token itself is expired or invalid, kick them to login
          isRefreshing = false;
          refreshSubscribers = [];
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((newToken: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          resolve(apiClient(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);