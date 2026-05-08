import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
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
    const { error } = await supabase.from("leads").insert({
      id: randomUUID(),
      audit_id,
      email,
      company: company || null,
      role: role || null,
      team_size: team_size || null,
    });

    // inside the POST handler, right after the insert:
    await sendConfirmationEmail(
      email,
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/audit/${audit_id}`,
    );

    if (error) {
      console.error("Lead insert error:", error);
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 },
      );
    }

    // TODO: send transactional email via Resend (we'll add later)

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
