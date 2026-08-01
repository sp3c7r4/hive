"use client";

import {
  Award01Icon,
  BookOpen01Icon,
  Building02Icon,
  CompassIcon,
  CreditCardIcon,
  HistoryIcon,
  LayoutGridIcon,
  Logout03Icon,
  Message01Icon,
  Moon02Icon,
  Settings01Icon,
  Shield02Icon,
  Sun02Icon,
  UserCheck01Icon,
  UserGroupIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GlobalSearchBar } from "@/components/global-search";
import { useTheme } from "@/components/theme-provider";
import { TopbarActionCluster } from "@/components/topbar-action-cluster";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- */
/*  Types                                                           */
/* ---------------------------------------------------------------- */

type Role = "instructor" | "student" | "parent" | "admin";

type NavItem = {
  label: string;
  href: string;
  icon: IconSvgElement;
  badge?: number;
};

const navByRole: Record<Role, NavItem[]> = {
  instructor: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutGridIcon },
    {
      label: "Communities",
      href: "/dashboard/communities",
      icon: UserGroupIcon,
    },
    { label: "Courses", href: "/dashboard/courses", icon: BookOpen01Icon },
    { label: "Members", href: "/dashboard/members", icon: UserCheck01Icon },
    { label: "Messages", href: "/dashboard/messages", icon: Message01Icon },
    { label: "Earnings", href: "/dashboard/earnings", icon: Wallet01Icon },
    {
      label: "Withdrawals",
      href: "/dashboard/withdrawals",
      icon: CreditCardIcon,
    },
  ],
  student: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutGridIcon },
    { label: "Explore", href: "/dashboard/explore", icon: CompassIcon },
    {
      label: "My Communities",
      href: "/dashboard/my-communities",
      icon: UserGroupIcon,
    },
    {
      label: "My Courses",
      href: "/dashboard/my-courses",
      icon: BookOpen01Icon,
    },
    { label: "Messages", href: "/dashboard/messages", icon: Message01Icon },
    { label: "Payments", href: "/dashboard/payments", icon: CreditCardIcon },
    {
      label: "Certificates",
      href: "/dashboard/certificates",
      icon: Award01Icon,
    },
  ],
  parent: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutGridIcon },
    { label: "My Children", href: "/dashboard/children", icon: UserGroupIcon },
    { label: "Messages", href: "/dashboard/messages", icon: Message01Icon },
    { label: "Payments", href: "/dashboard/payments", icon: CreditCardIcon },
    {
      label: "Certificates",
      href: "/dashboard/certificates",
      icon: Award01Icon,
    },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutGridIcon },
    { label: "Users", href: "/dashboard/users", icon: UserGroupIcon },
    {
      label: "Communities",
      href: "/dashboard/admin/communities",
      icon: Building02Icon,
    },
    {
      label: "Payments",
      href: "/dashboard/admin/payments",
      icon: CreditCardIcon,
    },
    {
      label: "Withdrawals",
      href: "/dashboard/withdrawals",
      icon: Wallet01Icon,
    },
    { label: "Activity Logs", href: "/dashboard/logs", icon: HistoryIcon },
  ],
};

/* ---------------------------------------------------------------- */
/*  Theme Toggle (expanded vs collapsed)                             */
/* ---------------------------------------------------------------- */

