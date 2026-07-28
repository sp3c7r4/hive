"use client";

import { Suspense, useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { LearningSidebar } from "@/components/learn/LearningSidebar";
import { LearningTopBar } from "@/components/learn/LearningTopBar";
import { LessonContent } from "@/components/learn/LessonContent";
import { LessonNavigation } from "@/components/learn/LessonNavigation";
import { CourseComplete } from "@/components/learn/CourseComplete";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lesson, Module } from "@/components/learn/types";

/* ---------------------------------------------------------------- */
/*  Demo curriculum data                                            */
/* ---------------------------------------------------------------- */

const DEMO_MODULES: Module[] = [
  {
    id: "m1",
    title: "Getting Started",
    lessons: [
      { id: "l1", title: "Welcome & Course Overview", type: "video", duration: "4:32", status: "completed" },
      { id: "l2", title: "Setting Up Your Environment", type: "video", duration: "8:15", status: "completed" },
      { id: "l3", title: "How the Web Works", type: "pdf", duration: "12 min read", status: "current" },
    ],
  },
  {
    id: "m2",
    title: "React Fundamentals",
    lessons: [
      { id: "l4", title: "Components & Props", type: "video", duration: "15:20", status: "current" },
      { id: "l5", title: "State & Events", type: "video", duration: "18:45", status: "current" },
      { id: "l6", title: "React Fundamentals Quiz", type: "quiz", duration: "10 questions", status: "current" },
    ],
  },
  {
    id: "m3",
    title: "Building Projects",
    lessons: [
      { id: "l7", title: "Project: Design Portfolio", type: "assignment", duration: "2-3 hours", status: "current" },
      { id: "l8", title: "Live Code Review", type: "live", duration: "60 min", status: "current", scheduledTime: "2025-08-15T14:00:00" },
    ],
  },
  {
    id: "m4",
    title: "Advanced Patterns",
    lessons: [
      { id: "l9", title: "Higher-Order Components", type: "video", duration: "22:10", status: "locked" },
      { id: "l10", title: "Custom Hooks Deep Dive", type: "video", duration: "19:30", status: "locked" },
      { id: "l11", title: "Final Project Brief", type: "pdf", duration: "8 min read", status: "locked" },
    ],
  },
];

const COURSE = {
  id: "react-designers",
  title: "React for Designers",
  instructor: "Ade Okafor",
};

/* ---------------------------------------------------------------- */
/*  Helpers                                                         */
/* ---------------------------------------------------------------- */

function flattenLessons(modules: Module[]): Lesson[] {
  return modules.flatMap((m) => m.lessons);
}

function computeProgress(modules: Module[]): number {
  const all = flattenLessons(modules);
  if (all.length === 0) return 0;
  const done = all.filter((l) => l.status === "completed").length;
  return Math.round((done / all.length) * 100);
}

function getAdjacentLessons(
  modules: Module[],
  currentId: string
): { prev: Lesson | null; next: Lesson | null; nextLocked: boolean } {
  const flat = flattenLessons(modules);
  const idx = flat.findIndex((l) => l.id === currentId);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx < flat.length - 1 ? flat[idx + 1] : null;
  const nextLocked = next ? next.status === "locked" : false;
  return { prev, next, nextLocked };
}

/* ---------------------------------------------------------------- */
/*  Main Page                                                       */
/* ---------------------------------------------------------------- */

