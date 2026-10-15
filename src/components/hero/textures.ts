import { CanvasTexture, SRGBColorSpace } from "three";

export type Palette = {
  rail: string;
  railEdge: string;
  railLane: string;
  card: string;
  cardEdge: string;
  ink: string;
  muted: string;
  faint: string;
  line: string;
  blue: string;
  blueSoft: string;
  green: string;
  greenSoft: string;
  onGreen: string;
  amber: string;
  tileSide: string;
  packet: string;
};

export const palettes: Record<"light" | "dark", Palette> = {
  light: {
    rail: "#2d5bff",
    railEdge: "#6a8bff",
    railLane: "#a9bbff",
    card: "#ffffff",
    cardEdge: "#dedee4",
    ink: "#0b0b0d",
    muted: "#6b6b76",
    faint: "#a1a1aa",
    line: "#ececf0",
    blue: "#2d5bff",
    blueSoft: "#e8eeff",
    green: "#0f9f5c",
    greenSoft: "#e3f6ec",
    onGreen: "#ffffff",
    amber: "#c98a12",
    tileSide: "#d6d6de",
    packet: "#ffffff",
  },
  dark: {
    rail: "#3157ff",
    railEdge: "#6a8bff",
    railLane: "#1f3bc4",
    card: "#141418",
    cardEdge: "#2c2c34",
    ink: "#ededf0",
    muted: "#8a8a96",
    faint: "#55555f",
    line: "#24242b",
    blue: "#7b97ff",
    blueSoft: "#1a2350",
    green: "#2fd580",
    greenSoft: "#0e2a1d",
    onGreen: "#04140c",
    amber: "#e8b04a",
    tileSide: "#1c1c22",
    packet: "#2fd580",
  },
};

export type Fonts = { sans: string; mono: string };

export function readFonts(): Fonts {
  const root = getComputedStyle(document.documentElement);
  const sans = root.getPropertyValue("--font-geist-sans").trim() || "ui-sans-serif, system-ui";
  const mono = root.getPropertyValue("--font-geist-mono").trim() || "ui-monospace, monospace";
  return { sans, mono };
}

/* ------------------------------------------------------------------ cards */

type Tok = [text: string, tone: "ink" | "muted" | "blue" | "green" | "amber"];

export type CardSpec = {
  glyph: string;
  title: string;
  pending: string;
  done: string;
  ref: string;
  body:
    | { type: "code"; lines: Tok[][] }
    | { type: "prompt"; quote: string; steps: string[] }
    | { type: "amount"; amount: string; sub: string }
    | { type: "progress"; headline: string; sub: string; pending: number };
};