function ThemeToggle() {
  const { state } = useSidebar();
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) return null;

  /* Collapsed: icon-only stacked buttons, no text */
  if (state === "collapsed") {
    return (
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={cn(
            "size-8 flex items-center justify-center rounded-md transition-colors",
            theme === "light"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <HugeiconsIcon icon={Sun02Icon} size={16} />
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={cn(
            "size-8 flex items-center justify-center rounded-md transition-colors",
            theme === "dark"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <HugeiconsIcon icon={Moon02Icon} size={16} />
        </button>
      </div>
    );
  }

  /* Expanded: segmented pill with labels */
  return (
    <div className="flex rounded-lg bg-muted p-0.5">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
          theme === "light"
            ? "bg-background text-foreground"
            : "text-muted-foreground",
        )}
      >
        <HugeiconsIcon icon={Sun02Icon} size={14} />
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
          theme === "dark"
            ? "bg-background text-foreground"
            : "text-muted-foreground",
        )}
      >
        <HugeiconsIcon icon={Moon02Icon} size={14} />
        Dark
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  App Sidebar                                                     */
/* ---------------------------------------------------------------- */

export function AppSidebar({ role = "student" }: { role?: Role }) {
  const pathname = usePathname();
  const items = navByRole[role];

  /* Shared row classes */
  const rowBg =
    "data-[active=true]:bg-neutral-200 data-[active=true]:dark:bg-neutral-800 data-[active=true]:text-foreground data-[active=true]:font-medium";
  const rowSize =
    "h-11 px-3 gap-3 rounded-lg group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 [&_svg]:size-[22px]";

  return (
    <Sidebar variant="floating" collapsible="icon">
      {/* ---- Header ---- */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 pt-2 group-data-[collapsible=icon]:hidden">
          <Image
            src="/logo.svg"
            alt="Hive"
            width={32}
            height={36}
            className="shrink-0"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold leading-tight text-foreground">
              Hive
            </span>
            <span className="text-[11px] text-muted-foreground leading-tight">
              Learn in community
            </span>
          </div>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex justify-center pt-3 pb-1">
          <Image src="/logo.svg" alt="Hive" width={24} height={27} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1 group-data-[collapsible=icon]:gap-1">
            {items.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className={cn(rowBg, rowSize)}
                  render={<Link href={`${item.href}?role=${role}`} />}
                >
                  <HugeiconsIcon icon={item.icon} size={22} />
                  <span className="text-sm font-medium">{item.label}</span>
                </SidebarMenuButton>
                {item.badge != null && (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <Separator className="mx-3 w-auto group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-8" />

        <SidebarGroup>
          <SidebarMenu className="gap-1 group-data-[collapsible=icon]:gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/dashboard/settings"}
                tooltip="Settings"
                className={cn(rowBg, rowSize)}
                render={<Link href={`/dashboard/settings?role=${role}`} />}
              >
                <HugeiconsIcon icon={Settings01Icon} size={22} />
                <span className="text-sm font-medium">Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ---- Footer ---- */}
      <SidebarFooter className="gap-3">
        <ThemeToggle />

        {/* User row: collapsed shrinks to avatar-only */}
        <div
          className={cn(
            "flex items-center gap-3",
            "group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1",
            "px-0",
          )}
        >
          <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
            <span className="text-xs font-bold text-muted-foreground">
              {role.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold text-foreground truncate">
              {role === "instructor"
                ? "Ade Okafor"
                : role === "parent"
                  ? "Ngozi Eze"
                  : role === "admin"
                    ? "Super Admin"
                    : "Chioma Nwosu"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {role === "instructor"
                ? "ade@hive.ng"
                : role === "parent"
                  ? "ngozi@hive.ng"
                  : role === "admin"
                    ? "admin@hive.ng"
                    : "chioma@hive.ng"}
            </p>
          </div>
          <Link
            href="/auth"
            className="size-8 flex items-center justify-center rounded-md bg-muted hover:bg-muted/80 text-muted-foreground transition-colors shrink-0 group-data-[collapsible=icon]:hidden"
          >
            <HugeiconsIcon icon={Logout03Icon} size={15} />
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

/* ---------------------------------------------------------------- */
/*  Dashboard Layout                                                */
/* ---------------------------------------------------------------- */

export function DashboardLayout({
  children,
  role = "student",
  title,
}: {
  children: React.ReactNode;
  role?: Role;
  title?: string;
}) {
  const pathname = usePathname();
  const pageTitle =
    title ||
    (pathname.startsWith("/dashboard/communities/create")
      ? "Create Community"
      : pathname.startsWith("/dashboard/admin/communities")
        ? "Communities"
        : pathname.startsWith("/dashboard/admin/payments")
          ? "All Payments"
          : pathname.startsWith("/dashboard/withdrawals")
            ? "Withdrawals"
            : pathname.startsWith("/dashboard/logs")
              ? "Activity Logs"
              : pathname.match(/^\/dashboard\/users\/[^/]+$/)
                ? "User Detail"
                : pathname.startsWith("/dashboard/users")
                  ? "Users"
                  : pathname.startsWith("/dashboard/communities")
                    ? "Communities"
                    : pathname.startsWith("/dashboard/settings")
                      ? "Settings"
                      : pathname.startsWith("/dashboard/messages")
                        ? "Messages"
                        : pathname.startsWith("/dashboard/search")
                          ? "Search"
                          : pathname.startsWith("/dashboard/payments")
                            ? "Payments"
                            : pathname.startsWith("/dashboard/members")
                              ? "Members"
                              : pathname.startsWith("/dashboard/earnings")
                                ? "Earnings"
                                : pathname.startsWith("/dashboard/my-courses")
                                  ? "My Courses"
                                  : pathname.startsWith(
                                        "/dashboard/courses/create",
                                      )
                                    ? "Create Course"
                                    : pathname.startsWith("/dashboard/courses")
                                      ? "Courses"
                                      : pathname.startsWith(
                                            "/dashboard/explore",
                                          )
                                        ? "Explore"
                                        : pathname.startsWith("/dashboard")
                                          ? "Dashboard"
                                          : "");

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--sidebar-width-icon": "4.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar role={role} />
      <main className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Floating header */}
        <div className="sticky top-0 z-30 px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 rounded-2xl bg-background py-2.5">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-semibold text-foreground shrink-0">
                {pageTitle}
              </span>
            </div>
            <GlobalSearchBar role={role} />
            <div className="ml-auto">
              <TopbarActionCluster
                status="active"
                hasUnread
                fallback={role.charAt(0).toUpperCase()}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 px-4 pb-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
