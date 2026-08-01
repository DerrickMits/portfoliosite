import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@vercel/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- KV client ---
const kv = createClient({
  url: process.env.KV_REST_API_URL ?? "",
  token: process.env.KV_REST_API_TOKEN ?? "",
});

// --- Constants ---
const CALENDLY_TOKEN = process.env.CALENDLY_TOKEN!;
const CALENDLY_USERNAME = "derrickodiwuor";
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

// --- Helpers ---
async function kvGetString(key: string): Promise<string | null> {
  const val = await kv.get(key);
  return typeof val === "string" ? val : null;
}

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
    console.error(`Calendly API ${res.status}`);
    return false;
  }
  const data = (await res.json()) as { collection?: unknown[] };
  return Array.isArray(data.collection) && data.collection.length > 0;
}

async function sendFollowUpEmail(lead: LeadRecord) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    console.log(`[SKIP SMTP] ${lead.email}`);
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

// --- Route ---
export async function GET(_req: Request) {
  const reqUrl = _req.url || new URL("/api/consulting/check-booking", "http://localhost").toString();
  const url = new URL(reqUrl, "http://localhost");
  if (process.env.CRON_SECRET && url.searchParams.get("secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  if (!CALENDLY_TOKEN) {
    return NextResponse.json({ status: "error", message: "CALENDLY_TOKEN missing" }, { status: 500 });
  }

  const now = Date.now();
  let checked = 0;
  let followedUp = 0;

  try {
    const keys = await kv.keys("consulting:lead:*");

    for (const key of keys) {
      const raw = await kvGetString(key);
      if (!raw) continue;

      let lead: LeadRecord;
      try {
        lead = JSON.parse(raw);
      } catch {
        continue;
      }

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
          console.error(`Follow-up failed for ${lead.email}:`, err);
        }
      }

      await kv.hset(key, { checked: "1", booked: booked ? "1" : "0" });
    }
  } catch (err) {
    console.error("check-booking error:", err);
  }

  return NextResponse.json({ status: "ok", checked, followedUp, timestamp: new Date().toISOString() });
}
