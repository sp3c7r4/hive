import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  WebDesignIcon,
  MotionIcon,
  Megaphone01Icon,
  Layout04Icon,
  WebProgrammingIcon,
} from "@hugeicons/core-free-icons";

export interface GridImages {
  webDesign: string;
  motionDesign: string;
  digitalMarketing: string;
  designSystem: string;
  webDevelopment: string;
}

/* ------------------------------------------------------------------ */
/*  Subtle texture overlay for stat cards                             */
/* ------------------------------------------------------------------ */
function StatTexture() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 30%, white 2px, transparent 2px)",
          backgroundSize: "40px 40px",
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Portrait card: full-bleed photo + category badge overlay          */
/* ------------------------------------------------------------------ */
function PortraitCard({
  imageUrl,
  badgeLabel,
  icon,
  tall,
}: {
  imageUrl: string;
  badgeLabel: string;
  icon: IconSvgElement;
  tall?: boolean;
}) {
  return (
    <Card
      className={`p-0 overflow-hidden rounded-3xl relative flex-1 ${
        tall ? "aspect-[3/4]" : "aspect-[4/5]"
      }`}
    >
      <img
        src={imageUrl}
        alt={badgeLabel}
        className="w-full h-full object-cover"
      />
      <Badge
        variant="secondary"
        className="rounded-full gap-1.5 absolute top-4 left-4 bg-white/90 text-foreground backdrop-blur-sm border-white/30 scale-110 origin-top-left"
      >
        <span data-icon="inline-start">
          <HugeiconsIcon icon={icon} size={18} />
        </span>
        {badgeLabel}
      </Badge>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat card: solid color + texture + big number                     */
/* ------------------------------------------------------------------ */
function StatCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: "orange" | "purple";
}) {
  return (
    <Card
      className={`p-0 overflow-hidden rounded-3xl relative flex flex-col items-center justify-center aspect-[4/3] ${
        color === "orange" ? "bg-orange-500" : "bg-purple-600"
      }`}
    >
      <StatTexture />
      <span className="text-5xl font-black text-white relative z-10 tracking-tight">
        {value}
      </span>
      <span className="text-white/80 text-sm font-semibold relative z-10 mt-1 tracking-wide uppercase">
        {label}
      </span>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Card data for both layouts                                        */
/* ------------------------------------------------------------------ */
function Portrait({ images }: { images: GridImages }) {
  return (
    <>
      <div className="grid-card">
        <PortraitCard imageUrl={images.webDesign} badgeLabel="Web Design" icon={WebDesignIcon} tall />
      </div>
      <div className="grid-card">
        <StatCard value="10K+" label="Learners" color="orange" />
      </div>
      <div className="grid-card">
        <PortraitCard imageUrl={images.motionDesign} badgeLabel="Motion Design" icon={MotionIcon} />
      </div>
      <div className="grid-card">
        <PortraitCard imageUrl={images.digitalMarketing} badgeLabel="Digital Marketing" icon={Megaphone01Icon} tall />
      </div>
      <div className="grid-card">
        <PortraitCard imageUrl={images.designSystem} badgeLabel="Design System" icon={Layout04Icon} />
      </div>
      <div className="grid-card">
        <StatCard value="92%" label="Course Completion" color="purple" />
      </div>
      <div className="grid-card">
        <PortraitCard imageUrl={images.webDevelopment} badgeLabel="Web Development" icon={WebProgrammingIcon} tall />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main grid                                                         */
/* ------------------------------------------------------------------ */
export default function BalancedBox({ images }: { images: GridImages }) {
  return (
    <section className="w-full pb-16 lg:pb-24">
      {/* Mobile / tablet: stacked layout */}
      <div className="flex flex-col gap-4 px-6 sm:grid sm:grid-cols-2 sm:px-8 lg:hidden">
        <Portrait images={images} />
      </div>

      {/* Desktop: 5-column staggered flex */}
      <div className="hidden lg:flex gap-4 px-6 lg:px-12">
        {/* Col 1: Portrait (tall) */}
        <div className="flex-1 flex flex-col min-w-0 grid-card">
          <PortraitCard imageUrl={images.webDesign} badgeLabel="Web Design" icon={WebDesignIcon} tall />
        </div>

        {/* Col 2: Stat + Portrait (stacked) */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="grid-card">
            <StatCard value="10K+" label="Learners" color="orange" />
          </div>
          <div className="grid-card">
            <PortraitCard imageUrl={images.motionDesign} badgeLabel="Motion Design" icon={MotionIcon} />
          </div>
        </div>

        {/* Col 3: Portrait (tall, offset) */}
        <div className="flex-1 flex flex-col pt-16 min-w-0 grid-card">
          <PortraitCard imageUrl={images.digitalMarketing} badgeLabel="Digital Marketing" icon={Megaphone01Icon} tall />
        </div>

        {/* Col 4: Portrait + Stat (stacked) */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="grid-card">
            <PortraitCard imageUrl={images.designSystem} badgeLabel="Design System" icon={Layout04Icon} />
          </div>
          <div className="grid-card">
            <StatCard value="92%" label="Course Completion" color="purple" />
          </div>
        </div>

        {/* Col 5: Portrait (tall) */}
        <div className="flex-1 flex flex-col min-w-0 grid-card">
          <PortraitCard imageUrl={images.webDevelopment} badgeLabel="Web Development" icon={WebProgrammingIcon} tall />
        </div>
      </div>
    </section>
  );
}
