"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Brackets, Crosshair, FrameNodes } from "@/components/ui/doodles";
import { DocsAnswerScene, FeedScene, PortfolioScene, PrizesScene } from "./why-scenes";

const cells: { label: string; line: string; scene: ReactNode }[] = [
  { label: "Useful", line: "Build something useful.", scene: <FeedScene /> },
  { label: "Portfolio", line: "Make it part of your portfolio.", scene: <PortfolioScene /> },
  { label: "Move faster", line: "Help other developers move faster.", scene: <DocsAnswerScene /> },
  { label: "Swag & prizes", line: "Lots of swag and prizes to be won!", scene: <PrizesScene /> },
];

export function Why() {
  return (
    <section id="why" className="frame hairline-t relative scroll-mt-16">
      <FrameNodes />
      <Crosshair className="right-6 top-8 hidden md:block" />
      <Brackets label="// why build" className="right-[12%] top-28 hidden text-[12px] lg:block" />

      <div className="px-5 pb-12 pt-20 md:px-12 md:pb-16 md:pt-28">
        <SectionHeader
          index="03"
          eyebrow="Why join"
          title={
            <>
              Build something useful.{" "}
              <span className="text-muted">Make it part of your portfolio. Help other developers move faster.</span>
            </>
          }
        />
      </div>

      <div className="hairline-t relative grid md:grid-cols-2">
        {cells.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`flex flex-col border-line ${i % 2 === 0 ? "md:border-r" : ""} ${i < 2 ? "border-b" : i === 2 ? "border-b md:border-b-0" : ""}`}
          >
            <div className="flex min-h-[300px] flex-1 items-center justify-center px-6 pb-4 pt-10 md:px-10">{c.scene}</div>
            <div className="px-6 pb-9 text-center md:px-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">{c.label}</p>
              <p className="mt-2 text-[18px] font-medium tracking-[-0.01em] text-ink">{c.line}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
