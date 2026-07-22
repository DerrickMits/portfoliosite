"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Project } from "@/lib/types";

const LEDGER_BASE =
  "https://theledger.yourdomain.com/articles/high-performance-gohighlevel-workflows";

const projects: Project[] = [
  {
    title: "Executive Calendar & Workflow Automation Pipeline",
    description:
      "Designed proactive triaging protocols and calendar management frameworks for executive leadership.",
    tools: ["Asana", "Google Workspace", "Process Engineering"],
    outcome:
      "Cut daily operational interruptions by 50% and saved 35% focus time.",
  },
  {
    title: "Automated Collections & Debt Reduction Workflow",
    description:
      "Standardized automated client payment reminders and scheduling trackers.",
    tools: ["Smartsheet", "Salesforce", "HubSpot", "Advanced Excel"],
    outcome:
      "Reduced bad debt and outstanding receivables by 20% across 120 accounts.",
  },
  {
    title: "Campaign ROI & Performance Visualization Dashboard",
    description:
      "Built analytics dashboards and data extraction models for marketing performance.",
    tools: ["Python", "Tableau", "Jira", "Power BI"],
    outcome:
      "Cut reporting duration by 30% and increased campaign ROI by 12%.",
  },
  {
    title: "GoHighLevel Multi-Stage Sales Automation Engine",
    description:
      "Designed and configured an automated 4-stage lead nurture, appointment booking, and hot-lead routing funnel with business hour constraints and conditional logic.",
    tools: ["GoHighLevel", "CRM Automation", "Workflow Engineering", "Lead Routing"],
    outcome:
      "Eliminated manual pipeline handoffs and achieved native lead-state syncing across nurture, booking, and hot-lead routing stages.",
    link: LEDGER_BASE,
    ctaText: "Read Workflow Breakdown",
  },
  {
    title: "Automated Appointment & No-Show Recovery Pipeline",
    description:
      "Built dynamic calendar triggers, mobile push redirects, snapshot template integrations, and automated re-engagement workflows for missed client meetings.",
    tools: [
      "GoHighLevel",
      "Calendar Routing",
      "Pipeline Management",
      "No-Show Recovery",
    ],
    outcome:
      "Recovered missed meetings via timed re-engagement sequences and synced push alerts to operators within seconds of a no-show event.",
    link: `${LEDGER_BASE}#workflow-3-appointment-booking-confirmation`,
    ctaText: "View Technical Guide",
  },
];

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative py-20 md:py-28 bg-cream dark:bg-deep"
    >
      <div className="z-10 max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.2em] font-semibold text-warm-500 dark:text-warm-400 mb-4">
            Key Case Studies
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-warm-900 dark:text-warm-100">
            Featured Projects
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) =>
            project.link ? (
              <ClickableProjectCard
                key={project.title}
                project={project}
                index={index}
              />
            ) : (
              <StaticProjectCard
                key={project.title}
                project={project}
                index={index}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Clickable Card — links out to The Ledger article            */
/* ─────────────────────────────────────────────────────────── */
function ClickableProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex flex-col justify-between bg-white dark:bg-warm-900 rounded-2xl border border-warm-200 dark:border-warm-800 p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-warm-400 dark:hover:border-warm-600 hover:-translate-y-1 transition-all duration-300 min-h-[44px]"
    >
      {/* Header: Number badge + Ledger tag */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-xs font-medium text-warm-500 dark:text-warm-400 flex items-center gap-1">
            The Ledger Article
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>

        <h3 className="text-lg font-display font-bold text-warm-900 dark:text-warm-100 mb-2 leading-snug group-hover:text-warm-700 dark:group-hover:text-warm-300 transition-colors">
          {project.title}
        </h3>

        <p className="text-warm-600 dark:text-warm-300 text-sm leading-relaxed mb-6">
          {project.description}
        </p>
      </div>

      {/* Footer: Tags + CTA */}
      <div>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tools.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-400 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-warm-100 dark:border-warm-800">
          <p className="text-xs uppercase tracking-wide text-warm-500 dark:text-warm-400 mb-1">
            Key Outcome
          </p>
          <p className="text-sm font-semibold text-warm-800 dark:text-warm-200 leading-relaxed mb-4">
            {project.outcome}
          </p>

          {/* CTA Button */}
          <div className="inline-flex items-center gap-2 text-sm font-medium text-warm-900 dark:text-warm-100 group-hover:text-warm-700 dark:group-hover:text-warm-300 transition-colors min-h-[44px]">
            {project.ctaText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </motion.a>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Static Card — existing layout for cards without a link      */
/* ─────────────────────────────────────────────────────────── */
function StaticProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-white dark:bg-warm-900 rounded-2xl border border-warm-200 dark:border-warm-800 p-6 md:p-8 hover:shadow-xl hover:border-warm-300 dark:hover:border-warm-700 transition-all duration-300"
    >
      {/* Gradient placeholder visual */}
      <div className="w-full h-36 md:h-40 rounded-xl mb-5 overflow-hidden bg-gradient-to-br from-warm-200 via-warm-300 to-warm-400 dark:from-warm-800 dark:via-warm-700 dark:to-warm-600 flex items-center justify-center">
        <span className="text-warm-500 dark:text-warm-400 text-4xl font-display font-bold opacity-30 select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="text-lg font-display font-bold text-warm-900 dark:text-warm-100 mb-2 leading-snug">
        {project.title}
      </h3>
      <p className="text-warm-600 dark:text-warm-300 text-sm leading-relaxed mb-4">
        {project.description}
      </p>

      {/* Tools */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tools.map((tool) => (
          <span
            key={tool}
            className="px-2.5 py-1 rounded-lg bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-400 text-xs font-medium"
          >
            {tool}
          </span>
        ))}
      </div>

      {/* Outcome */}
      <div className="pt-4 border-t border-warm-100 dark:border-warm-800">
        <p className="text-xs uppercase tracking-wide text-warm-500 dark:text-warm-400 mb-1">
          Key Outcome
        </p>
        <p className="text-sm font-semibold text-warm-800 dark:text-warm-200 leading-relaxed">
          {project.outcome}
        </p>
      </div>
    </motion.div>
  );
}