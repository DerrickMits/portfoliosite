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
  if (typeof out.currentTools === "string") {
    try { out.currentTools = JSON.parse(out.currentTools); } catch { out.currentTools = []; }
  }
  if (typeof out.hasAdminCredentialsReady === "string") {
    out.hasAdminCredentialsReady = out.hasAdminCredentialsReady === "true";
  }
  if (out.manualTaskDescription === "") out.manualTaskDescription = undefined;
  return out;
}

export async function POST(request: Request) {
  try {
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
      return NextResponse.json({ status: "error", message: "Invalid request body" }, { status: 400 });
    }

    const body = coerceFormData(rawBody);

    const parsed = intakeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "Validation failed", errors: parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`) },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // Warm up Supabase connection early to fail fast
    let supabaseClient: any;
    try {
      supabaseClient = getSupabase();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Supabase not configured";
      console.error("Supabase init error:", msg);
      return NextResponse.json({ status: "error", message: msg }, { status: 500 });
    }

    // Upload files
    const tempId = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const fileUrls: string[] = [];
    for (const file of files) {
      const path = `client-assets/${tempId}/${Date.now()}-${file.name}`;
      const { error } = await supabaseClient.storage.from("client-assets").upload(path, file, { contentType: file.type });
      if (!error) {
        const { data: urlData } = supabaseClient.storage.from("client-assets").getPublicUrl(path);
        fileUrls.push(urlData.publicUrl);
      }
    }

    // Insert into DB
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
        file_urls: fileUrls,
      })
      .select()
      .single();

    if (dbError || !record) {
      console.error("Supabase insert error:", JSON.stringify(dbError));
      return NextResponse.json(
        { status: "error", message: "Failed to save.", detail: dbError ? { code: dbError.code, message: dbError.message, details: dbError.details, hint: dbError.hint } : "No record" },
        { status: 500 }
      );
    }

    const clientId = record.id;

    // Emails + webhook (non-blocking)
    const webhookPayload = {
      clientId, companyName: data.companyName, fullName: data.fullName,
      email: data.workEmail, projectScope: data.projectScope,
      crmSetup: data.crmSetup, primaryBottleneck: data.primaryBottleneck,
      currentTools: data.currentTools, fileUrls, submittedAt: new Date().toISOString(),
    };
    sendClientConfirmationEmail(clientId, data.fullName, data.workEmail).catch(() => {});
    sendAdminNotificationEmail(webhookPayload).catch(() => {});
    const makeUrl = process.env.MAKE_COM_WEBHOOK_URL;
    if (makeUrl) {
      fetch(makeUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(webhookPayload) }).catch(() => {});
    }

    return NextResponse.json({ status: "success", clientId, dashboardUrl: `${getBaseUrl()}/onboarding/${clientId}` });

  } catch (err) {
    console.error("Submit route unhandled error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ status: "error", message: "Server error.", detail: msg }, { status: 500 });
  }
}
