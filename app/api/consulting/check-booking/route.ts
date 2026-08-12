import { NextResponse } from "next/server";
import Redis from "ioredis";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let _redis: Redis | null = null;
function getRedis(): Redis {
  if (!_redis) {
    const url = process.env.STORAGE_REDIS_URL;
    if (!url) throw new Error("STORAGE_REDIS_URL not configured");
    _redis = new Redis(url);
  }
  return _redis;
}

const CALENDLY_TOKEN = process.env.CALENDLY_TOKEN ?? "";
const CALENDLY_USERNAME = "derrickodiwuor";
const CRON_SECRET = process.env.CRON_SECRET || "";
const FIFTEEN_MIN = 15 * 60 * 1000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

interface LeadRecord {
  name: string;
  email: string;
  project_details: string;
  submittedAt: string;
  checked: boolean;
  booked: boolean;
  clientId?: string;
}

async function checkCalendlyBooking(email: string): Promise<boolean> {
  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const url = `https://api.calendly.com/scheduled_events?invitee_email=${encodeURIComponent(email)}&min_start_time=${encodeURIComponent(since)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${CALENDLY_TOKEN}`, "Content-Type": "application/json" },
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { collection?: unknown[] };
  return Array.isArray(data.collection) && data.collection.length > 0;
}

async function generateFollowUpWithGemini(lead: LeadRecord): Promise<string> {
  if (!GEMINI_API_KEY) {
    return buildFallbackEmail(lead);
  }

  const prompt = `You are Derrick Odiwuor, an Operations & AI Automation Architect. Write a short, friendly, professional follow-up email.

CONTEXT: ${lead.name} submitted an inquiry about: "${lead.project_details}" but hasn't booked a 30-minute setup sprint consultation yet.

RULES:
- Warm, personal tone — like a real person typing, not a marketing robot
- Reference their project briefly (1 line) to show you actually read it
- Gently remind them to book a slot — no pressure, just helpful
- Include Calendly link: https://calendly.com/derrickodiwuor/30min
- Sign off as Derrick Odiwuor
- Max 150 words
- No generic phrases like "I hope this email finds you well"`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`Gemini error ${res.status}: ${errText}`);
      return buildFallbackEmail(lead);
    }

    const json = await res.json();
    const content = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!content) return buildFallbackEmail(lead);
    return content;
  } catch (err) {
    console.error("Gemini request failed:", err);
    return buildFallbackEmail(lead);
  }
}

function buildFallbackEmail(lead: LeadRecord): string {
  return `Hey ${lead.name.split(" ")[0]},

Just popping in — I saw you submitted details about your project a little while back and wanted to make sure you had a chance to grab a slot.

If the timing still works, here's my calendar: https://calendly.com/${CALENDLY_USERNAME}/30min

No rush at all, just didn't want this to slip through the cracks.

Best,
Derrick Odiwuor`;
}

async function sendFollowUpEmail(lead: LeadRecord) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    console.error("SMTP not configured — skipping email");
    return;
  }
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  const emailBody = await generateFollowUpWithGemini(lead);

  let subject: string;
  let body: string;
  const firstLine = emailBody.split("\n")[0]?.trim() ?? "";
  if (/^(subject|re):/i.test(firstLine)) {
    subject = firstLine.replace(/^(subject|re):\s*/i, "").trim();
    body = emailBody.split("\n").slice(1).join("\n").trim();
  } else {
    subject = `Still interested in your setup sprint, ${lead.name.split(" ")[0]}?`;
    body = emailBody;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from: `"Derrick Odiwuor" <${smtpFrom}>`,
    to: lead.email,
    subject,
    text: body,
  });
}

export async function GET(_req: Request) {
  let searchParams: URLSearchParams;
  try {
    searchParams = new URL(_req.url).searchParams;
  } catch {
    searchParams = new URLSearchParams();
  }

  if (CRON_SECRET && searchParams.get("secret") !== CRON_SECRET) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  const sendReminderOnly = searchParams.get("sendReminderOnly") === "true";

  const missing: string[] = [];
  if (!process.env.STORAGE_REDIS_URL) missing.push("STORAGE_REDIS_URL");
  if (!process.env.SMTP_USER) missing.push("SMTP_USER");
  if (!process.env.SMTP_PASS) missing.push("SMTP_PASS");
  if (!process.env.CALENDLY_TOKEN) missing.push("CALENDLY_TOKEN");
  if (!process.env.GEMINI_API_KEY) missing.push("GEMINI_API_KEY");
  if (missing.length > 0) {
    return NextResponse.json({ status: "error", message: "Missing env vars", missing }, { status: 500 });
  }

  const redis = getRedis();
  const now = Date.now();
  let checked = 0;
  let followedUp = 0;
  let errors: string[] = [];

  try {
    const keys = await redis.keys("consulting:lead:*");
    for (const key of keys) {
      const raw = await redis.get(key);
      if (!raw || typeof raw !== "string") continue;
      let lead: LeadRecord;
      try { lead = JSON.parse(raw); } catch { continue; }
      if (lead.checked) continue;

      const ageMs = now - new Date(lead.submittedAt).getTime();
      if (!sendReminderOnly) {
        if (ageMs < FIFTEEN_MIN) continue;
        if (ageMs > 24 * 60 * 60 * 1000) continue;
      }

      checked++;
      let booked = false;
      if (!sendReminderOnly) {
        try { booked = await checkCalendlyBooking(lead.email); }
        catch (err) { errors.push(`Calendly check failed for ${lead.email}: ${err instanceof Error ? err.message : err}`); }
      }

      if (!booked) {
        try { await sendFollowUpEmail(lead); followedUp++; }
        catch (err) { errors.push(`Email failed for ${lead.email}: ${err instanceof Error ? err.message : err}`); }
      }

      const updated: LeadRecord = { ...lead, checked: true, booked };
      await redis.set(key, JSON.stringify(updated));
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
  }

  return NextResponse.json({
    status: "ok",
    checked,
    followedUp,
    errors: errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString(),
  });
}
