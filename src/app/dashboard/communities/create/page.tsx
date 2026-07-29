"use client";

import { Suspense, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Camera01Icon,
  Image01Icon,
  Cancel01Icon,
  ArrowLeft02Icon,
} from "@hugeicons/core-free-icons";

/* ---------------------------------------------------------------- */
/*  Types                                                           */
/* ---------------------------------------------------------------- */

type Role = "instructor" | "student" | "parent" | "admin";

type Visibility = "public" | "private" | "invite-only";

type FormData = {
  name: string;
  slug: string;
  description: string;
  coverImage: File | null;
  coverPreview: string | null;
  category: string;
  visibility: Visibility;
  requireApproval: boolean;
  isPaid: boolean;
  price: string;
};

/* ---------------------------------------------------------------- */
/*  Category options                                                */
/* ---------------------------------------------------------------- */

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

/* ---------------------------------------------------------------- */
/*  Slug helper                                                     */
/* ---------------------------------------------------------------- */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/* ---------------------------------------------------------------- */
/*  Create Community Page                                            */
/* ---------------------------------------------------------------- */

function CreateCommunityPage() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "instructor";
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name: "",
    slug: "",
    description: "",
    coverImage: null,
    coverPreview: null,
    category: "",
    visibility: "public",
    requireApproval: false,
    isPaid: false,
    price: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---- Handlers ---- */
  const updateField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleNameChange = useCallback(
    (value: string) => {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: prev.slug === slugify(prev.name) || !prev.slug
          ? slugify(value)
          : prev.slug,
      }));
    },
    []
  );

  const handleCoverSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      updateField("coverImage", file);
      updateField("coverPreview", URL.createObjectURL(file));
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [updateField]
  );

  const handleRemoveCover = useCallback(() => {
    if (form.coverPreview) URL.revokeObjectURL(form.coverPreview);
    updateField("coverImage", null);
    updateField("coverPreview", null);
  }, [form.coverPreview, updateField]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      /* Demo: navigate to community management */
      const slug = form.slug || slugify(form.name);
      router.push(`/dashboard/communities/${slug}/manage?role=${role}`);
    },
    [form, router, role]
  );

  const isValid =
    form.name.trim() &&
    form.slug.trim() &&
    form.description.trim() &&
    form.category;

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
          <h1 className="text-xl font-bold tracking-tight">
            Create a Community
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Set up your community and start bringing people together
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ---- Cover Image ---- */}
          <Card className="p-5">
            <Label className="text-sm font-semibold mb-3 block">
              Cover Image
            </Label>
            {form.coverPreview ? (
              <div className="relative rounded-xl overflow-hidden aspect-[3/1] bg-muted group">
                <Image
                  src={form.coverPreview}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  className="absolute top-3 right-3 size-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background flex items-center justify-center transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={16}
                    className="text-foreground"
                  />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/30 transition-colors aspect-[3/1] flex flex-col items-center justify-center gap-2 bg-muted/30"
              >
                <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                  <HugeiconsIcon
                    icon={Image01Icon}
                    size={22}
                    className="text-muted-foreground"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Upload a cover image
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    16:9 recommended · PNG, JPG up to 5MB
                  </p>
                </div>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverSelect}
              className="hidden"
            />
          </Card>

          {/* ---- Basic Info ---- */}
          <Card className="p-5 flex flex-col gap-4">
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                Basic Information
              </Label>

              <div className="flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name" className="text-xs font-medium">
                    Community Name
                  </Label>
                  <Input
                    id="name"
                    placeholder='e.g. "Design Academy"'
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="rounded-xl"
                    maxLength={80}
                  />
                </div>

                {/* Slug */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="slug" className="text-xs font-medium">
                    Slug
                  </Label>
                  <div className="flex items-center rounded-xl border bg-muted/40 px-3 py-2 gap-1.5 text-sm">
                    <span className="text-muted-foreground shrink-0">
                      hive.ng/c/
                    </span>
                    <input
                      id="slug"
                      value={form.slug}
                      onChange={(e) =>
                        updateField(
                          "slug",
                          slugify(e.target.value)
                        )
                      }
                      placeholder="design-academy"
                      className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60 min-w-0"
                      maxLength={60}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Auto-generated from name. You can edit it.
                  </p>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="desc" className="text-xs font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="desc"
                    placeholder="What is this community about? What value will members get?"
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="rounded-xl min-h-[100px] resize-y"
                    maxLength={500}
                  />
                  <p className="text-[10px] text-muted-foreground text-right">
                    {form.description.length}/500
                  </p>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="category" className="text-xs font-medium">Category</Label>
                  <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                    <SelectTrigger id="category" className="rounded-xl h-10 text-sm"><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* ---- Settings ---- */}
          <Card className="p-5 flex flex-col gap-5">
            <Label className="text-sm font-semibold">Settings</Label>

            {/* Visibility */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium">Visibility</Label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: "public", label: "Public", desc: "Anyone can find and join" },
                    { value: "private", label: "Private", desc: "Only invited people can join" },
                    { value: "invite-only", label: "Invite Only", desc: "Members invite others" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField("visibility", opt.value)}
                    className={`flex-1 min-w-[140px] rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                      form.visibility === opt.value
                        ? "border-foreground bg-muted/40"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <p className="text-sm font-medium">{opt.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Require Approval */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Require Approval</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  New members must be approved before joining
                </p>
              </div>
              <Switch
                checked={form.requireApproval}
                onCheckedChange={(v) => updateField("requireApproval", v)}
              />
            </div>

            <Separator />

            {/* Paid community */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Paid Community</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Charge a monthly fee for membership
                  </p>
                </div>
                <Switch
                  checked={form.isPaid}
                  onCheckedChange={(v) => updateField("isPaid", v)}
                />
              </div>

              {form.isPaid && (
                <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-xs font-medium">
                    Monthly Price (₦)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      ₦
                    </span>
                    <Input
                      type="number"
                      min={500}
                      step={100}
                      placeholder="2,500"
                      value={form.price}
                      onChange={(e) => updateField("price", e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
                      className="rounded-xl pl-8"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Minimum ₦500. You can change this later.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* ---- Submit ---- */}
          <div className="flex items-center gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full"
              disabled={!isValid}
            >
              Create Community
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

/* ---------------------------------------------------------------- */
/*  Page export                                                     */
/* ---------------------------------------------------------------- */

export default function CreateCommunityPageWrapper() {
  return (
    <Suspense fallback={null}>
      <CreateCommunityPage />
    </Suspense>
  );
}
