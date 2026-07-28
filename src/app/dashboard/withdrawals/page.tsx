"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { Wallet01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type Role = "instructor" | "student" | "parent" | "admin";

const WITHDRAWALS = [
  { id:"w1", instructor:"Ade Okafor", initials:"AO", amount:"₦50,000", bank:"GTBank — 0123456789", status:"pending", requested:"Apr 10, 2025" },
  { id:"w2", instructor:"Fatima Bello", initials:"FB", amount:"₦25,000", bank:"Access Bank — 0987654321", status:"processing", requested:"Apr 8, 2025" },
  { id:"w3", instructor:"Ibrahim Musa", initials:"IM", amount:"₦35,000", bank:"First Bank — 0567891234", status:"completed", requested:"Mar 28, 2025" },
  { id:"w4", instructor:"Ade Okafor", initials:"AO", amount:"₦80,000", bank:"GTBank — 0123456789", status:"completed", requested:"Mar 15, 2025" },
  { id:"w5", instructor:"Ibrahim Musa", initials:"IM", amount:"₦20,000", bank:"First Bank — 0567891234", status:"failed", requested:"Mar 1, 2025" },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
};

function WithdrawalsPage() {
  const sp = useSearchParams();
  const role = (sp.get("role") as Role) || "admin";
  const [withdrawals, setWithdrawals] = useState(WITHDRAWALS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = withdrawals.filter((w) => statusFilter === "all" || w.status === statusFilter);

  const handleApprove = (id: string) => {
    setWithdrawals((prev) => prev.map((w) => w.id === id ? { ...w, status: "processing" } : w));
  };
  const handleReject = () => {
    if (!rejectId || !rejectReason.trim()) return;
    setWithdrawals((prev) => prev.map((w) => w.id === rejectId ? { ...w, status: "failed" } : w));
    setRejectId(null);
    setRejectReason("");
  };
  const handleMarkProcessed = (id: string) => {
    setWithdrawals((prev) => prev.map((w) => w.id === id ? { ...w, status: "completed" } : w));
  };

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-5 min-w-0">
        <div><h1 className="text-2xl font-bold">Withdrawals</h1><p className="text-sm text-muted-foreground mt-1">Process instructor payout requests</p></div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[130px] rounded-full text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/30 text-xs text-muted-foreground"><th className="text-left px-4 py-3">Instructor</th><th className="text-right px-4 py-3">Amount</th><th className="text-left px-4 py-3 hidden sm:table-cell">Bank Details</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3 hidden md:table-cell">Requested</th><th className="text-right px-4 py-3">Actions</th></tr></thead>
              <tbody className="divide-y">
                {filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar className="size-8"><AvatarFallback className="text-[10px]">{w.initials}</AvatarFallback></Avatar><span className="font-medium">{w.instructor}</span></div></td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums">{w.amount}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{w.bank}</td>
                    <td className="px-4 py-3"><Badge className={cn("rounded-full text-[10px] px-2 py-0 h-5", statusColors[w.status])}>{w.status}</Badge></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{w.requested}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {w.status === "pending" && (<>
                          <Button size="sm" className="rounded-full h-7 text-[10px]" onClick={() => handleApprove(w.id)}>Approve</Button>
                          <Button size="sm" variant="ghost" className="rounded-full h-7 text-[10px] text-destructive" onClick={() => setRejectId(w.id)}>Reject</Button>
                        </>)}
                        {w.status === "processing" && <Button size="sm" className="rounded-full h-7 text-[10px]" onClick={() => handleMarkProcessed(w.id)}>Mark Sent</Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Reject modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setRejectId(null)}>
          <div className="bg-background rounded-2xl p-6 max-w-sm mx-4 shadow-xl w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">Reject Withdrawal</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">The instructor will be notified with your reason.</p>
            <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason for rejection..." className="min-h-[80px] text-sm" />
            <div className="flex justify-end gap-2 mt-4"><Button variant="outline" size="sm" className="rounded-full" onClick={() => setRejectId(null)}>Cancel</Button><Button size="sm" variant="destructive" className="rounded-full" disabled={!rejectReason.trim()} onClick={handleReject}>Reject</Button></div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function Wrapper() { return <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-32 mb-4"/><Skeleton className="h-64 rounded-xl"/></div>}><WithdrawalsPage/></Suspense>; }
