"use client";

/**
 * SafeCanvas — R3F canvas with WebGL detection, DPR cap, mobile-lighter
 * defaults, and a graceful static fallback. Variants pass `fallback` for
 * no-WebGL / reduced-motion users.
 */
import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";

export function useWebGL(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch { setOk(false); }
  }, []);
  return ok;
}

export function useIsMobile(): boolean {
  const [m, setM] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(max-width: 767px)");
    const fn = () => setM(q.matches);
    fn();
    q.addEventListener("change", fn);
    return () => q.removeEventListener("change", fn);
  }, []);
  return m;
}

export function SafeCanvas({
  children, fallback = null, className = "", camera,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  camera?: { position?: [number, number, number]; fov?: number };
}) {
  const gl = useWebGL();
  const reduced = useReducedMotion();
  if (gl === null) return <div className={className} aria-hidden />;
  if (!gl || reduced) return <div className={className} aria-hidden>{fallback}</div>;
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: camera?.position ?? [0, 0, 6], fov: camera?.fov ?? 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}

/** Damped exponential approach — call inside useFrame. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
