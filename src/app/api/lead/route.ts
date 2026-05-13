import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { audit_id, email, company, role, team_size } = body;

    if (!email || !audit_id) {
      return NextResponse.json(
        { error: "Email and audit_id are required" },
        { status: 400 },
      );
    }

    const supabase = createServerSupabase();

    // First, get the public_id from the audits table using the UUID
    const { data: audit, error: auditError } = await supabase
      .from("audits")
      .select("public_id")
      .eq("id", audit_id)
      .single();

    if (auditError || !audit) {
      console.error("Audit not found:", auditError);
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    // Insert the lead
    const { error } = await supabase.from("leads").insert({
      audit_id,
      email,
      company: company || null,
      role: role || null,
      team_size: team_size || null,
    });

    if (error) {
      console.error("Lead insert error:", error);
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 },
      );
    }

    // Send email with the correct public_id
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    await sendConfirmationEmail(email, `${siteUrl}/audit/${audit.public_id}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
