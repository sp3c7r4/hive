import { create } from "zustand";
import { enrollmentsApi } from "@/services/api/enrollments.api";
import type { Enrollment } from "@/types/enrollment";

interface EnrollmentsState {
  enrollments: Enrollment[];
  isLoading: boolean;
  error: string | null;

  fetchEnrollments: () => Promise<void>;
  enroll: (courseId: number) => Promise<Enrollment | null>;
  clearError: () => void;
}

export const useEnrollmentsStore = create<EnrollmentsState>((set) => ({
  enrollments: [],
  isLoading: false,
  error: null,

  fetchEnrollments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await enrollmentsApi.list();
      set({ enrollments: data.data, isLoading: false });
    } catch (_err) {
      set({ error: "Failed to load enrollments", isLoading: false });
    }
  },

  enroll: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await enrollmentsApi.enroll({ courseId });
      set((s) => ({
        enrollments: [...s.enrollments, data.data],
        isLoading: false,
      }));
      return data.data;
    } catch (_err) {
      set({ error: "Failed to enroll", isLoading: false });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
