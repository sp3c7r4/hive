"use client";

import {
  Award01Icon,
  BookOpen01Icon,
  Cancel01Icon,
  CreditCardIcon,
  Message01Icon,
  Notification01Icon,
  Settings01Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ---------------------------------------------------------------- */
/*  Types & demo data                                               */
/* ---------------------------------------------------------------- */

type NotificationType =
  | "enrollment"
  | "payment"
  | "assignment"
  | "quiz"
  | "message"
  | "system";

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  text: string;
  time: string;
  read: boolean;
  href?: string;
};

const typeConfig: Record<
  NotificationType,
  { icon: IconSvgElement; label: string; color: string }
> = {
  enrollment: {
    icon: UserCheck01Icon,
    label: "Enrollment",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  },
  payment: {
    icon: CreditCardIcon,
    label: "Payment",
    color:
      "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  assignment: {
    icon: BookOpen01Icon,
    label: "Assignment",
    color:
      "text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400",
  },
  quiz: {
    icon: Award01Icon,
    label: "Quiz",
    color:
      "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  message: {
    icon: Message01Icon,
    label: "Message",
    color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400",
  },
  system: {
    icon: Settings01Icon,
    label: "System",
    color: "text-muted-foreground bg-muted",
  },
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "quiz",
    title: "Quiz Graded",
    text: 'Your "React Hooks Deep Dive" quiz has been graded. Score: 85%',
    time: "2m ago",
    read: false,
    href: "/dashboard/my-courses",
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    text: 'Ade Okafor sent you a message: "Great work on the last assignment!"',
    time: "5m ago",
    read: false,
    href: "/dashboard/messages",
  },
  {
    id: "3",
    type: "enrollment",
    title: "New Enrollment",
    text: 'You\'ve been enrolled in "Advanced Data Analysis with Excel"',
    time: "1h ago",
    read: false,
    href: "/dashboard/my-courses",
  },
  {
    id: "4",
    type: "assignment",
    title: "Assignment Due",
    text: '"Build a REST API" is due in 2 days. Submit your work before the deadline.',
    time: "2h ago",
    read: true,
    href: "/dashboard/my-courses",
  },
  {
    id: "5",
    type: "payment",
    title: "Payment Confirmed",
    text: 'Your payment of ₦25,000 for "Frontend Masterclass" has been confirmed.',
    time: "3h ago",
    read: true,
    href: "/dashboard/payments",
  },
  {
    id: "6",
    type: "system",
    title: "Maintenance Notice",
    text: "The platform will undergo scheduled maintenance on Sunday at 2 AM WAT.",
    time: "5h ago",
    read: true,
  },
  {
    id: "7",
    type: "message",
    title: "New Message",
    text: 'Kelechi Nwosu: "Can we schedule a study group this weekend?"',
    time: "Yesterday",
    read: true,
    href: "/dashboard/messages",
  },
  {
    id: "8",
    type: "assignment",
    title: "Assignment Graded",
    text: 'Your "CSS Grid Layout Challenge" received a score of 92%. Excellent work!',
    time: "Yesterday",
    read: true,
    href: "/dashboard/my-courses",
  },
  {
    id: "9",
    type: "quiz",
    title: "New Quiz Available",
    text: '"JavaScript Fundamentals" quiz is now available. 20 questions, 30 minutes.',
    time: "2d ago",
    read: true,
    href: "/dashboard/my-courses",
  },
  {
    id: "10",
    type: "enrollment",
    title: "Course Completed",
    text: 'Congratulations! You\'ve completed "Intro to UI/UX Design".',
    time: "3d ago",
    read: true,
    href: "/dashboard/certificates",
  },
  {
    id: "11",
    type: "payment",
    title: "Invoice Generated",
    text: "Your invoice for March 2025 is ready. Amount: ₦15,000.",
    time: "4d ago",
    read: true,
    href: "/dashboard/payments",
  },
  {
    id: "12",
    type: "system",
    title: "Welcome to Hive",
    text: "Welcome aboard! Set up your profile and explore the platform.",
    time: "1w ago",
    read: true,
  },
  {
    id: "13",
    type: "message",
    title: "New Message",
    text: 'Dr. Okonkwo shared a file: "midterm-study-guide.pdf"',
    time: "1w ago",
    read: true,
    href: "/dashboard/messages",
  },
  {
    id: "14",
    type: "assignment",
    title: "Feedback Received",
    text: 'You received feedback on "User Research Case Study". View detailed comments.',
    time: "1w ago",
    read: true,
    href: "/dashboard/my-courses",
  },
  {
    id: "15",
    type: "quiz",
    title: "Quiz Reminder",
    text: '"TypeScript Advanced Patterns" quiz closes in 24 hours. Don\'t miss it!',
    time: "1w ago",
    read: true,
    href: "/dashboard/my-courses",
  },
];

