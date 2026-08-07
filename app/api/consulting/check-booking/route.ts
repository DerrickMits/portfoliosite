import { NextResponse } from "next/server";
import Redis from "ioredis";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Lazy Redis init (ioredis handles redis:// URLs natively) ---
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

interface LeadRecord {
  name: string;
  email: string;
  project_details: string;
  submittedAt: string;
  checked: boolean;
  booked: boolean;
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

async function sendFollowUpEmail(lead: LeadRecord) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) return;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: smtpUser, pass: smtpPass },
  });
  await transporter.sendMail({
    from: `"Derrick Odiwuor" <${smtpFrom}>`,
    to: lead.email,
    subject: `Quick follow-up regarding your project, ${lead.name}`,
    text: `Hi ${lead.name},\n\nI saw you submitted details about '${lead.project_details}' but haven't locked in a time on my calendar yet.\n\nIf you'd still like to chat, feel free to pick a convenient slot here:\nhttps://calendly.com/${CALENDLY_USERNAME}/30min\n\nLooking forward to connecting!\n\nBest regards,\nDerrick Odiwuor`,
  });
}

export async function GET(_req: Request) {
  // --- Auth ---
  let searchParams: URLSearchParams;
  try {
    searchParams = new URL(_req.url).searchParams;
  } catch {
    searchParams = new URLSearchParams();
  }
  if (CRON_SECRET && searchParams.get("secret") !== CRON_SECRET) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  // --- Redis connection test ---
  let connectionError: string | null = null;
  let redis: Redis;
  try {
    redis = getRedis();
    await redis.ping(); // verify connection is alive
  } catch (err) {
    connectionError = err instanceof Error ? err.message : String(err);
    console.error("Redis connection failed:", connectionError);
    return NextResponse.json({
      status: "error",
      message: "Redis connection failed",
      error: connectionError,
      hint: "Check that STORAGE_REDIS_URL is set in Vercel environment variables",
    }, { status: 500 });
  }

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

      // Skip already-processed leads (idempotency guard)
      if (lead.checked) continue;

      // Only process leads between 15 min and 24 hours old
      const ageMs = now - new Date(lead.submittedAt).getTime();
      if (ageMs < FIFTEEN_MIN) continue;
      if (ageMs > 24 * 60 * 60 * 1000) continue;

      checked++;
      let booked = false;
      try { booked = await checkCalendlyBooking(lead.email); }
      catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Calendly check failed for ${lead.email}: ${msg}`);
      }

      if (!booked) {
        try { await sendFollowUpEmail(lead); followedUp++; }
        catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`Follow-up email failed for ${lead.email}: ${msg}`);
        }
      }

      const updated: LeadRecord = { ...lead, checked: true, booked };
      await redis.set(key, JSON.stringify(updated));
    }
  } catch (err) {
    console.error("check-booking error:", err);
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
