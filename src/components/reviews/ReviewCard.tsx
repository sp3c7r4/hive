"use client";

import { Flag03Icon, StarIcon, ThumbsUpIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CourseReview } from "./types";

interface ReviewCardProps {
  review: CourseReview;
  onMarkHelpful: () => void;
  onFlag: () => void;
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  if (s < 31536000) return `${Math.floor(s / 2592000)}mo ago`;
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ReviewCard({ review, onMarkHelpful, onFlag }: ReviewCardProps) {
  const [flagged, setFlagged] = useState(false);

  return (
    <div className="space-y-3">
      {/* Review */}
      <div className="flex gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="text-[11px]">
            {review.author.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{review.author.name}</span>
            <span className="text-[11px] text-muted-foreground">
              {timeAgo(review.createdAt)}
            </span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <HugeiconsIcon
                key={s}
                icon={StarIcon}
                size={12}
                className={cn(
                  s <= review.rating
                    ? "text-amber-400 fill-amber-400"
                    : "text-muted-foreground/20",
                )}
              />
            ))}
          </div>

          {review.title && (
            <p className="text-sm font-semibold mt-2">{review.title}</p>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed mt-1">
            {review.comment}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-1 mt-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkHelpful}
              className={cn(
                "rounded-full h-7 px-2.5 text-[10px] gap-1",
                review.markedHelpful && "text-primary",
              )}
            >
              <HugeiconsIcon icon={ThumbsUpIcon} size={12} />
              Helpful
              {review.helpfulCount > 0 ? ` (${review.helpfulCount})` : ""}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFlagged(true);
                onFlag();
              }}
              className="rounded-full h-7 px-2.5 text-[10px] gap-1 text-muted-foreground"
              disabled={flagged}
            >
              <HugeiconsIcon icon={Flag03Icon} size={12} />
              {flagged ? "Reported" : "Report"}
            </Button>
          </div>
        </div>
      </div>

      {/* Instructor reply */}
      {review.instructorReply && (
        <div className="ml-9 pl-4 border-l-2 border-muted">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold">Ade Okafor</span>
            <Badge className="rounded-full text-[9px] px-1.5 py-0 h-4 bg-primary/10 text-primary">
              Instructor
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {timeAgo(review.instructorReply.createdAt)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {review.instructorReply.comment}
          </p>
        </div>
      )}
    </div>
  );
}
