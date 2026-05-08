import { z } from "zod";

export const toolInputSchema = z.object({
  tool: z.string(),
  enabled: z.boolean().default(false),
  plan: z.string().optional(),
  monthlySpend: z.number().min(0).default(0),
  seats: z.number().int().min(1).default(1),
});

export const auditInputSchema = z.object({
  tools: z.array(toolInputSchema).min(1),
  teamSize: z.number().int().min(1).default(1),
  useCase: z
    .enum(["coding", "writing", "data", "research", "mixed"])
    .default("coding"),
});

export type AuditInput = z.infer<typeof auditInputSchema>;

export interface Finding {
  tool: string;
  currentPlan: string;
  currentMonthlySpend: number;
  recommendedPlan?: string;
  recommendedAction: "switch_plan" | "switch_tool" | "buy_credits" | "stay";
  monthlySavings: number;
  reason: string;
}

export interface AuditResult {
  findings: Finding[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  summary?: string;
}
