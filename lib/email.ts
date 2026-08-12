import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend && process.env.RESEND_API_KEY) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export async function sendClientConfirmationEmail(clientId: string, clientName: string, email: string) {
  const client = getResend();
  if (!client) return;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/${clientId}`;
  await client.emails.send({
    from: "Derrick Odiwuor <onboarding@derrickodiwuor.com>",
    to: email,
    subject: `Welcome, ${clientName} — your Setup Sprint is being prepared`,
    html: `<p>We've received your application. We'll reach out within 24 hours.</p><p><a href="${url}">View your onboarding portal →</a></p>`,
  });
}

export async function sendAdminNotificationEmail(payload: Record<string, unknown>) {
  const client = getResend();
  if (!client) return;
  await client.emails.send({
    from: "Derrick Odiwuor <onboarding@derrickodiwuor.com>",
    to: process.env.RESEND_ADMIN_EMAIL ?? "derrickodiwuor@gmail.com",
    subject: `🔔 New Consulting Application — ${payload.companyName}`,
    html: `<pre>${JSON.stringify(payload, null, 2)}</pre>`,
  });
}
