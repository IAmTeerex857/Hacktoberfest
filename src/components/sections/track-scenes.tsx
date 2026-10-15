"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { Slab, Stage, Upright } from "@/components/iso/iso";
import { AGENTS } from "@/components/brand/agents";
import { SpotflowMark } from "@/components/brand/logo";
import { usePhase } from "@/components/iso/use-phase";

const spring = { type: "spring", stiffness: 260, damping: 24 } as const;
const PLATE = 220;

function Plate() {
  return <Slab x={0} y={0} w={PLATE} h={PLATE} depth={12} radius={10} tone="sunken" topClassName="dot-grid" />;
}

/* ---------------------------------------------------------------- agents */

// Each agent takes a turn: lift, send a tool call down its route to the
// Spotflow API in the middle, the API settles it, a result chip pops up.
const AGENT_SLOTS = [
  { x: 14, y: 14, tool: "create_payout()" },
  { x: 150, y: 14, tool: "list_transactions()" },
  { x: 150, y: 150, tool: "verify_webhook()" },
  { x: 14, y: 150, tool: "get_balance()" },
];
const AGENT_SIZE = 56;
const API = { x: 80, y: 80, size: 60 };
const AGENT_PHASES = AGENT_SLOTS.flatMap(() => [1100, 1300]);

function AgentLogo({ path, hex }: { path: string; hex: string }) {
  return (
    <svg viewBox="0 0 24 24" width={26} height={26} fill={hex} aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export function AgentsScene() {
  const { ref, phase } = usePhase(AGENT_PHASES, 1);
  const active = Math.floor(phase / 2);
  const settled = phase % 2 === 1;
  const center = API.x + API.size / 2;

  return (
    <div ref={ref}>
      <Stage size={PLATE} className="h-[250px]">
        <Plate />
        {/* routes */}
        <svg className="iso-face left-0 top-0" width={PLATE} height={PLATE} style={{ transform: "translateZ(12.5px)" }}>
          {AGENT_SLOTS.map((s, i) => (
            <path
              key={i}
              d={`M${s.x + AGENT_SIZE / 2} ${s.y + AGENT_SIZE / 2} L${center} ${center}`}
              fill="none"
              stroke={i === active ? "var(--blue)" : "var(--line-strong)"}
              strokeWidth={2}
              strokeDasharray="5 7"
              className={i === active ? "dash-flow" : ""}
            />
          ))}
        </svg>

        {/* Spotflow API */}
        <Slab
          x={API.x}
          y={API.y}
          w={API.size}
          h={API.size}
          depth={22}
          tone="blue"
          top={settled ? "var(--green)" : undefined}
          style={{ z: 12 }}
          topClassName="flex items-center justify-center"
        >
          <SpotflowMark className="h-6 w-auto text-white" />
        </Slab>

        {/* agents */}
        {AGENTS.map((a, i) => {
          const slot = AGENT_SLOTS[i];
          const on = i === active;
          return (
            <Slab
              key={a.slug}
              x={slot.x}
              y={slot.y}
              w={AGENT_SIZE}
              h={AGENT_SIZE}
              depth={10}
              initial={false}
              animate={{ z: on ? 26 : 12 }}
              transition={spring}
              topClassName="flex items-center justify-center"
            >
              <AgentLogo path={a.path} hex={a.hex} />
            </Slab>
          );
        })}

        {/* tool call travelling to the API */}
        <Slab
          key={`call-${active}`}
          x={0}
          y={0}
          w={14}
          h={14}
          depth={12}
          radius={3}
          tone="green"
          initial={{
            x: AGENT_SLOTS[active].x + AGENT_SIZE / 2 - 7,
            y: AGENT_SLOTS[active].y + AGENT_SIZE / 2 - 7,
            z: 40,
          }}
          animate={{ x: center - 7, y: center - 7, z: settled ? 14 : 40 }}
          transition={{ type: "spring", stiffness: 70, damping: 16 }}
        />

        {/* result chip over the active agent */}
        <Upright x={AGENT_SLOTS[active].x + AGENT_SIZE / 2} y={AGENT_SLOTS[active].y + AGENT_SIZE / 2} z={52}>
          <AnimatePresence>
            {settled && (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex items-center gap-1 whitespace-nowrap rounded-full bg-ink px-2 py-1 font-mono text-[9px] font-medium text-bg"
              >
                <span style={{ color: AGENTS[active].hex }}>{AGENTS[active].name}</span>
                <span className="opacity-60">·</span>
                {AGENT_SLOTS[active].tool}
                <Check className="size-2.5 text-green" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </Upright>
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
