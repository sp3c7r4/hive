import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Enrollment, LessonProgress } from "@/types/enrollment";
import { apiClient } from "./api-client";

interface EnrollInput {
  courseId: number;
}

export const enrollmentsApi = {
  enroll: (input: EnrollInput) =>
    apiClient.post<ApiResponse<Enrollment>>("/enrollments", input),

  list: () => apiClient.get<PaginatedResponse<Enrollment>>("/enrollments"),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Enrollment>>(`/enrollments/${id}`),

  markLessonComplete: (enrollmentId: number, lessonId: number) =>
    apiClient.patch<ApiResponse<void>>(
      `/enrollments/${enrollmentId}/progress/${lessonId}`,
    ),

  getProgress: (enrollmentId: number) =>
    apiClient.get<ApiResponse<LessonProgress[]>>(
      `/enrollments/${enrollmentId}/progress`,
    ),
};
