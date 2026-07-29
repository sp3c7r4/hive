"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  BookOpen01Icon,
  Clock01Icon,
  Calendar01Icon,
  HourglassIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";

type Role = "instructor" | "student" | "parent" | "admin";

/* ---- demo data ---- */

interface Child {
  id: string;
  name: string;
  initials: string;
  email: string;
  relationship: string;
  status: "linked" | "pending" | "rejected";
  activeCourses: number;
  completedCourses: number;
  currentStreak: number;
  lastActive: string;
  linkedDate?: string;
}

const CHILDREN: Child[] = [
  {
    id: "ch-1",
    name: "Temi Adebayo",
    initials: "TA",
    email: "temi.adebayo@email.com",
    relationship: "Child",
    status: "linked",
    activeCourses: 3,
    completedCourses: 2,
    currentStreak: 12,
    lastActive: "2 hours ago",
    linkedDate: "10 Nov 2024",
  },
  {
    id: "ch-2",
    name: "Kunle Adebayo",
    initials: "KA",
    email: "kunle.adebayo@email.com",
    relationship: "Child",
    status: "linked",
    activeCourses: 1,
    completedCourses: 0,
    currentStreak: 4,
    lastActive: "Yesterday",
    linkedDate: "18 Mar 2025",
  },
  {
    id: "ch-3",
    name: "Tunde Balogun",
    initials: "TB",
    email: "tunde.balogun@email.com",
    relationship: "Ward",
    status: "rejected",
    activeCourses: 0,
    completedCourses: 0,
    currentStreak: 0,
    lastActive: "—",
  },
];

function MyChildrenPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const role = (sp.get("role") as Role) || "parent";

  const [children, setChildren] = useState<Child[]>(CHILDREN);
  const [linkEmail, setLinkEmail] = useState("");
  const [linkRelationship, setLinkRelationship] = useState("Child");

  const linked = children.filter((c) => c.status === "linked");
  const pending = children.filter((c) => c.status === "pending");
  const rejected = children.filter((c) => c.status === "rejected");

  const handleSendRequest = useCallback(() => {
    if (!linkEmail.trim()) return;
    const newChild: Child = {
      id: `ch-${Date.now()}`,
      name: linkEmail.split("@")[0].replace(/[._]/g, " "),
      initials: linkEmail
        .split("@")[0]
        .slice(0, 2)
        .toUpperCase(),
      email: linkEmail.trim(),
      relationship: linkRelationship,
      status: "pending",
      activeCourses: 0,
      completedCourses: 0,
      currentStreak: 0,
      lastActive: "—",
    };
    setChildren((prev) => [newChild, ...prev]);
    setLinkEmail("");
  }, [linkEmail, linkRelationship]);

  const handleApprove = useCallback(
    (id: string) =>
      setChildren((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "linked" as const, linkedDate: new Date().toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) } : c
        )
      ),
    []
  );

  const handleReject = useCallback(
    (id: string) =>
      setChildren((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "rejected" as const } : c
        )
      ),
    []
  );

  const handleRevoke = useCallback(
    (id: string) => setChildren((prev) => prev.filter((c) => c.id !== id)),
    []
  );

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 max-w-4xl min-w-0">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">My Children</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor progress, grades, and activity for linked students.
          </p>
        </div>

        {/* Link new student */}
        <Card className="p-4 sm:p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Link a Student
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Enter the student&apos;s email to send a link request. They&apos;ll
            need to approve it before you can see their progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col gap-1.5">
              <Label className="text-xs">Student email</Label>
              <Input
                value={linkEmail}
                onChange={(e) => setLinkEmail(e.target.value)}
                placeholder="student@email.com"
                className="text-sm"
              />
            </div>
            <div className="w-full sm:w-[160px] flex flex-col gap-1.5">
              <Label className="text-xs">Relationship</Label>
              <Select value={linkRelationship} onValueChange={setLinkRelationship}>
                <SelectTrigger className="rounded-xl h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Ward">Ward</SelectItem>
                  <SelectItem value="Guardian">Guardian</SelectItem>
                  <SelectItem value="Sponsor">Sponsor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                className="rounded-full w-full sm:w-auto"
                disabled={!linkEmail.trim()}
                onClick={handleSendRequest}
              >
                <HugeiconsIcon icon={SentIcon} size={14} className="mr-1.5" />
                Send Request
              </Button>
            </div>
          </div>
        </Card>

        {/* Linked students */}
        {linked.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Linked ({linked.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {linked.map((child) => (
                <Card
                  key={child.id}
                  className="p-4 sm:p-5 hover:bg-muted/20 transition-colors cursor-pointer group"
                  onClick={() =>
                    router.push(
                      `/dashboard/children/${child.id}?role=${role}`
                    )
                  }
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10 shrink-0">
                      <AvatarFallback className="text-xs">
                        {child.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold group-hover:text-primary transition-colors">
                          {child.name}
                        </h4>
                        <Badge className="rounded-full text-[9px] px-1.5 py-0 h-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {child.relationship}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {child.email}
                      </p>

                      <div className="flex items-center gap-3 mt-2.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={BookOpen01Icon} size={11} />
                          {child.activeCourses} active
                        </span>
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={Calendar01Icon} size={11} />
                          {child.completedCourses} completed
                        </span>
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={Clock01Icon} size={11} />
                          {child.lastActive}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full h-7 text-[10px] text-destructive shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRevoke(child.id);
                      }}
                    >
                      Revoke
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Pending Requests ({pending.length})
            </h3>
            <div className="flex flex-col gap-2">
              {pending.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback className="text-[11px]">
                        {child.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {child.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {child.relationship} · {child.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge className="rounded-full text-[9px] px-1.5 py-0 h-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      <HugeiconsIcon icon={HourglassIcon} size={9} className="mr-1" />
                      Awaiting approval
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full h-7 text-[10px] text-muted-foreground"
                      onClick={() => handleReject(child.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected */}
        {rejected.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Rejected ({rejected.length})
            </h3>
            <div className="flex flex-col gap-2 opacity-50">
              {rejected.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback className="text-[11px]">
                        {child.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {child.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {child.relationship} · {child.email}
                      </p>
                    </div>
                  </div>
                  <Badge className="rounded-full text-[9px] px-1.5 py-0 h-4 bg-muted-foreground/10 text-muted-foreground shrink-0">
                    Rejected
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state (when no children at all) */}
        {children.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-14 sm:size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <HugeiconsIcon
                icon={UserGroupIcon}
                size={24}
                className="sm:size-[28px] text-muted-foreground"
              />
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-1">
              No children linked yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Send a link request above to start monitoring a student&apos;s
              progress. They&apos;ll need to approve the request from their
              account.
            </p>
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
          <Skeleton className="h-8 w-40 mb-4" />
          <Skeleton className="h-4 w-56 mb-6" />
          <Skeleton className="h-32 rounded-xl mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-[120px] rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <MyChildrenPage />
    </Suspense>
  );
}
