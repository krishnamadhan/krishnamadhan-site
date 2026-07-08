import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#04060d", panel: "#0a0f1e",
        ink: "#e8edf7", dim: "#9aa6bd",
        cyan: "#4be1ff", violet: "#9d6bff", amber: "#ffb454", rose: "#ff5c8a",
        /* v4 "Premium Kinetic Editorial" tokens — additive, used only by /v3 */
        "v4-bg": "#0c0d10",
        "v4-panel": "#15171c",
        "v4-raised": "#1b1e24",
        "v4-line": "rgba(236,233,226,0.10)",
        "v4-ink": "#ece9e2",
        "v4-body": "#b8bdc7",
        "v4-mute": "#7c828d",
        "v4-blue": "#6ab0d8",
        "v4-amber": "#e0a458",
        "v4-violet": "#8b7bd8",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      animation: { "spin-slow": "spin 14s linear infinite" },
    },
  },
  plugins: [],
} satisfies Config;
