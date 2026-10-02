# VIBELOOP

**Don't just generate code. Build. Test. Fix. Ship.**

A hackathon-ready React + TypeScript experience demonstrating an autonomous software verification loop.

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## What is implemented

- Premium engineering command-center UI
- Judges Demo: IDEA → PLAN → BUILD → RUN → TEST → FAIL → DIAGNOSE → FIX → RETEST → VERIFY → SHIP
- Stateful demo workflow rather than static screenshots
- Interactive radial 3D-style/WebGL-inspired workflow visualization using CSS/SVG motion (no external runtime required)
- Architecture graph
- Live build terminal stream
- Live application preview
- Test engine state with controlled, clearly demonstrable failure
- Root-cause / patch view
- Regression retest
- Deployment pipeline
- Project persistence in browser localStorage
- Engineering Agent panel
- Responsive mobile layout
- Error/empty/loading-like states
- Clear separation of demo telemetry from real provider integrations

## Production adapter boundary

The UI deliberately does not claim that browser-only demo mode is a real secure code sandbox, LLM backend, deployment system, or production test runner.

Recommended server-side adapters:

- `AI_PROVIDER`: OpenAI / Anthropic / Gemini-compatible abstraction
- `SANDBOX`: isolated container runner
- `TEST_RUNNER`: Playwright + API checks + Lighthouse/security tooling
- `DATABASE`: Supabase/PostgreSQL
- `DEPLOYMENT`: Vercel / Netlify / Render APIs

Never expose provider secrets in frontend code.

## 30-second judge explanation

"Most AI coding tools stop at prompt → code. VIBELOOP closes the engineering loop: it plans, builds, runs, tests, detects a failure, diagnoses the affected component, applies a patch, retests regression paths, verifies the result, and only then marks the application ready to ship."
