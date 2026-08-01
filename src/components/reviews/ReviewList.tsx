"use client";

import { ArrowDown02Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReviewCard } from "./ReviewCard";
import type { CourseReview } from "./types";

type SortOption = "recent" | "highest" | "lowest" | "helpful";

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Most Recent",
  highest: "Highest Rated",
  lowest: "Lowest Rated",
  helpful: "Most Helpful",
};

interface ReviewListProps {
  reviews: CourseReview[];
  onMarkHelpful: (reviewId: string) => void;
  onFlag: (reviewId: string) => void;
}

export function ReviewList({
  reviews,
  onMarkHelpful,
  onFlag,
}: ReviewListProps) {
  const [sort, setSort] = useState<SortOption>("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  const sorted = useCallback(() => {
    const copy = [...reviews];
    switch (sort) {
      case "highest":
        return copy.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return copy.sort((a, b) => a.rating - b.rating);
      case "helpful":
        return copy.sort((a, b) => b.helpfulCount - a.helpfulCount);
      default:
        return copy.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
  }, [reviews, sort]);

  const visible = sorted().slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Reviews ({reviews.length})</h3>

        {/* Sort dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOpen((v) => !v)}
            className="rounded-full h-8 text-[11px] gap-1 px-3"
          >
            {SORT_LABELS[sort]}
            <HugeiconsIcon icon={ArrowDown02Icon} size={11} />
          </Button>
          {sortOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setSortOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 bg-popover border rounded-xl shadow-lg py-1 min-w-[150px]">
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSort(key);
                        setSortOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-[11px] hover:bg-muted flex items-center justify-between gap-2",
                        sort === key && "font-semibold",
                      )}
                    >
                      {label}
                      {sort === key && (
                        <HugeiconsIcon
                          icon={Tick01Icon}
                          size={11}
                          className="text-primary"
                        />
                      )}
                    </button>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-5">
        {visible.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onMarkHelpful={() => onMarkHelpful(review.id)}
            onFlag={() => onFlag(review.id)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center pt-2 pb-4">
          <Button
            variant="outline"
            className="rounded-full text-xs"
            onClick={() => setVisibleCount((c) => c + 4)}
          >
            Load more
            <HugeiconsIcon icon={ArrowDown02Icon} size={13} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
