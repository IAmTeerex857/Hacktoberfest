"use client";

import { useEffect, useId, useMemo, useState, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useTheme } from "next-themes";
import { BorderBeam } from "border-beam";
import { Blobatar } from "@blobatar/react";
import { SpotflowLogo } from "@/components/brand/logo";
import { site } from "@/lib/site";

function bars(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return Array.from({ length: 34 }, (_, i) => {
    h = Math.imul(h ^ (i + 1), 2654435761);
    return 1 + (Math.abs(h) % 3);
  });
}

function serial(seed: string) {
  let h = 7;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  return String(h % 1000).padStart(3, "0");
}

const DEPTH = 10;

export function BuilderPass() {
  const inputId = useId();
  const [handle, setHandle] = useState("");
  const clean = handle.replace(/[^a-zA-Z0-9-_.]/g, "").slice(0, 39);
  const name = clean || "you";
  const pattern = useMemo(() => bars(name), [name]);
  const { resolvedTheme } = useTheme();
  const reduced = useReducedMotion();
  // Border Beam's generated CSS depends on the theme, which the server can't know.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- theme is only known on the client
  useEffect(() => setMounted(true), []);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), { stiffness: 180, damping: 18 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="flex w-full justify-center py-4"
        style={{ perspective: 1100 }}
      >
        <motion.div
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          initial={{ rotateZ: -4, y: 30, opacity: 0 }}
          whileInView={{ rotateZ: -4, y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="relative h-[452px] w-[300px] sm:w-[320px]"
        >
          {/* card thickness */}
          {Array.from({ length: DEPTH }, (_, i) => (
            <div
              key={i}
              aria-hidden="true"
              className="absolute inset-0 rounded-[24px] bg-line-strong"
              style={{ transform: `translateZ(${-(i + 1)}px)` }}
            />
          ))}

          <BorderBeam
            size="line"
            colorVariant="ocean"
            theme={mounted && resolvedTheme === "dark" ? "dark" : "light"}
            staticColors
            glowSize={0.35}
            strength={0.9}
            active={!reduced}
            className="!absolute inset-0"
          >
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-line bg-surface">
              {/* header */}
              <div className="flex items-center justify-between px-6 pt-6">
                <SpotflowLogo className="h-[18px] w-auto text-ink" />
                <span className="rounded-full bg-blue px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                  Builder pass
                </span>
              </div>

              {/* identity */}
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
                <div className="rounded-[28px] border border-line bg-bg-sunken p-3">
                  <Blobatar name={name} size={104} animate="always" hue={clean ? undefined : 262} />
                </div>
                <div className="text-center">
                  <p className="max-w-[240px] truncate text-[22px] font-semibold tracking-[-0.02em] text-ink">@{name}</p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
                    Agentic Payments &amp; DevEx
                  </p>
                </div>
              </div>

              {/* facts */}
              <dl className="grid grid-cols-2 gap-px border-y border-line bg-line">
                {[
                  ["Where", "Online + Lagos"],
                  ["When", site.eventDatesShort],
                ].map(([k, v]) => (
                  <div key={k} className="bg-surface px-6 py-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{k}</dt>
                    <dd className="mt-0.5 text-[14px] font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* stub */}
              <div className="relative flex items-end justify-between gap-4 px-6 pb-5 pt-5">
                <span aria-hidden="true" className="absolute -left-3 -top-3 size-6 rounded-full border border-line bg-bg" />
                <span aria-hidden="true" className="absolute -right-3 -top-3 size-6 rounded-full border border-line bg-bg" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">Admit one builder</p>
                  <p className="mt-1 font-mono text-[18px] font-semibold text-ink">#{serial(name)}</p>
                </div>
                <div aria-hidden="true" className="flex h-9 items-stretch gap-[2px]">
                  {pattern.map((w, i) => (
                    <span key={i} className="bg-ink" style={{ width: w }} />
                  ))}
                </div>
              </div>
            </div>
          </BorderBeam>
        </motion.div>
      </div>

      <div className="w-full max-w-[320px]">
        <label htmlFor={inputId} className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
          Preview your pass
        </label>
        <div className="mt-2 flex h-11 items-center rounded-full border border-line bg-surface pl-4 pr-2 transition-colors focus-within:border-blue">
          <span className="font-mono text-sm text-faint">@</span>
          <input
            id={inputId}
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="your-github-handle"
            autoComplete="off"
            spellCheck={false}
            maxLength={39}
            className="ml-1 h-full w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-faint"
          />
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-faint">
          Just for fun. Nothing is saved here — registration happens on the signup form.
        </p>
      </div>
    </div>
  );
}
