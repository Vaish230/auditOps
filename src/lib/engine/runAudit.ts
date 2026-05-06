import { tools } from "@/lib/pricing";
import type { AuditInput, AuditResult, Finding } from "./types";

export function runAudit(input: AuditInput): AuditResult {
  const findings: Finding[] = input.tools.map((toolInput) => {
    const toolConfig = tools[toolInput.tool];
    if (!toolConfig) {
      return {
        tool: toolInput.tool,
        currentPlan: toolInput.plan,
        currentMonthlySpend: toolInput.monthlySpend,
        recommendedAction: "stay",
        monthlySavings: 0,
        reason: "Tool not found.",
      };
    }

    // placeholder logic — we'll flesh out
    const currentPlanObj = toolConfig.plans.find(
      (p) => p.name === toolInput.plan,
    );
    return {
      tool: toolInput.tool,
      currentPlan: toolInput.plan,
      currentMonthlySpend: toolInput.monthlySpend,
      recommendedAction: "stay",
      monthlySavings: 0,
      reason: currentPlanObj
        ? `Staying on ${toolInput.plan} is fine.`
        : "Plan not recognized.",
    };
  });

  const totalMonthlySavings = findings.reduce(
    (sum, f) => sum + f.monthlySavings,
    0,
  );

  return {
    findings,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
}
