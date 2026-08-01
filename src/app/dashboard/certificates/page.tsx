"use client";

import {
  ArrowRight02Icon,
  Award01Icon,
  Certificate01Icon,
  CheckmarkCircle02Icon,
  Download01Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DashboardLayout } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Role = "instructor" | "student" | "parent" | "admin";

const CERTIFICATES = [
  {
    id: "cert1",
    courseName: "React for Designers",
    instructorName: "Ade Okafor",
    completionDate: "15 March 2025",
    certificateNumber: "HIVE-LK8X2M",
    verificationCode: "HV-LK8X2M",
  },
  {
    id: "cert2",
    courseName: "CSS Mastery: From Flexbox to Grid",
    instructorName: "Ade Okafor",
    completionDate: "3 February 2025",
    certificateNumber: "HIVE-9P4FRT",
    verificationCode: "HV-9P4FRT",
  },
];

function CertificatesPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const role = (sp.get("role") as Role) || "student";

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 max-w-4xl min-w-0">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Certificates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Certificates earned from completed courses.
          </p>
        </div>

        {CERTIFICATES.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-14 sm:size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <HugeiconsIcon
                icon={Certificate01Icon}
                size={24}
                className="sm:size-[28px] text-muted-foreground"
              />
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-1">
              No certificates yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Complete a course to earn your first certificate. Keep learning
              and your achievements will appear here.
            </p>
            <Button
              className="rounded-full"
              onClick={() => router.push("/dashboard/explore")}
            >
              Explore Courses
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={16}
                className="ml-1.5"
              />
            </Button>
          </div>
        ) : (
          /* Certificate grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CERTIFICATES.map((cert) => (
              <Card
                key={cert.id}
                className="p-5 group hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => router.push(`/verify/${cert.verificationCode}`)}
              >
                {/* Mini certificate preview */}
                <div className="aspect-[1.4/1] rounded-xl border border-amber-200 dark:border-amber-800/30 bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/10 dark:to-background flex flex-col items-center justify-center p-4 mb-4 relative overflow-hidden">
                  <HugeiconsIcon
                    icon={Certificate01Icon}
                    size={16}
                    className="text-amber-400 mb-1"
                  />
                  <p className="text-[8px] uppercase tracking-[0.12em] text-muted-foreground font-medium">
                    Certificate of Completion
                  </p>
                  <p className="text-xs font-bold mt-0.5 line-clamp-1">
                    {cert.courseName}
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    {cert.completionDate}
                  </p>
                  <div className="absolute bottom-2 right-3 text-[7px] text-muted-foreground flex items-center gap-1">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={8}
                      className="text-emerald-500"
                    />
                    Verified
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <h3 className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">
                      {cert.courseName}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Instructor: {cert.instructorName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      {cert.completionDate}
                    </span>
                    <span className="text-[9px] text-muted-foreground tabular-nums">
                      Cert #{cert.certificateNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full h-7 text-[10px] flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/verify/${cert.verificationCode}`);
                      }}
                    >
                      <HugeiconsIcon
                        icon={Award01Icon}
                        size={11}
                        className="mr-1"
                      />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full h-7 text-[10px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard?.writeText(
                          `${window.location.origin}/verify/${cert.verificationCode}`,
                        );
                      }}
                    >
                      <HugeiconsIcon icon={Share01Icon} size={11} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function Wrapper() {
  return (
    <Suspense
      fallback={
        <div className="p-6">
          <Skeleton className="h-8 w-40 mb-4" />
          <Skeleton className="h-4 w-56 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-[280px] rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <CertificatesPage />
    </Suspense>
  );
}
