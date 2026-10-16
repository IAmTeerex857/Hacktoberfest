import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { LOGO_PATHS } from "@/components/brand/paths";
import { site } from "@/lib/site";

export const alt = "Spotflow Agentic Payments & DevEx Challenge. Build the next payment workflow. Online + Lagos hackathon, November 13–14.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0b0b0d";
const BLUE = "#2d5bff";
const VIOLET = "#8b6cf6";
const GREEN = "#0f9f5c";
const MUTED = "#6b6b76";
const LINE = "#e4e4e8";

function Card({ title, status, done, top, left }: { title: string; status: string; done: boolean; top: number; left: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: 300,
        height: 172,
        display: "flex",
        flexDirection: "column",
        padding: 22,
        background: "#fff",
        border: `2px solid ${LINE}`,
        borderRadius: 18,
        transform: "rotate(-14deg)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", fontSize: 22, fontWeight: 600, color: INK }}>{title}</div>
        <div
          style={{
            display: "flex",
            fontSize: 15,
            fontWeight: 600,
            padding: "6px 12px",
            borderRadius: 999,
            color: done ? "#fff" : MUTED,
            background: done ? GREEN : "#fff",
            border: done ? "none" : `2px solid ${LINE}`,
          }}
        >
          {status}
        </div>
      </div>
      <div style={{ display: "flex", height: 2, background: LINE, margin: "16px 0" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", height: 12, width: 210, borderRadius: 6, background: done ? GREEN : BLUE }} />
        <div style={{ display: "flex", height: 12, width: 160, borderRadius: 6, background: LINE }} />
        <div style={{ display: "flex", height: 12, width: 190, borderRadius: 6, background: LINE }} />
      </div>
    </div>
  );
}

const font = (file: string) => readFile(join(process.cwd(), "src/assets/fonts", file));

export default async function OpengraphImage() {
  const [medium, semibold, mono] = await Promise.all([
    font("Geist-Medium.ttf"),
    font("Geist-SemiBold.ttf"),
    font("GeistMono-Medium.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#f6f6f7",
          overflow: "hidden",
          fontFamily: "Geist",
        }}
      >
        {/* the rail */}
        <div
          style={{
            position: "absolute",
            left: 470,
            top: 540,
            width: 1100,
            height: 150,
            background: VIOLET,
            transform: "rotate(-14deg)",
            display: "flex",
          }}
        />
        <Card title="skills.md" status="Parsing" done={false} top={430} left={700} />
        <Card title="Transfer" status="Settled" done top={296} left={890} />

        {/* floating API tile, as in the hero */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 110,
            width: 132,
            height: 92,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: GREEN,
            borderRadius: 14,
            borderBottom: "14px solid #0a7a46",
            transform: "rotate(-14deg)",
            fontFamily: "Geist Mono",
            fontSize: 30,
            color: "#fff",
          }}
        >
          API
        </div>

        {/* copy */}
        <div style={{ position: "absolute", left: 110, top: 84, display: "flex", flexDirection: "column", width: 860 }}>
          <svg width="177" height="36" viewBox="0 0 118 24" fill={INK}>
            {LOGO_PATHS.map((d) => (
              <path key={d.slice(0, 24)} d={d} />
            ))}
          </svg>
          <div
            style={{
              display: "flex",
              marginTop: 44,
              fontSize: 19,
              letterSpacing: 2,
              color: MUTED,
              textTransform: "uppercase",
              fontFamily: "Geist Mono",
            }}
          >
            Agentic Payments &amp; DevEx Challenge
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 16, fontSize: 84, fontWeight: 600, lineHeight: 1, letterSpacing: -3.5, color: INK }}>
            <span>Build the next</span>
            <span style={{ color: VIOLET }}>payment workflow.</span>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 40 }}>
            {["Online + Lagos", site.eventDatesShort, "Register by Oct 30"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  fontSize: 21,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  color: INK,
                  background: "#fff",
                  border: `2px solid ${LINE}`,
                  borderRadius: 999,
                  padding: "10px 20px",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: medium, weight: 500, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
