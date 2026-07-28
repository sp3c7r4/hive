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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, UserCheck01Icon, Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type Role = "instructor" | "student" | "parent" | "admin";

const ALL_MEMBERS = [
  { id:"m1", name:"Chioma Eze", initials:"CE", email:"chioma@hive.ng", community:"Frontend Devs", joined:"Mar 2024", status:"active", role:"member" },
  { id:"m2", name:"Kelechi Okonkwo", initials:"KO", email:"kelechi@hive.ng", community:"Frontend Devs", joined:"Apr 2024", status:"active", role:"member" },
  { id:"m3", name:"Amara Obi", initials:"AO", email:"amara@hive.ng", community:"Frontend Devs", joined:"Jan 2024", status:"pending", role:"member" },
  { id:"m4", name:"Tunde Balogun", initials:"TB", email:"tunde@hive.ng", community:"UI/UX Hub", joined:"Feb 2024", status:"active", role:"moderator" },
  { id:"m5", name:"Ngozi Adeyemi", initials:"NA", email:"ngozi@hive.ng", community:"UI/UX Hub", joined:"Mar 2024", status:"active", role:"member" },
  { id:"m6", name:"Fatima Bello", initials:"FB", email:"fatima@hive.ng", community:"Data Science Lab", joined:"Dec 2024", status:"active", role:"member" },
  { id:"m7", name:"Ibrahim Musa", initials:"IM", email:"ibrahim@hive.ng", community:"Frontend Devs", joined:"Nov 2024", status:"blocked", role:"member" },
  { id:"m8", name:"Emeka Nwosu", initials:"EN", email:"emeka@hive.ng", community:"UI/UX Hub", joined:"Jan 2024", status:"active", role:"member" },
];

const COMMUNITIES = ["All Communities", "Frontend Devs", "UI/UX Hub", "Data Science Lab"];

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  blocked: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

function MembersPage() {
  const sp = useSearchParams();
  const role = (sp.get("role") as Role) || "instructor";
  const [search, setSearch] = useState("");
  const [communityFilter, setCommunityFilter] = useState("All Communities");
  const [statusFilter, setStatusFilter] = useState("all");
  const [members, setMembers] = useState(ALL_MEMBERS);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: string } | null>(null);

  const filtered = members.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (communityFilter !== "All Communities" && m.community !== communityFilter) return false;
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    return true;
  });

  const handleAction = (id: string, action: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        if (action === "approve") return { ...m, status: "active" };
        if (action === "block") return { ...m, status: "blocked" };
        if (action === "unblock") return { ...m, status: "active" };
        if (action === "remove") return { ...m, status: "blocked" };
        return m;
      })
    );
    setConfirmAction(null);
  };

  // stats
  const totalActive = members.filter((m) => m.status === "active").length;
  const totalPending = members.filter((m) => m.status === "pending").length;
  const totalBlocked = members.filter((m) => m.status === "blocked").length;

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-5 min-w-0">
        <div><h1 className="text-2xl font-bold">Members</h1><p className="text-sm text-muted-foreground mt-1">Manage members across your communities</p></div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4"><p className="text-[10px] text-muted-foreground">Active</p><p className="text-xl font-bold tabular-nums mt-1 text-emerald-600">{totalActive}</p></Card>
          <Card className="p-4"><p className="text-[10px] text-muted-foreground">Pending</p><p className="text-xl font-bold tabular-nums mt-1 text-amber-600">{totalPending}</p></Card>
          <Card className="p-4"><p className="text-[10px] text-muted-foreground">Blocked</p><p className="text-xl font-bold tabular-nums mt-1 text-rose-600">{totalBlocked}</p></Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="pl-9 rounded-full text-sm" />
          </div>
          <Select value={communityFilter} onValueChange={setCommunityFilter}>
            <SelectTrigger className="h-9 w-[170px] rounded-full text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {COMMUNITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[130px] rounded-full text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                  <th className="text-left px-4 py-3">Member</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Community</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Role</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Joined</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8 shrink-0"><AvatarFallback className="text-[10px]">{m.initials}</AvatarFallback></Avatar>
                        <span className="font-medium text-sm">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{m.email}</td>
                    <td className="px-4 py-3 text-xs hidden md:table-cell">{m.community}</td>
                    <td className="px-4 py-3 hidden md:table-cell"><Badge className="rounded-full text-[10px] px-2 py-0 h-5">{m.role}</Badge></td>
                    <td className="px-4 py-3"><Badge className={cn("rounded-full text-[10px] px-2 py-0 h-5", statusColors[m.status])}>{m.status}</Badge></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">{m.joined}</td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {m.status === "pending" && (
                          <Button size="sm" variant="ghost" className="rounded-full h-7 text-[10px] text-emerald-600" onClick={() => handleAction(m.id, "approve")}>Approve</Button>
                        )}
                        {m.status === "active" && (
                          <Button size="sm" variant="ghost" className="rounded-full h-7 text-[10px] text-amber-600" onClick={() => setConfirmAction({ id: m.id, action: "block" })}>Block</Button>
                        )}
                        {m.status === "blocked" && (
                          <Button size="sm" variant="ghost" className="rounded-full h-7 text-[10px] text-emerald-600" onClick={() => handleAction(m.id, "unblock")}>Unblock</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="text-xs text-muted-foreground">{filtered.length} members</p>
      </div>

      {/* Confirm modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmAction(null)}>
          <div className="bg-background rounded-2xl p-6 max-w-sm mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold capitalize">{confirmAction.action} Member</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">Are you sure you want to {confirmAction.action} this member?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setConfirmAction(null)}>Cancel</Button>
              <Button size="sm" className="rounded-full" variant={confirmAction.action === "block" ? "destructive" : "default"} onClick={() => handleAction(confirmAction.id, confirmAction.action)}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function Wrapper() { return <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-32 mb-4"/><Skeleton className="h-64 rounded-xl"/></div>}><MembersPage/></Suspense>; }
