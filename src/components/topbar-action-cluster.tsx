"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  Notification01Icon,
  Settings01Icon,
  Logout03Icon,
  ComputerRemoveIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Menu } from "@base-ui/react/menu";
import {
  NotificationBellDropdown,
  NotificationDrawer,
} from "@/components/notification-drawer";

/* ---------------------------------------------------------------- */
/*  Mock notification data (shared across instances)                  */
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

/* This data matches the full set in notification-drawer.tsx.
   The bell shows last 10; the drawer shows all. */
const ALL_NOTIFICATIONS: NotificationItem[] = [
  { id: "1", type: "quiz", title: "Quiz Graded", text: "Your \"React Hooks Deep Dive\" quiz has been graded. Score: 85%", time: "2m ago", read: false, href: "/dashboard/my-courses" },
  { id: "2", type: "message", title: "New Message", text: "Ade Okafor sent you a message: \"Great work on the last assignment!\"", time: "5m ago", read: false, href: "/dashboard/messages" },
  { id: "3", type: "enrollment", title: "New Enrollment", text: "You've been enrolled in \"Advanced Data Analysis with Excel\"", time: "1h ago", read: false, href: "/dashboard/my-courses" },
  { id: "4", type: "assignment", title: "Assignment Due", text: "\"Build a REST API\" is due in 2 days. Submit your work before the deadline.", time: "2h ago", read: true, href: "/dashboard/my-courses" },
  { id: "5", type: "payment", title: "Payment Confirmed", text: "Your payment of ₦25,000 for \"Frontend Masterclass\" has been confirmed.", time: "3h ago", read: true, href: "/dashboard/payments" },
  { id: "6", type: "system", title: "Maintenance Notice", text: "The platform will undergo scheduled maintenance on Sunday at 2 AM WAT.", time: "5h ago", read: true },
  { id: "7", type: "message", title: "New Message", text: "Kelechi Nwosu: \"Can we schedule a study group this weekend?\"", time: "Yesterday", read: true, href: "/dashboard/messages" },
  { id: "8", type: "assignment", title: "Assignment Graded", text: "Your \"CSS Grid Layout Challenge\" received a score of 92%. Excellent work!", time: "Yesterday", read: true, href: "/dashboard/my-courses" },
  { id: "9", type: "quiz", title: "New Quiz Available", text: "\"JavaScript Fundamentals\" quiz is now available. 20 questions, 30 minutes.", time: "2d ago", read: true, href: "/dashboard/my-courses" },
  { id: "10", type: "enrollment", title: "Course Completed", text: "Congratulations! You've completed \"Intro to UI/UX Design\".", time: "3d ago", read: true, href: "/dashboard/certificates" },
  { id: "11", type: "payment", title: "Invoice Generated", text: "Your invoice for March 2025 is ready. Amount: ₦15,000.", time: "4d ago", read: true, href: "/dashboard/payments" },
  { id: "12", type: "system", title: "Welcome to Hive", text: "Welcome aboard! Set up your profile and explore the platform.", time: "1w ago", read: true },
  { id: "13", type: "message", title: "New Message", text: "Dr. Okonkwo shared a file: \"midterm-study-guide.pdf\"", time: "1w ago", read: true, href: "/dashboard/messages" },
  { id: "14", type: "assignment", title: "Feedback Received", text: "You received feedback on \"User Research Case Study\". View detailed comments.", time: "1w ago", read: true, href: "/dashboard/my-courses" },
  { id: "15", type: "quiz", title: "Quiz Reminder", text: "\"TypeScript Advanced Patterns\" quiz closes in 24 hours. Don't miss it!", time: "1w ago", read: true, href: "/dashboard/my-courses" },
];

/* ---------------------------------------------------------------- */
/*  Status pill                                                     */
/* ---------------------------------------------------------------- */

type TestingStatus = "active" | "paused" | "failed";

const statusStyles: Record<TestingStatus, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  paused: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const statusLabels: Record<TestingStatus, string> = {
  active: "Active",
  paused: "Paused",
  failed: "Failed",
};

