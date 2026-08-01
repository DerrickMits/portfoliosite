import { NextResponse } from "next/server";
import { writeFileSync, mkdirSync, readdirSync, readFileSync, unlinkSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface LeadPayload {
  name: string;
  email: string;
  project_details: string;
}

interface StoredLead extends LeadPayload {
  submittedAt: string; // ISO timestamp
  booked: boolean;
}

const DATA_DIR = join(process.cwd(), "app", "data", "pending-leads");
const CALENDLY_USERNAME = "derrickodiwuor";
const CALENDLY_EVENT = "30min";
const CALENDLY_REDIRECT_BASE = `https://calendly.com/${CALENDLY_USERNAME}/${CALENDLY_EVENT}`;

function ensureDir() {
  try { mkdirSync(DATA_DIR, { recursive: true }); } catch { /* exists */ }
}

function saveLead(lead: StoredLead) {
  ensureDir();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const file = join(DATA_DIR, `${id}.json`);
  writeFileSync(file, JSON.stringify(lead));
  return file;
}

function getAllLeads(): StoredLead[] {
  try {
    ensureDir();
    return readdirSync(DATA_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(readFileSync(join(DATA_DIR, f), "utf-8")) as StoredLead);
  } catch {
    return [];
  }
}

function markBooked(email: string) {
  const leads = getAllLeads();
  for (const lead of leads) {
    if (lead.email === email && !lead.booked) {
      lead.booked = true;
      writeFileSync(join(DATA_DIR, `${lead.submittedAt}-${Buffer.from(lead.email).toString("hex").slice(0, 8)}.json`), JSON.stringify(lead));
    }
  }
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

  // Build Calendly redirect URL with pre-filled lead data
  const calendlyUrl = new URL(CALENDLY_REDIRECT_BASE);
  calendlyUrl.searchParams.set("name", name.trim());
  calendlyUrl.searchParams.set("email", email.trim());
  calendlyUrl.searchParams.set("redirect", "https://portfoliosite.vercel.app/architect");

  // Store the lead for the 15-min follow-up check
  const lead: StoredLead = {
    name: name.trim(),
    email: email.trim(),
    project_details: project_details.trim(),
    submittedAt: new Date().toISOString(),
    booked: false,
  };
  saveLead(lead);

  // Return Calendly redirect URL
  return NextResponse.json({
    status: "success",
    redirectUrl: calendlyUrl.toString(),
  }, { status: 200 });
}

// GET endpoint — called by cron or manually to check pending leads
// and send follow-up emails to those who haven't booked within 15 min
export async function GET() {
  const token = process.env.CALENDLY_TOKEN;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser || "derrickodiwuor@gmail.com";

  if (!token) {
    return NextResponse.json(
      { status: "error", message: "CALENDLY_TOKEN not configured" },
      { status: 500 },
    );
  }

  const now = new Date();
  const fifteenMinAgo = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
  const leads = getAllLeads().filter(
    (l) => !l.booked && l.submittedAt <= fifteenMinAgo,
  );

  if (leads.length === 0) {
    return NextResponse.json({ status: "ok", checked: 0, followedUp: 0 });
  }

  // For each pending lead, check Calendly for a booking
  let followedUp = 0;
  for (const lead of leads) {
    try {
      const booked = await checkCalendlyBooking(lead.email, token);
      if (!booked) {
        // No booking found — send follow-up email via Gmail
        await sendFollowUpEmail(lead, smtpUser, smtpPass, smtpFrom);
        markBooked(lead.email);
        followedUp++;
      }
    } catch (err) {
      console.error(`Follow-up check failed for ${lead.email}:`, err);
    }
  }

  return NextResponse.json({ status: "ok", checked: leads.length, followedUp });
}

async function checkCalendlyBooking(email: string, token: string): Promise<boolean> {
  // Query Calendly API for scheduled events for this email
  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString(); // last 30 min window
  const res = await fetch(
    `https://api.calendly.com/scheduled_events?invitee_email=${encodeURIComponent(email)}&min_start_time=${encodeURIComponent(since)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) return false;

  const data = await res.json();
  const events = data.collection || [];
  return events.length > 0;
}

async function sendFollowUpEmail(
  lead: { name: string; email: string; project_details: string },
  smtpUser: string | undefined,
  smtpPass: string | undefined,
  smtpFrom: string,
) {
  // Skip if SMTP not configured (Calendly-only mode)
  if (!smtpUser || !smtpPass) {
    console.log(`[SKIP SMTP] Follow-up for ${lead.email} — SMTP not configured`);
    return;
  }

  const { default: nodemailer } = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: smtpUser, pass: smtpPass },
  });

  const subject = `Quick follow-up regarding your project, ${lead.name}`;
  const body = `Hi ${lead.name},

I saw you submitted details about '${lead.project_details}' but haven't locked in a time on my calendar yet.

If you'd still like to chat, feel free to pick a convenient slot here:
https://calendly.com/derrickodiwuor/30min

Looking forward to connecting!

Best regards,
Derrick Odiwuor`;

  await transporter.sendMail({
    from: `"Derrick Odiwuor" <${smtpFrom}>`,
    to: lead.email,
    subject,
    text: body,
  });
}
