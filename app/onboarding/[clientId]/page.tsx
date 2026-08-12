import { notFound } from "next/navigation";
import { getSupabase, type ClientRow } from "@/lib/supabase";
import { Check, Clock, FileText, ExternalLink, Copy } from "lucide-react";

interface PageProps {
  params: { clientId: string };
}

const NEXT_STEPS = [
  { title: "Review your submission", desc: "We'll review your CRM setup and workflow details within 24 hours.", eta: "Within 24 hours" },
  { title: "Kickoff call scheduled", desc: "You'll receive a calendar invite for your 4-hour implementation sprint.", eta: "Within 24 hours" },
  { title: "System configured", desc: "We build your CRM pipelines, AI automations, and workflow triggers live.", eta: "During your sprint" },
  { title: "Blueprints delivered", desc: "You get full documentation and a recorded walkthrough of your new system.", eta: "End of sprint" },
];

export default async function OnboardingPage({ params }: PageProps) {
  // Fetch client from Supabase
  const { data: client, error } = await (getSupabase() as any)
    .from("clients")
    .select("*")
    .eq("id", params.clientId)
    .single();

  if (error || !client) {
    notFound();
  }

  const c: ClientRow = client as ClientRow;

  const currentStepIndex = c.status === "PENDING" ? 0 : c.status === "IN_PROGRESS" ? 2 : 3;

  return (
    <section className="relative min-h-screen bg-[#FAF8F5] dark:bg-deep py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFECE6] dark:bg-warm-800 border border-[#E0DCD3] dark:border-warm-700 text-xs font-medium text-[#5A5852] dark:text-grey-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#7A8B7B] animate-pulse" />
            Onboarding in Progress
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-[#111111] dark:text-cream mb-4">
            Welcome, {c.full_name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-lg text-[#666460] dark:text-grey-300 max-w-2xl mx-auto">
            Your <strong>{c.company_name}</strong> Setup Sprint application has been received.
            Here's everything you need to know.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Progress + Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Card */}
            <div className="bg-white dark:bg-warm-800 border border-[#E5E2D9] dark:border-warm-700 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#7E7A70] dark:text-grey-500">Application Status</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  c.status === "PENDING" ? "bg-[#7A8B7B]/15 text-[#7A8B7B]"
                  : c.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : c.status === "COMPLETED" ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-50 text-red-500"
                }`}>
                  {c.status}
                </span>
              </div>

              <div className="space-y-0">
                {NEXT_STEPS.map((step, i) => {
                  const isComplete = i < currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isComplete ? "bg-[#7A8B7B] text-white" : isCurrent ? "border-2 border-[#7A8B7B] text-[#7A8B7B]" : "border-2 border-[#E5E2D9] text-[#8C7A6B]"
                        }`}>
                          {isComplete ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                        </div>
                        {i < NEXT_STEPS.length - 1 && <div className={`w-px h-12 ${isComplete ? "bg-[#7A8B7B]" : "bg-[#E5E2D9]"}`} />}
                      </div>
                      <div className={`pb-8 ${i < NEXT_STEPS.length - 1 ? "" : ""}`}>
                        <h3 className={`text-sm font-semibold ${isComplete || isCurrent ? "text-[#1A1A1A] dark:text-cream" : "text-[#8C7A6B]"}`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-[#5A5852] dark:text-grey-300 mt-0.5">{step.desc}</p>
                        <p className="text-xs text-[#8C7A6B] dark:text-grey-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {step.eta}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Application Details */}
            <div className="bg-white dark:bg-warm-800 border border-[#E5E2D9] dark:border-warm-700 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#7E7A70] dark:text-grey-500 mb-6">Application Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Company", value: c.company_name },
                  { label: "Contact", value: c.full_name },
                  { label: "Email", value: c.work_email },
                  { label: "CRM Setup", value: c.crm_setup },
                  { label: "Bottleneck", value: c.primary_bottleneck },
                  { label: "Tools", value: (c.current_tools || []).join(", ") || "—" },
                  { label: "Admin Ready", value: c.has_admin_credentials_ready ? "Yes" : "Not yet" },
                  { label: "Submitted", value: new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                ].map(item => (
                  <div key={item.label} className={item.label === "Project Scope" || item.label === "Manual Task" ? "sm:col-span-2" : ""}>
                    <p className="text-xs font-medium text-[#8C7A6B] dark:text-grey-500 mb-1">{item.label}</p>
                    <p className="text-sm text-[#1A1A1A] dark:text-cream">{item.value}</p>
                  </div>
                ))}
                {c.project_scope && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-[#8C7A6B] dark:text-grey-500 mb-1">Project Scope</p>
                    <p className="text-sm text-[#1A1A1A] dark:text-cream whitespace-pre-wrap">{c.project_scope}</p>
                  </div>
                )}
                {c.manual_task_description && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-[#8C7A6B] dark:text-grey-500 mb-1">Manual Task Description</p>
                    <p className="text-sm text-[#1A1A1A] dark:text-cream whitespace-pre-wrap">{c.manual_task_description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Uploaded Files */}
            {c.file_urls && c.file_urls.length > 0 && (
              <div className="bg-white dark:bg-warm-800 border border-[#E5E2D9] dark:border-warm-700 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#7E7A70] dark:text-grey-500 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Uploaded Files
                </h3>
                <div className="space-y-2">
                  {c.file_urls.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#F4F3EE] dark:bg-warm-900 border border-[#E5E2D9] dark:border-warm-700 text-xs text-[#7A8B7B] hover:text-[#555] transition-colors group">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate flex-1">Attachment {i + 1}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Client ID copy */}
            <div className="bg-white dark:bg-warm-800 border border-[#E5E2D9] dark:border-warm-700 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <p className="text-xs font-medium text-[#8C7A6B] dark:text-grey-500 mb-2">Your Reference ID</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-[#F4F3EE] dark:bg-warm-900 px-3 py-2 rounded-lg text-[#5A5852] dark:text-grey-300 font-mono truncate">
                  {c.id}
                </code>
                <button onClick={() => navigator.clipboard.writeText(c.id)}
                  className="p-2 rounded-lg border border-[#E5E2D9] dark:border-warm-700 text-[#8C7A6B] hover:text-[#7A8B7B] transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-[#8C7A6B] dark:text-grey-500 mt-2">Use this ID when reaching out about your sprint.</p>
            </div>

            {/* Contact CTA */}
            <div className="bg-[#1A1A1A] dark:bg-warm-100 rounded-2xl p-6 text-center">
              <h3 className="text-sm font-semibold text-white dark:text-warm-900 mb-2">Questions before your sprint?</h3>
              <p className="text-xs text-white/60 dark:text-warm-900/60 mb-4">Reply to the confirmation email we sent you, or reach out directly.</p>
              <a href="mailto:derrickodiwuor@gmail.com"
                className="inline-block text-xs font-semibold text-[#7A8B7B] dark:text-[#5A7A6B] hover:underline">
                derrickodiwuor@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#8C7A6B] dark:text-grey-500 mt-16">
          Application ID: <code className="font-mono">{c.id}</code> · Submitted {new Date(c.created_at).toLocaleString()}
        </p>
      </div>
    </section>
  );
}
