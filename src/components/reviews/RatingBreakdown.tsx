"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface RatingBreakdownProps {
  rating: number;
  reviewCount: number;
  distribution: { stars: number; count: number }[];
}

export function RatingBreakdown({
  rating,
  reviewCount,
  distribution,
}: RatingBreakdownProps) {
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 p-4 sm:p-5 rounded-xl border bg-card">
      {/* Average */}
      <div className="flex flex-col items-center shrink-0">
        <span className="text-[42px] sm:text-[56px] font-black leading-none text-foreground tabular-nums">
          {rating.toFixed(1)}
        </span>
        <div className="flex items-center gap-0.5 mt-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <HugeiconsIcon
              key={s}
              icon={StarIcon}
              size={16}
              className={cn(
                s <= Math.round(rating)
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted-foreground/20"
              )}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground mt-1 tabular-nums">
          {reviewCount} review{reviewCount !== 1 && "s"}
        </span>
      </div>

      {/* Bars */}
      <div className="flex-1 w-full space-y-1.5">
        {distribution.map((d) => (
          <div key={d.stars} className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground w-4 text-right tabular-nums">
              {d.stars}
            </span>
            <div className="flex-1 relative h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                  d.stars >= 4
                    ? "bg-emerald-500"
                    : d.stars === 3
                    ? "bg-amber-500"
                    : "bg-rose-400"
                )}
                style={{
                  width: `${(d.count / maxCount) * 100}%`,
                }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground w-7 text-right tabular-nums">
              {d.count > 0
                ? `${Math.round((d.count / reviewCount) * 100)}%`
                : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
