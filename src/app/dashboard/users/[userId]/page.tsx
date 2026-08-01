"use client";

import {
  ArrowLeft02Icon,
  BookOpen01Icon,
  Clock01Icon,
  CreditCardIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { DashboardLayout } from "@/components/app-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Role = "instructor" | "student" | "parent" | "admin";

/* ---- demo user profiles ---- */

const PROFILES: Record<
  string,
  {
    id: string;
    name: string;
    initials: string;
    email: string;
    role: string;
    status: string;
    joined: string;
    phone: string;
    enrollments: { course: string; status: string; date: string }[];
    payments: { desc: string; amount: string; date: string; status: string }[];
    communities: {
      name: string;
      members: number;
      courses: number;
      revenue: string;
    }[];
    activity: { action: string; detail: string; time: string }[];
  }
> = {
  u1: {
    id: "u1",
    name: "Ade Okafor",
    initials: "AO",
    email: "ade@hive.ng",
    role: "instructor",
    status: "active",
    joined: "Jan 2024",
    phone: "+234 801 234 5678",
    enrollments: [],
    payments: [],
    communities: [
      { name: "Frontend Devs", members: 1248, courses: 6, revenue: "₦1.2M" },
      { name: "UI/UX Hub", members: 456, courses: 3, revenue: "₦320K" },
    ],
    activity: [
      {
        action: "Created course",
        detail: "Advanced TypeScript Patterns",
        time: "2d ago",
      },
      {
        action: "Approved member",
        detail: "Chioma Eze joined Frontend Devs",
        time: "3d ago",
      },
      {
        action: "Withdrew earnings",
        detail: "₦50,000 to GTBank",
        time: "1w ago",
      },
    ],
  },
  u2: {
    id: "u2",
    name: "Chioma Eze",
    initials: "CE",
    email: "chioma@hive.ng",
    role: "student",
    status: "active",
    joined: "Mar 2024",
    phone: "+234 802 345 6789",
    enrollments: [
      {
        course: "React for Designers",
        status: "78% complete",
        date: "Mar 2024",
      },
      { course: "CSS Mastery", status: "Completed", date: "Feb 2024" },
      {
        course: "Python for Data Science",
        status: "35% complete",
        date: "Jan 2024",
      },
    ],
    payments: [
      {
        desc: "CSS Mastery (One-time)",
        amount: "₦8,000",
        date: "Feb 2024",
        status: "success",
      },
      {
        desc: "Python for Data Science (Enrollment)",
        amount: "₦10,000",
        date: "Jan 2024",
        status: "success",
      },
    ],
    communities: [],
    activity: [
      {
        action: "Completed quiz",
        detail: "React Fundamentals Quiz — 8/10",
        time: "2h ago",
      },
      {
        action: "Submitted assignment",
        detail: "Design Portfolio",
        time: "5d ago",
      },
      { action: "Joined community", detail: "Frontend Devs", time: "Mar 2024" },
    ],
  },
  u4: {
    id: "u4",
    name: "Fatima Bello",
    initials: "FB",
    email: "fatima@hive.ng",
    role: "instructor",
    status: "active",
    joined: "Nov 2024",
    phone: "+234 803 456 7890",
    enrollments: [],
    payments: [],
    communities: [
      { name: "Data Science Lab", members: 892, courses: 4, revenue: "₦450K" },
    ],
    activity: [
      {
        action: "Created community",
        detail: "Data Science Lab",
        time: "Nov 2024",
      },
      {
        action: "Published course",
        detail: "Python for Data Science",
        time: "Dec 2024",
      },
      {
        action: "Withdrew earnings",
        detail: "₦25,000 to Access Bank",
        time: "3d ago",
      },
    ],
  },
};

function UserDetailPage() {
  const params = useParams();
  const sp = useSearchParams();
  const router = useRouter();
  const role = (sp.get("role") as Role) || "admin";
  const userId = params.userId as string;
  const user = PROFILES[userId];
  const [tab, setTab] = useState("activity");

  if (!user) {
    return (
      <DashboardLayout role={role}>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { key: "activity", label: "Activity", icon: Clock01Icon },
    { key: "enrollments", label: "Enrollments", icon: BookOpen01Icon },
    { key: "payments", label: "Payments", icon: CreditCardIcon },
    ...(user.role === "instructor"
      ? [
          {
            key: "communities" as const,
            label: "Communities",
            icon: UserGroupIcon,
          },
        ]
      : []),
  ];

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-5 max-w-4xl min-w-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground w-fit"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
          Back to Users
        </button>

        {/* Header */}
        <Card className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar className="size-14 shrink-0">
              <AvatarFallback className="text-base">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{user.name}</h1>
                <Badge
                  className={cn(
                    "rounded-full text-[10px] px-2 py-0 h-5",
                    user.role === "instructor"
                      ? "bg-violet-100 text-violet-700"
                      : user.role === "student"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700",
                  )}
                >
                  {user.role}
                </Badge>
                <Badge
                  className={cn(
                    "rounded-full text-[10px] px-2 py-0 h-5",
                    user.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700",
                  )}
                >
                  {user.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {user.email} · {user.phone} · Joined {user.joined}
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-sm font-medium transition-colors",
                tab === t.key
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <HugeiconsIcon icon={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "activity" && (
          <div className="flex flex-col gap-2">
            {user.activity.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border p-3"
              >
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={14}
                    className="text-muted-foreground"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.detail}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        )}
        {tab === "enrollments" &&
          (user.enrollments.length ? (
            <Card className="p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                    <th className="text-left px-4 py-3">Course</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {user.enrollments.map((e, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-medium">{e.course}</td>
                      <td className="px-4 py-3">{e.status}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {e.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No enrollments
            </p>
          ))}
        {tab === "payments" &&
          (user.payments.length ? (
            <Card className="p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                    <th className="text-left px-4 py-3">Description</th>
                    <th className="text-left px-4 py-3">Amount</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {user.payments.map((p, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-medium">{p.desc}</td>
                      <td className="px-4 py-3 tabular-nums">{p.amount}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {p.date}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="rounded-full text-[10px] px-2 py-0 h-5 bg-emerald-100 text-emerald-700">
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No payments
            </p>
          ))}
        {tab === "communities" &&
          (user.communities?.length ? (
            user.communities.map((c, i) => (
              <Card key={i} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.members.toLocaleString()} members · {c.courses} courses ·{" "}
                    {c.revenue} revenue
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() =>
                    router.push(
                      `/dashboard/explore/communities/${c.name.toLowerCase().replace(/\s/g, "-")}?role=admin`,
                    )
                  }
                >
                  View
                </Button>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No communities
            </p>
          ))}
      </div>
    </DashboardLayout>
  );
}

export default function Wrapper() {
  return (
    <Suspense
      fallback={
        <div className="p-6">
          <Skeleton className="h-32 rounded-xl mb-4" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      }
    >
      <UserDetailPage />
    </Suspense>
  );
}
