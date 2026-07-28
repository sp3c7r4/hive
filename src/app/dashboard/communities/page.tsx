"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  UserGroupIcon,
  Globe02Icon,
  LockIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";

/* ---------------------------------------------------------------- */
/*  Types & demo data                                               */
/* ---------------------------------------------------------------- */

type Role = "instructor" | "student" | "parent" | "admin";

type Community = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  visibility: "public" | "private" | "invite-only";
  memberCount: number;
  coverUrl?: string;
};

const visibilityMeta = {
  public: { icon: Globe02Icon, label: "Public", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  private: { icon: LockIcon, label: "Private", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  "invite-only": { icon: Mail01Icon, label: "Invite Only", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
} as const;

const MOCK_COMMUNITIES: Community[] = [
  {
    id: "1",
    name: "Frontend Devs",
    slug: "frontend-devs",
    description: "A community for frontend developers to share tips, tricks, and best practices. We cover React, Vue, CSS, and everything in between.",
    category: "Development",
    visibility: "public",
    memberCount: 1248,
  },
  {
    id: "2",
    name: "UI/UX Critique Circle",
    slug: "uiux-critique-circle",
    description: "Weekly design critiques, portfolio reviews, and UX discussions. Bring your work and get honest, constructive feedback.",
    category: "Design",
    visibility: "public",
    memberCount: 860,
  },
  {
    id: "3",
    name: "Data Science Lab",
    slug: "data-science-lab",
    description: "Collaborative space for data scientists and analysts. Share datasets, discuss methodologies, and work on real-world problems.",
    category: "Data Science",
    visibility: "private",
    memberCount: 342,
  },
  {
    id: "4",
    name: "Freelance Creatives",
    slug: "freelance-creatives",
    description: "For designers, writers, and developers navigating the freelance life. Pricing strategies, client management, and community support.",
    category: "Business",
    visibility: "invite-only",
    memberCount: 156,
  },
];

/* ---------------------------------------------------------------- */
/*  Community card                                                  */
/* ---------------------------------------------------------------- */

function CommunityCard({ community }: { community: Community }) {
  const vis = visibilityMeta[community.visibility];

  return (
    <Link href={`/dashboard/communities/${community.slug}/manage`}>
      <Card className="overflow-hidden hover:bg-muted/40 transition-colors h-full flex flex-col">
        {/* Cover */}
        <div className="aspect-[2.5/1] bg-gradient-to-br from-muted/80 via-muted/40 to-muted flex items-center justify-center relative">
          <span className="text-4xl opacity-20 font-black tracking-tighter select-none">
            {community.name.charAt(0)}
          </span>
          <Badge
            variant="secondary"
            className={`absolute top-3 left-3 rounded-full text-[10px] px-2 py-0 h-5 font-medium ${vis.color}`}
          >
            <HugeiconsIcon icon={vis.icon} size={11} className="mr-1" />
            {vis.label}
          </Badge>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold truncate">{community.name}</p>
            <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0 h-5 shrink-0">
              {community.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
            {community.description}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-2 pt-2 border-t">
            <HugeiconsIcon icon={UserGroupIcon} size={13} />
            <span>{community.memberCount.toLocaleString()} members</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

/* ---------------------------------------------------------------- */
/*  Communities Page                                                */
/* ---------------------------------------------------------------- */

function CommunitiesPage() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "instructor";

  const communities = MOCK_COMMUNITIES;

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              My Communities
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {communities.length} communit{communities.length !== 1 && "ies"}
            </p>
          </div>
          <Button
            className="rounded-full w-full sm:w-auto"
            render={
              <Link href={`/dashboard/communities/create?role=${role}`}>
                <HugeiconsIcon icon={Add01Icon} size={16} className="mr-1.5" />
                Create Community
              </Link>
            }
          />
        </div>

        {/* List */}
        {communities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center">
              <HugeiconsIcon icon={UserGroupIcon} size={28} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">No communities yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Create your first community and start building your network
              </p>
            </div>
            <Button
              className="rounded-full"
              render={
                <Link href={`/dashboard/communities/create?role=${role}`}>
                  <HugeiconsIcon icon={Add01Icon} size={16} className="mr-1.5" />
                  Create Community
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities.map((c) => (
              <CommunityCard key={c.id} community={c} />
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

export default function CommunitiesPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6 px-4 py-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-56 rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <CommunitiesPage />
    </Suspense>
  );
}
