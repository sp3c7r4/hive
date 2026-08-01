import { create } from "zustand";
import { communitiesApi } from "@/services/api/communities.api";
import type {
  Community,
  CreateCommunityInput,
  UpdateCommunityInput,
} from "@/types/community";

interface CommunitiesState {
  communities: Community[];
  currentCommunity: Community | null;
  isLoading: boolean;
  error: string | null;

  fetchCommunities: () => Promise<void>;
  fetchCommunityBySlug: (slug: string) => Promise<void>;
  createCommunity: (input: CreateCommunityInput) => Promise<Community | null>;
  updateCommunity: (id: number, input: UpdateCommunityInput) => Promise<void>;
  deleteCommunity: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useCommunitiesStore = create<CommunitiesState>((set) => ({
  communities: [],
  currentCommunity: null,
  isLoading: false,
  error: null,

  fetchCommunities: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await communitiesApi.list();
      set({ communities: data.data, isLoading: false });
    } catch (_err) {
      set({ error: "Failed to load communities", isLoading: false });
    }
  },

  fetchCommunityBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await communitiesApi.getBySlug(slug);
      set({ currentCommunity: data.data, isLoading: false });
    } catch (_err) {
      set({ error: "Failed to load community", isLoading: false });
    }
  },

  createCommunity: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await communitiesApi.create(input);
      set((s) => ({
        communities: [...s.communities, data.data],
        isLoading: false,
      }));
      return data.data;
    } catch (_err) {
      set({ error: "Failed to create community", isLoading: false });
      return null;
    }
  },

  updateCommunity: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await communitiesApi.update(id, input);
      set((s) => ({
        communities: s.communities.map((c) => (c.id === id ? data.data : c)),
        currentCommunity:
          s.currentCommunity?.id === id ? data.data : s.currentCommunity,
        isLoading: false,
      }));
    } catch (_err) {
      set({ error: "Failed to update community", isLoading: false });
    }
  },

  deleteCommunity: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await communitiesApi.delete(id);
      set((s) => ({
        communities: s.communities.filter((c) => c.id !== id),
        currentCommunity:
          s.currentCommunity?.id === id ? null : s.currentCommunity,
        isLoading: false,
      }));
    } catch (_err) {
      set({ error: "Failed to delete community", isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
