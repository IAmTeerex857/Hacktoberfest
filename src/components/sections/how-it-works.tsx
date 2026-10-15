"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Blobatar } from "@blobatar/react";
import { Slab, Stage, Upright } from "@/components/iso/iso";
import { SectionHeader } from "@/components/ui/section-header";
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
    chip: "contributions rolling in",
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
  "ada.dev", "tobi", "chioma", "kelechi", "zainab", "seun",
  "ifeoma", "dami", "musa", "bisola", "emeka", "halima",
  "tunde", "ngozi", "yusuf", "amaka", "segun", "fola",
];
const NOT_SELECTED = new Set([3, 8, 13]);
// OKLCH hues: brand blues and greens.
const HUES = [262, 155, 245, 145, 270, 165];

const COLS = 6;
const ROWS = HANDLES.length / COLS;
const TILE = 44;
const GAP = 12;
const PAD = 16;
const PLANE_W = COLS * TILE + (COLS - 1) * GAP + PAD * 2;
const PLANE_H = ROWS * TILE + (ROWS - 1) * GAP + PAD * 2;
const STEP_MS = 6500;
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const settle = { type: "spring", stiffness: 90, damping: 18 } as const;

// Build online: contribution-graph shades. Lagos: the flag's green-white-green bands.
const SHADES = [
  "color-mix(in oklab, var(--green) 25%, var(--surface))",
  "color-mix(in oklab, var(--green) 50%, var(--surface))",
  "color-mix(in oklab, var(--green) 75%, var(--surface))",
];
const FLAG = (col: number) => (col < 2 || col > 3 ? "#0f9f5c" : "#ffffff");

function tileColor(step: number, i: number, col: number, selected: boolean) {
  if (step === 1) return SHADES[(i * 7) % 3];
  if (step === 2) return selected ? "var(--blue)" : undefined;
  if (step === 3) return FLAG(col);
  return undefined;
}

function Pool({ step }: { step: number }) {
  return (
    <Stage size={PLANE_W} depth={PLANE_H} className="h-[340px] md:h-[400px]">
      <Slab x={0} y={0} w={PLANE_W} h={PLANE_H} depth={14} radius={14} tone="sunken" topClassName="dot-grid" />

      {HANDLES.map((name, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x = PAD + col * (TILE + GAP);
        const y = PAD + row * (TILE + GAP);
        const selected = !NOT_SELECTED.has(i);
        const raised = step >= 2 && selected ? 24 : 14;
        const gone = step === 3 && !selected;
        const delay = (row + col) * 0.07;

        return (
          <div key={name}>
            <Slab
              x={x}
              y={y}
              w={TILE}
              h={TILE}
              depth={7}
              radius={7}
              top={tileColor(step, i, col, selected)}
              initial={false}
              animate={{ z: raised }}
              transition={{ ...settle, delay }}
            />
            <Upright
              x={x + TILE / 2}
              y={y + TILE / 2}
              initial={false}
              animate={{ z: step === 3 && selected ? [raised + 6, raised + 22, raised + 6] : raised + 6 }}
              transition={
                step === 3 && selected
                  ? { duration: 1.1, delay: delay * 1.5, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }
                  : { ...settle, delay }
              }
            >
              <motion.div
                key={step === 0 ? "drop" : "stay"}
                initial={step === 0 ? { y: -50, opacity: 0 } : false}
                animate={{ y: 0, opacity: gone ? 0 : step === 2 && !selected ? 0.3 : 1 }}
                transition={{ duration: 0.9, ease, delay: step === 0 ? 0.2 + i * 0.06 : delay }}
                className="pb-0.5"
              >
                <Blobatar name={name} size={32} hue={HUES[i % HUES.length]} animate="always" />
              </motion.div>
            </Upright>
          </div>
        );
      })}
    </Stage>
  );
}

const chipTone = [
  "border border-line bg-surface text-ink",
  "bg-green-soft text-green-ink",
  "bg-blue text-white",
  "bg-green text-white dark:text-[#04140c]",
];

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
    <section id="how-it-works" className="frame relative scroll-mt-16 px-5 py-24 md:px-10 md:py-32">
      <SectionHeader index="02" eyebrow="How it works" title="Start online. Finish in Lagos.">
        One signup gets you in. Build from anywhere, and you could be one of {site.builders} builders in the room.
      </SectionHeader>

      <div ref={wrap} className="mt-14 grid items-center gap-10 md:mt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
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

        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface">
          <div className="absolute right-5 top-5 z-10">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={step}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.6, ease }}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[12px] font-medium ${chipTone[step]}`}
              >
                <span className="size-1.5 rounded-full bg-current" />
                {steps[step].chip}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="origin-center scale-[0.78] py-6 sm:scale-100">
            <Pool step={step} />
          </div>
        </div>
      </div>
    </section>
  );
}
