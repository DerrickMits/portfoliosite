import { NextResponse } from "next/server";
import { createClient } from "@vercel/kv";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Lazy KV init (convert redis:// to https:// for Upstash client) ---
let _kv: ReturnType<typeof createClient> | null = null;
function getKv() {
  const envUrl = process.env.STORAGE_REDIS_URL;
  if (!envUrl) return null;
  let redisUrl = envUrl;
  if (redisUrl.startsWith("redis://")) {
    redisUrl = "https://" + redisUrl.slice(8);
  }
  if (!_kv) {
    let token = "";
    try { token = new URL(redisUrl).password ?? ""; } catch { /* use empty token */ }
    _kv = createClient({ url: redisUrl, token });
  }
  return _kv;
}

const CALENDLY_URL = "https://calendly.com/derrickodiwuor/30min";

interface LeadPayload {
  name: string;
  email: string;
  project_details: string;
}

async function sendNotificationEmail(lead: { name: string; email: string; project_details: string }) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  if (!smtpUser || !smtpPass) return false;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from: `"Consulting Form" <${smtpFrom}>`,
    to: smtpFrom,
    replyTo: lead.email,
    subject: `New Consulting Inquiry — ${lead.name}`,
    text: `New lead from consulting page:\n\nName: ${lead.name}\nEmail: ${lead.email}\nProject Details: ${lead.project_details}\n\nSubmitted: ${new Date().toLocaleString()}`,
  });
  return true;
}

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "error", message: "Invalid request body" }, { status: 400 });
  }

  const { name, email, project_details } = body;
  if (!name?.trim() || !email?.trim() || !project_details?.trim()) {
    return NextResponse.json({ status: "error", message: "All fields are required" }, { status: 422 });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedDetails = project_details.trim();
  const timestamp = new Date().toISOString();

  let emailSent = false;
  try {
    emailSent = await sendNotificationEmail({ name: trimmedName, email: trimmedEmail, project_details: trimmedDetails });
  } catch (err) {
    console.error("Failed to send notification email:", err);
  }

  const kv = getKv();
  if (kv) {
    try {
      const key = `consulting:lead:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      await kv.zadd("consulting:leads:by:time", { score: Date.now(), member: key });
      await kv.set(key, JSON.stringify({
        name: trimmedName, email: trimmedEmail, project_details: trimmedDetails,
        submittedAt: timestamp, checked: false, booked: false,
      }));
    } catch (err) {
      console.error("Failed to save lead to KV:", err);
    }
  }

  const calendlyUrl = new URL(CALENDLY_URL);
  calendlyUrl.searchParams.set("name", trimmedName);
  calendlyUrl.searchParams.set("email", trimmedEmail);

  return NextResponse.json({
    status: "success",
    message: emailSent ? "Email sent + redirecting to Calendly" : "Redirecting to Calendly",
    redirectUrl: calendlyUrl.toString(),
    emailSent,
  }, { status: 200 });
}
