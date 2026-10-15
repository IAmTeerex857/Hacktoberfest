"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Asterisk, Brackets, Crosshair, WireCube } from "@/components/ui/doodles";
import { AgentsScene, DocsScene, SkillsScene } from "./track-scenes";

const tracks: { id: string; title: string; body: ReactNode; scene: ReactNode; tag: string }[] = [
  {
    id: "agents",
    tag: "track/01",
    title: "AI Agents",
    body: "Create payment assistants, transaction analysis tools or payout workflows using Spotflow APIs.",
    scene: <AgentsScene />,
  },
  {
    id: "recipes",
    tag: "track/02",
    title: "Agent Recipes & Skills",
    body: (
      <>
        Build reusable tool definitions, integration recipes and{" "}
        <code className="rounded-md border border-line bg-bg-sunken px-1.5 py-0.5 font-mono text-[0.88em] text-ink">skills.md</code>{" "}
        guides.
      </>
    ),
    scene: <SkillsScene />,
  },
  {
    id: "docs",
    tag: "track/03",
    title: "Docs & Developer Experience",
    body: "Improve documentation or create SDK templates that make integration easier.",
    scene: <DocsScene />,
  },
];

export function Tracks() {
  return (
    <section id="tracks" className="frame relative scroll-mt-16 px-5 py-17 md:px-10 md:py-23">
      <Crosshair className="right-4 top-24 hidden md:block" />
      <WireCube className="right-[16%] top-32 hidden lg:block" size={48} />
      <Brackets label="{ tracks: 3 }" className="right-[30%] top-44 hidden text-[12px] lg:block" />
      <Asterisk className="left-[52%] top-28 hidden lg:block" size={16} />

      <SectionHeader index="01" eyebrow="Tracks" title="Three ways to build">
        Choose your track when you sign up.
      </SectionHeader>

      <div className="mt-14 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-3">
        {tracks.map((t, i) => (
          <motion.article
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface"
          >
            <div className="flex flex-col gap-3 px-7 pt-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">{t.tag}</span>
              <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">{t.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted">{t.body}</p>
            </div>
            <div className="mt-auto pb-8 pt-6">{t.scene}</div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
