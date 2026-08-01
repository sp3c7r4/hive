"use client";

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  BankIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Download01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts";
import { DashboardLayout } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Role = "instructor" | "student" | "parent" | "admin";

/* ---- demo data ---- */

const STAT_CARDS = [
  {
    label: "Total Earnings",
    value: "₦1,200,000",
    sub: "All time",
    icon: Wallet01Icon,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    label: "Available Balance",
    value: "₦85,000",
    sub: "Ready to withdraw",
    icon: ArrowDown01Icon,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    label: "Pending Balance",
    value: "₦30,000",
    sub: "7-day waiting period",
    icon: Clock01Icon,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    label: "Withdrawn",
    value: "₦1,085,000",
    sub: "Lifetime total",
    icon: BankIcon,
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  },
];

const EARNINGS_HISTORY = [
  {
    id: "e1",
    date: "Apr 12, 2025",
    student: "Chioma Eze",
    course: "React for Designers",
    gross: "₦10,000",
    fee: "₦1,000",
    net: "₦9,000",
    status: "settled",
  },
  {
    id: "e2",
    date: "Apr 8, 2025",
    student: "Kelechi Okonkwo",
    course: "TypeScript Patterns",
    gross: "₦12,000",
    fee: "₦1,200",
    net: "₦10,800",
    status: "settled",
  },
  {
    id: "e3",
    date: "Apr 5, 2025",
    student: "Amara Obi",
    course: "UI/UX Hub",
    gross: "₦8,000",
    fee: "₦800",
    net: "₦7,200",
    status: "pending",
  },
  {
    id: "e4",
    date: "Mar 28, 2025",
    student: "Tunde Balogun",
    course: "CSS Mastery",
    gross: "₦8,000",
    fee: "₦800",
    net: "₦7,200",
    status: "settled",
  },
  {
    id: "e5",
    date: "Mar 20, 2025",
    student: "Ngozi Adeyemi",
    course: "Python Basics",
    gross: "₦10,000",
    fee: "₦1,000",
    net: "₦9,000",
    status: "settled",
  },
];

const WITHDRAWAL_HISTORY = [
  {
    id: "w1",
    date: "Apr 10, 2025",
    amount: "₦50,000",
    fee: "₦100",
    net: "₦49,900",
    bank: "GTBank — 0123456789",
    status: "processing",
    ref: "HIVE-W-001",
  },
  {
    id: "w2",
    date: "Mar 28, 2025",
    amount: "₦35,000",
    fee: "₦100",
    net: "₦34,900",
    bank: "GTBank — 0123456789",
    status: "completed",
    ref: "HIVE-W-002",
  },
  {
    id: "w3",
    date: "Mar 15, 2025",
    amount: "₦80,000",
    fee: "₦100",
    net: "₦79,900",
    bank: "GTBank — 0123456789",
    status: "completed",
    ref: "HIVE-W-003",
  },
];

/* chart data */
const REVENUE_TREND = [
  { month: "Jan", revenue: 180000 },
  { month: "Feb", revenue: 220000 },
  { month: "Mar", revenue: 280000 },
  { month: "Apr", revenue: 310000 },
  { month: "May", revenue: 260000 },
  { month: "Jun", revenue: 340000 },
  { month: "Jul", revenue: 400000 },
  { month: "Aug", revenue: 380000 },
  { month: "Sep", revenue: 450000 },
  { month: "Oct", revenue: 420000 },
  { month: "Nov", revenue: 500000 },
  { month: "Dec", revenue: 520000 },
];

const PER_COURSE = [
  {
    course: "React for Designers",
    earnings: 320000,
    enrollments: 42,
    completion: 78,
  },
  {
    course: "TypeScript Patterns",
    earnings: 280000,
    enrollments: 28,
    completion: 65,
  },
  { course: "CSS Mastery", earnings: 240000, enrollments: 35, completion: 82 },
  { course: "UI/UX Hub", earnings: 180000, enrollments: 22, completion: 71 },
];

