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
  /** Deep-dive content for /projects/[slug]. Keyed by project slug.
   *  `classified: true` renders a "details stay at work" note instead of internals. */
  caseStudies: {
    "banter-agent": {
      brief: [
        "Banter Agent is an AI companion that lives inside my friend group's WhatsApp — not a demo bot, a resident. It speaks Tanglish, runs group games, roasts on request, digests the news, and remembers who said what. It has been online continuously for months, which means it has survived the harshest QA environment known to engineering: a friend group that wants to break it.",
        "It runs on the same Raspberry Pi 5 as everything else in the lab, which turns every feature into an exercise in doing more with a fixed RAM budget.",
      ],
      system: [
        { title: "WhatsApp Gateway", desc: "A long-lived multi-device web session is the bot's identity. The process holding it is irreplaceable — losing the session means re-pairing the account." },
        { title: "Personality + Memory", desc: "Tanglish personality modes layered over per-user and per-group memory in Supabase, so callbacks and running jokes actually land." },
        { title: "Game Engine", desc: "17 group games with shared scheduling, state persistence and leaderboards — built to survive restarts mid-game." },
        { title: "LLM Layer", desc: "Claude drives conversation and games behind token budgets and rate guards, because a chatty friend group can burn an API budget by lunchtime." },
      ],
      fieldNotes: [
        { title: "The process you can never restart", desc: "The WhatsApp auth session lives in one process and does not survive casual restarts. So deploys got redesigned around it: features ship staged-and-dormant, then activate on the next natural restart. Deployment discipline enforced by consequences." },
        { title: "Friends are ruthless QA", desc: "Every edge case gets found within hours, and every regression gets screenshots in the group chat. It is the tightest feedback loop I have ever shipped against." },
      ],
      telemetry: [
        { k: "RUNTIME", v: "24/7 on a Raspberry Pi 5" },
        { k: "GAMES", v: "17 and counting" },
        { k: "QA TEAM", v: "One unpaid, merciless friend group" },
      ],
    },
    "robot-pet": {
      brief: [
        "Cosmo is an attempt to make a machine feel like a pet instead of a chatbot on wheels. It has moods that drift with time and interaction, energy that follows a circadian rhythm, and an episodic memory of the people it meets — so how it behaves depends on how its day has gone and who walked in.",
        "Everything runs locally on a Raspberry Pi 5 except the language brain, with an ESP32-S3 as a sensor co-processor handling the low-level hardware.",
      ],
      system: [
        { title: "Decision Core", desc: "A behavior tree (56 nodes) is the sole decision authority, fed by a prioritized async event bus. One action router owns every actuator, so behaviors can't fight over hardware." },
        { title: "Personality Engine", desc: "Mood, energy, arousal and attachment as decaying state variables. Nothing is scripted — the same stimulus lands differently on a tired robot." },
        { title: "Perception", desc: "Camera person-detection with YOLO, face recognition, and emotion reading; wake-word → speech-to-text → Claude → text-to-speech for conversation." },
        { title: "Memory", desc: "Episodic memory in SQLite, working memory with a 5-minute TTL, and spatial fingerprints of rooms — it remembers meeting you." },
        { title: "Hardware Layer", desc: "An ESP32-S3 co-processor speaks JSON over serial and owns motors and a dozen sensor types, keeping timing-critical hardware off the Pi." },
      ],
      fieldNotes: [
        { title: "The blue robot incident", desc: "The camera library hands frames over BGR while claiming RGB. Old code corrected it, new code corrected it again, and every face the robot enrolled was learned on colour-swapped frames. Lesson: verify at the boundary, not downstream." },
        { title: "RAM is the real currency", desc: "An 8GB Pi hosting a robot, a chatbot and a kanban board has no room for PyTorch. Swapping to ONNX Runtime saved ~160MB — and exposed that the fancy detector had silently fallen back to a 2005-era algorithm months earlier." },
        { title: "Colour is a calibration problem", desc: "The TV ambilight only produces believable colour at one exact white-balance lock, solved via colour-correction matrix against reference cards. The system now detects drift and heals itself." },
      ],
      telemetry: [
        { k: "DECISIONS", v: "56-node behavior tree" },
        { k: "SENSORS", v: "12+ types across Pi + ESP32" },
        { k: "MOODS", v: "Genuinely unpredictable" },
      ],
    },
    "ai-coding-workflows": {
      brief: [
        "What happens if you give AI coding agents a real engineering process instead of a prompt box? This is a kanban board where the teammates are AI: Claude Code plays scrum master on the Raspberry Pi, Codex plays engineer from a PC over SSH, and work moves through backlog → claimed → review → done with actual gates at each step.",
        "Tasks carry leases so agents can't hoard work, journals so decisions survive context loss, and a daily standup that lands in WhatsApp every morning at 10:00.",
      ],
      system: [
        { title: "Task Board", desc: "File-based kanban with a CLI and a web UI — every task is a markdown file with state, priority, owner and a full journal of what happened." },
        { title: "Agent Contracts", desc: "Each agent works under a written contract defining what it may claim, when it must hand off, and what review requires. Process documents, but for machines." },
        { title: "Review Gates", desc: "Code moves on named branches and nothing merges without cross-agent review — the scrum master reviews the engineer's work like a real team." },
        { title: "Drift Watch", desc: "Cron-driven checks compare docs against reality and the board against the repos, because agents (like people) let documentation rot." },
      ],
      fieldNotes: [
        { title: "Agents need process more than prompts", desc: "Unattended agents fail in human ways: stale claims, undocumented decisions, drifting docs. The fixes are also human — leases, journals, standups. Management theory turned out to be transferable." },
        { title: "The handoff is the hard part", desc: "Two agents that are individually excellent still fumble handoffs without a written contract for what 'ready for review' means. Interfaces between agents deserve the same rigor as interfaces between services." },
      ],
      telemetry: [
        { k: "AGENTS", v: "2 — scrum master + engineer" },
        { k: "STANDUP", v: "Daily 10:00 IST, via WhatsApp" },
        { k: "HUMAN ROLE", v: "Product owner only" },
      ],
    },
    "data-platform-automation": {
      brief: [
        "The professional half of the lab: cloud infrastructure and data platform engineering — provisioning AWS estates as code, building ETL and serverless processing that feeds data-mesh architectures, and the automation and data-quality guardrails that keep platforms trustworthy at scale.",
      ],
      classified: true,
      system: [],
      fieldNotes: [],
      telemetry: [],
    },
  },
  /** v3 "Operator Edition" additive content — optional, only /v3 reads these.
   *  Nothing here changes existing keys; other pages are unaffected. */
  v3: {
    bootLine:
      "KM·OS 26.2 — booted from a Raspberry Pi 5 in a Bangalore living room.",
    places: [
      { name: "TIRUVANNAMALAI", coord: "12.23°N 79.07°E" },
      { name: "BANGALORE", coord: "12.97°N 77.59°E" },
    ],
    labStatus: [
      { k: "cosmo", v: "curious" },
      { k: "banteragent", v: "online" },
      { k: "board", v: "12 open tasks" },
      { k: "lights", v: "TV-sync evening window" },
    ],
    tanglish: {
      work: "\"semma scene, let's build\" — the friend group, probably",
      offduty: "\"one more over da\" — everyone, always",
    },
    cricketLine:
      "Right-hand bat · tournament winner · 2 fantasy platforms built to settle arguments",
    rootsHill: "grew up under Arunachala",
    footerSignoff: "Built on the same Pi that runs the robot. 47°C, mostly.",
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

export type CaseStudy = {
  brief: readonly string[];
  /** true → internals are intentionally withheld (work project) */
  classified?: boolean;
  system: readonly { title: string; desc: string }[];
  fieldNotes: readonly { title: string; desc: string }[];
  telemetry: readonly { k: string; v: string }[];
};
