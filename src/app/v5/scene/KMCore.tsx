"use client";

/**
 * v5 "KM Core" — the single persistent particle field.
 *
 * ONE <Canvas>, ONE THREE.Points (soft round sprites, custom ShaderMaterial,
 * one draw call) plus two hairline "instrument" rings. It morphs between six
 * precomputed formation buffers on damped scroll — no per-frame allocation,
 * no postprocessing, no React state in the loop. Adaptive particle count;
 * reduced-motion / no-WebGL renders a small static CSS/SVG emblem instead.
 *
 * Drive comes from v5Store (scene/store.ts): fA/fB/ft (formation blend),
 * gx/gy/gs/dim (world placement), energy (hero loosening), pointer parallax.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { buildFormations } from "./formations";
import { ANCHORS, updateFieldFromScroll, v5Store } from "./store";

/* ── adaptive particle count: viewport + a cheap core-count probe ── */
function pickCount() {
  if (typeof window === "undefined") return 320;
  const w = window.innerWidth;
  const cores = navigator.hardwareConcurrency || 4;
  let n = w >= 1024 ? 1200 : w >= 640 ? 700 : 320;
  if (cores <= 4 && n > 900) n = 900; // modest headroom on low-core devices (Pi)
  return n;
}

/* ── the field ── */
function Field({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null!);
  const ringA = useRef<THREE.Mesh>(null!);
  const ringB = useRef<THREE.Mesh>(null!);
  const group = useRef<THREE.Group>(null!);

  const F = useMemo(() => buildFormations(count), [count]);

  // soft radial sprite so points read as glowing motes, not squares
  const sprite = useMemo(() => {
    const s = 64;
    const cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const ctx = cv.getContext("2d")!;
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    // hard-ish core + soft falloff → crisp glowing mote, not a fog puff
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.22, "rgba(255,255,255,0.9)");
    g.addColorStop(0.5, "rgba(255,255,255,0.22)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const tex = new THREE.CanvasTexture(cv);
    return tex;
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // start on the nucleus
    const pos = new Float32Array(F.targets[0]);
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(F.colors, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(F.sizes, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(F.seed, 3));
    return g;
  }, [F]);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0.9 },
      uSize: { value: 1 },
      uPix: { value: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5) },
      uTex: { value: sprite },
    },
    vertexShader: /* glsl */`
      attribute vec3 aColor;
      attribute float aSize;
      attribute vec3 aSeed; // phase, speed, amp
      uniform float uTime;
      uniform float uSize;
      uniform float uPix;
      varying vec3 vColor;
      void main() {
        vColor = aColor;
        vec3 p = position;
        float w = sin(uTime * aSeed.y + aSeed.x);
        p.x += w * aSeed.z;
        p.y += cos(uTime * aSeed.y * 0.8 + aSeed.x) * aSeed.z;
        p.z += w * aSeed.z * 0.6;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = clamp(aSize * uSize * uPix * (120.0 / -mv.z), 1.0, 26.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */`
      uniform sampler2D uTex;
      uniform float uOpacity;
      varying vec3 vColor;
      void main() {
        float a = texture2D(uTex, gl_PointCoord).a;
        if (a < 0.02) discard;
        gl_FragColor = vec4(vColor, a * uOpacity);
      }
    `,
  }), [sprite]);

  useEffect(() => () => {
    geo.dispose(); mat.dispose(); sprite.dispose();
  }, [geo, mat, sprite]);

  // damped display state (never reallocated)
  const cur = useRef({
    gx: ANCHORS[0].x, gy: ANCHORS[0].y, gs: ANCHORS[0].s,
    dim: ANCHORS[0].dim, expand: 0, mx: 0, my: 0, beacon: 0,
  });
  const tmpA = useMemo(() => new THREE.Vector3(), []);
  const tmpB = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const t = performance.now() / 1000;
    const c = cur.current;
    const kSlow = 1 - Math.pow(0.02, dt);   // placement / dim
    const kMorph = 1 - Math.pow(0.015, dt); // particle morph

    // placement + brightness
    c.gx += (v5Store.gx - c.gx) * kSlow;
    c.gy += (v5Store.gy - c.gy) * kSlow;
    c.gs += (v5Store.gs - c.gs) * kSlow;
    c.dim += (v5Store.dim - c.dim) * kSlow;
    c.mx += (v5Store.mx - c.mx) * kSlow;
    c.my += (v5Store.my - c.my) * kSlow;
    const expandTarget = v5Store.fA === 0 ? v5Store.energy * 0.2 : 0;
    c.expand += (expandTarget - c.expand) * kSlow;
    // broadcast pulse when the beacon (contact) formation is active
    const beaconTarget = (v5Store.fB === 5 && v5Store.ft > 0.4) || v5Store.fA === 5 ? 1 : 0;
    c.beacon += (beaconTarget - c.beacon) * (1 - Math.pow(0.1, dt));

    const isMobile = window.innerWidth < 640;
    const xDamp = isMobile ? 0.35 : 1;
    group.current.position.set(c.gx * xDamp, c.gy, 0);
    const beaconPulse = c.beacon * (0.06 * Math.sin(t * 2.2) + 0.04);
    group.current.scale.setScalar(c.gs * (1 + c.expand) * (1 + beaconPulse));
    group.current.rotation.y += dt * 0.06;
    // pointer parallax (±) — gentle
    group.current.rotation.x += (c.my * 0.18 - group.current.rotation.x) * 0.04;
    group.current.rotation.z += (c.mx * 0.08 - group.current.rotation.z) * 0.04;

    // morph the position buffer toward mix(A,B,t)
    const A = F.targets[v5Store.fA];
    const B = F.targets[v5Store.fB];
    const ft = v5Store.ft;
    const arr = (geo.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      tmpA.set(A[i3], A[i3 + 1], A[i3 + 2]);
      tmpB.set(B[i3], B[i3 + 1], B[i3 + 2]);
      const tx = tmpA.x + (tmpB.x - tmpA.x) * ft;
      const ty = tmpA.y + (tmpB.y - tmpA.y) * ft;
      const tz = tmpA.z + (tmpB.z - tmpA.z) * ft;
      arr[i3] += (tx - arr[i3]) * kMorph;
      arr[i3 + 1] += (ty - arr[i3 + 1]) * kMorph;
      arr[i3 + 2] += (tz - arr[i3 + 2]) * kMorph;
    }
    (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;

    // material life
    mat.uniforms.uTime.value = t;
    mat.uniforms.uOpacity.value = 0.34 + 0.56 * c.dim;
    mat.uniforms.uSize.value = 1 + c.expand * 1.2 + (v5Store.hotModule >= 0 ? 0.25 : 0);

    // instrument rings — slow, quiet, structural
    ringA.current.rotation.z += dt * 0.05;
    ringA.current.rotation.x = 1.1 + c.my * 0.1;
    ringB.current.rotation.z -= dt * 0.035;
    ringB.current.rotation.y += dt * 0.04;
    const ro = (0.1 + 0.14 * c.dim);
    (ringA.current.material as THREE.MeshBasicMaterial).opacity = ro;
    (ringB.current.material as THREE.MeshBasicMaterial).opacity = ro * 0.8;
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geo} material={mat} frustumCulled={false} />
      <mesh ref={ringA} rotation={[1.1, 0, 0]}>
        <torusGeometry args={[2.5, 0.004, 8, 160]} />
        <meshBasicMaterial color="#ece9e2" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh ref={ringB} rotation={[0.5, 0.4, 0]}>
        <torusGeometry args={[3.05, 0.004, 8, 160]} />
        <meshBasicMaterial color="#ece9e2" transparent opacity={0.16} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── static fallback emblem (reduced-motion / no-WebGL) ── */
function Emblem() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
      <svg
        className="absolute right-[14%] top-1/2 -translate-y-1/2 opacity-[0.5]"
        width="360" height="360" viewBox="0 0 360 360" fill="none"
      >
        <circle cx="180" cy="180" r="150" stroke="#ece9e2" strokeOpacity="0.12" />
        <circle cx="180" cy="180" r="110" stroke="#ece9e2" strokeOpacity="0.16" />
        <circle cx="180" cy="180" r="46" fill="#6ab0d8" fillOpacity="0.05" stroke="#6ab0d8" strokeOpacity="0.3" />
        {Array.from({ length: 40 }).map((_, i) => {
          const a = (i / 40) * Math.PI * 2;
          const r = 60 + (i % 5) * 20;
          return (
            <circle key={i} cx={180 + Math.cos(a) * r} cy={180 + Math.sin(a) * r}
              r={i % 7 === 0 ? 2.4 : 1.2}
              fill={i % 9 === 0 ? "#e0a458" : "#ece9e2"}
              fillOpacity={i % 7 === 0 ? 0.8 : 0.4} />
          );
        })}
      </svg>
    </div>
  );
}

/* ── canvas shell + capability gating + scroll/pointer plumbing ── */
export default function KMCore() {
  const [mode, setMode] = useState<"loading" | "webgl" | "emblem">("loading");
  const [count, setCount] = useState(320);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      const t = document.createElement("canvas");
      webgl = !!(t.getContext("webgl2") || t.getContext("webgl"));
    } catch { webgl = false; }
    if (reduced || !webgl) { setMode("emblem"); return; }
    setCount(pickCount());
    setMode("webgl");

    const onScroll = () => updateFieldFromScroll();
    const onMove = (e: PointerEvent) => {
      v5Store.mx = e.clientX / window.innerWidth - 0.5;
      v5Store.my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onMove, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  if (mode === "emblem") return <Emblem />;
  if (mode === "loading") return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6.4], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Field count={count} />
      </Canvas>
    </div>
  );
}
