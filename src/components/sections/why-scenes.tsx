"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, GitMerge, Search } from "lucide-react";
import { Blobatar } from "@blobatar/react";
import { InlineLoader, TextLoader } from "generative-loaders";
import { Slab, Stage } from "@/components/iso/iso";

function useLive(ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => setN((v) => v + 1), ms);
    return () => clearInterval(id);
  }, [inView, reduced, ms]);
  return { ref, n, live: inView && !reduced };
}

/* ------------------------------------------------------------ live feed */

const PAYOUTS = [
  { who: "Ada O.", amount: "₦250,000" },
  { who: "Kelechi N.", amount: "₦48,500" },
  { who: "Zainab M.", amount: "$1,200" },
  { who: "Tunde A.", amount: "₦1,020,000" },
  { who: "Ngozi E.", amount: "₦75,000" },
  { who: "Musa I.", amount: "$340" },
];

export function FeedScene() {
  const { ref, n, live } = useLive(1700);
  const rows = [0, 1, 2, 3].map((k) => ({ id: n - k, ...PAYOUTS[(((n - k) % PAYOUTS.length) + PAYOUTS.length) % PAYOUTS.length] }));

  return (
    <div ref={ref} className="mx-auto w-full max-w-[380px] rounded-2xl border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-ink">Payout agent</span>
        <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <InlineLoader variant="signal" size={14} color="var(--green)" paused={!live} label="Live" /> live
        </span>
      </div>
      <ul className="relative flex flex-col gap-2">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((r, i) => (
            <motion.li
              key={r.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: i === 3 ? 0.4 : 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 px-3 py-2"
            >
              <Blobatar name={r.who} size={22} hue={[262, 155, 240][((r.id % 3) + 3) % 3]} />
              <span className="flex-1 truncate text-[13px] text-ink">{r.who}</span>
              <span className="font-mono text-[12.5px] tabular-nums text-ink">{r.amount}</span>
              <span className="flex items-center gap-1 rounded-full bg-green-soft px-2 py-0.5 text-[11px] font-medium text-green-ink">
                <Check className="size-3" strokeWidth={3} /> settled
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/* ------------------------------------------------------ contribution grid */

const WEEKS = 22;
const DAYS = 7;
// deterministic pseudo-random intensity per cell
const level = (i: number) => {
  const v = Math.sin(i * 12.9898) * 43758.5453;
  const f = v - Math.floor(v);
  return f < 0.35 ? 0 : f < 0.6 ? 1 : f < 0.8 ? 2 : f < 0.93 ? 3 : 4;
};
const SHADES = [
  "var(--line)",
  "color-mix(in oklab, var(--green) 30%, var(--surface))",
  "color-mix(in oklab, var(--green) 55%, var(--surface))",
  "color-mix(in oklab, var(--green) 80%, var(--surface))",
  "var(--green)",
];

export function PortfolioScene() {
  const { ref, n } = useLive(160);
  const filled = Math.min(n % (WEEKS + 14), WEEKS); // sweep, hold, restart

  return (
    <div ref={ref} className="mx-auto flex w-full max-w-[400px] flex-col gap-3">
      <div className="rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-green text-white dark:text-[#04140c]">
            <GitMerge className="size-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-ink">feat(recipes): payout agent skill</p>
            <p className="mt-0.5 font-mono text-[11px] text-muted">#128 · merged into main</p>
          </div>
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-green-ink">+412 −36</span>
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-4">
        <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}>
          {Array.from({ length: WEEKS * DAYS }, (_, i) => {
            const week = Math.floor(i / DAYS);
            const on = week < filled;
            return (
              <span
                key={i}
                className="aspect-square rounded-[3px] transition-colors duration-300"
                style={{ background: on ? SHADES[level(i)] : SHADES[0] }}
              />
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-faint">
          <span>contributions</span>
          <span className="flex items-center gap-1">
            less
            {SHADES.map((c) => (
              <span key={c} className="size-2.5 rounded-[2px]" style={{ background: c }} />
            ))}
            more
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- docs answering */

const QUESTION = "How do I verify a webhook signature?";
const ANSWER =
  "Read the signature header, recompute an HMAC of the raw body with your secret, and compare in constant time. Reject anything older than five minutes.";

export function DocsAnswerScene() {
  const { ref, n, live } = useLive(60);
  // Ticks: type the question, pause, stream the answer 3 chars/tick, hold, repeat.
  const cycle = QUESTION.length + 6 + Math.ceil(ANSWER.length / 3) + 50;
  const local = n % cycle;
  const qShown = live ? QUESTION.slice(0, Math.min(local, QUESTION.length)) : QUESTION;
  const aLen = live ? Math.max(0, Math.min((local - QUESTION.length - 6) * 3, ANSWER.length)) : ANSWER.length;
  const thinking = live && local >= QUESTION.length && aLen === 0;

  return (
    <div ref={ref} className="mx-auto w-full max-w-[400px] rounded-2xl border border-line bg-surface">
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
        <Search className="size-4 text-faint" />
        <span className="flex-1 truncate text-[13.5px] text-ink">
          {qShown}
          {live && local < QUESTION.length && <span className="ml-px inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-blue" />}
        </span>
        <kbd className="rounded border border-line px-1.5 font-mono text-[10px] text-faint">⌘K</kbd>
      </div>
      <div className="min-h-[148px] px-4 py-4">
        <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
          {thinking ? (
            <>
              <InlineLoader variant="orbit" size={12} color="var(--blue)" label="Searching docs" /> searching docs
            </>
          ) : (
            <>
              <span className="size-1.5 rounded-full bg-blue" /> answer
            </>
          )}
        </p>
        <div className="text-[13.5px] leading-relaxed text-ink-2">
          {aLen > 0 && <TextLoader text={ANSWER.slice(0, aLen)} variant="cascade" color="currentColor" />}
        </div>
        {aLen >= ANSWER.length && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex gap-2">
            <span className="rounded-md border border-line bg-bg-sunken px-2 py-1 font-mono text-[11px] text-muted">webhooks.md</span>
            <span className="rounded-md border border-line bg-bg-sunken px-2 py-1 font-mono text-[11px] text-muted">examples/verify.ts</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- prizes podium */

const SWAG = [
  { glyph: "✦", tone: "blue" as const, x: 30, y: 40 },
  { glyph: "{ }", tone: "ink" as const, x: 130, y: 26 },
  { glyph: "₦", tone: "green" as const, x: 150, y: 120 },
  { glyph: "tee", tone: "surface" as const, x: 20, y: 140 },
];

export function PrizesScene() {
  const { ref, n } = useLive(1800);
  return (
    <div ref={ref}>
      <Stage size={200} className="h-[260px]">
        <Slab x={0} y={0} w={200} h={200} depth={10} radius={10} tone="sunken" topClassName="dot-grid" />
        {/* podium as a staircase receding to the back: 1 · 2 · 3 */}
        <Slab x={30} y={72} w={48} h={56} depth={74} tone="blue" style={{ z: 10 }} topClassName="flex items-center justify-center">
          <span className="font-mono text-[15px] font-bold text-white">1</span>
        </Slab>
        <Slab x={80} y={72} w={48} h={56} depth={46} tone="ink" style={{ z: 10 }} topClassName="flex items-center justify-center">
          <span className="font-mono text-[15px] font-bold text-bg">2</span>
        </Slab>
        <Slab x={130} y={72} w={48} h={56} depth={24} tone="green" style={{ z: 10 }} topClassName="flex items-center justify-center">
          <span className="font-mono text-[15px] font-bold text-white">3</span>
        </Slab>
        {/* floating swag */}
        {SWAG.map((s, i) => (
          <Slab
            key={s.glyph}
            x={s.x}
            y={s.y}
            w={30}
            h={30}
            depth={6}
            radius={6}
            tone={s.tone}
            initial={false}
            animate={{ z: 96 + ((n + i) % 2) * 22, rotateZ: ((n + i) % 4) * 90 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, delay: i * 0.08 }}
            topClassName="flex items-center justify-center"
          >
            <span
              className={`font-mono text-[10px] font-bold ${
                s.tone === "surface" ? "text-ink" : s.tone === "ink" ? "text-bg" : "text-white"
              }`}
            >
              {s.glyph}
            </span>
          </Slab>
        ))}
      </Stage>
    </div>
  );
}
