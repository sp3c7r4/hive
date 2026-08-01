"use client";

import {
  BookOpen01Icon,
  Building02Icon,
  CourseIcon,
  Globe02Icon,
  LockIcon,
  Mail01Icon,
  Search02Icon,
  StarIcon,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { COURSES_DATA } from "@/lib/course-utils";

type Role = "instructor" | "student" | "parent" | "admin";
type ExploreTab = "communities" | "courses";

const CATEGORIES = [
  "All",
  "Design",
  "Development",
  "Data Science",
  "Business",
  "Marketing",
  "Product",
  "Writing",
  "Photography",
  "Music",
];

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

const MOCK_COMMUNITIES = [
  {
    id: "c1",
    name: "Frontend Devs",
    slug: "frontend-devs",
    category: "Development",
    memberCount: 1248,
    courseCount: 6,
    visibility: "public" as const,
    rating: 4.8,
    description:
      "A community for frontend developers to share tips and best practices.",
    price: "Free",
  },
  {
    id: "c2",
    name: "UI/UX Critique Circle",
    slug: "uiux-critique",
    category: "Design",
    memberCount: 860,
    courseCount: 3,
    visibility: "public" as const,
    rating: 4.6,
    description: "Weekly critiques and UX discussions.",
    price: "Free",
  },
  {
    id: "c3",
    name: "Data Science Lab",
    slug: "data-science-lab",
    category: "Data Science",
    memberCount: 342,
    courseCount: 4,
    visibility: "private" as const,
    rating: 4.5,
    description: "Collaborative data science projects.",
    price: "₦5,000/mo",
  },
  {
    id: "c4",
    name: "Freelance Creatives",
    slug: "freelance-creatives",
    category: "Business",
    memberCount: 156,
    courseCount: 2,
    visibility: "invite-only" as const,
    rating: 4.9,
    description: "For creatives navigating freelance life.",
    price: "Free",
  },
  {
    id: "c5",
    name: "Backend Engineers",
    slug: "backend-engineers",
    category: "Development",
    memberCount: 2100,
    courseCount: 8,
    visibility: "public" as const,
    rating: 4.7,
    description: "Node.js, Python, Go — all things backend.",
    price: "Free",
  },
  {
    id: "c6",
    name: "Product Management Hub",
    slug: "product-hub",
    category: "Product",
    memberCount: 480,
    courseCount: 3,
    visibility: "public" as const,
    rating: 4.4,
    description: "PM frameworks, case studies, and mentorship.",
    price: "₦3,000/mo",
  },
];

// Courses sourced from shared catalogue — only public courses appear on Explore
const ALL_COURSES = COURSES_DATA.filter((c) => c.visibility === "public").map(
  (c, i) => ({
    id: `cr${i + 1}`,
    title: c.title,
    slug: c.slug,
    category: c.category,
    difficulty: c.difficulty,
    rating: c.rating,
    reviewCount: c.reviewCount,
    price: c.price,
    instructor: c.instructor,
    enrollmentCount: c.enrollmentCount,
    description: c.subtitle,
    certificate: c.certificate,
    communityName: c.communityName,
    communitySlug: c.communitySlug,
  }),
);

const visMeta = {
  public: {
    icon: Globe02Icon,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  private: {
    icon: LockIcon,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  "invite-only": {
    icon: Mail01Icon,
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  },
} as const;

const diffColors = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-rose-100 text-rose-700",
} as const;

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <HugeiconsIcon
        icon={StarIcon}
        size={13}
        className="text-amber-500 fill-amber-500"
      />
      <span className="text-xs font-medium">{rating}</span>
      {count != null && (
        <span className="text-[10px] text-muted-foreground">({count})</span>
      )}
    </div>
  );
}

