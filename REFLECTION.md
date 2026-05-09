# Reflection

## 1. The hardest bug you hit this week, and how you debugged it

The hardest bug involved the audit results page rendering the total savings correctly but never showing the per‑tool breakdown cards. The API returned 200 and the page loaded, but the `findings` array always appeared empty. I formed three hypotheses: (1) the engine wasn't returning findings, (2) the API route wasn't storing them in Supabase, or (3) the results page wasn't reading the stored data properly.

I first confirmed that the engine unit tests passed and returned proper findings – that eliminated hypothesis 1. Then I added a temporary `console.log` in the API route right before the Supabase insert and saw that `auditResult.findings` was populated, but the database query response showed an empty `findings` array in the stored `savings_summary`. That narrowed it to the insert itself. I discovered the early version of the API route was storing only `totalMonthlySavings` and `totalAnnualSavings` in the `savings_summary` JSONB column, without spreading the `findings` array. I had initially written the insert before the engine was fully implemented and hadn't updated it. Adding `findings: auditResult.findings` to the inserted object fixed the issue immediately. This taught me to always keep the API schema in sync with the engine output – ideally by storing the entire `AuditResult` object rather than cherry‑picking fields.

## 2. A decision you reversed mid‑week, and what made you reverse it

I initially used Anthropic’s API for the AI‑generated summary, as the assignment suggested. I wrote the entire integration, prompt, and graceful fallback. However, I didn’t have an active Anthropic API key (free credits required phone verification that wasn't available to me). I left the code ready and relied on the fallback during development. Later, I discovered OpenRouter offers a truly free tier (no credit card, instant key) for multiple models, including Llama 3.3 70B. I reversed my decision and switched the summary provider from Anthropic to OpenRouter.

The reversal took only 10 minutes: I changed the endpoint from `https://api.anthropic.com/v1/messages` to `https://openrouter.ai/api/v1/chat/completions`, adjusted the request body to the OpenAI‑compatible format, and swapped the environment variable. The prompt itself remained unchanged. The result was that I could immediately test and demonstrate a live AI‑generated summary without waiting for credits or hitting rate limits. This reinforced a principle: always have a zero‑friction backup for external API dependencies, preferably one that works instantly with no setup.

## 3. What you would build in week 2 if you had it

If I had a second week, I would build a **benchmark comparison feature** – the optional bonus "your AI spend per developer is $X; companies your size average $Y". This would require aggregating anonymised audit data from all users and computing per‑seat, per‑developer, and per‑use‑case statistics. A user would immediately see how their spend stacks up against similar startups. That feature alone could make the tool far stickier, as people naturally care about social proof and peer comparisons.

I would also add a **PDF export** of the full audit report (another bonus), using a server‑side library like `@react-pdf/renderer` to generate a polished, branded report that users could forward to their CFO or team. Combined with a **weekly re‑audit email** that reminds users to update their spend and see new savings (as pricing changes), the tool could evolve from a one‑time utility into a recurring engagement product.

Finally, I would invest time in **interviewing more users** and iterating on the audit rules. Real feedback often surfaces edge cases the engine doesn’t handle – for example, companies that use multiple tools for the same task might benefit from consolidation advice, not just per‑tool savings.

## 4. How you used AI tools

I used **ChatGPT (GPT‑4o)** and **Cursor (with Claude)** extensively throughout the project. I relied on them for:

- **Generating boilerplate**: Tailwind CSS classes, shadcn/ui component configurations, and Next.js API route skeletons.
- **Debugging syntax**: When TypeScript threw hydration errors or import path mismatches, I pasted the error and stack trace and asked for potential causes.
- **Writing documentation outlines**: I used AI to draft the initial structure of `GTM.md` and `ECONOMICS.md`, then heavily edited them to reflect my specific numbers and channels.
- **Rubber‑ducking**: Before implementing the audit engine, I described the logic in plain English and asked the AI to critique the approach. It suggested handling the “overpay vs. retail” and “alternative tool” rules as separate competing recommendations, which I adopted.

I did **not** trust AI to write the actual audit engine rules or the pricing data – those required exact numbers and financial defensibility. I also did not use AI to generate my user interview notes; those are real conversations.

One specific time the AI was wrong: I asked it to generate a regex for extracting the public ID from a URL, and it confidently provided a pattern that matched UUIDs but also captured partial hex strings from the middle of paths, causing false matches. I caught it by writing a unit test with real audit URLs and saw it matched IDs like `93ffe24a` but also `undefined/other`. I ended up writing the extraction logic manually.

## 5. Self‑rating (1‑10 scale)

- **Discipline: 7** – I worked across at least five distinct calendar days and kept a real DEVLOG, but some days I underestimated the time needed for polish and had to extend hours.
- **Code quality: 8** – The audit engine is a pure function with clear separation of concerns, the component tree is well‑organised, and TypeScript types are used consistently. A few spots could use more refined error handling.
- **Design sense: 7** – The dark emerald theme is distinctive and fits the finance‑audit mood. The results page is clear and scannable, but the form layout could be more compact on mobile.
- **Problem‑solving: 8** – I resolved multiple integration issues (shadcn component installation, Next.js 15+ async params, OpenRouter fallback) methodically and documented my reasoning.
- **Entrepreneurial thinking: 6** – I enjoyed writing the GTM and economics files and had real user conversations, but I recognise I’m still learning to think about distribution and unit economics with the same depth as code.
