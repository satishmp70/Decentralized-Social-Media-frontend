import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// List of endpoints that require wallet authentication
const AUTH_REQUIRED_ENDPOINTS = [
  { method: 'POST', path: '/posts' },
  { method: 'POST', path: '/posts/:id/likes' },
  { method: 'POST', path: '/posts/:id/comments' },
];

// Add a request interceptor to add the wallet address to requests
api.interceptors.request.use((config) => {
  // Check if the endpoint requires authentication
  const requiresAuth = AUTH_REQUIRED_ENDPOINTS.some(({ method, path }) => {
    if (config.method?.toUpperCase() !== method) return false;
    const pattern = path.replace(/:id/g, '\\d+');
    return new RegExp(`^${pattern}$`).test(config.url?.replace(config.baseURL || '', '') || '');
  });

  if (requiresAuth) {
    // Get the wallet address from the window object
    const walletAddress = (window as any).walletAddress;
    if (!walletAddress) {
      throw new Error('Wallet not connected');
    }
    config.headers['X-Wallet-Address'] = walletAddress;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }

    // Handle 401 errors
    if (error.response?.status === 401) {
      console.error('Authentication required. Please connect your wallet.');
      throw new Error('Authentication required. Please connect your wallet.');
    }

    // Handle 429 (rate limit) errors
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Handle 500 errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.message);
      throw new Error('Server error. Please try again later.');
    }

    // Retry logic for specific errors
    if (
      (error.response?.status === 408 || error.code === 'ECONNABORTED') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        return await api(originalRequest);
      } catch (retryError) {
        throw new Error('Request failed after retry. Please try again later.');
      }
    }

    return Promise.reject(error);
  }
);

export default api; 