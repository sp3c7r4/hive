"use client";

import { useGSAP } from "@gsap/react";
import {
  Add01Icon,
  BellIcon,
  Bookmark01Icon,
  Camera01Icon,
  CheckmarkBadge01Icon,
  PencilEdit01Icon,
  TagsIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveOnboarding } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Role = "instructor" | "student" | "parent";

type Step = { icon: IconSvgElement; title: string; desc: string };

const PRESET_TAGS = [
  "Web Development",
  "Graphic Design",
  "UI/UX Design",
  "Digital Marketing",
  "Data Science",
  "Photography",
  "Music",
  "Business",
  "Finance",
  "Health & Wellness",
  "Languages",
  "Writing",
  "Video Editing",
  "Animation",
  "Game Development",
  "Cybersecurity",
  "AI & ML",
];

const flows: Record<Role, Step[]> = {
  instructor: [
    {
      icon: Camera01Icon,
      title: "Profile photo",
      desc: "Upload a photo with crop and preview so your students know who is teaching them.",
    },
    {
      icon: PencilEdit01Icon,
      title: "Write a short bio",
      desc: "Tell students about your background and what makes your courses unique.",
    },
    {
      icon: TagsIcon,
      title: "Select specialization tags",
      desc: "Pick from Web Development, Graphic Design, and more, or add your own.",
    },
    {
      icon: BellIcon,
      title: "Notification preferences",
      desc: "Choose how you want to be notified: Email, SMS, WhatsApp, or Push.",
    },
  ],
  student: [
    {
      icon: Camera01Icon,
      title: "Profile photo",
      desc: "Add a photo so your instructors and peers can recognize you. Optional and skippable.",
    },
    {
      icon: Bookmark01Icon,
      title: "Select your interests",
      desc: "Pick categories that interest you so we can recommend the right courses.",
    },
    {
      icon: BellIcon,
      title: "Notification preferences",
      desc: "Choose how you want to stay updated: Email, SMS, WhatsApp, or Push.",
    },
  ],
  parent: [
    {
      icon: Camera01Icon,
      title: "Profile photo",
      desc: "Add a photo to personalize your parent dashboard. Optional.",
    },
    {
      icon: UserGroupIcon,
      title: "Link student accounts",
      desc: "Search by email or share an invite link so you can monitor their progress.",
    },
    {
      icon: BellIcon,
      title: "Notification preferences",
      desc: "Choose how you want to receive updates: Email, SMS, WhatsApp, or Push.",
    },
  ],
};

function TagSelector({
  tags,
  onToggle,
  customTag,
  onCustomChange,
  onCustomAdd,
  onCustomKeyDown,
}: {
  tags: string[];
  onToggle: (tag: string) => void;
  customTag: string;
  onCustomChange: (v: string) => void;
  onCustomAdd: () => void;
  onCustomKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {PRESET_TAGS.map((tag) => {
          const selected = tags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggle(tag)}
              className={cn(
                "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all border",
                selected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary/50",
              )}
            >
              {tag}
              {selected && (
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={12} />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
        <input
          type="text"
          placeholder="Add a custom tag..."
          value={customTag}
          onChange={(e) => onCustomChange(e.target.value)}
          onKeyDown={onCustomKeyDown}
          className="flex-1 text-xs bg-transparent outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={onCustomAdd}
          className="shrink-0 size-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <HugeiconsIcon icon={Add01Icon} size={12} />
        </button>
      </div>

      {tags.filter((t) => !PRESET_TAGS.includes(t)).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags
            .filter((t) => !PRESET_TAGS.includes(t))
            .map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onToggle(tag)}
                  className="hover:opacity-70"
                >
                  ×
                </button>
              </span>
            ))}
        </div>
      )}
    </div>
  );
}

