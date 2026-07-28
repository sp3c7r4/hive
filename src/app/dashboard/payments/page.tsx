"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import { CreditCardIcon, Wallet01Icon, ReceiptTextIcon, CheckmarkCircle02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

type Role = "instructor" | "student" | "parent" | "admin";
type Tab = "history" | "subscriptions";

const PAYMENT_HISTORY = [
  { id:"ph1", date:"Apr 10, 2025", desc:"React for Designers (Enrollment)", amount:"₦0", status:"success" as const, method:"—", receipt:true },
  { id:"ph2", date:"Apr 5, 2025", desc:"UI/UX Research Methods (Enrollment)", amount:"₦0", status:"success" as const, method:"—", receipt:true },
  { id:"ph3", date:"Mar 28, 2025", desc:"Data Science Lab (Subscription)", amount:"₦5,000", status:"success" as const, method:"Paystack ·••4242", receipt:true },
  { id:"ph4", date:"Mar 15, 2025", desc:"Advanced TypeScript (One-time)", amount:"₦15,000", status:"success" as const, method:"Flutterwave ·••8901", receipt:true },
  { id:"ph5", date:"Mar 1, 2025", desc:"Freelance Blueprint (Payment)", amount:"₦8,000", status:"failed" as const, method:"Paystack ·••4242", receipt:false },
];

const SUBSCRIPTIONS = [
  { id:"sub1", name:"Data Science Lab", amount:"₦5,000", cycle:"Monthly" as const, nextBilling:"May 10, 2025", status:"active" as const },
  { id:"sub2", name:"Backend Engineers", amount:"₦3,000", cycle:"Monthly" as const, nextBilling:"Apr 25, 2025", status:"past_due" as const, graceDays:5 },
];

const statusColors = { success:"bg-emerald-100 text-emerald-700", failed:"bg-red-100 text-red-700", pending:"bg-amber-100 text-amber-700" } as const;

function PaymentsPage() {
  const sp = useSearchParams();
  const role = (sp.get("role") as Role) || "student";
  const [tab, setTab] = useState<Tab>("history");
  const success = sp.get("success");

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-5 min-w-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">View your payment history and manage subscriptions</p>
        </div>

        {success === "1" && (
          <div className="-mb-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-5 py-4 flex items-center gap-3">
            <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-emerald-700 dark:text-emerald-400"/></div>
            <div><p className="text-sm font-semibold">Payment successful!</p><p className="text-xs text-muted-foreground">You now have access. Happy learning!</p></div>
            <Button size="sm" variant="ghost" className="rounded-full ml-auto shrink-0" onClick={() => window.history.replaceState({},"",window.location.pathname)}><HugeiconsIcon icon={Cancel01Icon} size={14}/></Button>
          </div>
        )}

        <div className="flex items-center gap-1">
          {[{ key:"history" as const, label:"History", icon:ReceiptTextIcon },{ key:"subscriptions" as const, label:"Subscriptions", icon:Wallet01Icon }].map(({ key,label,icon })=>(
            <button key={key} onClick={()=>setTab(key)} className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-full transition-colors ${tab===key?"bg-foreground text-background font-medium":"text-muted-foreground hover:text-foreground hover:bg-muted"}`}><HugeiconsIcon icon={icon} size={15}/>{label}</button>
          ))}
        </div>

        {tab === "history" ? (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/30 text-xs text-muted-foreground"><th className="text-left pl-5 pr-3 py-3 font-medium">Date</th><th className="text-left px-3 py-3 font-medium">Description</th><th className="text-left px-3 py-3 font-medium">Amount</th><th className="text-left px-3 py-3 font-medium">Status</th><th className="text-left px-3 py-3 font-medium">Method</th><th className="text-right pl-3 pr-5 py-3 font-medium">Receipt</th></tr></thead>
                <tbody className="divide-y">
                  {PAYMENT_HISTORY.map((p)=>(
                    <tr key={p.id} className="hover:bg-muted/20">
                      <td className="pl-5 pr-3 py-3 text-xs text-muted-foreground">{p.date}</td>
                      <td className="px-3 py-3 text-sm font-medium">{p.desc}</td>
                      <td className="px-3 py-3 tabular-nums">{p.amount}</td>
                      <td className="px-3 py-3"><Badge className={`rounded-full text-[10px] px-2 py-0 h-5 ${statusColors[p.status]}`}>{p.status}</Badge></td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{p.method}</td>
                      <td className="pl-3 pr-5 py-3 text-right">{p.receipt && <Button size="sm" variant="ghost" className="rounded-full h-7 text-xs">Download</Button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {SUBSCRIPTIONS.map((s)=>(
              <Card key={s.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.amount}/{s.cycle.toLowerCase()} · Next billing {s.nextBilling}</p>
                  {s.status==="past_due" && <p className="text-xs text-red-600 mt-1">⚠ Payment failed. Update within {s.graceDays} days to keep access.</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={`rounded-full text-[10px] px-2 py-0 h-5 ${s.status==="active"?"bg-emerald-100 text-emerald-700":"bg-red-100 text-red-700"}`}>{s.status==="past_due"?"Past Due":"Active"}</Badge>
                  <Button size="sm" variant="outline" className="rounded-full h-8 text-xs">Cancel</Button>
                </div>
              </Card>
            ))}
            <details className="group">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground py-2">Expired & Cancelled</summary>
              <p className="text-xs text-muted-foreground py-4 text-center">No expired subscriptions</p>
            </details>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function Wrapper(){return <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-48 mb-6"/><Skeleton className="h-64 rounded-xl"/></div>}><PaymentsPage/></Suspense>;}
