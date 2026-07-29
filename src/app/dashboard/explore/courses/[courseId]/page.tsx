"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
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
} from "@hugeicons/core-free-icons";
import { RatingBreakdown } from "@/components/reviews/RatingBreakdown";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewList } from "@/components/reviews/ReviewList";
import type { CourseReview } from "@/components/reviews/types";

type Role = "instructor" | "student" | "parent" | "admin";

/* ---- shared course catalogue (matches explore page) ---- */

const COURSE_CATALOGUE: Record<string, typeof COURSE_TEMPLATE> = {};

const COURSES_DATA = [
  { slug:"react-designers", title:"React for Designers", category:"Development", difficulty:"beginner" as const, rating:4.8, reviewCount:124, price:"Free", instructor:{ name:"Ade Okafor", initials:"AO", bio:"Senior Frontend Engineer with 10+ years building for the web.", rank:"Top Instructor" }, enrollmentCount:342, subtitle:"Learn React fundamentals through hands-on design projects — from components to hooks, no prior JavaScript experience needed.", certificate:true },
  { slug:"advanced-typescript", title:"Advanced TypeScript", category:"Development", difficulty:"advanced" as const, rating:4.9, reviewCount:67, price:"₦15,000", instructor:{ name:"Prof. Adeyemi", initials:"PA", bio:"Computer Science professor specializing in type theory and programming languages.", rank:"Top Instructor" }, enrollmentCount:128, subtitle:"Master generics, decorators, and conditional types for production-grade TypeScript.", certificate:true },
  { slug:"uiux-research", title:"UI/UX Research Methods", category:"Design", difficulty:"intermediate" as const, rating:4.5, reviewCount:43, price:"Free", instructor:{ name:"Dr. Okonkwo", initials:"DO", bio:"UX researcher with 15 years in academia and industry.", rank:"Instructor" }, enrollmentCount:215, subtitle:"Complete research toolkit for designers.", certificate:false },
  { slug:"data-viz-d3", title:"Data Viz with D3", category:"Data Science", difficulty:"advanced" as const, rating:4.7, reviewCount:31, price:"₦12,500", instructor:{ name:"Kelechi Okonkwo", initials:"KO", bio:"Data visualization engineer at a leading fintech.", rank:"Instructor" }, enrollmentCount:89, subtitle:"Interactive charts and dashboards for the web.", certificate:true },
  { slug:"product-strategy", title:"Product Strategy 101", category:"Product", difficulty:"beginner" as const, rating:4.3, reviewCount:56, price:"Free", instructor:{ name:"Amara Obi", initials:"AO", bio:"Product leader with 8+ years at fast-growing startups.", rank:"Instructor" }, enrollmentCount:198, subtitle:"Learn to define vision, set OKRs, and prioritize.", certificate:false },
  { slug:"freelance-blueprint", title:"Freelance Business Blueprint", category:"Business", difficulty:"intermediate" as const, rating:4.6, reviewCount:89, price:"₦8,000", instructor:{ name:"Tunde Balogun", initials:"TB", bio:"Freelancer turned agency owner. Helped 500+ creatives launch.", rank:"Top Instructor" }, enrollmentCount:312, subtitle:"Pricing, contracts, and client management.", certificate:true },
];

function resolveCourse(slug: string) {
  const data = COURSES_DATA.find(c => c.slug === slug) ?? COURSES_DATA[0];
  return {
    ...data,
    enrolled: false,
    completed: false,
    certRequirements: { completion:"80%", quizScore:"70%", attendance:"60%" },
    curriculum: [
      { title:"Getting Started", lessons:[
        { title:"Welcome & Course Overview", type:"video" as const, duration:"4:32", freePreview:true },
        { title:"Setting Up Your Environment", type:"video" as const, duration:"8:15", freePreview:false },
        { title:"How the Web Works", type:"pdf" as const, duration:"12 min read", freePreview:false },
      ]},
      { title:"Core Concepts", lessons:[
        { title:"Components & Props", type:"video" as const, duration:"15:20", freePreview:false },
        { title:"State & Events", type:"video" as const, duration:"18:45", freePreview:false },
        { title:"Knowledge Check", type:"quiz" as const, duration:"10 questions", freePreview:false },
      ]},
      { title:"Building Projects", lessons:[
        { title:"Project: Hands-on Build", type:"assignment" as const, duration:"2-3 hours", freePreview:false },
        { title:"Live Code Review", type:"live" as const, duration:"60 min", freePreview:false },
      ]},
    ],
    reviews: [
      { id:"r1", author:{ name:"Kelechi Okonkwo", initials:"KO" }, rating:5, title:"Game-changing course", comment:"This course completely changed how I approach frontend. The instructor explains complex concepts in a way that just clicks.", createdAt:new Date(Date.now()-1209600000).toISOString(), helpfulCount:42, markedHelpful:false, instructorReply:{ comment:"Thank you! Your project was one of the best I've seen. Keep building!", createdAt:new Date(Date.now()-1036800000).toISOString() } },
      { id:"r2", author:{ name:"Tunde Balogun", initials:"TB" }, rating:4, title:"Great practical approach", comment:"Love the hands-on projects. Would love more advanced content in future updates.", createdAt:new Date(Date.now()-2592000000).toISOString(), helpfulCount:18, markedHelpful:false },
    ] as CourseReview[],
  };
}

