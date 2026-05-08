import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getAudit(publicId: string) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("public_id", publicId)
    .single();
  if (error || !data) return null;
  return data;
}

export default async function AuditResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) return notFound();

  const result = audit.savings_summary as any;
  const findings: any[] = result.findings || [];
  const totalMonthly = result.totalMonthlySavings;
  const totalAnnual = result.totalAnnualSavings;
  const summary = result.summary || "";

  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">
            Your AI Spend Audit
          </h1>
          <p className="mt-2 text-muted-foreground">
            {totalMonthly > 500
              ? "You could save big. Credex can help."
              : totalMonthly > 0
                ? "Some savings found. See below."
                : "Your AI spend looks efficient. Nice work!"}
          </p>
        </div>

        <div className="grid gap-6">
          {findings.map((finding: any, idx: number) => (
            <Card
              key={idx}
              className={finding.monthlySavings > 0 ? "border-primary/50" : ""}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>
                    {finding.tool} — {finding.currentPlan}
                  </span>
                  <span className="text-sm font-mono text-muted-foreground">
                    {finding.monthlySavings > 0
                      ? `↓ $${finding.monthlySavings}/mo`
                      : "✓ Optimal"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{finding.reason}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        <div className="text-center space-y-4">
          <div className="text-5xl font-extrabold text-primary">
            ${totalMonthly}/mo
          </div>
          <div className="text-xl text-muted-foreground">
            Monthly savings ·{" "}
            <span className="text-accent">${totalAnnual}/year</span>
          </div>
        </div>

        {summary && (
          <Card className="border-accent">
            <CardHeader>
              <CardTitle>Personalized Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{summary}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">Run Another Audit</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