export const CARD_SPECS: CardSpec[] = [
  {
    glyph: "</>",
    title: "payout.ts",
    pending: "Running",
    done: "200 OK",
    ref: "req_8f2a…c41",
    body: {
      type: "code",
      lines: [
        [["await ", "blue"], ["spotflow", "ink"], [".payouts.", "muted"], ["create", "ink"], ["({", "muted"]],
        [["  amount", "ink"], [": ", "muted"], ["250_000", "amber"], [",", "muted"]],
        [["  currency", "ink"], [": ", "muted"], ['"NGN"', "green"], [",", "muted"]],
        [["  reference", "ink"], [": ", "muted"], ['"inv_0492"', "green"]],
        [["})", "muted"]],
      ],
    },
  },
  {
    glyph: "✦",
    title: "Payout agent",
    pending: "Thinking",
    done: "12 paid",
    ref: "run_31c9…77e",
    body: {
      type: "prompt",
      quote: "“Pay all approved March invoices.”",
      steps: ["→ found 12 invoices", "→ total ₦4,820,000", "→ queued 12 payouts"],
    },
  },
  {
    glyph: "₦",
    title: "Transfer",
    pending: "Pending",
    done: "Settled",
    ref: "txn_5d0e…a18",
    body: { type: "amount", amount: "₦250,000.00", sub: "To ••4821 · Ada O. · instant" },
  },
  {
    glyph: "md",
    title: "skills.md",
    pending: "Parsing",
    done: "Tool ready",
    ref: "skill/create_payout",
    body: {
      type: "code",
      lines: [
        [["## ", "muted"], ["create_payout", "ink"]],
        [["Send money to a bank account.", "muted"]],
        [["- ", "muted"], ["amount", "blue"], [": number", "ink"]],
        [["- ", "muted"], ["currency", "blue"], [': "NGN" | "USD"', "green"]],
      ],
    },
  },
  {
    glyph: "↯",
    title: "Webhook",
    pending: "Sending",
    done: "Delivered",
    ref: "evt_0b77…2fd",
    body: {
      type: "code",
      lines: [
        [["POST ", "blue"], ["/webhooks/payments", "ink"]],
        [["event", "ink"], [": ", "muted"], ['"payment.successful"', "green"]],
        [["amount", "ink"], [": ", "muted"], ["250000", "amber"]],
        [["signature", "ink"], [": ", "muted"], ['"t=1730…,v1=…"', "green"]],
      ],
    },
  },
  {
    glyph: "≡",
    title: "Reconciliation",
    pending: "Matching",
    done: "Balanced",
    ref: "recon_oct_wk3",
    body: { type: "progress", headline: "1,229 transactions", sub: "Bank feed ↔ ledger · October", pending: 0.72 },
  },
];

