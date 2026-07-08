"use client";

/**
 * KM Lab scene v4 — FORK of src/components/scene/KMScene.tsx for /v3 only.
 * Palette neutralised: neon cyan/violet/rose → warm off-white wireframes,
 * a muted blue (#6ab0d8) and soft amber (#e0a458) accents, plus a single
 * violet touch. Bloom softened so the troupe reads as a graphite-and-ember
 * instrument, not a neon sun. Geometry/motion unchanged from the original.
 *
 * The actor troupe.
 *
 * ONE canvas, EIGHT actors: every section has its own themed object
 * (core, identity helix, systems network, reaction flask, launch rocket,
 * stack atom, cricket swing, signal beacon). At each section boundary the
 * outgoing actor collapses to a point, a seed of light arcs across the
 * page, and the incoming actor blooms from it — energy flowing through
 * the UI instead of one object commuting left/right.
 *
 * All geometry is procedural (no external assets); particle systems are
 * small CPU-updated Points buffers. Reduced-motion / no-WebGL → static
 * CSS emblem, no canvas at all.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  CHAPTERS, sceneStore, updateChapterFromScroll,
  lerp, clamp01, smooth, backOut,
} from "./chapters";

const COOL = new THREE.Color("#6ab0d8");
const WARM = new THREE.Color("#e0a458");

/* ══════════════ shared rig: placement + collapse/bloom weight ══════════════ */

type Pose = { w: number; x: number; y: number; s: number; glow: number };

/** target pose for an actor given the current transition */
function poseTarget(actorIdx: number): Pose {
  const { from, to, frac } = sceneStore.trans;
  const a = CHAPTERS[from], b = CHAPTERS[to];
  const inA = a.actor === actorIdx, inB = b.actor === actorIdx;
  if (inA && inB)
    return { w: 1, x: lerp(a.x, b.x, frac), y: lerp(a.y, b.y, frac), s: lerp(a.scale, b.scale, frac), glow: lerp(a.glow, b.glow, frac) };
  if (inA)   // collapse during the first 45% of the handoff
    return { w: 1 - smooth(clamp01(frac / 0.45)), x: a.x, y: a.y, s: a.scale, glow: a.glow };
  if (inB)   // bloom (with overshoot) during the last 45%
    return { w: frac > 0.55 ? backOut(clamp01((frac - 0.55) / 0.45)) : 0, x: b.x, y: b.y, s: b.scale, glow: b.glow };
  return { w: 0, x: 0, y: 0, s: 0.001, glow: 0 };
}

/** frame-lerped placement shared by all actors; returns smoothed pose */
function useRig(actorIdx: number) {
  const pos = useRef<THREE.Group>(null!);
  const spin = useRef<THREE.Group>(null!);
  const cur = useRef<Pose>({ w: 0, x: 0, y: 0, s: 1, glow: 0.5 });
  const apply = (camera: THREE.Camera, t: number, dt: number) => {
    const tgt = poseTarget(actorIdx);
    const c = cur.current;
    const k = 1 - Math.pow(0.0008, dt);
    c.w += (tgt.w - c.w) * k; c.x += (tgt.x - c.x) * k; c.y += (tgt.y - c.y) * k;
    c.s += (tgt.s - c.s) * k; c.glow += (tgt.glow - c.glow) * k;

    const visible = c.w > 0.004;
    pos.current.visible = visible;
    if (!visible) return c;
    const isMobile = (camera as THREE.PerspectiveCamera).aspect < 0.9;
    pos.current.position.set(c.x * (isMobile ? 0.25 : 1), c.y + Math.sin(t * 0.7) * 0.05, 0);
    pos.current.scale.setScalar(Math.max(c.s * c.w, 0.0001));
    spin.current.rotation.x += (sceneStore.my * 0.3 - spin.current.rotation.x) * 0.05;
    spin.current.rotation.z += (sceneStore.mx * 0.15 - spin.current.rotation.z) * 0.05;
    return c;
  };
  return { pos, spin, apply, cur };
}

/* helper: build a Points cloud with a persistent position buffer */
function useParticles(count: number) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const seeds = Array.from({ length: count }, () => Math.random());
    return { geo, positions, seeds };
  }, [count]);
}

/* ══════════════ 0 · KM CORE — the brand nucleus (hero) ══════════════ */