/* ---------------------------------------------------------------- */
/*  Type filter config                                              */
/* ---------------------------------------------------------------- */

const TYPE_FILTERS: { key: NotificationType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "enrollment", label: "Enrollment" },
  { key: "payment", label: "Payment" },
  { key: "assignment", label: "Assignment" },
  { key: "quiz", label: "Quiz" },
  { key: "message", label: "Message" },
  { key: "system", label: "System" },
];

/* ---------------------------------------------------------------- */
/*  Notification Dropdown (bell)                                     */
/* ---------------------------------------------------------------- */

export function NotificationBellDropdown({
  notifications,
  onMarkAllRead,
  onViewAll,
  hasUnread,
  onNavigate,
}: {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onViewAll: () => void;
  hasUnread: boolean;
  onNavigate: (href: string) => void;
}) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col min-w-[360px] max-h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge
              variant="secondary"
              className="rounded-full text-[10px] px-1.5 py-0 h-5"
            >
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-xs text-primary hover:underline font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto scrollbar-hide max-h-[380px]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2 px-4">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center">
              <HugeiconsIcon
                icon={Notification01Icon}
                size={20}
                className="text-muted-foreground"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              No notifications yet
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const cfg = typeConfig[n.type];
            return (
              <button
                type="button"
                key={n.id}
                onClick={() => n.href && onNavigate(n.href)}
                className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${
                  !n.read ? "bg-primary/5" : ""
                }`}
              >
                <div
                  className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}
                >
                  <HugeiconsIcon icon={cfg.icon} size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{n.title}</p>
                    {!n.read && (
                      <span className="size-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {n.text}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {n.time}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t shrink-0">
        <button
          type="button"
          onClick={onViewAll}
          className="w-full text-center text-xs text-primary hover:underline font-medium py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Full Notification Drawer                                         */
/* ---------------------------------------------------------------- */

export function NotificationDrawer({
  open,
  onClose,
  notifications: initialNotifications,
  onMarkAllRead,
}: {
  open: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}) {
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const router = useRouter();

  const filtered = useMemo(() => {
    let list = initialNotifications;
    if (typeFilter !== "all") list = list.filter((n) => n.type === typeFilter);
    if (unreadOnly) list = list.filter((n) => !n.read);
    return list;
  }, [initialNotifications, typeFilter, unreadOnly]);

  const handleMarkAllRead = () => {
    onMarkAllRead();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-background border-l z-50 shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 rounded-full"
            onClick={onClose}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </Button>
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b shrink-0 gap-3">
          <div className="overflow-x-auto scrollbar-hide -mx-1 px-1 flex-1">
            <div className="flex items-center gap-1 w-max">
              {TYPE_FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTypeFilter(key)}
                  className={`text-[11px] px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                    typeFilter === key
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`text-[11px] px-2.5 py-1 rounded-full transition-colors whitespace-nowrap shrink-0 ${
              unreadOnly
                ? "bg-foreground text-background font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted border"
            }`}
          >
            Unread
          </button>
        </div>

        {/* Mark all read */}
        {initialNotifications.some((n) => !n.read) && (
          <div className="px-5 py-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-xs w-full"
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </Button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3 px-6">
              <div className="size-14 rounded-full bg-muted flex items-center justify-center">
                <HugeiconsIcon
                  icon={Notification01Icon}
                  size={24}
                  className="text-muted-foreground"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {unreadOnly
                  ? "No unread notifications"
                  : typeFilter !== "all"
                    ? `No ${typeConfig[typeFilter].label.toLowerCase()} notifications`
                    : "No notifications"}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((n) => {
                const cfg = typeConfig[n.type];
                return (
                  <button
                    type="button"
                    key={n.id}
                    onClick={() => {
                      if (n.href) {
                        router.push(n.href);
                        onClose();
                      }
                    }}
                    className={`w-full text-left flex items-start gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors ${
                      !n.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div
                      className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}
                    >
                      <HugeiconsIcon icon={cfg.icon} size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="size-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {n.text}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        {n.time}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
