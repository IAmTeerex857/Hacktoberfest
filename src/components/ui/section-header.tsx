"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function SectionHeader({
  index,
  eyebrow,
  title,
  children,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
    >
      <p className={`flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.16em] text-faint ${align === "center" ? "justify-center" : ""}`}>
        <span className="text-green">{index}</span>
        {eyebrow}
      </p>
      <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">{title}</h2>
      {children && <div className="mt-4 text-[17px] leading-relaxed text-muted">{children}</div>}
    </motion.div>
  );
}