export const CARD_W = 3.2;
export const CARD_H = 2.0;
const PX = 320; // texture pixels per world unit

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function makeTexture(canvas: HTMLCanvasElement) {
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function drawCard(spec: CardSpec, done: boolean, p: Palette, f: Fonts) {
  const W = CARD_W * PX;
  const H = CARD_H * PX;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const tone = { ink: p.ink, muted: p.muted, blue: p.blue, green: p.green, amber: p.amber };
  const pad = 56;

  // face
  rr(ctx, 0, 0, W, H, 40);
  ctx.fillStyle = p.card;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = p.cardEdge;
  rr(ctx, 2, 2, W - 4, H - 4, 38);
  ctx.stroke();

  // header: glyph chip + title
  rr(ctx, pad, 48, 76, 76, 18);
  ctx.fillStyle = done ? p.greenSoft : p.blueSoft;
  ctx.fill();
  ctx.fillStyle = done ? p.green : p.blue;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${spec.glyph.length > 2 ? 26 : 36}px ${f.mono}`;
  ctx.fillText(spec.glyph, pad + 38, 88);

  ctx.textAlign = "left";
  ctx.fillStyle = p.ink;
  ctx.font = `600 40px ${f.sans}`;
  ctx.fillText(spec.title, pad + 100, 88);

  // status pill
  const label = done ? `✓ ${spec.done}` : spec.pending;
  ctx.font = `600 30px ${f.sans}`;
  const tw = ctx.measureText(label).width;
  const pw = tw + (done ? 48 : 76);
  const px = W - pad - pw;
  rr(ctx, px, 58, pw, 58, 29);
  if (done) {
    ctx.fillStyle = p.green;
    ctx.fill();
    ctx.fillStyle = p.onGreen;
    ctx.fillText(label, px + 24, 88);
  } else {
    ctx.lineWidth = 3;
    ctx.strokeStyle = p.cardEdge;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(px + 30, 87, 8, 0, Math.PI * 2);
    ctx.fillStyle = p.amber;
    ctx.fill();
    ctx.fillStyle = p.muted;
    ctx.fillText(label, px + 50, 88);
  }

  // divider
  ctx.fillStyle = p.line;
  ctx.fillRect(pad, 160, W - pad * 2, 3);

  // body
  const top = 214;
  const b = spec.body;
  if (b.type === "code") {
    ctx.font = `500 34px ${f.mono}`;
    b.lines.forEach((line, i) => {
      let x = pad;
      const y = top + i * 56;
      ctx.fillStyle = p.faint;
      ctx.textAlign = "right";
      ctx.fillText(String(i + 1), pad + 26, y);
      ctx.textAlign = "left";
      x += 52;
      for (const [text, t] of line) {
        ctx.fillStyle = tone[t];
        ctx.fillText(text, x, y);
        x += ctx.measureText(text).width;
      }
    });
  } else if (b.type === "prompt") {
    ctx.font = `500 38px ${f.sans}`;
    ctx.fillStyle = p.ink;
    ctx.fillText(b.quote, pad, top);
    ctx.font = `500 31px ${f.mono}`;
    b.steps.forEach((s, i) => {
      const reached = done || i < 2;
      ctx.fillStyle = reached ? (done ? p.green : p.muted) : p.faint;
      ctx.fillText(s, pad, top + 74 + i * 52);
    });
  } else if (b.type === "amount") {
    ctx.font = `600 104px ${f.sans}`;
    ctx.fillStyle = p.ink;
    ctx.fillText(b.amount, pad - 4, top + 54);
    ctx.font = `500 32px ${f.mono}`;
    ctx.fillStyle = p.muted;
    ctx.fillText(b.sub, pad, top + 160);
  } else {
    ctx.font = `600 54px ${f.sans}`;
    ctx.fillStyle = p.ink;
    ctx.fillText(b.headline, pad, top + 14);
    const pct = done ? 1 : b.pending;
    const bw = W - pad * 2;
    rr(ctx, pad, top + 78, bw, 24, 12);
    ctx.fillStyle = p.line;
    ctx.fill();
    rr(ctx, pad, top + 78, bw * pct, 24, 12);
    ctx.fillStyle = done ? p.green : p.blue;
    ctx.fill();
    ctx.font = `500 32px ${f.mono}`;
    ctx.fillStyle = p.muted;
    ctx.fillText(b.sub, pad, top + 160);
    ctx.textAlign = "right";
    ctx.fillStyle = done ? p.green : p.ink;
    ctx.fillText(`${Math.round(pct * 100)}% matched`, W - pad, top + 14);
    ctx.textAlign = "left";
  }

  // footer
  ctx.font = `500 28px ${f.mono}`;
  ctx.fillStyle = p.faint;
  ctx.fillText(spec.ref, pad, H - 50);
  ctx.textAlign = "right";
  ctx.fillText(done ? "agent · verified" : "agent · queued", W - pad, H - 50);

  return makeTexture(c);
}

/* ------------------------------------------------------------------ tiles */

export type TileSpec = { glyph: string; fill: keyof Palette; ink: keyof Palette };

export const TILE_SPECS: TileSpec[] = [
  { glyph: "₦", fill: "card", ink: "blue" },
  { glyph: "API", fill: "green", ink: "onGreen" },
  { glyph: "{ }", fill: "ink", ink: "card" },
  { glyph: "MCP", fill: "card", ink: "ink" },
  { glyph: "$", fill: "blue", ink: "card" },
  { glyph: ".md", fill: "card", ink: "green" },
  { glyph: "SDK", fill: "ink", ink: "card" },
  { glyph: "</>", fill: "card", ink: "blue" },
];

export function drawTile(spec: TileSpec, p: Palette, f: Fonts) {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = p[spec.fill];
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = p.cardEdge;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, S - 6, S - 6);
  ctx.fillStyle = p[spec.ink];
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const big = spec.glyph.length <= 1;
  ctx.font = `${big ? 600 : 700} ${big ? 128 : spec.glyph.length > 2 ? 72 : 88}px ${big ? f.sans : f.mono}`;
  ctx.fillText(spec.glyph, S / 2, S / 2 + 6);
  const tex = makeTexture(c);
  // The box's +Y face maps texture-up to −Z; turn it so glyphs read along the rail.
  tex.center.set(0.5, 0.5);
  tex.rotation = Math.PI / 2;
  return tex;
}
