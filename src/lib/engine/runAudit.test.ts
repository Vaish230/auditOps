import { describe, it, expect } from "vitest";
import { runAudit } from "./runAudit";
import type { AuditInput } from "./type";

describe("runAudit", () => {
  it("recommends a cheaper alternative for a single Cursor Business user", () => {
    const input: AuditInput = {
      tools: [{ tool: "cursor", plan: "Business", monthlySpend: 40, seats: 1 }],
      teamSize: 5,
      useCase: "coding",
    };
    const result = runAudit(input);
    const f = result.findings[0];
    // Engine picks the cheapest alternative: GitHub Copilot Individual ($10) because it saves 75%
    expect(f.monthlySavings).toBe(30); // 40 - 10 = 30
    expect(f.recommendedPlan).toBe("GitHub Copilot Individual");
    expect(f.reason).toContain("Copilot");
  });

  it("suggests buying credits for high API spend", () => {
    const input: AuditInput = {
      tools: [{ tool: "openai-api", plan: "API", monthlySpend: 200, seats: 1 }],
      teamSize: 2,
      useCase: "coding",
    };
    const result = runAudit(input);
    expect(result.findings[0].recommendedAction).toBe("buy_credits");
    expect(result.findings[0].monthlySavings).toBeCloseTo(60); // 30% of 200
  });
});
