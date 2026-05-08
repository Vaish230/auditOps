import { tools, type ToolConfig, type ToolPlan } from "@/lib/pricing";
import type { AuditInput, AuditResult, Finding } from "./type";

export function runAudit(input: AuditInput): AuditResult {
  const findings: Finding[] = [];

  for (const ti of input.tools) {
    const toolConfig = tools[ti.tool];
    if (!toolConfig) {
      findings.push({
        tool: ti.tool,
        currentPlan: ti.plan,
        currentMonthlySpend: ti.monthlySpend,
        recommendedAction: "stay",
        monthlySavings: 0,
        reason: "Tool not recognized.",
      });
      continue;
    }

    const currentPlan = toolConfig.plans.find((p) => p.name === ti.plan);
    if (!currentPlan) {
      findings.push({
        tool: ti.tool,
        currentPlan: ti.plan,
        currentMonthlySpend: ti.monthlySpend,
        recommendedAction: "stay",
        monthlySavings: 0,
        reason: `Plan "${ti.plan}" not found in pricing data.`,
      });
      continue;
    }

    // Determine if user is overpaying vs retail price
    const officialMonthly = currentPlan.monthlyPricePerSeat * ti.seats;
    const isOverpaying = ti.monthlySpend > officialMonthly;
    // For Enterprise/custom plans, monthlyPricePerSeat is 0, so overpaying check won't apply.

    // Look for cheaper plan from same vendor
    const cheaperSameVendorPlan = toolConfig.plans
      .filter(
        (p) =>
          p.monthlyPricePerSeat < currentPlan.monthlyPricePerSeat &&
          p.monthlyPricePerSeat > 0,
      ) // exclude free unless current is paid
      .sort((a, b) => a.monthlyPricePerSeat - b.monthlyPricePerSeat)[0];

    // Look for viable alternative tool
    let cheapestAlternative:
      | { name: string; monthlyPricePerSeat: number }
      | undefined;
    if (toolConfig.alternatives) {
      cheapestAlternative = toolConfig.alternatives
        .filter(
          (alt) => alt.monthlyPricePerSeat < currentPlan.monthlyPricePerSeat,
        )
        .sort((a, b) => a.monthlyPricePerSeat - b.monthlyPricePerSeat)[0];
    }

    let bestRecommendation: Finding = {
      tool: ti.tool,
      currentPlan: ti.plan,
      currentMonthlySpend: ti.monthlySpend,
      recommendedAction: "stay",
      monthlySavings: 0,
      reason: "Your plan looks optimal.",
    };

    // Rule: overpaying retail → switch to credits
    if (
      isOverpaying &&
      ti.monthlySpend > 0 &&
      !["anthropic-api", "openai-api"].includes(ti.tool)
    ) {
      const savings = ti.monthlySpend - officialMonthly;
      bestRecommendation = {
        ...bestRecommendation,
        recommendedAction: "switch_plan", // actually same plan but using credits
        recommendedPlan: currentPlan.name,
        monthlySavings: savings,
        reason: `You're paying $${ti.monthlySpend} for ${ti.seats} seats on ${ti.plan}, but the official price is $${officialMonthly}. You could buy discounted credits from Credex and save $${savings}/month.`,
      };
    }

    // Rule: downgrade to cheaper same-vendor plan if it meets needs (use case, team size)
    if (cheaperSameVendorPlan && !isOverpaying) {
      // For simplicity, we suggest downgrade if the cheaper plan still supports the use case.
      // More sophisticated logic would check features, but we keep it understandable.
      const savings =
        (currentPlan.monthlyPricePerSeat -
          cheaperSameVendorPlan.monthlyPricePerSeat) *
        ti.seats;
      if (savings > 0 && savings > bestRecommendation.monthlySavings) {
        bestRecommendation = {
          tool: ti.tool,
          currentPlan: ti.plan,
          currentMonthlySpend: ti.monthlySpend,
          recommendedAction: "switch_plan",
          recommendedPlan: cheaperSameVendorPlan.name,
          monthlySavings: savings,
          reason: `You could switch from ${ti.plan} ($${currentPlan.monthlyPricePerSeat}/seat) to ${cheaperSameVendorPlan.name} ($${cheaperSameVendorPlan.monthlyPricePerSeat}/seat) and save $${savings}/month.`,
        };
      }
    }

    // Rule: suggest a cheaper alternative tool if savings > 20%
    if (cheapestAlternative) {
      const alternativeMonthly =
        cheapestAlternative.monthlyPricePerSeat * ti.seats;
      const savings = ti.monthlySpend - alternativeMonthly;
      const savingsPercentage = savings / ti.monthlySpend;
      if (
        savings > 0 &&
        savingsPercentage >= 0.2 &&
        savings > bestRecommendation.monthlySavings
      ) {
        bestRecommendation = {
          tool: ti.tool,
          currentPlan: ti.plan,
          currentMonthlySpend: ti.monthlySpend,
          recommendedAction: "switch_tool",
          recommendedPlan: cheapestAlternative.name,
          monthlySavings: savings,
          reason: `Switch to ${cheapestAlternative.name} ($${cheapestAlternative.monthlyPricePerSeat}/seat) and save $${savings}/month (${Math.round(savingsPercentage * 100)}%). It provides similar functionality for your use case.`,
        };
      }
    }

    // Rule: if team size small and on Team plan, suggest individual plans
    if (
      ti.plan.toLowerCase().includes("team") &&
      ti.seats <= 2 &&
      currentPlan.monthlyPricePerSeat > 0
    ) {
      const individualPlan = toolConfig.plans.find(
        (p) =>
          !p.name.toLowerCase().includes("team") &&
          !p.name.toLowerCase().includes("enterprise") &&
          p.monthlyPricePerSeat > 0 &&
          p.monthlyPricePerSeat < currentPlan.monthlyPricePerSeat,
      );
      if (individualPlan) {
        const savings =
          (currentPlan.monthlyPricePerSeat -
            individualPlan.monthlyPricePerSeat) *
          ti.seats;
        if (savings > bestRecommendation.monthlySavings) {
          bestRecommendation = {
            tool: ti.tool,
            currentPlan: ti.plan,
            currentMonthlySpend: ti.monthlySpend,
            recommendedAction: "switch_plan",
            recommendedPlan: individualPlan.name,
            monthlySavings: savings,
            reason: `With only ${ti.seats} users, a ${individualPlan.name} plan ($${individualPlan.monthlyPricePerSeat}/seat) is sufficient and saves $${savings}/month versus the Team plan.`,
          };
        }
      }
    }

    // Rule: for API-direct tools, suggest credit purchase if spending > $100 (example)
    if (ti.tool === "anthropic-api" || ti.tool === "openai-api") {
      if (ti.monthlySpend > 100) {
        const discountedSpend = ti.monthlySpend * 0.7; // 30% discount
        const savings = ti.monthlySpend - discountedSpend;
        if (savings > bestRecommendation.monthlySavings) {
          bestRecommendation = {
            tool: ti.tool,
            currentPlan: ti.plan,
            currentMonthlySpend: ti.monthlySpend,
            recommendedAction: "buy_credits",
            monthlySavings: savings,
            reason: `You can buy the same API credits from Credex at a 30% discount, saving $${savings}/month on your $${ti.monthlySpend} spend.`,
          };
        }
      }
    }

    findings.push(bestRecommendation);
  }

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