function CoreActor() {
  const { pos, spin, apply } = useRig(0);
  const shell = useRef<THREE.Mesh>(null!);
  const inner = useRef<THREE.Mesh>(null!);
  const rings = useRef<THREE.Mesh[]>([]);

  useFrame(({ camera }, dt) => {
    const t = performance.now() / 1000;
    const c = apply(camera, t, dt);
    if (!pos.current.visible) return;
    spin.current.rotation.y += dt * 0.35;
    (shell.current.material as THREE.MeshBasicMaterial).opacity = 0.22 + 0.22 * c.glow;
    const im = inner.current.material as THREE.MeshStandardMaterial;
    im.emissiveIntensity = 0.18 + 0.22 * c.glow;
    inner.current.rotation.y -= dt * 0.5;
    rings.current.forEach((r, i) => { if (r) r.rotation.z += dt * (0.2 + i * 0.1) * (i % 2 ? -1 : 1); });
  });

  return (
    <group ref={pos}><group ref={spin}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshBasicMaterial color="#ece9e2" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.7, 1]} />
        {/* translucent graphite-blue glass, not flat paint (≤0.2 fill) */}
        <meshStandardMaterial color="#2a3d4a" emissive="#6ab0d8" emissiveIntensity={0.35}
          roughness={0.45} metalness={0.6} flatShading
          transparent opacity={0.18} depthWrite={false} />
      </mesh>
      {/* wireframe edge over the glass core so it still reads as an object */}
      <mesh>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshBasicMaterial color="#ece9e2" wireframe transparent opacity={0.4} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => { if (el) rings.current[i] = el; }}
              rotation={[Math.PI / 2 + (i - 1) * 0.55, i * 0.4, 0]}>
          <torusGeometry args={[2.3 + i * 0.36, 0.011, 8, 120]} />
          {/* the single violet moment allowed on the page */}
          <meshBasicMaterial color={i === 1 ? "#8b7bd8" : "#ece9e2"} transparent opacity={0.28} />
        </mesh>
      ))}
      {/* radial tick marks — instrument detail */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <mesh key={`t${i}`} position={[Math.cos(a) * 2.05, Math.sin(a) * 2.05, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[i % 6 === 0 ? 0.16 : 0.07, 0.012, 0.012]} />
            <meshBasicMaterial color="#ece9e2" transparent opacity={0.5} />
          </mesh>
        );
      })}
    </group></group>
  );
}

/* ══════════════ 1 · IDENTITY HELIX — double strand (about) ══════════════ */

const HELIX_N = 22;

