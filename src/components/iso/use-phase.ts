"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Steps through phases with per-phase durations (ms), looping, only while the
 * element is on screen. Reduced motion parks it on `restAt`.
 */
export function usePhase(durations: number[], restAt = durations.length - 1) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = setTimeout(() => setPhase((p) => (p + 1) % durations.length), durations[phase]);
    return () => clearTimeout(id);
  }, [phase, inView, reduced, durations]);

  return { ref, phase: reduced ? restAt : phase };
}
