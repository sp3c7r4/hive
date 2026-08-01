"use client";

import {
  Award01Icon,
  Calendar01Icon,
  Dollar01Icon,
  Message02Icon,
  Notification03Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export type ActivityItem = {
  id: number;
  type: string;
  text: string;
  time: string;
};

export type ActivityType = {
  key: string;
  label: string;
};

const iconMap: Record<string, React.ReactNode> = {
  badge: (
    <HugeiconsIcon
      icon={Award01Icon}
      size={18}
      className="text-muted-foreground"
    />
  ),
  class: (
    <HugeiconsIcon
      icon={Calendar01Icon}
      size={18}
      className="text-muted-foreground"
    />
  ),
  payment: (
    <HugeiconsIcon
      icon={Dollar01Icon}
      size={18}
      className="text-muted-foreground"
    />
  ),
  review: (
    <HugeiconsIcon
      icon={Message02Icon}
      size={18}
      className="text-muted-foreground"
    />
  ),
  enrollment: (
    <HugeiconsIcon
      icon={UserCheck01Icon}
      size={18}
      className="text-muted-foreground"
    />
  ),
  submission: (
    <HugeiconsIcon
      icon={Award01Icon}
      size={18}
      className="text-muted-foreground"
    />
  ),
};

export function ActivityIcon({ type }: { type: string }) {
  return (
    iconMap[type] ?? (
      <HugeiconsIcon
        icon={Notification03Icon}
        size={18}
        className="text-muted-foreground"
      />
    )
  );
}

export function ActivityFeed({
  title = "Recent Activity",
  items,
  types,
  filter,
  onFilterChange,
}: {
  title?: string;
  items: ActivityItem[];
  types: ActivityType[];
  filter: string;
  onFilterChange: (key: string) => void;
}) {
  const filtered =
    filter === "all" ? items : items.filter((a) => a.type === filter);

  return (
    <div className="dash-widget">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-sm font-semibold shrink-0">{title}</h2>
        <div className="overflow-x-auto -mx-1 px-1">
          <div className="flex items-center gap-1 w-max">
            {types.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => onFilterChange(key)}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                  filter === key
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-0.5">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5"
            >
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <ActivityIcon type={a.type} />
              </div>
              <p className="text-sm flex-1 min-w-0 truncate">{a.text}</p>
              <span className="text-xs text-muted-foreground shrink-0">
                {a.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
