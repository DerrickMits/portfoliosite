"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ClipboardList, Zap, Building2, Upload, X } from "lucide-react";
import { type IntakeFormData } from "@/lib/validation";

type Step = 1 | 2 | 3;

const TOOLS = ["GoHighLevel","HubSpot","Salesforce","Zapier","Make.com","n8n","OpenAI API","Airtable","Notion","Google Sheets","Other","None"];

const STEPS = [
  { num: 1, label: "CRM & Overview", icon: ClipboardList },
  { num: 2, label: "Objectives",    icon: Zap },
  { num: 3, label: "Contact",       icon: Building2 },
] as const;

interface IntakeFormProps {
  onComplete?: () => void;
}

export function IntakeForm({ onComplete }: IntakeFormProps) {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<IntakeFormData>({
    companyName: "", projectScope: "", crmSetup: "" as any,
    primaryBottleneck: "" as any, currentTools: [], manualTaskDescription: "",
    fullName: "", workEmail: "", hasAdminCredentialsReady: false,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const update = (p: Partial<IntakeFormData>) =>
    setData(prev => ({ ...prev, ...p }));

  const toggleTool = (t: string) =>
    setData(p => ({ ...p, currentTools: p.currentTools.includes(t) ? p.currentTools.filter(x => x !== t) : [...p.currentTools, t] }));

  const onFileSelect = useCallback((fl: FileList | null) => {
    if (!fl) return;
    setFiles(prev => [...prev, ...Array.from(fl).filter(f => f.size <= 10 * 1024 * 1024)]);
  }, []);

  const fmtSize = (b: number) => b < 1048576 ? `${(b/1024).toFixed(0)} KB` : `${(b/1048576).toFixed(1)} MB`;

  const ok = (): boolean => {
    if (step === 1) return !!data.companyName.trim() && !!data.projectScope.trim() && !!data.crmSetup;
    if (step === 2) return !!data.primaryBottleneck;
    return !!data.fullName.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.workEmail);
  };

  const submit = async () => {
    if (!ok()) return;
    setSubmitting(true); setError("");
    try {
      const fd = new FormData();
      (Object.keys(data) as Array<keyof IntakeFormData>).forEach(k => {
        const v = data[k];
        if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
        else if (typeof v === "boolean") fd.append(k, String(v));
        else if (v) fd.append(k, v);
      });
      files.forEach(f => fd.append("files", f as Blob));

      const res = await fetch("/api/consulting/submit", { method: "POST", body: fd });
      let body: any = {};
      try { body = await res.json(); } catch { body = {}; }
      if (!res.ok) throw new Error(body.detail ? `${body.message}: ${JSON.stringify(body.detail)}` : body.message || "Submission failed");

      setSubmitted(true);
      setTimeout(() => {
        const url = new URL("https://calendly.com/derrickodiwuor/30min");
        url.searchParams.set("name", data.fullName);
        url.searchParams.set("email", data.workEmail);
        window.location.replace(url.toString());
      }, 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return (
    <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-[#7A8B7B]/15 flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-[#7A8B7B]" />
      </div>
      <h3 className="text-2xl font-display font-bold text-[#1A1A1A] dark:text-cream mb-2">Application received</h3>
      <p className="text-[#5A5852] dark:text-grey-300 max-w-md mx-auto">
        We\'ll review your details and reach out within 24 hours to schedule your Setup Sprint.</p>
    </motion.div>
  );

  const inputCls = "w-full bg-white dark:bg-warm-800 border border-[#E5E2D9] dark:border-warm-700 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] dark:text-cream placeholder:text-[#8C7A6B]/60 dark:placeholder:text-grey-500 focus:outline-none focus:border-[#7A8B7B] transition-colors";
  const radio = (val: string, sel: string) =>
    `w-full text-left px-5 py-4 rounded-xl border transition-all text-sm ${sel === val ? "border-[#7A8B7B] bg-[#7A8B7B]/8 dark:bg-[#7A8B7B]/15" : "border-[#E5E2D9] dark:border-warm-700 hover:border-[#7A8B7B]/40 bg-white dark:bg-warm-800"}`;
  const lbl = (sel: string, v: string) =>
    `font-medium ${sel === v ? "text-[#1A1A1A] dark:text-cream" : "text-[#5A5852] dark:text-grey-300"}`;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step progress */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all ${
              step === s.num ? "bg-[#1A1A1A] text-white dark:bg-warm-100 dark:text-warm-900"
                : step > s.num ? "bg-[#7A8B7B]/15 text-[#7A8B7B]"
                : "bg-[#E5E2D9]/60 text-[#8C7A6B] dark:bg-warm-700 dark:text-grey-400"}`}>
              <s.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">Step {s.num}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-8 h-px ${step > s.num ? "bg-[#7A8B7B]/40" : "bg-[#E5E2D9]"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }} className="space-y-6">
            <div>
              <h3 className="text-xl font-display font-bold text-[#1A1A1A] dark:text-cream mb-1">Tell us about your business</h3>
              <p className="text-sm text-[#5A5852] dark:text-grey-300">A quick overview to tailor the sprint to your needs.</p>
            </div>
            <div>
              <label htmlFor="company-name" className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-2 block">Company Name <span className="text-red-400">*</span></label>
              <input id="company-name" type="text" value={data.companyName} onChange={e => update({ companyName: e.target.value })} placeholder="Acme Inc." className={inputCls} />
            </div>
            <div>
              <label htmlFor="project-scope" className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-2 block">Project Scope <span className="text-red-400">*</span></label>
              <textarea id="project-scope" rows={3} value={data.projectScope} onChange={e => update({ projectScope: e.target.value })} placeholder="Briefly describe what you want to achieve..." className={`${inputCls} resize-none`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-3">Attachments <span className="font-normal text-[#8C7A6B] dark:text-grey-500">(logos, brand guidelines — optional)</span></p>
              <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); onFileSelect(e.dataTransfer.files); }}
                onClick={() => document.getElementById("file-upload")?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${ dragOver ? "border-[#7A8B7B] bg-[#7A8B7B]/5" : "border-[#E5E2D9] dark:border-warm-700 hover:border-[#7A8B7B]/40" }`}>
                <Upload className="w-6 h-6 text-[#8C7A6B] dark:text-grey-400 mx-auto mb-2" />
                <p className="text-sm text-[#5A5852] dark:text-grey-300">Drop files here or <span className="text-[#7A8B7B] font-medium">browse</span></p>
                <p className="text-xs text-[#8C7A6B] dark:text-grey-500 mt-1">Max 10 MB · PNG, JPG, PDF, DOC</p>
                <input id="file-upload" type="file" multiple accept=".png,.jpg,.jpeg,.pdf,.doc,.docx" className="hidden" onChange={e => onFileSelect(e.target.files)} />
              </div>
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#F4F3EE] dark:bg-warm-800 border border-[#E5E2D9] dark:border-warm-700 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Upload className="w-3.5 h-3.5 text-[#7A8B7B] shrink-0" />
                        <span className="text-xs text-[#1A1A1A] dark:text-cream truncate">{f.name}</span>
                        <span className="text-xs text-[#8C7A6B] dark:text-grey-500 shrink-0">{fmtSize(f.size)}</span>
                      </div>
                      <button type="button" onClick={() => setFiles(p => p.filter((_, idx) => idx !== i))} className="text-[#8C7A6B] hover:text-red-500 ml-2"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <fieldset>
              <legend className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-3">CRM Setup <span className="text-red-400">*</span></legend>
              <div className="grid gap-3">
                {["GHL","HubSpot or Salesforce","Other CRM","No CRM yet"].map(o => (
                  <button key={o} type="button" onClick={() => update({ crmSetup: o as any })} className={radio(o, data.crmSetup)}><span className={lbl(o, data.crmSetup)}>{o}</span></button>
                ))}
              </div>
            </fieldset>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }} className="space-y-6">
            <div>
              <h3 className="text-xl font-display font-bold text-[#1A1A1A] dark:text-cream mb-1">AI &amp; Workflow Objectives</h3>
              <p className="text-sm text-[#5A5852] dark:text-grey-300">Select your primary bottleneck so we can hit the ground running.</p>
            </div>
            <fieldset>
              <legend className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-3">Primary Bottleneck <span className="text-red-400">*</span></legend>
              <div className="grid gap-3">
                {["AI Lead Nurturing","Automated Data Extraction","Custom Automation Triggers","Complete Pipeline Setup"].map(o => (
                  <button key={o} type="button" onClick={() => update({ primaryBottleneck: o as any })} className={radio(o, data.primaryBottleneck)}><span className={lbl(o, data.primaryBottleneck)}>{o}</span></button>
                ))}
              </div>
            </fieldset>
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-3">Current Tools <span className="font-normal text-[#8C7A6B] dark:text-grey-500">(select all that apply)</span></p>
              <div className="flex flex-wrap gap-2">
                {TOOLS.map(t => {
                  const on = data.currentTools.includes(t);
                  return (
                    <button key={t} type="button" onClick={() => toggleTool(t)}
                      className={`px-4 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                        on ? "border-[#7A8B7B] bg-[#7A8B7B]/12 text-[#7A8B7B] dark:bg-[#7A8B7B]/20 dark:text-[#9CB09D]"
                           : "border-[#E5E2D9] dark:border-warm-700 text-[#8C7A6B] dark:text-grey-400 hover:border-[#7A8B7B]/40"}`}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label htmlFor="manual" className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-2 block">Describe the manual task you want automated <span className="font-normal text-[#8C7A6B] dark:text-grey-500">(Optional)</span></label>
              <textarea id="manual" rows={3} value={data.manualTaskDescription} onChange={e => update({ manualTaskDescription: e.target.value })} placeholder="e.g., Manual lead follow-up taking 5+ hours per week..." className={`${inputCls} resize-none`} />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .3 }} className="space-y-5">
            <div>
              <h3 className="text-xl font-display font-bold text-[#1A1A1A] dark:text-cream mb-1">Contact &amp; Delivery</h3>
              <p className="text-sm text-[#5A5852] dark:text-grey-300">Where should we send your setup sprint confirmation?</p>
            </div>
            <div>
              <label htmlFor="s3-company" className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-2 block">Company Name <span className="text-red-400">*</span></label>
              <input id="s3-company" type="text" value={data.companyName} onChange={e => update({ companyName: e.target.value })} placeholder="Acme Inc." className={inputCls} />
            </div>
            <div>
              <label htmlFor="full-name" className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-2 block">Full Name <span className="text-red-400">*</span></label>
              <input id="full-name" type="text" value={data.fullName} onChange={e => update({ fullName: e.target.value })} placeholder="Derrick Odiwuor" className={inputCls} />
            </div>
            <div>
              <label htmlFor="work-email" className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-2 block">Work Email <span className="text-red-400">*</span></label>
              <input id="work-email" type="email" value={data.workEmail} onChange={e => update({ workEmail: e.target.value })} placeholder="you@company.com" className={inputCls} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => update({ hasAdminCredentialsReady: !data.hasAdminCredentialsReady })}
                className={`relative w-11 h-6 rounded-full transition-colors ${data.hasAdminCredentialsReady ? "bg-[#7A8B7B]" : "bg-[#E5E2D9] dark:bg-warm-700"}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${data.hasAdminCredentialsReady ? "left-[22px]" : "left-0.5"}`} />
              </div>
              <span className="text-sm text-[#5A5852] dark:text-grey-300">Admin access / credentials are ready</span>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-red-500 dark:text-red-400 text-center">{error}</motion.p>}

      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 1 ? (
          <button type="button" onClick={() => setStep(s => (s - 1) as Step)}
            className="px-5 py-3 rounded-xl border border-[#E5E2D9] dark:border-warm-700 text-sm font-medium text-[#5A5852] dark:text-grey-300 hover:border-[#7A8B7B]/40 transition-colors">← Back</button>
        ) : <div />}
        {step < 3 ? (
          <button type="button" disabled={!ok() || submitting} onClick={() => setStep(s => (s + 1) as Step)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] dark:bg-warm-100 text-white dark:text-warm-900 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#333] transition-all">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button type="button" disabled={!ok() || submitting} onClick={submit}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] dark:bg-warm-100 text-white dark:text-warm-900 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#333] transition-all">
            {submitting ? <>Submitting…</> : <>Submit Application <ChevronRight className="w-4 h-4" /></>}
          </button>
        )}
      </div>
    </div>
  );
}
