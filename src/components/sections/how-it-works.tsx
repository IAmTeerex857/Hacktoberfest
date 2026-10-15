"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import "blobatar/gaze.css";
import { Slab, Stage, Upright } from "@/components/iso/iso";
import { SectionHeader } from "@/components/ui/section-header";
import { Callout, CurvedArrow, FrameNodes, Plus, Squiggle } from "@/components/ui/doodles";
import { site } from "@/lib/site";

const steps = [
  {
    title: "Sign up",
    body: "One signup. Choose your track and indicate your interest in the Lagos hackathon.",
    chip: "signups open",
  },
  {
    title: "Build online",
    body: "Build useful tools with AI and payment APIs, contribute to open source, and connect with other developers.",
    chip: "+1 PR merged",
  },
  {
    title: "Get selected",
    body: `${site.builders} builders are selected for the Lagos hackathon. Physical attendance is subject to selection.`,
    chip: `${site.builders} selected`,
  },
  {
    title: "Hack in Lagos",
    body: `Two days, ${site.eventDates}. Lots of swag and prizes to be won.`,
    chip: `Lagos · ${site.eventDatesShort}`,
  },
];

const HANDLES = [
  "ada.dev", "tobi", "chioma", "kelechi", "zainab", "seun", "ifeoma", "dami", "musa", "bisola", "emeka", "halima",
  "tunde", "ngozi", "yusuf", "amaka", "segun", "fola", "uche", "kemi", "ibrahim", "nneka", "dayo", "aisha",
  "obinna", "temi", "chidi", "ronke", "sani", "ebuka", "lola", "kunle", "adaeze", "farouk", "toyin", "ikenna",
];
const NOT_SELECTED = new Set([3, 8, 13, 22, 27, 34]);
// OKLCH hues: brand blues and greens.
const HUES = [262, 155, 245, 145, 270, 165];

const COLS = 6;
const TILE = 40;
const GAP = 10;
const PLATE = COLS * TILE + (COLS - 1) * GAP + 28;
const STEP_MS = 4200;

function Pool({ step }: { step: number }) {
  return (
    <Stage size={PLATE} className="h-[380px] md:h-[440px]">
      <Slab x={0} y={0} w={PLATE} h={PLATE} depth={14} radius={12} tone="sunken" topClassName="dot-grid">
        <AnimatePresence>
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-2 left-3 font-mono text-[11px] font-semibold tracking-[0.2em] text-blue"
            >
              LAGOS · {site.eventDatesShort.toUpperCase()}
            </motion.div>
          )}
        </AnimatePresence>
      </Slab>

      {HANDLES.map((name, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x = 14 + col * (TILE + GAP);
        const y = 14 + row * (TILE + GAP);
        const selected = !NOT_SELECTED.has(i);
        const lit =
          step === 1 ? "var(--green)" : step >= 2 && selected ? "var(--blue)" : undefined;
        const raised = step >= 2 && selected ? 22 : 14;
        const delay = (row + col) * 0.035;

        return (
          <div key={name}>
            <Slab
              x={x}
              y={y}
              w={TILE}
              h={TILE}
              depth={6}
              radius={6}
              top={lit}
              initial={false}
              animate={{ z: raised }}
              transition={{ type: "spring", stiffness: 300, damping: 22, delay }}
            />
            <Upright
              x={x + TILE / 2}
              y={y + TILE / 2}
              initial={false}
              animate={{ z: step === 3 && selected ? [raised + 6, raised + 24, raised + 6] : raised + 6 }}
              transition={
                step === 3 && selected
                  ? { duration: 0.6, delay: delay * 2, repeat: Infinity, repeatDelay: 1.6 }
                  : { type: "spring", stiffness: 300, damping: 22, delay }
              }
            >
              <motion.div
                key={step === 0 ? "drop" : "stay"}
                initial={step === 0 ? { y: -60, opacity: 0 } : false}
                animate={{ y: 0, opacity: step >= 2 && !selected ? 0.25 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: step === 0 ? i * 0.03 : 0 }}
                className="pb-0.5"
              >
                <Blobatar name={name} size={30} hue={HUES[i % HUES.length]} animate="always" />
              </motion.div>
            </Upright>
          </div>
        );
      })}
    </Stage>
  );
}

function Mascot() {
  const { ref } = useGaze({ travel: 3, lookAt: "pointer" });
  return (
    <div className="relative hidden md:block">
      <Blobatar ref={ref} name="spotflow-builder" size={112} hue={262} animate="always" title="A blobatar builder" />
      <Callout label="that's you, probably" className="-left-40 top-2" />
    </div>
  );
}

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

  const choose = (i: number) => {
    setStep(i);
    setTick((t) => t + 1);
  };

  return (
    <section id="how-it-works" className="frame hairline-t relative scroll-mt-16">
      <FrameNodes />
      <Plus className="left-6 top-8 hidden md:block" />
      <Squiggle className="bottom-10 left-[38%] hidden lg:block" width={72} />

      <div className="flex items-end justify-between gap-8 px-5 pb-12 pt-20 md:px-12 md:pb-14 md:pt-28">
        <SectionHeader index="02" eyebrow="How it works" title="Start online. Finish in Lagos.">
          One signup gets you in. Build from anywhere, and you could be one of {site.builders} builders in the room.
        </SectionHeader>
        <Mascot />
      </div>

      <div ref={wrap} className="hairline-t grid md:grid-cols-[0.9fr_1.1fr]">
        <ol className="flex flex-col border-line md:border-r">
          {steps.map((s, i) => {
            const active = i === step;
            return (
              <li key={s.title} className="relative border-b border-line last:border-b-0">
                <button
                  type="button"
                  onClick={() => choose(i)}
                  aria-current={active ? "step" : undefined}
                  className="group flex w-full gap-5 px-6 py-6 text-left transition-colors hover:bg-surface md:px-10"
                >
                  <span
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-[12px] transition-colors ${
                      active ? "border-ink bg-ink text-bg" : "border-line-strong text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className={`text-[18px] font-semibold tracking-[-0.01em] transition-colors ${active ? "text-ink" : "text-muted group-hover:text-ink"}`}>
                      {s.title}
                    </span>
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden text-[15px] leading-relaxed text-muted"
                        >
                          {s.body}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
                {active && !reduced && (
                  <motion.span
                    key={`${step}-${tick}`}
                    className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-blue"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: inView ? 1 : 0 }}
                    transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="relative overflow-hidden">
          <CurvedArrow className="left-6 top-8 hidden lg:block" width={90} />
          <div className="absolute right-5 top-5 z-10">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={step}
                initial={{ y: 12, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -12, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[12px] font-medium ${
                  step === 1 ? "bg-green text-white dark:text-[#04140c]" : step >= 2 ? "bg-blue text-white" : "border border-line bg-surface text-ink"
                }`}
              >
                <span className="size-1.5 rounded-full bg-current" />
                {steps[step].chip}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="origin-center scale-[0.82] sm:scale-100">
            <Pool step={step} />
          </div>
        </div>
      </div>
    </section>
  );
}