function ExplorePage() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "student";
  const [tab, setTab] = useState<ExploreTab>("communities");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  const filteredCommunities = useMemo(() => {
    let list = MOCK_COMMUNITIES;
    const q = search.toLowerCase();
    if (q)
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q),
      );
    if (category !== "All") list = list.filter((c) => c.category === category);
    if (priceFilter === "Free") list = list.filter((c) => c.price === "Free");
    if (priceFilter === "Paid") list = list.filter((c) => c.price !== "Free");
    return list;
  }, [search, category, priceFilter]);

  const filteredCourses = useMemo(() => {
    let list = ALL_COURSES;
    const q = search.toLowerCase();
    if (q)
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q),
      );
    if (category !== "All") list = list.filter((c) => c.category === category);
    if (difficulty !== "All")
      list = list.filter((c) => c.difficulty === difficulty);
    if (priceFilter === "Free") list = list.filter((c) => c.price === "Free");
    if (priceFilter === "Paid") list = list.filter((c) => c.price !== "Free");
    return list;
  }, [search, category, difficulty, priceFilter]);

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 min-w-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Discover</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Find communities and courses to join
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {[
            {
              key: "communities" as const,
              label: "Communities",
              icon: UserGroupIcon,
            },
            { key: "courses" as const, label: "Courses", icon: BookOpen01Icon },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-full transition-colors ${tab === key ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            >
              <HugeiconsIcon icon={icon} size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <HugeiconsIcon
              icon={Search02Icon}
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${tab}...`}
              className="rounded-full pl-9"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="text-xs rounded-full h-8 px-3 w-auto gap-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {tab === "courses" && (
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="text-xs rounded-full h-8 px-3 w-auto gap-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="text-xs rounded-full h-8 px-3 w-auto gap-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Prices</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {tab === "communities" ? (
          filteredCommunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
              <HugeiconsIcon
                icon={UserGroupIcon}
                size={32}
                className="text-muted-foreground/40"
              />
              <p className="text-sm text-muted-foreground">
                No communities found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCommunities.map((c) => {
                const vm = visMeta[c.visibility];
                return (
                  <Link
                    key={c.id}
                    href={`/dashboard/explore/communities/${c.slug}?role=${role}`}
                  >
                    <Card className="overflow-hidden hover:bg-muted/40 transition-colors h-full flex flex-col">
                      <div className="aspect-[2.5/1] bg-gradient-to-br from-muted/80 via-muted/40 to-muted flex items-center justify-center relative">
                        <span className="text-4xl opacity-20 font-black select-none">
                          {c.name.charAt(0)}
                        </span>
                        <Badge
                          className={`absolute top-3 left-3 rounded-full text-[10px] px-2 py-0 h-5 font-medium ${vm.color}`}
                        >
                          <HugeiconsIcon
                            icon={vm.icon}
                            size={11}
                            className="mr-1"
                          />
                          {c.visibility}
                        </Badge>
                      </div>
                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold truncate">
                            {c.name}
                          </p>
                          <Badge
                            variant="secondary"
                            className="rounded-full text-[10px] px-2 py-0 h-5 shrink-0"
                          >
                            {c.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {c.description}
                        </p>
                        <StarRating rating={c.rating} />
                        <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px] text-muted-foreground">
                          <span>
                            <HugeiconsIcon icon={UserGroupIcon} size={12} />{" "}
                            {c.memberCount.toLocaleString()} members
                          </span>
                          <span>
                            {c.courseCount} courses · {c.price}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
            <HugeiconsIcon
              icon={BookOpen01Icon}
              size={32}
              className="text-muted-foreground/40"
            />
            <p className="text-sm text-muted-foreground">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((c: (typeof ALL_COURSES)[number]) => (
              <Link
                key={c.id}
                href={`/dashboard/explore/courses/${c.slug}?role=${role}`}
              >
                <Card className="overflow-hidden hover:bg-muted/40 transition-colors h-full flex flex-col">
                  <div className="aspect-[2.5/1] bg-gradient-to-br from-muted/80 via-muted/40 to-muted flex items-center justify-center relative">
                    <HugeiconsIcon
                      icon={CourseIcon}
                      size={36}
                      className="text-muted-foreground/20"
                    />
                    <Badge
                      className={`absolute top-3 left-3 rounded-full text-[10px] px-2 py-0 h-5 ${diffColors[c.difficulty]}`}
                    >
                      {c.difficulty}
                    </Badge>
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold truncate">
                        {c.title}
                      </p>
                      <Badge
                        variant="secondary"
                        className="rounded-full text-[10px] px-2 py-0 h-5 shrink-0"
                      >
                        {c.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {c.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <div className="size-5 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-[9px] font-medium">
                          {c.instructor.initials}
                        </span>
                      </div>
                      {c.instructor.name}
                    </div>
                    <Link
                      href={`/dashboard/explore/communities/${c.communitySlug}?role=${role}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      <HugeiconsIcon icon={Building02Icon} size={11} />
                      {c.communityName}
                    </Link>
                    <StarRating rating={c.rating} count={c.reviewCount} />
                    <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px] text-muted-foreground">
                      <span>
                        <HugeiconsIcon icon={UserGroupIcon} size={12} />{" "}
                        {c.enrollmentCount} enrolled
                      </span>
                      <span className="font-medium">{c.price}</span>
                    </div>
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
        <div className="grid grid-cols-3 gap-4 p-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      }
    >
      <ExplorePage />
    </Suspense>
  );
}
