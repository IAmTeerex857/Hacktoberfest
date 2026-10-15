"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { SectionHeader } from "@/components/ui/section-header";
import { site } from "@/lib/site";
import { BuildScene, LagosScene, SelectScene, SignUpScene } from "./step-scenes";

const steps = [
  {
    title: "Sign up",
    body: "One signup. Choose your track and indicate your interest in the Lagos hackathon.",
  },
  {
    title: "Build online",
    body: "Build useful tools with AI and payment APIs, contribute to open source, and connect with other developers.",
  },
  {
    title: "Get selected",
    body: `${site.builders} builders are selected for the Lagos hackathon. Physical attendance is subject to selection.`,
  },
  {
    title: "Hack in Lagos",
    body: `Two days, ${site.eventDates}. Lots of swag and prizes to be won.`,
  },
];

const SCENES = [SignUpScene, BuildScene, SelectScene, LagosScene];
const STEP_MS = 6500;
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function HowItWorks() {
  const [step, setStep] = useState(0);
  const [tick, setTick] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { margin: "-20% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % steps.length), STEP_MS);
    return () => clearTimeout(id);
  }, [step, tick, inView, reduced]);

  const Scene = SCENES[step];

  const choose = (i: number) => {
    setStep(i);
    setTick((t) => t + 1);
  };

  return (
    <section id="how-it-works" className="frame relative scroll-mt-16 px-5 py-19 md:px-10 md:py-26">
      <SectionHeader index="02" eyebrow="How it works" title="Start online. Finish in Lagos.">
        One signup gets you in. Build from anywhere, and you could be one of {site.builders} builders in the room.
      </SectionHeader>

      <div ref={wrap} className="mt-14 grid items-center gap-10 md:mt-20 lg:grid-cols-2 lg:gap-16">
        <ol className="flex flex-col gap-2">
          {steps.map((s, i) => {
            const active = i === step;
            return (
              <li key={s.title} className="relative">
                {active && (
                  <motion.span
                    layoutId="step-highlight"
                    className="absolute inset-0 rounded-2xl border border-line bg-surface"
                    transition={{ type: "spring", stiffness: 110, damping: 22 }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => choose(i)}
                  aria-current={active ? "step" : undefined}
                  className="group relative flex w-full gap-5 rounded-2xl px-6 py-5 text-left"
                >
                  <span
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-[12px] transition-colors duration-500 ${
                      active ? "border-ink bg-ink text-bg" : "border-line-strong text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex flex-col">
                    <span
                      className={`text-[18px] font-semibold tracking-[-0.01em] transition-colors duration-500 ${
                        active ? "text-ink" : "text-muted group-hover:text-ink"
                      }`}
                    >
                      {s.title}
                    </span>
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.7, ease }}
                          className="overflow-hidden"
                        >
                          <span className="block pt-2 text-[15px] leading-relaxed text-muted">{s.body}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="relative flex h-[420px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-line bg-surface-2 lg:max-w-[520px] lg:justify-self-end">
          <div className="dot-grid absolute inset-0 opacity-50" aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98, transition: { duration: 0.25, ease } }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="relative"
              aria-hidden="true"
            >
              <Scene />
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-5 flex items-center gap-1.5" aria-hidden="true">
            {steps.map((s, i) => (
              <motion.span
                key={s.title}
                animate={{ width: i === step ? 22 : 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className={`h-1.5 rounded-full ${i === step ? "bg-ink" : "bg-line-strong"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
