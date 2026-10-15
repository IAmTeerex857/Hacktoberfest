"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import {
  Color,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Texture,
  Vector3,
} from "three";
import {
  CARD_H,
  CARD_SPECS,
  CARD_W,
  TILE_SPECS,
  drawCard,
  drawTile,
  palettes,
  readFonts,
  type Palette,
} from "./textures";

/*
 * The hero scene: an isometric payment rail. Cards (code, agent runs, transfers,
 * skills, webhooks, recon) ride a stepping conveyor; each dock under the agent
 * station, gets scanned, and flips from pending to settled before moving on.
 * Orthographic camera + flat shading + no tone mapping keeps every edge crisp
 * and every colour exactly what the palette says.
 */

const N = 14; // cards on the loop (even, so the station lands on a slot)
const SPACING = 3.75;
const LOOP = N * SPACING;
const MOVE = 1.15; // seconds moving
const DWELL = 1.15; // seconds docked at the station
const CYCLE = MOVE + DWELL;
const SCAN_START = 0.12;
const SCAN_LEN = 0.55;
const CARD_X = -0.55;
const CARD_LIFT = 0.16;

// Dimetric camera: card faces (+X) turn toward the viewer, the rail (−Z) runs
// left→right with a shallow rise, like a conveyor seen from slightly above.
const VIEW = new Vector3(1, 0.75, 0.45).normalize();
const RIGHT = new Vector3(VIEW.z, 0, -VIEW.x).normalize();
const UP = new Vector3().crossVectors(RIGHT, VIEW.clone().negate()).normalize();

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mod = (a: number, n: number) => ((a % n) + n) % n;

type Textures = {
  cards: { pending: Texture; done: Texture }[];
  tiles: Texture[];
};

function useTextures(theme: "light" | "dark", ready: boolean): Textures | null {
  const tex = useMemo(() => {
    if (!ready) return null;
    const p = palettes[theme];
    const f = readFonts();
    return {
      cards: CARD_SPECS.map((s) => ({ pending: drawCard(s, false, p, f), done: drawCard(s, true, p, f) })),
      tiles: TILE_SPECS.map((s) => drawTile(s, p, f)),
    };
  }, [theme, ready]);

  useEffect(
    () => () => {
      if (!tex) return;
      tex.cards.forEach((c) => {
        c.pending.dispose();
        c.done.dispose();
      });
      tex.tiles.forEach((t) => t.dispose());
    },
    [tex],
  );

  return tex;
}

/* ------------------------------------------------------------- camera rig */

function Rig({ compact }: { compact: boolean }) {
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);

  useLayoutEffect(() => {
    const { camera } = get();
    // The canvas is full-bleed; anchor the docked card to the 1200px content column.
    const column = Math.min(size.width, 1200);
    const zoom = compact
      ? Math.min(size.width / 7.5, size.height / 6, 72)
      : Math.min(column / 12.5, size.height / 7.8, 112);
    // Where the station (world origin) should sit on screen, as a fraction of the canvas.
    const fx = compact ? 0.5 : ((size.width - column) / 2 + column * 0.78) / size.width;
    const fy = compact ? 0.8 : 0.84;
    const dx = ((fx - 0.5) * size.width) / zoom;
    const dy = ((fy - 0.5) * size.height) / zoom;
    const target = new Vector3().addScaledVector(RIGHT, -dx).addScaledVector(UP, dy);
    camera.position.copy(target).addScaledVector(VIEW, 60);
    camera.lookAt(target);
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }, [get, size, compact]);

  return null;
}

/* ------------------------------------------------------------------- rail */