function LearningViewPage() {
  const sp = useSearchParams();
  const params = useParams<{ courseId: string }>();
  const role = (sp.get("role") as string) || "student";

  const [modules, setModules] = useState<Module[]>(DEMO_MODULES);
  const [currentLessonId, setCurrentLessonId] = useState<string>("l3");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zenMode, setZenMode] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);

  /* Derived */
  const currentLesson = useMemo(
    () => flattenLessons(modules).find((l) => l.id === currentLessonId) ?? null,
    [modules, currentLessonId]
  );

  const progress = useMemo(() => computeProgress(modules), [modules]);
  const { prev, next, nextLocked } = useMemo(
    () => getAdjacentLessons(modules, currentLessonId),
    [modules, currentLessonId]
  );

  /* Mark a lesson complete */
  const markComplete = useCallback((lessonId: string) => {
    setModules((prev) =>
      prev.map((mod) => ({
        ...mod,
        lessons: mod.lessons.map((l) => {
          if (l.id !== lessonId) return l;
          return { ...l, status: "completed" as const };
        }),
      }))
    );
  }, []);

  /* Auto-unlock next lesson when current is completed */
  useEffect(() => {
    const flat = flattenLessons(modules);
    const current = flat.find((l) => l.id === currentLessonId);
    if (current?.status === "completed" && next && next.status === "locked") {
      setModules((prev) =>
        prev.map((mod) => ({
          ...mod,
          lessons: mod.lessons.map((l) => {
            if (l.id === next.id) return { ...l, status: "current" as const };
            return l;
          }),
        }))
      );
    }
  }, [modules, currentLessonId, next]);

  /* Check course completion */
  useEffect(() => {
    const p = computeProgress(modules);
    if (p >= 100 && !courseCompleted) {
      const timer = setTimeout(() => setCourseCompleted(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [modules, courseCompleted]);

  const navigateToLesson = useCallback((lessonId: string) => {
    setCurrentLessonId(lessonId);
  }, []);

  const goNext = useCallback(() => {
    if (next && !nextLocked) navigateToLesson(next.id);
  }, [next, nextLocked, navigateToLesson]);

  const goPrev = useCallback(() => {
    if (prev) navigateToLesson(prev.id);
  }, [prev, navigateToLesson]);

  /* Toggle zen mode (hides sidebar) */
  const toggleZenMode = useCallback(() => {
    setZenMode((z) => {
      if (!z) setSidebarOpen(false);
      else setSidebarOpen(true);
      return !z;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((o) => !o);
    if (zenMode) setZenMode(false);
  }, [zenMode]);

  if (courseCompleted) {
    return <CourseComplete courseTitle={COURSE.title} role={role} />;
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <LearningTopBar
        courseTitle={COURSE.title}
        progress={progress}
        sidebarOpen={sidebarOpen}
        zenMode={zenMode}
        onToggleSidebar={toggleSidebar}
        onToggleZen={toggleZenMode}
        role={role}
      />

      <div className="flex flex-1 min-h-0 relative">
        {/* Sidebar */}
        <LearningSidebar
          modules={modules}
          currentLessonId={currentLessonId}
          progress={progress}
          open={sidebarOpen}
          zenMode={zenMode}
          onSelectLesson={(id) => { navigateToLesson(id); setSidebarOpen(false); }}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto">
            {currentLesson && (
              <LessonContent
                lesson={currentLesson}
                onComplete={() => markComplete(currentLesson.id)}
              />
            )}
          </div>

          {/* Navigation footer */}
          <LessonNavigation
            prev={prev}
            next={next}
            nextLocked={nextLocked}
            onPrev={goPrev}
            onNext={goNext}
            onMarkComplete={currentLesson ? () => markComplete(currentLesson.id) : undefined}
            currentCompleted={currentLesson?.status === "completed"}
          />
        </main>
      </div>
    </div>
  );
}

export default function Wrapper() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex flex-col bg-background">
          <div className="h-14 border-b flex items-center px-4 gap-3">
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-16 ml-auto" />
          </div>
          <div className="flex flex-1">
            <div className="w-72 border-r p-4 space-y-3 hidden lg:block">
              <Skeleton className="h-2 w-full rounded-full" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
            <div className="flex-1 p-6 flex items-center justify-center">
              <Skeleton className="aspect-video w-full max-w-3xl rounded-xl" />
            </div>
          </div>
        </div>
      }
    >
      <LearningViewPage />
    </Suspense>
  );
}
