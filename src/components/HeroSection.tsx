import { ChevronRightIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-24 lg:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left - Headline */}
        <h1 className="text-5xl lg:text-7xl leading-tight overflow-hidden">
          <span className="hero-line block text-foreground">Build Your</span>
          <span className="hero-line block">
            <span className="text-foreground">Hive. Grow </span>
            <span className="text-primary">Your Impact</span>
          </span>
        </h1>

        {/* Right - Supporting content */}
        <div className="flex flex-col gap-6 max-w-md lg:ml-auto">
          <p className="hero-body text-foreground/70 text-lg leading-relaxed">
            A community-driven learning platform where instructors build
            academies, students master skills, and knowledge creates
            opportunity.
          </p>
          <span className="hero-cta inline-block">
            <Button
              className="rounded-full w-fit"
              size="lg"
              render={<Link href="/auth" />}
            >
              Start Learning
              <span data-icon="inline-end">
                <HugeiconsIcon icon={ChevronRightIcon} size={16} />
              </span>
            </Button>
          </span>
        </div>
      </div>
    </section>
  );
}
