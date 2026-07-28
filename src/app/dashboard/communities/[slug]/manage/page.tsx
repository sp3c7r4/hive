"use client";

import { Suspense, useState, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  UserGroupIcon,
  Settings01Icon,
  ChartBarLineIcon,
  LayoutGridIcon,
  CourseIcon,
  Megaphone01Icon,
  HeartIcon,
  Comment01Icon,
  Add01Icon,
  Search02Icon,
  Copy01Icon,
  Camera01Icon,
  PinIcon,
  Cancel01Icon,
  Image01Icon,
  Delete01Icon,
  Mail01Icon,
  Globe02Icon,
  LockIcon,
  MoreHorizontalIcon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
  BookOpen01Icon,
} from "@hugeicons/core-free-icons";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/* ---------------------------------------------------------------- */
/*  Types & demo data                                               */
/* ---------------------------------------------------------------- */

type Role = "instructor" | "student" | "parent" | "admin";
type Tab = "overview" | "members" | "analytics" | "courses" | "feed" | "settings";
type Visibility = "public" | "private" | "invite-only";

type Member = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: "owner" | "admin" | "member" | "guest";
  status: "active" | "blocked";
  joinedDate: string;
};

type PendingMember = {
  id: string;
  name: string;
  initials: string;
  email: string;
  requestedDate: string;
};

type Invite = {
  id: string;
  email: string;
  status: "pending" | "accepted" | "expired";
  sentDate: string;
};

const COMMUNITY = {
  name: "Frontend Devs",
  slug: "frontend-devs",
  description: "A community for frontend developers to share tips, tricks, and best practices.",
  category: "Development",
  visibility: "public" as Visibility,
  requireApproval: false,
  isPaid: false,
  price: "",
  memberCount: 1248,
  createdAt: "Jan 15, 2025",
};

const MEMBERS: Member[] = [
  { id: "1", name: "Ade Okafor", initials: "AO", email: "ade@hive.ng", role: "owner", status: "active", joinedDate: "Jan 15, 2025" },
  { id: "2", name: "Chioma Nwosu", initials: "CN", email: "chioma@hive.ng", role: "admin", status: "active", joinedDate: "Jan 18, 2025" },
  { id: "3", name: "Kelechi Okonkwo", initials: "KO", email: "kelechi@hive.ng", role: "member", status: "active", joinedDate: "Jan 22, 2025" },
  { id: "4", name: "Amara Obi", initials: "AO", email: "amara@hive.ng", role: "member", status: "active", joinedDate: "Feb 1, 2025" },
  { id: "5", name: "Tunde Balogun", initials: "TB", email: "tunde@hive.ng", role: "member", status: "active", joinedDate: "Feb 3, 2025" },
  { id: "6", name: "Ifeanyi Eze", initials: "IE", email: "ifeanyi@hive.ng", role: "member", status: "active", joinedDate: "Feb 10, 2025" },
  { id: "7", name: "Ngozi Adebayo", initials: "NA", email: "ngozi@hive.ng", role: "member", status: "blocked", joinedDate: "Feb 12, 2025" },
  { id: "8", name: "Emeka Udoh", initials: "EU", email: "emeka@hive.ng", role: "guest", status: "active", joinedDate: "Feb 20, 2025" },
];

const PENDING: PendingMember[] = [
  { id: "p1", name: "Funke Alabi", initials: "FA", email: "funke@hive.ng", requestedDate: "2 days ago" },
  { id: "p2", name: "David Ogun", initials: "DO", email: "david@hive.ng", requestedDate: "3 days ago" },
];

const INVITES: Invite[] = [
  { id: "i1", email: "segun@email.com", status: "pending", sentDate: "1h ago" },
  { id: "i2", email: "bimpe@email.com", status: "accepted", sentDate: "2d ago" },
  { id: "i3", email: "chuka@email.com", status: "expired", sentDate: "8d ago" },
];

