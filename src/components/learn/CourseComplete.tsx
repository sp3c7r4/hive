"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Award01Icon,
  StarIcon,
  ArrowLeft02Icon,
  Share01Icon,
  Certificate01Icon,
} from "@hugeicons/core-free-icons";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CertificatePreview } from "./CertificatePreview";

interface CourseCompleteProps {
  courseTitle: string;
  role: string;
}

export function CourseComplete({ courseTitle, role }: CourseCompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const certData = {
    studentName: "Temi Adebayo",
    courseName: courseTitle,
    completionDate: new Date().toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    instructorName: "Ade Okafor",
    certificateNumber: `HIVE-${Date.now().toString(36).toUpperCase()}`,
    verificationCode: `HV-${Date.now().toString(36).toUpperCase()}`,
  };

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from(".complete-badge", {
        scale: 0,
        rotation: -20,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      })
        .from(
          ".complete-text",
          { y: 20, opacity: 0, duration: 0.4 },
          "-=0.2"
        )
        .from(
          ".complete-actions",
          { y: 16, opacity: 0, duration: 0.35, stagger: 0.08 },
          "-=0.1"
        )
        .from(
          ".confetti-piece",
          {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            stagger: { each: 0.04, from: "random" },
            ease: "back.out(2)",
          },
          "-=0.5"
        );
    },
    { scope: containerRef }
  );

  /* Confetti pieces */
  const confettiColors = [
    "bg-primary", "bg-emerald-500", "bg-blue-500",
    "bg-violet-500", "bg-rose-500", "bg-amber-500",
  ];

  if (showCertificate) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center gap-2 px-4 pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={() => setShowCertificate(false)}
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="mr-1" />
            Back
          </Button>
        </div>
        <CertificatePreview
          data={certData}
          onDownload={() => {}}
          onShare={() => {
            navigator.clipboard?.writeText(
              `${window.location.origin}/verify/${certData.verificationCode}`
            );
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden"
    >
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece absolute w-2 h-3 rounded-sm opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-out forwards`,
              animationDelay: `${Math.random() * 0.8}s`,
            }}
          >
            <div className={`w-full h-full rounded-sm ${confettiColors[i % confettiColors.length]}`} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Badge */}
        <div className="complete-badge size-20 sm:size-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 sm:mb-6">
          <HugeiconsIcon icon={Award01Icon} size={36} className="sm:size-[48px] text-primary" />
        </div>

        {/* Text */}
        <div className="complete-text">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Course Complete!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 max-w-xs">
            Congratulations! You have successfully completed{" "}
            <span className="font-semibold text-foreground">{courseTitle}</span>.
          </p>
        </div>

        {/* Actions */}
        <div className="complete-actions flex flex-col items-center gap-2.5 sm:gap-3 mt-6 sm:mt-8 w-full">
          <Card className="p-3 sm:p-4 w-full flex items-center gap-3 bg-primary/5 border-primary/20">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Certificate01Icon} size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0 text-center">
              <p className="text-sm font-semibold">Certificate Available</p>
              <p className="text-xs text-muted-foreground">
                You qualify for a certificate of completion
              </p>
            </div>
          </Card>

          <Button className="rounded-full w-full complete-actions" size="lg" onClick={() => setShowCertificate(true)}>
            <HugeiconsIcon icon={Award01Icon} size={16} className="mr-2" />
            Claim Certificate
          </Button>

          <Button variant="outline" className="rounded-full w-full complete-actions">
            <HugeiconsIcon icon={StarIcon} size={15} className="mr-2" />
            Leave a Review
          </Button>

          <Button variant="ghost" className="rounded-full w-full complete-actions" render={
            <Link href={`/dashboard/my-courses?role=${role}`}>
              <HugeiconsIcon icon={ArrowLeft02Icon} size={15} className="mr-2" />
              Back to My Courses
            </Link>
          } />

          <Button
            variant="ghost"
            size="sm"
            className="rounded-full complete-actions text-muted-foreground"
            onClick={() => {
              navigator.clipboard?.writeText(
                `${window.location.origin}/verify/${certData.verificationCode}`
              );
            }}
          >
            <HugeiconsIcon icon={Share01Icon} size={14} className="mr-1.5" />
            Share Achievement
          </Button>
        </div>
      </div>

      {/* Confetti animation styles */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
