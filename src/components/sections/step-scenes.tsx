"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, GitMerge, MapPin } from "lucide-react";
import { Blobatar } from "@blobatar/react";
import { SpotflowMark } from "@/components/brand/logo";
import { site } from "@/lib/site";

/*
 * One flat micro-scene per "How it works" step. Each plays its own short
 * timeline when it mounts (the step becomes active). Springs, no blur, so
 * everything stays crisp.
 */

const pop = { type: "spring", stiffness: 520, damping: 26 } as const;
const soft = { type: "spring", stiffness: 260, damping: 24 } as const;
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Number of timeline marks (ms after mount) that have passed. */
function useStage(marks: number[]) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const ids = marks.map((ms, i) => setTimeout(() => setStage(i + 1), ms));
    return () => ids.forEach(clearTimeout);
    // marks are static per scene
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);
  return reduced ? marks.length : stage;
}

/* ---------------------------------------------------------------- sign up */

const HANDLE = "ada.dev";
const TRACKS = ["Agents", "Recipes", "Docs"];

export function SignUpScene() {
  // typing (one mark per char), pick track, Lagos toggle, press, done
  const typeMarks = HANDLE.split("").map((_, i) => 350 + i * 85);
  const stage = useStage([...typeMarks, 1500, 2300, 3000, 3350]);
  const typed = Math.min(stage, HANDLE.length);
  const after = stage - HANDLE.length;
  const track = after >= 1;
  const lagos = after >= 2;
  const pressed = after === 3;
  const done = after >= 4;

  return (
    <div className="w-[300px] rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold text-ink">Join the challenge</span>
        <SpotflowMark className="h-4 w-auto text-ink" />
      </div>

      <label className="mt-5 block font-mono text-[10px] uppercase tracking-[0.14em] text-faint">GitHub handle</label>
      <div className="mt-1.5 flex h-10 items-center gap-2 rounded-lg border border-line bg-bg px-2.5">
        <AnimatePresence>
          {typed === HANDLE.length && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={pop} className="flex">
              <Blobatar name={HANDLE} size={22} hue={262} />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="font-mono text-[13px] text-ink">
          {HANDLE.slice(0, typed)}
          {typed < HANDLE.length && <span className="ml-px inline-block h-3.5 w-[2px] translate-y-0.5 bg-blue" />}
        </span>
      </div>

      <label className="mt-4 block font-mono text-[10px] uppercase tracking-[0.14em] text-faint">Track</label>
      <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg border border-line bg-bg p-1">
        {TRACKS.map((t, i) => (
          <span key={t} className="relative flex h-7 items-center justify-center text-[12px] font-medium">
            {track && i === 0 && (
              <motion.span layoutId="track-pick" transition={soft} className="absolute inset-0 rounded-md bg-ink" />
            )}
            <span className={`relative transition-colors duration-300 ${track && i === 0 ? "text-bg" : "text-muted"}`}>{t}</span>
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[13px] text-ink-2">Interested in Lagos</span>
        <span
          className={`flex h-6 w-10 items-center rounded-full p-0.5 transition-colors duration-300 ${
            lagos ? "justify-end bg-green" : "justify-start bg-line-strong"
          }`}
        >
          <motion.span layout transition={pop} className="size-5 rounded-full bg-white" />
        </span>
      </div>

      <motion.div
        layout
        animate={{ scale: pressed ? 0.94 : 1 }}
        transition={pop}
        className={`mt-5 flex h-10 items-center justify-center gap-2 rounded-full text-[13px] font-medium ${
          done ? "bg-green text-white dark:text-[#04140c]" : "bg-ink text-bg"
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={done ? "done" : "idle"}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={pop}
            className="flex items-center gap-1.5"
          >
            {done ? (
              <>
                <Check className="size-4" strokeWidth={3} /> You&apos;re in
              </>
            ) : (
              "Sign up"
            )}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ----------------------------------------------------------- build online */

const COMMITS = [
  { x: 120, label: "skills.md" },
  { x: 186, label: "agent" },
  { x: 240, label: "docs" },
];

export function BuildScene() {
  const stage = useStage([0, 500, 1100, 1600, 2100, 2700, 3100]);
  const days = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div className="flex w-[340px] flex-col gap-5">
      <svg viewBox="0 0 340 130" className="w-full overflow-visible" aria-hidden="true">
        {/* main */}
        <motion.path
          d="M10 96 H330"
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: stage >= 1 ? 1 : 0 }}
          transition={{ duration: 0.6, ease }}
        />
        {/* feature branch out */}
        <motion.path
          d="M60 96 C80 96 80 44 104 44 H250"
          fill="none"
          stroke="var(--blue)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: stage >= 2 ? 1 : 0 }}
          transition={{ duration: 0.7, ease }}
        />
        {/* merge back */}
        <motion.path
          d="M250 44 C274 44 274 96 296 96"
          fill="none"
          stroke="var(--green)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: stage >= 6 ? 1 : 0 }}
          transition={{ duration: 0.45, ease }}
        />
        <circle cx="60" cy="96" r="6" fill="var(--surface)" stroke="var(--line-strong)" strokeWidth={3} />
        {COMMITS.map((c, i) => (
          <g key={c.label}>
            <motion.circle
              cx={c.x}
              cy={44}
              r={7}
              fill="var(--surface)"
              stroke="var(--blue)"
              strokeWidth={3}
              initial={{ scale: 0 }}
              animate={{ scale: stage >= 3 + i ? 1 : 0 }}
              transition={pop}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
            <motion.text
              x={c.x}
              y={22}
              textAnchor="middle"
              className="fill-muted font-mono text-[10px]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: stage >= 3 + i ? 1 : 0, y: stage >= 3 + i ? 0 : 6 }}
              transition={soft}
            >
              {c.label}
            </motion.text>
          </g>
        ))}
        <motion.circle
          cx={296}
          cy={96}
          r={8}
          fill="var(--green)"
          initial={{ scale: 0 }}
          animate={{ scale: stage >= 7 ? 1 : 0 }}
          transition={pop}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      </svg>

      <div className="flex h-7 items-center justify-between">
        <div className="flex gap-[3px]">
          {days.map((d) => {
            const on = stage >= 3 && d < Math.min(16, (stage - 2) * 4);
            return (
              <span
                key={d}
                className="size-3 rounded-[3px] transition-colors duration-500"
                style={{
                  transitionDelay: `${(d % 5) * 60}ms`,
                  background: on ? `color-mix(in oklab, var(--green) ${40 + ((d * 37) % 60)}%, var(--surface))` : "var(--line)",
                }}
              />
            );
          })}
        </div>
        <AnimatePresence>
          {stage >= 7 && (
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={pop}
              className="flex items-center gap-1 rounded-full bg-green px-2.5 py-1 font-mono text-[11px] font-medium text-white dark:text-[#04140c]"
            >
              <GitMerge className="size-3" /> merged
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- get selected */

const APPLICANTS = [
  { name: "tobi", track: "Docs" },
  { name: "zainab", track: "Recipes" },
  { name: "ada.dev", track: "AI Agents" },
];
const SEATS = site.builders;

export function SelectScene() {
  const stage = useStage([700, 1400, 2200]);
  const peeled = Math.min(stage, 2);
  const stamped = stage >= 3;
  const [seats, setSeats] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setSeats((n) => (n >= SEATS ? n : n + 1)), 85);
    return () => clearInterval(id);
  }, [reduced]);
  const filled = reduced ? SEATS : seats;

  return (
    <div className="flex w-[320px] flex-col items-center gap-7">
      <div className="relative h-[124px] w-[250px]">
        {APPLICANTS.map((a, i) => {
          const gone = i < peeled;
          const depth = Math.max(0, APPLICANTS.length - 1 - i - peeled);
          return (
            <motion.div
              key={a.name}
              className="absolute inset-0 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4"
              style={{ zIndex: i + 1 }}
              initial={false}
              animate={
                gone
                  ? { x: 300, rotate: 14, opacity: 0 }
                  : { x: 0, y: depth * -8, scale: 1 - depth * 0.04, rotate: 0, opacity: 1 }
              }
              transition={soft}
            >
              <Blobatar name={a.name} size={44} hue={[155, 245, 262][i]} />
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-ink">@{a.name}</p>
                <p className="font-mono text-[11px] text-muted">{a.track} track</p>
              </div>
              {i === APPLICANTS.length - 1 && (
                <AnimatePresence>
                  {stamped && (
                    <motion.span
                      initial={{ scale: 2, opacity: 0, rotate: -24 }}
                      animate={{ scale: 1, opacity: 1, rotate: -10 }}
                      transition={{ type: "spring", stiffness: 700, damping: 20 }}
                      className="absolute right-3 top-3 rounded-md border-2 border-blue px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-blue"
                    >
                      Selected
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="w-full">
        <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-faint">
          <span>seats in Lagos</span>
          <span className="tabular-nums text-ink">
            {filled}/{SEATS}
          </span>
        </div>
        <div className="grid grid-cols-15 gap-[3px]">
          {Array.from({ length: SEATS }, (_, i) => (
            <span
              key={i}
              className="h-3 rounded-[3px] transition-colors duration-200"
              style={{ background: i < filled ? "var(--blue)" : "var(--line)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- hack in Lagos */

const DAYS = [
  { day: "Fri", date: "06", label: "Day 1" },
  { day: "Sat", date: "07", label: "Day 2" },
];
const CREW = ["ada.dev", "tobi", "zainab", "kelechi", "seun"];

export function LagosScene() {
  const stage = useStage([150, 450, 1100, 1700]);

  return (
    <div className="flex w-[320px] flex-col items-center gap-6">
      <div className="flex gap-4">
        {DAYS.map((d, i) => (
          <motion.div
            key={d.date}
            initial={{ y: -40, opacity: 0, rotate: i ? 6 : -6 }}
            animate={stage > i ? { y: 0, opacity: 1, rotate: i ? 3 : -3 } : {}}
            transition={{ type: "spring", stiffness: 380, damping: 14 }}
            className="w-[108px] overflow-hidden rounded-2xl border border-line bg-surface text-center"
          >
            <div className={`py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white ${i ? "bg-green" : "bg-blue"}`}>
              {d.day} · Nov
            </div>
            <div className="py-2 text-[40px] font-semibold leading-none tracking-[-0.04em] text-ink">{d.date}</div>
            <div className="pb-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{d.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="relative flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-2 pr-4">
        <motion.span
          initial={{ y: -36, opacity: 0 }}
          animate={stage >= 3 ? { y: 0, opacity: 1 } : {}}
          transition={{ type: "spring", stiffness: 600, damping: 12 }}
          className="flex size-7 items-center justify-center rounded-full bg-blue text-white"
        >
          <MapPin className="size-4" />
        </motion.span>
        <span className="text-[14px] font-medium text-ink">Lagos, Nigeria</span>
      </div>

      <div className="flex -space-x-2">
        {CREW.map((n, i) => (
          <motion.span
            key={n}
            initial={{ y: 16, opacity: 0 }}
            animate={stage >= 4 ? { y: [16, -6, 0], opacity: 1 } : {}}
            transition={{ duration: 0.55, delay: i * 0.09, ease }}
            className="rounded-full border-2 border-surface bg-surface"
          >
            <Blobatar name={n} size={34} hue={[262, 155, 245, 145, 270][i]} />
          </motion.span>
        ))}
        <motion.span
          initial={{ scale: 0 }}
          animate={stage >= 4 ? { scale: 1 } : {}}
          transition={{ ...pop, delay: CREW.length * 0.09 }}
          className="flex size-[38px] items-center justify-center rounded-full border-2 border-surface bg-ink font-mono text-[11px] font-semibold text-bg"
        >
          +{site.builders - CREW.length}
        </motion.span>
      </div>
    </div>
  );
}
