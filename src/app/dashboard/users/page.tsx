"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  UserGroupIcon,
  Shield02Icon,
  ArrowRight02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Role = "instructor" | "student" | "parent" | "admin";

const USERS = [
  { id:"u1", name:"Ade Okafor", initials:"AO", email:"ade@hive.ng", role:"instructor" as const, status:"active" as const, joined:"Jan 2024", lastActive:"2 min ago", enrollments:0, revenue:"₦1.2M" },
  { id:"u2", name:"Chioma Eze", initials:"CE", email:"chioma@hive.ng", role:"student" as const, status:"active" as const, joined:"Mar 2024", lastActive:"1 hour ago", enrollments:3, revenue:"—" },
  { id:"u3", name:"Emeka Nwosu", initials:"EN", email:"emeka@hive.ng", role:"student" as const, status:"suspended" as const, joined:"Feb 2024", lastActive:"3 weeks ago", enrollments:2, revenue:"—" },
  { id:"u4", name:"Fatima Bello", initials:"FB", email:"fatima@hive.ng", role:"instructor" as const, status:"active" as const, joined:"Nov 2024", lastActive:"5 hours ago", enrollments:0, revenue:"₦450K" },
  { id:"u5", name:"Ngozi Adeyemi", initials:"NA", email:"ngozi@hive.ng", role:"parent" as const, status:"active" as const, joined:"Dec 2024", lastActive:"1 day ago", enrollments:0, revenue:"—" },
  { id:"u6", name:"Tunde Balogun", initials:"TB", email:"tunde@hive.ng", role:"student" as const, status:"deleted" as const, joined:"Jun 2024", lastActive:"—", enrollments:1, revenue:"—" },
  { id:"u7", name:"Ibrahim Musa", initials:"IM", email:"ibrahim@hive.ng", role:"instructor" as const, status:"active" as const, joined:"Aug 2024", lastActive:"30 min ago", enrollments:0, revenue:"₦890K" },
];

const roleColors: Record<string, string> = {
  instructor: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  student: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  parent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  admin: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  suspended: "bg-amber-100 text-amber-700",
  deleted: "bg-rose-100 text-rose-700",
};

function UsersPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const role = (sp.get("role") as Role) || "admin";
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [users, setUsers] = useState(USERS);
  const [actionConfirm, setActionConfirm] = useState<{ id: string; action: string } | null>(null);

  const filtered = users.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    return true;
  });

  const handleAction = (id: string, action: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const next = { ...u };
        if (action === "suspend") next.status = "suspended";
        if (action === "unsuspend") next.status = "active";
        if (action === "delete") next.status = "deleted";
        return next;
      }) as typeof prev
    );
    setActionConfirm(null);
  };

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-5 min-w-0">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all platform users</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="pl-9 rounded-full text-sm" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-9 w-[130px] rounded-full text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[130px] rounded-full text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                  <th className="text-left pl-4 pr-2 py-3 font-medium">User</th>
                  <th className="text-left px-2 py-3 font-medium">Email</th>
                  <th className="text-left px-2 py-3 font-medium">Role</th>
                  <th className="text-left px-2 py-3 font-medium">Status</th>
                  <th className="text-left px-2 py-3 font-medium hidden sm:table-cell">Joined</th>
                  <th className="text-left px-2 py-3 font-medium hidden md:table-cell">Last Active</th>
                  <th className="text-right pl-2 pr-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/20 cursor-pointer" onClick={() => router.push(`/dashboard/users/${u.id}?role=${role}`)}>
                    <td className="pl-4 pr-2 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8 shrink-0"><AvatarFallback className="text-[10px]">{u.initials}</AvatarFallback></Avatar>
                        <span className="font-medium text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-xs text-muted-foreground">{u.email}</td>
                    <td className="px-2 py-3"><Badge className={cn("rounded-full text-[10px] px-2 py-0 h-5", roleColors[u.role])}>{u.role}</Badge></td>
                    <td className="px-2 py-3"><Badge className={cn("rounded-full text-[10px] px-2 py-0 h-5", statusColors[u.status])}>{u.status}</Badge></td>
                    <td className="px-2 py-3 text-xs text-muted-foreground hidden sm:table-cell">{u.joined}</td>
                    <td className="px-2 py-3 text-xs text-muted-foreground hidden md:table-cell">{u.lastActive}</td>
                    <td className="pl-2 pr-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        {u.status === "active" && (
                          <Button size="sm" variant="ghost" className="rounded-full h-7 text-[10px] text-amber-600" onClick={() => setActionConfirm({ id: u.id, action: "suspend" })}>Suspend</Button>
                        )}
                        {u.status === "suspended" && (
                          <Button size="sm" variant="ghost" className="rounded-full h-7 text-[10px] text-emerald-600" onClick={() => handleAction(u.id, "unsuspend")}>Unsuspend</Button>
                        )}
                        {u.status !== "deleted" && (
                          <Button size="sm" variant="ghost" className="rounded-full h-7 text-[10px] text-destructive" onClick={() => setActionConfirm({ id: u.id, action: "delete" })}>Delete</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="text-xs text-muted-foreground">{filtered.length} users found</p>
      </div>

      {/* Confirm modal */}
      {actionConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setActionConfirm(null)}>
          <div className="bg-background rounded-2xl p-6 max-w-sm mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold capitalize">{actionConfirm.action} User</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">
              {actionConfirm.action === "delete"
                ? "This will soft-delete the account. It can be recovered within 30 days."
                : `Are you sure you want to ${actionConfirm.action} this user?`}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setActionConfirm(null)}>Cancel</Button>
              <Button size="sm" className="rounded-full" variant={actionConfirm.action === "delete" ? "destructive" : "default"} onClick={() => handleAction(actionConfirm.id, actionConfirm.action)}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function Wrapper() { return <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-32 mb-4"/><Skeleton className="h-64 rounded-xl"/></div>}><UsersPage/></Suspense>; }
