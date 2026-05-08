import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AuditResultsClient } from "@/components/audit-result-client"; // plural 'results'

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

  return <AuditResultsClient audit={audit} id={audit.id} />;
}
