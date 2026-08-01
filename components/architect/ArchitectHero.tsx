"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

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
    <section
      id="hero"
      className="relative py-24 md:py-32 bg-cream dark:bg-deep overflow-hidden"
    >
      {/* Atmospheric backdrop — restrained, editorial */}
      <div
        aria-hidden
        className="absolute top-1/3 right-1/4 w-[460px] h-[460px] bg-grey-200/40 dark:bg-warm-800/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 flex flex-col items-start gap-8">
        {/* Eyebrow chip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-warm-900 border border-grey-200 dark:border-warm-700 text-xs font-semibold uppercase tracking-[0.18em] text-grey-700 dark:text-grey-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-grey-500 dark:bg-grey-500" />
          Operations & AI Automation Architecture
        </motion.div>

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
          className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto"
        >
          <a
            href="#case-studies"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent text-cream dark:bg-cream dark:text-accent font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            View Case Studies
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="https://calendly.com/derrickodiwuor/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-grey-300 dark:border-warm-700 text-grey-700 dark:text-grey-300 font-medium hover:bg-grey-100 dark:hover:bg-warm-800 transition-all duration-200"
          >
            <Calendar className="w-4 h-4" />
            Schedule a Consultation
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Metrics strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full border-t border-grey-200 dark:border-warm-800 pt-10"
        >
          {metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col gap-1">
              <span className="text-3xl md:text-4xl font-display font-bold text-warm-900 dark:text-cream">
                {metric.value}
              </span>
              <span className="text-sm font-semibold text-grey-700 dark:text-grey-300">
                {metric.label}
              </span>
              <span className="text-sm text-grey-500 dark:text-warm-500">
                {metric.detail}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
