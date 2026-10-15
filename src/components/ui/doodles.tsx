"use client";

import { motion, type Variants } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

/*
 * Structured doodles: technical-drawing marks (crosshairs, dimension lines,
 * callouts, braces, wireframe cubes) that draw themselves in on scroll.
 * Decorative only; every one is aria-hidden.
 */

const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.1, delay: i * 0.12, ease: EASE }, opacity: { duration: 0.01, delay: i * 0.12 } },
  }),
};

function Svg({
  children,
  className = "",
  style,
  viewBox,
  width,
  height,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  viewBox: string;
  width: number;
  height: number;
}) {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox={viewBox}
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-10%" }}
      className={`pointer-events-none absolute text-doodle ${className}`}
      style={style}
    >
      {children}
    </motion.svg>
  );
}

type Pos = { className?: string; style?: CSSProperties };

export function Crosshair({ className, style, size = 28 }: Pos & { size?: number }) {
  return (
    <Svg viewBox="0 0 28 28" width={size} height={size} className={className} style={style}>
      <motion.circle cx="14" cy="14" r="6" variants={draw} custom={0} />
      <motion.path d="M14 1v8M14 19v8M1 14h8M19 14h8" variants={draw} custom={1} />
    </Svg>
  );
}

export function Plus({ className, style, size = 12 }: Pos & { size?: number }) {
  return (
    <Svg viewBox="0 0 12 12" width={size} height={size} className={className} style={style}>
      <motion.path d="M6 0v12M0 6h12" variants={draw} />
    </Svg>
  );
}

export function Brace({ className, style, height = 120 }: Pos & { height?: number }) {
  const h = height;
  const m = h / 2;
  return (
    <Svg viewBox={`0 0 16 ${h}`} width={16} height={h} className={className} style={style}>
      <motion.path
        d={`M2 1c6 0 6 4 6 10v${m - 18}c0 4 2 6 6 6-4 0-6 2-6 6v${m - 18}c0 6 0 10-6 10`}
        variants={draw}
      />
    </Svg>
  );
}

export function WireCube({ className, style, size = 56 }: Pos & { size?: number }) {
  return (
    <Svg viewBox="0 0 56 56" width={size} height={size} className={className} style={style}>
      <motion.path d="M28 4 50 16v24L28 52 6 40V16z" variants={draw} custom={0} />
      <motion.path d="M6 16l22 12 22-12M28 28v24" variants={draw} custom={1} />
      <motion.path d="M17 10l22 12v12" strokeDasharray="2 3" variants={draw} custom={2} />
    </Svg>
  );
}

export function Asterisk({ className, style, size = 22 }: Pos & { size?: number }) {
  return (
    <Svg viewBox="0 0 22 22" width={size} height={size} className={className} style={style}>
      <motion.path d="M11 1v20M2.3 6l17.4 10M2.3 16 19.7 6" variants={draw} />
    </Svg>
  );
}

export function Brackets({ className, style, label = "{ }" }: Pos & { label?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none font-mono text-doodle ${className ?? ""}`}
      style={style}
    >
      {label}
    </span>
  );
}
