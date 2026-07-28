"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AnimatedHero({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(useGSAP);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero-line", {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.18,
        })
          .from(
            ".hero-body",
            { autoAlpha: 0, y: 24, duration: 0.7 },
            "-=0.3"
          )
          .from(
            ".hero-cta",
            { autoAlpha: 0, scale: 0.85, duration: 0.6, ease: "back.out(1.7)" },
            "-=0.2"
          );
      });

      return () => mm.revert();
    },
    { scope }
  );

  return <div ref={scope}>{children}</div>;
}