function HelixActor() {
  const { pos, spin, apply } = useRig(1);
  const strandA = useRef<THREE.InstancedMesh>(null!);
  const strandB = useRef<THREE.InstancedMesh>(null!);
  const rungs = useRef<THREE.InstancedMesh>(null!);

  useEffect(() => {
    const d = new THREE.Object3D();
    const at = (i: number, phase: number) => {
      const f = i / (HELIX_N - 1);
      const ang = f * Math.PI * 4.2 + phase;
      return new THREE.Vector3(Math.cos(ang) * 0.62, (f - 0.5) * 2.6, Math.sin(ang) * 0.62);
    };
    for (let i = 0; i < HELIX_N; i++) {
      d.position.copy(at(i, 0)); d.scale.setScalar(1); d.updateMatrix();
      strandA.current.setMatrixAt(i, d.matrix);
      d.position.copy(at(i, Math.PI)); d.updateMatrix();
      strandB.current.setMatrixAt(i, d.matrix);
    }
    const up = new THREE.Vector3(0, 1, 0);
    for (let r = 0; r < 11; r++) {
      const i = r * 2;
      const a = at(i, 0), b = at(i, Math.PI);
      d.position.copy(a).add(b).multiplyScalar(0.5);
      d.quaternion.setFromUnitVectors(up, b.clone().sub(a).normalize());
      d.scale.set(1, a.distanceTo(b), 1); d.updateMatrix();
      rungs.current.setMatrixAt(r, d.matrix);
    }
    strandA.current.instanceMatrix.needsUpdate = true;
    strandB.current.instanceMatrix.needsUpdate = true;
    rungs.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(({ camera }, dt) => {
    const t = performance.now() / 1000;
    apply(camera, t, dt);
    if (!pos.current.visible) return;
    spin.current.rotation.y += dt * 0.55;
  });

  return (
    <group ref={pos}><group ref={spin}>
      <instancedMesh ref={strandA} args={[undefined, undefined, HELIX_N]}>
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshStandardMaterial color="#0a0f1e" emissive="#6ab0d8" emissiveIntensity={1.1} roughness={0.3} metalness={0.7} />
      </instancedMesh>
      <instancedMesh ref={strandB} args={[undefined, undefined, HELIX_N]}>
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshStandardMaterial color="#0a0f1e" emissive="#e0a458" emissiveIntensity={1.1} roughness={0.3} metalness={0.7} />
      </instancedMesh>
      <instancedMesh ref={rungs} args={[undefined, undefined, 11]}>
        <cylinderGeometry args={[0.016, 0.016, 1, 6]} />
        <meshBasicMaterial color="#ece9e2" transparent opacity={0.35} />
      </instancedMesh>
    </group></group>
  );
}

/* ══════════════ 2 · SYSTEMS GRID — node constellation (work) ══════════════ */

function NetworkActor() {
  const { pos, spin, apply } = useRig(2);
  const nodes = useRef<THREE.InstancedMesh>(null!);
  const core = useRef<THREE.Mesh>(null!);

  const { verts, edges } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.35, 0);
    const posAttr = ico.getAttribute("position");
    const seen = new Map<string, THREE.Vector3>();
    for (let i = 0; i < posAttr.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
      seen.set(v.toArray().map((n) => n.toFixed(3)).join(","), v);
    }
    const edges = new THREE.EdgesGeometry(ico);
    ico.dispose();
    return { verts: Array.from(seen.values()), edges };
  }, []);

  useEffect(() => {
    const d = new THREE.Object3D();
    verts.forEach((v, i) => {
      d.position.copy(v); d.scale.setScalar(1); d.updateMatrix();
      nodes.current.setMatrixAt(i, d.matrix);
    });
    nodes.current.instanceMatrix.needsUpdate = true;
  }, [verts]);

  useFrame(({ camera }, dt) => {
    const t = performance.now() / 1000;
    const c = apply(camera, t, dt);
    if (!pos.current.visible) return;
    spin.current.rotation.y += dt * 0.4;
    (core.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.7 + 0.5 * c.glow + 0.25 * Math.sin(t * 2.4);
  });

  return (
    <group ref={pos}><group ref={spin}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#ece9e2" transparent opacity={0.3} />
      </lineSegments>
      <instancedMesh ref={nodes} args={[undefined, undefined, verts.length]}>
        <icosahedronGeometry args={[0.11, 0]} />
        <meshStandardMaterial color="#0a0f1e" emissive="#e0a458" emissiveIntensity={1.2} roughness={0.3} metalness={0.8} flatShading />
      </instancedMesh>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.34, 1]} />
        {/* translucent graphite-blue glass core (was a flat blue disc) */}
        <meshStandardMaterial color="#2a3d4a" emissive="#6ab0d8" emissiveIntensity={1} roughness={0.3} metalness={0.85} flatShading
          transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.34, 1]} />
        <meshBasicMaterial color="#ece9e2" wireframe transparent opacity={0.4} />
      </mesh>
    </group></group>
  );
}

/* ══════════════ 3 · LAB REACTION — flask, bubbles, eruption (projects) ══════════════ */

const BUBBLES = 22, SPRAY = 34;

