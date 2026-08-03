"use client";

import { motion } from "framer-motion";
import { Check, Clock, Sparkles } from "lucide-react";
import { FlowButton } from "@/components/ui/flow-button";

const SERVICE_OFFERING = {
  name: "Complete System & CRM Setup Sprint",
  badge: "Single Entry Tier",
  description:
    "A dedicated hands-on sprint covering full operational assessment, CRM platform selection, and AI-driven automation setup tailored for scaling teams.",
  price: 25,
  duration: "/ 4 Hours",
  features: [
    {
      title: "CRM Suggestion & Setup",
      details:
        "Evaluation of your business needs to recommend and configure the right platform (Salesforce, HubSpot, or GoHighLevel), including lead stage pipelines and contact mapping.",
    },
    {
      title: "AI-Driven Automation",
      details:
        "Building custom AI logic engines and workflow triggers (using Zapier or n8n) to eliminate repetitive manual entry and speed up lead response.",
    },
    {
      title: "Hands-On Configuration",
      details:
        "Live, 4-hour implementation session focused on directly building out and testing your core operational workflows.",
    },
    {
      title: "System Blueprint & Walkthrough",
      details:
        "Clear documentation and a personalized walkthrough so you can easily manage and run your new setup moving forward.",
    },
  ],
};

export function GrowthPlans() {
  return (
    <section id="growth-plans" className="relative py-20 md:py-28 bg-[#FAF8F5] dark:bg-deep">
      <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFECE6] dark:bg-warm-800 border border-[#E0DCD3] dark:border-warm-700 text-xs font-medium text-[#5A5852] dark:text-grey-400 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#8C8275] dark:text-grey-500" />
            <span>{SERVICE_OFFERING.badge}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tight mb-4 text-[#111111] dark:text-cream text-balance">
            {SERVICE_OFFERING.name}
          </h2>
          <p className="text-[#666460] dark:text-grey-300 max-w-2xl mx-auto mb-16 text-base sm:text-lg leading-relaxed text-pretty">
            {SERVICE_OFFERING.description}
          </p>
        </motion.div>

        {/* Premium Single Card Layout */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl mx-auto bg-[#F4F3EE] dark:bg-warm-800 border border-[#E5E3DC] dark:border-warm-700 rounded-2xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] text-left relative overflow-hidden"
        >
          {/* Price & Duration */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 mb-8 border-b border-[#E2DFD8] dark:border-warm-700">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-[#7E7A70] dark:text-grey-500 block mb-1">
                Investment
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-light text-[#55524B] dark:text-grey-400">
                  $
                </span>
                <span className="text-6xl font-bold tracking-tight text-[#1A1A1A] dark:text-cream">
                  {SERVICE_OFFERING.price}
                </span>
                <span className="text-sm font-medium text-[#7E7A70] dark:text-grey-500 ml-1">
                  {SERVICE_OFFERING.duration}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#666460] dark:text-grey-300 bg-[#EAE8E1] dark:bg-warm-900 px-3.5 py-2 rounded-lg border border-[#DDD9CF] dark:border-warm-700">
              <Clock className="w-4 h-4 text-[#8C8275] dark:text-grey-500" />
              <span>Dedicated 4-Hour Implementation</span>
            </div>
          </div>

          {/* Included Features */}
          <div className="space-y-6 mb-10">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#7E7A70] dark:text-grey-500">
              What's Included
            </h4>
            <div className="grid gap-6">
              {SERVICE_OFFERING.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 group"
                >
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#E5E2D9] dark:bg-warm-700 border border-[#D5D1C5] dark:border-warm-600 flex items-center justify-center shrink-0 text-[#4A4843] dark:text-grey-300">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h5 className="text-base font-semibold text-[#1A1A1A] dark:text-cream mb-1">
                      {feature.title}
                    </h5>
                    <p className="text-sm text-[#666460] dark:text-grey-300 leading-relaxed">
                      {feature.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <FlowButton
            text="Book Setup Sprint"
            href="https://calendly.com/derrickodiwuor/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full !rounded-xl hover:!rounded-xl dark:!border-cream"
            centered
            noRipple
          />
        </motion.div>
      </div>
    </section>
  );
}