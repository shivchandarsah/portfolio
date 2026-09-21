# Shivchandar Sah — Portfolio

> **Computer Engineering Graduate · Full-Stack Engineer · MERN / MEVN**
> Kathmandu, Nepal · [sahshivchandar14@gmail.com](mailto:sahshivchandar14@gmail.com) · +977-9825808450

[![Live Portfolio](https://img.shields.io/badge/Live-shivchandarsah.com.np-10b981?style=flat-square\&logo=googlechrome)](https://shivchandarsah.com.np/)
[![GitHub](https://img.shields.io/badge/GitHub-shivchandarsah-181717?style=flat-square\&logo=github)](https://github.com/shivchandarsah)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-shivchandar--sah-0077B5?style=flat-square\&logo=linkedin)](https://www.linkedin.com/in/shivchandar-sah-394250296)

---

## What This Is

This is not a static résumé page. It is an interactive engineering profile that answers two questions at once:

* **What did you build?** — Filterable project cards with real stack details and screenshots.
* **How do you think about engineering?** — Engineering OS exposes architecture, decisions, and reasoning as explorable tooling.

Built with React, GSAP, and Tailwind CSS v4 on a single-page scroll layout.

The most distinctive surface is **Engineering OS** — a lazy-loaded fullscreen overlay that turns project data into six interactive modules that a recruiter or developer can explore in minutes.

---

## Live Sections

| Section     | What it covers                                                              |
| ----------- | --------------------------------------------------------------------------- |
| **Hero**    | Name, role, stack overview, stats, GitHub / LinkedIn / Instagram / Facebook |
| **About**   | Engineering bio, core skills, contact information, resume download          |
| **Work**    | Six project cards with dedicated `/work/:slug` detail pages                 |
| **Skills**  | Animated proficiency rings grouped by category                              |
| **Contact** | Validated contact form, email, and resume download                          |
| **Footer**  | Brand, navigation columns, and social links                                 |

---

## Engineering OS

Launched from the **⚙ Eng OS** button in the navbar or with `Ctrl+K` inside the overlay.

A fullscreen engineering workspace with six modules, all backed by real project data and without placeholder content.

| Module                    | What it does                                                                                                                                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Architecture Explorer** | SVG architecture diagrams for all six projects. Click nodes such as Client, API, Auth, Socket.IO, and Database to explore technology details, responsibilities, and security considerations. Animated edges highlight connected paths. |
| **Project X-Ray**         | Layer-by-layer decomposition covering UI → REST API → Auth → Services → Database. Each layer explains its responsibility, engineering decisions, and security considerations.                                                          |
| **Engineering Lab**       | Interactive simulations including JWT authentication flow, API request pipelines, database CRUD operations, and a rate-limiter simulator with an adjustable requests-per-second slider. All simulations are labelled **SIMULATED**.    |
| **Knowledge Graph**       | Draggable SVG graph connecting projects and technologies. Click a project to highlight its stack or a technology to see every project using it. Touch-friendly.                                                                        |
| **Technical Challenges**  | Engineering challenges across Security, Architecture, Database, and Backend with category filtering, XP scoring, and detailed explanations.                                                                                            |
| **Decision Journal**      | Documented technical decisions covering Socket.IO, RAG over fine-tuning, MySQL vs MongoDB, Sequelize, JWT, and Vue.js for SmartInvoice, including alternatives, reasons, and accepted tradeoffs.                                       |

### Keyboard Controls

* `Ctrl+K` — Open command palette
* `Escape` — Back / close
* `↑` `↓` — Navigate the palette
* `Enter` — Select an item

---

## Projects

The Work section showcases six projects built across web and desktop platforms.

Each project card shows a screenshot, project name, direct GitHub / Live Demo links where available, and a **Project Details** link.

Full project information, including description, technology stack, features, and links, is available on dedicated `/work/:slug` pages.

**Support Hub AI** uses an expanded in-place project detail experience directly beneath its project card.

| # | Project                         | Stack                                                                   | Type                  |
| - | ------------------------------- | ----------------------------------------------------------------------- | --------------------- |
| 1 | **Support Hub AI**              | React.js · Node.js · MySQL · Prisma · Socket.IO · RAG/Pinecone · JWT    | Web App               |
| 2 | **Bolts Army**                  | React.js · Node.js · MySQL · Sequelize · Google Gemini AI · JWT + RBAC  | Web App               |
| 3 | **Sikshamantra**                | React.js · Node.js · Express.js · MongoDB · JWT                         | Web App               |
| 4 | **SmartInvoice**                | Vue.js · Node.js · Express.js · MongoDB · JWT Auth                      | Web App               |
| 5 | **Inventory Management System** | C# · .NET · Windows Forms                                               | Desktop App           |
| 6 | **Business Automation CRM**     | React.js · Node.js · Express.js · MySQL · TypeScript · Google Gemini AI | Web App · In Progress |

**Bolts Army** links to its live product at [boltsarmy.com](https://boltsarmy.com/) rather than a public repository.

---

## Tech Stack

| Layer                  | Tools                                                        |
| ---------------------- | ------------------------------------------------------------ |
| **Frontend**           | React.js, Vue.js, JavaScript, TypeScript, Tailwind CSS       |
| **Backend**            | Node.js, Express.js                                          |
| **Additional Backend** | Flask                                                        |
| **Databases**          | MySQL, MongoDB, SQLite                                       |
| **ORM / Data Access**  | Prisma, Sequelize                                            |
| **AI / RAG**           | Google Gemini, Pinecone                                      |
| **Real-Time**          | Socket.IO, WebSockets                                        |
| **Authentication**     | JWT, HTTP-only cookies, RBAC                                 |
| **Desktop**            | C#, .NET, Windows Forms                                      |
| **DevOps / Tools**     | Git, GitHub, Vercel, Render, Postman                         |
| **Portfolio Build**    | React 19 · Vite 8 · Tailwind CSS v4 · GSAP 3 + ScrollTrigger |

---

## Credits

Images and screenshots are my own work.

---

## Project Structure

```text
portfolio/
├── index.html                          # SEO meta, canonical, JSON-LD structured data, favicon
├── vite.config.js                      # Vite configuration
├── postcss.config.mjs                  # Tailwind CSS v4 via @tailwindcss/postcss
├── scripts/
│   └── optimize-images.cjs             # Sharp: generates optimized WebP screenshot variants
├── public/
│   ├── Webapp_icon.png                 # Browser tab / app icon
│   ├── og-image.jpg                    # Open Graph share image
│   ├── profile-512.webp                # Profile photo
│   ├── profile-1024.webp               # Profile photo @2x source
│   ├── hackathon-880.webp              # Hackathon certificate
│   ├── screenshots/                    # Per-project WebP screenshot assets
│   ├── Shivchandar_Kumar_Sah_Resume_Updated.pdf
│   ├── llms.txt                        # Machine-readable profile information
│   ├── robots.txt
│   ├── sitemap.xml
│   └── google099ea1dee215da12.html     # Search Console verification
└── src/
    ├── main.jsx                        # React entry point / BrowserRouter
    ├── App.jsx                         # Routes, lazy sections, ScrollToTop, error boundary
    ├── index.css                       # Tailwind v4 theme tokens + component classes
    ├── components/
    │   ├── ThreeBackground.jsx          # CSS radial glow + grid background
    │   ├── Navigation.jsx               # Fixed glass nav, scroll-spy, Eng OS button
    │   ├── Hero.jsx                     # Identity surface, CTA buttons, socials
    │   ├── About.jsx                    # Bio, skills, stats, hackathon certificate
    │   ├── Education.jsx                # Animated academic timeline
    │   ├── Work.jsx                     # Project cards + shared project components
    │   ├── ProjectDetails.jsx           # Dedicated /work/:slug detail pages
    │   ├── Skills.jsx                   # Animated proficiency rings
    │   ├── Contact.jsx                  # Validated contact form
    │   ├── Footer.jsx                   # Brand, navigation, socials
    │   └── icons.jsx                    # Central custom SVG icon set + AppIcon registry
    ├── engineering-os/
    │   ├── data.js                      # Projects, architecture, decisions, challenges
    │   ├── EngineeringOS.jsx            # Overlay shell, routing, command palette, search
    │   ├── ArchitectureExplorer.jsx     # SVG architecture diagrams
    │   ├── ProjectXRay.jsx              # Layer decomposition
    │   ├── EngineeringLab.jsx           # Four interactive simulations
    │   ├── KnowledgeGraph.jsx            # Draggable technology/project graph
    │   ├── TechnicalChallenges.jsx      # XP challenge system
    │   └── DecisionJournal.jsx           # Engineering decision cards
    ├── hooks/
    │   ├── index.js                     # Hook barrel export
    │   └── useReducedMotion.js          # prefers-reduced-motion watcher
    └── utils/
        ├── anim.js                      # Lazy GSAP loader + idle prefetch
        └── scroll.js                    # Smooth scrolling, nav offset, cross-route scroll
```

---

## Design System

Tokens are defined in `src/index.css` under the Tailwind CSS v4 `@theme` syntax.

| Token                    | Value     | Role                         |
| ------------------------ | --------- | ---------------------------- |
| `--color-bg`             | `#0a1628` | Deep navy base background    |
| `--color-bg-secondary`   | `#0f2038` | Section surfaces             |
| `--color-bg-card`        | `#13263f` | Card surfaces                |
| `--color-bg-elevated`    | `#1a2f4b` | Elevated surfaces            |
| `--color-accent`         | `#5eead4` | Primary accent               |
| `--color-accent-hover`   | `#99f6e4` | Accent hover                 |
| `--color-amber`          | `#d99b3b` | Secondary accent             |
| `--color-amber-hover`    | `#ebb04f` | Amber hover                  |
| `--color-blue`           | `#2dd4bf` | Tertiary accent              |
| `--color-text-primary`   | `#edf2ea` | Primary text                 |
| `--color-text-secondary` | `#a3afa0` | Secondary text               |
| `--color-text-muted`     | `#8a9587` | Muted text                   |
| `--font-display`         | Syne      | Section headers and identity |
| `--font-body`            | Inter     | Body text                    |

### Key Component Classes

```text
.card
.btn-primary
.btn-secondary
.btn-ghost
.tag
.section
.section-inner
.gradient-text
.badge-available
```

---

## Local Development

```cmd
npm install
npm run dev
npm run lint
```

---

## Production Build

```cmd
npm run build
npm run preview
```

The production build is code-split. Engineering OS and its modules are lazy-loaded so the initial portfolio bundle remains lean.

---

## Accessibility

* Semantic HTML landmarks (`nav`, `main`, `section`, `footer`)
* ARIA labels on icon-only controls
* Keyboard-accessible interactive elements
* `prefers-reduced-motion` support throughout GSAP and CSS
* Engineering OS keyboard navigation
* Escape-key navigation
* Keyboard-driven command palette
* Responsive mobile layout
* Compact hero presentation below 420px
* Accessible text contrast across portfolio surfaces

---

## SEO & Discoverability

The portfolio includes an SEO foundation designed around a consistent professional identity.

Implemented elements include:

* Descriptive page title
* Meta description
* Canonical URL
* Open Graph metadata
* Structured `Person`, `WebSite`, and `ProfilePage` JSON-LD
* Consistent **Shivchandar Sah** identity
* Professional role and location
* Genuine `sameAs` social profiles
* GitHub and LinkedIn identity connections
* Employer relationship through structured data
* `robots.txt`
* `sitemap.xml`
* `llms.txt`
* Google Search Console verification
* Optimized profile and project images
* Semantic HTML structure
* Single primary page heading

### Primary Portfolio

https://shivchandarsah.com.np/

---

## Build & Deploy

```cmd
npm run build
npm run preview
```

The production site is served at:

https://shivchandarsah.com.np/

This is also the canonical portfolio URL used by the site's SEO metadata and JSON-LD structured data.

### Image Optimization

`scripts/optimize-images.cjs` uses `sharp` to generate optimized WebP variants for project screenshots and the hackathon certificate.

```cmd
node scripts/optimize-images.cjs
```

Run the script manually after adding or replacing screenshots in `public/screenshots/`.

The build process does not automatically run the image optimization script.

---

## CI/CD

The project includes a GitHub Actions workflow at:

```text
.github/workflows/deploy.yml
```

The workflow validates the project on pushes and pull requests.

### Validation

1. Install dependencies
2. Run `npm run lint`
3. Run `npm run build`

### Deployment

The configured deployment workflow publishes the production build through the project's deployment environment.

---

## Contact

**Shivchandar Sah**
Full-Stack Engineer
Kathmandu, Nepal

* Portfolio: https://shivchandarsah.com.np/
* GitHub: https://github.com/shivchandarsah
* LinkedIn: https://www.linkedin.com/in/shivchandar-sah-394250296
* Email: [sahshivchandar14@gmail.com](mailto:sahshivchandar14@gmail.com)
* Phone: +977-9825808450

---

## License

**Personal Portfolio — All Rights Reserved**

Copyright © 2026 Shivchandar Kumar Sah.

Source code is shared for reference only. You may not copy, redistribute, reproduce, or reuse this code or design as a template without explicit written permission.

Contact: [sahshivchandar14@gmail.com](mailto:sahshivchandar14@gmail.com)
