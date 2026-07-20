"use client";

import { motion } from "framer-motion";
import { Project } from "@/lib/types";

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
    title: "End-to-End Medical Sub-Account Infrastructure & Tooling",
    description:
      "Architected and deployed a multi-stage CRM architecture from scratch for a medical practice sub-account, integrating automated scheduling engines, deep calendar validation, custom values, and core asset funnels.",
    tools: ["LC Email Provider", "Cloudflare DNS", "Calendar API", "Funnel Builder"],
    outcome:
      "Eliminated manual profile synchronization overhead, configured zero-latency Google Calendar mapping, and achieved native video link routing.",
  },
  {
    title: "High-Conversion Dental Pipeline & 4-Tier Automation Workflows",
    description:
      "Designed a structured 4-stage tracking visual board synchronized with deep automation loops covering immediate lead nurturing, automated hot-lead notification alerts, booking responses, and no-show winbacks.",
    tools: ["Workflows", "Pipelines", "Custom Values", "Conditional Triggers"],
    outcome:
      "Automatic lead-state updates, auto-canceling cross-sequences upon direct contact response, and localized windowed notifications.",
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
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
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
          ))}
        </div>
      </div>
    </section>
  );
}