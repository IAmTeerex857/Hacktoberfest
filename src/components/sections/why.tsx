"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Brackets, Crosshair } from "@/components/ui/doodles";
import { DocsAnswerScene, FeedScene, PortfolioScene, PrizesScene } from "./why-scenes";

const cells: { label: string; line: string; scene: ReactNode }[] = [
  { label: "Useful", line: "Build something useful.", scene: <FeedScene /> },
  { label: "Portfolio", line: "Make it part of your portfolio.", scene: <PortfolioScene /> },
  { label: "Move faster", line: "Help other developers move faster.", scene: <DocsAnswerScene /> },
  { label: "Swag & prizes", line: "Lots of swag and prizes to be won!", scene: <PrizesScene /> },
];

export function Why() {
  return (
    <section id="why" className="frame relative scroll-mt-16 px-5 py-24 md:px-10 md:py-32">
      <Crosshair className="right-4 top-24 hidden md:block" />
      <Brackets label="// why build" className="right-[14%] top-44 hidden text-[12px] lg:block" />

      <SectionHeader
        index="03"
        eyebrow="Why join"
        title={
          <>
            <span className="block">Build something useful.</span>
            <span className="block text-muted">Make it part of your portfolio.</span>
            <span className="block text-muted">Help other developers move faster.</span>
          </>
        }
      />

      <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2">
        {cells.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-3xl border border-line bg-surface-2"
          >
            <div className="flex min-h-[340px] flex-1 items-center justify-center px-6 pb-4 pt-12 md:px-12">{c.scene}</div>
            <div className="px-6 pb-10 text-center md:px-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">{c.label}</p>
              <p className="mt-2 text-[18px] font-medium tracking-[-0.01em] text-ink">{c.line}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
