import { NextResponse } from "next/server";
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface LeadPayload {
  name: string;
  email: string;
  project_details: string;
}

interface StoredLead extends LeadPayload {
  submittedAt: string;
  checked: boolean;
}

const DATA_DIR = join(process.cwd(), "app/data/pending-leads");
const CALENDLY_URL = "https://calendly.com/derrickodiwuor/30min";

function ensureDir() {
  try { mkdirSync(DATA_DIR, { recursive: true }); } catch { /* exists */ }
}

function saveLead(lead: StoredLead) {
  ensureDir();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const file = join(DATA_DIR, `${id}.json`);
  writeFileSync(file, JSON.stringify(lead));
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

  // Save the lead for 15-min follow-up check
  const lead: StoredLead = {
    name: name.trim(),
    email: email.trim(),
    project_details: project_details.trim(),
    submittedAt: new Date().toISOString(),
    checked: false,
  };
  saveLead(lead);

  // Build pre-filled Calendly URL
  const calendlyUrl = new URL(CALENDLY_URL);
  calendlyUrl.searchParams.set("name", name.trim());
  calendlyUrl.searchParams.set("email", email.trim());

  return NextResponse.json({
    status: "success",
    message: "Lead saved — redirecting to Calendly",
    redirectUrl: calendlyUrl.toString(),
  }, { status: 200 });
}
