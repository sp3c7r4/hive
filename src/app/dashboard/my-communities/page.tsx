"use client";

import {
  ArrowRight02Icon,
  BookOpen01Icon,
  CompassIcon,
  StarIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DashboardLayout } from "@/components/app-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Role = "instructor" | "student" | "parent" | "admin";

const JOINED = [
  {
    name: "Frontend Devs",
    slug: "frontend-devs",
    category: "Development",
    memberCount: 1248,
    rating: 4.8,
    courseCount: 6,
    instructor: { name: "Ade Okafor", initials: "AO" },
    lastActive: "2 hours ago",
  },
  {
    name: "UI/UX Designers Hub",
    slug: "uiux-hub",
    category: "Design",
    memberCount: 892,
    rating: 4.6,
    courseCount: 4,
    instructor: { name: "Nkechi Ezeh", initials: "NE" },
    lastActive: "1 day ago",
  },
  {
    name: "Backend Gurus",
    slug: "backend-gurus",
    category: "Development",
    memberCount: 567,
    rating: 4.7,
    courseCount: 3,
    instructor: { name: "Emeka Nwachukwu", initials: "EN" },
    lastActive: "3 days ago",
  },
];

function MyCommunitiesPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const role = (sp.get("role") as Role) || "student";

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 max-w-4xl min-w-0">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">My Communities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Communities you&apos;ve joined. Visit the feed to connect with other
            members.
          </p>
        </div>

        {JOINED.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-14 sm:size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <HugeiconsIcon
                icon={UserGroupIcon}
                size={24}
                className="sm:size-[28px] text-muted-foreground"
              />
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-1">
              No communities yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Discover communities to join and start learning with others.
            </p>
            <Button
              className="rounded-full"
              onClick={() => router.push("/dashboard/explore")}
            >
              <HugeiconsIcon icon={CompassIcon} size={16} className="mr-1.5" />
              Discover Communities
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {JOINED.map((c) => (
              <Card
                key={c.slug}
                className="p-5 hover:bg-muted/20 transition-colors cursor-pointer group"
                onClick={() =>
                  router.push(
                    `/dashboard/explore/communities/${c.slug}?role=${role}`,
                  )
                }
              >
                {/* Banner placeholder */}
                <div className="aspect-[2.5/1] rounded-xl bg-gradient-to-br from-muted/80 to-muted mb-4 flex items-center justify-center relative overflow-hidden">
                  <span className="text-4xl opacity-10 font-black select-none">
                    {c.name.charAt(0)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold group-hover:text-primary transition-colors">
                        {c.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="rounded-full text-[10px] px-1.5 py-0 h-4"
                      >
                        {c.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                      <span className="flex items-center gap-0.5">
                        <HugeiconsIcon
                          icon={StarIcon}
                          size={11}
                          className="text-amber-500 fill-amber-500"
                        />
                        {c.rating}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <HugeiconsIcon icon={UserGroupIcon} size={11} />
                        {c.memberCount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <HugeiconsIcon icon={BookOpen01Icon} size={11} />
                        {c.courseCount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[9px]">
                          {c.instructor.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[11px] text-muted-foreground">
                        {c.instructor.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {c.lastActive}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full text-xs group-hover:border-primary/50"
                  >
                    View Feed
                    <HugeiconsIcon
                      icon={ArrowRight02Icon}
                      size={12}
                      className="ml-1"
                    />
                  </Button>
                </div>
              </Card>
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
        <div className="p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-64 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[280px] rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <MyCommunitiesPage />
    </Suspense>
  );
}
