"use client";

import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  AssignmentsIcon,
  CheckmarkCircle02Icon,
  CircleQuestionMarkIcon,
  File01Icon,
  LiveStreaming01Icon,
  LockIcon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import type { Lesson, LessonType } from "./types";

/* ---------------------------------------------------------------- */
/*  Icon per type                                                    */
/* ---------------------------------------------------------------- */

const TYPE_ICON: Record<LessonType, IconSvgElement> = {
  video: PlayIcon,
  pdf: File01Icon,
  live: LiveStreaming01Icon,
  quiz: CircleQuestionMarkIcon,
  assignment: AssignmentsIcon,
};

/* ---------------------------------------------------------------- */
/*  Component                                                        */
/* ---------------------------------------------------------------- */

interface LessonNavigationProps {
  prev: Lesson | null;
  next: Lesson | null;
  nextLocked: boolean;
  onPrev: () => void;
  onNext: () => void;
  onMarkComplete?: () => void;
  currentCompleted?: boolean;
}

export function LessonNavigation({
  prev,
  next,
  nextLocked,
  onPrev,
  onNext,
  onMarkComplete,
  currentCompleted,
}: LessonNavigationProps) {
  return (
    <div className="shrink-0 border-t border-border/60 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2 px-2 sm:px-4 py-2 sm:py-2.5 max-w-3xl mx-auto">
        {/* Previous */}
        <div className="flex-1 min-w-0">
          {prev ? (
            <button
              type="button"
              onClick={onPrev}
              className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground hover:text-foreground transition-colors group rounded-full hover:bg-muted/50 px-2 sm:px-3 py-1.5 -ml-2 sm:-ml-3"
            >
              <HugeiconsIcon
                icon={ArrowLeft02Icon}
                size={15}
                className="shrink-0 transition-transform group-hover:-translate-x-0.5"
              />
              <div className="text-left min-w-0 hidden sm:block">
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Previous
                </p>
                <p className="text-xs font-medium truncate max-w-[120px] lg:max-w-[160px] leading-tight">
                  {prev.title}
                </p>
              </div>
              <span className="sm:hidden text-xs font-medium">Prev</span>
            </button>
          ) : (
            <div />
          )}
        </div>

        {/* Center: mark complete */}
        <div className="shrink-0 flex justify-center">
          {onMarkComplete && !currentCompleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkComplete}
              className="rounded-full h-7 sm:h-8 text-xs"
            >
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={13}
                className="sm:mr-1.5"
              />
              <span className="hidden sm:inline">Mark Complete</span>
            </Button>
          )}
          {currentCompleted && (
            <span className="text-[10px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full inline-flex items-center gap-1">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={12}
                className="sm:size-[13px]"
              />
              <span className="hidden sm:inline">Completed</span>
            </span>
          )}
        </div>

        {/* Next */}
        <div className="flex-1 min-w-0 flex justify-end">
          {next ? (
            nextLocked ? (
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground/60 pr-2">
                <HugeiconsIcon icon={LockIcon} size={12} className="shrink-0" />
                <div className="text-right min-w-0 hidden sm:block">
                  <p className="text-[10px] leading-tight">
                    Complete lesson to unlock
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    <HugeiconsIcon icon={TYPE_ICON[next.type]} size={11} />
                    <p className="text-xs font-medium truncate max-w-[120px] lg:max-w-[160px] leading-tight">
                      {next.title}
                    </p>
                  </div>
                </div>
                <span className="sm:hidden text-xs text-muted-foreground/60">
                  Locked
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onNext}
                className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground hover:text-foreground transition-colors group rounded-full hover:bg-muted/50 px-2 sm:px-3 py-1.5 -mr-2 sm:-mr-3"
              >
                <div className="text-right min-w-0 hidden sm:block">
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    Next
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    <HugeiconsIcon icon={TYPE_ICON[next.type]} size={11} />
                    <p className="text-xs font-medium truncate max-w-[120px] lg:max-w-[160px] leading-tight">
                      {next.title}
                    </p>
                  </div>
                </div>
                <span className="sm:hidden text-xs font-medium">Next</span>
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={15}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5"
                />
              </button>
            )
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
