import { Resend } from "resend";

export async function sendConfirmationEmail(to: string, auditUrl: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.log(`[DEV EMAIL] To: ${to}, URL: ${auditUrl}`);
    return;
  }

  const resend = new Resend(resendApiKey);
  try {
    const response = await resend.emails.send({
      from: "Credex Audit <onboarding@resend.dev>",
      to,
      subject: "Your AI Spend Audit Report",
      html: `
        <h1>Your AI Spend Audit</h1>
        <p>Thanks for using our free audit tool. You can view your results anytime:</p>
        <a href="${auditUrl}" style="display:inline-block;padding:10px 20px;background:#10B981;color:white;text-decoration:none;border-radius:5px;">View Report</a>
        <p>If you have significant savings opportunities, our team will reach out to discuss discounted credits.</p>
      `,
    });
    if ("id" in response) {
      console.log("Email sent! Resend ID:", response.id);
    } else {
      console.log("Email sent! Response:", response);
    }
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
