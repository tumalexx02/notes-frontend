import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleMode: () => set((state) => {
        const newMode = state.mode === 'light' ? 'dark' : 'light';
        return { mode: newMode };
      }),
    }),
    {
      name: 'theme', // имя для ключа в localStorage
    }
  )
);