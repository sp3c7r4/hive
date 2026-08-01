export type CommunityStatus = "active" | "inactive";

export interface Community {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: CommunityStatus;
  instructorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunityInput {
  name: string;
  description?: string;
}

export interface UpdateCommunityInput {
  name?: string;
  description?: string;
  status?: CommunityStatus;
}
