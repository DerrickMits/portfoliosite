"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Zap, ClipboardList, CalendarDays } from "lucide-react";

type Step = 1 | 2 | 3;

type FormData = {
  crmStatus: string;
  aiGoal: string;
  currentTools: string[];
  notes: string;
  name: string;
  email: string;
  hasAccess: boolean;
};

const TOOLS = ["Zapier", "n8n", "OpenAI", "Make.com"];

const ZAPIER_URL = "/api/intake";
const CALENDLY_URL = "https://calendly.com/derrickodiwuor/30min";

const INITIAL_DATA: FormData = {
  crmStatus: "",
  aiGoal: "",
  currentTools: [],
  notes: "",
  name: "",
  email: "",
  hasAccess: false,
};

const STEPS = [
  { num: 1, label: "CRM Status", icon: ClipboardList },
  { num: 2, label: "AI & Workflows", icon: Zap },
  { num: 3, label: "Contact & Logistics", icon: CalendarDays },
] as const;

export function IntakeForm({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (partial: Partial<FormData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  const toggleTool = (tool: string) => {
    setData((prev) => ({
      ...prev,
      currentTools: prev.currentTools.includes(tool)
        ? prev.currentTools.filter((t) => t !== tool)
        : [...prev.currentTools, tool],
    }));
  };

  const canProceed = (): boolean => {
    if (step === 1) return data.crmStatus !== "";
    if (step === 2) return data.aiGoal !== "";
    return data.name.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    setSubmitting(true);
    setError("");

    const payload = {
      ...data,
      currentTools: data.currentTools.length > 0 ? data.currentTools : ["None"],
      submittedAt: new Date().toISOString(),
    };

    // Fire-and-forget: submit to Zapier in the background.
    // Always redirect to Calendly even if the webhook is offline / returns 5xx.
    fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn("Intake webhook failed (non-blocking):", err);
    });

    const calendly = `${CALENDLY_URL}?name=${encodeURIComponent(data.name)}&email=${encodeURIComponent(data.email)}`;
    window.location.replace(calendly);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-6"
      >
        <div className="w-16 h-16 rounded-full bg-[#7A8B7B]/15 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-[#7A8B7B]" />
        </div>
        <h3 className="text-2xl font-display font-bold text-[#1A1A1A] dark:text-cream mb-2">
          Intake submitted
        </h3>
        <p className="text-[#5A5852] dark:text-grey-300 max-w-md mx-auto">
          Redirecting you to schedule your 4-Hour Setup Sprint...
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step progress bar */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                step === s.num
                  ? "bg-[#1A1A1A] text-white dark:bg-warm-100 dark:text-warm-900"
                  : step > s.num
                  ? "bg-[#7A8B7B]/15 text-[#7A8B7B] dark:text-[#9CB09D]"
                  : "bg-[#E5E2D9]/60 text-[#8C7A6B] dark:bg-warm-700 dark:text-grey-400"
              }`}
            >
              <s.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">Step {s.num}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-px transition-colors duration-300 ${
                  step > s.num ? "bg-[#7A8B7B]/40" : "bg-[#E5E2D9]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── STEP 1: CRM Status ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-display font-bold text-[#1A1A1A] dark:text-cream mb-1">
                What is your current CRM setup?
              </h3>
              <p className="text-sm text-[#5A5852] dark:text-grey-300">
                We integrate with existing tools or build your CRM from scratch.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                "GoHighLevel (GHL)",
                "HubSpot or Salesforce",
                "Other CRM",
                "No CRM yet (Need recommendation & setup)",
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => update({ crmStatus: option })}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 text-sm ${
                    data.crmStatus === option
                      ? "border-[#7A8B7B] bg-[#7A8B7B]/8 dark:bg-[#7A8B7B]/15"
                      : "border-[#E5E2D9] dark:border-warm-700 hover:border-[#7A8B7B]/40 bg-white dark:bg-warm-800"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      data.crmStatus === option
                        ? "text-[#1A1A1A] dark:text-cream"
                        : "text-[#5A5852] dark:text-grey-300"
                    }`}
                  >
                    {option}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: AI Automation ── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-display font-bold text-[#1A1A1A] dark:text-cream mb-1">
                AI &amp; Workflow Objectives
              </h3>
              <p className="text-sm text-[#5A5852] dark:text-grey-300">
                Select your primary bottleneck so we hit the ground running.
              </p>
            </div>

            {/* AI Goal radio */}
            <div className="grid gap-3">
              {[
                "AI Lead Nurturing & Intent-Based SMS/Email Replies",
                "Automated Data Extraction & CRM Sync",
                "Custom n8n / Zapier Automation Triggers",
                "Complete CRM Pipeline + Follow-Up Setup",
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => update({ aiGoal: option })}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 text-sm ${
                    data.aiGoal === option
                      ? "border-[#7A8B7B] bg-[#7A8B7B]/8 dark:bg-[#7A8B7B]/15"
                      : "border-[#E5E2D9] dark:border-warm-700 hover:border-[#7A8B7B]/40 bg-white dark:bg-warm-800"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      data.aiGoal === option
                        ? "text-[#1A1A1A] dark:text-cream"
                        : "text-[#5A5852] dark:text-grey-300"
                    }`}
                  >
                    {option}
                  </span>
                </button>
              ))}
            </div>

            {/* Current tools multi-select */}
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-3">
                Current tools (select all that apply)
              </p>
              <div className="flex flex-wrap gap-2">
                {TOOLS.map((tool) => {
                  const active = data.currentTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTool(tool)}
                      className={`px-4 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        active
                          ? "border-[#7A8B7B] bg-[#7A8B7B]/12 text-[#7A8B7B] dark:bg-[#7A8B7B]/20 dark:text-[#9CB09D]"
                          : "border-[#E5E2D9] dark:border-warm-700 text-[#8C7A6B] dark:text-grey-400 hover:border-[#7A8B7B]/40"
                      }`}
                    >
                      {tool}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => update({ currentTools: ["None"] })}
                  className={`px-4 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    data.currentTools.includes("None")
                      ? "border-[#7A8B7B] bg-[#7A8B7B]/12 text-[#7A8B7B] dark:bg-[#7A8B7B]/20 dark:text-[#9CB09D]"
                      : "border-[#E5E2D9] dark:border-warm-700 text-[#8C7A6B] dark:text-grey-400 hover:border-[#7A8B7B]/40"
                  }`}
                >
                  None
                </button>
              </div>
            </div>

            {/* Notes textarea */}
            <div>
              <label
                htmlFor="intake-notes"
                className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-2 block"
              >
                Describe the manual task you want automated{" "}
                <span className="font-normal text-[#8C7A6B] dark:text-grey-500">
                  (Optional)
                </span>
              </label>
              <textarea
                id="intake-notes"
                rows={3}
                value={data.notes}
                onChange={(e) => update({ notes: e.target.value })}
                placeholder="e.g., Manual lead follow-up taking 5+ hours per week..."
                className="w-full bg-white dark:bg-warm-800 border border-[#E5E2D9] dark:border-warm-700 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] dark:text-cream placeholder:text-[#8C7A6B]/60 dark:placeholder:text-grey-500 focus:outline-none focus:border-[#7A8B7B] transition-colors resize-none"
              />
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Contact & Logistics ── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div>
              <h3 className="text-xl font-display font-bold text-[#1A1A1A] dark:text-cream mb-1">
                Where should we send your implementation blueprint?
              </h3>
              <p className="text-sm text-[#5A5852] dark:text-grey-300">
                We&apos;ll send your personalized sprint plan and calendar invite.
              </p>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="intake-name"
                className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-2 block"
              >
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="intake-name"
                type="text"
                value={data.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="Derrick Odiwuor"
                className="w-full bg-white dark:bg-warm-800 border border-[#E5E2D9] dark:border-warm-700 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] dark:text-cream placeholder:text-[#8C7A6B]/60 dark:placeholder:text-grey-500 focus:outline-none focus:border-[#7A8B7B] transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="intake-email"
                className="text-sm font-semibold text-[#1A1A1A] dark:text-cream mb-2 block"
              >
                Work Email <span className="text-red-400">*</span>
              </label>
              <input
                id="intake-email"
                type="email"
                value={data.email}
                onChange={(e) => update({ email: e.target.value })}
                placeholder="you@company.com"
                className="w-full bg-white dark:bg-warm-800 border border-[#E5E2D9] dark:border-warm-700 rounded-xl px-4 py-3 text-sm text-[#1A1A1A] dark:text-cream placeholder:text-[#8C7A6B]/60 dark:placeholder:text-grey-500 focus:outline-none focus:border-[#7A8B7B] transition-colors"
              />
            </div>

            {/* Admin access toggle */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => update({ hasAccess: !data.hasAccess })}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  data.hasAccess
                    ? "bg-[#7A8B7B]"
                    : "bg-[#E5E2D9] dark:bg-warm-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                    data.hasAccess ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </div>
              <span className="text-sm text-[#5A5852] dark:text-grey-300">
                I am ready with admin access / credentials
              </span>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-sm text-red-500 dark:text-red-400 text-center"
        >
          {error}
        </motion.p>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="px-5 py-3 rounded-xl border border-[#E5E2D9] dark:border-warm-700 text-sm font-medium text-[#5A5852] dark:text-grey-300 hover:border-[#7A8B7B]/40 transition-colors"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            disabled={!canProceed()}
            onClick={() => setStep((s) => (s + 1) as Step)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] dark:bg-warm-100 text-white dark:text-warm-900 text-sm font-semibold transition-all hover:bg-[#333] dark:hover:bg-warm-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!canProceed() || submitting}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] dark:bg-warm-100 text-white dark:text-warm-900 text-sm font-semibold transition-all hover:bg-[#333] dark:hover:bg-warm-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white dark:border-warm-900/30 dark:border-t-warm-900 rounded-full" />
                Submitting...
              </>
            ) : (
              <>
                Continue to Select Time
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}