const statusColors: Record<string, string> = {
  settled:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  processing:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  failed: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const chartConfig = {
  revenue: { label: "Revenue", color: "oklch(0.795 0.184 86.047)" },
} satisfies ChartConfig;

function EarningsPage() {
  const sp = useSearchParams();
  const role = (sp.get("role") as Role) || "instructor";
  const [tab, setTab] = useState("overview");
  const [period, setPeriod] = useState("1y");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showVerifyBank, setShowVerifyBank] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankVerified, setBankVerified] = useState(false);
  const [verifyStep, setVerifyStep] = useState<"form" | "done">("form");

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "history", label: "History" },
    { key: "analytics", label: "Analytics" },
    { key: "withdrawals", label: "Withdrawals" },
  ];

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-5 min-w-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">Earnings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your revenue and manage withdrawals
            </p>
          </div>
          <Button
            className="rounded-full text-sm"
            onClick={() => setShowWithdraw(true)}
          >
            <HugeiconsIcon icon={Wallet01Icon} size={16} className="mr-1.5" />
            Request Withdrawal
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STAT_CARDS.map((s) => (
            <Card key={s.label} className="p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className={cn(
                    "size-8 rounded-lg flex items-center justify-center shrink-0",
                    s.color,
                  )}
                >
                  <HugeiconsIcon icon={s.icon} size={14} />
                </div>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
              <p className="text-xl font-bold tabular-nums">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {s.sub}
              </p>
            </Card>
          ))}
        </div>

        {/* Platform fee note */}
        <Card className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50">
          <p className="text-xs text-amber-800 dark:text-amber-300">
            <strong>10% platform fee</strong> is deducted from every payment.
            Student pays ₦10,000 → You receive ₦9,000.
          </p>
        </Card>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "px-3.5 py-1.5 rounded-[10px] text-sm font-medium transition-colors",
                tab === t.key
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Revenue trend mini */}
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <h3 className="text-sm font-semibold">Revenue Trend</h3>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="h-7 w-[100px] rounded-full text-[10px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                    <SelectItem value="1y">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ChartContainer
                config={chartConfig}
                className="h-[200px] w-full !aspect-auto [&>div]:!p-0"
              >
                <AreaChart
                  data={REVENUE_TREND}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="oklch(0.795 0.184 86.047)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="oklch(0.795 0.184 86.047)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.795 0.184 86.047)"
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </Card>

            {/* Per-course breakdown */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4">
                Per-Course Breakdown
              </h3>
              <div className="space-y-3">
                {PER_COURSE.map((c) => (
                  <div key={c.course} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.course}</p>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                        <span>{c.enrollments} enrolled</span>
                        <span>{c.completion}% completion</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold tabular-nums shrink-0">
                      ₦{c.earnings.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* History tab */}
        {tab === "history" && (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Student</th>
                    <th className="text-left px-4 py-3 hidden sm:table-cell">
                      Course
                    </th>
                    <th className="text-right px-4 py-3">Gross</th>
                    <th className="text-right px-4 py-3 hidden md:table-cell">
                      Fee (10%)
                    </th>
                    <th className="text-right px-4 py-3">Net</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {EARNINGS_HISTORY.map((e) => (
                    <tr key={e.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {e.date}
                      </td>
                      <td className="px-4 py-3 text-xs">{e.student}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                        {e.course}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-xs">
                        {e.gross}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-xs text-muted-foreground hidden md:table-cell">
                        {e.fee}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-xs font-medium">
                        {e.net}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={cn(
                            "rounded-full text-[10px] px-2 py-0 h-5",
                            statusColors[e.status],
                          )}
                        >
                          {e.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Analytics tab */}
        {tab === "analytics" && (
          <div className="grid grid-cols-1 gap-5">
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <h3 className="text-sm font-semibold">Revenue Trend</h3>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="h-7 w-[100px] rounded-full text-[10px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                    <SelectItem value="1y">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ChartContainer
                config={chartConfig}
                className="h-[300px] w-full !aspect-auto [&>div]:!p-0"
              >
                <BarChart
                  data={REVENUE_TREND}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="revenue"
                    fill="oklch(0.795 0.184 86.047)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </Card>

            {/* Per-course analytics */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-4">
                Per-Course Analytics
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="text-left py-2">Course</th>
                      <th className="text-right py-2">Earnings</th>
                      <th className="text-right py-2">Enrollments</th>
                      <th className="text-right py-2">Completion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {PER_COURSE.map((c) => (
                      <tr key={c.course}>
                        <td className="py-2.5 text-sm font-medium">
                          {c.course}
                        </td>
                        <td className="py-2.5 text-right tabular-nums text-sm font-bold">
                          ₦{c.earnings.toLocaleString()}
                        </td>
                        <td className="py-2.5 text-right tabular-nums text-sm">
                          {c.enrollments}
                        </td>
                        <td className="py-2.5 text-right tabular-nums text-sm">
                          {c.completion}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Withdrawals tab */}
        {tab === "withdrawals" && (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-right px-4 py-3">Amount</th>
                    <th className="text-right px-4 py-3 hidden sm:table-cell">
                      Fee
                    </th>
                    <th className="text-right px-4 py-3">Net</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">
                      Bank
                    </th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {WITHDRAWAL_HISTORY.map((w) => (
                    <tr key={w.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {w.date}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-xs">
                        {w.amount}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-xs text-muted-foreground hidden sm:table-cell">
                        {w.fee}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-xs font-medium">
                        {w.net}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                        {w.bank}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={cn(
                            "rounded-full text-[10px] px-2 py-0 h-5",
                            statusColors[w.status],
                          )}
                        >
                          {w.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground hidden lg:table-cell">
                        {w.ref}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Withdraw Modal */}
      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent className="sm:max-w-[440px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Request Withdrawal</DialogTitle>
          </DialogHeader>
          {!bankVerified ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Verify your bank account before withdrawing.
              </p>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setShowWithdraw(false);
                  setShowVerifyBank(true);
                }}
              >
                <HugeiconsIcon icon={BankIcon} size={15} className="mr-1.5" />
                Verify Bank Account
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Available Balance
                </span>
                <span className="text-lg font-bold">₦85,000</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Amount (₦)</Label>
                <div className="relative">
                  <Input
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="rounded-full text-sm pr-20"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-7 text-[10px]"
                    onClick={() => setWithdrawAmount("85000")}
                  >
                    Withdraw all
                  </Button>
                </div>
              </div>
              <div className="rounded-xl bg-muted/50 p-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank</span>
                  <span>GTBank — 0123456789</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Name</span>
                  <span>Ade Okafor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span>₦100</span>
                </div>
              </div>
              <Button
                className="rounded-full w-full"
                disabled={!withdrawAmount}
              >
                Submit Withdrawal Request
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Verify Bank Modal */}
      <Dialog open={showVerifyBank} onOpenChange={setShowVerifyBank}>
        <DialogContent className="sm:max-w-[440px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Verify Bank Account</DialogTitle>
          </DialogHeader>
          {verifyStep === "form" ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Bank Name</Label>
                <Select>
                  <SelectTrigger className="rounded-full text-sm">
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gtb">GTBank</SelectItem>
                    <SelectItem value="access">Access Bank</SelectItem>
                    <SelectItem value="first">First Bank</SelectItem>
                    <SelectItem value="uba">UBA</SelectItem>
                    <SelectItem value="zenith">Zenith Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Account Number</Label>
                <Input
                  placeholder="0123456789"
                  className="rounded-full text-sm"
                />
              </div>
              <Button
                className="rounded-full"
                onClick={() => {
                  setVerifyStep("done");
                  setTimeout(() => {
                    setBankVerified(true);
                    setShowVerifyBank(false);
                    setVerifyStep("form");
                  }, 1500);
                }}
              >
                Verify Account
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={22}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </div>
              <h3 className="text-lg font-bold">Account Verified</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ade Okafor · GTBank
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default function Wrapper() {
  return (
    <Suspense
      fallback={
        <div className="p-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-32 rounded-xl mb-4" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      }
    >
      <EarningsPage />
    </Suspense>
  );
}
