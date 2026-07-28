"use client";

import { Suspense } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  UserGroupIcon,
  Globe02Icon,
  LockIcon,
  Mail01Icon,
  StarIcon,
  CourseIcon,
  BookOpen01Icon,
} from "@hugeicons/core-free-icons";

type Role = "instructor" | "student" | "parent" | "admin";

const COMMUNITY: {
  name:string; slug:string; category:string; visibility:string;
  description:string; memberCount:number; courseCount:number; rating:number; reviewCount:number;
  instructor:{ name:string; initials:string; bio:string; specialties:string[] };
  price:string; requiresApproval:boolean;
  courses:{ id:string; title:string; difficulty:"beginner"|"intermediate"|"advanced"; free:boolean }[];
} = {
  name:"Frontend Devs", slug:"frontend-devs", category:"Development", visibility:"public",
  description:"A community for frontend developers to share tips, tricks, and best practices. We cover React, Vue, CSS, Tailwind, TypeScript, and everything in between. Whether you're a beginner building your first component or a senior architect designing design systems, you'll find value here.\n\nWe host weekly code reviews, monthly workshops, and have an active chat where you can get unstuck in minutes. Members have access to exclusive courses, downloadable resources, and a network of 1,200+ developers.",
  memberCount:1248, courseCount:6, rating:4.8, reviewCount:89,
  instructor:{ name:"Ade Okafor", initials:"AO", bio:"Senior Frontend Engineer with 10+ years building for the web. Formerly at Google and Flutterwave. Passionate about teaching and making frontend accessible.", specialties:["React","TypeScript","Design Systems"] },
  price:"Free", requiresApproval:false,
  courses:[
    { id:"cr1", title:"React for Designers", difficulty:"beginner" as const, free:true },
    { id:"cr2", title:"Advanced TypeScript Patterns", difficulty:"advanced" as const, free:false },
    { id:"cr3", title:"CSS Mastery: From Flexbox to Grid", difficulty:"intermediate" as const, free:true },
    { id:"cr4", title:"Building Accessible UIs", difficulty:"intermediate" as const, free:false },
  ],
};

const visMeta = {
  public: { icon: Globe02Icon, label:"Public", color:"bg-emerald-100 text-emerald-700" },
  private: { icon: LockIcon, label:"Private", color:"bg-amber-100 text-amber-700" },
  "invite-only": { icon: Mail01Icon, label:"Invite Only", color:"bg-violet-100 text-violet-700" },
} as const;

const diffColors = { beginner:"bg-emerald-100 text-emerald-700", intermediate:"bg-amber-100 text-amber-700", advanced:"bg-rose-100 text-rose-700" } as const;

function CommunityLandingPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const role = (sp.get("role") as Role) || "student";
  const vm = visMeta[COMMUNITY.visibility as keyof typeof visMeta];

  const joinCta = (() => {
    if (COMMUNITY.visibility === "invite-only") return { label: "This community is invite-only", disabled: true, action: ()=>{} };
    if (COMMUNITY.requiresApproval) return { label: "Request to Join", disabled: false, action: ()=>router.push(`/dashboard/payments?success=1&role=${role}`) };
    if (COMMUNITY.price !== "Free") return { label: `Join for ${COMMUNITY.price}/month`, disabled: false, action: ()=>router.push(`/dashboard/payments?success=1&role=${role}`) };
    return { label: "Join Now", disabled: false, action: ()=>router.push(`/dashboard/payments?success=1&role=${role}`) };
  })();

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 min-w-0 max-w-4xl mx-auto">
        <button onClick={()=>router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground w-fit"><HugeiconsIcon icon={ArrowLeft02Icon} size={14}/>Back to Discover</button>

        {/* Banner */}
        <div className="aspect-[3/1] rounded-2xl bg-gradient-to-br from-muted/80 via-muted/40 to-muted flex items-center justify-center relative overflow-hidden">
          <span className="text-8xl opacity-10 font-black select-none absolute">{COMMUNITY.name.charAt(0)}</span>
          <Badge className={`absolute top-4 left-4 rounded-full text-[10px] px-2.5 py-0.5 h-6 font-medium ${vm.color}`}><HugeiconsIcon icon={vm.icon} size={12} className="mr-1"/>{vm.label}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1"><h1 className="text-2xl font-bold">{COMMUNITY.name}</h1><Badge variant="secondary" className="rounded-full">{COMMUNITY.category}</Badge></div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><HugeiconsIcon icon={StarIcon} size={14} className="text-amber-500 fill-amber-500"/>{COMMUNITY.rating} ({COMMUNITY.reviewCount} reviews)</span>
                <span><HugeiconsIcon icon={UserGroupIcon} size={14} className="inline mr-1"/>{COMMUNITY.memberCount.toLocaleString()} members</span>
                <span><HugeiconsIcon icon={BookOpen01Icon} size={14} className="inline mr-1"/>{COMMUNITY.courseCount} courses</span>
              </div>
            </div>
            <Separator />
            <div>
              <h2 className="text-sm font-semibold mb-2">About</h2>
              {COMMUNITY.description.split("\n\n").map((p,i)=><p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3">{p}</p>)}
            </div>
            <Separator />
            <div>
              <h2 className="text-sm font-semibold mb-3">Courses ({COMMUNITY.courses.length})</h2>
              <div className="flex flex-col gap-2">
                {COMMUNITY.courses.map((c)=>(
                  <div key={c.id} className="flex items-center justify-between rounded-xl border p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0"><HugeiconsIcon icon={CourseIcon} size={16} className="text-muted-foreground"/></div>
                      <div className="min-w-0"><p className="text-sm font-medium truncate">{c.title}</p><Badge className={`rounded-full text-[10px] px-1.5 py-0 h-4 mt-0.5 ${diffColors[c.difficulty]}`}>{c.difficulty}</Badge></div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!c.free && <HugeiconsIcon icon={LockIcon} size={14} className="text-muted-foreground"/>}
                      <span className="text-xs text-muted-foreground">{c.free?"Free":"Paid"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <Card className="p-5 flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Instructor</h3>
              <div className="flex items-center gap-3"><Avatar className="size-12 shrink-0"><AvatarFallback className="text-sm">{COMMUNITY.instructor.initials}</AvatarFallback></Avatar><div><p className="text-sm font-semibold">{COMMUNITY.instructor.name}</p><p className="text-xs text-muted-foreground line-clamp-3 mt-0.5">{COMMUNITY.instructor.bio}</p></div></div>
              <div className="flex flex-wrap gap-1">{COMMUNITY.instructor.specialties.map(s=><Badge key={s} variant="secondary" className="rounded-full text-[10px] px-2 py-0 h-5">{s}</Badge>)}</div>
            </Card>
            <Button className="rounded-full w-full" disabled={joinCta.disabled} onClick={joinCta.action}>{joinCta.label}</Button>
            {!joinCta.disabled && <p className="text-[10px] text-muted-foreground text-center -mt-2">{COMMUNITY.price==="Free"?"Instant access. No payment required.":""}</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function Wrapper(){return <Suspense fallback={<div className="p-6"><Skeleton className="h-48 rounded-2xl mb-6"/><Skeleton className="h-8 w-64 mb-4"/><Skeleton className="h-4 w-full mb-2"/><Skeleton className="h-4 w-3/4"/></div>}><CommunityLandingPage/></Suspense>;}
