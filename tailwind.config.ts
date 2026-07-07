import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#04060d", panel: "#0a0f1e",
        ink: "#e8edf7", dim: "#8b96ad",
        cyan: "#4be1ff", violet: "#9d6bff", amber: "#ffb454", rose: "#ff5c8a",
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
