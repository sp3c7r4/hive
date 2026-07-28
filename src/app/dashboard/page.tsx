"use client";

import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { getDashboardRole } from "@/lib/role-utils";
import gsap from "gsap";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { DashboardLayout } from "@/components/app-sidebar";
import { ParentDashboard } from "@/components/dashboard/parent-dashboard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Clock01Icon,
  PlayIcon,
  Award01Icon,
  Notification03Icon,
  Dollar01Icon,
  UserCheck01Icon,
  CourseIcon,
  Add01Icon,
  Message02Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";

type Role = "instructor" | "student" | "parent" | "admin";

/* ---------------------------------------------------------------- */
/*  Demo data                                                       */
/* ---------------------------------------------------------------- */

const dueSoon: { id: number; title: string; course: string; href: string; dueInHours: number }[] = [
  // {
  //   id: 1,
  //   title: "Module 3 Quiz",
  //   course: "UI/UX Design Fundamentals",
  //   href: "/courses/uiux/quiz-3",
  //   dueInHours: 6,
  // },
  // {
  //   id: 2,
  //   title: "Landing Page Assignment",
  //   course: "Frontend with React",
  //   href: "/courses/react/assignment-2",
  //   dueInHours: 48,
  // },
  // {
  //   id: 3,
  //   title: "Final Project Submission",
  //   course: "Data Analysis with Excel",
  //   href: "/courses/excel/final",
  //   dueInHours: 168,
  // },
];

const continueLearning = [
  {
    id: 1,
    title: "UI/UX Design Fundamentals",
    instructor: "Ade Okafor",
    progress: 62,
    cover: "/images/course-uiux.jpg",
  },
  {
    id: 2,
    title: "Frontend with React",
    instructor: "Chidinma Obi",
    progress: 30,
    cover: "/images/course-react.jpg",
  },
  {
    id: 3,
    title: "Data Analysis with Excel",
    instructor: "Tunde Bakare",
    progress: 85,
    cover: "/images/course-excel.jpg",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "submission",
    text: "Submitted Module 2 assignment",
    time: "10 minutes ago",
  },
  {
    id: 2,
    type: "badge",
    text: "Earned the Quick Learner badge",
    time: "3 hours ago",
  },
  {
    id: 3,
    type: "class",
    text: "Attended live class: Typography Basics",
    time: "Yesterday",
  },
  {
    id: 4,
    type: "feedback",
    text: "Instructor left feedback on your quiz",
    time: "2 days ago",
  },
  {
    id: 5,
    type: "enrollment",
    text: "Enrolled in Frontend with React",
    time: "3 days ago",
  },
];

const studentActivityTypes = [
  { key: "all", label: "All" },
  { key: "submission", label: "Submission" },
  { key: "badge", label: "Badge" },
  { key: "class", label: "Class" },
  { key: "feedback", label: "Feedback" },
  { key: "enrollment", label: "Enrollment" },
];

/* ---------------------------------------------------------------- */
/*  Urgency badge helper                                             */
/* ---------------------------------------------------------------- */

function urgencyBadge(hours: number) {
  if (hours <= 24)
    return (
      <Badge variant="destructive" className="shrink-0">
        Due today
      </Badge>
    );
  if (hours <= 72)
    return (
      <Badge className="shrink-0 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
        Due soon
      </Badge>
    );
  return (
    <Badge variant="secondary" className="shrink-0">
      Upcoming
    </Badge>
  );
}

/* ---------------------------------------------------------------- */
/*  Streak badge (GSAP pop-in + count-up)                            */
/* ---------------------------------------------------------------- */