function OnboardingContent() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "student";
  const flow = flows[role];

  const scope = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    whatsapp: false,
    push: false,
  });

  function toggleTag(
    list: string[],
    setList: (v: string[]) => void,
    tag: string,
  ) {
    if (list.includes(tag)) {
      setList(list.filter((t) => t !== tag));
    } else {
      setList([...list, tag]);
    }
  }

  function addCustomTag(list: string[], setList: (v: string[]) => void) {
    const trimmed = customTag.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setCustomTag("");
  }

  const handleTagKeyDown = (
    e: React.KeyboardEvent,
    list: string[],
    setList: (v: string[]) => void,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomTag(list, setList);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  useGSAP(
    () => {
      gsap.registerPlugin(useGSAP);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".onboard-logo", { autoAlpha: 0, scale: 0.8, duration: 0.7 })
          .from(
            ".onboard-heading",
            { autoAlpha: 0, y: 20, duration: 0.5 },
            "-=0.3",
          )
          .from(
            ".onboard-desc",
            { autoAlpha: 0, y: 16, duration: 0.5 },
            "-=0.2",
          );

        tl.to(
          ".onboard-top",
          { y: -50, duration: 0.6, ease: "power3.inOut" },
          "+=0.5",
        );
        tl.call(() => setShowDetails(true), undefined, "-=0.2");
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.from(".onboard-logo", { autoAlpha: 0, duration: 0.3 });
        setShowDetails(true);
      });

      return () => mm.revert();
    },
    { scope },
  );

  useGSAP(
    () => {
      if (!showDetails) return;
      gsap.registerPlugin(useGSAP);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".onboard-step",
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          },
        );
        gsap.fromTo(
          ".onboard-cta",
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            delay: flow.length * 0.1 + 0.15,
            ease: "power3.out",
          },
        );
      });

      return () => mm.revert();
    },
    { scope, dependencies: [showDetails] },
  );

  const handleGetStarted = () => {
    saveOnboarding(role, {
      photo,
      bio,
      specializations,
      interests,
      notifications,
      completedAt: new Date().toISOString(),
    });
    window.location.href = `/dashboard?role=${role}`;
  };

  return (
    <div
      ref={scope}
      className="flex flex-col items-center min-h-screen bg-background px-6 pt-20 pb-12"
    >
      <div className="onboard-top flex flex-col items-center text-center">
        <Image
          src="/logo.svg"
          alt="Hive"
          width={80}
          height={90}
          className="onboard-logo mb-4"
        />
        <h1 className="onboard-heading text-3xl font-bold text-foreground">
          Welcome to Hive
        </h1>
        <p className="onboard-desc text-muted-foreground mt-1.5 max-w-md leading-relaxed">
          Your account is ready. Let&apos;s set up your profile as a{" "}
          <span className="font-semibold text-foreground">
            {role === "instructor"
              ? "Instructor"
              : role === "parent"
                ? "Parent"
                : "Student"}
          </span>{" "}
          so you can get started.
        </p>
      </div>

      {showDetails && (
        <div className="w-full max-w-md mt-3 flex flex-col gap-3">
          {flow.map((step, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentStep(currentStep === i ? -1 : i)}
              className={cn(
                "onboard-step flex items-start gap-4 p-4 rounded-xl border text-left transition-colors",
                currentStep === i
                  ? "border-foreground/25 bg-muted"
                  : "border-border bg-card hover:bg-muted/50",
              )}
            >
              <div
                className={cn(
                  "shrink-0 mt-0.5",
                  currentStep === i
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <HugeiconsIcon icon={step.icon} size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm">
                  Step {i + 1}: {step.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                  {step.desc}
                </p>

                {currentStep === i && (
                  <div
                    className="mt-4 space-y-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {step.title === "Profile photo" && (
                      <div className="flex items-center gap-4">
                        <label className="relative cursor-pointer group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="sr-only"
                          />
                          {photo ? (
                            <img
                              src={photo}
                              alt="Profile preview"
                              className="size-16 rounded-full object-cover border-2 border-border"
                            />
                          ) : (
                            <div className="size-16 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border group-hover:border-foreground/30 transition-colors">
                              <HugeiconsIcon
                                icon={Camera01Icon}
                                size={22}
                                className="text-muted-foreground"
                              />
                            </div>
                          )}
                        </label>
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {photo
                              ? "Tap to change photo"
                              : "Tap to upload a photo"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            JPG or PNG, max 5MB
                          </p>
                        </div>
                      </div>
                    )}

                    {step.title === "Write a short bio" && (
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="onboard-bio" className="text-xs">
                          Your bio
                        </Label>
                        <Textarea
                          id="onboard-bio"
                          placeholder="I teach web development with 5 years of experience..."
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                        />
                      </div>
                    )}

                    {step.title === "Select specialization tags" && (
                      <TagSelector
                        tags={specializations}
                        onToggle={(tag) =>
                          toggleTag(specializations, setSpecializations, tag)
                        }
                        customTag={customTag}
                        onCustomChange={setCustomTag}
                        onCustomAdd={() =>
                          addCustomTag(specializations, setSpecializations)
                        }
                        onCustomKeyDown={(e) =>
                          handleTagKeyDown(
                            e,
                            specializations,
                            setSpecializations,
                          )
                        }
                      />
                    )}

                    {step.title === "Select your interests" && (
                      <TagSelector
                        tags={interests}
                        onToggle={(tag) =>
                          toggleTag(interests, setInterests, tag)
                        }
                        customTag={customTag}
                        onCustomChange={setCustomTag}
                        onCustomAdd={() =>
                          addCustomTag(interests, setInterests)
                        }
                        onCustomKeyDown={(e) =>
                          handleTagKeyDown(e, interests, setInterests)
                        }
                      />
                    )}

                    {step.title === "Link student accounts" && (
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="onboard-link" className="text-xs">
                          Student email address
                        </Label>
                        <Input
                          id="onboard-link"
                          placeholder="student@example.com"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </div>
                    )}

                    {step.title === "Notification preferences" && (
                      <div className="flex flex-col gap-3">
                        {(
                          [
                            ["email", "Email"],
                            ["sms", "SMS"],
                            ["whatsapp", "WhatsApp"],
                            ["push", "Push notifications"],
                          ] as const
                        ).map(([channel, label]) => (
                          <label
                            key={channel}
                            className="flex items-center justify-between cursor-pointer"
                          >
                            <span className="text-sm">{label}</span>
                            <Switch
                              checked={notifications[channel]}
                              onCheckedChange={(v) =>
                                setNotifications((n) => ({
                                  ...n,
                                  [channel]: v,
                                }))
                              }
                            />
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}

          <Button
            className="onboard-cta w-full rounded-full mt-3"
            size="lg"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingContent />
    </Suspense>
  );
}
