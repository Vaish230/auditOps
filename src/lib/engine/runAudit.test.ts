import { describe, it, expect } from "vitest";
import { runAudit } from "./runAudit";
import type { AuditInput } from "./types";

describe("runAudit", () => {
  it("suggests switching from Cursor Business to Pro for a solo dev", () => {
    const input: AuditInput = {
      tools: [{ tool: "cursor", plan: "Business", monthlySpend: 40, seats: 1 }],
      teamSize: 5,
      useCase: "coding",
    };
    const result = runAudit(input);
    const f = result.findings[0];
    expect(f.recommendedAction).toBe("switch_plan"); // we'll adjust after we implement real logic
    expect(f.recommendedPlan).toBe("Pro");
    expect(f.monthlySavings).toBe(20);
  });
});
