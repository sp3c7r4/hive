"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  Message02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  likeCount: number;
  likedByUser: boolean;
  commentCount: number;
  onLike: () => void;
  onComment: () => void;
  className?: string;
}

export function PostActions({
  likeCount,
  likedByUser,
  commentCount,
  onLike,
  onComment,
  className,
}: PostActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 border-t border-border pt-2.5 mt-2",
        className
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onLike}
        className={cn(
          "rounded-full h-8 px-3 text-xs gap-1.5",
          likedByUser && "text-rose-500 hover:text-rose-600"
        )}
      >
        <HugeiconsIcon
          icon={FavouriteIcon}
          size={14}
          className={cn(likedByUser && "fill-rose-500")}
        />
        {likeCount > 0 && (
          <span className="tabular-nums">{likeCount}</span>
        )}
        <span className="sr-only">
          {likedByUser ? "Unlike" : "Like"}
        </span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onComment}
        className="rounded-full h-8 px-3 text-xs gap-1.5"
      >
        <HugeiconsIcon icon={Message02Icon} size={14} />
        {commentCount > 0 && (
          <span className="tabular-nums">{commentCount}</span>
        )}
        <span className="sr-only">Comment</span>
      </Button>
    </div>
  );
}
