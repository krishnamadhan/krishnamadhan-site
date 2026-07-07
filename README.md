# krishnamadhan.com

Futuristic personal site. Next.js 14 (App Router) · TypeScript · Tailwind ·
Framer Motion · React Three Fiber (procedural 3D, no external assets).

## Run
    npm install
    npm run dev        # http://localhost:3000
    npm run build && npm start

## Edit content
Everything lives in **src/content/profile.ts** (copy, projects, timeline,
skills, links). Design/components need no touching for content changes.
Pre-publish checklist: **content/profile.review.md**.

## Images
Drop `public/portrait.jpg` and `public/og.png` (1200×630) — placeholders
render until then.

## Deploy (Vercel)
    npx vercel        # from this directory; zero config needed
Point krishnamadhan.com at the Vercel project when the domain is bought.

## Accessibility / perf notes
- `prefers-reduced-motion` → static gradient replaces the 3D scene; reveals render instantly
- WebGL capability-gated with graceful fallback
- 3D is procedural geometry only; dpr capped at 1.75; ~700 particles