function Rail({ p }: { p: Palette }) {
  const lanes = useRef<InstancedMesh>(null);
  const packets = useRef<InstancedMesh>(null);
  const LEN = 90;
  const LANE_N = 40;
  const PACKET_N = 14;
  const dummy = useMemo(() => new Object3D(), []);

  useLayoutEffect(() => {
    const m = packets.current;
    if (!m) return;
    const a = new Color(p.packet);
    const b = new Color(p.railEdge);
    for (let i = 0; i < PACKET_N; i++) m.setColorAt(i, i % 3 === 0 ? b : a);
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [p]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const l = lanes.current;
    if (l) {
      for (let i = 0; i < LANE_N; i++) {
        const z = mod(i * 2.2 - t * 1.6, LANE_N * 2.2) - LANE_N * 1.1;
        dummy.position.set(1.45, 0.005, z);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        l.setMatrixAt(i, dummy.matrix);
      }
      l.instanceMatrix.needsUpdate = true;
    }
    const m = packets.current;
    if (m) {
      for (let i = 0; i < PACKET_N; i++) {
        const lane = i % 2;
        const speed = lane ? 5.2 : 3.6;
        const z = mod(i * 6.4 - t * speed, PACKET_N * 6.4) - PACKET_N * 3.2;
        dummy.position.set(lane ? 1.05 : 1.85, 0.09, z);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* bed */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[4.6, 0.5, LEN]} />
        <meshLambertMaterial color={p.rail} />
      </mesh>
      {/* edge rails */}
      {[-2.22, 2.22].map((x) => (
        <mesh key={x} position={[x, 0.04, 0]} receiveShadow>
          <boxGeometry args={[0.16, 0.08, LEN]} />
          <meshLambertMaterial color={p.railEdge} />
        </mesh>
      ))}
      {/* lane dashes */}
      <instancedMesh ref={lanes} args={[undefined, undefined, LANE_N]}>
        <boxGeometry args={[0.07, 0.01, 1]} />
        <meshBasicMaterial color={p.railLane} />
      </instancedMesh>
      {/* data packets */}
      <instancedMesh ref={packets} args={[undefined, undefined, PACKET_N]} castShadow>
        <boxGeometry args={[0.22, 0.18, 0.42]} />
        <meshLambertMaterial />
      </instancedMesh>
    </group>
  );
}

/* --------------------------------------------------------------- conveyor */

type Clock = { t: number };

function Conveyor({ tex, p, clock }: { tex: Textures; p: Palette; clock: React.RefObject<Clock> }) {
  const cards = useRef<(Group | null)[]>([]);
  const faces = useRef<(Mesh | null)[]>([]);
  const state = useRef<boolean[]>(Array(N).fill(false));
  const scan = useRef<Mesh>(null);

  // Theme changed → textures were rebuilt; re-point every face.
  useLayoutEffect(() => {
    faces.current.forEach((f, i) => {
      if (!f) return;
      const spec = tex.cards[i % tex.cards.length];
      (f.material as MeshBasicMaterial).map = state.current[i] ? spec.done : spec.pending;
      (f.material as MeshBasicMaterial).needsUpdate = true;
    });
  }, [tex]);

  useFrame(() => {
    const t = clock.current.t;
    const cycle = Math.floor(t / CYCLE);
    const phase = t - cycle * CYCLE;
    const moving = phase < MOVE;
    const offset = (cycle + easeInOut(Math.min(phase / MOVE, 1))) * SPACING;
    const dwell = moving ? -1 : phase - MOVE;
    const scanK = dwell < 0 ? -1 : (dwell - SCAN_START) / SCAN_LEN;

    for (let i = 0; i < N; i++) {
      const g = cards.current[i];
      if (!g) continue;
      const s = mod(i * SPACING + offset, LOOP); // distance travelled along the loop
      const z = LOOP / 2 - s; // +z = lower-left on screen, -z = upper-right
      const atStation = Math.abs(z) < 0.01 && !moving;
      const done = z < -0.01 || (atStation && scanK >= 1);

      let hop = 0;
      if (atStation && scanK >= 1) {
        const h = Math.min((scanK - 1) * SCAN_LEN / 0.32, 1);
        hop = Math.sin(h * Math.PI) * 0.28;
      }
      g.position.set(CARD_X, CARD_LIFT + CARD_H / 2 + hop, z);

      if (done !== state.current[i]) {
        state.current[i] = done;
        const f = faces.current[i];
        if (f) {
          const spec = tex.cards[i % tex.cards.length];
          (f.material as MeshBasicMaterial).map = done ? spec.done : spec.pending;
        }
      }
    }

    const scanning = scanK >= 0 && scanK < 1;
    if (scan.current) {
      scan.current.visible = scanning;
      scan.current.position.y = CARD_LIFT + CARD_H - 0.08 - Math.max(scanK, 0) * (CARD_H - 0.16);
    }
  });

  return (
    <group>
      {Array.from({ length: N }, (_, i) => (
        <group key={i} ref={(el) => void (cards.current[i] = el)}>
          <RoundedBox args={[0.1, CARD_H, CARD_W]} radius={0.04} smoothness={3} castShadow>
            <meshLambertMaterial color={p.cardEdge} />
          </RoundedBox>
          <mesh ref={(el) => void (faces.current[i] = el)} position={[0.052, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[CARD_W - 0.02, CARD_H - 0.02]} />
            <meshBasicMaterial map={tex.cards[i % tex.cards.length].pending} transparent alphaTest={0.5} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* scan line sweeping the docked card */}
      <mesh ref={scan} position={[CARD_X + 0.07, 0, 0]} visible={false}>
        <boxGeometry args={[0.02, 0.045, CARD_W + 0.12]} />
        <meshBasicMaterial color={p.green} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ tiles */

// Tiles are placed in screen space relative to the docked card (right, up,
// depth along the view axis), so they never drift under the copy or off-frame.
const TILE_SCREEN: [number, number, number][] = [
  [2.2, 3.1, -2],
  [1.5, 5.7, -3],
  [-0.7, 4.3, -4],
];
const TILE_POS = TILE_SCREEN.map(([r, u, d]) =>
  new Vector3().addScaledVector(RIGHT, r).addScaledVector(UP, u).addScaledVector(VIEW, d).toArray(),
);

function Tiles({ tex, p }: { tex: Textures; p: Palette }) {
  const refs = useRef<(Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.position.y = TILE_POS[i][1] + Math.sin(t * 1.1 + i * 1.7) * 0.18;
      m.rotation.y = Math.sin(t * 0.5 + i) * 0.12;
    });
  });

  return (
    <group>
      {TILE_POS.map((pos, i) => (
        <mesh key={i} ref={(el) => void (refs.current[i] = el)} position={pos} castShadow>
          <boxGeometry args={[1.05, 0.26, 1.05]} />
          <meshLambertMaterial attach="material-0" color={p.tileSide} />
          <meshLambertMaterial attach="material-1" color={p.tileSide} />
          <meshBasicMaterial attach="material-2" map={tex.tiles[i % tex.tiles.length]} toneMapped={false} />
          <meshLambertMaterial attach="material-3" color={p.tileSide} />
          <meshLambertMaterial attach="material-4" color={p.tileSide} />
          <meshLambertMaterial attach="material-5" color={p.tileSide} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ scene */

function Scene({
  theme,
  compact,
  reduced,
  pointer,
}: {
  theme: "light" | "dark";
  compact: boolean;
  reduced: boolean;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let live = true;
    document.fonts.ready.then(() => live && setFontsReady(true));
    return () => {
      live = false;
    };
  }, []);

  const tex = useTextures(theme, fontsReady);
  const p = palettes[theme];
  // Paused-aware animation clock: starts mid-dwell so the first frame already shows a docked card.
  const clock = useRef<Clock>({ t: MOVE + SCAN_START + SCAN_LEN * 0.4 });
  const world = useRef<Group>(null);

  useFrame((_, dt) => {
    if (!reduced) clock.current.t += Math.min(dt, 0.05);
    const g = world.current;
    if (g) {
      const k = 1 - Math.exp(-dt * 3);
      g.rotation.y += (pointer.current.x * 0.06 - g.rotation.y) * k;
      g.rotation.x += (pointer.current.y * 0.025 - g.rotation.x) * k;
    }
  });

  if (!tex) return null;

  return (
    <>
      <ambientLight intensity={1.55} />
      <directionalLight
        position={[6, 14, 3]}
        intensity={1.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-bias={-0.0004}
      />
      <Rig compact={compact} />
      <group ref={world}>
        <Rail p={p} />
        <Conveyor tex={tex} p={p} clock={clock} />
        <Tiles tex={tex} p={p} />
      </group>
    </>
  );
}

export default function PaymentRail({
  theme,
  compact,
  reduced,
  active,
}: {
  theme: "light" | "dark";
  compact: boolean;
  reduced: boolean;
  active: boolean;
}) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      orthographic
      flat
      shadows="percentage"
      dpr={[1, 2]}
      frameloop={!active ? "never" : reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [60, 60, 60], zoom: 40, near: 0.1, far: 400 }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Scene theme={theme} compact={compact} reduced={reduced} pointer={pointer} />
    </Canvas>
  );
}
