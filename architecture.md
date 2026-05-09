sequenceDiagram
participant User
participant Browser
participant Next.js
participant Supabase
participant OpenRouter

    User->>Browser: Fills spend form
    Browser->>Browser: Persists form state in localStorage
    User->>Browser: Submits form
    Browser->>Next.js: POST /api/audit (JSON payload)
    Next.js->>Next.js: Validates input (Zod)
    Next.js->>Next.js: Runs audit engine (pure function)
    Next.js->>OpenRouter: Requests AI summary (POST /api/v1/chat/completions)
    alt API success
        OpenRouter-->>Next.js: Generated summary
    else API failure
        Next.js->>Next.js: Uses fallback template
    end
    Next.js->>Supabase: Inserts audit record (audits table)
    Supabase-->>Next.js: Success (public_id)
    Next.js-->>Browser: 200 { id: public_id }
    Browser->>Next.js: Redirects to /audit/[id]
    Next.js->>Supabase: Fetches audit by public_id
    Supabase-->>Next.js: Audit data (findings, summary)
    Next.js-->>Browser: Renders results page
    User->>Browser: Clicks "Get Full Report"
    Browser->>Next.js: POST /api/lead (email + optional fields)
    Next.js->>Supabase: Inserts lead (leads table)
    Next.js->>Next.js: Sends confirmation email (Resend, if configured)
    Next.js-->>Browser: 200 { success: true }

# Data Flow

## Form input

The user selects AI tools and enters plan, monthly spend, seats, team size, and use case. All values are persisted in localStorage so the form survives page reloads.

## Submission

Only tools that are enabled and have a plan are sent as a JSON array to `POST /api/audit`.

## Audit engine

A pure TypeScript function (`runAudit`) loads pricing data from a single registry (`pricing.ts`) and produces per‑tool findings:

- current spend,
- recommended action,
- monthly savings,
  and a one‑sentence reason.

## AI summary

The findings are formatted into a prompt and sent to OpenRouter (Llama 3.3 70B). The resulting paragraph is attached to the audit record. On any error or missing API key, a deterministic fallback template is used instead.

## Storage

The complete audit result (findings, summary, input) is stored as JSONB in Supabase's audits table.

## Results page

A server component fetches the audit by its public ID and passes the data to a client component that renders:

- per‑tool cards,
- the hero savings total,
- the AI summary,
  and the "Get Full Report" button.

## Lead capture

A modal collects email, company, role, and team size, then sends them to `POST /api/lead`. The lead is stored in the leads table and a confirmation email is attempted via Resend (falls back to logging if no API key is set).

## Public sharing

A separate route `/audit/[id]/public` fetches the audit and renders a stripped‑down view without personal data. Open Graph and Twitter Card meta tags are set for clean social previews.

# Why We Chose This Stack

- **Next.js (App Router) + TypeScript** - Enables a clear separation between server and client code. The audit engine and API routes run server-side, keeping sensitive logic and keys private. TypeScript ensures reliability of the audit data structures.
- **Tailwind v4 + shadcn/ui** - Utility‑first CSS with a custom dark theme (emerald accents). shadcn/ui provides accessible, composable primitives without locking us into a pre‑built design.
- **Supabase** - Managed PostgreSQL with a generous free tier, built-in REST API, and simple JavaScript client. Perfect for storing audit results and leads without writing a separate backend.
- **OpenRouter (Llama 3.3 70B)** - Free tier, no credit card required, and easy fallback to a template. Meets the assignment's requirement to use an LLM without incurring costs.
- **Resend** - Transactional email API with a free tier. Falls back gracefully when the API key is missing, logging the email content during development.

# What We'd Change for 10k Audits/Day

1. **Queue audit processing** - Move the AI summary call to a background worker (e.g., BullMQ, Cloudflare Queues) so the API responds immediately and the summary is added asynchronously.
2. **Cache pricing data** - Load the pricing registry into an in-memory cache at startup; invalidate only when the file changes.
3. **Database optimizations** - Add indexes on `public_id` and `audit_id`, use Supabase's connection pooler for high concurrency.
4. **Robust rate limiting** - Replace the current minimal protection with a distributed rate limiter (Upstash Redis) for both the audit and lead endpoints.
5. **Static generation for public pages** - Pre-generate public audit pages at creation time (Incremental Static Regeneration) to serve thousands of views without hitting the database.
6. **CDN for OG images** - Pre-render Open Graph images and serve them from a CDN instead of generating them dynamically.
