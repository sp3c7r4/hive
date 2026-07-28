"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";

const navLinks = [
  "Course",
  "Programs",
  "Pricing",
  "About Us",
  "Blog",
  "Contact Us",
];

export default function LandingPageHeader() {
  const router = useRouter();

  return (
    <header className="w-full bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-6 lg:px-12 max-w-[1440px] mx-auto">
        {/* Left: Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.svg"
            alt="Hive"
            width={30}
            height={34}
            className="shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-bold text-foreground uppercase tracking-tight text-lg leading-none">
              HIVE
            </span>
            <span className="text-[11px] text-muted-foreground tracking-wide">
              Learn in Community
            </span>
          </div>
        </div>

        {/* Center: Nav links (desktop) */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: CTA (desktop) + Hamburger (mobile) */}
        <div className="flex items-center gap-3">
          <Button
            className="hidden lg:inline-flex rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold"
            onClick={() => router.push("/auth")}
          >
            Get Started
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="lg:hidden">
                  <HugeiconsIcon icon={Menu01Icon} size={20} />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />
            <SheetContent side="right" className="w-[280px] p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2.5 p-6 border-b border-border">
                  <Image
                    src="/logo.svg"
                    alt="Hive"
                    width={26}
                    height={30}
                    className="shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground uppercase tracking-tight text-base leading-none">
                      HIVE
                    </span>
                    <span className="text-[10px] text-muted-foreground tracking-wide">
                      Learn in Community
                    </span>
                  </div>
                </div>

                <nav className="flex-1 p-6">
                  <ul className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="flex items-center h-11 px-3 -mx-3 rounded-lg text-foreground font-medium hover:bg-muted transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="p-6 border-t border-border">
                  <Button
                    className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold"
                    onClick={() => router.push("/auth")}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
