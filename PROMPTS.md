# Prompts

## AI Summary Generation (OpenRouter / Llama 3.3 70B)

**Model:** `meta-llama/llama-3.3-70b-instruct` (free tier via OpenRouter)  
**Endpoint:** `https://openrouter.ai/api/v1/chat/completions`

### Prompt template

You are an AI spend analyst. Based on the following audit of a startup's AI tool usage, write a friendly, personalized summary (~100 words). Start with "Based on your audit," and give an overall assessment and the biggest savings opportunities. Be honest if there's little to save.

### Why this prompt

- Forces a consistent opening phrase so every summary is professional and on‑brand.
- Injects real numbers from the audit engine to prevent hallucination.
- Explicitly instructs the model to be honest - no manufactured savings.
- Limits length to ~100 words, ideal for a quick‑scan results page.

### What we tried that didn't work

- Asking for "a detailed report" - the model produced 300+ words, overwhelming the UI.
- Omitting the savings totals - the model invented plausible but incorrect numbers.
- Not specifying the opening phrase - summaries lacked a unified voice.

### Fallback

When the API key is missing, the request fails, or the response is malformed, a deterministic template is used. It highlights the top two savings opportunities with exact dollar amounts from the audit engine, and includes a call‑to‑action about Credex credits.
