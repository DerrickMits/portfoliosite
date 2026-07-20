"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkillCategory } from "@/lib/types";

const skillCategories: SkillCategory[] = [
  {
    id: "ops",
    label: "Executive Ops & Management",
    skills: [
      "Task & Schedule Management",
      "Calendar Realignment",
      "Travel Support",
      "Executive Communications",
      "Process Optimization",
    ],
  },
  {
    id: "crm",
    label: "CRM & Sales Tools",
    skills: [
      "HubSpot CRM",
      "Salesforce CRM",
      "GoHighLevel",
      "Act-On CRM",
    ],
  },
  {
    id: "analytics",
    label: "Analytics & Visualization",
    skills: [
      "Power BI",
      "Tableau",
      "Python",
      "Google Analytics",
      "Advanced Excel",
    ],
  },
  {
    id: "pm",
    label: "Project Management & Collaboration",
    skills: [
      "Asana",
      "Smartsheet",
      "Jira",
      "Trello",
      "SharePoint",
      "Google Workspace",
      "Microsoft Teams",
    ],
  },
];

const allTabs = [
  { id: "all", label: "All" },
  ...skillCategories.map((c) => ({ id: c.id, label: c.label })),
];

export default function SkillsSection() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredCategories =
    activeTab === "all"
      ? skillCategories
      : skillCategories.filter((c) => c.id === activeTab);

  return (
    <section
      id="skills"
      className="relative py-20 md:py-28 bg-white dark:bg-warm-900"
    >
      <div className="z-10 max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm uppercase tracking-[0.2em] font-semibold text-warm-500 dark:text-warm-400 mb-4">
            Core Competencies
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-warm-900 dark:text-warm-100">
            Skills &amp; Expertise
          </h2>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {allTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-warm-900 dark:bg-warm-100 text-white dark:text-warm-900 shadow-sm"
                  : "bg-warm-100 dark:bg-warm-800 text-warm-600 dark:text-warm-400 hover:bg-warm-200 dark:hover:bg-warm-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-10"
          >
            {filteredCategories.map((category) => (
              <div key={category.id}>
                <h3 className="text-lg font-display font-bold text-warm-800 dark:text-warm-200 mb-4">
                  {category.label}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 rounded-xl bg-warm-100 dark:bg-warm-800 text-warm-700 dark:text-warm-300 text-sm font-medium border border-warm-200 dark:border-warm-700 hover:border-warm-400 dark:hover:border-warm-500 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}