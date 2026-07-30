"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  UserGroupIcon,
  Globe02Icon,
  LockIcon,
  Mail01Icon,
  StarIcon,
  CourseIcon,
  BookOpen01Icon,
  BubbleChatIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { resolveCommunity } from "@/lib/community-utils";
import { COURSES_DATA } from "@/lib/course-utils";

type Role = "instructor" | "student" | "parent" | "admin";
type Tab = "feed" | "about";

const visMeta = {
  public: {
    icon: Globe02Icon,
    label: "Public",
    color: "bg-emerald-100 text-emerald-700",
  },
  private: {
    icon: LockIcon,
    label: "Private",
    color: "bg-amber-100 text-amber-700",
  },
  "invite-only": {
    icon: Mail01Icon,
    label: "Invite Only",
    color: "bg-violet-100 text-violet-700",
  },
} as const;

const diffColors = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-rose-100 text-rose-700",
} as const;

function CommunityLandingPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const role = (sp.get("role") as Role) || "student";
  const community = resolveCommunity(params.slug);
  const [tab, setTab] = useState<Tab>("about");
  const [isMember, setIsMember] = useState(false);

  if (!community) {
    return (
      <DashboardLayout role={role}>
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4 min-w-0">
          <div className="size-14 rounded-full bg-muted flex items-center justify-center">
            <HugeiconsIcon icon={UserGroupIcon} size={24} className="text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">Community not found</h2>
          <p className="text-sm text-muted-foreground max-w-sm">The community you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
          <Button variant="outline" className="rounded-full" render={<Link href={`/dashboard/explore?role=${role}`}>Browse Communities</Link>} />
        </div>
      </DashboardLayout>
    );
  }

  const communityCourses = COURSES_DATA.filter((c) => c.communitySlug === community.slug);
  const vm = visMeta[community.visibility as keyof typeof visMeta];

  const joinCta = (() => {
    if (community.visibility === "invite-only")
      return {
        label: "This community is invite-only",
        disabled: true,
        action: () => {},
      };
    if (community.requiresApproval)
      return {
        label: "Request to Join",
        disabled: false,
        action: () =>
          router.push(`/dashboard/payments?success=1&role=${role}`),
      };
    if (community.price !== "Free")
      return {
        label: `Join for ${community.price}/month`,
        disabled: false,
        action: () =>
          router.push(`/dashboard/payments?success=1&role=${role}`),
      };
    return {
      label: "Join Now",
      disabled: false,
      action: () => {
        setIsMember(true);
        setTab("feed");
        router.push(`/dashboard/payments?success=1&role=${role}`);
      },
    };
  })();

  const TABS: { key: Tab; label: string; icon: typeof BubbleChatIcon }[] = [
    { key: "feed", label: "Feed", icon: BubbleChatIcon },
    {
      key: "about",
      label: "About",
      icon: InformationCircleIcon,
    },
  ];

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 min-w-0 max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground w-fit"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
          Back to Discover
        </button>

        {/* Banner */}
        <div className="aspect-[3/1] rounded-2xl bg-gradient-to-br from-muted/80 via-muted/40 to-muted flex items-center justify-center relative overflow-hidden">
          <span className="text-8xl opacity-10 font-black select-none absolute">
            {community.name.charAt(0)}
          </span>
          <Badge
            className={`absolute top-4 left-4 rounded-full text-[10px] px-2.5 py-0.5 h-6 font-medium ${vm.color}`}
          >
            <HugeiconsIcon icon={vm.icon} size={12} className="mr-1" />
            {vm.label}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{community.name}</h1>
                <Badge variant="secondary" className="rounded-full">
                  {community.category}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <HugeiconsIcon
                    icon={StarIcon}
                    size={14}
                    className="text-amber-500 fill-amber-500"
                  />
                  {community.rating} ({community.reviewCount} reviews)
                </span>
                <span>
                  <HugeiconsIcon icon={UserGroupIcon} size={14} className="inline mr-1" />
                  {community.memberCount.toLocaleString()} members
                </span>
                <span>
                  <HugeiconsIcon
                    icon={BookOpen01Icon}
                    size={14}
                    className="inline mr-1"
                  />
                  {community.courseCount} courses
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted w-fit">
              {TABS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-sm font-medium transition-colors",
                      tab === t.key
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <HugeiconsIcon icon={Icon} size={14} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <Separator />

            {/* Tab content */}
            {tab === "feed" && (
              <CommunityFeed
                isMember={isMember}
                onJoinRequest={() => {
                  setIsMember(true);
                  router.push(
                    `/dashboard/payments?success=1&role=${role}`
                  );
                }}
              />
            )}

            {tab === "about" && (
              <>
                <div>
                  <h2 className="text-sm font-semibold mb-2">About</h2>
                  {community.description.split("\n\n").map((p, i) => (
                    <p
                      key={i}
                      className="text-sm text-muted-foreground leading-relaxed mb-3"
                    >
                      {p}
                    </p>
                  ))}
                </div>
                <Separator />
                <div>
                  <h2 className="text-sm font-semibold mb-3">
                    Courses ({communityCourses.length})
                  </h2>
                  <div className="flex flex-col gap-2">
                    {communityCourses.map((c) => (
                      <div
                        key={c.slug}
                        className="flex items-center justify-between rounded-xl border p-3 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <HugeiconsIcon
                              icon={CourseIcon}
                              size={16}
                              className="text-muted-foreground"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {c.title}
                            </p>
                            <Badge
                              className={`rounded-full text-[10px] px-1.5 py-0 h-4 mt-0.5 ${diffColors[c.difficulty]}`}
                            >
                              {c.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {c.price !== "Free" && (
                            <HugeiconsIcon
                              icon={LockIcon}
                              size={14}
                              className="text-muted-foreground"
                            />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {c.price === "Free" ? "Free" : c.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <Card className="p-5 flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Instructor</h3>
              <div className="flex items-center gap-3">
                <Avatar className="size-12 shrink-0">
                  <AvatarFallback className="text-sm">
                    {community.instructor.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">
                    {community.instructor.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-3 mt-0.5">
                    {community.instructor.bio}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {community.instructor.specialties.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="rounded-full text-[10px] px-2 py-0 h-5"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </Card>
            <Button
              className="rounded-full w-full"
              disabled={joinCta.disabled || isMember}
              onClick={joinCta.action}
            >
              {isMember ? "Joined ✓" : joinCta.label}
            </Button>
            {!joinCta.disabled && (
              <p className="text-[10px] text-muted-foreground text-center -mt-2">
                {community.price === "Free"
                  ? "Instant access. No payment required."
                  : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function Wrapper() {
  return (
    <Suspense
      fallback={
        <div className="p-6">
          <Skeleton className="h-48 rounded-2xl mb-6" />
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      }
    >
      <CommunityLandingPage />
    </Suspense>
  );
}
