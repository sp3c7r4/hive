"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserCheck01Icon,
  Cancel01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

/* ---- types ---- */

interface LinkRequest {
  id: string;
  name: string;
  initials: string;
  email: string;
  relationship: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

type Role = "student" | "parent";

type AppRole = "instructor" | "student" | "parent" | "admin";

/* ---- demo data ---- */

const STUDENT_LINKED_PARENTS: LinkRequest[] = [
  {
    id: "lr-1",
    name: "Femi Adebayo",
    initials: "FA",
    email: "femi.adebayo@email.com",
    relationship: "Parent",
    status: "approved",
    createdAt: "2024-11-10T00:00:00Z",
  },
  {
    id: "lr-2",
    name: "Grace Adebayo",
    initials: "GA",
    email: "grace.adebayo@email.com",
    relationship: "Parent",
    status: "pending",
    createdAt: "2025-03-18T00:00:00Z",
  },
  {
    id: "lr-3",
    name: "David Okonkwo",
    initials: "DO",
    email: "david.okonkwo@email.com",
    relationship: "Sponsor",
    status: "rejected",
    createdAt: "2024-08-05T00:00:00Z",
  },
];

const PARENT_LINKED_STUDENTS: LinkRequest[] = [
  {
    id: "ls-1",
    name: "Temi Adebayo",
    initials: "TA",
    email: "temi.adebayo@email.com",
    relationship: "Child",
    status: "approved",
    createdAt: "2024-11-10T00:00:00Z",
  },
  {
    id: "ls-2",
    name: "Kunle Adebayo",
    initials: "KA",
    email: "kunle.adebayo@email.com",
    relationship: "Child",
    status: "pending",
    createdAt: "2025-03-20T00:00:00Z",
  },
  {
    id: "ls-3",
    name: "Tunde Balogun",
    initials: "TB",
    email: "tunde.balogun@email.com",
    relationship: "Ward",
    status: "rejected",
    createdAt: "2024-06-15T00:00:00Z",
  },
];

/* ---- helpers ---- */

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ---- link row component ---- */

function LinkRow({
  link,
  role,
  onApprove,
  onReject,
  onRevoke,
}: {
  link: LinkRequest;
  role: Role;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRevoke: (id: string) => void;
}) {
  const otherLabel = role === "student" ? "Parent" : "Student";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl bg-muted/60 px-4 py-3 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="text-[11px]">
            {link.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium truncate">{link.name}</p>
            <Badge
              className={cn(
                "rounded-full text-[9px] px-1.5 py-0 h-4",
                link.status === "approved" &&
                  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                link.status === "pending" &&
                  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                link.status === "rejected" &&
                  "bg-muted-foreground/10 text-muted-foreground"
              )}
            >
              {link.status === "approved"
                ? "Linked"
                : link.status === "pending"
                ? "Pending"
                : "Rejected"}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {link.relationship} · {link.email}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {link.status === "approved"
              ? `Linked ${timeAgo(link.createdAt)}`
              : link.status === "pending"
              ? `Requested ${timeAgo(link.createdAt)}`
              : `Rejected ${timeAgo(link.createdAt)}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 sm:self-center">
        {link.status === "pending" && (
          <>
            <Button
              size="sm"
              className="rounded-full h-7 text-[10px]"
              onClick={() => onApprove(link.id)}
            >
              <HugeiconsIcon icon={UserCheck01Icon} size={11} className="mr-1" />
              Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-7 text-[10px] text-muted-foreground"
              onClick={() => onReject(link.id)}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={11} className="mr-1" />
              Reject
            </Button>
          </>
        )}

        {link.status === "approved" && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full h-7 text-[10px] text-destructive hover:text-destructive"
            onClick={() => onRevoke(link.id)}
          >
            Revoke
          </Button>
        )}
      </div>
    </div>
  );
}

/* ---- main component ---- */

interface LinkedAccountsProps {
  role: AppRole;
}

export function LinkedAccounts({ role: appRole }: LinkedAccountsProps) {
  const role: Role = (appRole === "student" || appRole === "parent") ? appRole : "student";
  const [links, setLinks] = useState<LinkRequest[]>(
    role === "student" ? STUDENT_LINKED_PARENTS : PARENT_LINKED_STUDENTS
  );

  const handleApprove = useCallback(
    (id: string) =>
      setLinks((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: "approved" as const } : l
        )
      ),
    []
  );

  const handleReject = useCallback(
    (id: string) =>
      setLinks((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: "rejected" as const } : l
        )
      ),
    []
  );

  const handleRevoke = useCallback(
    (id: string) =>
      setLinks((prev) => prev.filter((l) => l.id !== id)),
    []
  );

  const approvedLinks = links.filter((l) => l.status === "approved");
  const pendingLinks = links.filter((l) => l.status === "pending");
  const rejectedLinks = links.filter((l) => l.status === "rejected");
  const otherLabel = role === "student" ? "Parents" : "Students";
  const emptyLabel =
    role === "student"
      ? "No linked parents"
      : "No linked students";

  return (
    <div className="flex flex-col gap-5">
      {/* Pending requests */}
      {pendingLinks.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Pending Requests ({pendingLinks.length})
          </h3>
          <div className="flex flex-col gap-2">
            {pendingLinks.map((link) => (
              <LinkRow
                key={link.id}
                link={link}
                role={role}
                onApprove={handleApprove}
                onReject={handleReject}
                onRevoke={handleRevoke}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active links */}
      {approvedLinks.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Linked {otherLabel} ({approvedLinks.length})
          </h3>
          <div className="flex flex-col gap-2">
            {approvedLinks.map((link) => (
              <LinkRow
                key={link.id}
                link={link}
                role={role}
                onApprove={handleApprove}
                onReject={handleReject}
                onRevoke={handleRevoke}
              />
            ))}
          </div>
        </div>
      )}

      {/* Rejected/expired */}
      {rejectedLinks.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Rejected ({rejectedLinks.length})
          </h3>
          <div className="flex flex-col gap-2 opacity-60">
            {rejectedLinks.map((link) => (
              <LinkRow
                key={link.id}
                link={link}
                role={role}
                onApprove={handleApprove}
                onReject={handleReject}
                onRevoke={handleRevoke}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {links.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="size-12 rounded-xl bg-muted flex items-center justify-center mb-3">
            <HugeiconsIcon
              icon={UserIcon}
              size={20}
              className="text-muted-foreground"
            />
          </div>
          <p className="text-sm font-medium">{emptyLabel}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            {role === "student"
              ? "Parents can request to link with your account to monitor your progress. You'll be notified when a request is made."
              : "Search for students by email to send a link request. Once they approve, you'll be able to monitor their progress."}
          </p>
        </div>
      )}
    </div>
  );
}
