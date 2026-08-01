"use client";

import { SentIcon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CourseReview } from "./types";

interface ReviewFormProps {
  currentUser: { name: string; initials: string };
  onSubmit: (review: CourseReview) => void;
}

export function ReviewForm({ currentUser, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const displayRating = hoverRating || rating;

  const handleSubmit = useCallback(() => {
    if (rating === 0 || !comment.trim()) return;
    onSubmit({
      id: `rv-${Date.now()}`,
      author: currentUser,
      rating,
      title: title.trim() || undefined,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      markedHelpful: false,
    });
  }, [rating, title, comment, currentUser, onSubmit]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Leave a Review</h3>

      {/* Stars */}
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="Rating"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <HugeiconsIcon
              icon={StarIcon}
              size={24}
              className={cn(
                "transition-colors",
                star <= displayRating
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted-foreground/30",
              )}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-xs text-muted-foreground ml-1.5 tabular-nums">
            {rating}/5
          </span>
        )}
      </div>

      {/* Title */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="text-sm"
        maxLength={80}
      />

      {/* Comment */}
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this course..."
        className="min-h-[80px] text-sm resize-y"
        rows={3}
      />

      <Button
        onClick={handleSubmit}
        disabled={rating === 0 || !comment.trim()}
        className="rounded-full"
      >
        <HugeiconsIcon icon={SentIcon} size={14} className="mr-1.5" />
        Submit Review
      </Button>
    </div>
  );
}
