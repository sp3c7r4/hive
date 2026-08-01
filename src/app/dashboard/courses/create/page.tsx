"use client";

import {
  ArrowLeft02Icon,
  Building02Icon,
  Cancel01Icon,
  Globe02Icon,
  Image01Icon,
  LockIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useRef, useState } from "react";
import { DashboardLayout } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { COURSES_DATA } from "@/lib/course-utils";

/* ---------------------------------------------------------------- */
/*  Types                                                           */
/* ---------------------------------------------------------------- */

type Role = "instructor" | "student" | "parent" | "admin";
type Difficulty = "beginner" | "intermediate" | "advanced";

const CATEGORIES = [
  "Design",
  "Development",
  "Data Science",
  "Business",
  "Marketing",
  "Product",
  "Writing",
  "Photography",
  "Music",
  "Other",
];

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; desc: string }[] =
  [
    {
      value: "beginner",
      label: "Beginner",
      desc: "No prior experience needed",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      desc: "Some experience recommended",
    },
    { value: "advanced", label: "Advanced", desc: "Requires solid foundation" },
  ];

/* ---------------------------------------------------------------- */
/*  Helpers                                                         */
/* ---------------------------------------------------------------- */

function fmtPrice(v: string) {
  return v.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* ---------------------------------------------------------------- */
/*  Create Course Page                                              */
/* ---------------------------------------------------------------- */

function CreateCoursePage() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "instructor";
  const community = searchParams.get("community") || "";
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [isFree, setIsFree] = useState(true);
  const [oneTimePrice, setOneTimePrice] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [sequentialAccess, setSequentialAccess] = useState(false);
  const [dripContent, setDripContent] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [allowDownloads, setAllowDownloads] = useState(true);
  const [offerCertificate, setOfferCertificate] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [selectedCommunity, setSelectedCommunity] = useState(community || "");

  // Derive unique communities from course catalogue + the one passed via query
  const communities = Array.from(
    new Map(
      COURSES_DATA.map((c) => [c.communitySlug, c.communityName]),
    ).entries(),
  ).map(([slug, name]) => ({ slug, name }));
  const [minCompletion, setMinCompletion] = useState("80");
  const [minQuizScore, setMinQuizScore] = useState("70");
  const [minAttendance, setMinAttendance] = useState("60");
  const [publishOpen, setPublishOpen] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handlePublish = () => {
    setPublishOpen(false);
    router.push(`/dashboard/courses/new-course/manage?role=${role}`);
  };

  const isValid = title.trim() && description.trim() && category;

  return (
    <DashboardLayout role={role}>
      <div className="max-w-2xl mx-auto flex flex-col gap-6 min-w-0">
        {/* Header */}
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
            Back
          </button>
          <h1 className="text-xl font-bold tracking-tight">Create a Course</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {community
              ? `Adding to ${community}`
              : "Build your course curriculum and set it live"}
          </p>
        </div>

        {/* ---- Cover Image ---- */}
        <Card className="p-5">
          <Label className="text-sm font-semibold mb-3 block">
            Cover Image
          </Label>
          {coverPreview ? (
            <div className="relative rounded-xl overflow-hidden aspect-[2.5/1] bg-muted group">
              <Image src={coverPreview} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(coverPreview);
                  setCoverPreview(null);
                }}
                className="absolute top-3 right-3 size-8 rounded-full bg-background/80 hover:bg-background flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/30 transition-colors aspect-[2.5/1] flex flex-col items-center justify-center gap-2 bg-muted/30"
            >
              <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                <HugeiconsIcon
                  icon={Image01Icon}
                  size={22}
                  className="text-muted-foreground"
                />
              </div>
              <p className="text-sm font-medium">Upload a cover image</p>
              <p className="text-xs text-muted-foreground">16:9 recommended</p>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setCoverPreview(URL.createObjectURL(f));
            }}
            className="hidden"
          />
        </Card>

        {/* ---- Basic Info ---- */}
        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold">Basic Information</h3>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g. "React for Designers"'
              className="rounded-xl"
              maxLength={120}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will students learn? Who is this course for?"
              className="rounded-xl min-h-[100px] resize-y"
              maxLength={800}
            />
            <p className="text-[10px] text-muted-foreground text-right">
              {description.length}/800
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl h-9 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium">Community</Label>
              <Select
                value={selectedCommunity}
                onValueChange={setSelectedCommunity}
              >
                <SelectTrigger className="rounded-xl h-9 text-sm">
                  <SelectValue placeholder="Select a community" />
                </SelectTrigger>
                <SelectContent>
                  {communities.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium">Difficulty</Label>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDifficulty(opt.value)}
                  className={`flex-1 min-w-[120px] rounded-xl border-2 px-4 py-3 text-left transition-colors ${difficulty === opt.value ? "border-foreground bg-muted/40" : "border-border hover:border-muted-foreground/30"}`}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ---- Pricing ---- */}
        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold">Pricing</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">This course is free</p>
              <p className="text-xs text-muted-foreground">
                Anyone can enroll at no cost
              </p>
            </div>
            <Switch checked={isFree} onCheckedChange={setIsFree} />
          </div>
          {!isFree && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium">
                    One-time Price (₦)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      ₦
                    </span>
                    <Input
                      value={oneTimePrice}
                      onChange={(e) =>
                        setOneTimePrice(fmtPrice(e.target.value))
                      }
                      placeholder="5,000"
                      className="rounded-xl pl-8"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Leave empty for no one-time option
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-medium">
                    Monthly Subscription (₦)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      ₦
                    </span>
                    <Input
                      value={monthlyPrice}
                      onChange={(e) =>
                        setMonthlyPrice(fmtPrice(e.target.value))
                      }
                      placeholder="2,000"
                      className="rounded-xl pl-8"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Leave empty for no subscription option
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ---- Visibility ---- */}
        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold">Visibility</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setVisibility("public")}
              className={`flex-1 min-w-[140px] rounded-xl border-2 px-4 py-3 text-left transition-colors ${visibility === "public" ? "border-foreground bg-muted/40" : "border-border hover:border-muted-foreground/30"}`}
            >
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <HugeiconsIcon
                    icon={Globe02Icon}
                    size={14}
                    className="text-emerald-700 dark:text-emerald-400"
                  />
                </div>
                <p className="text-sm font-medium">Public</p>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Anyone can find and enroll in this course from Explore
              </p>
            </button>
            <button
              type="button"
              onClick={() => setVisibility("private")}
              className={`flex-1 min-w-[140px] rounded-xl border-2 px-4 py-3 text-left transition-colors ${visibility === "private" ? "border-foreground bg-muted/40" : "border-border hover:border-muted-foreground/30"}`}
            >
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <HugeiconsIcon
                    icon={LockIcon}
                    size={14}
                    className="text-violet-700 dark:text-violet-400"
                  />
                </div>
                <p className="text-sm font-medium">Private</p>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Only visible to members of the linked community
              </p>
            </button>
          </div>
          {!selectedCommunity && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <HugeiconsIcon icon={Building02Icon} size={12} />
              Select a community above to link this course
            </p>
          )}
        </Card>

        {/* ---- Settings ---- */}
        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold">Course Settings</h3>
          {[
            {
              label: "Sequential Access",
              desc: "Students must complete lessons in order",
              state: sequentialAccess,
              set: setSequentialAccess,
            },
            {
              label: "Drip Content",
              desc: "Release lessons on a schedule instead of all at once",
              state: dripContent,
              set: setDripContent,
            },
            {
              label: "Allow Comments",
              desc: "Students can comment on lessons",
              state: allowComments,
              set: setAllowComments,
            },
            {
              label: "Allow Downloads",
              desc: "Students can download course materials",
              state: allowDownloads,
              set: setAllowDownloads,
            },
          ].map((item, i) => (
            <div key={item.label}>
              {i > 0 && <Separator className="mb-4" />}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch checked={item.state} onCheckedChange={item.set} />
              </div>
            </div>
          ))}
        </Card>

        {/* ---- Certificate ---- */}
        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold">Certificate</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Offer Certificate</p>
              <p className="text-xs text-muted-foreground">
                Students earn a certificate upon completion
              </p>
            </div>
            <Switch
              checked={offerCertificate}
              onCheckedChange={setOfferCertificate}
            />
          </div>
          {offerCertificate && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Min Completion %",
                    value: minCompletion,
                    set: setMinCompletion,
                  },
                  {
                    label: "Min Quiz Score %",
                    value: minQuizScore,
                    set: setMinQuizScore,
                  },
                  {
                    label: "Min Attendance %",
                    value: minAttendance,
                    set: setMinAttendance,
                  },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium">{f.label}</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* ---- Actions ---- */}
        <div className="flex items-center gap-3 justify-end">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            disabled={!isValid}
          >
            Save Draft
          </Button>
          <Button
            className="rounded-full"
            disabled={!isValid}
            onClick={() => setPublishOpen(true)}
          >
            Publish
          </Button>
        </div>

        <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Publish Course</DialogTitle>
              <DialogDescription>
                This will make the course visible to community members. You can
                still edit it after publishing.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setPublishOpen(false)}
              >
                Cancel
              </Button>
              <Button className="rounded-full" onClick={handlePublish}>
                Confirm & Publish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

export default function Wrapper() {
  return (
    <Suspense fallback={null}>
      <CreateCoursePage />
    </Suspense>
  );
}
