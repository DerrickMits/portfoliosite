import { NextResponse } from "next/server";
import { createClient } from "@vercel/kv";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Lazy KV init (supports both Vercel KV env var naming conventions) ---
let _kv: ReturnType<typeof createClient> | null = null;
function getKv() {
  const url = process.env.KV_REST_API_URL || process.env.STORAGE_REDIS_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_REDIS_TOKEN;
  if (!url || !token) return null;
  if (!_kv) _kv = createClient({ url, token });
  return _kv;
}

// --- Constants ---
const CALENDLY_TOKEN = process.env.CALENDLY_TOKEN!;
const CALENDLY_USERNAME = "derrickodiwuor";
const CRON_SECRET = process.env.CRON_SECRET || "";
const FIFTEEN_MIN = 15 * 60 * 1000;

// --- Types ---
interface LeadRecord {
  name: string;
  email: string;
  project_details: string;
  submittedAt: string;
  checked: boolean;
  booked: boolean;
}

// --- Calendly helper ---
async function checkCalendlyBooking(email: string): Promise<boolean> {
  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const url = `https://api.calendly.com/scheduled_events?invitee_email=${encodeURIComponent(email)}&min_start_time=${encodeURIComponent(since)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${CALENDLY_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    console.error(`Calendly API error: ${res.status}`);
    return false;
  }
  const data = (await res.json()) as { collection?: unknown[] };
  return Array.isArray(data.collection) && data.collection.length > 0;
}

// --- Email helper ---
async function sendFollowUpEmail(lead: LeadRecord) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    console.log(`[SKIP SMTP] No SMTP configured — skipping follow-up for ${lead.email}`);
    return;
  }
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

// --- KV helper ---
async function getStoredLeads(): Promise<LeadRecord[]> {
  const kv = getKv();
  if (!kv) return [];
  const keys = await kv.keys("consulting:lead:*");
  const leads: LeadRecord[] = [];
  for (const key of keys) {
    const raw = await kv.get(key);
    if (!raw || typeof raw !== "string") continue;
    try {
      leads.push(JSON.parse(raw));
    } catch { /* skip corrupt */ }
  }
  return leads;
}

// --- Route ---
export async function GET(_req: Request) {
  // Parse URL safely (Vercel serverless sometimes passes empty request.url)
  let searchParams: URLSearchParams;
  try {
    const reqUrl = _req.url || "http://localhost/api/consulting/check-booking";
    const url = new URL(reqUrl);
    searchParams = url.searchParams;
  } catch {
    searchParams = new URLSearchParams();
  }

  // Secret guard
  if (CRON_SECRET && searchParams.get("secret") !== CRON_SECRET) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  // Bail early if KV is not configured
  const kv = getKv();
  if (!kv) {
    return NextResponse.json({
      status: "error",
      message: "Vercel KV not configured — set KV_REST_API_URL and KV_REST_API_TOKEN",
    }, { status: 500 });
  }

  if (!CALENDLY_TOKEN) {
    return NextResponse.json({ status: "error", message: "CALENDLY_TOKEN not configured" }, { status: 500 });
  }

  const now = Date.now();
  let checked = 0;
  let followedUp = 0;

  try {
    const leads = await getStoredLeads();

    for (const lead of leads) {
      if (lead.checked) continue;
      if (now - new Date(lead.submittedAt).getTime() < FIFTEEN_MIN) continue;

      checked++;
      let booked = false;
      try {
        booked = await checkCalendlyBooking(lead.email);
      } catch (err) {
        console.error(`Calendly check failed for ${lead.email}:`, err);
      }

      if (!booked) {
        try {
          await sendFollowUpEmail(lead);
          followedUp++;
        } catch (err) {
          console.error(`Follow-up email failed for ${lead.email}:`, err);
        }
      }

      // Mark as processed
      const key = `consulting:lead:${new Date(lead.submittedAt).getTime()}-${encodeURIComponent(lead.email)}`;
      await kv.hset(key, { checked: "1", booked: booked ? "1" : "0" });
    }
  } catch (err) {
    console.error("check-booking error:", err);
  }

  return NextResponse.json({ status: "ok", checked, followedUp, timestamp: new Date().toISOString() });
}
