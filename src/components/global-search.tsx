"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  BookOpen01Icon,
  UserCheck01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

/* ---------------------------------------------------------------- */
/*  Mock search data                                                */
/* ---------------------------------------------------------------- */

type SearchResult = {
  id: string;
  type: "community" | "course" | "person";
  label: string;
  sub: string;
  href: string;
};

const MOCK_SEARCH_DATA: SearchResult[] = [
  /* Communities */
  { id: "c1", type: "community", label: "Frontend Devs", sub: "1.2k members · 48 online", href: "/dashboard/communities/frontend-devs/manage" },
  { id: "c2", type: "community", label: "UI/UX Critique Circle", sub: "860 members · 12 online", href: "/dashboard/communities/uiux-critique/manage" },
  { id: "c3", type: "community", label: "Backend Engineers", sub: "2.1k members · 31 online", href: "/dashboard/communities/backend-engineers/manage" },
  { id: "c4", type: "community", label: "Data Science Hub", sub: "940 members · 6 online", href: "/dashboard/communities/data-science/manage" },
  { id: "c5", type: "community", label: "Mobile Dev Collective", sub: "720 members · 9 online", href: "/dashboard/communities/mobile-dev/manage" },
  /* Courses */
  { id: "cr1", type: "course", label: "Frontend with React", sub: "Intermediate · 12 weeks · ₦45,000", href: "/dashboard/courses/react-frontend" },
  { id: "cr2", type: "course", label: "Data Analysis with Excel", sub: "Beginner · 6 weeks · ₦25,000", href: "/dashboard/courses/data-analysis" },
  { id: "cr3", type: "course", label: "UI/UX Fundamentals", sub: "Beginner · 8 weeks · ₦35,000", href: "/dashboard/courses/uiux-fundamentals" },
  { id: "cr4", type: "course", label: "Node.js Masterclass", sub: "Advanced · 10 weeks · ₦60,000", href: "/dashboard/courses/nodejs-masterclass" },
  { id: "cr5", type: "course", label: "TypeScript Deep Dive", sub: "Intermediate · 6 weeks · ₦40,000", href: "/dashboard/courses/typescript-deep" },
  /* People */
  { id: "p1", type: "person", label: "Ade Okafor", sub: "Instructor · Frontend", href: "/dashboard/profile/ade" },
  { id: "p2", type: "person", label: "Dr. Okonkwo", sub: "Instructor · Data Science", href: "/dashboard/profile/okonkwo" },
  { id: "p3", type: "person", label: "Kelechi Nwosu", sub: "Student · Cohort 4", href: "/dashboard/profile/kelechi" },
  { id: "p4", type: "person", label: "Amara Obi", sub: "Student · Cohort 5", href: "/dashboard/profile/amara" },
  { id: "p5", type: "person", label: "Prof. Adeyemi", sub: "Instructor · Backend", href: "/dashboard/profile/adeyemi" },
  { id: "p6", type: "person", label: "Chioma Nwosu", sub: "Student · Cohort 5", href: "/dashboard/profile/chioma" },
];

/* ---------------------------------------------------------------- */
/*  Section icons                                                   */
/* ---------------------------------------------------------------- */

const sectionMeta = {
  community: { icon: UserGroupIcon, label: "Communities", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
  course: { icon: BookOpen01Icon, label: "Courses", color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" },
  person: { icon: UserCheck01Icon, label: "People", color: "text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400" },
} as const;

/* ---------------------------------------------------------------- */
/*  Global Search Bar                                               */
/* ---------------------------------------------------------------- */

export function GlobalSearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    const filtered = MOCK_SEARCH_DATA.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.sub.toLowerCase().includes(q)
    );
    return {
      communities: filtered.filter((r) => r.type === "community").slice(0, 3),
      courses: filtered.filter((r) => r.type === "course").slice(0, 3),
      people: filtered.filter((r) => r.type === "person").slice(0, 3),
    };
  }, [query]);

  const totalResults = results
    ? results.communities.length + results.courses.length + results.people.length
    : 0;

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md mx-4 hidden sm:block">
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value.trim()) setOpen(true);
        }}
        onFocus={() => { if (query.trim()) setOpen(true); }}
        placeholder="Search communities, courses, people..."
        className="rounded-full h-9 text-sm bg-muted/60 border-transparent focus:bg-background focus:border-border transition-colors"
      />

      {/* Dropdown */}
      {open && query.trim() && (
        <div className="absolute top-full mt-2 left-0 right-0 rounded-xl border bg-popover shadow-xl z-50 overflow-hidden">
          {totalResults === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <>
              {(["community", "course", "person"] as const).map((type) => {
                const items = results?.[type === "community" ? "communities" : type === "course" ? "courses" : "people"] ?? [];
                if (items.length === 0) return null;
                const meta = sectionMeta[type === "community" ? "community" : type === "course" ? "course" : "person"];
                return (
                  <div key={type}>
                    <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                      <div className={`size-6 rounded-md flex items-center justify-center shrink-0 ${meta.color}`}>
                        <HugeiconsIcon icon={meta.icon} size={12} />
                      </div>
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                        {meta.label}
                      </span>
                    </div>
                    {items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.href)}
                        className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{item.label}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
                        </div>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-muted-foreground/40 shrink-0" />
                      </button>
                    ))}
                  </div>
                );
              })}

              {/* See all */}
              <div className="border-t px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
                  }}
                  className="w-full text-center text-xs text-primary hover:underline font-medium py-1 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  See all results for &ldquo;{query}&rdquo;
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
