<div align="center">

# Ing Zhen Lee — Portfolio

**Software Engineer (AI &amp; RPA)** · a warm, editorial 3D portfolio with a real AI assistant, a no‑code CMS, and a prerendered, shareable blog.

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="react" />
  <img src="https://img.shields.io/badge/Three.js-r167-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="three.js" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="vite" />
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="tailwind" />
  <img src="https://img.shields.io/badge/Sanity-CMS-F03E2F?style=for-the-badge&logo=sanity&logoColor=white" alt="sanity" />
  <img src="https://img.shields.io/badge/Vercel-deploy-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="vercel" />
</p>

[Live site](https://ingzhenlee-portfolio.vercel.app) · [Studio](https://iz-portfolio.sanity.studio)

</div>

## Overview

A single‑page React + Three.js portfolio in a custom **"Terra Nocturne"** art direction (warm organic dark — espresso, amber, sage; Fraunces + General Sans; subtle film grain). It pairs an animated 3D avatar with real, grounded content: projects, awards, two experience tracks, and a blog — all editable without touching code.

## Features

- **3D, tuned for every device.** An animated avatar (`iz_model.glb` + FBX clips) in the hero, a 3D project showcase, and an experience avatar. On touch devices a horizontal swipe orbits the model 360° while a vertical swipe still scrolls the page; the hero canvas is deferred so first paint isn't blocked.
- **Real AI assistant.** A streaming chat (OpenAI `gpt-4.1-mini`) grounded in a bio system prompt, served by `api/chat.js` (a Vercel function in prod, a Vite middleware in dev). Politely declines off‑topic asks.
- **No‑code content (Sanity).** Projects, awards, and posts live in a hosted **Sanity Studio**; the app reads them live via GROQ. `src/constants/index.js` + `src/content/posts.js` remain as a build‑safe fallback, so the site never breaks if the CMS is unreachable.
- **Prerendered, shareable blog.** A `postbuild` step writes per‑post HTML with correct `<title>` / canonical / Open Graph / Twitter / JSON‑LD, and generates designed 1200×630 share cards — so links unfurl beautifully on LinkedIn / X / Instagram. Markdown posts with code syntax highlighting and prev/next.
- **Polish.** Per‑section SEO, favicon + PWA manifest, a styled 404, lazy‑mounted below‑fold canvases, and code‑split vendor bundles.

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React 18, React Router 7, Tailwind CSS 3, Framer Motion, GSAP |
| 3D | Three.js, @react-three/fiber, @react-three/drei, react-globe.gl |
| Content | Sanity (Studio + GROQ), react-markdown + remark-gfm + rehype-highlight |
| AI | OpenAI `gpt-4.1-mini` (streaming) via `api/chat.js` |
| Share cards | Satori + @resvg/resvg-js (build-time, `scripts/`) |
| Contact / analytics | EmailJS, Vercel Analytics |
| Build / host | Vite 5, Vercel |

## Project structure

```
api/                  Serverless functions (chat)
scripts/              Build-time tooling
  prerender.mjs         postbuild: per-post HTML + OG cards
  lib/og.mjs            Satori → PNG share-card renderer
  seed-sanity.mjs       One-time content migration → Sanity
src/
  components/         3D + UI building blocks (Developer, DemoComputer, ChatPanel…)
  sections/           Hero, About, Experience, Projects, Awards, Contact
  pages/              Home, BlogIndex, Post, NotFound
  lib/
    sanity.js           Client, GROQ queries, doc → component mappers
    useContent.js       Hooks that read Sanity with a constants fallback
  constants/index.js  Fallback content (projects, awards, profile…)
  content/posts.js    Fallback blog posts (Markdown)
studio-iz-portfolio/  Sanity Studio (schemas: project, award, post)
```

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
```

Create a `.env` in the project root:

```env
# AI chat (server-side; required for the assistant in prod)
OPENAI_API_KEY=sk-...

# Contact form (EmailJS)
VITE_APP_EMAILJS_USERID=...
VITE_APP_EMAILJS_TEMPLATEID=...
VITE_APP_EMAILJS_RECEIVERID=...

# Sanity (optional — defaults baked in)
VITE_SANITY_PROJECT_ID=2tg2gccb
VITE_SANITY_DATASET=production
```

## Editing content (no code)

1. Open the **Studio** at `iz-portfolio.sanity.studio` and edit a project / award / post.
2. **Publish.** A Sanity webhook → Vercel Deploy Hook rebuilds the site, regenerating the blog HTML and share cards.

The Studio lives in `studio-iz-portfolio/` (`npm run dev` / `npm run deploy` there). The one‑time content migration is `scripts/seed-sanity.mjs` (needs `SANITY_WRITE_TOKEN`).

## Build & deploy

```bash
npm run build        # vite build → then `postbuild` prerenders the blog + cards
npm run preview      # serve the production build locally
```

`SITE_URL` overrides the origin used for canonical/OG URLs (defaults to the live domain). Deployment is on **Vercel** (auto‑deploy from git); `vercel.json` rewrites SPA routes while letting the prerendered static files take precedence.

## Credits

Originally bootstrapped from JavaScript Mastery's "Build a 3D Developer Portfolio," then rebuilt end‑to‑end — design system, AI chat, CMS, blog, and the 3D interactions.

<div align="center"><sub>Built by Lee Ing Zhen · Kuala Lumpur</sub></div>
