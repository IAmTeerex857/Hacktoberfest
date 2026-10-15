"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { motion, type Variants } from "motion/react";
import { Layers } from "lucide-react";
import { InlineLoader, TextLoader } from "generative-loaders";
import { SlideArrowButton, SparkleButton } from "@/components/ui/buttons";
import { Crosshair, Plus } from "@/components/ui/doodles";
import { site } from "@/lib/site";

function SceneLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-3 text-faint md:justify-end md:pr-[18%]">
      <InlineLoader variant="pixel-drift" size={18} color="currentColor" label="Loading payment rail" />
      <span className="font-mono text-xs">
        <TextLoader text="booting payment rail…" variant="terminal" color="currentColor" />
      </span>
    </div>
  );
}

const PaymentRail = dynamic(() => import("./payment-rail"), { ssr: false, loading: SceneLoading });

function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const rise: Variants = {
  hidden: { y: "105%" },
  shown: (i: number) => ({ y: 0, transition: { duration: 0.8, delay: 0.1 + i * 0.07, ease: EASE } }),
};

const fade = (delay: number) =>
  ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE },
  }) as const;

const headline = [["Build", "the", "next"], ["payment", "workflow."]];

export function Hero() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const compact = useMedia("(max-width: 767px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const sceneRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- theme is only known on the client
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let word = 0;

  return (
    <section
      id="top"
      className="relative isolate flex flex-col overflow-hidden md:block md:h-[clamp(660px,calc(100svh-4rem),900px)]"
    >
      {/* 3D scene: bleeds a little past the content column and fades out at the edges */}
      <div
        className="pointer-events-none relative order-last h-[420px] md:absolute md:inset-y-0 md:left-1/2 md:h-auto md:w-full md:max-w-[1400px] md:-translate-x-1/2"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 7%, #000 97.5%, transparent), linear-gradient(180deg, transparent, #000 2%, #000 94.5%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 7%, #000 97.5%, transparent), linear-gradient(180deg, transparent, #000 2%, #000 94.5%, transparent)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
        aria-hidden="true"
      >
        <div ref={sceneRef} className="h-full w-full">
          {mounted && (
            <PaymentRail
              theme={resolvedTheme === "dark" ? "dark" : "light"}
              compact={compact}
              reduced={reduced}
              active={inView}
            />
          )}
        </div>
      </div>

      <div className="frame relative z-10 px-5 pb-8 pt-16 md:px-10 md:pb-24 md:pt-24">
        <Crosshair className="-left-2 top-6 hidden xl:block" />
        <Plus className="right-4 top-10 hidden md:block" />
        <div className="flex flex-col md:max-w-[860px]">
          <motion.div {...fade(0)} className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1.5 pr-3.5">
            <span className="rounded-full bg-green px-2 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-white dark:text-[#04140c]">
              Open
            </span>
            <span className="font-mono text-[12px] text-ink-2">
              <TextLoader text="Agentic Payments & DevEx Challenge" variant="decode" color="currentColor" />
            </span>
          </motion.div>

          <h1 className="text-[clamp(2.6rem,6.4vw,4.9rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink">
            {headline.map((line, li) => (
              <span key={li} className="block">
                {line.map((w) => {
                  const i = word++;
                  return (
                    <span key={w} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                      <motion.span
                        className={`inline-block ${li === 1 ? "text-blue" : ""}`}
                        variants={rise}
                        initial="hidden"
                        animate="shown"
                        custom={i}
                      >
                        {w}
                      </motion.span>
                      {" "}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p {...fade(0.45)} className="mt-8 max-w-[540px] text-[17px] leading-relaxed text-muted md:text-lg">
            Join the Spotflow Agentic Payments &amp; DevEx Challenge. Build useful tools with AI and payment APIs,
            contribute to open source, and connect with other developers.
          </motion.p>
          <motion.p {...fade(0.55)} className="mt-4 max-w-[540px] text-[17px] leading-relaxed text-muted md:text-lg">
            Start online, with an opportunity to join{" "}
            <strong className="font-semibold text-ink">
              {site.builders} selected builders for a two-day hackathon in Lagos.
            </strong>
          </motion.p>

          <motion.div {...fade(0.65)} className="mt-10 flex flex-wrap items-center gap-3">
            <SlideArrowButton href={site.signupUrl} external size="lg" loadingLabel="Opening form…">
              Sign up now
            </SlideArrowButton>
            <SparkleButton href="#tracks" icon={<Layers className="size-4" />} size="lg" variant="secondary">
              Explore the tracks
            </SparkleButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
