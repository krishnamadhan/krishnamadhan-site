"use client";

/**
 * v5 — abstract "proof modules": five DISTINCT on-brand telemetry panels that
 * replace the identical "COMING SOON" boxes. Pure CSS/SVG, no images. Each is a
 * small honest slice of that system's telemetry, framed in the v5 panel style
 * with one subtle looping micro-motion (disabled under prefers-reduced-motion
 * via the .v5-anim guard in globals.css). Swap for real captures later.
 */

import React from "react";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="v5-proof">
      <div className="v5-proof-scan" aria-hidden />
      <div className="relative h-full w-full p-3.5 md:p-4">{children}</div>
    </div>
  );
}

/* 01 · Banter Agent — WhatsApp-style message trace */
export function WhatsAppTrace() {
  return (
    <Frame>
      <div className="flex h-full flex-col justify-end gap-2">
        <div className="v5-bubble v5-bubble-in">
          <span className="text-v4-body">semma scene machan, start the game</span>
          <span className="v5-tick text-v4-amber">09:41</span>
        </div>
        <div className="v5-bubble v5-bubble-in self-start">
          <span className="v5-mono2 text-v4-blue">/antakshari start</span>
          <span className="v5-tick text-v4-amber">09:41</span>
        </div>
        <div className="v5-bubble v5-bubble-out self-end">
          <span className="text-v4-ink">Round 1 locked · your turn da</span>
          <span className="v5-tick text-v4-mute">09:42</span>
        </div>
        <div className="v5-typing self-end" aria-hidden>
          <span /><span /><span />
        </div>
      </div>
    </Frame>
  );
}

/* 02 · Cosmo — robot telemetry */
export function RobotTelemetry() {
  const bars = [
    { k: "MOOD", v: 72, tone: "amber" },
    { k: "ENERGY", v: 48, tone: "blue" },
    { k: "ATTACH", v: 63, tone: "amber" },
  ];
  return (
    <Frame>
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-2">
          {bars.map((b) => (
            <div key={b.k} className="grid grid-cols-[4.2rem_1fr] items-center gap-2">
              <span className="v5-mono2 text-v4-mute">{b.k}</span>
              <span className="v5-meter">
                <span
                  className={`v5-meter-fill ${b.tone === "blue" ? "v5-fill-blue" : "v5-fill-amber"}`}
                  style={{ width: `${b.v}%` }}
                />
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1" aria-hidden>
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className={`v5-node-tick ${i < 9 ? "on" : ""}`} style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
        <p className="v5-mono2 text-v4-body">
          <span className="text-v4-blue">TEMP</span> 47°C
          <span className="text-v4-mute"> · </span>
          <span className="text-v4-blue">BATT</span> 61%
          <span className="text-v4-mute"> · </span>
          <span className="text-v4-amber">CURIOUS</span>
        </p>
      </div>
    </Frame>
  );
}

/* 03 · IPL Fantasy — live leaderboard ticker */
export function LiveLeaderboard() {
  const rows = [
    { r: 1, n: "sixer_syndicate", p: 1842 },
    { r: 2, n: "cover_drive_co", p: 1790 },
    { r: 3, n: "yorker_yaar", p: 1731 },
    { r: 4, n: "midwicket_mafia", p: 1698 },
  ];
  return (
    <Frame>
      <div className="flex h-full flex-col">
        <div className="mb-2 flex items-center justify-between">
          <span className="v5-mono2 text-v4-mute">GAMEWEEK 07</span>
          <span className="v5-live"><span className="v5-live-dot" />LIVE</span>
        </div>
        <div className="flex flex-1 flex-col justify-center">
          {rows.map((row, i) => (
            <div key={row.n} className={`v5-lb-row ${i === 0 ? "v5-lb-lead" : ""}`}>
              <span className="v5-mono2 w-5 text-v4-amber">{row.r}</span>
              <span className="flex-1 truncate text-[12px] text-v4-ink">{row.n}</span>
              <span className="v5-mono2 text-v4-blue">{row.p}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* 04 · BSPL — auction / draft board */
export function AuctionBoard() {
  const chips = [
    { n: "R. SHARMA", v: "12.5", s: "sold" },
    { n: "J. BUMRAH", v: "9.0", s: "bid" },
    { n: "V. KOHLI", v: "14.0", s: "" },
    { n: "S. GILL", v: "7.5", s: "" },
    { n: "R. PANT", v: "10.0", s: "bid" },
    { n: "K. RABADA", v: "6.5", s: "" },
  ];
  return (
    <Frame>
      <div className="flex h-full flex-col">
        <div className="mb-2 flex items-center justify-between">
          <span className="v5-mono2 text-v4-mute">AUCTION · SET B</span>
          <span className="v5-mono2 text-v4-amber">PURSE 42.0cr</span>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-1.5">
          {chips.map((c) => (
            <div key={c.n} className={`v5-chip-card ${c.s === "sold" ? "v5-chip-sold" : c.s === "bid" ? "v5-chip-bid" : ""}`}>
              <span className="v5-mono2 text-[9px] text-v4-body leading-tight">{c.n}</span>
              <span className="v5-mono2 text-[10px] text-v4-ink">{c.v}cr</span>
              {c.s === "sold" && <span className="v5-sold-tag">SOLD</span>}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* 05 · KM·OS — system architecture grid */
export function ArchitectureGrid() {
  const nodes = [
    { x: 20, y: 30, l: "Next.js" },
    { x: 78, y: 22, l: "R3F" },
    { x: 50, y: 55, l: "Pi 5" },
    { x: 22, y: 78, l: "Supabase" },
    { x: 80, y: 74, l: "framer" },
  ];
  const edges = [[0, 2], [1, 2], [2, 3], [2, 4], [0, 1]];
  return (
    <Frame>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <pattern id="v5grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" stroke="#ece9e2" strokeOpacity="0.05" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#v5grid)" />
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
            stroke="#6ab0d8" strokeOpacity="0.35" strokeWidth="0.4" className="v5-edge" />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={i === 2 ? 2.6 : 1.7}
            fill={i === 2 ? "#e0a458" : "#ece9e2"} fillOpacity={i === 2 ? 0.9 : 0.6} />
        ))}
      </svg>
      <div className="relative h-full w-full">
        {nodes.map((n, i) => (
          <span key={i} className="v5-arch-label"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}>{n.l}</span>
        ))}
      </div>
    </Frame>
  );
}

export const PROOF_MODULES = [
  WhatsAppTrace, RobotTelemetry, LiveLeaderboard, AuctionBoard, ArchitectureGrid,
];
