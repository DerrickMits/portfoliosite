"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, Send, RefreshCw } from "lucide-react";

const codeLines = [
  '{',
  '  "stage": "hot_lead_routed",',
  '  "workflow": "gohighlevel_4stage",',
  '  "handoffs": 0,',
  '  "status": "converted"',
  '}',
];

export default function ArchitectCaseStudy() {
  return (
    <section
      id="case-studies"
      className="relative py-20 md:py-28 bg-cream dark:bg-deep"
    >
      <div className="z-10 max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — narrative */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs uppercase tracking-[0.22em] font-semibold text-grey-500 dark:text-grey-500 mb-3">
                Case Study · Efficiency Redefined
              </p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-warm-900 dark:text-cream leading-tight max-w-xl">
                Scaling lead response and routing with zero manual friction.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-base font-semibold text-warm-900 dark:text-cream mb-1.5">
                  The Challenge
                </h4>
                <p className="text-grey-700 dark:text-grey-300 text-base leading-relaxed">
                  A growing pipeline suffered from inefficient handoffs, delayed
                  lead routing, and inconsistent lead-state tracking across
                  multiple sales and booking stages.
                </p>
              </div>
              <div>
                <h4 className="text-base font-semibold text-warm-900 dark:text-cream mb-1.5">
                  The Strategy
                </h4>
                <p className="text-grey-700 dark:text-grey-300 text-base leading-relaxed">
                  Engineered an automated 4-stage GoHighLevel engine combining
                  custom workflow logic, conditional routing, and business-hour
                  constraints to seamlessly sync leads from nurture to
                  conversion.
                </p>
              </div>
            </motion.div>

            {/* Stat block */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="p-6 rounded-xl border-l-2 border-accent dark:border-cream bg-white dark:bg-warm-800 border border-grey-200 dark:border-warm-700"
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-warm-900 dark:text-cream">
                0%
              </div>
              <p className="text-grey-700 dark:text-grey-300 text-sm mt-1">
                Manual pipeline handoffs needed across all sales stages.
              </p>
            </motion.div>
          </div>

          {/* Right — node-flow visual + code */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative"
          >
            <div className="relative bg-white dark:bg-warm-800 border border-grey-200 dark:border-warm-700 rounded-xl p-8 premium-shadow">
              <div className="flex flex-col gap-6">
{/* Top row — capture → process */}
<div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 p-4 bg-cream dark:bg-warm-900 rounded-lg border border-grey-200 dark:border-warm-700 md:justify-start">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white dark:bg-warm-700 border border-grey-200 dark:border-warm-600 flex items-center justify-center">
                      <Send className="w-4 h-4 text-grey-700 dark:text-grey-300" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-grey-700 dark:text-grey-300">
                      Lead Capture
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-grey-300 dark:text-warm-600" />
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white dark:bg-warm-700 border border-grey-200 dark:border-warm-600 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-grey-700 dark:text-grey-300" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-grey-700 dark:text-grey-300">
                      AI Processing
                    </span>
                  </div>
                </div>

                {/* Connector */}
                <div className="flex justify-center" aria-hidden>
                  <div className="w-px h-10 border-l border-dashed border-grey-300 dark:border-warm-600" />
                </div>

                {/* CRM sync node */}
                <div className="flex justify-center">
                  <div className="flex items-center gap-4 p-4 bg-cream dark:bg-warm-900 rounded-lg border border-grey-200 dark:border-warm-700">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-warm-700 border border-grey-200 dark:border-warm-600 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-grey-700 dark:text-grey-300" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wider text-grey-700 dark:text-grey-300">
                        CRM Sync
                      </span>
                      <span className="text-[11px] text-grey-500 dark:text-warm-500">
                        GoHighLevel Production
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mock terminal — restyled to grey/cream, kept dark for contrast */}
                <div className="mt-2 p-4 rounded-lg bg-grey-900 dark:bg-black text-cream font-mono text-[13px] leading-relaxed overflow-hidden border border-grey-700 dark:border-warm-700">
                  <div className="flex gap-1.5 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-warm-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-warm-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-warm-300" />
                  </div>
                  <pre className="opacity-90">
                    {codeLines.map((line) => (
                      <span key={line} className="block whitespace-pre">
                        {line}
                      </span>
                    ))}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