function StreakBadge({ streak }: { streak: number }) {
  const clusterRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const obj = { val: 0 };
      const tl = gsap.timeline();

      tl.from(clusterRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
      }).to(
        obj,
        {
          val: streak,
          duration: 0.7,
          ease: "power2.out",
          onUpdate: () => {
            if (numberRef.current)
              numberRef.current.textContent = Math.round(obj.val).toString();
          },
        },
        "-=0.1"
      );
    },
    { dependencies: [streak] }
  );

  return (
    <div
      ref={clusterRef}
      className="relative inline-flex items-center justify-center size-9 rounded-full bg-orange-50 dark:bg-orange-950/40"
    >
      <Image
        src="/gif/fire.gif"
        alt=""
        width={24}
        height={24}
        unoptimized
        className="size-6 object-contain pointer-events-none mix-blend-multiply dark:mix-blend-screen"
      />
      <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
        <span ref={numberRef}>0</span>
      </div>
    </div>
  );
}

function WelcomeBanner({
  firstName,
  streak,
}: {
  firstName: string;
  streak: number;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <h1 className="text-2xl font-bold tracking-tight">
        Good morning, <span className="text-primary">{firstName}</span>
      </h1>
      <StreakBadge streak={streak} />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Activity icon per type                                           */
/* ---------------------------------------------------------------- */

function ActivityIcon({ type }: { type: string }) {
  const cls = "text-muted-foreground";
  if (type === "badge")
    return <HugeiconsIcon icon={Award01Icon} size={18} className={cls} />;
  if (type === "class")
    return <HugeiconsIcon icon={Calendar01Icon} size={18} className={cls} />;
  return (
    <HugeiconsIcon icon={Notification03Icon} size={18} className={cls} />
  );
}

/* ---------------------------------------------------------------- */
/*  Student Dashboard                                                */
/* ---------------------------------------------------------------- */

function StudentDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activityFilter, setActivityFilter] = useState<string>("all");

  useGSAP(
    () => {
      gsap.from(".dash-widget", {
        opacity: 0,
        y: 16,
        duration: 0.35,
        stagger: 0.06,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-6 min-w-0">
      {/* ---- 1. Due Soon ---- */}
      <div className="dash-widget">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <HugeiconsIcon
              icon={Clock01Icon}
              size={18}
              className="text-muted-foreground"
            />
            <h2 className="text-sm font-semibold">Due Soon</h2>
          </div>

          {dueSoon.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing due right now nice work staying ahead.
            </p>
          ) : (
            <div className="flex flex-col gap-0.5 -mx-2">
              {dueSoon.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted transition-colors"
                >
                  <div className="min-w-0 mr-3">
                    <p className="text-sm font-medium truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.course}
                    </p>
                  </div>
                  {urgencyBadge(item.dueInHours)}
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ---- 2. Welcome + Streak ---- */}
      <div className="dash-widget">
        <WelcomeBanner firstName="Chioma" streak={5} />
      </div>

      {/* ---- 3. Continue Learning ---- */}
      <div className="dash-widget -mt-4 min-w-0">
        <h2 className="text-sm font-semibold mb-4">Continue Learning</h2>
        <ScrollArea className="w-full min-w-0 whitespace-nowrap -mx-4 [&>[data-slot=scroll-area-viewport]]:scrollbar-hide">
          <div className="flex gap-4 pb-2 px-4">
            {continueLearning.map((c) => (
              <Card key={c.id} className="w-64 shrink-0 p-4">
                <div className="h-24 rounded-lg bg-muted mb-3 flex items-center justify-center overflow-hidden">
                  <span className="text-xs text-muted-foreground">
                    {c.title.slice(0, 3).toUpperCase()}
                  </span>
                </div>
                <p className="font-medium text-sm truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground mb-3">
                  {c.instructor}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Progress value={c.progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {c.progress}%
                  </span>
                </div>
                <Button size="sm" className="w-full rounded-full">
                  <HugeiconsIcon icon={PlayIcon} size={14} className="mr-1.5" />
                  Resume
                </Button>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* ---- 5. Recent Activity ---- */}
      <div className="dash-widget">
        <div className="flex items-center justify-between mb-4 gap-2">
          <h2 className="text-sm font-semibold shrink-0">Recent Activity</h2>
          <div className="overflow-x-auto -mx-1 px-1">
            <div className="flex items-center gap-1 w-max">
              {studentActivityTypes.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivityFilter(key)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                    activityFilter === key
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Card className="p-4">
          <div className="flex flex-col gap-0.5">
            {recentActivity
              .filter((a) => activityFilter === "all" || a.type === activityFilter)
              .map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                >
                  <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <ActivityIcon type={a.type} />
                  </div>
                  <p className="text-sm flex-1 min-w-0 truncate">{a.text}</p>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {a.time}
                  </span>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

const liveClasses = {
  upcoming: [
    { id:"lc1", title:"Live Code Review", community:"Frontend Devs", date:"Apr 15, 2025", time:"6:00 PM WAT", link:"https://meet.google.com/abc-defg-hij", countdown:"Today" },
    { id:"lc2", title:"Q&A: State Management", community:"Frontend Devs", date:"Apr 18, 2025", time:"4:00 PM WAT", link:"https://meet.google.com/xyz-uvwx-yz1", countdown:"3 days" },
  ],
  past: [
    { id:"lc3", title:"Intro to React Workshop", community:"Frontend Devs", date:"Apr 5, 2025", recording:true, attendees:28, avgDuration:"52 min" },
    { id:"lc4", title:"Portfolio Review Session", community:"UI/UX Critique Circle", date:"Mar 28, 2025", recording:false, attendees:18, avgDuration:"64 min" },
  ],
};

/* ---------------------------------------------------------------- */
/*  Instructor Dashboard                                             */
/* ---------------------------------------------------------------- */

const actionQueue = [
  {
    id: 1,
    type: "Grading",
    label: "3 submissions awaiting grade — Frontend with React",
    href: "/dashboard/courses/react/submissions",
  },
  {
    id: 2,
    type: "Join Request",
    label: "2 pending join requests — Design Academy",
    href: "/dashboard/communities/design-academy/members",
  },
  {
    id: 3,
    type: "Review",
    label: "1 unanswered review on UI/UX Fundamentals",
    href: "/dashboard/courses/uiux/reviews",
  },
];

const instructorRevenue = { total: 842000, thisMonth: 156000, available: 63000 };

const enrollmentDataWeekly = [
  { period: "Week 1", enrollments: 12 },
  { period: "Week 2", enrollments: 19 },
  { period: "Week 3", enrollments: 15 },
  { period: "Week 4", enrollments: 27 },
];

const enrollmentDataDaily = [
  { period: "Mon", enrollments: 3 },
  { period: "Tue", enrollments: 5 },
  { period: "Wed", enrollments: 2 },
  { period: "Thu", enrollments: 6 },
  { period: "Fri", enrollments: 4 },
  { period: "Sat", enrollments: 1 },
  { period: "Sun", enrollments: 2 },
];

const chartConfig = {
  enrollments: { label: "Enrollments", color: "var(--chart-1)" },
} satisfies ChartConfig;

const naira = (n: number) => `₦${n.toLocaleString()}`;

const instructorActivity = [
  {
    id: 1,
    type: "enrollment",
    text: "Amina Yusuf enrolled in Frontend with React",
    time: "10m ago",
  },
  {
    id: 2,
    type: "submission",
    text: "David Okafor submitted Module 2 assignment",
    time: "1h ago",
  },
  {
    id: 3,
    type: "payment",
    text: "Payout of ₦45,000 processed",
    time: "3h ago",
  },
  {
    id: 4,
    type: "review",
    text: "New 5-star review on UI/UX Fundamentals",
    time: "Yesterday",
  },
  {
    id: 5,
    type: "enrollment",
    text: "Tunde Bakare enrolled in Design Academy",
    time: "Yesterday",
  },
  {
    id: 6,
    type: "submission",
    text: "Ngozi Eze submitted final project",
    time: "2d ago",
  },
  {
    id: 7,
    type: "payment",
    text: "Withdrawal of ₦20,000 confirmed",
    time: "3d ago",
  },
  {
    id: 8,
    type: "review",
    text: "New review on Frontend with React",
    time: "4d ago",
  },
  {
    id: 9,
    type: "enrollment",
    text: "Chidinma Obi enrolled in Data Analysis",
    time: "5d ago",
  },
  {
    id: 10,
    type: "submission",
    text: "Emeka Nwosu submitted Module 3 quiz",
    time: "6d ago",
  },
];

function typeColor(type: string) {
  if (type === "Grading")
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  if (type === "Join Request")
    return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
}

function StatNumber({
  target,
  format,
}: {
  target: number;
  format: (n: number) => string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          if (ref.current)
            ref.current.textContent = format(Math.round(obj.val));
        },
      });
    },
    { dependencies: [target] }
  );
  return (
    <p ref={ref} className="text-2xl font-bold tabular-nums">
      {format(0)}
    </p>
  );
}

function ActivityItem({
  type,
  text,
  time,
}: {
  type: string;
  text: string;
  time: string;
}) {
  const icon =
    type === "payment" ? (
      <HugeiconsIcon icon={Dollar01Icon} size={18} className="text-muted-foreground" />
    ) : type === "review" ? (
      <HugeiconsIcon icon={Message02Icon} size={18} className="text-muted-foreground" />
    ) : type === "submission" ? (
      <HugeiconsIcon icon={Award01Icon} size={18} className="text-muted-foreground" />
    ) : (
      <HugeiconsIcon icon={UserCheck01Icon} size={18} className="text-muted-foreground" />
    );

  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
      <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <p className="text-sm flex-1 min-w-0 truncate">{text}</p>
      <span className="text-xs text-muted-foreground shrink-0">{time}</span>
    </div>
  );
}

const activityTypes = [
  { key: "all", label: "All" },
  { key: "enrollment", label: "Enrollment" },
  { key: "submission", label: "Submission" },
  { key: "payment", label: "Payment" },
  { key: "review", label: "Review" },
];

function InstructorDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<"daily" | "weekly">("weekly");
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const data = range === "weekly" ? enrollmentDataWeekly : enrollmentDataDaily;

  useGSAP(
    () => {
      gsap.from(".dash-widget", {
        opacity: 0,
        y: 16,
        duration: 0.35,
        stagger: 0.06,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-6 min-w-0">
      {/* ---- 0. Quick Actions ---- */}
      <div className="dash-widget flex flex-col sm:flex-row gap-2">
        <Button variant="outline" className="w-full sm:w-auto rounded-full" render={<Link href="/dashboard/communities/create"><HugeiconsIcon icon={Add01Icon} size={16} className="mr-1.5" />Create Community</Link>} />
        <Button className="w-full sm:w-auto rounded-full" render={<Link href="/dashboard/courses/create"><HugeiconsIcon icon={CourseIcon} size={16} className="mr-1.5" />Create Course</Link>} />
      </div>

      {/* ---- 0.5 Live Classes ---- */}
      <div className="dash-widget">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <HugeiconsIcon icon={Calendar01Icon} size={18} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold">Live Classes</h2>
          </div>

          {/* Upcoming */}
          {liveClasses.upcoming.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {liveClasses.upcoming.map((lc) => (
                <div key={lc.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border p-4 bg-primary/5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{lc.title}</p>
                    <p className="text-xs text-muted-foreground">{lc.community} · {lc.date} · {lc.time}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="rounded-full text-[10px]">{lc.countdown}</Badge>
                    <Button size="sm" className="rounded-full" render={<a href={lc.link} target="_blank" rel="noopener noreferrer"><HugeiconsIcon icon={PlayIcon} size={13} className="mr-1" />Join as Host</a>} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Past */}
          {liveClasses.past.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Recent</p>
              {liveClasses.past.map((lc) => (
                <div key={lc.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{lc.title}</p>
                    <p className="text-xs text-muted-foreground">{lc.community} · {lc.date} · {lc.attendees} attended · {lc.avgDuration} avg</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {lc.recording ? (
                      <Badge className="rounded-full text-[10px] px-2 py-0 h-5 bg-emerald-100 text-emerald-700">Recording ready</Badge>
                    ) : (
                      <Button size="sm" variant="outline" className="rounded-full text-xs h-8">Upload Recording</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ---- 1. Action Queue ---- */}
      <div className="dash-widget">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <HugeiconsIcon
              icon={Clock01Icon}
              size={18}
              className="text-muted-foreground"
            />
            <h2 className="text-sm font-semibold">Action Queue</h2>
          </div>
          {actionQueue.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          ) : (
            <div className="flex flex-col gap-0.5 -mx-2">
              {actionQueue.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg px-3 py-2.5 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Badge className={`shrink-0 ${typeColor(item.type)}`}>
                      {item.type}
                    </Badge>
                    <p className="text-sm">{item.label}</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full sm:w-auto shrink-0 rounded-full" render={<Link href={item.href}>Review</Link>} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ---- 2. Revenue Summary ---- */}
      <div className="dash-widget grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
          <StatNumber target={instructorRevenue.total} format={naira} />
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">This Month</p>
          <StatNumber target={instructorRevenue.thisMonth} format={naira} />
        </Card>
        <Card className="p-5 border-primary cursor-pointer hover:bg-primary/5 transition-colors">
          <p className="text-xs text-muted-foreground mb-1">
            Available for Withdrawal
          </p>
          <StatNumber target={instructorRevenue.available} format={naira} />
        </Card>
      </div>

      {/* ---- 3. Enrollment Trend + 4. Active Students ---- */}
      <div className="dash-widget grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 overflow-hidden p-0">
          {/* Padded zone */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-sm font-semibold">Enrollment Trend</h2>
            <Tabs
              value={range}
              onValueChange={(v) => setRange(v as "daily" | "weekly")}
            >
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {/* Unpadded zone — chart bleeds to edges */}
          <ChartContainer config={chartConfig} className="h-[200px] w-full min-w-0">
            <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="enrollments"
                type="monotone"
                fill="var(--color-enrollments)"
                fillOpacity={0.2}
                stroke="var(--color-enrollments)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="size-9 rounded-lg bg-muted flex items-center justify-center mb-3">
              <HugeiconsIcon
                icon={UserCheck01Icon}
                size={18}
                className="text-muted-foreground"
              />
            </div>
            <p className="text-xs text-muted-foreground mb-1">
              Active Students
            </p>
            <p className="text-2xl font-bold tabular-nums">48</p>
            <p className="text-xs text-muted-foreground mt-1">
              accessed a course in the last 7 days
            </p>
          </div>
        </Card>
      </div>

      {/* ---- 5. Recent Activity ---- */}
      <div className="dash-widget">
        <div className="flex items-center justify-between mb-4 gap-2">
          <h2 className="text-sm font-semibold shrink-0">Recent Activity</h2>
          <div className="overflow-x-auto -mx-1 px-1">
            <div className="flex items-center gap-1 w-max">
              {activityTypes.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivityFilter(key)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                    activityFilter === key
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Card className="p-4">
          <div className="flex flex-col gap-0.5">
            {instructorActivity
              .filter((a) => activityFilter === "all" || a.type === activityFilter)
              .map((a) => (
                <ActivityItem
                  key={a.id}
                  type={a.type}
                  text={a.text}
                  time={a.time}
                />
              ))}
          </div>
        </Card>
      </div>


    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Placeholder for other roles                                      */
/* ---------------------------------------------------------------- */

function AdminDashboard() {
  const stats = [
    { label:"Total Users", value:"1,847", change:"+12%" },
    { label:"Total Communities", value:"34", change:"+3" },
    { label:"Total Courses", value:"128", change:"+8" },
    { label:"Revenue (All Time)", value:"₦2.4M", change:"+18%" },
    { label:"Revenue This Month", value:"₦48K", change:"+22%" },
    { label:"Active Users (7d)", value:"432", change:"+5%" },
  ];

  const recentSignups = [
    { name:"Kelechi Okonkwo", role:"student", time:"10 min ago" },
    { name:"Amara Obi", role:"instructor", time:"1 hour ago" },
    { name:"Tunde Balogun", role:"student", time:"3 hours ago" },
  ];

  const recentPayments = [
    { user:"Chioma Eze", amount:"₦10,000", course:"Python for Data Science", time:"2 hours ago" },
    { user:"Ngozi Adeyemi", amount:"₦10,000", course:"Python (Kunle)", time:"5 hours ago" },
    { user:"Emeka Nwosu", amount:"₦5,000", course:"Backend 101", time:"1 day ago" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Welcome back, Admin</h1><p className="text-muted-foreground mt-1">Platform-wide metrics and activity.</p></div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-4 flex flex-col justify-between">
            <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight">{s.label}</p>
            <div>
              <p className="text-lg sm:text-xl font-bold tabular-nums mt-1">{s.value}</p>
              <p className="text-[9px] text-emerald-600 font-medium">{s.change}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent signups */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">Recent Signups</h3><Link href="/dashboard/users?role=admin" className="text-xs text-primary hover:underline">View all</Link></div>
          <div className="flex flex-col gap-3">
            {recentSignups.map((s,i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5"><div className="size-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold">{s.name.charAt(0)}</div><div><p className="text-sm font-medium">{s.name}</p><p className="text-[10px] text-muted-foreground">{s.role}</p></div></div>
                <span className="text-[10px] text-muted-foreground">{s.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent payments */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold">Recent Payments</h3><Link href="/dashboard/admin/payments?role=admin" className="text-xs text-primary hover:underline">View all</Link></div>
          <div className="flex flex-col gap-3">
            {recentPayments.map((p,i) => (
              <div key={i} className="flex items-center justify-between">
                <div><p className="text-sm font-medium">{p.user}</p><p className="text-[10px] text-muted-foreground">{p.course}</p></div>
                <div className="text-right"><p className="text-sm font-bold tabular-nums">{p.amount}</p><p className="text-[10px] text-muted-foreground">{p.time}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-2">
        {[
          { label:"Manage Users", href:"/dashboard/users?role=admin" },
          { label:"All Payments", href:"/dashboard/admin/payments?role=admin" },
          { label:"Withdrawals", href:"/dashboard/withdrawals?role=admin" },
          { label:"Activity Logs", href:"/dashboard/logs?role=admin" },
        ].map((q) => (
          <Link key={q.label} href={q.href}>
            <Button variant="outline" size="sm" className="rounded-full text-xs">{q.label} →</Button>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PlaceholderDashboard({ role }: { role: Role }) {
  const name =
    role === "instructor"
      ? "Ade"
      : role === "parent"
      ? "Ngozi"
      : role === "admin"
      ? "Admin"
      : "Chioma";
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {name}
        </h1>
        <p className="text-muted-foreground mt-1">
          {role === "instructor"
            ? "Here is your academy overview for today."
            : role === "parent"
            ? "Here is how your children are progressing."
            : role === "admin"
            ? "Platform-wide metrics and activity."
            : "Continue learning where you left off."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 h-32 flex items-end"
          >
            <span className="text-sm text-muted-foreground">Card {i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Router                                                           */
/* ---------------------------------------------------------------- */

function DashboardContent() {
  const searchParams = useSearchParams();
  const role = getDashboardRole(searchParams.get("role"));

  return (
    <DashboardLayout role={role}>
      {role === "instructor" ? (
        <InstructorDashboard />
      ) : role === "student" ? (
        <StudentDashboard />
      ) : role === "parent" ? (
        <ParentDashboard />
      ) : role === "admin" ? (
        <AdminDashboard />
      ) : (
        <PlaceholderDashboard role={role} />
      )}
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
