"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Asterisk, Brackets, Crosshair, FrameNodes, WireCube } from "@/components/ui/doodles";
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
    <section id="tracks" className="frame hairline-t relative scroll-mt-16">
      <FrameNodes />
      <Crosshair className="right-6 top-8 hidden md:block" />
      <WireCube className="right-[14%] top-14 hidden lg:block" size={48} />
      <Brackets label="{ tracks: 3 }" className="right-[26%] top-24 hidden text-[12px] lg:block" />
      <Asterisk className="left-[46%] top-12 hidden lg:block" size={16} />

      <div className="px-5 pb-12 pt-20 md:px-12 md:pb-16 md:pt-28">
        <SectionHeader index="01" eyebrow="Tracks" title="Three ways to build">
          Choose your track when you sign up.
        </SectionHeader>
      </div>

      <div className="hairline-t grid md:grid-cols-3">
        {tracks.map((t, i) => (
          <motion.article
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative flex flex-col border-line ${i < 2 ? "border-b md:border-b-0 md:border-r" : ""}`}
          >
            <div className="flex flex-col gap-3 px-6 pt-8 md:px-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">{t.tag}</span>
              <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">{t.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted">{t.body}</p>
            </div>
            <div className="mt-auto overflow-hidden pb-6 pt-2">{t.scene}</div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
