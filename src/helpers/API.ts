import axios from 'axios';
import { useAuthStore } from '../store/AuthStore';

export const PREFIX = 'http://localhost:8085';

const api = axios.create({
  baseURL: PREFIX,
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refresh } = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refresh();
        originalRequest.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Ошибка при обновлении токена:", err);
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;