"use client";

import {
  ArrowRight02Icon,
  AssignmentsIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  File01Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Lesson } from "./types";

/* ---------------------------------------------------------------- */
/*  Component                                                        */
/* ---------------------------------------------------------------- */

interface AssignmentLessonProps {
  lesson: Lesson;
  onComplete: () => void;
}

export function AssignmentLesson({
  lesson,
  onComplete,
}: AssignmentLessonProps) {
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [notes, setNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files;
      if (!selected) return;
      const newFiles = Array.from(selected).map((f) => ({
        name: f.name,
        size:
          f.size > 1024 * 1024
            ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(f.size / 1024)} KB`,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    },
    [],
  );

  const removeFile = useCallback((name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }, []);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  const handleComplete = useCallback(() => {
    setCompleted(true);
    onComplete();
  }, [onComplete]);

  /* Not started */
  if (!started) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="text-center">
          <div className="size-16 sm:size-20 rounded-2xl bg-violet-50 dark:bg-violet-950/20 flex items-center justify-center mx-auto mb-4">
            <HugeiconsIcon
              icon={AssignmentsIcon}
              size={32}
              className="sm:size-[40px] text-violet-500"
            />
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground mb-1">
            Assignment
          </p>
          <h2 className="text-lg sm:text-xl font-bold">{lesson.title}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 mb-6 max-w-sm mx-auto">
            Estimated time: {lesson.duration}
          </p>

          <div className="text-left max-w-md mx-auto mb-6">
            <Card className="p-4 sm:p-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-1.5">Brief</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Build a personal design portfolio page using React components.
                  Your portfolio should include a hero section, a project
                  gallery with at least 4 projects, and a contact form. Apply
                  the concepts covered in the &quot;Components &amp; Props&quot;
                  and &quot;State &amp; Events&quot; lessons.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold mb-1.5">Requirements</h3>
                <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1">
                  <li>Create at least 3 reusable components</li>
                  <li>Use props to pass data between components</li>
                  <li>Manage form state with useState</li>
                  <li>Make the layout responsive (mobile-friendly)</li>
                  <li>Add hover states and transitions</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold mb-1.5">Submission</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Upload your project files (zip) or submit a GitHub repository
                  link. Include a brief README with setup instructions.
                </p>
              </div>
            </Card>
          </div>

          <Button
            className="rounded-full"
            size="lg"
            onClick={() => setStarted(true)}
          >
            Start Assignment
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={16}
              className="ml-1.5"
            />
          </Button>
        </div>
      </div>
    );
  }

  /* Submitted */
  if (submitted && !completed) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="text-center">
          <div className="size-16 sm:size-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center mx-auto mb-4">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={36}
              className="sm:size-[44px] text-emerald-500"
            />
          </div>
          <h2 className="text-lg sm:text-xl font-bold">
            Assignment Submitted!
          </h2>
          <p className="text-sm text-muted-foreground mt-1 mb-2 max-w-sm mx-auto">
            Your assignment has been submitted successfully. The instructor will
            review it and provide feedback.
          </p>

          <Card className="p-4 sm:p-5 max-w-sm mx-auto mb-6 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <Badge className="rounded-full text-[10px] bg-amber-100 text-amber-700 px-2 py-0 h-5">
                Pending Review
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Files submitted
              </span>
              <span className="text-sm font-bold">{files.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Submitted</span>
              <span className="text-xs">Just now</span>
            </div>
          </Card>

          <Button className="rounded-full" onClick={handleComplete}>
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={15}
              className="mr-1.5"
            />
            Mark as Complete
          </Button>
        </div>
      </div>
    );
  }

  /* Completed */
  if (completed) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="text-center">
          <div className="size-16 sm:size-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center mx-auto mb-4">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={36}
              className="sm:size-[44px] text-emerald-500"
            />
          </div>
          <h2 className="text-lg sm:text-xl font-bold">Assignment Complete</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Great work! You&apos;ve completed this assignment.
          </p>
        </div>
      </div>
    );
  }

  /* In progress — submission form */
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="size-8 sm:size-9 rounded-lg bg-violet-50 dark:bg-violet-950/20 flex items-center justify-center shrink-0">
          <HugeiconsIcon
            icon={AssignmentsIcon}
            size={15}
            className="sm:size-[17px] text-violet-500"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            Assignment
          </p>
          <h2 className="text-sm sm:text-base font-bold truncate">
            {lesson.title}
          </h2>
        </div>
        <Badge
          variant="secondary"
          className="rounded-full text-[10px] px-2 py-0 h-5 ml-auto shrink-0"
        >
          <HugeiconsIcon icon={Clock01Icon} size={10} className="mr-1" />
          {lesson.duration}
        </Badge>
      </div>

      {/* Brief */}
      <Card className="p-4 sm:p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Assignment Brief
        </h3>
        <p className="text-xs sm:text-sm text-foreground leading-relaxed mb-4">
          Build a personal design portfolio page using React components. Your
          portfolio should include a hero section, a project gallery with at
          least 4 projects, and a contact form.
        </p>
        <div>
          <h4 className="text-xs font-semibold mb-1.5">Requirements</h4>
          <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
            <li>Create at least 3 reusable components</li>
            <li>Use props to pass data between components</li>
            <li>Manage form state with useState</li>
            <li>Make the layout responsive</li>
            <li>Add hover states and transitions</li>
          </ul>
        </div>
      </Card>

      {/* File upload */}
      <Card className="p-4 sm:p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Upload Files
        </h3>

        {/* Drop zone */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-xl p-6 sm:p-8 text-center hover:border-violet-300 hover:bg-violet-50/30 dark:hover:bg-violet-950/10 transition-colors cursor-pointer"
        >
          <HugeiconsIcon
            icon={Upload01Icon}
            size={24}
            className="text-muted-foreground mx-auto mb-2"
          />
          <p className="text-sm font-medium">Click to upload files</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            ZIP, PDF, images, or code files (max 50MB)
          </p>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".zip,.pdf,.png,.jpg,.jpeg,.js,.jsx,.ts,.tsx,.json,.md"
        />

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {files.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/50 text-xs"
              >
                <HugeiconsIcon
                  icon={File01Icon}
                  size={13}
                  className="text-violet-500 shrink-0"
                />
                <span className="flex-1 truncate font-medium">{f.name}</span>
                <span className="text-muted-foreground shrink-0">{f.size}</span>
                <button
                  type="button"
                  onClick={() => removeFile(f.name)}
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Notes */}
      <Card className="p-4 sm:p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Submission Notes
        </h3>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes for the instructor — what you built, challenges faced, areas you'd like feedback on..."
          className="min-h-[100px] text-xs sm:text-sm resize-y"
        />
      </Card>

      {/* Submit button */}
      <Button
        className="rounded-full w-full"
        size="lg"
        disabled={files.length === 0}
        onClick={handleSubmit}
      >
        <HugeiconsIcon icon={Upload01Icon} size={16} className="mr-1.5" />
        Submit Assignment
      </Button>

      {files.length === 0 && (
        <p className="text-[11px] text-muted-foreground text-center -mt-3">
          Upload at least one file to submit
        </p>
      )}
    </div>
  );
}
