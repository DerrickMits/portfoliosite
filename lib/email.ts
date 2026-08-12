import nodemailer from "nodemailer";

let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter) {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpUser || !smtpPass) return null;
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: smtpUser, pass: smtpPass },
    });
  }
  return _transporter;
}

export async function sendClientConfirmationEmail(clientId: string, clientName: string, email: string) {
  const transporter = getTransporter();
  if (!transporter) return;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://portfoliosite-pearl-one.vercel.app"}/onboarding/${clientId}`;
  await transporter.sendMail({
    from: `"Derrick Odiwuor" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to: email,
    subject: `Welcome, ${clientName} — your Setup Sprint is being prepared`,
    html: `<p>We've received your application. We'll reach out within 24 hours.</p><p><a href="${url}">View your onboarding portal →</a></p>`,
  });
}

export async function sendAdminNotificationEmail(payload: Record<string, unknown>) {
  const transporter = getTransporter();
  if (!transporter) return;
  await transporter.sendMail({
    from: `"Derrick Odiwuor" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to: process.env.RESEND_ADMIN_EMAIL ?? process.env.SMTP_FROM ?? "derrickodiwuor@gmail.com",
    subject: `🔔 New Consulting Application — ${payload.companyName}`,
    text: `New lead submitted:\n\n${JSON.stringify(payload, null, 2)}`,
  });
}
