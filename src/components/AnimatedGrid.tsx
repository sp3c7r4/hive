"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AnimatedGrid({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(useGSAP);

      let mm: gsap.MatchMedia | undefined;

      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          ScrollTrigger.batch(".grid-card", {
            onEnter: (elements) => {
              gsap.fromTo(
                elements,
                { autoAlpha: 0, y: 48, scale: 0.96 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.7,
                  stagger: 0.08,
                  ease: "power3.out",
                  overwrite: true,
                }
              );
            },
            start: "top 92%",
            once: true,
          });
        });
      });

      return () => {
        mm?.revert();
      };
    },
    { scope }
  );

  return <div ref={scope}>{children}</div>;
}