const COURSE_TEMPLATE = resolveCourse("react-designers");

const LESSON_ICONS = { video:PlayIcon, pdf:File01Icon, live:LiveStreaming01Icon, quiz:CircleQuestionMarkIcon, assignment:AssignmentsIcon };
const diffColors = { beginner:"bg-emerald-100 text-emerald-700", intermediate:"bg-amber-100 text-amber-700", advanced:"bg-rose-100 text-rose-700" } as const;

function CourseLandingPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const params = useParams<{ courseId: string }>();
  const role = (sp.get("role") as Role) || "student";
  const COURSE = resolveCourse(params.courseId);
  const [expandedMods, setExpandedMods] = useState<Set<number>>(new Set([0]));

  const [reviews, setReviews] = useState<CourseReview[]>(COURSE.reviews);
  const [hasReviewed, setHasReviewed] = useState(false);
  const ratingDist = [5,4,3,2,1].map(stars=>({stars,count:reviews.filter(r=>r.rating===stars).length}));

  const toggleMod = (i:number) => { const next = new Set(expandedMods); if (next.has(i)) next.delete(i); else next.add(i); setExpandedMods(next); };

  const cta = COURSE.completed ? { label:"View Certificate", variant:"outline" as const }
    : COURSE.enrolled ? { label:"Continue Learning", variant:"default" as const }
    : COURSE.price==="Free" ? { label:"Enroll for Free", variant:"default" as const }
    : { label:"Proceed to Payment", variant:"default" as const };

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paying, setPaying] = useState(false);
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
    // Simulate backend generating Paystack link
    setTimeout(() => {
      setCheckoutOpen(false);
      setPaying(false);
      router.push(`/dashboard/payments?success=1&role=${role}`);
    }, 2000);
  };

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 min-w-0 max-w-4xl mx-auto">
        <button onClick={()=>router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground w-fit"><HugeiconsIcon icon={ArrowLeft02Icon} size={14}/>Back to Discover</button>

        {/* Banner */}
        <div className="aspect-[3/1] rounded-2xl bg-gradient-to-br from-muted/80 via-muted/40 to-muted flex items-center justify-center relative overflow-hidden">
          <HugeiconsIcon icon={BookOpen01Icon} size={64} className="text-muted-foreground/10 absolute"/>
          <Badge className={`absolute top-4 left-4 rounded-full text-[10px] px-2.5 py-0.5 h-6 font-medium ${diffColors[COURSE.difficulty]}`}>{COURSE.difficulty}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1"><h1 className="text-2xl font-bold">{COURSE.title}</h1><Badge variant="secondary" className="rounded-full">{COURSE.category}</Badge></div>
              <p className="text-sm text-muted-foreground leading-relaxed">{COURSE.subtitle}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                <span className="flex items-center gap-1"><HugeiconsIcon icon={StarIcon} size={14} className="text-amber-500 fill-amber-500"/>{COURSE.rating} ({COURSE.reviewCount} reviews)</span>
                <span><HugeiconsIcon icon={UserGroupIcon} size={14} className="inline mr-1"/>{COURSE.enrollmentCount} enrolled</span>
                {COURSE.certificate && <Badge className="rounded-full text-[10px] px-2 py-0 h-5 bg-amber-100 text-amber-700"><HugeiconsIcon icon={Award01Icon} size={11} className="mr-0.5"/>Certificate</Badge>}
              </div>
            </div>
            <Separator />

            {/* Curriculum */}
            <div>
              <h2 className="text-sm font-semibold mb-3">Curriculum ({COURSE.curriculum.length} modules)</h2>
              <div className="flex flex-col gap-2">
                {COURSE.curriculum.map((mod,mi)=>(
                  <Card key={mi} className="overflow-hidden">
                    <button onClick={()=>toggleMod(mi)} className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">Module {mi+1}</span><span className="text-sm font-medium">{mod.title}</span></div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><span>{mod.lessons.length} lessons</span><HugeiconsIcon icon={ArrowDown01Icon} size={12} className={`transition-transform ${expandedMods.has(mi)?"rotate-180":""}`} /></div>
                    </button>
                    {expandedMods.has(mi) && (
                      <div className="divide-y animate-in fade-in">
                        {mod.lessons.map((l,li)=>(
                          <div key={li} className="flex items-center gap-3 px-5 py-3 text-sm">
                            <HugeiconsIcon icon={LESSON_ICONS[l.type]} size={15} className="text-muted-foreground shrink-0"/>
                            <span className="flex-1 truncate">{l.title}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              {l.freePreview && <Badge variant="secondary" className="rounded-full text-[9px] px-1.5 py-0 h-4">Preview</Badge>}
                              {!COURSE.enrolled && !l.freePreview && <HugeiconsIcon icon={LockIcon} size={13} className="text-muted-foreground"/>}
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

              {/* Breakdown */}
              <RatingBreakdown
                rating={reviews.reduce((s,r)=>s+r.rating,0)/reviews.length}
                reviewCount={reviews.length}
                distribution={ratingDist}
              />

              {/* Review form (enrolled students who haven't reviewed) */}
              {COURSE.enrolled && !hasReviewed && (
                <div className="p-4 sm:p-5 rounded-xl border">
                  <ReviewForm
                    currentUser={{ name:"Temi Adebayo", initials:"TA" }}
                    onSubmit={(review) => {
                      setReviews(prev=>[review, ...prev]);
                      setHasReviewed(true);
                    }}
                  />
                </div>
              )}

              <Separator />

              {/* List */}
              <ReviewList
                reviews={reviews}
                onMarkHelpful={(id) => setReviews(prev=>prev.map(r=>r.id===id?{...r,markedHelpful:!r.markedHelpful,helpfulCount:r.helpfulCount+(r.markedHelpful?-1:1)}:r))}
                onFlag={() => {}}
              />
            </div>

            {/* Certificate */}
            {COURSE.certificate && (
              <>
                <Separator />
                <Card className="p-5 flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center shrink-0"><HugeiconsIcon icon={Award01Icon} size={22} className="text-amber-700 dark:text-amber-400"/></div>
                  <div>
                    <h3 className="text-sm font-semibold">Certificate of Completion</h3>
                    <p className="text-xs text-muted-foreground mt-1">Earn a certificate when you complete this course.</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span><HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} className="inline mr-1"/>{COURSE.certRequirements.completion} completion</span>
                      <span><HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} className="inline mr-1"/>{COURSE.certRequirements.quizScore} quiz score</span>
                      <span><HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} className="inline mr-1"/>{COURSE.certRequirements.attendance} attendance</span>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <Card className="p-5 flex flex-col gap-3 sticky top-24">
              <div className="flex items-center gap-3"><Avatar className="size-10 shrink-0"><AvatarFallback>{COURSE.instructor.initials}</AvatarFallback></Avatar><div><p className="text-sm font-semibold">{COURSE.instructor.name}</p><p className="text-[10px] text-muted-foreground">{COURSE.instructor.rank}</p></div></div>
              <p className="text-xs text-muted-foreground">{COURSE.instructor.bio}</p>
              <Separator />
              <div className="text-center"><p className="text-xl font-bold">{COURSE.price==="Free"?"Free":COURSE.price}</p><p className="text-[10px] text-muted-foreground">{COURSE.price==="Free"?"Full lifetime access":COURSE.price==="Free"?"":"One-time payment"}</p></div>
              <Button className="rounded-full w-full" variant={cta.variant} onClick={() => COURSE.price === "Free" ? router.push(`/dashboard/payments?success=1&role=${role}`) : setCheckoutOpen(true)} disabled={paying}>
                {paying ? <><span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />Processing...</> : isParent && !COURSE.enrolled ? `Pay for Student` : cta.label}
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">
                {isParent && !COURSE.enrolled
                  ? "Select which child to enroll during checkout"
                  : COURSE.enrolled
                  ? "You are enrolled"
                  : "Enroll now and start learning"}
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-md p-0 gap-0">
          <DialogHeader className="px-5 pt-5 pb-2"><DialogTitle>Checkout</DialogTitle></DialogHeader>
          <div className="px-5 pb-5 flex flex-col gap-4">
            {/* Student selector for parents */}
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
              <div className="flex items-center gap-2"><Input placeholder="Referral code (optional)" className="rounded-full text-sm flex-1"/><Button size="sm" variant="outline" className="rounded-full h-9 text-xs">Apply</Button></div>
              <Separator />
              <div className="flex items-center justify-between text-sm font-semibold"><span>Total</span><span>{COURSE.price}</span></div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border p-4 bg-muted/20">
              <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0"><HugeiconsIcon icon={CreditCardIcon} size={18}/></div>
              <div><p className="text-sm font-medium">Paystack</p><p className="text-xs text-muted-foreground">Card, Bank, USSD</p></div>
            </div>
          </div>
          <DialogFooter className="px-5 pb-5 gap-2">
            <Button variant="outline" className="rounded-full" onClick={()=>setCheckoutOpen(false)}>Cancel</Button>
            <Button className="rounded-full" onClick={handlePay} disabled={paying}>
              {paying ? <><span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />Redirecting to Paystack...</> : "Pay Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default function Wrapper(){return <Suspense fallback={<div className="p-6"><Skeleton className="h-48 rounded-2xl mb-6"/><Skeleton className="h-8 w-64 mb-4"/><Skeleton className="h-4 w-full"/></div>}><CourseLandingPage/></Suspense>;}
