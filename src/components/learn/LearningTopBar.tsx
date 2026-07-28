"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  SidebarLeftIcon,
  SidebarRightIcon,
  Sun02Icon,
} from "@hugeicons/core-free-icons";

interface LearningTopBarProps {
  courseTitle: string;
  progress: number;
  sidebarOpen: boolean;
  zenMode: boolean;
  onToggleSidebar: () => void;
  onToggleZen: () => void;
  role: string;
}

export function LearningTopBar({
  courseTitle,
  progress,
  sidebarOpen,
  zenMode,
  onToggleSidebar,
  onToggleZen,
  role,
}: LearningTopBarProps) {
  return (
    <header className="h-12 shrink-0 border-b border-border/60 flex items-center gap-1.5 sm:gap-3 px-2 sm:px-3 bg-background/95 backdrop-blur-sm z-20">
      {/* Back */}
      <Link
        href={`/dashboard/my-courses?role=${role}`}
        className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
        aria-label="Back to My Courses"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
      </Link>

      {/* Separator — hidden on mobile */}
      <div className="hidden sm:block w-px h-5 bg-border/60 shrink-0" />

      {/* Sidebar toggle */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className={cn(
          "size-8 flex items-center justify-center rounded-lg transition-colors shrink-0",
          sidebarOpen
            ? "text-foreground bg-muted"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <HugeiconsIcon icon={sidebarOpen ? SidebarLeftIcon : SidebarRightIcon} size={18} />
      </button>

      {/* Course title */}
      <p className="text-xs sm:text-sm font-semibold truncate min-w-0">{courseTitle}</p>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Progress — compact on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <span className="text-[10px] sm:text-xs text-muted-foreground tabular-nums">
          {progress}%
        </span>
        <div className="relative hidden xs:flex h-1.5 w-16 sm:w-24 items-center overflow-x-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Zen mode toggle */}
      <button
        type="button"
        onClick={onToggleZen}
        className={cn(
          "size-8 flex items-center justify-center rounded-lg transition-colors shrink-0",
          zenMode
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
        aria-label={zenMode ? "Exit focus mode" : "Enter focus mode"}
        title={zenMode ? "Exit focus mode" : "Focus mode"}
      >
        <HugeiconsIcon icon={Sun02Icon} size={17} />
      </button>
    </header>
  );
}
