"use client";

/**
 * KM Lab Engine — contained 3D "AI core" for the hero chamber.
 * No longer a full-page backdrop: it renders inside its parent container
 * (the holographic viewport in the hero), so it can never sit behind text.
 * Still idle-rotates, reacts to pointer, and spins up with page scroll.
 * Reduced-motion / no-WebGL → static emblem fallback.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const state = { scroll: 0, mx: 0, my: 0 };

function Core() {
  const group = useRef<THREE.Group>(null!);
  const shellMat = useRef<THREE.MeshBasicMaterial>(null!);
  const inner = useRef<THREE.Mesh>(null!);
  const ringRefs = useRef<THREE.Mesh[]>([]);

  useFrame((_, dt) => {
    const s = state.scroll;
    const g = group.current;
    g.rotation.y += dt * 0.16 + (s * Math.PI * 2 - g.rotation.y) * 0.02;
    g.rotation.x += (state.my * 0.4 - g.rotation.x) * 0.06;
    g.rotation.z += (state.mx * 0.22 - g.rotation.z) * 0.06;
    inner.current.rotation.y -= dt * 0.55;
    ringRefs.current.forEach((r, i) => {
      if (r) r.rotation.z += dt * (0.2 + i * 0.09) * (i % 2 ? -1 : 1);
    });
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.75, 1]} />
        <meshBasicMaterial ref={shellMat} color="#4be1ff" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.95, 2]} />
        <meshStandardMaterial
          color="#0a0f1e" emissive="#4be1ff" emissiveIntensity={1.1}
          roughness={0.25} metalness={0.9} flatShading
        />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringRefs.current[i] = el; }}
          rotation={[Math.PI / 2 + (i - 1) * 0.55, i * 0.4, 0]}
        >
          <torusGeometry args={[2.35 + i * 0.38, 0.012, 8, 120]} />
          <meshBasicMaterial
            color={["#4be1ff", "#9d6bff", "#ffb454"][i]}
            transparent opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene() {
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

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      state.scroll = max > 0 ? window.scrollY / max : 0;
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
    return (
      <div aria-hidden className="absolute inset-0 grid place-items-center">
        <div className="w-40 h-40 rounded-full border border-cyan/40 grid place-items-center"
             style={{ background: "radial-gradient(circle, rgba(75,225,255,.18), transparent 70%)" }}>
          <div className="w-20 h-20 rotate-45 border border-violet/50 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6.4], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.55} />
        <pointLight position={[4, 4, 6]} intensity={38} color="#4be1ff" />
        <pointLight position={[-5, -3, -4]} intensity={28} color="#9d6bff" />
        <Float speed={1.3} rotationIntensity={0.18} floatIntensity={0.5}>
          <Core />
        </Float>
      </Canvas>
    </div>
  );
}
