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
- **Generative AI companionship (planned/in-progress)** — Gaia is designed as an emotionally intelligent guide; a Gemini-based service layer for personalized narration is implemented and ready to be wired into the experience
- **Data visualization as storytelling** — a 3D Earth, future-memory narratives, and "what-if" simulations instead of bar charts

---

## 3. Features

| Feature | Description |
|---|---|
| 🌎 **Living 3D Earth** | A real-time, interactive Three.js globe whose health, vegetation, water, air quality, biodiversity, season, and weather visually reflect the user's sustainability score. |
| 🧮 **Carbon Footprint Calculator** | Calculates an annual CO₂e footprint from transport, electricity, and food habits, compared against the global average, with a category-by-category breakdown. |
| 🤖 **Gaia Companion** | A context-aware Earth spirit that delivers short, warm feedback, eco-tips, and celebrates milestones based on the user's footprint and progress. |
| 💡 **Smart Recommendations Engine** | A pure, unit-testable rules engine (`gaia-recommendations.ts`) that identifies the single highest-impact next action a user can take and estimates the kg CO₂ saved. |
| 🔮 **Future Memories** | A time-travel narrative experience (Now → 1 → 5 → 10 years) showing an AI-generated, cinematic vision of the user's future Earth based on their current score. |
| 🔁 **"What If…?" Simulator** | Lets users preview the CO₂ and tree-equivalent impact of adopting specific habits (e.g., switching to LEDs, going car-free) before committing. |
| 📸 **EcoScan AI** | A scan-and-analyze flow (image-based) that estimates the environmental impact of everyday items and suggests lower-impact alternatives. |
| 🧑‍🤝‍🧑 **Green Valley Village** | A social/community layer showing collective impact (e.g., trees planted together) and friendly leaderboard comparisons. |
| 🦋 **World & Achievements** | Unlockable creatures and world features (auroras, waterfalls, cherry blossoms) that reward sustained good habits, reinforcing positive feedback loops. |
| 🎯 **Guided Onboarding** | A short, conversational quiz that initializes a new user's starting Earth state and sustainability score. |
| ✨ **Polished Motion & UI** | Glassmorphic cards, animated counters, floating navigation, particle backgrounds, and page transitions built with Framer Motion and Tailwind CSS. |

---

## 4. Architecture

Terra is a **Next.js (App Router)** single-page-feeling application using a **client-heavy, store-driven architecture**:

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
   │  cloud layer, stars)      │              └───────────────┬─────────────┘
   └────────────────────────────┘                              │
                                                                ▼
                                              ┌───────────────────────────┐
                                              │   Service Layer (built,     │
                                              │   not yet wired into UI)    │
                                              │  - lib/gemini.ts             │
                                              │    (Gaia chat, future        │
                                              │    narratives, EcoScan)      │
                                              │  - lib/firebase.ts           │
                                              │    (Auth, Firestore, Storage)│
                                              └───────────────────────────┘
```

**Key architectural decisions:**

- **Separation of pure logic from UI:** `carbon.ts` and `gaia-recommendations.ts` are framework-agnostic pure functions, making the core sustainability math independently testable and reusable across pages and stores.
- **Centralized client state via Zustand:** `terra-store` owns the Earth's visual/game state (health, score, missions, achievements); `carbon-store` owns footprint inputs/results. This keeps the 3D scene, dashboards, and Gaia messaging in sync without prop-drilling.
- **Lazy-loaded 3D scene:** The Three.js `EarthScene` is dynamically imported with `ssr: false` to avoid WebGL issues during server-side rendering and to keep initial page load lean.
- **AI as a service boundary:** All Gemini calls live in `lib/gemini.ts` behind small, purpose-built functions (`askGaia`, `generateFutureNarrative`, `analyzeEcoImage`). This service layer is fully implemented but **not yet called from any page or component** — pages currently use static/derived Gaia messages, with the Gemini integration ready to be wired in as the next step (see Future Improvements).
- **Optional backend via Firebase:** `lib/firebase.ts` wires up Auth, Firestore, and Storage for future persistence (user profiles, village/community data, EcoScan history). Like the Gemini layer, this is implemented but not yet connected to the UI — the app currently runs entirely on local Zustand state.

---

## 5. Folder Structure

```
src/
├── app/                          # Next.js App Router pages (routes)
│   ├── page.tsx                  # Root — redirects to /earth
│   ├── layout.tsx                # Root layout, fonts, global metadata
│   ├── earth/                    # Main 3D living Earth dashboard
│   ├── onboarding/                # First-time user quiz / setup flow
│   ├── footprint/                # Carbon footprint calculator
│   ├── simulator/                # "What If...?" impact simulator
│   ├── future-memories/          # Time-travel narrative experience
│   ├── ecoscan/                  # AI-powered item impact scanner
│   ├── village/                  # Community / social impact view
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
├── lib/                          # Pure logic & external service clients
│   ├── carbon.ts                 # CO2e calculation engine
│   ├── gaia-recommendations.ts   # Next-best-action recommendation engine
│   ├── gemini.ts                 # Gemini AI client (Gaia, narratives, EcoScan)
│   ├── firebase.ts               # Firebase Auth / Firestore / Storage setup
│   └── utils.ts                  # Shared helpers (e.g., className merging)
│
├── stores/                       # Zustand global state
│   ├── terra-store.ts            # Earth state, score, missions, achievements
│   └── carbon-store.ts           # Footprint inputs & calculated results
│
└── styles/
    └── globals.css                # Tailwind layers, design tokens, glass UI
