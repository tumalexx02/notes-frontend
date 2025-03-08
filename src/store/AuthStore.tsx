import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';
import api, { PREFIX } from '../helpers/API';

export interface User {
  id: string
  email: string
  name: string
  password_hash: string
  created_at: string
  updated_at: string
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  loginErrorMessage: string | null;
  registerErrorMessage: string | null;
  createAccount: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  refresh: () => Promise<void>;
  getMe: () => void;
  logout: () => void;
  clearErrors: () => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        accessToken: null,
        refreshToken: null,
        loginErrorMessage: null,
        registerErrorMessage: null,
        user: null,

        createAccount: async (name, email, password) => {
          try {
            const response = await axios.post(`${PREFIX}/user/register`, { name, email, password });
            const accessToken = response.data['tokens']['access_token'];
            const refreshToken = response.data['tokens']['refresh_token'];

            set({ accessToken: accessToken, refreshToken: refreshToken, registerErrorMessage: null });
          } catch (e) {
            if (e instanceof AxiosError) {
              const errorMessage = e.response?.data?.error || e.message;
              set({ registerErrorMessage: errorMessage });
            }
          }
        },

        login: async (email, password) => {
          try {
            const response = await axios.post(`${PREFIX}/user/login`, { email, password });
            const accessToken = response.data['tokens']['access_token'];
            const refreshToken = response.data['tokens']['refresh_token'];

            set({ accessToken: accessToken, refreshToken: refreshToken, loginErrorMessage: null });
          } catch (e) {
            if (e instanceof AxiosError) {
              const errorMessage = e.response?.data?.error || e.message;
              set({ loginErrorMessage: errorMessage });
            }
          }
        },

        refresh: async () => {
          try {
            const refreshToken = get().refreshToken;
            if (!refreshToken) throw new Error('No refresh token available');
        
            const response = await axios.post(`${PREFIX}/user/refresh`, { refresh_token: refreshToken });
            const accessToken = response.data['access_token'];
        
            console.log("New accessToken:", accessToken);
            set({ accessToken: accessToken });
          } catch (e) {
            console.error('Refresh token failed', e);
            set({ accessToken: null, refreshToken: null, user: null });
          }
        },

        getMe: async () => {
          try {
            const response = await api.get(`${PREFIX}/user/me`);

            set({ user: response.data['user'] })
          } catch (e) {
            console.error("Get user failed", e);
            get().logout();
          }

        },

        logout: () => {
          document.cookie = 'refresh_token=; path=/; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          set({ accessToken: null, refreshToken: null, user: null });
        },

        clearErrors() {
          set({ loginErrorMessage: null, registerErrorMessage: null });
        },
        clearUser() {
          set({ accessToken: null, refreshToken: null, user: null });
        }
      }),
      { 
        name: 'auth-store',
        partialize: (state) => ({ accessToken: state.accessToken, refreshToken: state.refreshToken }),
      }
    )
  )
);
