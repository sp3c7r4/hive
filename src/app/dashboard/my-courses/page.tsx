"use client";

import {
  BookOpen01Icon,
  CompassIcon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

type Role = "instructor" | "student" | "parent" | "admin";
type FilterTab = "all" | "in-progress" | "completed" | "expired";

const COURSES = [
  {
    id: "1",
    title: "React for Designers",
    instructor: "Ade Okafor",
    community: "Frontend Devs",
    progress: 62,
    lastAccessed: "2 hours ago",
    status: "in-progress" as const,
  },
  {
    id: "2",
    title: "UI/UX Research Methods",
    instructor: "Dr. Okonkwo",
    community: "UI/UX Critique Circle",
    progress: 100,
    lastAccessed: "3 days ago",
    status: "completed" as const,
  },
  {
    id: "3",
    title: "Advanced TypeScript Patterns",
    instructor: "Prof. Adeyemi",
    community: "Frontend Devs",
    progress: 28,
    lastAccessed: "1 week ago",
    status: "in-progress" as const,
  },
  {
    id: "4",
    title: "Data Visualization with D3",
    instructor: "Kelechi Okonkwo",
    community: "Data Science Lab",
    progress: 0,
    lastAccessed: "—",
    status: "expired" as const,
  },
  {
    id: "5",
    title: "Product Strategy 101",
    instructor: "Amara Obi",
    community: "Product Hub",
    progress: 45,
    lastAccessed: "5 hours ago",
    status: "in-progress" as const,
  },
];

function MyCoursesPage() {
  const sp = useSearchParams();
  const role = (sp.get("role") as Role) || "student";
  const [filter, setFilter] = useState<FilterTab>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return COURSES;
    return COURSES.filter((c) => c.status === filter);
  }, [filter]);

  const inProgress = COURSES.filter((c) => c.status === "in-progress").length;

  return (
    <DashboardLayout role={role}>
      <div className="w-full min-w-0 flex flex-col gap-5">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-tight">My Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {COURSES.length} courses · {inProgress} in progress
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
          <div className="flex items-center gap-1 w-max">
            {[
              { key: "all" as const, label: "All" },
              { key: "in-progress" as const, label: "In Progress" },
              { key: "completed" as const, label: "Completed" },
              { key: "expired" as const, label: "Expired" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  filter === key
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Course grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="size-14 rounded-full bg-muted flex items-center justify-center">
              <HugeiconsIcon
                icon={BookOpen01Icon}
                size={24}
                className="text-muted-foreground"
              />
            </div>
            <p className="text-sm text-muted-foreground">No courses found</p>
            <Button
              className="rounded-full"
              render={
                <Link href={`/dashboard/explore?role=${role}`}>
                  <HugeiconsIcon
                    icon={CompassIcon}
                    size={15}
                    className="mr-1.5"
                  />
                  Explore Courses
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/courses/${c.id}/learn?role=${role}`}
              >
                <Card className="p-5 hover:bg-muted/30 transition-colors h-full flex flex-col gap-3">
                  {/* Icon + status */}
                  <div className="flex items-start justify-between">
                    <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
                      <HugeiconsIcon
                        icon={
                          c.status === "completed" ? BookOpen01Icon : PlayIcon
                        }
                        size={18}
                        className="text-muted-foreground"
                      />
                    </div>
                    {c.status === "completed" && (
                      <Badge
                        variant="secondary"
                        className="rounded-full text-[10px] px-2 py-0 h-5"
                      >
                        Done
                      </Badge>
                    )}
                    {c.status === "expired" && (
                      <Badge
                        variant="secondary"
                        className="rounded-full text-[10px] px-2 py-0 h-5 text-muted-foreground"
                      >
                        Expired
                      </Badge>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold leading-snug">
                      {c.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {c.instructor} &middot; {c.community}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-2">
                    <Progress value={c.progress} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                      {c.progress}%
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-[10px] text-muted-foreground">
                      {c.lastAccessed}
                    </span>
                    <Button
                      size="sm"
                      variant={c.status === "completed" ? "outline" : "default"}
                      className="rounded-full h-7 text-xs"
                    >
                      {c.status === "completed" ? "Review" : "Resume"}
                    </Button>
                  </div>
                </Card>
              </Link>
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
        <div className="w-full min-w-0 p-6">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <MyCoursesPage />
    </Suspense>
  );
}
