"use client";

/**
 * Hero 3D — a floating "AI core": wireframe icosahedron shell, emissive inner
 * orb, orbit rings and a particle halo. Procedural only (no assets).
 * - gentle idle rotation, mouse parallax, scroll-linked morph + colour drift
 * - reduced-motion / no-WebGL → static gradient fallback
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* module-level shared state — written by listeners, read in useFrame */
const state = { scroll: 0, mx: 0, my: 0 };

function Core() {
  const group = useRef<THREE.Group>(null!);
  const shellMat = useRef<THREE.MeshBasicMaterial>(null!);
  const inner = useRef<THREE.Mesh>(null!);
  const ringRefs = useRef<THREE.Mesh[]>([]);

  const hues = useMemo(
    () => [new THREE.Color("#4be1ff"), new THREE.Color("#9d6bff"), new THREE.Color("#ffb454"), new THREE.Color("#ff5c8a")],
    []
  );
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((_, dt) => {
    const s = state.scroll;
    const g = group.current;
    g.rotation.y += dt * 0.12;
    g.rotation.y += (s * Math.PI * 3 - g.rotation.y) * 0.03;
    g.rotation.x += (s * 1.1 + state.my * 0.35 - g.rotation.x) * 0.05;
    g.rotation.z += (state.mx * 0.18 - g.rotation.z) * 0.05;
    g.position.y = Math.sin(performance.now() / 1600) * 0.12;

    /* scroll morph: shell breathes open, inner orb counter-spins */
    const scale = 1 - s * 0.35;   // shrink as content takes over
    g.scale.setScalar(scale);
    inner.current.rotation.y -= dt * 0.5 + s * 0.02;

    /* colour drift across the journey */
    const seg = Math.min(Math.floor(s * (hues.length - 1)), hues.length - 2);
    const f = s * (hues.length - 1) - seg;
    tmp.copy(hues[seg]).lerp(hues[seg + 1], f);
    shellMat.current.color.copy(tmp);
    (inner.current.material as THREE.MeshStandardMaterial).emissive.copy(tmp);

    ringRefs.current.forEach((r, i) => {
      if (r) r.rotation.z += dt * (0.15 + i * 0.08) * (i % 2 ? -1 : 1);
    });
  });

  return (
    <group ref={group}>
      {/* wireframe shell */}
      <mesh>
        <icosahedronGeometry args={[1.9, 1]} />
        <meshBasicMaterial ref={shellMat} color="#4be1ff" wireframe transparent opacity={0.5} />
      </mesh>
      {/* emissive inner orb */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.0, 2]} />
        <meshStandardMaterial
          color="#0a0f1e" emissive="#4be1ff" emissiveIntensity={1.05}
          roughness={0.25} metalness={0.9} flatShading
        />
      </mesh>
      {/* orbit rings */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringRefs.current[i] = el; }}
          rotation={[Math.PI / 2 + (i - 1) * 0.55, i * 0.4, 0]}
        >
          <torusGeometry args={[2.55 + i * 0.42, 0.011, 8, 128]} />
          <meshBasicMaterial
            color={["#4be1ff", "#9d6bff", "#ff5c8a"][i]}
            transparent opacity={0.38}
          />
        </mesh>
      ))}
    </group>
  );
}

function Halo() {
  const pts = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const n = 700;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 4 + Math.random() * 14;
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 12;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame((_, dt) => {
    pts.current.rotation.y += dt * 0.015 + state.scroll * 0.0004;
  });
  return (
    <points ref={pts} geometry={geo}>
      <pointsMaterial color="#8b96ad" size={0.04} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function Rig() {
  useFrame(({ camera }) => {
    camera.position.x += (state.mx * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (-state.my * 0.5 - camera.position.y) * 0.04;
    camera.position.z = 6.6 + state.scroll * 2.4;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ok, setOk] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    /* capability + preference gates */
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMq = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onMq);
    try {
      const c = document.createElement("canvas");
      if (!c.getContext("webgl2") && !c.getContext("webgl")) setOk(false);
    } catch { setOk(false); }

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      state.scroll = max > 0 ? window.scrollY / max : 0;
      // fade the whole scene outside the hero so it never fights content
      if (wrapRef.current) {
        const s = state.scroll;
        const o = s < 0.08 ? 1 : s > 0.92 ? 0.45 : Math.max(0.16, 1 - (s - 0.08) * 4);
        wrapRef.current.style.opacity = String(o);
      }
    };
    const onMove = (e: PointerEvent) => {
      state.mx = e.clientX / window.innerWidth - 0.5;
      state.my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      mq.removeEventListener?.("change", onMq);
    };
  }, []);

  if (!ok || reduced) {
    /* static fallback: layered radial glow, zero animation cost */
    return (
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(75,225,255,.14), transparent 34%)," +
            "radial-gradient(circle at 52% 44%, rgba(157,107,255,.10), transparent 46%)",
        }}
      />
    );
  }

  return (
    <div ref={wrapRef} className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6.6], fov: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[4, 4, 6]} intensity={40} color="#4be1ff" />
        <pointLight position={[-5, -3, -4]} intensity={30} color="#9d6bff" />
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <Core />
        </Float>
        <Halo />
        <Rig />
      </Canvas>
    </div>
  );
}
