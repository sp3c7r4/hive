"use client";

import {
  BookOpen01Icon,
  UserCheck01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/* ---------------------------------------------------------------- */
/*  Types & data                                                    */
/* ---------------------------------------------------------------- */

type Role = "instructor" | "student" | "parent" | "admin";
type ResultTab = "all" | "community" | "course" | "person";

type ResultItem = {
  id: string;
  type: "community" | "course" | "person";
  label: string;
  sub: string;
  href: string;
};

const ALL_RESULTS: ResultItem[] = [
  {
    id: "c1",
    type: "community",
    label: "Frontend Devs",
    sub: "1.2k members · 48 online",
    href: "/dashboard/communities/frontend-devs/manage",
  },
  {
    id: "c2",
    type: "community",
    label: "UI/UX Critique Circle",
    sub: "860 members · 12 online",
    href: "/dashboard/communities/uiux-critique/manage",
  },
  {
    id: "c3",
    type: "community",
    label: "Backend Engineers",
    sub: "2.1k members · 31 online",
    href: "/dashboard/communities/backend-engineers/manage",
  },
  {
    id: "c4",
    type: "community",
    label: "Data Science Hub",
    sub: "940 members · 6 online",
    href: "/dashboard/communities/data-science/manage",
  },
  {
    id: "cr1",
    type: "course",
    label: "Frontend with React",
    sub: "Intermediate · 12 weeks · ₦45,000",
    href: "/dashboard/courses/react-frontend",
  },
  {
    id: "cr2",
    type: "course",
    label: "Data Analysis with Excel",
    sub: "Beginner · 6 weeks · ₦25,000",
    href: "/dashboard/courses/data-analysis",
  },
  {
    id: "cr3",
    type: "course",
    label: "UI/UX Fundamentals",
    sub: "Beginner · 8 weeks · ₦35,000",
    href: "/dashboard/courses/uiux-fundamentals",
  },
  {
    id: "cr4",
    type: "course",
    label: "Node.js Masterclass",
    sub: "Advanced · 10 weeks · ₦60,000",
    href: "/dashboard/courses/nodejs-masterclass",
  },
  {
    id: "p1",
    type: "person",
    label: "Ade Okafor",
    sub: "Instructor · Frontend",
    href: "/dashboard/profile/ade",
  },
  {
    id: "p2",
    type: "person",
    label: "Dr. Okonkwo",
    sub: "Instructor · Data Science",
    href: "/dashboard/profile/okonkwo",
  },
  {
    id: "p3",
    type: "person",
    label: "Kelechi Nwosu",
    sub: "Student · Cohort 4",
    href: "/dashboard/profile/kelechi",
  },
  {
    id: "p4",
    type: "person",
    label: "Amara Obi",
    sub: "Student · Cohort 5",
    href: "/dashboard/profile/amara",
  },
];

const TABS: { key: ResultTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "community", label: "Communities" },
  { key: "course", label: "Courses" },
  { key: "person", label: "People" },
];

const typeBadge = {
  community:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" as const,
  course:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" as const,
  person:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" as const,
};

const typeLabel = {
  community: "Community",
  course: "Course",
  person: "Person",
};

/* ---------------------------------------------------------------- */
/*  Search Page                                                     */
/* ---------------------------------------------------------------- */

function SearchPage() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "student";
  const query = searchParams.get("q") || "";

  const [tab, setTab] = useState<ResultTab>("all");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    let filtered = ALL_RESULTS.filter(
      (r) =>
        r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q),
    );
    if (tab !== "all") filtered = filtered.filter((r) => r.type === tab);
    return filtered;
  }, [query, tab]);

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 min-w-0">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            {query ? `Results for "${query}"` : "Search"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {results.length} result{results.length !== 1 && "s"} found
          </p>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
          <div className="flex items-center gap-1 w-max">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                  tab === key
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <p className="text-sm text-muted-foreground">
              {query.trim()
                ? `No results found for "${query}"`
                : "Enter a search term to find communities, courses, and people"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item) => (
              <Link key={item.id} href={item.href}>
                <Card className="p-4 hover:bg-muted/40 transition-colors h-full flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className={`rounded-full text-[10px] px-2 py-0 h-5 font-medium ${typeBadge[item.type]}`}
                    >
                      {typeLabel[item.type]}
                    </Badge>
                    <HugeiconsIcon
                      icon={
                        item.type === "community"
                          ? UserGroupIcon
                          : item.type === "course"
                            ? BookOpen01Icon
                            : UserCheck01Icon
                      }
                      size={16}
                      className="text-muted-foreground/40"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.sub}
                    </p>
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

/* ---------------------------------------------------------------- */
/*  Page export                                                     */
/* ---------------------------------------------------------------- */

export default function SearchPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6 px-4 py-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
