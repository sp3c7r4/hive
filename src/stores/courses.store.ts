import { create } from "zustand";
import { coursesApi } from "@/services/api/courses.api";
import type {
  Course,
  CreateCourseInput,
  UpdateCourseInput,
} from "@/types/course";

interface CoursesState {
  courses: Course[];
  currentCourse: Course | null;
  isLoading: boolean;
  error: string | null;

  fetchCourses: () => Promise<void>;
  fetchCourse: (id: number) => Promise<void>;
  createCourse: (input: CreateCourseInput) => Promise<Course | null>;
  updateCourse: (id: number, input: UpdateCourseInput) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useCoursesStore = create<CoursesState>((set) => ({
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await coursesApi.list();
      set({ courses: data.data, isLoading: false });
    } catch (err) {
      set({ error: "Failed to load courses", isLoading: false });
    }
  },

  fetchCourse: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await coursesApi.getById(id);
      set({ currentCourse: data.data, isLoading: false });
    } catch (err) {
      set({ error: "Failed to load course", isLoading: false });
    }
  },

  createCourse: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await coursesApi.create(input);
      set((s) => ({
        courses: [...s.courses, data.data],
        isLoading: false,
      }));
      return data.data;
    } catch (err) {
      set({ error: "Failed to create course", isLoading: false });
      return null;
    }
  },

  updateCourse: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await coursesApi.update(id, input);
      set((s) => ({
        courses: s.courses.map((c) => (c.id === id ? data.data : c)),
        currentCourse:
          s.currentCourse?.id === id ? data.data : s.currentCourse,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: "Failed to update course", isLoading: false });
    }
  },

  deleteCourse: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await coursesApi.delete(id);
      set((s) => ({
        courses: s.courses.filter((c) => c.id !== id),
        currentCourse: s.currentCourse?.id === id ? null : s.currentCourse,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: "Failed to delete course", isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
