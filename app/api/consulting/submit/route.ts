import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { intakeSchema } from "@/lib/validation";
import { sendClientConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "https://portfoliosite-pearl-one.vercel.app";
}

function coerceFormData(rawBody: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...rawBody };

  // Arrays arrive as JSON strings from FormData
  if (typeof out.currentTools === "string") {
    try { out.currentTools = JSON.parse(out.currentTools); } catch { out.currentTools = []; }
  }

  // Booleans arrive as "true"/"false" strings from FormData
  if (typeof out.hasAdminCredentialsReady === "string") {
    out.hasAdminCredentialsReady = out.hasAdminCredentialsReady === "true";
  }

  // Empty optional strings → undefined so Zod optional fields pass
  if (out.manualTaskDescription === "") out.manualTaskDescription = undefined;

  return out;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let rawBody: Record<string, unknown>;
  let files: File[] = [];

  try {
    if (contentType.includes("multipart/form-data")) {
      const fd = await request.formData();
      rawBody = {};
      fd.forEach((v, k) => {
        if (v instanceof File) files.push(v);
        else rawBody[k] = v;
      });
    } else {
      rawBody = await request.json();
    }
  } catch {
    return NextResponse.json({ status: "error", message: "Invalid request" }, { status: 400 });
  }

  // Fix FormData string-coercion issues before Zod validation
  const body = coerceFormData(rawBody);

  const parsed = intakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { status: "error", message: "Validation failed", errors: parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`) },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Upload files using a temp id for the storage path
  const tempId = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const supabaseClient = getSupabase() as any;
  const fileUrls: string[] = [];
  for (const file of files) {
    const path = `client-assets/${tempId}/${Date.now()}-${file.name}`;
    const { error } = await supabaseClient.storage.from("client-assets").upload(path, file, { contentType: file.type });
    if (!error) {
      const { data: urlData } = supabaseClient.storage.from("client-assets").getPublicUrl(path);
      fileUrls.push(urlData.publicUrl);
    }
  }

  // Insert into DB — let Supabase auto-generate the UUID id
  const { data: record, error: dbError } = await (getSupabase() as any)
    .from("clients")
    .insert({
      company_name: data.companyName,
      project_scope: data.projectScope,
      crm_setup: data.crmSetup,
      primary_bottleneck: data.primaryBottleneck,
      current_tools: data.currentTools,
      manual_task_description: data.manualTaskDescription?.trim() || null,
      full_name: data.fullName,
      work_email: data.workEmail,
      has_admin_credentials_ready: data.hasAdminCredentialsReady,
      status: "PENDING",
    })
    .select()
    .single();

  if (dbError || !record) {
    console.error("Supabase insert error:", dbError);
    return NextResponse.json({ status: "error", message: "Failed to save. Try again." }, { status: 500 });
  }

  const clientId = (record as any).id;

  // Send emails (non-blocking)
  const webhookPayload = {
    clientId,
    companyName: data.companyName,
    fullName: data.fullName,
    email: data.workEmail,
    projectScope: data.projectScope,
    crmSetup: data.crmSetup,
    primaryBottleneck: data.primaryBottleneck,
    currentTools: data.currentTools,
    fileUrls,
    submittedAt: new Date().toISOString(),
  };

  sendClientConfirmationEmail(clientId, data.fullName, data.workEmail).catch(() => {});
  sendAdminNotificationEmail(webhookPayload).catch(() => {});

  // Make.com webhook (non-blocking)
  const makeUrl = process.env.MAKE_COM_WEBHOOK_URL;
  if (makeUrl) {
    fetch(makeUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(webhookPayload) }).catch(() => {});
  }

  return NextResponse.json({
    status: "success",
    clientId,
    dashboardUrl: `${getBaseUrl()}/onboarding/${clientId}`,
  });
}