function FlaskActor() {
  const { pos, spin, apply } = useRig(3);
  const tilt = useRef<THREE.Group>(null!);
  const liquid = useRef<THREE.Mesh>(null!);
  const bubbles = useParticles(BUBBLES);
  const spray = useParticles(SPRAY);
  const bubblePts = useRef<THREE.Points>(null!);
  const sprayPts = useRef<THREE.Points>(null!);

  const flaskGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.0, -1.05), new THREE.Vector2(0.72, -1.05),
      new THREE.Vector2(0.66, -0.9), new THREE.Vector2(0.14, 0.25),
      new THREE.Vector2(0.13, 0.8), new THREE.Vector2(0.18, 0.92),
    ];
    return new THREE.LatheGeometry(pts, 26);
  }, []);

  useFrame(({ camera }, dt) => {
    const t = performance.now() / 1000;
    const c = apply(camera, t, dt);
    if (!pos.current.visible) return;
    const hot = sceneStore.hotModule >= 0 ? 1.6 : 1;
    // pour tilt deepens as you scroll through the projects section
    const local = sceneStore.chapterIndex === 3 ? sceneStore.local
      : sceneStore.chapterIndex > 3 ? 1 : 0;
    tilt.current.rotation.z = Math.sin(t * 0.6) * 0.08 + local * 0.3;

    (liquid.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      (0.9 + 0.3 * Math.sin(t * 3.1)) * hot * (0.6 + 0.5 * c.glow);

    // bubbles rise inside the cone
    for (let i = 0; i < BUBBLES; i++) {
      const f = (t * (0.14 + bubbles.seeds[i] * 0.12) + bubbles.seeds[i]) % 1;
      const r = (1 - f) * 0.4 * bubbles.seeds[i];
      const a = bubbles.seeds[i] * 40 + t * (0.5 + bubbles.seeds[i]);
      bubbles.positions.set([Math.cos(a) * r, -0.9 + f * 1.6, Math.sin(a) * r], i * 3);
    }
    bubblePts.current.geometry.attributes.position.needsUpdate = true;

    // eruption fountain from the neck
    for (let i = 0; i < SPRAY; i++) {
      const life = (t * (0.55 + spray.seeds[i] * 0.25) + spray.seeds[i]) % 1;
      const ang = spray.seeds[i] * Math.PI * 2;
      const spd = 0.5 + spray.seeds[i] * 0.9;
      spray.positions.set([
        Math.cos(ang) * 0.28 * life * spd,
        0.95 + life * 2.2 * spd - life * life * 1.9,
        Math.sin(ang) * 0.28 * life * spd,
      ], i * 3);
    }
    sprayPts.current.geometry.attributes.position.needsUpdate = true;
    (sprayPts.current.material as THREE.PointsMaterial).size = 0.06 * hot;
  });

  return (
    <group ref={pos}><group ref={spin}><group ref={tilt}>
      <mesh geometry={flaskGeo}>
        <meshBasicMaterial color="#ece9e2" transparent opacity={0.1} side={2} />
      </mesh>
      <mesh geometry={flaskGeo}>
        <meshBasicMaterial color="#ece9e2" wireframe transparent opacity={0.16} />
      </mesh>
      <mesh ref={liquid} position={[0, -0.72, 0]}>
        <coneGeometry args={[0.55, 0.62, 22]} />
        <meshStandardMaterial color="#1a0f2e" emissive="#e0a458" emissiveIntensity={1} roughness={0.25} metalness={0.4} transparent opacity={0.85} />
      </mesh>
      <points ref={bubblePts} geometry={bubbles.geo}>
        <pointsMaterial color="#e0a458" size={0.05} transparent opacity={0.8} depthWrite={false} />
      </points>
      <points ref={sprayPts} geometry={spray.geo}>
        <pointsMaterial color="#ece9e2" size={0.06} transparent opacity={0.85} depthWrite={false}
          blending={THREE.AdditiveBlending} />
      </points>
    </group></group></group>
  );
}

/* ══════════════ 4 · LAUNCH SEQUENCE — rocket rises with scroll (timeline) ══════════════ */

const EXHAUST = 26;

