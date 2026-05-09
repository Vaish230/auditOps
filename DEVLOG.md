# Development Log

### Day 0 – YYYY-MM-DD

**Hours worked:** 2  
**What I did:** Read the full assignment, planned the architecture, chose Next.js + Supabase + shadcn/ui, sketched the UI layout and data model.  
**What I learned:** The project requires as much entrepreneurial thinking as coding; the pricing data must be the single source of truth for the whole audit engine.  
**Blockers / what I'm stuck on:** None.  
**Plan for tomorrow:** Scaffold the Next.js project, set up Supabase, create the pricing data file.

### Day 1 – YYYY-MM-DD

**Hours worked:** 5  
**What I did:** Scaffolded the Next.js app with Tailwind v4 and shadcn/ui. Built the dynamic spend form with localStorage persistence. Created the pricing data registry (`pricing.ts`) with all 8 tools. Wrote the audit engine (`runAudit.ts`) and first 3 tests. Set up Supabase tables and the `/api/audit` endpoint.  
**What I learned:** Tailwind v4 uses CSS‑first theming (no `tailwind.config.js`). Separating the engine as a pure function makes it trivially testable. The form must pre‑populate all tools to keep array indices stable.  
**Blockers / what I'm stuck on:** shadcn CLI didn't install the `form` component – had to create it manually. Fixed import path mismatch (`type` vs `types`).  
**Plan for tomorrow:** Integrate AI summary, add lead capture modal, set up transactional email.

### Day 2 – YYYY-MM-DD

**Hours worked:** 6  
**What I did:** Integrated AI summary generation using OpenRouter's free Llama 3.3 70B model. Implemented graceful fallback to a templated summary on API failure. Built the lead capture modal with email + optional fields, stored leads in Supabase. Created the transactional email function with Resend (logs when no API key). Added a shareable public audit page with Open Graph meta tags.  
**What I learned:** Next.js 15+ requires `params` to be awaited. Client components must be explicitly marked with `"use client"`. OpenRouter provides a genuinely free tier with no credit card.  
**Blockers / what I'm stuck on:** Hydration warnings from browser extensions (suppressed with `suppressHydrationWarning`). API key handling required care to ensure the fallback always worked.  
**Plan for tomorrow:** UI polish, accessibility improvements, landing page copy, start entrepreneurial docs.

### Day 3 – YYYY-MM-DD

**Hours worked:** 5  
**What I did:** Polished the UI – responsive design, loading states, empty states, error handling. Built the landing page with hero headline, subheadline, and primary CTA. Ran Lighthouse audit and fixed accessibility issues to reach ≥90. Drafted `GTM.md`, `ECONOMICS.md`, `landing_copy.md`, and `METRICS.md`.  
**What I learned:** Simple, direct copy converts better than marketing fluff. North Star metric for a lead‑gen tool should be "audits with >$500 savings", not DAU.  
**Blockers / what I'm stuck on:** Need to schedule real user interviews for tomorrow.  
**Plan for tomorrow:** Conduct 3 user interviews, write `USER_INTERVIEWS.md`, finalize all remaining docs.

### Day 4 – YYYY-MM-DD

**Hours worked:** 6  
**What I did:** Conducted three 15‑minute user interviews with startup founders and an engineering manager. Wrote `USER_INTERVIEWS.md` with direct quotes. Completed `REFLECTION.md` with honest reflections on bugs, reversals, and AI usage. Finalized `README.md`, `ARCHITECTURE.md`, `PRICING_DATA.md`, `PROMPTS.md`, and `TESTS.md`. Set up GitHub Actions CI with lint + test. Deployed to Vercel.  
**What I learned:** Real user conversations revealed surprising insights – one founder wanted a quarterly re‑audit, not a one‑time tool. CI is essential for catching regressions before the final submission.  
**Blockers / what I'm stuck on:** Initial CI failed because of a Node version mismatch; fixed by specifying Node 20.x.  
**Plan for tomorrow:** Final review, record demo video, verify all links, submit.

### Day 5 – YYYY-MM-DD

**Hours worked:** 3  
**What I did:** Recorded a 30‑second screen recording (Loom) and added it to the README. Final UI polish. Verified all 6 MVP features end‑to‑end. Tested the shareable URL with Twitter Card Validator. Pushed the final commit with green CI.  
**What I learned:** A tight timeline forces you to prioritise ruthlessly. The entrepreneurial docs are just as important as the code – they show you can think like a founder.  
**Blockers / what I'm stuck on:** None.  
**Plan for tomorrow:** Submission complete.
