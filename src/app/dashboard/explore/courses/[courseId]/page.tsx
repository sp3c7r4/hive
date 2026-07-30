"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  UserGroupIcon,
  StarIcon,
  BookOpen01Icon,
  Award01Icon,
  PlayIcon,
  File01Icon,
  LiveStreaming01Icon,
  CircleQuestionMarkIcon,
  AssignmentsIcon,
  LockIcon,
  CheckmarkCircle02Icon,
  CreditCardIcon,
  ArrowDown01Icon,
  Building02Icon,
  Alert01Icon,
} from "@hugeicons/core-free-icons";
import { RatingBreakdown } from "@/components/reviews/RatingBreakdown";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import { resolveFullCourse } from "@/lib/course-utils";
import type { CourseReview } from "@/components/reviews/types";

type Role = "instructor" | "student" | "parent" | "admin";

const LESSON_ICONS = { video: PlayIcon, pdf: File01Icon, live: LiveStreaming01Icon, quiz: CircleQuestionMarkIcon, assignment: AssignmentsIcon };
const diffColors = { beginner: "bg-emerald-100 text-emerald-700", intermediate: "bg-amber-100 text-amber-700", advanced: "bg-rose-100 text-rose-700" } as const;

function CourseLandingPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const params = useParams<{ courseId: string }>();
  const role = (sp.get("role") as Role) || "student";
  const COURSE = resolveFullCourse(params.courseId);

  const [expandedMods, setExpandedMods] = useState<Set<number>>(new Set([0]));

  const [reviews, setReviews] = useState<CourseReview[]>(COURSE?.reviews ?? []);
  const [hasReviewed, setHasReviewed] = useState(false);
  const ratingDist = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: reviews.filter((r) => r.rating === stars).length }));

  const toggleMod = (i: number) => {
    const next = new Set(expandedMods);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setExpandedMods(next);
  };

  // -- CTA logic --
  const isPrivate = COURSE?.visibility === "private";
  const isMemberOfCommunity = false; // TODO: wire real membership check

  const cta = !COURSE
    ? null
    : COURSE.completed
      ? { label: "View Certificate", variant: "outline" as const }
      : COURSE.enrolled
        ? { label: "Continue Learning", variant: "default" as const }
        : isPrivate && !isMemberOfCommunity
          ? { label: `Join ${COURSE.communityName} to Enroll`, variant: "default" as const }
          : COURSE.price === "Free"
            ? { label: "Enroll for Free", variant: "default" as const }
            : { label: "Proceed to Payment", variant: "default" as const };

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [joinEnrollOpen, setJoinEnrollOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [joining, setJoining] = useState(false);
  const [enrollForStudent, setEnrollForStudent] = useState("ta");
  const isParent = role === "parent";

  const linkedStudents = isParent
    ? [
        { id: "ta", name: "Temi Adebayo" },
        { id: "ka", name: "Kunle Adebayo" },
      ]
    : [];

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setCheckoutOpen(false);
      setPaying(false);
      router.push(`/dashboard/payments?success=1&role=${role}`);
    }, 2000);
  };

  const handleJoinAndEnroll = () => {
    setJoining(true);
    setTimeout(() => {
      setJoinEnrollOpen(false);
      setJoining(false);
      router.push(`/dashboard/explore/communities/${COURSE?.communitySlug}?role=${role}`);
    }, 1500);
  };

  // -- CTA click handler --
  const handleCtaClick = () => {
    if (!COURSE) return;
    if (isPrivate && !isMemberOfCommunity) {
      setJoinEnrollOpen(true);
      return;
    }
    if (COURSE.price === "Free") {
      router.push(`/dashboard/payments?success=1&role=${role}`);
    } else {
      setCheckoutOpen(true);
    }
  };

  // -- Not found --
  if (!COURSE) {
    return (
      <DashboardLayout role={role}>
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4 min-w-0">
          <div className="size-14 rounded-full bg-muted flex items-center justify-center">
            <HugeiconsIcon icon={Alert01Icon} size={24} className="text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">Course not found</h2>
          <p className="text-sm text-muted-foreground max-w-sm">The course you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
          <Button variant="outline" className="rounded-full" render={<Link href={`/dashboard/explore?role=${role}`}>Browse Courses</Link>} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 min-w-0 max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground w-fit">
          <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
          Back to Discover
        </button>

        {/* Banner */}
        <div className="aspect-[3/1] rounded-2xl bg-gradient-to-br from-muted/80 via-muted/40 to-muted flex items-center justify-center relative overflow-hidden">
          <HugeiconsIcon icon={BookOpen01Icon} size={64} className="text-muted-foreground/10 absolute" />
          <Badge className={`absolute top-4 left-4 rounded-full text-[10px] px-2.5 py-0.5 h-6 font-medium ${diffColors[COURSE.difficulty]}`}>{COURSE.difficulty}</Badge>
          {isPrivate && (
            <Badge className="absolute top-4 right-4 rounded-full text-[10px] px-2.5 py-0.5 h-6 font-medium bg-violet-100 text-violet-700">
              <HugeiconsIcon icon={LockIcon} size={10} className="mr-1" />
              Community Course
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{COURSE.title}</h1>
                <Badge variant="secondary" className="rounded-full">{COURSE.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{COURSE.subtitle}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={StarIcon} size={14} className="text-amber-500 fill-amber-500" />
                  {COURSE.rating} ({COURSE.reviewCount} reviews)
                </span>
                <span>
                  <HugeiconsIcon icon={UserGroupIcon} size={14} className="inline mr-1" />
                  {COURSE.enrollmentCount} enrolled
                </span>
                {COURSE.certificate && (
                  <Badge className="rounded-full text-[10px] px-2 py-0 h-5 bg-amber-100 text-amber-700">
                    <HugeiconsIcon icon={Award01Icon} size={11} className="mr-0.5" />
                    Certificate
                  </Badge>
                )}
              </div>
              {/* Community link */}
              <Link
                href={`/dashboard/explore/communities/${COURSE.communitySlug}?role=${role}`}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-2"
              >
                <HugeiconsIcon icon={Building02Icon} size={12} />
                Part of {COURSE.communityName}
              </Link>
            </div>
            <Separator />

            {/* Private course gate banner */}
            {isPrivate && !isMemberOfCommunity && (
              <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/20 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="size-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={LockIcon} size={18} className="text-violet-700 dark:text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">Community Course</p>
                  <p className="text-xs text-violet-600/80 dark:text-violet-400/80">
                    This course is exclusive to members of {COURSE.communityName}. Join the community to get access.
                  </p>
                </div>
              </div>
            )}

            {/* Curriculum */}
            <div>
              <h2 className="text-sm font-semibold mb-3">Curriculum ({COURSE.curriculum.length} modules)</h2>
              <div className="flex flex-col gap-2">
                {COURSE.curriculum.map((mod, mi) => (
                  <Card key={mi} className="overflow-hidden">
                    <button onClick={() => toggleMod(mi)} className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Module {mi + 1}</span>
                        <span className="text-sm font-medium">{mod.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{mod.lessons.length} lessons</span>
                        <HugeiconsIcon icon={ArrowDown01Icon} size={12} className={`transition-transform ${expandedMods.has(mi) ? "rotate-180" : ""}`} />
                      </div>
                    </button>
                    {expandedMods.has(mi) && (
                      <div className="divide-y animate-in fade-in">
                        {mod.lessons.map((l, li) => (
                          <div key={li} className="flex items-center gap-3 px-5 py-3 text-sm">
                            <HugeiconsIcon icon={LESSON_ICONS[l.type]} size={15} className="text-muted-foreground shrink-0" />
                            <span className="flex-1 truncate">{l.title}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              {l.freePreview && (
                                <Badge variant="secondary" className="rounded-full text-[9px] px-1.5 py-0 h-4">Preview</Badge>
                              )}
                              {!COURSE.enrolled && !l.freePreview && <HugeiconsIcon icon={LockIcon} size={13} className="text-muted-foreground" />}
                              <span className="text-[10px] text-muted-foreground">{l.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
            <Separator />

            {/* Reviews */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold">Reviews &amp; Ratings</h2>
              <RatingBreakdown
                rating={reviews.reduce((s, r) => s + r.rating, 0) / reviews.length}
                reviewCount={reviews.length}
                distribution={ratingDist}
              />
              {COURSE.enrolled && !hasReviewed && (
                <div className="p-4 sm:p-5 rounded-xl border">
                  <ReviewForm
                    currentUser={{ name: "Temi Adebayo", initials: "TA" }}
                    onSubmit={(review) => {
                      setReviews((prev) => [review, ...prev]);
                      setHasReviewed(true);
                    }}
                  />
                </div>
              )}
              <Separator />
              <ReviewList
                reviews={reviews}
                onMarkHelpful={(id) =>
                  setReviews((prev) =>
                    prev.map((r) =>
                      r.id === id
                        ? { ...r, markedHelpful: !r.markedHelpful, helpfulCount: r.helpfulCount + (r.markedHelpful ? -1 : 1) }
                        : r
                    )
                  )
                }
                onFlag={() => {}}
              />
            </div>

            {/* Certificate */}
            {COURSE.certificate && (
              <>
                <Separator />
                <Card className="p-5 flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={Award01Icon} size={22} className="text-amber-700 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Certificate of Completion</h3>
                    <p className="text-xs text-muted-foreground mt-1">Earn a certificate when you complete this course.</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span><HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} className="inline mr-1" />{COURSE.certRequirements.completion} completion</span>
                      <span><HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} className="inline mr-1" />{COURSE.certRequirements.quizScore} quiz score</span>
                      <span><HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} className="inline mr-1" />{COURSE.certRequirements.attendance} attendance</span>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <Card className="p-5 flex flex-col gap-3 sticky top-24">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 shrink-0"><AvatarFallback>{COURSE.instructor.initials}</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-semibold">{COURSE.instructor.name}</p>
                  <p className="text-[10px] text-muted-foreground">{COURSE.instructor.rank}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{COURSE.instructor.bio}</p>
              <Separator />
              <div className="text-center">
                <p className="text-xl font-bold">{COURSE.price === "Free" ? "Free" : COURSE.price}</p>
                <p className="text-[10px] text-muted-foreground">
                  {COURSE.price === "Free" ? "Full lifetime access" : "One-time payment"}
                </p>
              </div>
              <Button className="rounded-full w-full" variant={cta?.variant} onClick={handleCtaClick} disabled={paying || joining}>
                {paying || joining ? (
                  <><span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />Processing...</>
                ) : isParent && !COURSE.enrolled && !isPrivate ? (
                  "Pay for Student"
                ) : (
                  cta?.label
                )}
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">
                {isParent && !COURSE.enrolled
                  ? "Select which child to enroll during checkout"
                  : COURSE.enrolled
                    ? "You are enrolled"
                    : isPrivate && !isMemberOfCommunity
                      ? "Join the community first to enroll"
                      : "Enroll now and start learning"}
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Standard checkout dialog (for public courses) */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-md p-0 gap-0">
          <DialogHeader className="px-5 pt-5 pb-2"><DialogTitle>Checkout</DialogTitle></DialogHeader>
          <div className="px-5 pb-5 flex flex-col gap-4">
            {isParent && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Enroll for</span>
                <Select value={enrollForStudent} onValueChange={setEnrollForStudent}>
                  <SelectTrigger className="rounded-xl h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {linkedStudents.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="rounded-xl bg-muted/30 p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm"><span className="font-medium">{COURSE.title}</span><span>{COURSE.price}</span></div>
              <Separator />
              <div className="flex items-center gap-2"><Input placeholder="Referral code (optional)" className="rounded-full text-sm flex-1" /><Button size="sm" variant="outline" className="rounded-full h-9 text-xs">Apply</Button></div>
              <Separator />
              <div className="flex items-center justify-between text-sm font-semibold"><span>Total</span><span>{COURSE.price}</span></div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border p-4 bg-muted/20">
              <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0"><HugeiconsIcon icon={CreditCardIcon} size={18} /></div>
              <div><p className="text-sm font-medium">Paystack</p><p className="text-xs text-muted-foreground">Card, Bank, USSD</p></div>
            </div>
          </div>
          <DialogFooter className="px-5 pb-5 gap-2">
            <Button variant="outline" className="rounded-full" onClick={() => setCheckoutOpen(false)}>Cancel</Button>
            <Button className="rounded-full" onClick={handlePay} disabled={paying}>
              {paying ? <><span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />Redirecting to Paystack...</> : "Pay Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join & Enroll dialog (for private courses) */}
      <Dialog open={joinEnrollOpen} onOpenChange={setJoinEnrollOpen}>
        <DialogContent className="max-w-md p-0 gap-0">
          <DialogHeader className="px-5 pt-5 pb-2"><DialogTitle>Join Community &amp; Enroll</DialogTitle></DialogHeader>
          <div className="px-5 pb-5 flex flex-col gap-4">
            <div className="rounded-xl bg-muted/30 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={Building02Icon} size={18} className="text-violet-700 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{COURSE.communityName}</p>
                  <p className="text-xs text-muted-foreground">Community</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This course is exclusive to members of {COURSE.communityName}. You&apos;ll join the community and enroll in the course in one step.
              </p>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{COURSE.title}</span>
                <span>{COURSE.price === "Free" ? "Free" : COURSE.price}</span>
              </div>
            </div>
            <Link
              href={`/dashboard/explore/communities/${COURSE.communitySlug}?role=${role}`}
              className="text-xs text-muted-foreground hover:text-foreground underline decoration-dotted underline-offset-4"
            >
              Learn more about {COURSE.communityName}
            </Link>
          </div>
          <DialogFooter className="px-5 pb-5 gap-2">
            <Button variant="outline" className="rounded-full" onClick={() => setJoinEnrollOpen(false)}>Cancel</Button>
            <Button className="rounded-full" onClick={handleJoinAndEnroll} disabled={joining}>
              {joining ? <><span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />Joining...</> : "Join & Enroll"}
            </Button>
          </DialogFooter>
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
          <Skeleton className="h-48 rounded-2xl mb-6" />
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full" />
        </div>
      }
    >
      <CourseLandingPage />
    </Suspense>
  );
}
