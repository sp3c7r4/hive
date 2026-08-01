"use client";

import {
  Add01Icon,
  BookOpen01Icon,
  CourseIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DashboardLayout } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/* ---------------------------------------------------------------- */
/*  Types & data                                                    */
/* ---------------------------------------------------------------- */

type Role = "instructor" | "student" | "parent" | "admin";

type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  status: "draft" | "published";
  enrollmentCount: number;
  isFree: boolean;
  price?: string;
};

const difficultyColors = {
  beginner:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  advanced: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
} as const;

const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "React for Designers",
    description:
      "Learn React fundamentals through hands-on projects — from components to hooks.",
    category: "Development",
    difficulty: "beginner",
    status: "published",
    enrollmentCount: 342,
    isFree: true,
  },
  {
    id: "2",
    title: "Advanced TypeScript Patterns",
    description:
      "Master generics, decorators, conditional types, and module augmentation.",
    category: "Development",
    difficulty: "advanced",
    status: "published",
    enrollmentCount: 128,
    isFree: false,
    price: "15,000",
  },
  {
    id: "3",
    title: "UI/UX Research Methods",
    description:
      "From user interviews to usability testing — a complete research toolkit.",
    category: "Design",
    difficulty: "intermediate",
    status: "draft",
    enrollmentCount: 0,
    isFree: true,
  },
  {
    id: "4",
    title: "Data Visualization with D3",
    description: "Build interactive charts, maps, and dashboards for the web.",
    category: "Data Science",
    difficulty: "advanced",
    status: "published",
    enrollmentCount: 89,
    isFree: false,
    price: "12,500",
  },
];

/* ---------------------------------------------------------------- */
/*  Course card                                                     */
/* ---------------------------------------------------------------- */

function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/dashboard/courses/${course.id}/manage`}>
      <Card className="overflow-hidden hover:bg-muted/40 transition-colors h-full flex flex-col">
        <div className="aspect-[2.5/1] bg-gradient-to-br from-muted/80 via-muted/40 to-muted flex items-center justify-center relative">
          <HugeiconsIcon
            icon={CourseIcon}
            size={40}
            className="text-muted-foreground/20"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <Badge
              className={`rounded-full text-[10px] px-2 py-0 h-5 font-medium ${difficultyColors[course.difficulty]}`}
            >
              {course.difficulty}
            </Badge>
            {course.status === "draft" && (
              <Badge
                variant="secondary"
                className="rounded-full text-[10px] px-2 py-0 h-5"
              >
                Draft
              </Badge>
            )}
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold truncate">{course.title}</p>
            <Badge
              variant="secondary"
              className="rounded-full text-[10px] px-2 py-0 h-5 shrink-0"
            >
              {course.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
            {course.description}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={UserGroupIcon} size={13} />
              {course.enrollmentCount} enrolled
            </span>
            <span className="font-medium">
              {course.isFree ? "Free" : `₦${course.price}`}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

/* ---------------------------------------------------------------- */
/*  Courses Page                                                    */
/* ---------------------------------------------------------------- */

function CoursesPage() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "instructor";

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">My Courses</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {MOCK_COURSES.length} course{MOCK_COURSES.length !== 1 && "s"}
            </p>
          </div>
          <Button
            className="rounded-full w-full sm:w-auto"
            render={
              <Link href={`/dashboard/courses/create?role=${role}`}>
                <HugeiconsIcon icon={Add01Icon} size={16} className="mr-1.5" />
                Create Course
              </Link>
            }
          />
        </div>

        {MOCK_COURSES.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <HugeiconsIcon
                icon={CourseIcon}
                size={28}
                className="text-muted-foreground"
              />
            </div>
            <div>
              <p className="text-sm font-medium">No courses yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Create your first course and share your knowledge
              </p>
            </div>
            <Button
              className="rounded-full"
              render={
                <Link href={`/dashboard/courses/create?role=${role}`}>
                  <HugeiconsIcon
                    icon={Add01Icon}
                    size={16}
                    className="mr-1.5"
                  />
                  Create Course
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_COURSES.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function Wrapper() {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-3 gap-4 p-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      }
    >
      <CoursesPage />
    </Suspense>
  );
}
