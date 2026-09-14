# Shivchandar Kumar Sah — Portfolio

> **BCE Graduate · Full-Stack Engineer · MERN / MEVN**
> Kathmandu, Nepal · [sahshivchandar14@gmail.com](mailto:sahshivchandar14@gmail.com) · +977-9825808450

[![Live](https://img.shields.io/badge/Live-shivchandarsah.github.io-10b981?style=flat-square&logo=github)](https://shivchandarsah.github.io/)
[![GitHub](https://img.shields.io/badge/GitHub-shivchandarsah-181717?style=flat-square&logo=github)](https://github.com/shivchandarsah)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-shivchandar--sah-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/shivchandar-sah-394250296)

---

## What This Is

This is not a static résumé page. It is an interactive engineering profile that answers two questions at once:

- **What did you build?** — filterable project cards with real stack details and screenshots
- **How do you think about engineering?** — Engineering OS exposes architecture, decisions, and reasoning as explorable tooling

Built with React, GSAP, and Tailwind CSS v4 on a single-page scroll layout. The most distinctive surface is **Engineering OS** — a lazy-loaded fullscreen overlay that turns project data into six interactive modules a recruiter or developer can explore in minutes.

---

## Live Sections

| Section | What it covers |
|---|---|
| **Hero** | Name, role, stack overview, stats, GitHub / LinkedIn / Instagram / Facebook |
| **About** | Engineering bio, core skills, contact info, resume download |
| **Work** | 6 projects: All · Web Applications · Desktop App
| **Skills** | Animated proficiency rings grouped by category |
| **Contact** | Validated contact form + email + resume download |
| **Footer** | Brand, nav columns, social links |

---

## Engineering OS

Launched from the **⚙ Eng OS** button in the navbar (or `Ctrl+K` inside the overlay).

A fullscreen engineering workspace with six modules — all backed by real project data, no placeholders.

| Module | What it does |
|---|---|
| **Architecture Explorer** | SVG architecture diagrams for all 6 projects. Click any node (Client, API, Auth, Socket.IO, Database…) for tech details, responsibilities, and security notes. Animated edges highlight connected paths. |
| **Project X-Ray** | Layer-by-layer decomposition: UI → REST API → Auth → Services → Database. Each layer is clickable and shows what it does, the engineering decision behind it, and security considerations. |
| **Engineering Lab** | Live simulations: JWT auth flow step-by-step animator, API request pipeline (GET/POST/PUT/DELETE), database CRUD operation tracer, and a rate-limiter simulator with adjustable req/s slider. All labelled **SIMULATED**. |
| **Knowledge Graph** | Draggable SVG graph connecting projects and technologies. Click a project to highlight its stack. Click a technology to see every project using it. Touch-friendly. |
| **Technical Challenges** | Real engineering challenges across Security, Architecture, Database, and Backend. XP scoring, category filter, detailed explanation per answer. |
| **Decision Journal** | Documented technical decisions: why Socket.IO, why RAG over fine-tuning, why MySQL vs MongoDB, why Sequelize, why JWT, why Vue.js for SmartInvoice — with problem, options considered, chosen solution, reasons, and accepted tradeoffs. |

**Keyboard:** `Ctrl+K` command palette · `Escape` back/close · `↑↓ Enter` in palette to navigate

---

## Projects

The Work section showcases 6 projects built across web and desktop platforms. Each project card includes a screenshot, tech stack, key features, and links to live demos and source code where available.

| # | Project | Stack | Type |
|---|---|---|---|
| 1 | **Support Hub AI** | React.js · Node.js · MongoDB · Socket.IO · RAG/Pinecone · JWT | Web App |
| 2 | **Bolts Army** | React.js · Node.js · MySQL · Sequelize · Google Gemini AI · JWT + RBAC | Web App |
| 3 | **Sikshamantra** | Vue.js · Flask · SQLite · Google Gemini AI | Web App |
| 4 | **SmartInvoice** | Vue.js · Node.js · Express.js · MongoDB · JWT Auth | Web App |
| 5 | **Inventory Management System** | C# · .NET · Windows Forms | Desktop App |
| 6 | **Business Automation CRM** | React.js · Node.js · Express.js · MySQL · TypeScript · Google Gemini AI · In Progress 🔨 | Web App |

---

## Credits

Images and screenshots are my own work.

{
  "packageManager": "npm@latest",
  "engines": {
    "node": ">=24.0.0"
  }
}
| **DevOps** | Git, Vercel, Render, Postman |
| **Portfolio build** | React 19 · Vite 8 · Tailwind CSS v4 · GSAP 3 + ScrollTrigger |

---

## Project Structure

```
portfolio/
├── index.html                          # SEO meta, JSON-LD, favicon, font loading
├── vite.config.js                      # Vite config
├── postcss.config.js
├── public/
│   ├── Webapp_icon.png                 # Browser tab / app icon
│   ├── shiv chandar kumar sah.png      # Profile photo (used in hero card)
│   ├── og-image.jpg                    # Open Graph share image
│   ├── profile-favicon.png             # Profile photo favicon (alternate)
│   ├── Shivchandar_Kumar_Sah_Resume_Updated.pdf
│   ├── Hackathon.jpeg
│   └── screenshots/                    # Per-project screenshot assets
└── src/
    ├── main.jsx                        # React entry point
    ├── App.jsx                         # Layout, Engineering OS overlay, error boundary
    ├── index.css                       # Tailwind v4 @theme tokens + component classes
    ├── components/
    │   ├── ThreeBackground.jsx         # CSS radial glow + grid background
    │   ├── Navigation.jsx              # Fixed glass nav, scroll-spy, Eng OS button
    │   ├── Hero.jsx                    # Identity surface, CTA buttons, profile card
    │   ├── About.jsx                   # Bio, skills, stats, resume download
    │   ├── Education.jsx               # Animated academic timeline
    │   ├── Work.jsx                    # Filterable project cards
    │   ├── Skills.jsx                  # Animated proficiency rings grouped by category
    │   ├── Contact.jsx                 # Validated contact form
    │   └── Footer.jsx                  # Brand, nav columns, socials
    ├── engineering-os/
    │   ├── data.js                     # Central data: projects, architecture, decisions, challenges
    │   ├── EngineeringOS.jsx           # Overlay shell: home, routing, Ctrl+K palette, search
    │   ├── ArchitectureExplorer.jsx    # SVG architecture diagrams
    │   ├── ProjectXRay.jsx             # Layer decomposition
    │   ├── EngineeringLab.jsx          # 4 interactive simulations
    │   ├── KnowledgeGraph.jsx          # Draggable tech/project graph
    │   ├── TechnicalChallenges.jsx     # XP challenge system
    │   └── DecisionJournal.jsx         # Engineering decision cards
    └── hooks/
        ├── index.js                    # Barrel export
        └── useReducedMotion.js         # prefers-reduced-motion watcher
```

---

## Design System

Tokens defined in `src/index.css` under `@theme` (Tailwind v4 syntax).

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#0a1628` | Deep navy base background |
| `--color-bg-secondary` | `#0f2038` | Section surfaces (portfolio) |
| `--color-bg-card` | `#13263f` | Card surfaces |
| `--color-bg-elevated` | `#1a2f4b` | Elevated surfaces |
| `--color-accent` | `#5eead4` | Olive green — primary accent |
| `--color-accent-hover` | `#99f6e4` | Accent hover |
| `--color-amber` | `#d99b3b` | Warm amber — secondary accent |
| `--color-amber-hover` | `#ebb04f` | Amber hover |
| `--color-blue` | `#2dd4bf` | Moss teal — tertiary accent |
| `--color-text-primary` | `#edf2ea` | Main body text (warm light) |
| `--color-text-secondary` | `#a3afa0` | Secondary text |
| `--color-text-muted` | `#8a9587` | Muted text (WCAG AA on card bg) |
| `--font-display` | Syne | Section headers + identity text |
| `--font-body` | Inter | Body copy |

Key component classes: `.card`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.tag`, `.section`, `.section-inner`, `.gradient-text`, `.badge-available`

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Lint
npm run lint
```

---

## Production Build

```bash
npm run build    # outputs to /dist
npm run preview  # preview production build locally
```

Build is code-split — Engineering OS and each of its 6 modules are separate lazy chunks. Initial portfolio bundle stays lean.

---

## Accessibility

- Semantic HTML landmarks (`nav`, `main`, `section`, `footer`)
- ARIA labels on all icon-only controls
- Keyboard navigable — all interactive elements are focusable
- `prefers-reduced-motion` respected throughout (GSAP + CSS)
- Engineering OS: Escape key navigation, keyboard-driven command palette
- Mobile hero: compact layout below 420px (smaller type, hidden social labels, tighter spacing)

---

## CI/CD

GitHub Actions workflow (`.github/workflows/deploy.yml`) runs on every push to `main`:

1. **Validate** — installs dependencies, runs `npm run lint`, runs `npm run build`
2. **Deploy** — on `main` only, builds and publishes to GitHub Pages via the `github-pages` environment

Pull requests run the validation steps only (no deployment).

---

## License

**Personal Portfolio — All Rights Reserved**

Copyright © 2026 Shivchandar Kumar Sah.

Source code is shared for reference only. You may not copy, redistribute, or reuse this code or design as a template without explicit written permission.

Contact: [sahshivchandar14@gmail.com](mailto:sahshivchandar14@gmail.com)
