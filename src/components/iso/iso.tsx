"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

/*
 * CSS 3D isometric toolkit. A Stage tilts a flat plane (rotateX 57°, rotateZ 45°);
 * Slabs are solid boxes on that plane with a lit top and two shaded sides, so
 * everything reads as real geometry with flat colours — no blur, no glow.
 *
 * Plane coordinates: x → right-down on screen, y → left-down, z → up.
 * With this camera the south (+y) and east (+x) sides are the visible ones.
 */

export function Stage({
  size = 260,
  className = "",
  children,
  style,
}: {
  size?: number;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div aria-hidden="true" className={`pointer-events-none relative flex items-center justify-center ${className}`} style={style}>
      <div className="iso-stage relative" style={{ width: size, height: size }}>
        {children}
      </div>
    </div>
  );
}

type Tone = "surface" | "blue" | "green" | "ink" | "sunken" | "term";

const tones: Record<Tone, { top: string; south: string; east: string; edge: string }> = {
  surface: { top: "var(--iso-top)", south: "var(--iso-left)", east: "var(--iso-right)", edge: "var(--iso-edge)" },
  sunken: { top: "var(--bg-sunken)", south: "var(--iso-left)", east: "var(--iso-right)", edge: "var(--iso-edge)" },
  blue: {
    top: "var(--blue)",
    south: "color-mix(in oklab, var(--blue) 78%, black)",
    east: "color-mix(in oklab, var(--blue) 62%, black)",
    edge: "color-mix(in oklab, var(--blue) 80%, white)",
  },
  green: {
    top: "var(--green)",
    south: "color-mix(in oklab, var(--green) 78%, black)",
    east: "color-mix(in oklab, var(--green) 62%, black)",
    edge: "color-mix(in oklab, var(--green) 80%, white)",
  },
  term: {
    top: "var(--term)",
    south: "color-mix(in oklab, var(--term) 70%, var(--line-strong))",
    east: "color-mix(in oklab, var(--term) 85%, black)",
    edge: "var(--term-edge)",
  },
  ink: {
    top: "var(--ink)",
    south: "color-mix(in oklab, var(--ink) 80%, var(--bg))",
    east: "color-mix(in oklab, var(--ink) 65%, var(--bg))",
    edge: "var(--ink)",
  },
};

export type SlabProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** thickness in px */
  depth?: number;
  tone?: Tone;
  /** override the top face colour (e.g. to animate a status change) */
  top?: string;
  radius?: number;
  className?: string;
  topClassName?: string;
  children?: ReactNode;
} & Omit<HTMLMotionProps<"div">, "children">;

export function Slab({
  x,
  y,
  w,
  h,
  depth = 10,
  tone = "surface",
  top,
  radius = 6,
  className = "",
  topClassName = "",
  children,
  style,
  ...motionProps
}: SlabProps) {
  const t = tones[tone];
  return (
    <motion.div
      className={`iso-face ${className}`}
      style={{ left: x, top: y, width: w, height: h, transformStyle: "preserve-3d", ...style }}
      {...motionProps}
    >
      {/* south side */}
      <div
        className="iso-face left-0"
        style={{
          top: "100%",
          width: "100%",
          height: depth,
          transformOrigin: "top",
          transform: "rotateX(90deg)",
          background: t.south,
          borderBottomLeftRadius: radius,
          borderBottomRightRadius: radius,
        }}
      />
      {/* east side */}
      <div
        className="iso-face top-0"
        style={{
          left: "100%",
          width: depth,
          height: "100%",
          transformOrigin: "left",
          transform: "rotateY(-90deg)",
          background: t.east,
          borderTopRightRadius: radius,
          borderBottomRightRadius: radius,
        }}
      />
      {/* top */}
      <motion.div
        className="iso-face inset-0 overflow-hidden"
        style={{
          transform: `translateZ(${depth}px)`,
          borderRadius: radius,
          boxShadow: `inset 0 0 0 1px ${t.edge}`,
        }}
        initial={false}
        animate={{ backgroundColor: top ?? t.top }}
        transition={{ duration: 0.35 }}
      >
        {/* Content runs along −y so text rises to the right, the way iso labels read. */}
        <div
          className={`absolute left-1/2 top-1/2 ${topClassName}`}
          style={{ width: h, height: w, transform: "translate(-50%, -50%) rotate(-90deg)" }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Something that should face the viewer while standing on the plane (labels, avatars). */
export function Upright({
  x,
  y,
  z = 0,
  children,
  className = "",
  ...motionProps
}: { x: number; y: number; z?: number; children: ReactNode; className?: string } & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div className={`iso-face ${className}`} style={{ left: x, top: y, transformStyle: "preserve-3d" }} {...motionProps}>
      <div style={{ transform: `translateZ(${z}px) rotateZ(-45deg) rotateX(-57deg)`, transformOrigin: "bottom center" }} className="iso-face bottom-0 left-1/2 -translate-x-1/2">
        {children}
      </div>
    </motion.div>
  );
}
