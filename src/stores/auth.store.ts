import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isSessionLoading: boolean;

  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setSessionLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isSessionLoading: true,

      setAccessToken: (token) =>
        set({ accessToken: token, isAuthenticated: true }),

      setUser: (user) => set({ user }),

      setSessionLoading: (loading) => set({ isSessionLoading: loading }),

      clear: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          isSessionLoading: false,
        }),
    }),
    {
      name: "hive-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
