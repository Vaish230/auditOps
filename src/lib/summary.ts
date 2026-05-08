import type { AuditResult } from "@/lib/engine/type";

export async function generateSummary(result: AuditResult): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.log("No OPENROUTER_API_KEY, using fallback summary");
    return fallbackSummary(result);
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000", // optional, but good practice
        "X-Title": "AI Spend Audit",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct", // free, high quality
        messages: [{ role: "user", content: buildPrompt(result) }],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      console.error("OpenRouter API error:", res.status);
      return fallbackSummary(result);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      console.error("Unexpected OpenRouter response:", data);
      return fallbackSummary(result);
    }
    return text.trim();
  } catch (err) {
    console.error("OpenRouter API call failed:", err);
    return fallbackSummary(result);
  }
}

function buildPrompt(result: AuditResult): string {
  const findingsText = result.findings
    .map(
      (f) =>
        `- ${f.tool} (${f.currentPlan}): ${f.reason} Potential saving: $${f.monthlySavings}/mo`,
    )
    .join("\n");

  return `You are an AI spend analyst. Based on the following audit of a startup's AI tool usage, write a friendly, personalized summary (~100 words). Start with "Based on your audit," and give an overall assessment and the biggest savings opportunities. Be honest if there's little to save. 

Audit findings:
${findingsText}

Total monthly savings: $${result.totalMonthlySavings}/mo
Total annual savings: $${result.totalAnnualSavings}/year

Summary:`;
}

function fallbackSummary(result: AuditResult): string {
  if (result.totalMonthlySavings <= 0) {
    return "Based on your audit, your AI tool stack is already well optimized. You're on the right plans for your team size and use case. We'll notify you if new opportunities arise to reduce your spend.";
  }

  const top = result.findings
    .filter((f) => f.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .slice(0, 2);

  const biggestFinding = top[0];
  const secondFinding = top[1];

  let biggestText = "";
  if (biggestFinding) {
    biggestText = `${biggestFinding.tool} (${biggestFinding.currentPlan} → ${biggestFinding.recommendedPlan || "buy credits"}) could save $${biggestFinding.monthlySavings}/mo`;
  }

  let secondText = "";
  if (secondFinding) {
    secondText = ` and ${secondFinding.tool} could save another $${secondFinding.monthlySavings}/mo`;
  }

  return `Based on your audit, you could save $${result.totalMonthlySavings} per month — that's $${result.totalAnnualSavings} per year. The biggest opportunity: ${biggestText}${secondText}. We recommend reviewing your plans and exploring discounted credits from Credex for even more savings.`;
}
