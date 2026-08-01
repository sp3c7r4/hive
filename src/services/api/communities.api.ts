import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
  Community,
  CreateCommunityInput,
  UpdateCommunityInput,
} from "@/types/community";
import { apiClient } from "./api-client";

export const communitiesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Community>>("/communities", { params }),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Community>>(`/communities/${slug}`),

  create: (input: CreateCommunityInput) =>
    apiClient.post<ApiResponse<Community>>("/communities", input),

  update: (id: number, input: UpdateCommunityInput) =>
    apiClient.patch<ApiResponse<Community>>(`/communities/${id}`, input),

  delete: (id: number) => apiClient.delete(`/communities/${id}`),
};
