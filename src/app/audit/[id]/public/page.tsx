/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getPublicAudit(publicId: string) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("audits")
    .select("savings_summary")
    .eq("public_id", publicId)
    .single();
  if (error || !data) return null;
  return data.savings_summary as any;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getPublicAudit(id);
  if (!result) return { title: "Audit not found" };

  return {
    title: `AI Spend Audit - $${result.totalMonthlySavings}/mo savings found`,
    description: `A startup could save $${result.totalMonthlySavings} per month on AI tools.`,
    openGraph: {
      title: `AI Spend Audit - $${result.totalMonthlySavings}/mo savings`,
      description: `I just ran an audit and found $${result.totalMonthlySavings}/mo in potential savings.`,
      images: [`/api/og?audit=${id}`], // we'll create this later
    },
    twitter: {
      card: "summary_large_image",
      title: `AI Spend Audit - $${result.totalMonthlySavings}/mo savings`,
      description: `I just ran an audit and found $${result.totalMonthlySavings}/mo in potential savings.`,
    },
  };
}

export default async function PublicAuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPublicAudit(id);
  if (!result) return notFound();

  // Strip email/company – already absent in savings_summary. We just show findings and totals.
  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-primary">
          AI Spend Audit
        </h1>
        <p className="text-center text-xl">
          Potential monthly savings:{" "}
          <span className="text-accent font-extrabold">
            ${result.totalMonthlySavings}
          </span>
        </p>
        <div className="grid gap-4">
          {result.findings?.map((finding: any, idx: number) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>
                    {finding.tool} — {finding.currentPlan}
                  </span>
                  <span className="text-accent">
                    ${finding.monthlySavings}/mo
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{finding.reason}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button asChild>
            <Link href="/">Run your own audit</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
