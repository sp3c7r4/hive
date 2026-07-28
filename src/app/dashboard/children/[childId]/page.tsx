"use client";

import { Suspense, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  BookOpen01Icon,
  Clock01Icon,
  Calendar01Icon,
  Award01Icon,
  StarIcon,
  PlayIcon,
  File01Icon,
  LiveStreaming01Icon,
  CircleQuestionMarkIcon,
  AssignmentsIcon,
  FireIcon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type Role = "instructor" | "student" | "parent" | "admin";

/* ---- demo student data ---- */

const STUDENT_PROFILES: Record<
  string,
  {
    id: string;
    name: string;
    initials: string;
    email: string;
    relationship: string;
    status: "linked" | "pending";
    currentStreak: number;
    longestStreak: number;
    activeDays: number;
    enrolledCourses: {
      id: string;
      title: string;
      instructor: string;
      progress: number;
      modulesCompleted: number;
      modulesTotal: number;
      lessonsCompleted: number;
      lessonsTotal: number;
      quizScores: { title: string; score: string; date: string }[];
      assignmentGrades: { title: string; grade: string; max: string; date: string }[];
      liveAttendance: { title: string; attended: string; date: string }[];
    }[];
    recentActivity: {
      type: "lesson" | "quiz" | "assignment" | "live";
      icon: typeof PlayIcon;
      title: string;
      course: string;
      detail: string;
      time: string;
    }[];
    avgQuizScore: string;
    avgAssignmentGrade: string;
  }
> = {
  "ch-1": {
    id: "ch-1",
    name: "Temi Adebayo",
    initials: "TA",
    email: "temi.adebayo@email.com",
    relationship: "Child",
    status: "linked",
    currentStreak: 12,
    longestStreak: 34,
    activeDays: 187,
    enrolledCourses: [
      {
        id: "c1",
        title: "React for Designers",
        instructor: "Ade Okafor",
        progress: 78,
        modulesCompleted: 3,
        modulesTotal: 4,
        lessonsCompleted: 12,
        lessonsTotal: 16,
        quizScores: [
          { title: "React Fundamentals Quiz", score: "8/10", date: "12 Mar 2025" },
          { title: "Components & Props Quiz", score: "9/10", date: "18 Mar 2025" },
        ],
        assignmentGrades: [
          { title: "Design Portfolio", grade: "85", max: "100", date: "15 Mar 2025" },
        ],
        liveAttendance: [
          { title: "Live Code Review", attended: "52 min (87%)", date: "20 Mar 2025" },
        ],
      },
      {
        id: "c2",
        title: "CSS Mastery: From Flexbox to Grid",
        instructor: "Ade Okafor",
        progress: 100,
        modulesCompleted: 5,
        modulesTotal: 5,
        lessonsCompleted: 22,
        lessonsTotal: 22,
        quizScores: [
          { title: "Flexbox Fundamentals", score: "10/10", date: "5 Feb 2025" },
          { title: "Grid Layout Mastery", score: "8/10", date: "12 Feb 2025" },
        ],
        assignmentGrades: [
          { title: "Dashboard Layout", grade: "92", max: "100", date: "8 Feb 2025" },
          { title: "Responsive Landing Page", grade: "88", max: "100", date: "15 Feb 2025" },
        ],
        liveAttendance: [],
      },
      {
        id: "c3",
        title: "Building Accessible UIs",
        instructor: "Ade Okafor",
        progress: 24,
        modulesCompleted: 1,
        modulesTotal: 4,
        lessonsCompleted: 3,
        lessonsTotal: 14,
        quizScores: [],
        assignmentGrades: [],
        liveAttendance: [],
      },
    ],
    recentActivity: [
      {
        type: "quiz",
        icon: CircleQuestionMarkIcon,
        title: "Components & Props Quiz",
        course: "React for Designers",
        detail: "Score: 9/10 (90%)",
        time: "2h ago",
      },
      {
        type: "live",
        icon: LiveStreaming01Icon,
        title: "Live Code Review",
        course: "React for Designers",
        detail: "Attended 52 min",
        time: "2d ago",
      },
      {
        type: "assignment",
        icon: AssignmentsIcon,
        title: "Design Portfolio",
        course: "React for Designers",
        detail: "Grade: 85/100",
        time: "5d ago",
      },
      {
        type: "lesson",
        icon: PlayIcon,
        title: "State & Events",
        course: "React for Designers",
        detail: "Completed",
        time: "6d ago",
      },
      {
        type: "lesson",
        icon: File01Icon,
        title: "How the Web Works",
        course: "React for Designers",
        detail: "Completed",
        time: "7d ago",
      },
    ],
    avgQuizScore: "85%",
    avgAssignmentGrade: "88/100",
  },
  "ch-2": {
    id: "ch-2",
    name: "Kunle Adebayo",
    initials: "KA",
    email: "kunle.adebayo@email.com",
    relationship: "Child",
    status: "linked",
    currentStreak: 4,
    longestStreak: 15,
    activeDays: 42,
    enrolledCourses: [
      {
        id: "c4",
        title: "Python for Data Science",
        instructor: "Nkechi Ezeh",
        progress: 35,
        modulesCompleted: 2,
        modulesTotal: 6,
        lessonsCompleted: 8,
        lessonsTotal: 24,
        quizScores: [
          { title: "Python Basics Quiz", score: "7/10", date: "20 Mar 2025" },
        ],
        assignmentGrades: [],
        liveAttendance: [],
      },
      {
        id: "c5",
        title: "React for Designers",
        instructor: "Ade Okafor",
        progress: 12,
        modulesCompleted: 1,
        modulesTotal: 4,
        lessonsCompleted: 2,
        lessonsTotal: 16,
        quizScores: [],
        assignmentGrades: [],
        liveAttendance: [],
      },
    ],
    recentActivity: [
      {
        type: "lesson",
        icon: PlayIcon,
        title: "Data Structures in Python",
        course: "Python for Data Science",
        detail: "Completed",
        time: "1d ago",
      },
      {
        type: "quiz",
        icon: CircleQuestionMarkIcon,
        title: "Python Basics Quiz",
        course: "Python for Data Science",
        detail: "Score: 7/10 (70%)",
        time: "2d ago",
      },
      {
        type: "lesson",
        icon: PlayIcon,
        title: "Welcome & Course Overview",
        course: "React for Designers",
        detail: "Completed",
        time: "3d ago",
      },
    ],
    avgQuizScore: "70%",
    avgAssignmentGrade: "—",
  },
};

const ACTIVITY_ICONS = {
  lesson: PlayIcon,
  quiz: CircleQuestionMarkIcon,
  assignment: AssignmentsIcon,
  live: LiveStreaming01Icon,
} as const;

function StudentDetailPage() {
  const params = useParams();
  const sp = useSearchParams();
  const router = useRouter();
  const role = (sp.get("role") as Role) || "parent";
  const childId = params.childId as string;

  const student = STUDENT_PROFILES[childId];
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  /* Not found / not linked */
  if (!student) {
    return (
      <DashboardLayout role={role}>
        <div className="flex flex-col gap-6 max-w-4xl min-w-0">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground w-fit"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
            Back to My Children
          </button>

          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-14 rounded-2xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center mb-4">
              <HugeiconsIcon icon={Clock01Icon} size={24} className="text-amber-500" />
            </div>
            <h3 className="text-lg font-bold mb-1">Waiting for student approval</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              This student hasn&apos;t approved your link request yet. Once they
              approve, you&apos;ll be able to see their progress, grades, and
              activity here.
            </p>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => router.back()}
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="mr-1.5" />
              Back to My Children
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 max-w-4xl min-w-0">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground w-fit"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
          Back to My Children
        </button>

        {/* Profile header */}
        <Card className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar className="size-14 sm:size-16 shrink-0">
              <AvatarFallback className="text-base sm:text-lg">
                {student.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold">{student.name}</h1>
                <Badge
                  className={cn(
                    "rounded-full text-[10px] px-2 py-0 h-5",
                    student.status === "linked"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}
                >
                  {student.status === "linked" ? "Linked" : "Pending"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {student.relationship} · {student.email}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                  <HugeiconsIcon icon={FireIcon} size={14} />
                  {student.currentStreak} day streak
                </span>
                <span className="text-muted-foreground">
                  Best: {student.longestStreak}
                </span>
                <span className="text-muted-foreground">
                  {student.activeDays} active days
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Scores + Streak bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { label: "Avg Quiz Score", value: student.avgQuizScore, icon: CircleQuestionMarkIcon, color: "text-amber-500" },
            { label: "Avg Assignment", value: student.avgAssignmentGrade, icon: AssignmentsIcon, color: "text-violet-500" },
            { label: "Courses Active", value: String(student.enrolledCourses.filter(c => c.progress < 100).length), icon: BookOpen01Icon, color: "text-emerald-500" },
            { label: "Completed", value: String(student.enrolledCourses.filter(c => c.progress === 100).length), icon: Award01Icon, color: "text-primary" },
          ] as const).map((s) => (
            <Card key={s.label} className="p-3 sm:p-4">
              <p className="text-[10px] sm:text-[11px] text-muted-foreground">{s.label}</p>
              <p className="text-lg sm:text-xl font-bold tabular-nums mt-0.5">{s.value}</p>
            </Card>
          ))}
        </div>

        {/* Enrolled Courses */}
        <div>
          <h2 className="text-sm font-semibold mb-3">
            Enrolled Courses ({student.enrolledCourses.length})
          </h2>
          <div className="flex flex-col gap-3">
            {student.enrolledCourses.map((course) => {
              const isExpanded = expandedCourse === course.id;
              return (
                <Card key={course.id} className="overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedCourse(isExpanded ? null : course.id)
                    }
                    className="w-full flex items-center justify-between px-4 sm:px-5 py-4 text-left hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <HugeiconsIcon
                          icon={BookOpen01Icon}
                          size={16}
                          className="text-muted-foreground"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {course.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {course.instructor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="w-20 relative h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              "absolute inset-y-0 left-0 rounded-full",
                              course.progress === 100
                                ? "bg-emerald-500"
                                : "bg-primary"
                            )}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground tabular-nums w-8 text-right">
                          {course.progress}%
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-xs transition-transform",
                          isExpanded && "rotate-180"
                        )}
                      >
                        ▼
                      </span>
                    </div>
                  </button>

                  {/* Expand: course detail */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-4 space-y-4 animate-in fade-in">
                      <Separator />

                      {/* Progress overview */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <p className="text-[10px] text-muted-foreground">
                            Progress
                          </p>
                          <p className="text-sm font-bold tabular-nums mt-0.5">
                            {course.progress}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">
                            Modules
                          </p>
                          <p className="text-sm font-bold tabular-nums mt-0.5">
                            {course.modulesCompleted}/{course.modulesTotal}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">
                            Lessons
                          </p>
                          <p className="text-sm font-bold tabular-nums mt-0.5">
                            {course.lessonsCompleted}/{course.lessonsTotal}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">
                            Status
                          </p>
                          <Badge
                            className={cn(
                              "rounded-full text-[10px] px-1.5 py-0 h-4 mt-0.5",
                              course.progress === 100
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-primary/10 text-primary"
                            )}
                          >
                            {course.progress === 100
                              ? "Completed"
                              : "In Progress"}
                          </Badge>
                        </div>
                      </div>

                      {/* Quiz scores */}
                      {course.quizScores.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Quiz Scores
                          </h4>
                          <div className="flex flex-col gap-1.5">
                            {course.quizScores.map((q, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between text-xs bg-muted/50 rounded-lg px-3 py-2"
                              >
                                <span>{q.title}</span>
                                <span className="font-semibold tabular-nums">
                                  {q.score}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Assignment grades */}
                      {course.assignmentGrades.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Assignments
                          </h4>
                          <div className="flex flex-col gap-1.5">
                            {course.assignmentGrades.map((a, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between text-xs bg-muted/50 rounded-lg px-3 py-2"
                              >
                                <span>{a.title}</span>
                                <span className="font-semibold tabular-nums">
                                  {a.grade}/{a.max}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Live attendance */}
                      {course.liveAttendance.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Live Attendance
                          </h4>
                          <div className="flex flex-col gap-1.5">
                            {course.liveAttendance.map((l, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between text-xs bg-muted/50 rounded-lg px-3 py-2"
                              >
                                <span>{l.title}</span>
                                <span className="font-semibold tabular-nums">
                                  {l.attended}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Empty state for no assessments yet */}
                      {course.quizScores.length === 0 &&
                        course.assignmentGrades.length === 0 &&
                        course.liveAttendance.length === 0 && (
                          <p className="text-xs text-muted-foreground py-2">
                            No assessments submitted yet.
                          </p>
                        )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Recent Activity</h2>
          <div className="flex flex-col gap-2">
            {student.recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border p-3 sm:p-4"
              >
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <HugeiconsIcon
                    icon={
                      ACTIVITY_ICONS[activity.type]
                    }
                    size={14}
                    className="text-muted-foreground"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {activity.course}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.detail}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                  {activity.time}
                </span>
              </div>
            ))}
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
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-24 rounded-xl mb-6" />
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-8 w-40 mb-3" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl mb-2" />
          ))}
        </div>
      }
    >
      <StudentDetailPage />
    </Suspense>
  );
}
