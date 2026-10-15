"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useInView, useReducedMotion } from "motion/react";
import { Check, GitMerge, Search } from "lucide-react";
import { Blobatar } from "@blobatar/react";
import { InlineLoader, TextLoader } from "generative-loaders";

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
          <span className="flex gap-1.5 rounded-full border border-line px-2 py-0.5 font-mono text-[11px]">
            <span className="text-green-ink">+412</span>
            <span className="text-red">−36</span>
          </span>
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

/* ------------------------------------------------------ swag & prizes */

// Flat two-tone icons, drawn at the size they render so they stay crisp.
function Trophy() {
  return (
    <svg viewBox="0 0 48 48" width={88} height={88} aria-hidden="true">
      <path d="M11 10H5v5a8 8 0 0 0 8 8M37 10h6v5a8 8 0 0 1-8 8" fill="none" stroke="#d9961a" strokeWidth={3.5} />
      <path d="M12 6h24v12a12 12 0 0 1-24 0z" fill="#f2b33d" />
      <path d="M21 29h6v6h-6z" fill="#d9961a" />
      <rect x="14" y="35" width="20" height="7" rx="2" fill="#d9961a" />
      <path d="M17 11h4v8h-4z" fill="#fff" opacity={0.55} />
    </svg>
  );
}

const icon = { width: 32, height: 32, viewBox: "0 0 48 48", "aria-hidden": true } as const;

const SWAG = [
  {
    label: "Tee",
    svg: (
      <svg {...icon}>
        <path d="M17 6 5 12l4 9 5-3v24h20V18l5 3 4-9-12-6c-1 3-3.5 5-7 5s-6-2-7-5z" fill="var(--blue)" />
        <circle cx="24" cy="24" r="4" fill="#fff" />
      </svg>
    ),
  },
  {
    label: "Cap",
    svg: (
      <svg {...icon}>
        <path d="M8 30a16 16 0 0 1 32 0z" fill="var(--ink)" />
        <path d="M4 30h40a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="var(--blue)" />
        <circle cx="24" cy="13" r="2.5" fill="var(--blue)" />
      </svg>
    ),
  },
  {
    label: "Stickers",
    svg: (
      <svg {...icon}>
        <circle cx="20" cy="22" r="14" fill="var(--green)" />
        <path d="m16 17-5 5 5 5M24 17l5 5-5 5" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="27" y="26" width="16" height="16" rx="4" fill="var(--blue)" />
      </svg>
    ),
  },
  {
    label: "Cash",
    svg: (
      <svg {...icon}>
        <rect x="4" y="12" width="40" height="24" rx="4" fill="var(--green)" />
        <circle cx="24" cy="24" r="7" fill="#fff" />
        <path d="M21 28v-8l6 8v-8M19.5 23h9M19.5 25.5h9" fill="none" stroke="var(--green)" strokeWidth={1.6} />
      </svg>
    ),
  },
  {
    label: "Hoodie",
    svg: (
      <svg {...icon}>
        <path d="M16 8c2-3 14-3 16 0l10 6-4 10-4-2v20H14V22l-4 2-4-10z" fill="var(--ink)" />
        <path d="M18 8c0 6 3 9 6 9s6-3 6-9" fill="var(--blue)" />
        <rect x="18" y="30" width="12" height="6" rx="2" fill="var(--blue)" />
      </svg>
    ),
  },
  {
    label: "Medal",
    svg: (
      <svg {...icon}>
        <path d="M14 4h8l6 14h-8z" fill="var(--blue)" />
        <path d="M34 4h-8l-6 14h8z" fill="var(--green)" />
        <circle cx="24" cy="30" r="12" fill="#f2b33d" />
        <circle cx="24" cy="30" r="6.5" fill="#d9961a" />
      </svg>
    ),
  },
];

const ORBIT = { rx: 160, ry: 46, cy: 40 };

export function PrizesScene() {
  const ref = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const angle = useRef(0);

  useAnimationFrame((_, dt) => {
    if (inView && !reduced) angle.current += dt * 0.00042;
    SWAG.forEach((_, i) => {
      const el = items.current[i];
      if (!el) return;
      const a = angle.current + (i / SWAG.length) * Math.PI * 2;
      const depth = (Math.sin(a) + 1) / 2; // 0 back … 1 front
      const x = Math.round(Math.cos(a) * ORBIT.rx);
      const y = Math.round(ORBIT.cy + Math.sin(a) * ORBIT.ry);
      el.style.transform = `translate(${x}px, ${y}px) scale(${0.8 + depth * 0.2})`;
      el.style.zIndex = String(depth > 0.5 ? 20 : 1);
      el.style.opacity = String(0.7 + depth * 0.3);
    });
  });

  return (
    <div ref={ref} className="relative flex h-[280px] w-full items-center justify-center max-sm:scale-[0.78]">
      {/* orbit track */}
      <div
        aria-hidden="true"
        className="absolute rounded-[50%] border border-dashed border-line-strong"
        style={{ width: ORBIT.rx * 2, height: ORBIT.ry * 2, transform: `translateY(${ORBIT.cy}px)` }}
      />
      {/* trophy on its pedestal */}
      <div className="relative z-10 flex -translate-y-4 flex-col items-center">
        <motion.div
          animate={reduced ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Trophy />
        </motion.div>
        <div className="-mt-1 rounded-lg bg-ink px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-bg">
          Prizes
        </div>
      </div>
      {SWAG.map((it, i) => (
        <div
          key={it.label}
          ref={(el) => void (items.current[i] = el)}
          className="absolute left-1/2 top-1/2 -ml-8 -mt-8 will-change-transform"
        >
          <div className="flex size-16 flex-col items-center justify-center rounded-2xl border border-line bg-surface">
            {it.svg}
          </div>
          <p className="mt-1.5 text-center font-mono text-[11px] text-muted">{it.label}</p>
        </div>
      ))}
    </div>
  );
}
