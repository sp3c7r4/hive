export interface Author {
  name: string;
  initials: string;
  avatar?: string;
  isInstructor?: boolean;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  attachments?: string[];
  createdAt: string;
  editedAt?: string;
  isPinned?: boolean;
  isAnnouncement?: boolean;
  likeCount: number;
  likedByUser: boolean;
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  author: Author;
  content: string;
  createdAt: string;
  editedAt?: string;
  isInstructorReply?: boolean;
}
