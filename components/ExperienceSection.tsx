"use client";

import { motion } from "framer-motion";
import { Building, GraduationCap, Award } from "lucide-react";
import { Experience } from "@/lib/types";

const experiences: Experience[] = [
  {
    title: "Executive Partner",
    company: "Athena",
    location: "",
    startDate: "Jun 2025",
    endDate: "Present",
    bullets: [
      "Realigned executive calendars, increasing protected focus time by 35% in 6 months.",
      "Reduced interruptions by 50% in 90 days by triaging incoming communications and investment analysis requests.",
      "Coordinated cross-functional teams using Asana to deliver 95% of 10 major projects on time.",
      "Documented optimized internal processes to enhance overall team productivity.",
    ],
  },
  {
    title: "Product Content and Email Specialist",
    company: "Gaotek (USA / Remote)",
    location: "",
    startDate: "Jun 2024",
    endDate: "Aug 2024",
    bullets: [
      "Implemented PHP/MySQL optimizations, raising website speed by 35% and organic traffic by 20%.",
      "Created and edited 50+ high-impact marketing pieces, boosting audience engagement by 15%.",
      "Aligned content strategy with core revenue goals to increase generated leads by 10%.",
    ],
  },
  {
    title: "Data Analyst",
    company: "Excelerate (Remote)",
    location: "",
    startDate: "Jun 2024",
    endDate: "Jul 2024",
    bullets: [
      "Reduced reporting time by 30% across 10+ campaigns via custom data visualizations in Python, Tableau, and JIRA.",
      "Delivered statistical insights driving a 12% increase in monthly campaign ROI.",
      "Authored 20+ stakeholder presentations, increasing engagement by 25%.",
    ],
  },
  {
    title: "Portfolio Manager",
    company: "Ilara Health",
    location: "",
    startDate: "Jun 2021",
    endDate: "Aug 2024",
    bullets: [
      "Modeled automated collection workflows via Smartsheet, reducing outstanding receivables and bad debt by 20%.",
      "Re-engaged 50 churned healthcare clients through targeted strategies, achieving a 10% reactivation rate.",
      "Managed a 120-client portfolio, driving a 15% increase in client acquisition and overall retention.",
    ],
  },
  {
    title: "Senior Sales Representative",
    company: "Ilara Health",
    location: "",
    startDate: "Jun 2021",
    endDate: "Aug 2023",
    bullets: [
      "Established onboarding processes exceeding GMV targets by 10% and adding KES 10M in annual revenue.",
      "Led sales training for 20 telesales reps, boosting overall product adoption rates.",
      "Promoted medical supply packages to 100+ providers, securing high-value contracts.",
    ],
  },
  {
    title: "Relationship Manager",
    company: "Medsource",
    location: "",
    startDate: "Jan 2020",
    endDate: "Feb 2021",
    bullets: [
      "Improved supply chain tracking efficiency by 18% through digital tool implementations.",
      "Managed 30+ corporate accounts with a 95% retention rate using Act-On CRM.",
    ],
  },
];

const education = [
  {
    degree: "Master of Business Administration (MBA)",
    school: "Woolf University",
    years: "2025 – 2027",
  },
  {
    degree: "B.S. Analytical Chemistry",
    school: "Jomo Kenyatta University of Agriculture and Technology",
    years: "2014 – 2018",
  },
];

const certifications = [
  "HubSpot CRM",
  "Salesforce CRM",
  "Google Analytics",
  "Agile Project Management",
];

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative py-20 md:py-28 bg-white dark:bg-warm-900"
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
            Career Path
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-warm-900 dark:text-warm-100">
            Work Experience
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-warm-200 dark:bg-warm-800 md:-translate-x-px" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={`${exp.company}-${exp.title}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-warm-400 dark:bg-warm-600 border-2 border-cream dark:border-deep transform -translate-x-1/2 z-10 shadow-sm" />

                {/* Spacer */}
                <div className="md:w-1/2 md:px-6" />

                {/* Card */}
                <div
                  className={`md:w-1/2 md:px-6 w-full pl-14 md:pl-6 ${
                    index % 2 === 1 ? "md:text-left" : "md:text-left"
                  }`}
                >
                  <div className="bg-white dark:bg-warm-800 rounded-2xl border border-warm-200 dark:border-warm-700 p-5 md:p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-warm-100 dark:bg-warm-700 text-warm-600 dark:text-warm-300">
                        {exp.startDate}, {exp.endDate}
                      </span>
                    </div>
                    <h3 className="text-lg font-display font-bold text-warm-900 dark:text-warm-100">
                      {exp.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 mb-3">
                      <Building className="w-3.5 h-3.5 text-warm-500 dark:text-warm-400" />
                      <span className="text-sm text-warm-600 dark:text-warm-400 font-medium">
                        {exp.company}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {exp.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="text-sm text-warm-700 dark:text-warm-300 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-warm-400 dark:before:text-warm-600"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education & Certifications Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20 pt-16 border-t border-warm-200 dark:border-warm-800"
        >
          <div className="grid md:grid-cols-2 gap-10">
            {/* Education */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-5 h-5 text-warm-600 dark:text-warm-300" />
                <h3 className="text-xl font-display font-bold text-warm-900 dark:text-warm-100">
                  Education
                </h3>
              </div>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div
                    key={edu.degree}
                    className="bg-white dark:bg-warm-800 rounded-xl border border-warm-200 dark:border-warm-700 p-4"
                  >
                    <p className="font-semibold text-warm-900 dark:text-warm-100">
                      {edu.degree}
                    </p>
                    <p className="text-sm text-warm-600 dark:text-warm-400">
                      {edu.school}
                    </p>
                    <span className="inline-block mt-1 text-xs bg-warm-100 dark:bg-warm-700 text-warm-500 dark:text-warm-400 px-2.5 py-0.5 rounded-full">
                      {edu.years}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-warm-600 dark:text-warm-300" />
                <h3 className="text-xl font-display font-bold text-warm-900 dark:text-warm-100">
                  Certifications
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {certifications.map((cert) => (
                  <div
                    key={cert}
                    className="bg-white dark:bg-warm-800 rounded-xl border border-warm-200 dark:border-warm-700 p-4 flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-warm-500 dark:bg-warm-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-warm-700 dark:text-warm-300">
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}