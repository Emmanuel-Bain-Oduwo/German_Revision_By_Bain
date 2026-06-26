import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { setTokens, clearTokens } from "@/lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const defaultUser: User = {
  id: 1,
  username: "learner",
  email: "learner@goetheprep.com",
  full_name: "German Learner",
  role: "student",
  target_level: "A1",
  native_language: "English",
  xp_points: 0,
  streak_days: 0,
  level: 1,
  total_study_minutes: 0,
  exam_readiness_a1: 0,
  exam_readiness_a2: 0,
  exam_readiness_b1: 0,
  is_active: true,
  is_verified: true,
  subscription_tier: "free",
  badges: [],
  created_at: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: defaultUser,
      isAuthenticated: true,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setLoading: (isLoading) => set({ isLoading }),

      login: (user, accessToken, refreshToken) => {
        setTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        clearTokens();
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
