"use client";

import {
  Building02Icon,
  Cancel01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { DashboardLayout } from "@/components/app-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Role = "instructor" | "student" | "parent" | "admin";

const ALL_COMMUNITIES = [
  {
    id: "c1",
    name: "Frontend Devs",
    owner: "Ade Okafor",
    status: "active",
    visibility: "public",
    members: 1248,
    courses: 6,
    revenue: "₦1.2M",
    created: "Jan 2024",
  },
  {
    id: "c2",
    name: "Data Science Lab",
    owner: "Fatima Bello",
    status: "active",
    visibility: "public",
    members: 892,
    courses: 4,
    revenue: "₦450K",
    created: "Nov 2024",
  },
  {
    id: "c3",
    name: "UI/UX Hub",
    owner: "Ade Okafor",
    status: "active",
    visibility: "private",
    members: 456,
    courses: 3,
    revenue: "₦320K",
    created: "Mar 2024",
  },
  {
    id: "c4",
    name: "Backend Gurus",
    owner: "Ibrahim Musa",
    status: "flagged",
    visibility: "public",
    members: 234,
    courses: 1,
    revenue: "₦85K",
    created: "Dec 2024",
  },
  {
    id: "c5",
    name: "Math Tutorials NG",
    owner: "Ngozi Adeyemi",
    status: "archived",
    visibility: "invite-only",
    members: 89,
    courses: 2,
    revenue: "₦45K",
    created: "Sep 2024",
  },
];

function AdminCommunitiesPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const role = (sp.get("role") as Role) || "admin";
  const [search, setSearch] = useState("");
  const [communities, setCommunities] = useState(ALL_COMMUNITIES);
  const [confirmArchive, setConfirmArchive] = useState<string | null>(null);

  const filtered = communities.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.owner.toLowerCase().includes(search.toLowerCase()),
  );

  const handleArchive = (id: string) => {
    setCommunities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "archived" } : c)),
    );
    setConfirmArchive(null);
  };

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-5 min-w-0">
        <div>
          <h1 className="text-2xl font-bold">Communities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Oversight for all platform communities
          </p>
        </div>

        <div className="relative max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="pl-9 rounded-full text-sm"
          />
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                  <th className="text-left px-4 py-3">Community</th>
                  <th className="text-left px-4 py-3">Owner</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 hidden md:table-cell">
                    Members
                  </th>
                  <th className="text-right px-4 py-3 hidden md:table-cell">
                    Courses
                  </th>
                  <th className="text-right px-4 py-3 hidden lg:table-cell">
                    Revenue
                  </th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <HugeiconsIcon
                            icon={Building02Icon}
                            size={14}
                            className="text-muted-foreground"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {c.visibility}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{c.owner}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge
                        className={cn(
                          "rounded-full text-[10px] px-2 py-0 h-5",
                          c.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : c.status === "flagged"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-muted-foreground/10 text-muted-foreground",
                        )}
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums hidden md:table-cell">
                      {c.members.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums hidden md:table-cell">
                      {c.courses}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium hidden lg:table-cell">
                      {c.revenue}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full h-7 text-[10px]"
                          onClick={() =>
                            router.push(
                              `/dashboard/explore/communities/${c.name.toLowerCase().replace(/\s/g, "-")}?role=admin`,
                            )
                          }
                        >
                          View
                        </Button>
                        {c.status !== "archived" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full h-7 text-[10px] text-destructive"
                            onClick={() => setConfirmArchive(c.id)}
                          >
                            Archive
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

      {confirmArchive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setConfirmArchive(null)}
        >
          <div
            className="bg-background rounded-2xl p-6 max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold">Force Archive Community</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">
              This will take down the community. Existing members retain access
              but no new members can join.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setConfirmArchive(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="rounded-full"
                onClick={() => handleArchive(confirmArchive!)}
              >
                Archive
              </Button>
            </div>
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
      <AdminCommunitiesPage />
    </Suspense>
  );
}
