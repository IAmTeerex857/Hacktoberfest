"use client";

import { useEffect, useState } from "react";
import { SpotflowLogo } from "@/components/brand/logo";
import { SlideArrowButton, ThemeToggle } from "@/components/ui/buttons";
import { site } from "@/lib/site";

const links = [
  { href: "#tracks", label: "Tracks" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#why", label: "Why join" },
  { href: "#register", label: "Register" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:px-10">
        <div className="flex items-center gap-8">
          <a href="#top" aria-label="Spotflow, back to top" className="text-ink">
            <SpotflowLogo className="h-[22px] w-auto" />
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-[14px] text-muted transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <SlideArrowButton href={site.signupUrl} external size="sm" loadingLabel="Opening form…">
            Sign up
          </SlideArrowButton>
        </div>
      </div>
    </header>
  );
}
