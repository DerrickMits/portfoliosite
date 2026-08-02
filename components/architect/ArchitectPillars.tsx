"use client";

import { motion } from "framer-motion";
import { ClipboardList, Database, Cpu, Check } from "lucide-react";

type Pillar = {
  icon: typeof ClipboardList;
  title: string;
  points: string[];
};

const pillars: Pillar[] = [
  {
    icon: ClipboardList,
    title: "Project Management Expertise",
    points: [
      "End-to-end execution of complex initiatives",
      "Agile & Scrum framework implementation",
      "Cross-functional team leadership",
      "Enterprise tool mastery — Asana & Jira",
    ],
  },
  {
    icon: Database,
    title: "CRM Architecture & Optimization",
    points: [
      "Strategic sales-pipeline design",
      "Large-scale database cleanups & migration",
      "HubSpot & GoHighLevel integrations",
      "Salesforce integration & advanced reporting",
    ],
  },
  {
    icon: Cpu,
    title: "AI Automation Workflows",
    points: [
      "Custom n8n & Zapier logic engines",
      "Multi-agent LLM pipeline development",
      "Lead-capture to CRM automation",
      "Human-in-the-loop autonomous flows",
    ],
  },
];

export default function ArchitectPillars() {
  return (
    <section
      id="services"
      className="relative py-20 md:py-28 bg-white dark:bg-warm-900"
    >
      <div className="z-10 max-w-6xl mx-auto px-6 md:px-8">
{/* Section header */}
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  className="max-w-2xl mx-auto mb-14 text-center"
>
  <p className="text-xs uppercase tracking-[0.22em] font-semibold text-grey-500 dark:text-grey-500 mb-3">
    Core Pillars
  </p>
  <h2 className="text-3xl md:text-4xl font-display font-bold text-warm-900 dark:text-cream leading-tight">
    Three disciplines, one operating system for execution.
  </h2>
</motion.div>

        {/* Pillar grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="group flex flex-col gap-5 bg-cream dark:bg-warm-800 rounded-xl border border-grey-200 dark:border-warm-700 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:premium-shadow hover:border-grey-300 dark:hover:border-warm-600"
            >
              {/* Icon tile */}
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-warm-700 border border-grey-200 dark:border-warm-600 flex items-center justify-center">
                <pillar.icon className="w-5 h-5 text-grey-700 dark:text-grey-300" />
              </div>

              <h3 className="text-xl font-display font-bold text-warm-900 dark:text-cream leading-snug">
                {pillar.title}
              </h3>

              <ul className="space-y-3 text-sm text-grey-700 dark:text-grey-300">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-grey-100 dark:bg-warm-700 border border-grey-300 dark:border-warm-600 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-grey-700 dark:text-grey-300" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
