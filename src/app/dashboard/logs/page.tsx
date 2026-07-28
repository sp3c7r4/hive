"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type Role = "instructor" | "student" | "parent" | "admin";

const LOGS = [
  { id:"l1", timestamp:"Apr 12, 2025 14:32 UTC", user:"Ade Okafor", action:"Withdrawal Requested", resource:"Withdrawal", detail:"Requested ₦50,000 to GTBank", ip:"102.89.42.15" },
  { id:"l2", timestamp:"Apr 12, 2025 10:15 UTC", user:"Chioma Eze", action:"Quiz Submitted", resource:"Quiz", detail:"React Fundamentals Quiz — 8/10", ip:"102.89.33.21" },
  { id:"l3", timestamp:"Apr 12, 2025 09:48 UTC", user:"Ngozi Adeyemi", action:"Payment Made", resource:"Payment", detail:"Paid ₦10,000 for Python for Data Science (Kunle)", ip:"102.89.18.7" },
  { id:"l4", timestamp:"Apr 11, 2025 22:03 UTC", user:"Admin", action:"User Suspended", resource:"User", detail:"Suspended Emeka Nwosu", ip:"10.0.1.1" },
  { id:"l5", timestamp:"Apr 11, 2025 16:20 UTC", user:"Fatima Bello", action:"Course Published", resource:"Course", detail:"Published 'Python for Data Science'", ip:"102.89.55.9" },
  { id:"l6", timestamp:"Apr 11, 2025 12:44 UTC", user:"Ibrahim Musa", action:"Community Created", resource:"Community", detail:"Created 'Backend Gurus'", ip:"102.89.41.72" },
  { id:"l7", timestamp:"Apr 10, 2025 15:30 UTC", user:"Emeka Nwosu", action:"Login Failed", resource:"Auth", detail:"Multiple failed attempts from new device", ip:"197.210.54.88" },
  { id:"l8", timestamp:"Apr 10, 2025 09:12 UTC", user:"Ade Okafor", action:"Member Approved", resource:"Community", detail:"Approved Chioma Eze into Frontend Devs", ip:"102.89.42.15" },
];

const actionColors: Record<string, string> = {
  "Withdrawal Requested":"bg-amber-100 text-amber-700",
  "Quiz Submitted":"bg-blue-100 text-blue-700",
  "Payment Made":"bg-emerald-100 text-emerald-700",
  "User Suspended":"bg-rose-100 text-rose-700",
  "Course Published":"bg-violet-100 text-violet-700",
  "Community Created":"bg-violet-100 text-violet-700",
  "Login Failed":"bg-rose-100 text-rose-700",
  "Member Approved":"bg-emerald-100 text-emerald-700",
};

function ActivityLogsPage() {
  const sp = useSearchParams();
  const role = (sp.get("role") as Role) || "admin";
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filtered = LOGS.filter((l) => {
    if (search && !l.user.toLowerCase().includes(search.toLowerCase()) && !l.detail.toLowerCase().includes(search.toLowerCase())) return false;
    if (actionFilter !== "all" && l.action !== actionFilter) return false;
    return true;
  });

  const actionTypes = [...new Set(LOGS.map((l) => l.action))];

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-5 min-w-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div><h1 className="text-2xl font-bold">Activity Logs</h1><p className="text-sm text-muted-foreground mt-1">Audit trail of platform actions</p></div>
          <Button variant="outline" size="sm" className="rounded-full text-xs">
            <HugeiconsIcon icon={Download01Icon} size={13} className="mr-1.5"/>Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user or detail..." className="pl-9 rounded-full text-sm"/>
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="h-9 w-[160px] rounded-full text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {actionTypes.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/30 text-xs text-muted-foreground"><th className="text-left px-4 py-3">Timestamp</th><th className="text-left px-4 py-3">User</th><th className="text-left px-4 py-3">Action</th><th className="text-left px-4 py-3 hidden md:table-cell">Detail</th><th className="text-right px-4 py-3 hidden lg:table-cell">IP</th></tr></thead>
              <tbody className="divide-y">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{l.timestamp}</td>
                    <td className="px-4 py-3 text-xs font-medium">{l.user}</td>
                    <td className="px-4 py-3"><Badge className={cn("rounded-full text-[10px] px-2 py-0 h-5 whitespace-nowrap", actionColors[l.action] || "bg-muted-foreground/10 text-muted-foreground")}>{l.action}</Badge></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{l.detail}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground text-right hidden lg:table-cell font-mono">{l.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="text-xs text-muted-foreground">{filtered.length} entries</p>
      </div>
    </DashboardLayout>
  );
}

export default function Wrapper() { return <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-32 mb-4"/><Skeleton className="h-64 rounded-xl"/></div>}><ActivityLogsPage/></Suspense>; }