function RocketActor() {
  const { pos, spin, apply } = useRig(4);
  const ship = useRef<THREE.Group>(null!);
  const exhaust = useParticles(EXHAUST);
  const exhaustPts = useRef<THREE.Points>(null!);
  const alt = useRef(0);

  useFrame(({ camera }, dt) => {
    const t = performance.now() / 1000;
    apply(camera, t, dt);
    if (!pos.current.visible) return;
    // altitude follows progress through the timeline section
    const target = sceneStore.chapterIndex === 4 ? sceneStore.local
      : sceneStore.chapterIndex > 4 ? 1 : 0;
    alt.current += (target - alt.current) * (1 - Math.pow(0.002, dt));
    ship.current.position.y = -1.3 + alt.current * 2.5;
    ship.current.position.x = Math.sin(t * 1.2) * 0.05;
    ship.current.rotation.z = Math.sin(t * 0.9) * 0.05;

    const thrust = 0.5 + alt.current;
    for (let i = 0; i < EXHAUST; i++) {
      const life = (t * (1.6 + exhaust.seeds[i]) + exhaust.seeds[i]) % 1;
      const ang = exhaust.seeds[i] * Math.PI * 2;
      exhaust.positions.set([
        ship.current.position.x + Math.cos(ang) * 0.1 * life,
        ship.current.position.y - 0.75 - life * 0.9 * thrust,
        Math.sin(ang) * 0.1 * life,
      ], i * 3);
    }
    exhaustPts.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={pos}><group ref={spin}>
      <group ref={ship}>
        <mesh position={[0, 0.62, 0]}>
          <coneGeometry args={[0.2, 0.5, 16]} />
          <meshStandardMaterial color="#0a0f1e" emissive="#6ab0d8" emissiveIntensity={0.9} roughness={0.3} metalness={0.85} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.2, 0.22, 0.85, 16]} />
          <meshStandardMaterial color="#141b30" emissive="#141b30" roughness={0.35} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.1, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.075, 0.02, 8, 24]} />
          <meshStandardMaterial color="#0a0f1e" emissive="#e0a458" emissiveIntensity={1.2} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.52, 0]}>
          <cylinderGeometry args={[0.13, 0.2, 0.22, 16]} />
          <meshStandardMaterial color="#0a0f1e" emissive="#e0a458" emissiveIntensity={0.7} roughness={0.4} metalness={0.8} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos((i / 3) * Math.PI * 2) * 0.22, -0.42, Math.sin((i / 3) * Math.PI * 2) * 0.22]}
                rotation={[0, -(i / 3) * Math.PI * 2, 0]}>
            <boxGeometry args={[0.035, 0.34, 0.24]} />
            <meshStandardMaterial color="#0a0f1e" emissive="#6ab0d8" emissiveIntensity={0.5} roughness={0.35} metalness={0.85} />
          </mesh>
        ))}
      </group>
      <points ref={exhaustPts} geometry={exhaust.geo}>
        <pointsMaterial color="#e0a458" size={0.075} transparent opacity={0.85} depthWrite={false}
          blending={THREE.AdditiveBlending} />
      </points>
    </group></group>
  );
}

/* ══════════════ 5 · STACK ORBITALS — atom with live electrons (skills) ══════════════ */

const ORBITS = [0, 1, 2].map((i) => {
  const q = new THREE.Quaternion()
    .setFromEuler(new THREE.Euler(Math.PI / 2.6, (i / 3) * Math.PI, 0));
  return q;
});