const GROWTH_DATA = [
  { month: "Jan", members: 180 }, { month: "Feb", members: 320 },
  { month: "Mar", members: 510 }, { month: "Apr", members: 690 },
  { month: "May", members: 880 }, { month: "Jun", members: 1050 },
  { month: "Jul", members: 1248 },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 0 }, { month: "Feb", revenue: 0 },
  { month: "Mar", revenue: 45000 }, { month: "Apr", revenue: 72000 },
  { month: "May", revenue: 95000 }, { month: "Jun", revenue: 120000 },
  { month: "Jul", revenue: 156000 },
];

const TABS: { key: Tab; label: string; icon: typeof LayoutGridIcon }[] = [
  { key: "overview", label: "Overview", icon: LayoutGridIcon },
  { key: "members", label: "Members", icon: UserGroupIcon },
  { key: "analytics", label: "Analytics", icon: ChartBarLineIcon },
  { key: "courses", label: "Courses", icon: CourseIcon },
  { key: "feed", label: "Feed", icon: Comment01Icon },
  { key: "settings", label: "Settings", icon: Settings01Icon },
];

const VISIBILITY_OPTIONS = [
  { value: "public" as const, label: "Public", desc: "Anyone can find and join" },
  { value: "private" as const, label: "Private", desc: "Only invited people can join" },
  { value: "invite-only" as const, label: "Invite Only", desc: "Members invite others" },
];

const CATEGORIES = ["Design", "Development", "Data Science", "Business", "Marketing", "Product", "Writing", "Photography", "Music", "Other"];