```

---

## 6. Technologies Used

| Category | Technology |
|---|---|
| Framework | **Next.js** (App Router, client components) |
| Language | **TypeScript** |
| 3D Rendering | **Three.js**, **@react-three/fiber**, **@react-three/drei** |
| Animation | **Framer Motion** |
| State Management | **Zustand** |
| Styling | **Tailwind CSS**, custom design tokens, glassmorphism utilities |
| Class Utilities | **clsx**, **tailwind-merge** |
| Generative AI (service layer, not yet wired into UI) | **Google Gemini API** (`@google/generative-ai`) — text generation & multimodal image analysis |
| Backend Services (service layer, not yet wired into UI) | **Firebase** (Authentication, Firestore, Storage) |
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

   Create a `.env.local` file in the project root:
   ```env
   # Gemini AI
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

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

Terra's domain logic is intentionally written as **pure, dependency-free functions**, making it straightforward to unit test without mocking React, Three.js, or network calls.

**Current status:** no automated test suite is included in this submission. Testing strategy focuses on the pure domain logic and Zustand stores below, which are structured specifically to be easy to test in isolation. A Vitest-based test suite is planned (see Future Improvements) to provide coverage for carbon calculations, recommendation logic, and store state transitions.

### Recommended test setup
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### What to test

| Module | Test Focus |
|---|---|
| `lib/carbon.ts` | Verify `calculateFootprint` produces correct totals, breakdowns, ratings (`low`/`average`/`high`), and `treesToOffset` for known input combinations (e.g., all-low vs. all-high inputs). |
| `lib/gaia-recommendations.ts` | Verify `getRecommendation` returns the correct next-best-action category and savings estimate for each combination of transport/electricity/food, including the "already optimal" (`maintain`) edge case. |
| `stores/carbon-store.ts` | Verify state transitions (`setTransport`, `calculate`, `reset`) update `inputs` and `result` correctly using Zustand's vanilla store testing pattern. |
| `stores/terra-store.ts` | Verify `addScore` clamps between 0–100, and `unlockAchievement` appends without duplicating. |
| UI Components | Use React Testing Library to verify key interactive flows: onboarding quiz progression, footprint form input → result rendering, and simulator scenario selection. |

### Example test run (once the suite above is added)
```bash
npx vitest run
```

### Manual / exploratory QA checklist
- [ ] Complete onboarding and confirm starting Earth state/score persists
- [ ] Adjust footprint calculator inputs and confirm Gaia's recommendation updates accordingly
- [ ] Trigger the EcoScan simulated scan flow and confirm state transitions (`idle → scanning → result`)
- [ ] Step through all four Future Memories time points and confirm narrative copy changes
- [ ] Confirm 3D Earth scene loads without SSR errors and responds to `earthState` changes
- [ ] Test on a low-end/mobile device to confirm Three.js scene degrades gracefully

---

## 9. Accessibility Features

Terra aims to make a visually rich, animation-heavy experience usable by as many people as possible. The following are implemented in the current codebase:

- **Semantic HTML structure**: pages use heading elements (`<h1>`, etc.) for primary titles, supporting screen reader navigation and document outline.
- **Dark, high-contrast base theme**: the default `terra-space` dark palette with light text is designed for strong text/background contrast.
- **Button-based interactive controls**: selectable options (onboarding quiz, simulator scenarios) are implemented as standard `<button>` elements rather than custom non-semantic elements, preserving native keyboard and focus support.
- **Non-color-coded feedback**: footprint ratings (`low`/`average`/`high`) pair color with icons and explicit text labels (e.g., "🌿 Lighter than average") rather than relying on color alone.
- **Graceful 3D fallback**: the Earth visualization loads inside a `Suspense` boundary, so the rest of the page remains usable while/if WebGL content is loading or unavailable.
- **Readable typography system**: the Inter typeface is used for UI text at accessible weights/sizes, with JetBrains Mono reserved for numeric data to improve legibility of figures.

### Not yet implemented
A full accessibility audit has not been performed. `aria-*` attributes, explicit focus-visible styling, and a `prefers-reduced-motion` toggle are not currently present in the codebase — these are tracked under Future Improvements below.

---

## 10. Future Improvements

- **Full WCAG 2.1 AA audit** — add explicit `aria-label`, `aria-live` (for Gaia's dynamic messages), visible focus-state styling, and a full keyboard-navigation pass across all interactive elements.
- **User-facing reduced-motion toggle** — respect `prefers-reduced-motion` automatically and offer an in-app override.
- **Wire up the Gemini service layer** — `lib/gemini.ts` is fully implemented; connect `askGaia`, `generateFutureNarrative`, and `analyzeEcoImage` to the Gaia UI, Future Memories, and EcoScan pages respectively.
- **Wire up the Firebase service layer** — `lib/firebase.ts` is fully implemented; connect Auth/Firestore so footprint history, scores, and achievements persist across sessions and devices, and Village data reflects real users.
- **Real EcoScan camera integration** — replace the simulated scan timer with live device camera capture feeding into `analyzeEcoImage`.
- **Real-time Village leaderboard** — replace static mock member data with live Firestore-backed community data and real-time updates.
- **Offline support / PWA** — add a service worker so core footprint tracking works without connectivity.
- **Localization (i18n)** — support multiple languages, especially for Gaia's narrative copy.
- **Expanded recommendation engine** — incorporate more carbon categories (e.g., flights, shopping, water usage) into `carbon.ts` and `gaia-recommendations.ts`.
- **Automated test suite** — add the Vitest + Testing Library suite outlined in the Testing section, with CI integration via **GitHub Actions** and a coverage reporting dashboard.
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
✅ Service layer implemented for Gemini AI and Firebase, ready for UI integration

---

<p align="center">
Built with 🌍 for PromptWars Challenge 3 — proving that climate tech can feel as alive as the planet it's protecting.
</p>
