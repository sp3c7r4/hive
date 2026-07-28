"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  LockIcon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { PostComposer } from "./PostComposer";
import { PostCard } from "./PostCard";
import type { Post, Comment } from "./types";

/* ---- demo data ---- */

const CURRENT_USER = { name: "Temi Adebayo", initials: "TA" };

const INITIAL_POSTS: Post[] = [
  {
    id: "p1",
    author: { name: "Ade Okafor", initials: "AO", isInstructor: true },
    content:
      "Welcome everyone! 🎉 We're kicking off a new month with an exciting workshop on CSS Grid layouts this Saturday at 2pm WAT. Bring your questions — we'll be building a full dashboard layout together live. \n\nAgenda:\n• Grid fundamentals (30min)\n• Hands-on: Building a dashboard (45min)\n• Q&A and code review (30min)\n\nZoom link will be posted Friday. See you there!",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isPinned: true,
    likeCount: 34,
    likedByUser: true,
    commentCount: 8,
  },
  {
    id: "p2",
    author: { name: "Ade Okafor", initials: "AO", isInstructor: true },
    content:
      "📢 Important update: We've added 3 new courses to the community library — Advanced TypeScript Patterns, Building Accessible UIs, and CSS Mastery. All are free for members. Check them out from the Courses tab!",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isAnnouncement: true,
    likeCount: 56,
    likedByUser: false,
    commentCount: 3,
  },
  {
    id: "p3",
    author: { name: "Chioma Eze", initials: "CE" },
    content:
      "Just finished my portfolio using React — would love some feedback! I used Framer Motion for the animations and Tailwind for styling. The hardest part was the dark mode toggle but finally got it working. \n\nAnyone else working on portfolio projects right now?",
    attachments: ["portfolio-screenshot.png"],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likeCount: 12,
    likedByUser: false,
    commentCount: 5,
  },
  {
    id: "p4",
    author: { name: "Emeka Nwosu", initials: "EN" },
    content:
      "Struggling with React state management. I've been using useState for everything but my component tree is getting deep. Should I switch to useReducer or jump straight to Zustand? My app is a mid-size e-commerce dashboard.",
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    likeCount: 8,
    likedByUser: true,
    commentCount: 14,
  },
  {
    id: "p5",
    author: { name: "Fatima Bello", initials: "FB" },
    content:
      "Just landed my first frontend job! 🚀 Thanks to everyone in this community who reviewed my code and gave feedback. The mock interviews in the study group were a game-changer. Happy to pay it forward — DM me if you want interview tips!",
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    likeCount: 89,
    likedByUser: false,
    commentCount: 22,
  },
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: "c1",
    postId: "p1",
    parentId: null,
    author: { name: "Chioma Eze", initials: "CE" },
    content: "Can't wait! Will the workshop be recorded for those who can't join live?",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "c2",
    postId: "p1",
    parentId: "c1",
    author: { name: "Ade Okafor", initials: "AO", isInstructor: true },
    content: "Yes, the recording will be posted here within 24 hours.",
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    isInstructorReply: true,
  },
  {
    id: "c3",
    postId: "p3",
    parentId: null,
    author: { name: "Emeka Nwosu", initials: "EN" },
    content: "Your dark mode transition is smooth! What approach did you use for persisting the preference?",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "c4",
    postId: "p3",
    parentId: "c3",
    author: { name: "Chioma Eze", initials: "CE" },
    content: "Thanks! I used localStorage and a CSS custom property approach — the system preference is the fallback if nothing is saved. Happy to share the code.",
    createdAt: new Date(Date.now() - 3000000).toISOString(),
  },
  {
    id: "c5",
    postId: "p4",
    parentId: null,
    author: { name: "Ade Okafor", initials: "AO", isInstructor: true },
    content: "For a mid-size e-commerce dashboard, Zustand is a great choice — minimal boilerplate and easy to colocate state. useReducer works well for complex local state (multi-step forms, wizards). I'd skip Context + useReducer for global state at that scale — the re-render patterns get tricky.",
    createdAt: new Date(Date.now() - 5400000).toISOString(),
    isInstructorReply: true,
  },
];

interface CommunityFeedProps {
  isMember: boolean;
  onJoinRequest?: () => void;
}

export function CommunityFeed({ isMember, onJoinRequest }: CommunityFeedProps) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [visibleCount, setVisibleCount] = useState(3);

  const handleCreatePost = useCallback((newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const handleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByUser: !p.likedByUser,
              likeCount: p.likeCount + (p.likedByUser ? -1 : 1),
            }
          : p
      )
    );
  }, []);

  const handleComment = useCallback(
    (postId: string, content: string) => {
      const newComment: Comment = {
        id: `c-${Date.now()}`,
        postId,
        parentId: null,
        author: CURRENT_USER,
        content,
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [...prev, newComment]);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
        )
      );
    },
    []
  );

  const handleReply = useCallback(
    (postId: string, parentId: string, content: string) => {
      const newComment: Comment = {
        id: `c-${Date.now()}`,
        postId,
        parentId,
        author: CURRENT_USER,
        content,
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [...prev, newComment]);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
        )
      );
    },
    []
  );

  const handleEditComment = useCallback(
    (commentId: string, content: string) => {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, content, editedAt: new Date().toISOString() }
            : c
        )
      );
    },
    []
  );

  const handleDeleteComment = useCallback((commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }, []);

  const handleEditPost = useCallback((postId: string, content: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, content, editedAt: new Date().toISOString() }
          : p
      )
    );
  }, []);

  const handleDeletePost = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setComments((prev) => prev.filter((c) => c.postId !== postId));
  }, []);

  const sorted = [...posts].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    if (a.isAnnouncement !== b.isAnnouncement) return a.isAnnouncement ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  /* Not a member */
  if (!isMember) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center">
        <div className="size-14 sm:size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <HugeiconsIcon icon={LockIcon} size={24} className="sm:size-[28px] text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-bold mb-1">
          Join to see the conversation
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          Members can post, comment, and connect with the community. Join now to
          participate in the discussion.
        </p>
        <Button className="rounded-full" onClick={onJoinRequest}>
          <HugeiconsIcon icon={UserGroupIcon} size={16} className="mr-1.5" />
          Join Community
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Composer */}
      <PostComposer author={CURRENT_USER} onSubmit={handleCreatePost} />

      {/* Posts */}
      {visible.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          comments={comments.filter((c) => c.postId === post.id)}
          currentUser={CURRENT_USER}
          onLike={() => handleLike(post.id)}
          onComment={(content) => handleComment(post.id, content)}
          onReply={(parentId, content) => handleReply(post.id, parentId, content)}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          onEdit={(content) => handleEditPost(post.id, content)}
          onDelete={() => handleDeletePost(post.id)}
        />
      ))}

      {/* Load more */}
      {hasMore && (
        <div className="text-center pt-2 pb-4">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setVisibleCount((c) => c + 3)}
          >
            Load more
            <HugeiconsIcon icon={ArrowRight02Icon} size={14} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
