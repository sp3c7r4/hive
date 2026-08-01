"use client";

import { useGSAP } from "@gsap/react";
import {
  Award01Icon,
  Calendar01Icon,
  CourseIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import Link from "next/link";
import { useRef } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";

/* ---------------------------------------------------------------- */
/*  Demo data                                                       */
/* ---------------------------------------------------------------- */

const flags = [
  {
    id: 1,
    child: "Chidi Eze",
    initials: "CE",
    message: "Quiz scores trending down over the last 3 attempts",
    trend: [{ v: 88 }, { v: 79 }, { v: 71 }, { v: 65 }],
    href: "/dashboard/children/chidi",
  },
  {
    id: 2,
    child: "Amara Eze",
    initials: "AE",
    message: "Hasn't logged in for 10 days",
    trend: null,
    href: "/dashboard/children/amara",
  },
];

const linkedStudents = [
  {
    id: 1,
    name: "Chidi Eze",
    initials: "CE",
    activeCourses: 3,
    streak: 2,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Amara Eze",
    initials: "AE",
    activeCourses: 1,
    streak: 0,
    lastActive: "10 days ago",
  },
];

const attendanceData = [
  { child: "Chidi", attendance: 92 },
  { child: "Amara", attendance: 45 },
];
const classAvgAttendance = 78;

const performanceData = [
  { child: "Chidi", score: 78 },
  { child: "Amara", score: 65 },
];
const classAvgScore = 72;

const courseProgress = [
  {
    id: 1,
    child: "Chidi Eze",
    initials: "CE",
    course: "Frontend with React",
    progress: 62,
    href: "/dashboard/children/chidi",
  },
  {
    id: 2,
    child: "Chidi Eze",
    initials: "CE",
    course: "Data Analysis with Excel",
    progress: 88,
    href: "/dashboard/children/chidi",
  },
  {
    id: 3,
    child: "Amara Eze",
    initials: "AE",
    course: "UI/UX Fundamentals",
    progress: 15,
    href: "/dashboard/children/amara",
  },
];

const quickStats = { totalCourses: 4, completed: 1, inProgress: 3 };

const pendingRequests: {
  id: number;
  name: string;
  sentDate: string;
}[] = [];

/* ---------------------------------------------------------------- */
/*  Chart configs                                                   */
/* ---------------------------------------------------------------- */

const attendanceConfig = {
  attendance: { label: "Attendance %", color: "var(--chart-1)" },
} satisfies ChartConfig;

const performanceConfig = {
  score: { label: "Score %", color: "var(--chart-2)" },
} satisfies ChartConfig;

const barColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

/* ---------------------------------------------------------------- */
/*  Flag card                                                       */
/* ---------------------------------------------------------------- */

function FlagCard({ flag }: { flag: (typeof flags)[number] }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border p-3">
      <div className="flex items-start gap-3 min-w-0">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback>{flag.initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-medium">{flag.child}</p>
          <p className="text-xs text-muted-foreground">{flag.message}</p>
          {flag.trend && (
            <LineChart
              width={60}
              height={24}
              data={flag.trend}
              className="mt-1"
            >
              <Line
                type="monotone"
                dataKey="v"
                stroke="var(--destructive)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="w-full sm:w-auto shrink-0 rounded-full"
        render={<Link href={flag.href}>View</Link>}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Flags widget                                                    */
/* ---------------------------------------------------------------- */

function Flags() {
  if (flags.length === 0) return null;
  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold mb-3">Flags</h2>
      <div className="flex flex-col gap-2">
        {flags.map((f) => (
          <FlagCard key={f.id} flag={f} />
        ))}
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/*  Course progress per child                                       */
/* ---------------------------------------------------------------- */

function CourseProgress() {
  /* Group by child */
  const grouped = courseProgress.reduce<
    Record<string, (typeof courseProgress)[number][]>
  >((acc, c) => {
    if (!acc[c.child]) acc[c.child] = [];
    acc[c.child].push(c);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Object.entries(grouped).map(([child, courses]) => (
        <Card key={child} className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="size-9 shrink-0">
              <AvatarFallback>{courses[0].initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{child}</p>
              <p className="text-xs text-muted-foreground">
                {courses.length} course{courses.length !== 1 && "s"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {courses.map((c) => (
              <div key={c.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium truncate max-w-[70%]">
                    {c.course}
                  </p>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {c.progress}%
                  </span>
                </div>
                <Progress value={c.progress} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Parent Dashboard                                                 */
/* ---------------------------------------------------------------- */

export function ParentDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".dash-widget", {
        opacity: 0,
        y: 16,
        duration: 0.35,
        stagger: 0.08,
        ease: "power2.out",
      });
    },
    { scope: containerRef },
  );

  /* ---- Empty state: no linked students ---- */
  if (linkedStudents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-2">
          <span className="text-2xl">👤</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">
          Link your first student to start monitoring their progress
        </p>
        <Button
          className="rounded-full"
          render={<Link href="/dashboard/children/link">Link a Student</Link>}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-6 min-w-0">
      {/* ---- 1. Flags ---- */}
      <div className="dash-widget">
        <Flags />
      </div>

      {/* ---- 2. Attendance & Performance charts ---- */}
      <div className="dash-widget grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attendance */}
        <Card className="overflow-hidden p-0">
          <div className="px-5 pt-5 pb-1">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  size={16}
                  className="text-muted-foreground"
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Attendance</h2>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </div>
            </div>
          </div>
          <ChartContainer
            config={attendanceConfig}
            className="h-[180px] w-full min-w-0"
          >
            <BarChart
              data={attendanceData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              barSize={48}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="child"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
              />
              <YAxis hide domain={[0, 100]} />
              <ReferenceLine
                y={classAvgAttendance}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{
                  value: `Avg ${classAvgAttendance}%`,
                  position: "right",
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="attendance" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="attendance"
                  position="top"
                  formatter={(v) => `${v}%`}
                  fontSize={11}
                  fill="var(--foreground)"
                />
                {attendanceData.map((_, i) => (
                  <Cell key={i} fill={barColors[i % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </Card>

        {/* Performance */}
        <Card className="overflow-hidden p-0">
          <div className="px-5 pt-5 pb-1">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <HugeiconsIcon
                  icon={Award01Icon}
                  size={16}
                  className="text-muted-foreground"
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Performance</h2>
                <p className="text-xs text-muted-foreground">
                  Average quiz &amp; assignment scores
                </p>
              </div>
            </div>
          </div>
          <ChartContainer
            config={performanceConfig}
            className="h-[180px] w-full min-w-0"
          >
            <BarChart
              data={performanceData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              barSize={48}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="child"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
              />
              <YAxis hide domain={[0, 100]} />
              <ReferenceLine
                y={classAvgScore}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{
                  value: `Avg ${classAvgScore}%`,
                  position: "right",
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="score"
                  position="top"
                  formatter={(v) => `${v}%`}
                  fontSize={11}
                  fill="var(--foreground)"
                />
                {performanceData.map((_, i) => (
                  <Cell key={i} fill={barColors[i % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </Card>
      </div>

      {/* ---- 3. Course Progress ---- */}
      <div className="dash-widget">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <HugeiconsIcon
              icon={CourseIcon}
              size={16}
              className="text-muted-foreground"
            />
          </div>
          <h2 className="text-sm font-semibold">Course Progress</h2>
        </div>
        <CourseProgress />
      </div>

      {/* ---- 4. Quick Stats ---- */}
      <div className="dash-widget grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Courses</p>
          <p className="text-xl font-bold tabular-nums">
            {quickStats.totalCourses}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">Completed</p>
          <p className="text-xl font-bold tabular-nums">
            {quickStats.completed}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-1">In Progress</p>
          <p className="text-xl font-bold tabular-nums">
            {quickStats.inProgress}
          </p>
        </Card>
      </div>

      {/* ---- 5. Pending Link Requests ---- */}
      {pendingRequests.length > 0 && (
        <div className="dash-widget">
          <Card className="p-5">
            <h2 className="text-sm font-semibold mb-3">
              Pending Link Requests
            </h2>
            <div className="flex flex-col gap-2">
              {pendingRequests.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Sent {r.sentDate}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="shrink-0 w-fit rounded-full"
                  >
                    Awaiting approval
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
