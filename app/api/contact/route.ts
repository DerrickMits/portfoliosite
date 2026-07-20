import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function validate(data: Partial<ContactPayload>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) errors.name = "Name is required";
  if (!data.email || !data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email";
  }
  if (!data.subject || !data.subject.trim()) errors.subject = "Subject is required";
  if (!data.message || !data.message.trim()) {
    errors.message = "Message is required";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return errors;
}

export async function POST(request: Request) {
  let body: Partial<ContactPayload>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const errors = validate(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const { name, email, subject, message } = body as ContactPayload;

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const smtpTo = process.env.SMTP_TO || smtpUser;

  if (!smtpUser || !smtpPass) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Email service is not configured. Please set SMTP_USER and SMTP_PASS environment variables.",
      },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const textBody = [
    `New message from your portfolio contact form`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    ``,
    `Message:`,
    `${message}`,
    ``,
    `---`,
    `Sent: ${new Date().toISOString()}`,
  ].join("\n");

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #FDFBF7;">
      <div style="background-color: #ffffff; border: 1px solid #E7E5E4; border-radius: 12px; padding: 32px;">
        <h1 style="margin: 0 0 24px 0; color: #1C1917; font-size: 22px; font-weight: 700;">New Contact Form Message</h1>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #78716C; width: 80px; vertical-align: top; white-space: nowrap;">Name:</td>
            <td style="padding: 8px 0 8px 12px; color: #1C1917; font-weight: 600;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716C; width: 80px; vertical-align: top; white-space: nowrap;">Email:</td>
            <td style="padding: 8px 0 8px 12px;"><a href="mailto:${escapeHtml(email)}" style="color: #1C1917; text-decoration: underline;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716C; width: 80px; vertical-align: top; white-space: nowrap;">Subject:</td>
            <td style="padding: 8px 0 8px 12px; color: #1C1917; font-weight: 600;">${escapeHtml(subject)}</td>
          </tr>
        </table>

        <div style="background-color: #F5F5F4; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; color: #78716C; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
          <p style="margin: 0; color: #44403C; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>

        <p style="margin: 0; color: #78716C; font-size: 12px;">Sent from your portfolio site &bull; ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${escapeHtml(name)} (Portfolio)" <${smtpFrom}>`,
      to: smtpTo,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({ ok: true, message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to send email. Please try again or email derrickodiwuor@gmail.com directly.",
      },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  const AMP = String.fromCharCode(38); // &
  return str
    .replace(/&/g, AMP + "amp;")
    .replace(/</g, AMP + "lt;")
    .replace(/>/g, AMP + "gt;")
    .replace(/"/g, AMP + "quot;")
    .replace(/'/g, AMP + "#039;");
}