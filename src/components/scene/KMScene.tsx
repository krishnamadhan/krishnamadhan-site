"use client";

/**
 * The persistent KM Lab object — ONE canvas, ONE object, eight forms.
 * Reads interpolated chapter params from sceneStore (written by the scroll
 * listener) and lerps toward them every frame, so section changes feel like
 * the same product re-forming: rings flatten into a lens, modules undock
 * into a systems map, the core compresses into a trajectory capsule, warms
 * into a field lens, and finally breathes as a signal beacon.
 *
 * Reduced-motion / no-WebGL → static CSS emblem, no canvas at all.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { sceneStore, updateChapterFromScroll } from "@/lib/sceneChapters";

const COOL = new THREE.Color("#4be1ff");
const WARM = new THREE.Color("#ffb454");
const VIOLET = new THREE.Color("#9d6bff");

const MODULE_ACCENTS = ["#9d6bff", "#4be1ff", "#ffb454", "#ff5c8a", "#4be1ff", "#9d6bff"];

function LabObject({ wrap }: { wrap: React.RefObject<HTMLDivElement> }) {
  const group = useRef<THREE.Group>(null!);
  const shell = useRef<THREE.Mesh>(null!);
  const inner = useRef<THREE.Mesh>(null!);
  const rings = useRef<THREE.Mesh[]>([]);
  const modules = useRef<THREE.Mesh[]>([]);
  const tint = useMemo(() => new THREE.Color(), []);
  const cur = useRef({ ...sceneStore.params });

  useFrame(({ camera }, dt) => {
    const t = performance.now() / 1000;
    const p = sceneStore.params;
    const c = cur.current;
    // double-smooth: scroll already eased; frame-lerp kills any residual step
    const k = 1 - Math.pow(0.0008, dt);
    for (const key of ["x", "y", "scale", "glow", "warmth", "spread", "flat", "split", "squash", "spin", "pulse", "dim"] as const)
      c[key] += (p[key] - c[key]) * k;

    if (wrap.current) wrap.current.style.opacity = String(0.2 + 0.8 * c.dim);
    const g = group.current;
    const isMobile = (camera as THREE.PerspectiveCamera).aspect < 0.9;
    g.position.x = c.x * (isMobile ? 0.25 : 1);
    g.position.y = c.y + Math.sin(t * 0.7) * 0.045;
    const pulse = c.pulse * (0.06 * Math.sin(t * 2.2));
    g.scale.set(c.scale + pulse, (c.scale + pulse) * c.squash, c.scale + pulse);

    g.rotation.y += dt * 0.35 * c.spin;
    g.rotation.x += (sceneStore.my * 0.35 - g.rotation.x) * 0.05;
    g.rotation.z += (sceneStore.mx * 0.2 - g.rotation.z) * 0.05;

    tint.copy(COOL).lerp(WARM, c.warmth);
    (shell.current.material as THREE.MeshBasicMaterial).color.copy(tint);
    (shell.current.material as THREE.MeshBasicMaterial).opacity = 0.28 + 0.3 * c.glow;
    const im = inner.current.material as THREE.MeshStandardMaterial;
    im.emissive.copy(tint);
    im.emissiveIntensity = 0.5 + 0.8 * c.glow + c.pulse * (0.35 + 0.35 * Math.sin(t * 2.2));
    inner.current.rotation.y -= dt * 0.5 * c.spin;

    rings.current.forEach((r, i) => {
      if (!r) return;
      if (i === 3) {   // aperture iris: faces camera, counter-rotates, tint + glow only
        r.rotation.z -= dt * 0.6 * c.spin;
        const am = r.material as THREE.MeshStandardMaterial;
        am.emissive.copy(tint);
        am.emissiveIntensity = 0.5 + 0.7 * c.glow;
        return;
      }
      const base = Math.PI / 2 + (i - 1) * 0.55;
      r.rotation.x = base + (0 - base) * c.flat * (i === 1 ? 0.9 : 1); // flatten to disc
      r.rotation.z += dt * (0.2 + i * 0.1) * c.spin * (i % 2 ? -1 : 1);
      r.scale.setScalar(c.spread * (1 + i * 0.02));
      const m = r.material as THREE.MeshBasicMaterial;
      m.color.copy(i === 1 ? VIOLET : tint);
      m.opacity = 0.14 + 0.28 * c.glow;
    });

    modules.current.forEach((mod, i) => {
      if (!mod) return;
      const ang = (i / 6) * Math.PI * 2 + t * 0.25 * c.spin;
      const r = 1.6 * c.split * c.spread;
      mod.position.set(Math.cos(ang) * r, Math.sin(ang) * r * (1 - c.flat * 0.75), Math.sin(ang * 1.3) * 0.3 * c.split);
      const hot = sceneStore.hotModule === i % 4 ? 1 + 0.3 * Math.sin(t * 6) : 1;
      mod.scale.setScalar(Math.max(c.split, 0.001) * 0.32 * hot);
      const mm = mod.material as THREE.MeshStandardMaterial;
      mm.emissiveIntensity = (0.6 + 0.6 * c.glow) * (sceneStore.hotModule === i % 4 ? 1.8 : 1);
    });
  });

  return (
    <group ref={group}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshBasicMaterial color="#4be1ff" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.92, 2]} />
        <meshStandardMaterial color="#0a0f1e" emissive="#4be1ff" emissiveIntensity={1}
          roughness={0.3} metalness={0.85} flatShading />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => { if (el) rings.current[i] = el; }}
              rotation={[Math.PI / 2 + (i - 1) * 0.55, i * 0.4, 0]}>
          <torusGeometry args={[2.3 + i * 0.36, 0.011, 8, 120]} />
          <meshBasicMaterial transparent opacity={0.35} />
        </mesh>
      ))}
      {/* mechanical aperture: bright inner iris ring + dark blades */}
      <mesh ref={(el) => { if (el) rings.current[3] = el; }} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.15, 0.045, 12, 64]} />
        <meshStandardMaterial color="#141b30" emissive="#4be1ff" emissiveIntensity={0.9}
          roughness={0.2} metalness={1} />
      </mesh>
      {/* radial tick marks — instrument detail */}
      <group>
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <mesh key={`t${i}`} position={[Math.cos(a) * 2.05, Math.sin(a) * 2.05, 0]}
                  rotation={[0, 0, a]}>
              <boxGeometry args={[i % 6 === 0 ? 0.16 : 0.07, 0.012, 0.012]} />
              <meshBasicMaterial color="#4be1ff" transparent opacity={0.5} />
            </mesh>
          );
        })}
      </group>
      {/* glass chamber shell — faint fresnel-ish skin */}
      <mesh>
        <sphereGeometry args={[2.9, 32, 32]} />
        <meshBasicMaterial color="#9d6bff" transparent opacity={0.02} side={2} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`m${i}`} ref={(el) => { if (el) modules.current[i] = el; }}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#0a0f1e" emissive={MODULE_ACCENTS[i]}
            emissiveIntensity={0.8} roughness={0.35} metalness={0.8} flatShading />
        </mesh>
      ))}
    </group>
  );
}

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
        style={{ background: "radial-gradient(circle at 72% 40%, rgba(75,225,255,.12), transparent 30%)" }} />
    );
  }

  return (
    <div ref={wrapRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <Canvas camera={{ position: [0, 0, 6.4], fov: 46 }} dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.55} />
        <pointLight position={[4, 4, 6]} intensity={36} color="#4be1ff" />
        <pointLight position={[-5, -3, -4]} intensity={26} color="#9d6bff" />
        <LabObject wrap={wrapRef} />
      </Canvas>
    </div>
  );
}
