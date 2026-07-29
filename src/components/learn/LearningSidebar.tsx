"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayIcon,
  File01Icon,
  LiveStreaming01Icon,
  CircleQuestionMarkIcon,
  AssignmentsIcon,
  CheckmarkCircle02Icon,
  LockIcon,
  Cancel01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { Module, LessonType } from "./types";

/* ---------------------------------------------------------------- */
/*  Icon per lesson type                                             */
/* ---------------------------------------------------------------- */

const LESSON_ICONS: Record<LessonType, IconSvgElement> = {
  video: PlayIcon,
  pdf: File01Icon,
  live: LiveStreaming01Icon,
  quiz: CircleQuestionMarkIcon,
  assignment: AssignmentsIcon,
};

const LESSON_COLORS: Record<LessonType, string> = {
  video: "text-blue-500",
  pdf: "text-rose-500",
  live: "text-emerald-500",
  quiz: "text-amber-500",
  assignment: "text-violet-500",
};

/* ---------------------------------------------------------------- */
/*  Sidebar                                                         */
/* ---------------------------------------------------------------- */

interface LearningSidebarProps {
  modules: Module[];
  currentLessonId: string;
  progress: number;
  open: boolean;
  zenMode: boolean;
  onSelectLesson: (lessonId: string) => void;
  onClose: () => void;
}

export function LearningSidebar({
  modules,
  currentLessonId,
  progress,
  open,
  zenMode,
  onSelectLesson,
  onClose,
}: LearningSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    const s = new Set<string>();
    s.add(modules[0]?.id ?? "");
    for (const m of modules) {
      if (m.lessons.some((l) => l.id === currentLessonId)) s.add(m.id);
    }
    return s;
  });

  /* Lock body scroll when mobile sidebar is open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const toggleModule = useCallback((modId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(modId)) next.delete(modId);
      else next.add(modId);
      return next;
    });
  }, []);

  if (zenMode) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={cn(
          "border-r border-border/60 bg-background flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
          /* Desktop: inline shrink */
          "hidden lg:flex shrink-0",
          open ? "lg:w-80" : "lg:w-0 lg:border-r-0",
          /* Mobile: fixed overlay */
          "fixed lg:relative inset-y-0 left-0 z-40 flex w-80 max-w-[85vw]",
          open
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full lg:translate-x-0 lg:shadow-none"
        )}
      >
        <div className="flex flex-col h-full w-80 max-w-[85vw]">
          {/* Progress bar at top */}
          <div className="px-4 pt-4 pb-2 shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-muted-foreground">Course Progress</span>
              <span className="text-xs font-bold tabular-nums text-foreground">{progress}%</span>
            </div>
            <div className="relative flex h-2 w-full items-center overflow-x-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/40 mx-4 shrink-0" />

          {/* Curriculum tree */}
          <div className="flex-1 overflow-y-auto py-2 overscroll-contain">
            <div className="px-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2">
                Curriculum
              </p>
            </div>

            {modules.map((mod) => {
              const isExpanded = expandedModules.has(mod.id);
              const completedCount = mod.lessons.filter((l) => l.status === "completed").length;
              const hasCurrent = mod.lessons.some((l) => l.id === currentLessonId);

              return (
                <div key={mod.id} className="mb-0.5">
                  {/* Module header */}
                  <button
                    type="button"
                    onClick={() => toggleModule(mod.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors group",
                      hasCurrent
                        ? "bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={12}
                      className={cn(
                        "shrink-0 text-muted-foreground transition-transform duration-200",
                        isExpanded ? "rotate-90" : "rotate-0"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{mod.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {completedCount}/{mod.lessons.length} lessons
                      </p>
                    </div>
                  </button>

                  {/* Lessons */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      isExpanded ? "max-h-[600px]" : "max-h-0"
                    )}
                  >
                    {mod.lessons.map((lesson) => {
                      const isCurrent = lesson.id === currentLessonId;
                      const isLocked = lesson.status === "locked";
                      const isCompleted = lesson.status === "completed";
                      const IconComp = LESSON_ICONS[lesson.type];
                      const iconColor = LESSON_COLORS[lesson.type];

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          disabled={isLocked}
                          onClick={() => !isLocked && onSelectLesson(lesson.id)}
                          className={cn(
                            "w-full flex items-center gap-2.5 pl-9 pr-3 py-2.5 text-left transition-colors group",
                            isCurrent && "bg-primary/10 border-r-[3px] border-primary",
                            !isCurrent && !isLocked && "hover:bg-muted/30",
                            isLocked && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {/* Status or type icon */}
                          <span className="shrink-0">
                            {isCompleted ? (
                              <HugeiconsIcon
                                icon={CheckmarkCircle02Icon}
                                size={16}
                                className="text-emerald-500"
                              />
                            ) : isLocked ? (
                              <HugeiconsIcon
                                icon={LockIcon}
                                size={14}
                                className="text-muted-foreground"
                              />
                            ) : (
                              <HugeiconsIcon
                                icon={IconComp}
                                size={15}
                                className={cn(iconColor, isCurrent && "opacity-100")}
                              />
                            )}
                          </span>

                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-xs leading-tight",
                                isCurrent ? "font-semibold text-foreground" : "text-muted-foreground",
                                isCompleted && "text-muted-foreground"
                              )}
                            >
                              {lesson.title}
                            </p>
                          </div>

                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {lesson.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
