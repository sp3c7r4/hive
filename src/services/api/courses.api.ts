import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
  Course,
  CreateCourseInput,
  CreateModuleInput,
  Lesson,
  Module,
  UpdateCourseInput,
} from "@/types/course";
import { apiClient } from "./api-client";

export const coursesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Course>>("/courses", { params }),

  getById: (id: number) => apiClient.get<ApiResponse<Course>>(`/courses/${id}`),

  create: (input: CreateCourseInput) =>
    apiClient.post<ApiResponse<Course>>("/courses", input),

  update: (id: number, input: UpdateCourseInput) =>
    apiClient.patch<ApiResponse<Course>>(`/courses/${id}`, input),

  delete: (id: number) => apiClient.delete(`/courses/${id}`),

  listModules: (courseId: number) =>
    apiClient.get<PaginatedResponse<Module>>(`/courses/${courseId}/modules`),

  createModule: (courseId: number, input: CreateModuleInput) =>
    apiClient.post<ApiResponse<Module>>(`/courses/${courseId}/modules`, input),

  updateModule: (moduleId: number, input: Partial<CreateModuleInput>) =>
    apiClient.patch<ApiResponse<Module>>(`/modules/${moduleId}`, input),

  deleteModule: (moduleId: number) => apiClient.delete(`/modules/${moduleId}`),

  listLessons: (moduleId: number) =>
    apiClient.get<PaginatedResponse<Lesson>>(`/modules/${moduleId}/lessons`),

  createLesson: (
    moduleId: number,
    input: { title: string; type: Lesson["type"] },
  ) =>
    apiClient.post<ApiResponse<Lesson>>(`/modules/${moduleId}/lessons`, input),
};
