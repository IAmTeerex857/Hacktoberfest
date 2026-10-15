"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Slab, Stage } from "@/components/iso/iso";
import { usePhase } from "@/components/iso/use-phase";

const spring = { type: "spring", stiffness: 260, damping: 24 } as const;
const PLATE = 220;

function Plate() {
  return <Slab x={0} y={0} w={PLATE} h={PLATE} depth={12} radius={10} tone="sunken" topClassName="dot-grid" />;
}

/* ---------------------------------------------------------------- agents */

const AGENT_PHASES = [900, 900, 900, 1500];
// packet stops: chat → agent → payout → payout
const STOPS = [
  { x: 46, y: 152 },
  { x: 104, y: 96 },
  { x: 166, y: 40 },
  { x: 166, y: 40 },
];

export function AgentsScene() {
  const { ref, phase } = usePhase(AGENT_PHASES);
  const settled = phase === 3;
  const thinking = phase === 1;

  return (
    <div ref={ref}>
      <Stage size={PLATE} className="h-[250px]">
        <Plate />
        {/* route */}
        <svg className="iso-face left-0 top-0" width={PLATE} height={PLATE} style={{ transform: "translateZ(12.5px)" }}>
          <path
            d="M52 158 L110 102 L172 46"
            fill="none"
            stroke="var(--blue)"
            strokeWidth={2}
            strokeDasharray="5 7"
            className="dash-flow"
          />
        </svg>

        {/* chat prompt */}
        <Slab x={14} y={128} w={72} h={58} depth={8} style={{ z: 12 }} topClassName="p-2">
          <div className="font-mono text-[8px] leading-tight text-muted">prompt</div>
          <div className="mt-1 text-[9.5px] font-medium leading-tight text-ink">Pay my vendors</div>
        </Slab>

        {/* the agent */}
        <Slab
          x={74}
          y={66}
          w={60}
          h={60}
          depth={24}
          tone="blue"
          style={{ z: 12 }}
          animate={{ z: thinking ? 30 : 12 }}
          transition={spring}
          topClassName="flex items-center justify-center"
        >
          <motion.span
            className="text-[22px] leading-none text-white"
            animate={{ rotate: thinking ? 180 : 0, scale: thinking ? 1.15 : 1 }}
            transition={spring}
          >
            ✦
          </motion.span>
        </Slab>

        {/* payout */}
        <Slab
          x={132}
          y={10}
          w={72}
          h={60}
          depth={8}
          style={{ z: 12 }}
          top={settled ? "var(--green)" : undefined}
          topClassName="p-2"
        >
          <div className={`font-mono text-[8px] leading-tight ${settled ? "text-white/80" : "text-muted"}`}>payout</div>
          <div className={`mt-0.5 flex items-center gap-1 text-[11px] font-semibold ${settled ? "text-white" : "text-ink"}`}>
            ₦80,000 {settled && <Check className="size-3" strokeWidth={3} />}
          </div>
        </Slab>

        {/* data packet */}
        <Slab
          x={0}
          y={0}
          w={14}
          h={14}
          depth={12}
          radius={3}
          tone="green"
          initial={false}
          animate={{ x: STOPS[phase].x - 7, y: STOPS[phase].y - 7, z: phase === 1 ? 40 : 24 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
        />
      </Stage>
    </div>
  );
}

/* ---------------------------------------------------------------- skills */

const SKILL_PHASES = [1000, 650, 650, 650, 1600];
const PARTS = [
  { label: "skills.md", tone: "surface" as const, from: { x: 12, y: 140 } },
  { label: "tool.json", tone: "ink" as const, from: { x: 80, y: 76 } },
  { label: "recipe.ts", tone: "blue" as const, from: { x: 146, y: 12 } },
];
const CENTER = { x: 76, y: 80 };

export function SkillsScene() {
  const { ref, phase } = usePhase(SKILL_PHASES);

  return (
    <div ref={ref}>
      <Stage size={PLATE} className="h-[250px]">
        <Plate />
        {PARTS.map((p, i) => {
          const stacked = phase > i && phase < 5;
          return (
            <Slab
              key={p.label}
              x={0}
              y={0}
              w={66}
              h={58}
              depth={10}
              tone={p.tone}
              initial={false}
              animate={{
                x: stacked ? CENTER.x : p.from.x,
                y: stacked ? CENTER.y : p.from.y,
                z: stacked ? 12 + i * 12 : 12,
              }}
              transition={{ ...spring, delay: stacked ? 0 : i * 0.05 }}
              topClassName="flex items-end p-2"
            >
              <span
                className={`font-mono text-[9px] font-medium ${
                  p.tone === "surface" ? "text-ink" : p.tone === "ink" ? "text-bg" : "text-white"
                }`}
              >
                {p.label}
              </span>
            </Slab>
          );
        })}
        {/* ready badge */}
        <Slab
          x={CENTER.x + 13}
          y={CENTER.y + 12}
          w={40}
          h={34}
          depth={8}
          radius={5}
          tone="green"
          initial={false}
          animate={{ z: phase === 4 ? 64 : 12, opacity: phase === 4 ? 1 : 0 }}
          transition={spring}
          topClassName="flex items-center justify-center"
        >
          <Check className="size-4 text-white" strokeWidth={3} />
        </Slab>
      </Stage>
    </div>
  );
}

/* ------------------------------------------------------------------ docs */

const DOC_PHASES = [700, 700, 700, 700, 1400];
const DOC_LINES = [0.9, 0.62, 0.78, 0.48, 0.7];

export function DocsScene() {
  const { ref, phase } = usePhase(DOC_PHASES);

  return (
    <div ref={ref}>
      <Stage size={PLATE} className="h-[250px]">
        <Plate />
        {/* docs page */}
        <Slab x={18} y={30} w={118} h={160} depth={5} radius={5} style={{ z: 12 }} topClassName="p-3">
          <div className="h-2 w-12 rounded-sm bg-ink" />
          <div className="mt-3 space-y-2">
            {DOC_LINES.map((w, i) => (
              <motion.div
                key={i}
                className={`h-1.5 rounded-sm ${i === 2 ? "bg-blue" : "bg-line-strong"}`}
                initial={false}
                animate={{ width: phase >= i ? `${w * 100}%` : "8%" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            ))}
          </div>
        </Slab>

        {/* code block lifting off the page */}
        <Slab
          x={70}
          y={112}
          w={104}
          h={64}
          depth={6}
          radius={5}
          tone="term"
          initial={false}
          animate={{ z: phase >= 2 ? 44 : 18 }}
          transition={spring}
          topClassName="p-2 font-mono text-[8px] leading-[1.5]"
        >
          <div className="text-white/60">$ sdk-template init</div>
          <div className="text-[#2fd580]">✓ client ready</div>
          <div className="text-white/60">✓ examples added</div>
        </Slab>

        {/* SDK cube */}
        <Slab
          x={150}
          y={22}
          w={46}
          h={46}
          depth={44}
          radius={6}
          tone="green"
          initial={false}
          animate={{ z: 12, rotateZ: phase * 90 }}
          transition={spring}
          topClassName="flex items-center justify-center"
        >
          <span className="font-mono text-[10px] font-bold text-white">SDK</span>
        </Slab>
      </Stage>
    </div>
  );
}
