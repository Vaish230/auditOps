export interface ToolPlan {
  name: string;
  monthlyPricePerSeat: number; // 0 for free/unknown
  annualPricePerSeat?: number;
  sourceUrl: string;
  lastVerified: string; // YYYY-MM-DD
}

export interface ToolAlternative {
  name: string;
  monthlyPricePerSeat: number;
  reason: string;
}

export interface ToolConfig {
  name: string;
  plans: ToolPlan[];
  useCases: string[];
  alternatives?: ToolAlternative[];
}

export const tools: Record<string, ToolConfig> = {
  cursor: {
    name: "Cursor",
    plans: [
      {
        name: "Hobby",
        monthlyPricePerSeat: 0,
        sourceUrl: "https://cursor.sh/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "Pro",
        monthlyPricePerSeat: 20,
        sourceUrl: "https://cursor.sh/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "Business",
        monthlyPricePerSeat: 40,
        sourceUrl: "https://cursor.sh/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "Enterprise",
        monthlyPricePerSeat: 0,
        sourceUrl: "https://cursor.sh/pricing",
        lastVerified: "2026-05-07",
      }, // custom pricing
    ],
    useCases: ["coding"],
    alternatives: [
      {
        name: "GitHub Copilot Individual",
        monthlyPricePerSeat: 10,
        reason: "Similar AI code completion, half the price.",
      },
    ],
  },
  "github-copilot": {
    name: "GitHub Copilot",
    plans: [
      {
        name: "Individual",
        monthlyPricePerSeat: 10,
        sourceUrl: "https://github.com/features/copilot/plans",
        lastVerified: "2026-05-07",
      },
      {
        name: "Business",
        monthlyPricePerSeat: 19,
        sourceUrl: "https://github.com/features/copilot/plans",
        lastVerified: "2026-05-07",
      },
      {
        name: "Enterprise",
        monthlyPricePerSeat: 39,
        sourceUrl: "https://github.com/features/copilot/plans",
        lastVerified: "2026-05-07",
      },
    ],
    useCases: ["coding"],
    alternatives: [
      {
        name: "Cursor Pro",
        monthlyPricePerSeat: 20,
        reason: "More advanced AI code editor, includes Copilot features.",
      },
    ],
  },
  claude: {
    name: "Claude",
    plans: [
      {
        name: "Free",
        monthlyPricePerSeat: 0,
        sourceUrl: "https://claude.ai/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "Pro",
        monthlyPricePerSeat: 17,
        sourceUrl: "https://claude.ai/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "Max",
        monthlyPricePerSeat: 100,
        sourceUrl: "https://claude.ai/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "Team",
        monthlyPricePerSeat: 20,
        sourceUrl: "https://claude.ai/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "Enterprise",
        monthlyPricePerSeat: 20,
        sourceUrl: "https://claude.ai/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "API direct",
        monthlyPricePerSeat: 20,
        sourceUrl: "https://anthropic.com/pricing",
        lastVerified: "2026-05-07",
      },
    ],
    useCases: ["writing", "research", "coding", "data", "mixed"],
    alternatives: [
      {
        name: "ChatGPT Plus",
        monthlyPricePerSeat: 20,
        reason: "Similar AI assistant, broader model selection.",
      },
    ],
  },
  chatgpt: {
    name: "ChatGPT",
    plans: [
      {
        name: "Plus",
        monthlyPricePerSeat: 20,
        sourceUrl: "https://openai.com/chatgpt/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "Team",
        monthlyPricePerSeat: 25,
        sourceUrl: "https://openai.com/chatgpt/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "Enterprise",
        monthlyPricePerSeat: 0,
        sourceUrl: "https://openai.com/chatgpt/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "API direct",
        monthlyPricePerSeat: 0,
        sourceUrl: "https://openai.com/api/pricing/",
        lastVerified: "2026-05-07",
      },
    ],
    useCases: ["writing", "research", "coding", "data", "mixed"],
    alternatives: [
      {
        name: "Claude Pro",
        monthlyPricePerSeat: 20,
        reason: "Better for long context and writing tasks.",
      },
    ],
  },
  "anthropic-api": {
    name: "Anthropic API direct",
    plans: [
      {
        name: "API",
        monthlyPricePerSeat: 0,
        sourceUrl: "https://anthropic.com/pricing",
        lastVerified: "2026-05-07",
      },
    ],
    useCases: ["coding", "writing", "data"],
  },
  "openai-api": {
    name: "OpenAI API direct",
    plans: [
      {
        name: "API",
        monthlyPricePerSeat: 0,
        sourceUrl: "https://openai.com/api/pricing/",
        lastVerified: "2026-05-07",
      },
    ],
    useCases: ["coding", "writing", "data"],
  },
  gemini: {
    name: "Gemini",
    plans: [
      {
        name: "Pro",
        monthlyPricePerSeat: 20,
        sourceUrl: "https://one.google.com/about/gemini-advanced",
        lastVerified: "2026-05-07",
      },
      {
        name: "Ultra",
        monthlyPricePerSeat: 0,
        sourceUrl: "https://one.google.com/about/gemini-advanced",
        lastVerified: "2026-05-07",
      }, // custom
      {
        name: "API",
        monthlyPricePerSeat: 0,
        sourceUrl: "https://ai.google.dev/pricing",
        lastVerified: "2026-05-07",
      },
    ],
    useCases: ["writing", "research", "data"],
    alternatives: [
      {
        name: "ChatGPT Plus",
        monthlyPricePerSeat: 20,
        reason: "More mature ecosystem, similar price.",
      },
    ],
  },
  windsurf: {
    name: "Windsurf",
    plans: [
      {
        name: "Free",
        monthlyPricePerSeat: 0,
        sourceUrl: "https://codeium.com/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "Pro",
        monthlyPricePerSeat: 15,
        sourceUrl: "https://codeium.com/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "Team",
        monthlyPricePerSeat: 30,
        sourceUrl: "https://codeium.com/pricing",
        lastVerified: "2026-05-07",
      },
      {
        name: "Enterprise",
        monthlyPricePerSeat: 0,
        sourceUrl: "https://codeium.com/pricing",
        lastVerified: "2026-05-07",
      },
    ],
    useCases: ["coding"],
    alternatives: [
      {
        name: "Cursor Pro",
        monthlyPricePerSeat: 20,
        reason: "More popular editor with similar features.",
      },
    ],
  },
};