function AtomActor() {
  const { pos, spin, apply } = useRig(5);
  const electrons = useRef<THREE.Mesh[]>([]);
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, dt) => {
    const t = performance.now() / 1000;
    apply(camera, t, dt);
    if (!pos.current.visible) return;
    spin.current.rotation.y += dt * 0.25;
    electrons.current.forEach((e, i) => {
      if (!e) return;
      const a = t * (1.1 + i * 0.3) + (i * Math.PI * 2) / 3;
      v.set(Math.cos(a) * 1.15, Math.sin(a) * 1.15, 0).applyQuaternion(ORBITS[i]);
      e.position.copy(v);
    });
  });

  return (
    <group ref={pos}><group ref={spin}>
      <mesh>
        <icosahedronGeometry args={[0.34, 1]} />
        <meshStandardMaterial color="#0a0f1e" emissive="#e0a458" emissiveIntensity={1.1} roughness={0.3} metalness={0.85} flatShading />
      </mesh>
      {ORBITS.map((q, i) => (
        <mesh key={i} quaternion={q}>
          <torusGeometry args={[1.15, 0.012, 8, 80]} />
          <meshBasicMaterial color={i === 1 ? "#e0a458" : "#ece9e2"} transparent opacity={0.32} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={`e${i}`} ref={(el) => { if (el) electrons.current[i] = el; }}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color="#0a0f1e" emissive={i === 1 ? "#e0a458" : "#6ab0d8"} emissiveIntensity={1.1} roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group></group>
  );
}

/* ══════════════ 6 · CHAMPION MODE — bat meets ball (field log) ══════════════ */

const SWING_PERIOD = 3.6;
const CONTACT = new THREE.Vector3(0.15, -0.75, 0);

function CricketActor() {
  const { pos, spin, apply } = useRig(6);
  const bat = useRef<THREE.Group>(null!);
  const ball = useRef<THREE.Group>(null!);
  const ph = (tl: number, a: number, b: number) => clamp01((tl - a) / (b - a));

  useFrame(({ camera }, dt) => {
    const t = performance.now() / 1000;
    apply(camera, t, dt);
    if (!pos.current.visible) return;
    const tl = t % SWING_PERIOD;

    // bat: cocked back → swing through contact → follow-through → recover
    const cocked = -0.95, followed = 1.15;
    let angle: number;
    if (tl < 0.75) angle = lerp(0.15, cocked, smooth(ph(tl, 0.15, 0.75)));
    else if (tl < 0.95) angle = lerp(cocked, followed, ph(tl, 0.75, 0.95));       // the swing
    else if (tl < 1.15) angle = followed + Math.sin(ph(tl, 0.95, 1.15) * Math.PI) * 0.12;
    else angle = lerp(followed, 0.15, smooth(ph(tl, 1.35, 2.6)));
    bat.current.rotation.z = angle;

    // ball: delivered in, struck at tl≈0.88, flies up and away with spin
    const hitT = 0.88;
    if (tl < hitT) {
      const f = smooth(ph(tl, 0.05, hitT));
      ball.current.position.set(lerp(-2.4, CONTACT.x, f), lerp(1.15, CONTACT.y, f) + Math.sin(f * Math.PI) * 0.35, 0);
      ball.current.scale.setScalar(1);
      ball.current.rotation.z -= dt * 6;
    } else {
      const tau = tl - hitT;
      ball.current.position.set(
        CONTACT.x - tau * 1.7,
        CONTACT.y + tau * 3.1 - tau * tau * 1.35,
        tau * 0.9,
      );
      ball.current.rotation.z += dt * 14;
      ball.current.scale.setScalar(Math.max(1 - ph(tl, 2.2, 3.3), 0.001)); // fade out at the boundary
    }
  });

  return (
    <group ref={pos}><group ref={spin}>
      {/* bat — pivot at the top of the handle */}
      <group ref={bat} position={[0.55, 0.55, 0]}>
        <mesh position={[0, -0.24, 0]}>
          <cylinderGeometry args={[0.045, 0.05, 0.48, 10]} />
          <meshStandardMaterial color="#141b30" emissive="#e0a458" emissiveIntensity={0.25} roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[0, -0.98, 0]}>
          <boxGeometry args={[0.26, 1.05, 0.1]} />
          <meshStandardMaterial color="#0a0f1e" emissive="#e0a458" emissiveIntensity={0.55} roughness={0.4} metalness={0.7} />
        </mesh>
      </group>
      {/* ball with seam */}
      <group ref={ball}>
        <mesh>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#2e0a14" emissive="#e0a458" emissiveIntensity={1.1} roughness={0.35} metalness={0.5} />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, 0.4, 0]}>
          <torusGeometry args={[0.16, 0.012, 6, 32]} />
          <meshBasicMaterial color="#e0a458" transparent opacity={0.8} />
        </mesh>
      </group>
    </group></group>
  );
}

/* ══════════════ 7 · SIGNAL BEACON — broadcast rings (contact) ══════════════ */

function BeaconActor() {
  const { pos, spin, apply } = useRig(7);
  const heart = useRef<THREE.Mesh>(null!);
  const rings = useRef<THREE.Mesh[]>([]);

  useFrame(({ camera }, dt) => {
    const t = performance.now() / 1000;
    const c = apply(camera, t, dt);
    if (!pos.current.visible) return;
    spin.current.rotation.y += dt * 0.5;
    const hm = heart.current.material as THREE.MeshStandardMaterial;
    hm.emissiveIntensity = 0.9 + 0.6 * Math.sin(t * 2.2) + 0.4 * c.glow;
    heart.current.scale.setScalar(1 + 0.07 * Math.sin(t * 2.2));
    rings.current.forEach((r, i) => {
      if (!r) return;
      const f = (t * 0.42 + i / 3) % 1;
      r.scale.setScalar(0.35 + f * 2.3);
      (r.material as THREE.MeshBasicMaterial).opacity = (1 - f) * 0.5;
    });
  });

  return (
    <group ref={pos}><group ref={spin}>
      <mesh ref={heart}>
        <octahedronGeometry args={[0.42, 0]} />
        {/* translucent graphite-blue glass diamond (was a solid blue diamond) */}
        <meshStandardMaterial color="#2a3d4a" emissive="#6ab0d8" emissiveIntensity={1.2} roughness={0.25} metalness={0.85} flatShading
          transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.42, 0]} />
        <meshBasicMaterial color="#ece9e2" wireframe transparent opacity={0.42} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => { if (el) rings.current[i] = el; }}>
          <torusGeometry args={[1, 0.02, 8, 64]} />
          <meshBasicMaterial color={i === 1 ? "#e0a458" : "#ece9e2"} transparent opacity={0.34} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={`d${i}`} position={[Math.cos(a) * 0.85, Math.sin(a) * 0.85, 0]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color="#e0a458" transparent opacity={0.7} />
          </mesh>
        );
      })}
    </group></group>
  );
}

