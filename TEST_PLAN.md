# Portfolio Revamp — Test Plan

A walkthrough to verify everything that changed in the "Terra Nocturne" revamp. Work top to bottom; each
section has **Steps** and **Expected**. Action items you need to do are flagged **🔧 YOU**.

## 0. Run it

```bash
npm install        # already done, run again only if needed
npm run dev        # http://localhost:5173  (also serves the AI chat via a dev plugin)
```

- The AI chat works under `npm run dev` (a small Vite plugin bridges `/api/chat` locally).
- `npm run build && npm run preview` should also pass — production build is green.
- Your `OPENAI_API_KEY` must be in `.env` (it is). **🔧 YOU (prod):** also add it in Vercel → Settings → Environment Variables, or the chat won't work on the live site.

---

## 1. First paint & Hero
**Steps:** Hard-refresh `/` (Ctrl+Shift+R).
**Expected:**
- Warm espresso background, film grain, amber accents, Fraunces serif headings.
- Hero: "Hi, I am" / **Ing Zhen.** / "Software *Engineer* · AI · RPA" / tagline about UiPath, Java/OSGi, agentic AI.
- 3 impact stats (Kaggle 2nd · EY Champion RM12k · First-Class). No "RM370k+".
- 3D avatar on the right, **idling** (not a T-pose), leaning toward your mouse, base fading into the page.
- "Hi, I am" is **not** hidden under the navbar.

> **🔧 YOU — Hero framing is the one thing to eyeball.** If the avatar is too big/small/high/low, tune these two lines in `src/sections/Hero.jsx`:
> - Camera: `<PerspectiveCamera ... position={[0, 0, 6.5]} fov={42} />` → raise `fov`/`z` to zoom **out**, lower to zoom **in**.
> - Model: `<Developer ... position={[0, -3, 0]} scale={2.6} />` → `scale` resizes; `position[1]` (the `-3`) moves it **down** (more negative) / **up**.

## 2. Navigation & scroll
**Steps:** Click each nav link; scroll the whole page; watch the navbar.
**Expected:**
- Thin amber **progress bar** fills as you scroll.
- Active section is **underlined in amber** in the nav (scroll-spy).
- Navbar turns solid/blurred after scrolling; transparent at the very top.
- Résumé button opens your PDF in a new tab.
- Mobile (resize < 768px): hamburger opens a drawer; links + Résumé work and close the drawer.

## 3. Sections (scan for the editorial look — varied, not identical boxes)
- **About (01):** portrait with amber corner-brackets + small globe; pull-quote; inline facts (Based in / Focus / Status ● Open to work); Download Résumé / Get in touch / click-to-copy email (click the email → "Copied ✓").
- **Skills (02):** numbered index rows (01 Languages … 06 Tools), brand-colored logos, hairline dividers.
- **Technical Experience (03):** 3D avatar (animates on hovering each role) + Maxis (Software Engineer · AI & RPA → Innovation Intern) + LTL. OSGi/UiPath/agentic AI wording present.
- **Leadership (04):** timeline, **top 3** only (AIESEC President first).
- **Selected Work (05):** featured 3D computer + details + Live/Code links; tech filter chips (click "React" etc. to filter); grid cards with brand logos + award badges; clicking a card loads it in the showcase.
- **Awards (06):** 4 big alternating image rows (APAC, UrbanFloodBench, EY, UMHackathon) with prize badges + "winning photo coming soon" placeholders; "Also recognised —" line below.
- **Education (07):** two columns (education timeline + 7 certifications).
- **References (08):** testimonial cards with stars.
- **Contact (09):** working form (EmailJS) + mailto link.
- Each section opens with a giant faded **numeral** + amber label.

> **🔧 YOU — winning photos.** Drop 4 images into `public/assets/awards/` named exactly:
> `apac.jpg`, `urbanfloodbench.jpg`, `ey.jpg`, `umhackathon.jpg`. They'll replace the placeholders automatically.

## 4. AI chat 🤖
**Steps:** Click the robot (bottom-right). Try a suggested prompt, then ask your own; also ask something off-topic (e.g. "weather in Tokyo?").
**Expected:**
- Amber-themed panel; assistant greets you.
- Answers **stream in**, grounded in your real bio (Maxis, awards, projects, contact).
- Off-topic → politely steers back to you.
- Network tab: the request goes to `/api/chat`; **your API key is never in the browser**.

## 5. Blog ✎
**Steps:** Nav → **Blog**. Open a post. Use back links. Then **refresh the page while on `/blog/...`**.
**Expected:**
- `/blog` lists 2 seed posts (cards with date + reading time).
- Post pages render styled markdown (Fraunces headings, amber links, blockquote, code).
- Browser tab title changes per post.
- Refreshing a deep link (`/blog/...`) still loads it — works locally; on Vercel it relies on `vercel.json` (already added).

> **🔧 YOU — add posts** by appending to `src/content/posts.js` (plain Markdown, no code changes). Replace/edit the 2 seed posts as you like.

## 6. Responsive / mobile
**Steps:** DevTools device toolbar at 320 / 375 / 414 / 768 / 1024+; also load on your phone.
**Expected:** no horizontal scroll; readable type; tappable targets; drawer + chat + filters usable one-handed; 3D scenes don't overheat (below-the-fold canvases only mount when scrolled near).

## 7. Accessibility
**Steps:** Tab through the page with the keyboard; turn on OS "Reduce motion" and reload.
**Expected:** visible amber focus ring on links/buttons; a "Skip to content" link appears on first Tab; with reduce-motion on, entrance animations are effectively off.

## 8. Performance
**Steps:** `npm run build`; run Lighthouse (mobile) on `npm run preview`.
**Expected:** app code ~134 KB (was ~1.9 MB); three/r3f/globe/motion/gsap in separate cached chunks; markdown only loads on the blog. Globe loads from `/textures/...` (no `unpkg` request in the Network tab).

## 9. SEO / social
**Steps:** View page source; paste the deployed URL into a metadata debugger (e.g. opengraph.xyz) after deploy.
**Expected:** meta description, Open Graph + Twitter tags, JSON-LD Person, `robots.txt`, `sitemap.xml` (incl. blog).

> **🔧 YOU (optional):** the social-preview image is currently your portrait. A proper 1200×630 card looks better — say the word and I'll design one. Also confirm the domain (`ingzhenlee-portfolio.vercel.app`) used in the meta/canonical/sitemap, or give me your custom domain.

---

## Notes
- `npm run lint` → **0 errors** (4 harmless `react-refresh` warnings in `main.jsx`).
- OpenAI / Azure / MS SQL / IoT keep their existing colored logos (Simple Icons dropped those slugs); everything else uses the new brand SVGs in `public/assets/tech/`.
- Orphaned template files (`RobotDialog.jsx`, `ResumeModal.jsx`) were removed; the robot now opens the real AI chat.
