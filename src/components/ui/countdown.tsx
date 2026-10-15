"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-flex h-[1.15em] w-[0.62em] justify-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className="absolute"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Unit({ n, label }: { n: number; label: string }) {
  const str = String(n).padStart(2, "0");
  return (
    <span className="flex flex-col items-center">
      <span className="flex font-mono tabular-nums">
        {str.split("").map((c, i) => (
          <Digit key={i} value={c} />
        ))}
      </span>
      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{label}</span>
    </span>
  );
}

export function Countdown({ to, className = "" }: { to: string; className?: string }) {
  const target = new Date(to).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return <div className={`h-[3.25rem] ${className}`} aria-hidden="true" />;
  }

  const left = target - now;
  if (left <= 0) {
    return <p className={`font-mono text-sm text-muted ${className}`}>Registrations are closed.</p>;
  }

  const t = parts(left);
  const label = `${t.d} days ${t.h} hours ${t.m} minutes left to register`;

  return (
    <div className={`flex items-start gap-3 ${className}`} role="timer" aria-label={label}>
      <Unit n={t.d} label="days" />
      <span className="font-mono text-faint">:</span>
      <Unit n={t.h} label="hrs" />
      <span className="font-mono text-faint">:</span>
      <Unit n={t.m} label="min" />
      <span className="font-mono text-faint">:</span>
      <Unit n={t.s} label="sec" />
    </div>
  );
}
