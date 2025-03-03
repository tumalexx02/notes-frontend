import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';
import { PREFIX } from '../helpers/API';

const setRefreshTokenInCookie = (refreshToken: string) => {
  document.cookie = `refresh_token=${refreshToken}; path=/; HttpOnly; Secure; SameSite=Strict`;
};

// const getRefreshTokenFromCookie = (): string | null => {
//   const match = document.cookie.match(new RegExp('(^| )refresh_token=([^;]+)'));
//   return match ? match[2] : null;
// };

export interface User {
  id: string
  email: string
  name: string
  password_hash: string
  created_at: string
  updated_at: string
}

interface AuthState {
  jwtToken: string | null;
  user: User | null;
  loginErrorMessage: string | null;
  registerErrorMessage: string | null;
  createAccount: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  getUserId: () => void;
  logout: () => void;
  clearErrors: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        jwtToken: null,
        loginErrorMessage: null,
        registerErrorMessage: null,
        user: null,

        createAccount: async (name, email, password) => {
          try {
            const response = await axios.post(`${PREFIX}/user/register`, { name, email, password });
            const accessToken = response.data['tokens']['access_token'];
            const refreshToken = response.data['tokens']['refresh_token'];

            set({ jwtToken: accessToken, registerErrorMessage: null });

            setRefreshTokenInCookie(refreshToken);
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

            set({ jwtToken: accessToken, loginErrorMessage: null });

            setRefreshTokenInCookie(refreshToken);
          } catch (e) {
            if (e instanceof AxiosError) {
              const errorMessage = e.response?.data?.error || e.message;
              set({ loginErrorMessage: errorMessage });
            }
          }
        },

        getUserId: async () => {
          const jwt = get().jwtToken;
          try {
            const response = await axios.get(`${PREFIX}/user/me`, {
              headers: {
                'Authorization': `Bearer ${jwt}`
              }
            });

            set({ user: response.data['user'] })
          } catch (e) {
            if (e instanceof AxiosError) {
              console.error(e)
            }
          }

        },

        logout: () => {
          document.cookie = 'refresh_token=; path=/; HttpOnly; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          
          set({ jwtToken: null, user: null });
        },

        clearErrors() {
          set({ loginErrorMessage: null, registerErrorMessage: null });
        },
      }),
      { 
        name: 'auth-store',
        partialize: (state) => ({ jwtToken: state.jwtToken }),
      }
    )
  )
);