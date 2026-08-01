import { NextResponse } from "next/server";
import { readFileSync, readdirSync, writeFileSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_DIR = join(process.cwd(), "app/data/pending-leads");
const CALENDLY_TOKEN = process.env.CALENDLY_TOKEN!;
const CALENDLY_USERNAME = "derrickodiwuor";

// Allow unauthenticated access for cron jobs — in production guard with a
// shared secret so only your scheduler can call this.
export async function GET(request: Request) {
  // Optional guard: require ?secret= query param matching env var
  const url = new URL(request.url);
  const cronSecret = url.searchParams.get("secret") || "";
  if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!CALENDLY_TOKEN) {
    return NextResponse.json(
      { status: "error", message: "CALENDLY_TOKEN not configured" },
      { status: 500 },
    );
  }

  try {
    mkdirSync(DATA_DIR, { recursive: true });
  } catch { /* exists */ }

  const now = Date.now();
  const FIFTEEN_MIN = 15 * 60 * 1000;
  let checked = 0;
  let followedUp = 0;

  try {
    const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));

    for (const file of files) {
      const path = join(DATA_DIR, file);
      let lead: StoredLead & { _file: string };
      try {
        lead = { ...JSON.parse(readFileSync(path, "utf-8")), _file: path };
      } catch {
        continue; // skip corrupt files
      }

      // Skip if already checked or not yet 15 minutes old
      const submittedAt = new Date(lead.submittedAt).getTime();
      if (lead.checked || now - submittedAt < FIFTEEN_MIN) continue;

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
      lead.checked = true;
      writeFileSync(path, JSON.stringify(lead));
    }
  } catch (err) {
    console.error("check-booking error:", err);
  }

  return NextResponse.json({
    status: "ok",
    checked,
    followedUp,
    timestamp: new Date().toISOString(),
  });
}

interface StoredLead {
  name: string;
  email: string;
  project_details: string;
  submittedAt: string;
  checked: boolean;
}

async function checkCalendlyBooking(email: string): Promise<boolean> {
  // Query Calendly for events booked by this email in the last 30 min window
  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const res = await fetch(
    `https://api.calendly.com/scheduled_events?invitee_email=${encodeURIComponent(email)}&min_start_time=${encodeURIComponent(since)}`,
    {
      headers: {
        Authorization: `Bearer ${CALENDLY_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    console.error(`Calendly API error: ${res.status} ${res.statusText}`);
    return false;
  }

  const data = await res.json();
  const events = data.collection || [];
  return events.length > 0;
}

async function sendFollowUpEmail(lead: { name: string; email: string; project_details: string }) {
  const { default: nodemailer } = await import("nodemailer");

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

  const subject = `Quick follow-up regarding your project, ${lead.name}`;
  const textBody = `Hi ${lead.name},

I saw you submitted details about '${lead.project_details}' but haven't locked in a time on my calendar yet.

If you'd still like to chat, feel free to pick a convenient slot here:
https://calendly.com/${CALENDLY_USERNAME}/30min

Looking forward to connecting!

Best regards,
Derrick Odiwuor`;

  await transporter.sendMail({
    from: `"Derrick Odiwuor" <${smtpFrom}>`,
    to: lead.email,
    subject,
    text: textBody,
  });
}
