/**
 * ALL editable site content lives here. Change text, add projects, reorder
 * timeline — no component edits needed.
 * Items needing manual verification before publish: content/profile.review.md
 */

export const profile = {
  name: "Krishna Madhan",
  domain: "krishnamadhan.com",
  headline: "Krishna Madhan",
  subheadline:
    "Software engineer building AI-native systems, robotic companions, and real-world automation.",
  microcopy: ["Bangalore", "Tiruvannamalai", "NIT Trichy", "JPMorgan Chase"],
  location: "Bangalore, India",
  about: [
    "I grew up in Tiruvannamalai, Tamil Nadu — a temple town where things get built to last. That instinct followed me through NIT Trichy and into a software engineering career in Bangalore, where I work on cloud and data platforms at JPMorgan Chase.",
    "Outside work, my living room doubles as a robotics lab. A Raspberry Pi 5 on my shelf runs a small civilization: a robot pet with moods and memory, a WhatsApp AI companion that banters in Tanglish, fantasy-cricket platforms for my friends, and an agentic workflow where AI teammates file and finish their own tickets.",
    "My belief is simple: machines should feel alive, not automated — and the future gets built by people who ship real things, test them on real hardware, and let real users (or one very demanding friend group) break them.",
  ],
  work: {
    intro:
      "By day I build the plumbing modern data runs on — cloud infrastructure and data platforms designed for reliability at scale. Broad strokes only; the interesting internals stay at work.",
    areas: [
      { title: "Cloud Infrastructure", desc: "AWS estates provisioned as code with Terraform; deployment pipelines on Spinnaker.", tags: ["AWS", "Terraform", "Spinnaker"] },
      { title: "Data Platforms", desc: "ETL pipelines and Lambda-based processing feeding data-mesh architectures.", tags: ["ETL", "Lambda", "Data Mesh"] },
      { title: "Automation", desc: "Onboarding automation, vendor data systems, and support tooling that removes toil.", tags: ["Python", "Automation"] },
      { title: "Reliability", desc: "Production support, data quality guardrails, and the unglamorous work that keeps platforms trustworthy.", tags: ["Reliability", "Data Quality"] },
    ],
  },
  identityStack: [
    { k: "ORIGIN", v: "Tiruvannamalai roots — built to last" },
    { k: "FOUNDATION", v: "NIT Trichy engineering" },
    { k: "CRAFT", v: "Cloud & data platforms, Bangalore" },
    { k: "AFTER HOURS", v: "AI + robotics experiments that ship" },
  ],
  workMap: [
    { id: "cloud", title: "Cloud Infra", desc: "AWS estates as code — Terraform plans, Spinnaker pipelines.", x: 0 },
    { id: "data", title: "Data Pipelines", desc: "ETL + Lambda processing feeding data-mesh architectures.", x: 1 },
    { id: "mesh", title: "Data Mesh", desc: "Domain-owned data products with quality contracts.", x: 2 },
    { id: "auto", title: "Automation", desc: "Onboarding, vendor data and support tooling that removes toil.", x: 3 },
    { id: "rel", title: "Reliability", desc: "Production support and the guardrails that keep data trustworthy.", x: 4 },
    { id: "ai", title: "AI Workflows", desc: "Agentic development loops assisting the whole chain.", x: 5 },
  ],
  projects: [
    {
      title: "Banter Agent",
      id: "KM-01", slug: "banter-agent", status: "Active", featured: true,
      desc: "A memory-driven AI companion living in WhatsApp — Tanglish personality modes, 17 group games, roasts, news digests and fantasy cricket. Powered by Claude, hardened by relentless friends.",
      tags: ["TypeScript", "Claude AI", "WhatsApp", "Supabase"],
      accent: "violet",
    },
    {
      title: "Raspberry Pi Robot Pet",
      id: "KM-02", slug: "robot-pet", status: "Active", featured: true,
      desc: "An autonomous companion on a Pi 5: camera vision, voice, OLED eyes, touch and motion sensors, motors — driven by a personality engine with moods, circadian energy and episodic memory of the people it meets.",
      tags: ["Python", "asyncio", "Computer Vision", "ESP32"],
      accent: "cyan",
    },
    {
      title: "AI Coding Workflows",
      id: "KM-03", slug: "ai-coding-workflows", status: "Prototype", featured: false,
      desc: "An agentic development loop where Claude Code plays scrum master and Codex plays engineer — a kanban of AI teammates with task leases, journals, reviews and a daily standup, running unattended.",
      tags: ["Claude Code", "Codex", "Agents", "Automation"],
      accent: "amber",
    },
    {
      title: "Data Platform Automation",
      id: "KM-04", slug: "data-platform-automation", status: "Building", featured: false,
      desc: "Professional craft: onboarding automation, ETL reliability and data-quality tooling for cloud data platforms — the systems that make data trustworthy at scale.",
      tags: ["AWS", "Terraform", "ETL", "Data Mesh"],
      accent: "rose",
    },
  ],
  timeline: [
    { era: "Roots", title: "Tiruvannamalai, Tamil Nadu", desc: "Temple-town beginnings; a family culture of building things that serve people." },
    { era: "Foundations", title: "NIT Trichy", desc: "Engineering degree; the habit of first-principles thinking." },
    { era: "Craft", title: "Software Engineering, Bangalore", desc: "Cloud and data platform engineering at JPMorgan Chase." },
    { era: "Scale", title: "Cloud & Data Systems", desc: "AWS, Terraform, Spinnaker, ETL and data-mesh work — automation as a way of life." },
    { era: "Agents", title: "AI-Native Workflows", desc: "Claude Code, Codex, and multi-agent systems that plan, build and review autonomously." },
    { era: "Machines", title: "Robotics & Banter Agent", desc: "A robot pet with feelings and a WhatsApp companion with opinions — AI made personal." },
    { era: "Next", title: "Future-Facing Systems", desc: "Personal AI, robotics, and public products. The lab keeps growing." },
  ],
  skills: [
    { cluster: "Languages", note: "daily drivers", items: ["Java", "Python", "TypeScript"] },
    { cluster: "Web", note: "product surfaces", items: ["React", "Next.js", "Node.js"] },
    { cluster: "Cloud", note: "infra as code", items: ["AWS", "Terraform", "Spinnaker"] },
    { cluster: "Data", note: "trustworthy pipelines", items: ["ETL", "Data Mesh", "Data Quality"] },
    { cluster: "AI", note: "agentic loops", items: ["AI Agents", "Claude Code", "Automation"] },
    { cluster: "Hardware", note: "the living lab", items: ["Raspberry Pi", "Robotics", "Sensors", "ESP32"] },
    { cluster: "Craft", note: "how it holds up", items: ["System Design", "Reliability", "Platform Engineering"] },
  ],
  life: {
    heading: "Beyond the Terminal",
    motto: "Built in systems. Reset in the field.",
    intro:
      "The lab has a door, and I use it. Cricket captain energy, mountain trails, open water — the same obsession with doing things properly, minus the keyboard.",
    cricket: {
      title: "Cricket",
      body:
        "Not just a fan — a player. Trophies have been kissed at sunset. The obsession runs deep enough that I built two full fantasy-cricket platforms so my friends could argue about it with data.",
      img: "/photos/trophy.webp",
      tag: "CHAMPION.MODE",
      stats: ["Tournament winner", "Fantasy platforms built: 2", "Arguments settled: ∞"],
    },
    tiles: [
      { img: "/photos/trek.webp", title: "Adventure", cap: "Trails, hills and the occasional questionable shortcut — systems thinking, uphill edition.", tag: "TREK.MODE" },
      { img: "/photos/ocean.webp", title: "Open Water", cap: "Load-testing the Bay of Bengal. It passed.", tag: "SALTWATER.IO" },
      { img: "/photos/voyage.webp", title: "Travel", cap: "New places, new inputs. Shipping — literally.", tag: "VOYAGE.EXE" },
    ],
    outro:
      "Personal works ship the same way as professional ones: built for real people, tested in the field, iterated until they feel right.",
  },
  roots: {
    text: "I come from Tiruvannamalai, and staying useful to the place you come from matters to me. I care about community-oriented, real-world impact — and I'm working out what that looks like when you can build software, AI and machines.",
    todo: "TODO: add verified public sources before naming any trust/organization.",
  },
  contact: {
    heading: "Let's build something useful, weird, and future-facing.",
    // TODO: replace all placeholders with real URLs before publishing
    email: "hello@krishnamadhan.com",
    socials: [
      { label: "GitHub", href: "#todo-github" },
      { label: "LinkedIn", href: "#todo-linkedin" },
      { label: "X / Twitter", href: "#todo-x" },
      { label: "Resume", href: "#todo-resume" },
    ],
  },
} as const;

export type Profile = typeof profile;