function StatusPill({ status }: { status: TestingStatus }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-background px-4 py-3">
      <span className="text-sm text-muted-foreground">Status:</span>
      <Badge className={cn("rounded-full font-medium", statusStyles[status])}>
        {statusLabels[status]}
      </Badge>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Logout handlers                                                 */
/* ---------------------------------------------------------------- */

function handleLogOut() {
  window.location.href = "/auth";
}

function handleLogOutAllDevices() {
  window.location.href = "/auth";
}

/* ---------------------------------------------------------------- */
/*  Notifications + Avatar cluster                                  */
/* ---------------------------------------------------------------- */

function NotificationsAndAvatar({
  avatarUrl,
  fallback,
}: {
  avatarUrl?: string;
  fallback: string;
}) {
  const [notifications, setNotifications] = useState(ALL_NOTIFICATIONS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bellMenuOpen, setBellMenuOpen] = useState(false);

  const hasUnread = notifications.some((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const bellNotifications = notifications.slice(0, 10);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleNavigateAndClose = useCallback((href: string) => {
    setBellMenuOpen(false);
    window.location.href = href;
  }, []);

  return (
    <>
      <div className="flex items-center gap-3 rounded-2xl bg-background pl-3 pr-1.5 py-1.5">
        {/* Bell with dropdown */}
        <Menu.Root open={bellMenuOpen} onOpenChange={setBellMenuOpen}>
          <Menu.Trigger className="relative flex items-center justify-center size-8 rounded-lg hover:bg-muted transition-colors cursor-pointer">
            <HugeiconsIcon icon={Notification01Icon} size={20} className="text-foreground" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-orange-500 ring-2 ring-background" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center ring-2 ring-background">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={8} align="end">
              <Menu.Popup className="rounded-xl border border-border bg-popover shadow-lg origin-[var(--transform-origin)] transition-[transform,opacity] duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
                <NotificationBellDropdown
                  notifications={bellNotifications}
                  onMarkAllRead={handleMarkAllRead}
                  onViewAll={() => { setBellMenuOpen(false); setDrawerOpen(true); }}
                  hasUnread={hasUnread}
                  onNavigate={handleNavigateAndClose}
                />
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        {/* Avatar dropdown */}
        <Menu.Root>
          <Menu.Trigger className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="size-9">
              <AvatarImage src={avatarUrl} alt="" />
              <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                {fallback}
              </AvatarFallback>
            </Avatar>
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={8} align="end">
              <Menu.Popup className="flex flex-col min-w-[200px] rounded-xl border border-border bg-popover p-1 shadow-lg origin-[var(--transform-origin)] transition-[transform,opacity] duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
                <Menu.Item
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground outline-none data-[highlighted]:bg-muted cursor-pointer"
                  render={<a href="/dashboard/settings" />}
                >
                  <HugeiconsIcon icon={Settings01Icon} size={16} className="text-muted-foreground" />
                  Settings
                </Menu.Item>
                <Menu.Separator className="my-1 h-px bg-border" />
                <Menu.Item
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground outline-none data-[highlighted]:bg-muted cursor-pointer"
                  onClick={handleLogOut}
                >
                  <HugeiconsIcon icon={Logout03Icon} size={16} className="text-muted-foreground" />
                  Log Out
                </Menu.Item>
                <Menu.Item
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive outline-none data-[highlighted]:bg-muted cursor-pointer"
                  onClick={handleLogOutAllDevices}
                >
                  <HugeiconsIcon icon={ComputerRemoveIcon} size={16} className="text-destructive" />
                  Log Out All Devices
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />
    </>
  );
}

/* ---------------------------------------------------------------- */
/*  Topbar Action Cluster                                           */
/* ---------------------------------------------------------------- */

export function TopbarActionCluster({
  status = "active",
  avatarUrl,
  fallback = "U",
}: {
  status?: TestingStatus;
  hasUnread?: boolean;
  avatarUrl?: string;
  fallback?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:block">
        <StatusPill status={status} />
      </div>
      <NotificationsAndAvatar
        avatarUrl={avatarUrl}
        fallback={fallback}
      />
    </div>
  );
}
