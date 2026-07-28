"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  File01Icon,
  Download01Icon,
  CheckmarkCircle02Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import type { Lesson } from "./types";

interface PdfViewerProps {
  lesson: Lesson;
  onComplete: () => void;
}

export function PdfViewer({ lesson, onComplete }: PdfViewerProps) {
  const [completed, setCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

  const handleMarkComplete = useCallback(() => {
    setCompleted(true);
    onComplete();
  }, [onComplete]);

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* PDF viewer */}
      <div className="bg-muted/30 border border-border/60 rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-border/40 bg-background/80">
          <HugeiconsIcon icon={File01Icon} size={15} className="text-rose-500 shrink-0" />
          <span className="text-xs sm:text-sm font-medium truncate">{lesson.title}</span>
          <div className="flex-1" />
          <span className="text-[10px] text-muted-foreground shrink-0">
            {currentPage}/{totalPages}
          </span>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-neutral-900 min-h-[300px] sm:min-h-[500px] flex flex-col items-center justify-center p-4 sm:p-8 text-center">
          <HugeiconsIcon icon={File01Icon} size={36} className="sm:size-[48px] text-rose-500/30 mb-3 sm:mb-4" />
          <p className="text-base sm:text-lg font-semibold text-foreground px-2">{lesson.title}</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-4 sm:mb-6">
            PDF Document · {lesson.duration}
          </p>

          <div className="max-w-lg text-left space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p>
              This is the embedded PDF viewer. In production, this would render
              the actual PDF document using a library like <code className="text-[11px] sm:text-xs bg-muted px-1 rounded">react-pdf</code> or
              the browser&apos;s native PDF viewer via an <code className="text-[11px] sm:text-xs bg-muted px-1 rounded">&lt;iframe&gt;</code>.
            </p>

            <p className="text-xs sm:text-sm">The PDF viewer supports:</p>
            <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs">
              <li>Scroll or page-by-page navigation</li>
              <li>Zoom in/out</li>
              <li>Text search within document</li>
              <li>Download (if enabled by course settings)</li>
              <li>Progress tracking per page</li>
            </ul>

            {/* Page navigation */}
            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border/40 gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-full text-xs h-7 sm:h-8"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={13} className="mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-full text-xs h-7 sm:h-8"
              >
                <span className="hidden sm:inline">Next</span>
                <HugeiconsIcon icon={ArrowRight02Icon} size={13} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson info */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] sm:text-xs text-muted-foreground mb-0.5">Reading</p>
          <h2 className="text-base sm:text-lg font-bold leading-snug">{lesson.title}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {lesson.duration} read
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Button variant="outline" size="sm" className="rounded-full text-xs h-7 sm:h-8">
            <HugeiconsIcon icon={Download01Icon} size={13} className="mr-1 sm:mr-1.5" />
            Download
          </Button>
          {!completed ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarkComplete}
              className="rounded-full text-xs h-7 sm:h-8"
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} className="mr-1 sm:mr-1.5" />
              Mark Complete
            </Button>
          ) : (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} />
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
