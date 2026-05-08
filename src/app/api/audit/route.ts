import { NextResponse } from "next/server";
import { auditInputSchema } from "@/lib/engine/type"; // could be 'types' – match your file name
import { runAudit } from "@/lib/engine/runAudit";
import { createServerSupabase } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { generateSummary } from "@/lib/summary";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = auditInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const auditResult = runAudit(parsed.data);
    const summary = await generateSummary(auditResult);

    const auditId = randomUUID();
    const publicId = randomUUID().split("-")[0];
    const shareToken = randomUUID();

    // Generate AI summary (or fallback)

    const supabase = createServerSupabase();
    const { error } = await supabase.from("audits").insert({
      id: auditId,
      public_id: publicId,
      tools_data: parsed.data.tools,
      savings_summary: {
        totalMonthlySavings: auditResult.totalMonthlySavings,
        totalAnnualSavings: auditResult.totalAnnualSavings,
        findings: auditResult.findings,
        summary: summary, // ← add this
        input: parsed.data,
      },
      summary_text: auditResult.summary || "",
      share_token: shareToken,
      is_public: false,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to store audit" },
        { status: 500 },
      );
    }

    return NextResponse.json({ id: publicId });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
