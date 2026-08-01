"use client";

import { Megaphone01Icon, PinIcon, SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CommentThread } from "./CommentThread";
import { PostActions } from "./PostActions";
import type { Comment, Post } from "./types";

interface PostCardProps {
  post: Post;
  comments: Comment[];
  currentUser: { name: string; initials: string };
  onLike: () => void;
  onComment: (content: string) => void;
  onReply: (parentId: string, content: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onEdit: (content: string) => void;
  onDelete: () => void;
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function PostCard({
  post,
  comments,
  currentUser,
  onLike,
  onComment,
  onReply,
  onEditComment,
  onDeleteComment,
  onEdit,
  onDelete,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const isOwn = post.author.name === currentUser.name;

  const handleComment = useCallback(() => {
    if (!commentText.trim()) return;
    onComment(commentText.trim());
    setCommentText("");
  }, [commentText, onComment]);

  return (
    <Card
      className={cn(
        "p-4 sm:p-5 transition-colors",
        post.isPinned && "bg-muted/50 border-muted-foreground/20",
        post.isAnnouncement &&
          "border-l-[3px] border-l-amber-400 bg-amber-50/30 dark:bg-amber-950/10",
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="text-[11px]">
            {post.author.initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{post.author.name}</span>
            {post.isAnnouncement && (
              <Badge className="rounded-full text-[9px] px-1.5 py-0 h-4 gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <HugeiconsIcon icon={Megaphone01Icon} size={9} />
                Announcement
              </Badge>
            )}
            {post.isPinned && (
              <Badge className="rounded-full text-[9px] px-1.5 py-0 h-4 gap-1 bg-muted-foreground/10 text-muted-foreground">
                <HugeiconsIcon icon={PinIcon} size={9} />
                Pinned
              </Badge>
            )}
            <span className="text-[11px] text-muted-foreground">
              {timeAgo(post.createdAt)}
            </span>
            {post.editedAt && (
              <span className="text-[10px] text-muted-foreground italic">
                (edited)
              </span>
            )}
          </div>

          {/* Content */}
          <p className="text-sm leading-relaxed mt-1.5 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {/* Attachments */}
          {post.attachments?.length ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.attachments.map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-[11px]"
                >
                  <span className="truncate max-w-[140px]">{name}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Actions */}
      <PostActions
        likeCount={post.likeCount}
        likedByUser={post.likedByUser}
        commentCount={post.commentCount}
        onLike={onLike}
        onComment={() => {
          setShowComments((v) => !v);
          if (!showComments) setCommentText("");
        }}
      />

      {/* Comments */}
      {showComments && (
        <div className="mt-1">
          {/* New comment input */}
          <div className="flex items-start gap-2.5 mt-2">
            <Avatar className="size-7 shrink-0 mt-0.5">
              <AvatarFallback className="text-[10px]">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                    handleComment();
                }}
                placeholder="Write a comment..."
                className="min-h-[48px] text-xs resize-y"
                rows={1}
              />
              {commentText.trim() && (
                <Button
                  size="sm"
                  onClick={handleComment}
                  className="rounded-full h-7 text-[10px] mt-1.5"
                >
                  <HugeiconsIcon icon={SentIcon} size={11} className="mr-1" />
                  Comment
                </Button>
              )}
            </div>
          </div>

          <CommentThread
            comments={comments}
            currentUser={currentUser}
            onAddReply={onReply}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
          />
        </div>
      )}
    </Card>
  );
}
