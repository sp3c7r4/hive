"use client";

import { useGSAP } from "@gsap/react";
import {
  Certificate01Icon,
  CheckmarkCircle02Icon,
  Download01Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import gsap from "gsap";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  certificateNumber: string;
  verificationCode: string;
}

interface CertificatePreviewProps {
  data: CertificateData;
  onDownload: () => void;
  onShare: () => void;
}

export function CertificatePreview({
  data,
  onDownload,
  onShare,
}: CertificatePreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(cardRef.current, {
        scale: 0.9,
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: "back.out(1.4)",
      });
    },
    { scope: cardRef },
  );

  return (
    <div className="flex flex-col items-center gap-6 px-3 sm:px-4 py-6 sm:py-10 max-w-2xl mx-auto">
      {/* Certificate card */}
      <div
        ref={cardRef}
        className="relative w-full aspect-[1.4/1] rounded-2xl border-2 border-amber-200 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-amber-950/10 dark:via-background dark:to-amber-950/10 flex flex-col items-center justify-center p-6 sm:p-10 shadow-lg overflow-hidden"
      >
        {/* Decorative corners */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 size-6 sm:size-8 border-l-2 border-t-2 border-amber-300 dark:border-amber-500/30 rounded-tl-lg" />
        <div className="absolute top-3 right-3 sm:top-5 sm:right-5 size-6 sm:size-8 border-r-2 border-t-2 border-amber-300 dark:border-amber-500/30 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 size-6 sm:size-8 border-l-2 border-b-2 border-amber-300 dark:border-amber-500/30 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 size-6 sm:size-8 border-r-2 border-b-2 border-amber-300 dark:border-amber-500/30 rounded-br-lg" />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
          <HugeiconsIcon
            icon={Certificate01Icon}
            size={180}
            className="sm:size-[240px]"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center gap-1 sm:gap-2">
          <HugeiconsIcon
            icon={Certificate01Icon}
            size={24}
            className="sm:size-[32px] text-amber-500 mb-1"
          />

          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
            Certificate of Completion
          </p>

          <p className="text-[10px] sm:text-xs text-muted-foreground">
            This certifies that
          </p>

          <h2 className="text-lg sm:text-2xl font-bold text-foreground leading-tight">
            {data.studentName}
          </h2>

          <p className="text-[10px] sm:text-xs text-muted-foreground max-w-[280px]">
            has successfully completed the course
          </p>

          <h3 className="text-sm sm:text-lg font-bold text-foreground">
            {data.courseName}
          </h3>

          <div className="flex items-center gap-3 sm:gap-6 mt-2 sm:mt-3 text-[9px] sm:text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-foreground">Instructor:</span>
              {data.instructorName}
            </div>
            <span>·</span>
            <span>
              <span className="font-semibold text-foreground">Date:</span>{" "}
              {data.completionDate}
            </span>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-amber-200 dark:border-amber-800/20 w-full">
            <div className="flex items-center justify-between text-[8px] sm:text-[9px] text-muted-foreground">
              <span>Cert #{data.certificateNumber}</span>
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
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" className="rounded-full" onClick={onDownload}>
          <HugeiconsIcon icon={Download01Icon} size={15} className="mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" className="rounded-full" onClick={onShare}>
          <HugeiconsIcon icon={Share01Icon} size={15} className="mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
