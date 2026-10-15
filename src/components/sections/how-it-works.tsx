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
const STEP_MS = 5000;
// Blocks land bottom-up, one on top of the other, before the steps start cycling.
const DROP_GAP = 0.22;
const LANDED_MS = 1500;
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function HowItWorks() {
  const [step, setStep] = useState(0);
  const [tick, setTick] = useState(0);
  const [landed, setLanded] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { margin: "-20% 0px" });
  const arrived = useInView(wrap, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!arrived) return;
    const id = setTimeout(() => setLanded(true), reduced ? 0 : LANDED_MS);
    return () => clearTimeout(id);
  }, [arrived, reduced]);

  useEffect(() => {
    if (!inView || !landed || reduced) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % steps.length), STEP_MS);
    return () => clearTimeout(id);
  }, [step, tick, inView, landed, reduced]);

  const Scene = SCENES[step];

  const choose = (i: number) => {
    setStep(i);
    setTick((t) => t + 1);
  };

  return (
    <section id="how-it-works" className="frame relative scroll-mt-16 px-5 py-17 md:px-10 md:py-23">
      <SectionHeader index="02" eyebrow="How it works" title="Start online. Finish in Lagos.">
        One signup gets you in. Build from anywhere, and you could be one of {site.builders} builders in the room.
      </SectionHeader>

      <div ref={wrap} className="mt-14 grid items-center gap-10 md:mt-20 lg:grid-cols-2 lg:gap-16">
        <ol className="flex flex-col gap-3.5">
          {steps.map((s, i) => {
            const active = i === step;
            // Balance-scale settle: the active block dips on one side, then the
            // other, before coming level. Alternates direction step to step.
            const dir = i % 2 === 0 ? -1 : 1;
            return (
              <motion.li
                key={s.title}
                initial={reduced ? false : { y: -140, opacity: 0 }}
                animate={arrived || reduced ? { y: 0, opacity: 1 } : undefined}
                transition={{
                  y: { type: "spring", stiffness: 170, damping: 19, mass: 1.1, delay: (steps.length - 1 - i) * DROP_GAP },
                  opacity: { duration: 0.25, delay: (steps.length - 1 - i) * DROP_GAP },
                }}
              >
                <motion.button
                  type="button"
                  onClick={() => choose(i)}
                  aria-current={active ? "step" : undefined}
                  animate={{ rotate: active && landed && !reduced ? [0, 2.4 * dir, -1.5 * dir, 0.6 * dir, 0] : 0 }}
                  transition={{ duration: 1.3, ease: [0.45, 0, 0.25, 1], times: [0, 0.25, 0.55, 0.8, 1] }}
                  className={`group flex w-full origin-center gap-5 rounded-2xl border px-6 py-5 text-left transition-colors duration-500 ${
                    active ? "border-blue bg-surface" : "border-line bg-surface-2 hover:bg-surface"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-[12px] font-semibold transition-colors duration-500 ${
                      active ? "bg-blue text-white" : "bg-line text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span
                      className={`text-[17px] font-semibold tracking-[-0.01em] transition-colors duration-500 ${
                        active ? "text-ink" : "text-ink-2"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      className={`text-[14.5px] leading-relaxed transition-colors duration-500 ${
                        active ? "text-muted" : "text-faint"
                      }`}
                    >
                      {s.body}
                    </span>
                  </span>
                </motion.button>
              </motion.li>
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
