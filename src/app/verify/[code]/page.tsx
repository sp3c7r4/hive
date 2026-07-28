"use client";

import { Suspense, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Certificate01Icon,
  CheckmarkCircle02Icon,
  ArrowLeft02Icon,
  Share01Icon,
  Download01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const VERIFIED_CERTS: Record<
  string,
  {
    studentName: string;
    courseName: string;
    instructorName: string;
    completionDate: string;
    certificateNumber: string;
  }
> = {
  "hv-lk8x2m": {
    studentName: "Temi Adebayo",
    courseName: "React for Designers",
    instructorName: "Ade Okafor",
    completionDate: "15 March 2025",
    certificateNumber: "HIVE-LK8X2M",
  },
  "hv-9p4frt": {
    studentName: "Temi Adebayo",
    courseName: "CSS Mastery: From Flexbox to Grid",
    instructorName: "Ade Okafor",
    completionDate: "3 February 2025",
    certificateNumber: "HIVE-9P4FRT",
  },
};

function VerifyPage() {
  const params = useParams();
  const cardRef = useRef<HTMLDivElement>(null);
  const code = (params.code as string)?.toLowerCase();
  const cert = VERIFIED_CERTS[code];

  useGSAP(
    () => {
      if (!cardRef.current) return;
      gsap.from(cardRef.current, {
        scale: 0.92,
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "back.out(1.3)",
      });
    },
    { scope: cardRef }
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
        hive.edu
      </Link>

      {cert ? (
        <div ref={cardRef} className="flex flex-col items-center gap-5 max-w-lg w-full">
          {/* Verified badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            <span className="text-xs font-semibold">Verified Certificate</span>
          </div>

          {/* Certificate card */}
          <div className="w-full aspect-[1.4/1] rounded-2xl border-2 border-amber-200 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-amber-950/10 dark:via-background dark:to-amber-950/10 flex flex-col items-center justify-center p-6 sm:p-10 shadow-lg relative overflow-hidden">
            {/* Decorative corners */}
            <div className="absolute top-5 left-5 size-8 border-l-2 border-t-2 border-amber-300 dark:border-amber-500/30 rounded-tl-lg" />
            <div className="absolute top-5 right-5 size-8 border-r-2 border-t-2 border-amber-300 dark:border-amber-500/30 rounded-tr-lg" />
            <div className="absolute bottom-5 left-5 size-8 border-l-2 border-b-2 border-amber-300 dark:border-amber-500/30 rounded-bl-lg" />
            <div className="absolute bottom-5 right-5 size-8 border-r-2 border-b-2 border-amber-300 dark:border-amber-500/30 rounded-br-lg" />

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
              <HugeiconsIcon icon={Certificate01Icon} size={200} />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center gap-2">
              <HugeiconsIcon
                icon={Certificate01Icon}
                size={32}
                className="text-amber-500 mb-1"
              />

              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                Certificate of Completion
              </p>

              <p className="text-xs text-muted-foreground">This certifies that</p>

              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {cert.studentName}
              </h2>

              <p className="text-xs text-muted-foreground">
                has successfully completed the course
              </p>

              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {cert.courseName}
              </h3>

              <div className="flex items-center gap-4 sm:gap-6 mt-2 text-[10px] text-muted-foreground">
                <div>
                  <span className="font-semibold text-foreground">
                    Instructor:{" "}
                  </span>
                  {cert.instructorName}
                </div>
                <span>·</span>
                <span>
                  <span className="font-semibold text-foreground">Date: </span>
                  {cert.completionDate}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800/20 w-full flex items-center justify-between text-[9px] text-muted-foreground">
                <span>Cert #{cert.certificateNumber}</span>
                <span className="flex items-center gap-1">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={10}
                    className="text-emerald-500"
                  />
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-full" onClick={() => window.print()}>
              <HugeiconsIcon icon={Download01Icon} size={15} className="mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() =>
                navigator.clipboard?.writeText(window.location.href)
              }
            >
              <HugeiconsIcon icon={Share01Icon} size={15} className="mr-2" />
              Copy Link
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground text-center">
            Issued by Hive — verified at{" "}
            <span className="font-medium">{window.location.host}</span>
          </p>
        </div>
      ) : (
        /* Not found */
        <div className="flex flex-col items-center gap-5 max-w-sm text-center">
          <div className="size-16 rounded-2xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center">
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={28}
              className="text-rose-500"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold">Certificate Not Found</h1>
            <p className="text-sm text-muted-foreground mt-1">
              The verification code <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{params.code}</code> does not match any
              certificate. It may have been revoked or never existed.
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="rounded-full">
              Back to Hive
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Wrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="size-12 rounded-full border-4 border-muted border-t-primary animate-spin" />
        </div>
      }
    >
      <VerifyPage />
    </Suspense>
  );
}
