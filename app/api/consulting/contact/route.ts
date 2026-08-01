import { NextResponse } from "next/server";
import { createClient } from "@vercel/kv";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const kv = createClient({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
});

interface LeadPayload {
  name: string;
  email: string;
  project_details: string;
}

export async function POST(request: Request) {
  let body: LeadPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Invalid request body" },
      { status: 400 },
    );
  }

  const { name, email, project_details } = body;

  if (!name?.trim() || !email?.trim() || !project_details?.trim()) {
    return NextResponse.json(
      { status: "error", message: "All fields are required" },
      { status: 422 },
    );
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedDetails = project_details.trim();
  const timestamp = new Date().toISOString();

  // Store lead in Vercel KV (persistent across serverless invocations)
  const leadKey = `consulting:lead:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const leadData = {
    name: trimmedName,
    email: trimmedEmail,
    project_details: trimmedDetails,
    submittedAt: timestamp,
    checked: false,
    booked: false,
  };

  // Add to sorted set (by submission timestamp) + store the lead record
  await kv.zadd("consulting:leads:by:time", {
    score: Date.now(),
    member: leadKey,
  });
  await kv.set(leadKey, JSON.stringify(leadData));

  // Send notification email to Derrick's inbox (runs in parallel with redirect)
  let emailSent = false;
  try {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"Consulting Form" <${smtpFrom}>`,
        to: smtpFrom,
        replyTo: trimmedEmail,
        subject: `New Consulting Inquiry — ${trimmedName}`,
        text: `New lead from consulting page:\n\nName: ${trimmedName}\nEmail: ${trimmedEmail}\nProject Details: ${trimmedDetails}\n\nSubmitted: ${new Date().toLocaleString()}`,
      });
      emailSent = true;
    }
  } catch (err) {
    console.error("Failed to send notification email:", err);
  }

  // Build pre-filled Calendly URL
  const calendlyUrl = new URL("https://calendly.com/derrickodiwuor/30min");
  calendlyUrl.searchParams.set("name", trimmedName);
  calendlyUrl.searchParams.set("email", trimmedEmail);

  return NextResponse.json({
    status: "success",
    message: emailSent ? "Email sent + redirecting to Calendly" : "Redirecting to Calendly",
    redirectUrl: calendlyUrl.toString(),
    emailSent,
  }, { status: 200 });
}
