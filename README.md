# 🌍 Terra — Your Living Future

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Three.js](https://img.shields.io/badge/Three.js-3D-black)
![Zustand](https://img.shields.io/badge/Zustand-State%20Management-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

> **PromptWars Challenge 3 Submission**
> *The Earth you create is the future you live in.*

Terra is an immersive climate-awareness web app that turns abstract carbon footprint data into a living, breathing 3D planet. Every lifestyle choice a user makes — how they commute, how much electricity they use, what they eat — visibly reshapes their personal Earth, while **Gaia**, a context-aware companion, narrates the consequences with warmth and encouragement instead of guilt and graphs.

---

## 1. Problem Statement

Climate change communication has a motivation problem. Most carbon footprint calculators and sustainability apps present users with:

- Dry statistics and spreadsheets that are easy to ignore
- Guilt-driven messaging that causes disengagement rather than action
- One-off calculations with no ongoing feedback loop or sense of progress
- No emotional or visual connection between a daily choice (e.g., taking the bus) and its real-world impact

As a result, people understand *that* their habits matter intellectually, but rarely *feel* it — and feeling is what drives sustained behavior change.

**Terra's hypothesis:** if users can *see* and *hear* the consequences of their choices on a living world that responds in real time, sustainable behavior becomes emotionally rewarding rather than a chore.

---

## 2. Chosen Vertical

**Climate Action & Sustainability (EdTech × Climate Tech)**

Terra sits at the intersection of:
- **Personal carbon footprint tracking** — quantifying everyday environmental impact
- **Gamified behavior change** — missions, streaks, achievements, and a shared village
- **Generative AI companionship (planned)** — Gaia is designed as an emotionally intelligent guide. A Gemini-based service layer for personalized narration (`askGaia`, `generateFutureNarrative`, `analyzeEcoImage`) is implemented behind secure, server-only API routes and ready to be wired into the UI, but no page currently calls it — today's Gaia messages, future narratives, and EcoScan results are static or derived from local logic, not live AI output.
- **Data visualization as storytelling** — a 3D Earth and "what-if" simulations instead of bar charts

---

## 3. Features

| Feature | Description | Status |
|---|---|---|
| 🌎 **Living 3D Earth** | A real-time, interactive Three.js globe whose health, vegetation, and water visually reflect the user's sustainability score. | ✅ Implemented |
| 🧮 **Carbon Footprint Calculator** | Calculates an annual CO₂e footprint from transport, electricity, and food habits, compared against the global average, with a category-by-category breakdown. | ✅ Implemented & unit-tested |
| 🤖 **Gaia Companion** | A context-aware Earth spirit that delivers short, warm feedback, eco-tips, and celebrates milestones based on the user's footprint and progress. | ⚙️ Implemented with static/derived messages. Live, Gemini-generated responses (`askGaia`) are built and exposed via a secure API route, but not yet called from this UI. |
| 💡 **Smart Recommendations Engine** | A pure, unit-testable rules engine (`gaia-recommendations.ts`) that identifies the single highest-impact next action a user can take and estimates the kg CO₂ saved. | ✅ Implemented & unit-tested |
| 🔮 **Future Memories** | A time-travel narrative experience (Now → 1 → 5 → 10 years) showing a vision of the user's future Earth, with the Earth's health value scaling based on their current score. | ⚙️ Implemented with fixed, hand-written narrative copy per time point. A Gemini-powered, personalized version (`generateFutureNarrative`) is built but not yet wired in. |
| 🔁 **"What If…?" Simulator** | Lets users preview the CO₂ and tree-equivalent impact of adopting specific habits (e.g., switching to LEDs, going car-free) before committing. | ✅ Implemented |
| 📸 **EcoScan AI** | A scan-and-analyze flow (image-based) that estimates the environmental impact of everyday items and suggests lower-impact alternatives. | ⚙️ UI flow implemented with a simulated scan (timed loading state) and one fixed example result. Real image analysis via Gemini (`analyzeEcoImage`) is built and exposed via a secure API route, but not yet connected to a camera or this page. |
| 🧑‍🤝‍🧑 **Green Valley Village** | A social/community layer showing collective impact (e.g., trees planted together) and friendly leaderboard comparisons. | ⚙️ Implemented with static mock member/leaderboard data. Live Firestore-backed data is planned but not connected. |
| 🦋 **World & Achievements** | Unlockable creatures and world features (auroras, waterfalls, cherry blossoms) that reward sustained good habits, reinforcing positive feedback loops. | ✅ Implemented (Zustand-backed) |
| 🎯 **Guided Onboarding** | A short, conversational quiz that initializes a new user's starting Earth state and sustainability score. | ✅ Implemented |
| ✨ **Polished Motion & UI** | Glassmorphic cards, animated counters, floating navigation, particle backgrounds, and page transitions built with Framer Motion and Tailwind CSS. | ✅ Implemented |

---

## 4. Architecture

Terra is a **Next.js (App Router)** single-page-feeling application using a **client-heavy, store-driven architecture**, with a small **server-only slice** dedicated to keeping the Gemini API key off the client:

```
┌─────────────────────────────────────────────────────────────────┐
│                          Next.js App Router                       │
│  (src/app/*)  — routed pages, each a 'use client' experience      │
└───────────────┬─────────────────────────────────┬─────────────────┘
                │                                 │
                ▼                                 ▼
   ┌─────────────────────────┐        ┌───────────────────────────┐
   │   Presentation Layer     │        │     State Layer (Zustand)  │
   │  src/components/*        │◀──────▶│  src/stores/*               │
   │  - ui/   (glass cards,   │        │  - terra-store (Earth state,│
   │    nav, counters, etc.)  │        │    score, missions, gaia)   │
   │  - gaia/ (avatar, chat   │        │  - carbon-store (footprint  │
   │    bubble UI)            │        │    inputs & results)        │
   │  - three/ (3D Earth,     │        └───────────────┬─────────────┘
   │    atmosphere, clouds)   │                        │
   └──────────────┬───────────┘                        ▼
                  │                         ┌───────────────────────────┐
                  ▼                         │      Domain / Logic Layer  │
   ┌─────────────────────────┐              │  src/lib/carbon.ts          │
   │   Rendering Engine        │              │  (pure CO2e calculations)   │
   │  @react-three/fiber +     │              │  src/lib/gaia-              │
   │  @react-three/drei (Earth │              │  recommendations.ts         │
   │  mesh, atmosphere shader, │              │  (pure rules engine)        │
   │  cloud layer, stars)      │              └─────────────────────────────┘
   └────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│   AI Service Layer (built, not yet called from any page or component)  │
│                                                                          │
│   src/lib/gemini.ts            — client-safe wrapper. Same askGaia /    │
│   (importable from 'use client')  generateFutureNarrative /             │
│                                    analyzeEcoImage signatures as before │
│             │ fetch('/api/...')                                         │
│             ▼                                                           │
│   src/app/api/gaia/route.ts            ┐ Route Handlers — run only on   │
│   src/app/api/future-narrative/route.ts│ the server, never bundled to   │
│   src/app/api/ecoscan/route.ts         ┘ the client                    │
│             │                                                           │
│             ▼                                                           │
│   src/lib/gemini-server.ts     — holds GEMINI_API_KEY (server-only env  │
│                                   var), the only file that calls the    │
│                                   Gemini SDK directly                   │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│   Optional Backend (built, not yet connected to the UI)                │
│   src/lib/firebase.ts — Auth, Firestore, Storage. Validates required    │
│   env vars and wraps initialization in try/catch, exposing a            │
│   `firebaseEnabled` flag instead of crashing the app if Firebase isn't  │
│   configured.                                                           │
└───────────────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

- **Separation of pure logic from UI:** `carbon.ts` and `gaia-recommendations.ts` are framework-agnostic pure functions, making the core sustainability math independently testable and reusable across pages and stores.
- **Centralized client state via Zustand:** `terra-store` owns the Earth's visual/game state (health, score, missions, achievements); `carbon-store` owns footprint inputs/results. This keeps the 3D scene, dashboards, and Gaia messaging in sync without prop-drilling.
- **Lazy-loaded 3D scene:** The Three.js `EarthScene` is dynamically imported with `ssr: false` to avoid WebGL issues during server-side rendering and to keep initial page load lean.
- **AI calls isolated server-side:** All Gemini calls live behind Next.js Route Handlers (`src/app/api/gaia`, `/future-narrative`, `/ecoscan`). The real key (`GEMINI_API_KEY`, no `NEXT_PUBLIC_` prefix) is read only inside the server-only `lib/gemini-server.ts` and is never sent to the browser. `lib/gemini.ts` is a thin client-safe wrapper around `fetch` that exposes the same function names and signatures the service layer always had, so wiring it into the Gaia UI, Future Memories, or EcoScan later is a matter of calling these functions — the security-sensitive part is already done. As of this README, **no page or component imports `lib/gemini.ts` yet.**
- **Defensive Firebase setup:** `lib/firebase.ts` wires up Auth, Firestore, and Storage for future persistence (user profiles, village/community data, EcoScan history). It checks that all required `NEXT_PUBLIC_FIREBASE_*` env vars are present and wraps initialization in a try/catch, exporting `firebaseEnabled`/`firebaseInitError` so the rest of the app can degrade gracefully instead of crashing if Firebase isn't configured. Like the Gemini layer, this is implemented but **not yet imported by any page** — the app currently runs entirely on local Zustand state, so nothing persists across a page reload.

---

## 5. Folder Structure

```
src/
├── app/                          # Next.js App Router pages (routes)
│   ├── page.tsx                  # Root — redirects to /earth
│   ├── layout.tsx                # Root layout, fonts, global metadata
│   ├── api/                      # Server-only Route Handlers (Gemini proxy)
│   │   ├── gaia/route.ts                  # POST → askGaiaServer
│   │   ├── future-narrative/route.ts      # POST → generateFutureNarrativeServer
│   │   └── ecoscan/route.ts               # POST → analyzeEcoImageServer
│   ├── earth/                    # Main 3D living Earth dashboard
│   ├── onboarding/                # First-time user quiz / setup flow
│   ├── footprint/                # Carbon footprint calculator
│   ├── simulator/                # "What If...?" impact simulator
│   ├── future-memories/          # Time-travel narrative experience (static copy)
│   ├── ecoscan/                  # EcoScan UI flow (simulated scan, fixed result)
│   ├── village/                  # Community / social impact view (mock data)
│   └── world/                    # Unlockable creatures & world features
│
├── components/
│   ├── gaia/                     # Gaia AI companion UI
│   │   ├── GaiaAvatar.tsx
│   │   └── GaiaMessage.tsx
│   ├── three/                    # 3D Earth rendering (react-three-fiber)
│   │   ├── EarthScene.tsx
│   │   ├── Earth.tsx
│   │   ├── Atmosphere.tsx
│   │   └── Clouds.tsx
│   └── ui/                       # Shared design-system components
│       ├── glass-card.tsx
│       ├── floating-nav.tsx
│       ├── animated-counter.tsx
│       ├── particle-bg.tsx
│       └── page-transition.tsx
│
├── lib/                           # Pure logic & external service clients
│   ├── carbon.ts                  # CO2e calculation engine
│   ├── gaia-recommendations.ts    # Next-best-action recommendation engine
│   ├── gemini.ts                  # Client-safe wrapper — calls /api/* via fetch
│   ├── gemini-server.ts           # Server-only Gemini SDK calls (holds GEMINI_API_KEY)
│   ├── firebase.ts                # Firebase Auth / Firestore / Storage, defensive init
│   └── utils.ts                   # Shared helpers (e.g., className merging)
│
├── stores/                        # Zustand global state
│   ├── terra-store.ts             # Earth state, score, missions, achievements
│   └── carbon-store.ts            # Footprint inputs & calculated results
│
├── tests/                         # Vitest unit tests
│   ├── carbon.test.ts                       # Tests lib/carbon.ts
│   ├── gaia-recommendations.test.ts         # Tests lib/gaia-recommendations.ts
│   └── stores/
│       ├── terra-store.test.ts              # Tests stores/terra-store.ts
│       └── footprint-store.test.ts          # Tests useFootprintStore from stores/carbon-store.ts
│
└── styles/
    └── globals.css                 # Tailwind layers, design tokens, glass UI
```

---

## 6. Technologies Used

| Category | Technology |
|---|---|
| Framework | **Next.js** (App Router — client components + server-only Route Handlers) |
| Language | **TypeScript** |
| 3D Rendering | **Three.js**, **@react-three/fiber**, **@react-three/drei** |
| Animation | **Framer Motion** |
| State Management | **Zustand** |
| Styling | **Tailwind CSS**, custom design tokens, glassmorphism utilities |
| Class Utilities | **clsx**, **tailwind-merge** |
| Testing | **Vitest**, **React Testing Library**, **jsdom** — unit tests for domain logic and stores exist today (see Section 8); component tests are configured but not yet written |
| Generative AI (built, not yet called from any page) | **Google Gemini API** (`@google/generative-ai`) — used only inside server-only Route Handlers; the key is never exposed to the client |
| Backend Services (built, not yet connected to the UI) | **Firebase** (Authentication, Firestore, Storage) |
| Fonts | **Inter** (UI), **JetBrains Mono** (numerics/data) |

---

## 7. Setup Instructions

> **Note:** This repository contains the application's `src/` source code. To run it locally, scaffold it into a Next.js project as shown below.

### Prerequisites
- Node.js 18+
- npm, pnpm, or yarn
- A Google Gemini API key
- A Firebase project (for Auth/Firestore/Storage features)

### Steps

1. **Create / clone the project and add the source**
   ```bash
   npx create-next-app@latest terra --typescript --tailwind --app
   cd terra
   # Copy the contents of this repository's src/ into your project's src/
   ```

2. **Install dependencies**
   ```bash
   npm install three @react-three/fiber @react-three/drei \
     framer-motion zustand clsx tailwind-merge \
     @google/generative-ai firebase
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env.local` and fill in real values:
   ```env
   # Gemini AI — server-only secret. Do NOT prefix this with NEXT_PUBLIC_.
   # It is read only inside src/lib/gemini-server.ts, used by the API
   # routes in src/app/api/*/route.ts, and is never sent to the browser.
   GEMINI_API_KEY=your_gemini_api_key

   # Firebase — these ARE safe to expose to the client by design; Firebase
   # access control is enforced via Firestore/Storage security rules, not
   # by hiding these values. Still keep this file out of version control.
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   The root `.gitignore` excludes `.env`, `.env.local`, and `.env*.local`, so these values won't be committed.

4. **Configure Tailwind** to match the design tokens referenced in `globals.css` (e.g., `terra-space`, `terra-green`, `terra-warm`, `terra-danger`, `gradient-earth`, `font-display`, `font-body`) in `tailwind.config.ts`.

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` — you'll be redirected to `/earth`.

6. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

---

## 8. Testing Instructions

Terra's domain logic is intentionally written as **pure, dependency-free functions**, which made it straightforward to unit test without mocking React, Three.js, or network calls. An automated Vitest suite already exists in `src/tests/` and is part of this submission — it is not just planned.

### Test suite at a glance

| File | What it covers | Test cases |
|---|---|---|
| `tests/carbon.test.ts` | `calculateFootprint` — totals, per-category breakdown, rating thresholds (`low`/`average`/`high`), trees-to-offset, and all input combinations | 13 |
| `tests/gaia-recommendations.test.ts` | `getRecommendation` — highest-impact selection, tone adjustment by rating, the "already optimal" (`maintain`) edge case, and all category/step combinations | 16 |
| `tests/stores/terra-store.test.ts` | `useTerraStore` — initial state shape, `setEarthState` partial updates, `addScore` clamping to 0–100, `setGaiaMessage`, `unlockAchievement` (including that duplicate unlocks are allowed by design, not a bug), and full gameplay-flow integration | 36 |
| `tests/stores/footprint-store.test.ts` | `useFootprintStore` (exported from `stores/carbon-store.ts`) — input setters, `calculate`, `reset`, and sequential update sequences | 24 |

**89 test cases across 4 files**, run via Vitest with a `jsdom` environment.

### Running the suite
```bash
npm test                  # Run all tests once
npm test -- --watch       # Watch mode for development
npm run test:ui           # Visual test dashboard
npm run test:coverage     # Generate coverage report
```

Run a single file: `npm test -- carbon.test.ts`

### What's covered vs. not yet covered

- ✅ All pure functions in `lib/carbon.ts` and `lib/gaia-recommendations.ts`
- ✅ Both Zustand stores — state shape, bounds, partial updates, and integration flows
- ❌ React components — `@testing-library/react` and `jsdom` are configured, and `vitest.setup.ts` already mocks `matchMedia`, `IntersectionObserver`, and `ResizeObserver` for this purpose, but no component tests have been written yet
- ❌ The `/api/gaia`, `/api/future-narrative`, and `/api/ecoscan` Route Handlers — not yet covered by automated tests
- ❌ Firebase integration, Three.js rendering, and full Next.js routing — would require additional mocking/environment setup not yet in place

### Manual / exploratory QA checklist
- [ ] Complete onboarding and confirm starting Earth state/score persists for the session
- [ ] Adjust footprint calculator inputs and confirm Gaia's recommendation updates accordingly
- [ ] Trigger the EcoScan simulated scan flow and confirm state transitions (`idle → scanning → result`)
- [ ] Step through all four Future Memories time points and confirm narrative copy changes
- [ ] Confirm 3D Earth scene loads without SSR errors and responds to `earthState` changes
- [ ] Test on a low-end/mobile device to confirm Three.js scene degrades gracefully

---

## 9. Accessibility Features

Terra aims to make a visually rich, animation-heavy experience usable by as many people as possible. The following reflects what's actually in the code today:

- **Semantic headings:** most page-level views (onboarding, footprint, simulator, EcoScan, village, future-memories, world) render a single primary heading element, supporting screen-reader navigation and document outline.
- **ARIA attributes in active use, not just planned:** `aria-label`, `aria-live`, `aria-busy`, and `aria-hidden` appear across most interactive pages and components today — for example, EcoScan's scanning and result states use `aria-live="polite"`/`aria-busy`, and numeric results (e.g., CO₂ values, percentage savings) carry a descriptive `aria-label` rather than relying on the visible number alone.
- **Visible keyboard focus:** `globals.css` defines global `:focus-visible` outline styling, and interactive buttons across the app additionally use explicit `focus-visible:outline` utility classes.
- **Button-based interactive controls:** selectable options (onboarding quiz steps, simulator scenarios, EcoScan triggers) are implemented as standard `<button type="button">` elements rather than custom non-semantic elements, preserving native keyboard and focus behavior.
- **Non-color-coded feedback:** footprint ratings (`low`/`average`/`high`) pair color with icons and explicit text labels (e.g., "🌿 Lighter than average") rather than relying on color alone.
- **Graceful 3D fallback:** the Earth visualization is dynamically imported with `ssr: false` and rendered inside a `Suspense` boundary, so the rest of the page stays usable while/if WebGL content is loading or unavailable.
- **Readable typography system:** the Inter typeface is used for UI text at accessible weights/sizes, with JetBrains Mono reserved for numeric data to improve legibility of figures.

### Not yet implemented
- **`prefers-reduced-motion` support.** Nothing in the codebase currently checks this media feature, despite extensive use of Framer Motion animations and a continuously animated Three.js scene — this is the single most impactful accessibility gap to close next.
- **A full WCAG 2.1 AA audit, automated accessibility testing (e.g., axe), or manual screen-reader testing.** ARIA usage above was added page-by-page, not verified end-to-end against a formal standard.
- Purely decorative elements (the particle background, page-transition wrapper, and the 3D atmosphere/cloud shader layers) intentionally carry no ARIA attributes, which is correct for decoration — but this has not been double-checked against every page to confirm nothing meaningful is hidden from assistive tech as a side effect.

---

## 10. Future Improvements

- **Close the `prefers-reduced-motion` gap** — respect the media query automatically and offer an in-app override, given how animation-heavy the experience is.
- **Full WCAG 2.1 AA audit** — formally verify the ARIA/focus work already in place, and extend it to any remaining gaps (e.g., the `world` page).
- **Call the existing Gemini functions from the UI** — `askGaia`, `generateFutureNarrative`, and `analyzeEcoImage` are implemented and already proxied through secure server-side routes (`/api/gaia`, `/api/future-narrative`, `/api/ecoscan`); what remains is calling them from the Gaia UI, Future Memories, and EcoScan pages instead of using static copy.
- **Call the existing Firebase layer from the UI** — `lib/firebase.ts` is implemented with defensive initialization (`firebaseEnabled` flag); connecting Auth/Firestore would let footprint history, scores, and achievements persist across sessions and devices, and let Village data reflect real users instead of mock data.
- **Real EcoScan camera integration** — replace the simulated scan timer and fixed example result with live device camera capture feeding into `analyzeEcoImage`.
- **Real-time Village leaderboard** — replace static mock member data with live Firestore-backed community data and real-time updates.
- **Offline support / PWA** — add a service worker so core footprint tracking works without connectivity.
- **Localization (i18n)** — support multiple languages, especially for Gaia's narrative copy.
- **Expanded recommendation engine** — incorporate more carbon categories (e.g., flights, shopping, water usage) into `carbon.ts` and `gaia-recommendations.ts`.
- **Extend the test suite** — add component tests (the React Testing Library + jsdom setup already exists and is unused), tests for the three `/api/*` Route Handlers, and CI integration via GitHub Actions with a coverage reporting dashboard.
- **Performance profiling for the 3D scene** — add LOD (level-of-detail) handling and frame-rate-based quality scaling for low-end devices.

---

## PromptWars Evaluation Highlights

✅ Type-safe architecture with TypeScript
✅ Zustand state management
✅ Modular, pure business logic (`lib/carbon.ts`, `lib/gaia-recommendations.ts`)
✅ Dynamic Three.js visualization (`@react-three/fiber` + `@react-three/drei`)
✅ Responsive glassmorphism interface
✅ Context-aware recommendation engine
✅ Clear separation of presentation, state, and domain logic
✅ 89-case Vitest suite covering domain logic and both Zustand stores
✅ ARIA labels, live regions, and visible focus styles already implemented across most pages
✅ Gemini calls isolated behind server-only API routes — no API keys exposed to the browser
⚙️ Service layer implemented for Gemini AI and Firebase, ready for UI integration — not yet called from any page

---

<p align="center">
Built with 🌍 for PromptWars Challenge 3 — proving that climate tech can feel as alive as the planet it's protecting.
</p>
