"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Leaf } from "lucide-react";
import { FlowButton } from "@/components/ui/flow-button";

const metrics = [
  {
    value: "+35%",
    label: "Executive Focus Time",
    detail: "Recovered through calendar realignment",
  },
  {
    value: "20%",
    label: "Receivables Reduction",
    detail: "Outstanding receivables decreased",
  },
  {
    value: "95%",
    label: "On-Time Delivery",
    detail: "Cross-functional project workstreams",
  },
];

export default function ArchitectHero() {
  return (
    <>
      {/* ── Consulting page title — matches the Ledger/Resources header pattern ── */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 pb-8 sm:pb-10 bg-cream dark:bg-deep">
        <div
          aria-hidden
          className="absolute top-1/4 right-1/4 w-[420px] h-[420px] bg-grey-200/40 dark:bg-warm-800/20 rounded-full blur-3xl pointer-events-none"
        />
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 text-center">
          {/* Eyebrow chip with leaf icon */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-warm-900 border border-grey-200 dark:border-warm-800 text-xs font-medium text-warm-600 dark:text-warm-400 mb-7"
          >
            <Leaf className="w-3.5 h-3.5 text-[#7A8B7B] dark:text-warm-300" strokeWidth={2} />
            Operations & AI Automation Architecture
          </motion.div>

          {/* Page title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-warm-900 dark:text-warm-100 leading-[1.05]"
          >
            Consulting
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-warm-600 dark:text-warm-400"
          >
            Executive operations, CRM architecture, and AI automation systems
            engineered to help cross-functional teams scale without the friction
            of manual overhead.
          </motion.p>
        </div>
      </section>

      {/* ── Main hero (existing) ── */}
      <section
        id="hero"
        className="relative py-20 md:py-28 bg-cream dark:bg-deep overflow-hidden"
      >
        {/* Atmospheric backdrop — restrained, editorial */}
        <div
          aria-hidden
          className="absolute top-1/3 right-1/4 w-[460px] h-[460px] bg-grey-200/40 dark:bg-warm-800/20 rounded-full blur-3xl pointer-events-none"
        />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 flex flex-col items-center gap-8 text-center">
        {/* Display headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display font-bold text-warm-900 dark:text-cream tracking-tight leading-[1.08] text-4xl sm:text-5xl md:text-6xl max-w-4xl"
        >
          Driving organizational efficiency through PM precision, CRM
          architecture, and AI workflows.
        </motion.h1>

        {/* Summary */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="text-lg md:text-xl text-grey-700 dark:text-grey-300 leading-relaxed max-w-2xl"
        >
          I synthesize high-level project-management frameworks with modern AI
          logic. By optimizing CRM architecture and deploying autonomous
          workflows, I help cross-functional teams scale without the friction of
          manual overhead.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto items-center justify-center"
        >
          <FlowButton
            text="View Case Studies"
            onClick={() => {
              const el = document.getElementById("case-studies");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />
          <FlowButton
            text="Schedule a Consultation"
            href="https://calendly.com/derrickodiwuor/30min"
            target="_blank"
            rel="noopener noreferrer"
          />
        </motion.div>

        {/* Metrics strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full border-t border-grey-200 dark:border-warm-800 pt-10"
        >
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl md:text-4xl font-display font-bold text-warm-900 dark:text-cream">
                {metric.value}
              </span>
              <span className="text-sm font-semibold text-grey-700 dark:text-grey-300">
                {metric.label}
              </span>
              <span className="text-sm text-grey-500 dark:text-warm-500 text-center max-w-xs">
                {metric.detail}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
    </>
  );
}