/* ══════════════ the travelling seed — energy handoff between actors ══════════════ */

function Seed({ wrap }: { wrap: React.RefObject<HTMLDivElement> }) {
  const seed = useRef<THREE.Mesh>(null!);
  const halo = useRef<THREE.Mesh>(null!);
  const tint = useMemo(() => new THREE.Color(), []);
  const sFrac = useRef(0);
  const sDim = useRef(1);

  useFrame(({ camera }, dt) => {
    const t = performance.now() / 1000;
    const k = 1 - Math.pow(0.0008, dt);
    const { from, to, frac } = sceneStore.trans;
    sFrac.current += (frac - sFrac.current) * k;
    sDim.current += (sceneStore.dim - sDim.current) * k;
    if (wrap.current) wrap.current.style.opacity = String(0.2 + 0.8 * sDim.current);

    const a = CHAPTERS[from], b = CHAPTERS[to];
    const fp = sFrac.current;
    const active = a.actor !== b.actor && fp > 0.03 && fp < 0.97;
    seed.current.visible = halo.current.visible = active;
    if (!active) return;

    const isMobile = (camera as THREE.PerspectiveCamera).aspect < 0.9;
    const damp = isMobile ? 0.25 : 1;
    // arc over the content and toward the camera — flows *through* the page
    const x = lerp(a.x, b.x, smooth(fp)) * damp;
    const y = lerp(a.y, b.y, fp) + Math.sin(fp * Math.PI) * 1.1;
    const z = Math.sin(fp * Math.PI) * 1.5;
    seed.current.position.set(x, y, z);
    halo.current.position.set(x, y, z);
    const pulse = 1 + 0.25 * Math.sin(t * 9);
    // brightest mid-flight, when both actors are gone
    const midGlow = Math.sin(fp * Math.PI);
    seed.current.scale.setScalar(0.11 * pulse * (0.6 + midGlow));
    halo.current.scale.setScalar(0.2 * pulse * (0.4 + midGlow));
    tint.copy(COOL).lerp(WARM, lerp(a.warmth, b.warmth, fp));
    (seed.current.material as THREE.MeshBasicMaterial).color.copy(tint);
    (halo.current.material as THREE.MeshBasicMaterial).color.copy(tint);
  });

  return (
    <>
      <mesh ref={seed} visible={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ece9e2" />
      </mesh>
      <mesh ref={halo} visible={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ece9e2" transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}

/* ══════════════ canvas shell ══════════════ */

export default function KMScene() {
  const wrapRef = useRef<HTMLDivElement>(null!);
  const [ok, setOk] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMq = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onMq);
    try {
      const c = document.createElement("canvas");
      if (!c.getContext("webgl2") && !c.getContext("webgl")) setOk(false);
    } catch { setOk(false); }

    const onScroll = () => updateChapterFromScroll();
    const onMove = (e: PointerEvent) => {
      sceneStore.mx = e.clientX / window.innerWidth - 0.5;
      sceneStore.my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onMove, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onMove);
      mq.removeEventListener?.("change", onMq);
    };
  }, []);

  if (!ok || reduced) {
    return (
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 72% 40%, rgba(224,164,88,.10), transparent 32%)" }} />
    );
  }

  return (
    <div ref={wrapRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <Canvas camera={{ position: [0, 0, 6.4], fov: 46 }} dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 4, 6]} intensity={22} color="#ece9e2" />
        <pointLight position={[-5, -3, -4]} intensity={16} color="#e0a458" />
        <CoreActor />
        <HelixActor />
        <NetworkActor />
        <FlaskActor />
        <RocketActor />
        <AtomActor />
        <CricketActor />
        <BeaconActor />
        <Seed wrap={wrapRef} />
      </Canvas>
    </div>
  );
}