/* ---------------------------------------------------------------- */
/*  Helpers                                                         */
/* ---------------------------------------------------------------- */

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function formatPriceInput(v: string) {
  const digits = v.replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function roleBadge(role: Member["role"]) {
  const map = { owner: "bg-foreground text-background", admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", member: "bg-muted text-muted-foreground", guest: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
  return map[role];
}

/* ---------------------------------------------------------------- */
/*  Members tab                                                     */
/* ---------------------------------------------------------------- */

function MembersTab() {
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState(MEMBERS);
  const [pending, setPending] = useState(PENDING);
  const [invites, setInvites] = useState(INVITES);
  const [inviteInput, setInviteInput] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{ type: string; id: string; name: string } | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return members;
    const q = query.toLowerCase();
    return members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.role.toLowerCase().includes(q));
  }, [members, query]);

  const handleRoleChange = (id: string, newRole: Member["role"]) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
  };

  const handleBlockToggle = (id: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: m.status === "active" ? "blocked" : "active" } : m)));
  };

  const handleRemove = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setConfirmDialog(null);
  };

  const handleApprove = (id: string) => {
    const p = pending.find((x) => x.id === id);
    if (!p) return;
    setMembers((prev) => [...prev, { id: `m${Date.now()}`, name: p.name, initials: p.initials, email: p.email, role: "member", status: "active", joinedDate: "Just now" }]);
    setPending((prev) => prev.filter((x) => x.id !== id));
  };

  const handleReject = (id: string) => setPending((prev) => prev.filter((x) => x.id !== id));

  const handleInvite = () => {
    if (!inviteInput.trim()) return;
    setInvites((prev) => [{ id: `i${Date.now()}`, email: inviteInput.trim(), status: "pending", sentDate: "Just now" }, ...prev]);
    setInviteInput("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search + invite count */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Input placeholder="Search members..." value={query} onChange={(e) => setQuery(e.target.value)} className="rounded-full max-w-sm" />
        <Badge variant="secondary" className="rounded-full shrink-0">{members.length} member{members.length !== 1 && "s"}</Badge>
      </div>

      {/* Pending approvals */}
      {pending.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-3">Pending Approvals ({pending.length})</h3>
          <div className="flex flex-col gap-2">
            {pending.map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-9 shrink-0"><AvatarFallback>{p.initials}</AvatarFallback></Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.email} · Requested {p.requestedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" className="rounded-full" onClick={() => handleApprove(p.id)}>Approve</Button>
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => handleReject(p.id)}>Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Member list */}
      <Card className="overflow-hidden">
        <div className="divide-y">
          {filtered.map((m) => (
            <div key={m.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="size-9 shrink-0"><AvatarFallback>{m.initials}</AvatarFallback></Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <Badge className={`rounded-full text-[10px] px-1.5 py-0 h-4 font-medium ${roleBadge(m.role)}`}>{m.role}</Badge>
                    {m.status === "blocked" && <Badge variant="destructive" className="rounded-full text-[10px] px-1.5 py-0 h-4">Blocked</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{m.email} · Joined {m.joinedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-12 sm:ml-0">
                <select
                  value={m.role}
                  onChange={(e) => handleRoleChange(m.id, e.target.value as Member["role"])}
                  className="text-[11px] rounded-full border bg-background px-2.5 py-1 outline-none"
                >
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="guest">Guest</option>
                </select>
                <Button size="sm" variant="ghost" className="rounded-full text-xs" onClick={() => handleBlockToggle(m.id)}>
                  {m.status === "active" ? "Block" : "Unblock"}
                </Button>
                <Button size="sm" variant="ghost" className="rounded-full text-xs text-destructive" onClick={() => setConfirmDialog({ type: "remove", id: m.id, name: m.name })}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Invites */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold mb-3">Invite Members</h3>
        <div className="flex items-center gap-2 mb-4">
          <Input placeholder="Enter email address..." value={inviteInput} onChange={(e) => setInviteInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleInvite(); }} className="rounded-full flex-1" />
          <Button size="sm" className="rounded-full" onClick={handleInvite}>Send Invite</Button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Input value={`https://hive.ng/c/${COMMUNITY.slug}/join`} readOnly className="rounded-full text-xs bg-muted/40 flex-1" />
          <Button size="icon" variant="outline" className="size-9 rounded-full shrink-0" onClick={() => navigator.clipboard.writeText(`https://hive.ng/c/${COMMUNITY.slug}/join`)}>
            <HugeiconsIcon icon={Copy01Icon} size={15} />
          </Button>
        </div>
        {invites.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-medium text-muted-foreground">Sent Invites</p>
            {invites.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-muted/40">
                <span className="truncate">{inv.email}</span>
                <Badge variant="secondary" className={`rounded-full text-[10px] px-1.5 py-0 h-4 ${inv.status === "accepted" ? "bg-emerald-100 text-emerald-700" : inv.status === "expired" ? "bg-muted text-muted-foreground" : ""}`}>
                  {inv.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Confirm dialog */}
      <Dialog open={confirmDialog !== null} onOpenChange={() => setConfirmDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Remove member</DialogTitle><DialogDescription>Remove {confirmDialog?.name} from this community? They can be re-invited later.</DialogDescription></DialogHeader>
          <DialogFooter className="gap-2"><Button variant="outline" className="rounded-full" onClick={() => setConfirmDialog(null)}>Cancel</Button><Button variant="destructive" className="rounded-full" onClick={() => confirmDialog && handleRemove(confirmDialog.id)}>Remove</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Analytics tab                                                   */
/* ---------------------------------------------------------------- */

function AnalyticsTab() {
  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Members", value: "1,248", sub: "+48 this month" },
          { label: "Active (7d)", value: "342", sub: "27% of total" },
          { label: "Courses Enrolled", value: "8", sub: "Across 3 courses" },
          { label: "Revenue", value: "₦156,000", sub: "This month" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-[11px] text-muted-foreground mb-1">{s.label}</p>
            <p className="text-xl font-bold tabular-nums">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Growth chart */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold mb-4">Member Growth</h3>
        <div className="h-[200px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={GROWTH_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={40} />
              <Line type="monotone" dataKey="members" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--chart-1)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Revenue chart */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold mb-4">Revenue (₦)</h3>
        <div className="h-[180px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={50} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
              <Bar dataKey="revenue" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Settings tab                                                    */
/* ---------------------------------------------------------------- */

function SettingsTab() {
  const [form, setForm] = useState({
    name: COMMUNITY.name,
    slug: COMMUNITY.slug,
    description: COMMUNITY.description,
    category: COMMUNITY.category,
    visibility: COMMUNITY.visibility,
    requireApproval: COMMUNITY.requireApproval,
    isPaid: COMMUNITY.isPaid,
    price: COMMUNITY.price,
    sequentialCourses: false,
    allowDownloads: true,
    maxDevices: "3",
    gracePeriod: "7",
  });
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = useCallback(<K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((p) => ({ ...p, [k]: v })), []);

  const handleName = (v: string) => setForm((p) => ({ ...p, name: v, slug: p.slug === slugify(p.name) || !p.slug ? slugify(v) : p.slug }));

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Basic info */}
      <Card className="p-5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold">Basic Information</h3>
        <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Community Name</Label><Input value={form.name} onChange={(e) => handleName(e.target.value)} className="rounded-xl" /></div>
        <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Slug</Label><div className="flex items-center rounded-xl border bg-muted/40 px-3 py-2 gap-1.5 text-sm"><span className="text-muted-foreground shrink-0">hive.ng/c/</span><input value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} className="flex-1 bg-transparent outline-none min-w-0" /></div></div>
        <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Description</Label><Textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="rounded-xl min-h-[80px]" /></div>
        <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Category</Label><select value={form.category} onChange={(e) => update("category", e.target.value)} className="rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"><option value="" disabled>Select</option>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
        <div>
          <Label className="text-xs font-medium mb-2 block">Cover Image</Label>
          {coverPreview ? (
            <div className="relative rounded-xl overflow-hidden aspect-[3/1] bg-muted group">
              <Image src={coverPreview} alt="" fill className="object-cover" />
              <button type="button" onClick={() => { URL.revokeObjectURL(coverPreview); setCoverPreview(null); }} className="absolute top-3 right-3 size-8 rounded-full bg-background/80 hover:bg-background flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><HugeiconsIcon icon={Cancel01Icon} size={16} /></button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} className="w-full rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/30 transition-colors aspect-[3/1] flex flex-col items-center justify-center gap-2 bg-muted/30"><div className="size-10 rounded-full bg-muted flex items-center justify-center"><HugeiconsIcon icon={Image01Icon} size={20} className="text-muted-foreground" /></div><p className="text-sm font-medium">Upload cover image</p></button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setCoverPreview(URL.createObjectURL(f)); }} className="hidden" />
        </div>
      </Card>

      {/* Visibility & Access */}
      <Card className="p-5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold">Visibility &amp; Access</h3>
        <div className="flex flex-wrap gap-2">
          {VISIBILITY_OPTIONS.map((opt) => (
            <button key={opt.value} type="button" onClick={() => update("visibility", opt.value)} className={`flex-1 min-w-[140px] rounded-xl border-2 px-4 py-3 text-left transition-colors ${form.visibility === opt.value ? "border-foreground bg-muted/40" : "border-border hover:border-muted-foreground/30"}`}>
              <p className="text-sm font-medium">{opt.label}</p><p className="text-[11px] text-muted-foreground mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
        <Separator />
        <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Require Approval</p><p className="text-xs text-muted-foreground">New members must be approved before joining</p></div><Switch checked={form.requireApproval} onCheckedChange={(v) => update("requireApproval", v)} /></div>
        <Separator />
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Paid Community</p><p className="text-xs text-muted-foreground">Charge a monthly fee for membership</p></div><Switch checked={form.isPaid} onCheckedChange={(v) => update("isPaid", v)} /></div>
          {form.isPaid && (
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
              <Label className="text-xs font-medium">Monthly Price (₦)</Label>
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">₦</span><Input value={form.price} onChange={(e) => update("price", formatPriceInput(e.target.value))} placeholder="2,500" className="rounded-xl pl-8" /></div>
            </div>
          )}
        </div>
      </Card>

      {/* Advanced */}
      <Card className="p-5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold">Advanced</h3>
        <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Sequential Courses</p><p className="text-xs text-muted-foreground">Courses must be completed in order</p></div><Switch checked={form.sequentialCourses} onCheckedChange={(v) => update("sequentialCourses", v)} /></div>
        <Separator />
        <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Allow Downloads</p><p className="text-xs text-muted-foreground">Members can download course materials</p></div><Switch checked={form.allowDownloads} onCheckedChange={(v) => update("allowDownloads", v)} /></div>
        <Separator />
        <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Max Concurrent Devices</Label><Input type="number" value={form.maxDevices} onChange={(e) => update("maxDevices", e.target.value)} className="rounded-xl max-w-[120px]" /></div>
        <Separator />
        <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Grace Period (days)</Label><Input type="number" value={form.gracePeriod} onChange={(e) => update("gracePeriod", e.target.value)} className="rounded-xl max-w-[120px]" /><p className="text-[10px] text-muted-foreground">Days before late payment triggers suspension</p></div>
      </Card>

      {/* Save */}
      <Button className="rounded-full w-full sm:w-auto">Save Changes</Button>

      {/* Danger Zone */}
      <Card className="p-5 border-destructive/30">
        <h3 className="text-sm font-semibold text-destructive mb-3">Danger Zone</h3>
        <p className="text-xs text-muted-foreground mb-3">Archiving will hide this community from non-members. Existing members will retain access.</p>
        <Button variant="destructive" className="rounded-full" onClick={() => setArchiveOpen(true)}>Archive Community</Button>
      </Card>

      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>Archive Community</DialogTitle><DialogDescription>This will hide "{form.name}" from non-members. Existing members keep access. This can be reversed from settings.</DialogDescription></DialogHeader><DialogFooter className="gap-2"><Button variant="outline" className="rounded-full" onClick={() => setArchiveOpen(false)}>Cancel</Button><Button variant="destructive" className="rounded-full" onClick={() => setArchiveOpen(false)}>Archive</Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Courses tab (community context)                                  */
/* ---------------------------------------------------------------- */

const COMMUNITY_COURSES = [
  { id: "1", title: "React for Designers", category: "Development", difficulty: "beginner" as const, status: "published" as const, enrollmentCount: 342, isFree: true },
  { id: "2", title: "UI/UX Research Methods", category: "Design", difficulty: "intermediate" as const, status: "draft" as const, enrollmentCount: 0, isFree: true },
];

function CommunityCoursesTab() {
  const router = useRouter();
  const params = useParams();
  const role = (useSearchParams().get("role") as Role) || "instructor";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Courses ({COMMUNITY_COURSES.length})</h3>
        <Button size="sm" className="rounded-full"
          render={<Link href={`/dashboard/courses/create?role=${role}&community=Frontend+Devs`}><HugeiconsIcon icon={Add01Icon} size={14} className="mr-1" />Create Course</Link>}
        />
      </div>

      {COMMUNITY_COURSES.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <HugeiconsIcon icon={BookOpen01Icon} size={32} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No courses in this community yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COMMUNITY_COURSES.map((c) => (
            <Link key={c.id} href={`/dashboard/courses/${c.id}/manage?role=${role}`}>
              <Card className="p-4 hover:bg-muted/40 transition-colors flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`rounded-full text-[10px] px-2 py-0 h-5 ${c.difficulty === "beginner" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{c.difficulty}</Badge>
                    {c.status === "draft" && <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0 h-5">Draft</Badge>}
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0 h-5">{c.category}</Badge>
                </div>
                <p className="text-sm font-semibold">{c.title}</p>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-auto pt-2 border-t">
                  <HugeiconsIcon icon={UserGroupIcon} size={12} />{c.enrollmentCount} enrolled · {c.isFree ? "Free" : "Paid"}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Feed tab                                                        */
/* ---------------------------------------------------------------- */

type PostType = "post" | "announcement";
type Post = { id: string; author: string; initials: string; role: string; content: string; type: PostType; likes: number; liked: boolean; comments: { author: string; initials: string; text: string; time: string }[]; time: string; pinned: boolean; showComments: boolean };

const MOCK_POSTS: Post[] = [
  { id:"p1", author:"Ade Okafor", initials:"AO", role:"Owner", content:"Welcome to Frontend Devs! 🚀 This is our community space for sharing tips, asking questions, and showcasing your work. Please read the pinned guidelines before posting.", type:"announcement", likes:24, liked:false, comments:[{ author:"Chioma Nwosu", initials:"CN", text:"Excited to be here! Looking forward to learning from everyone.", time:"1h ago" }], time:"3d ago", pinned:true, showComments:false },
  { id:"p2", author:"Kelechi Okonkwo", initials:"KO", role:"Member", content:"Just shipped a new React component library! It includes accessible form controls, a flexible grid system, and dark mode support out of the box. Would love feedback from the community.\n\nCheck it out: github.com/kelechi/react-ui", type:"post", likes:18, liked:true, comments:[], time:"2h ago", pinned:false, showComments:false },
  { id:"p3", author:"Amara Obi", initials:"AO", role:"Member", content:"Has anyone worked with the new View Transitions API? I'm building a page transition system and it feels like magic. Would love to compare notes.", type:"post", likes:7, liked:false, comments:[{ author:"Tunde Balogun", initials:"TB", text:"Yes! Used it on my portfolio. The cross-fade between pages is buttery smooth.", time:"30m ago" }], time:"5h ago", pinned:false, showComments:false },
  { id:"p4", author:"Ade Okafor", initials:"AO", role:"Owner", content:"📢 Community update: We've reached 1,200 members! To celebrate, I'm hosting a live code review session this Friday at 6pm WAT. Bring your projects — I'll review as many as I can in 90 minutes.\n\nThe session will be recorded for those who can't make it live.", type:"announcement", likes:42, liked:false, comments:[{ author:"Chioma Nwosu", initials:"CN", text:"Amazing! Can't wait.", time:"3h ago" },{ author:"Ifeanyi Eze", initials:"IE", text:"I'll be there!", time:"2h ago" }], time:"1d ago", pinned:false, showComments:false },
];

function FeedTab() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeType, setComposeType] = useState<PostType>("post");
  const [composeText, setComposeText] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [commentFor, setCommentFor] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const addPost = () => { if (!composeText.trim()) return; setPosts((p) => [{ id:`p${Date.now()}`, author:"You", initials:"YO", role:"Owner", content:composeText, type:composeType, likes:0, liked:false, comments:[], time:"Just now", pinned:false, showComments:false }, ...p]); setComposeText(""); setComposeOpen(false); setComposeType("post"); };
  const toggleLike = (id: string) => setPosts((p) => p.map((x) => x.id===id ? { ...x, likes:x.liked?x.likes-1:x.likes+1, liked:!x.liked } : x));
  const toggleComments = (id: string) => setPosts((p) => p.map((x) => x.id===id ? { ...x, showComments:!x.showComments } : x));
  const addComment = (postId: string) => { if (!commentText.trim()) return; setPosts((p) => p.map((x) => x.id===postId ? { ...x, comments:[...x.comments, { author:"You", initials:"YO", text:commentText, time:"Just now" }], showComments:true } : x)); setCommentText(""); setCommentFor(null); };
  const togglePin = (id: string) => setPosts((p) => p.map((x) => x.id===id ? { ...x, pinned:!x.pinned } : x));
  const deletePost = (id: string) => setPosts((p) => p.filter((x) => x.id!==id));
  const startEdit = (id: string, content: string) => { setEditId(id); setEditText(content); };
  const saveEdit = () => { if (!editId||!editText.trim()) return; setPosts((p) => p.map((x) => x.id===editId ? { ...x, content:editText } : x)); setEditId(null); };

  const sorted = [...posts].sort((a,b) => { if(a.pinned!==b.pinned) return a.pinned?-1:1; return 0; });

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Compose */}
      {!composeOpen ? (
        <button onClick={() => setComposeOpen(true)} className="w-full rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/30 p-4 flex items-center gap-3 bg-muted/20 text-left transition-colors">
          <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0"><HugeiconsIcon icon={Add01Icon} size={18} className="text-muted-foreground" /></div>
          <span className="text-sm text-muted-foreground">Create a post or announcement...</span>
        </button>
      ) : (
        <Card className="p-4 flex flex-col gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            {([{ v:"post" as const, l:"Post" },{ v:"announcement" as const, l:"Announcement" }] as const).map((o) => (
              <button key={o.v} onClick={() => setComposeType(o.v)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${composeType===o.v?"border-foreground bg-muted font-medium":"border-border hover:border-muted-foreground/30"}`}>
                <HugeiconsIcon icon={o.v==="announcement"?Megaphone01Icon:Comment01Icon} size={12} />{o.l}
              </button>
            ))}
          </div>
          <Textarea value={composeText} onChange={(e) => setComposeText(e.target.value)} placeholder="What's on your mind?" className="rounded-xl min-h-[80px] resize-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">{composeText.length}/2000</span>
            <div className="flex items-center gap-2"><Button size="sm" variant="ghost" className="rounded-full h-8 text-xs" onClick={() => { setComposeOpen(false); setComposeText(""); }}>Cancel</Button><Button size="sm" className="rounded-full h-8 text-xs" onClick={addPost} disabled={!composeText.trim()}>Post</Button></div>
          </div>
        </Card>
      )}

      {/* Posts */}
      {sorted.map((post) => (
        <Card key={post.id} className={`p-5 ${post.type==="announcement"?"border-primary/30 bg-primary/5 ring-1 ring-primary/20":""}`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-9 shrink-0"><AvatarFallback className="text-xs">{post.initials}</AvatarFallback></Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{post.author}</p>
                  <Badge className="rounded-full text-[9px] px-1.5 py-0 h-4">{post.role}</Badge>
                  {post.type==="announcement" && <Badge className="rounded-full text-[9px] px-1.5 py-0 h-4 bg-amber-100 text-amber-700"><HugeiconsIcon icon={Megaphone01Icon} size={10} className="mr-0.5"/>Announcement</Badge>}
                </div>
                <p className="text-[10px] text-muted-foreground">{post.time}{post.pinned?" · Pinned":""}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => togglePin(post.id)} className="size-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><HugeiconsIcon icon={PinIcon} size={14} className={post.pinned?"text-primary":""}/></button>
              <button onClick={() => startEdit(post.id, post.content)} className="size-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"><HugeiconsIcon icon={MoreHorizontalIcon} size={14}/></button>
            </div>
          </div>

          {/* Content */}
          {editId===post.id ? (
            <div className="flex flex-col gap-2 mb-3"><Textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="rounded-xl text-sm min-h-[60px]" /><div className="flex items-center gap-2"><Button size="sm" className="rounded-full h-7 text-xs" onClick={saveEdit}>Save</Button><Button size="sm" variant="ghost" className="rounded-full h-7 text-xs" onClick={()=>setEditId(null)}>Cancel</Button><Button size="sm" variant="ghost" className="rounded-full h-7 text-xs text-destructive" onClick={()=>{deletePost(post.id);setEditId(null);}}>Delete</Button></div></div>
          ) : (
            <p className="text-sm whitespace-pre-wrap mb-4">{post.content}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 border-t pt-3">
            <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors ${post.liked?"bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400":"text-muted-foreground hover:bg-muted"}`}>
              <HugeiconsIcon icon={HeartIcon} size={14} className={post.liked?"fill-rose-500":""}/>{post.likes>0&&post.likes}
            </button>
            <button onClick={() => { toggleComments(post.id); setCommentFor(post.id); }} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors">
              <HugeiconsIcon icon={Comment01Icon} size={14}/>{post.comments.length>0&&post.comments.length}
            </button>
          </div>

          {/* Comments */}
          {post.showComments && (
            <div className="border-t mt-3 pt-3 flex flex-col gap-3 animate-in fade-in">
              {post.comments.map((c,i) => (
                <div key={i} className="flex items-start gap-2">
                  <Avatar className="size-6 shrink-0"><AvatarFallback className="text-[9px]">{c.initials}</AvatarFallback></Avatar>
                  <div className="bg-muted/60 rounded-xl px-3 py-2 flex-1"><p className="text-xs font-medium">{c.author}</p><p className="text-xs">{c.text}</p><p className="text-[9px] text-muted-foreground mt-0.5">{c.time}</p></div>
                </div>
              ))}
              {commentFor===post.id && (
                <div className="flex items-center gap-2"><Input placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => { if (e.key==="Enter") addComment(post.id); }} className="rounded-full h-9 text-sm flex-1" /><Button size="sm" className="rounded-full h-9 text-xs" onClick={() => addComment(post.id)}>Send</Button></div>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Manage Community Page                                           */
/* ---------------------------------------------------------------- */

function ManageCommunityPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const role = (searchParams.get("role") as Role) || "instructor";
  const slug = params?.slug as string;
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 min-w-0">
        {/* Header */}
        <div>
          <button type="button" onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
            <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />Back to Communities
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight">{COMMUNITY.name}</h1>
              <p className="text-sm text-muted-foreground">hive.ng/c/{slug}</p>
            </div>
            <Badge variant="secondary" className="rounded-full w-fit"><HugeiconsIcon icon={UserGroupIcon} size={13} className="mr-1" />{COMMUNITY.memberCount.toLocaleString()} members</Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
          <div className="flex items-center gap-1 w-max">
            {TABS.map(({ key, label, icon }) => (
              <button key={key} type="button" onClick={() => setTab(key)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${tab === key ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                <HugeiconsIcon icon={icon} size={13} />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {tab === "overview" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[{ label: "Members", value: "1,248", icon: UserGroupIcon }, { label: "Active (7d)", value: "342", icon: ChartBarLineIcon }, { label: "Revenue (mo)", value: "₦156,000", icon: Add01Icon }, { label: "Courses", value: "8", icon: LayoutGridIcon }].map((s) => (
                <Card key={s.label} className="p-4"><HugeiconsIcon icon={s.icon} size={16} className="text-muted-foreground mb-2" /><p className="text-xl font-bold tabular-nums">{s.value}</p><p className="text-[11px] text-muted-foreground">{s.label}</p></Card>
              ))}
            </div>
            <Card className="p-5"><h3 className="text-sm font-semibold mb-2">About</h3><p className="text-sm text-muted-foreground">{COMMUNITY.description}</p><div className="flex flex-wrap gap-2 mt-3"><Badge variant="secondary" className="rounded-full">{COMMUNITY.category}</Badge><Badge variant="secondary" className="rounded-full">{COMMUNITY.visibility}</Badge>{COMMUNITY.isPaid && <Badge variant="secondary" className="rounded-full">Paid · ₦{COMMUNITY.price}/mo</Badge>}</div></Card>
          </div>
        )}
        {tab === "members" && <MembersTab />}
        {tab === "analytics" && <AnalyticsTab />}
        {tab === "courses" && <CommunityCoursesTab />}
        {tab === "feed" && <FeedTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </DashboardLayout>
  );
}

export default function Wrapper() {
  return <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-48 mb-4" /><div className="flex gap-2 mb-6">{[1,2,3,4].map(i=><Skeleton key={i} className="h-8 w-24 rounded-full"/>)}</div><div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i=><Skeleton key={i} className="h-24 rounded-xl"/>)}</div></div>}><ManageCommunityPage /></Suspense>;
}
