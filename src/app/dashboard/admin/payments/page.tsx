"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { DashboardLayout } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Role = "instructor" | "student" | "parent" | "admin";

const ALL_PAYMENTS = [
  {
    id: "p1",
    date: "Apr 12, 2025",
    user: "Chioma Eze",
    amount: "₦10,000",
    status: "success",
    gateway: "Paystack",
    ref: "PSH-8X2K9",
    for: "Python for Data Science",
  },
  {
    id: "p2",
    date: "Apr 10, 2025",
    user: "Ngozi Adeyemi",
    amount: "₦10,000",
    status: "success",
    gateway: "Paystack",
    ref: "PSH-7M4L8",
    for: "Python for Data Science (Kunle)",
  },
  {
    id: "p3",
    date: "Apr 8, 2025",
    user: "Emeka Nwosu",
    amount: "₦5,000",
    status: "success",
    gateway: "Flutterwave",
    ref: "FLW-3P7Q1",
    for: "Backend Engineering 101",
  },
  {
    id: "p4",
    date: "Apr 5, 2025",
    user: "Tunde Balogun",
    amount: "₦15,000",
    status: "failed",
    gateway: "Paystack",
    ref: "PSH-2N6R5",
    for: "Advanced TypeScript",
  },
  {
    id: "p5",
    date: "Apr 1, 2025",
    user: "Ngozi Adeyemi",
    amount: "₦8,000",
    status: "success",
    gateway: "Flutterwave",
    ref: "FLW-9J4K2",
    for: "CSS Mastery (Temi)",
  },
];

function AdminPaymentsPage() {
  const sp = useSearchParams();
  const role = (sp.get("role") as Role) || "admin";
  const [payments] = useState(ALL_PAYMENTS);
  const [detailId, setDetailId] = useState<string | null>(null);

  const detail = payments.find((p) => p.id === detailId);

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-5 min-w-0">
        <div>
          <h1 className="text-2xl font-bold">All Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor all platform transactions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Revenue", value: "₦48,000" },
            { label: "Today", value: "₦10,000" },
            { label: "This Month", value: "₦48,000" },
            { label: "Failed", value: "₦15,000" },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold tabular-nums mt-0.5">{s.value}</p>
            </Card>
          ))}
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">For</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">
                    Gateway
                  </th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {p.date}
                    </td>
                    <td className="px-4 py-3 text-xs">{p.user}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[120px] truncate">
                      {p.for}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                      {p.amount}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={cn(
                          "rounded-full text-[10px] px-2 py-0 h-5",
                          p.status === "success"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700",
                        )}
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {p.gateway} · {p.ref}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full h-7 text-[10px]"
                          onClick={() => setDetailId(p.id)}
                        >
                          Detail
                        </Button>
                        {p.status === "success" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full h-7 text-[10px] text-amber-600"
                          >
                            Refund
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Detail modal */}
      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setDetailId(null)}
        >
          <div
            className="bg-background rounded-2xl p-6 max-w-sm mx-4 shadow-xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold">Payment Detail</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-medium font-mono text-xs">
                  {detail.ref}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gateway</span>
                <span>{detail.gateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold">{detail.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  className={cn(
                    "rounded-full text-[10px] px-2 py-0 h-5",
                    detail.status === "success"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700",
                  )}
                >
                  {detail.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User</span>
                <span>{detail.user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Course</span>
                <span>{detail.for}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{detail.date}</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-full w-full mt-4"
              onClick={() => setDetailId(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function Wrapper() {
  return (
    <Suspense
      fallback={
        <div className="p-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      }
    >
      <AdminPaymentsPage />
    </Suspense>
  );
}
