"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  AlertTriangle,
  DollarSign,
  Target,
} from "lucide-react";

type CardData = {
  id: string;
  front: {
    category: string;
    icon: React.ElementType;
    title: string;
    frictionPoints: string[];
    metric: string;
    metricIcon: React.ElementType;
  };
  back: {
    category: string;
    icon: React.ElementType;
    title: string;
    highlights: string[];
    outcomes: string[];
  };
};

const CARDS: CardData[] = [
  {
    id: "credit-risk",
    front: {
      category: "Financial Operations & Credit Risk",
      icon: ShieldCheck,
      title:
        "Fragmented Credit Underwriting & Uncontrolled Bad Debt",
      frictionPoints: [
        "Manual document intake for healthcare accounts led to high default risks.",
        "Arbitrary credit limits granted without regulatory or cash flow verification.",
        "Reactive payment chasing across 120 client accounts.",
      ],
      metric: "High Outstanding Receivables & Default Exposure",
      metricIcon: AlertTriangle,
    },
    back: {
      category: "System Design & Automation",
      icon: Target,
      title: "Automated Compliance & DTI Underwriting Pipeline",
      highlights: [
        "Integrated HubSpot Approval Workflows to lock deals pending statutory checks (Pharmacy & Poisons Board permits).",
        "Built a 4-step DTI calculation model incorporating Metropol CRB cross-referencing.",
        "Configured automated multi-stage reminder engine using HubSpot, Salesforce, & Smartsheet aging trackers.",
      ],
      outcomes: [
        "-20% Reduction in Bad Debt & Receivables",
        "120 Accounts Standardized Without Headcount Increase",
      ],
    },
  },
  {
    id: "marketing-spend",
    front: {
      category: "Marketing Analytics & Spend Efficiency",
      icon: BarChart3,
      title: "Inefficient Ad Spend & High Cost-Per-Result (CPR)",
      frictionPoints: [
        "Superhero U campaign suffered from high ad spend without proportional conversion/click returns.",
        "Underperforming ad sets (e.g., Campaigns 3 & 10) exhibited severe Cost Per Result (CPR) inflation.",
        "Lack of data-driven budget allocation across target demographic groups.",
      ],
      metric: "Capital Inefficiency & High CPR",
      metricIcon: DollarSign,
    },
    back: {
      category: "Data Analysis & Capital Reallocation",
      icon: TrendingUp,
      title: "Performance Audit & Automated Capital Reallocation",
      highlights: [
        "Conducted cross-campaign performance analysis comparing Clicks, Unique Clicks, and CPR metrics.",
        "Formulated an evidence-based recommendation framework to decommission low-performing campaigns (3 & 10).",
        "Directed capital reallocation toward high-ROI campaigns (2, 7, & 8).",
      ],
      outcomes: [
        "+12% Improvement in Overall Campaign ROI",
        "Data-Driven Capital Reallocation & CPR Reduction",
      ],
    },
  },
];

function FlipCard({ card }: { card: CardData }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const FrontIcon = card.front.icon;
  const FrontMetricIcon = card.front.metricIcon;
  const BackIcon = card.back.icon;

  return (
    <div
      className="group relative h-[560px] md:h-[520px] [perspective:1000px]"
      style={{ perspective: "1000px" }}
    >
      <div
        onClick={() => setIsFlipped((v) => !v)}
        className="relative h-full w-full cursor-pointer transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── FRONT — THE BOTTLENECK ── */}
        <div
          className="absolute inset-0 flex flex-col rounded-2xl bg-[#F4F3EF] dark:bg-warm-800 border border-[#E5E2D9] dark:border-warm-700 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Header indicator */}
          <div className="flex items-center justify-between mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5E2D9]/60 dark:bg-warm-700 text-[#8C7A6B] dark:text-grey-300 text-[10px] font-semibold uppercase tracking-[0.18em]">
              Front: The Bottleneck
            </div>
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-warm-700 border border-[#E5E2D9] dark:border-warm-600 flex items-center justify-center shrink-0">
              <FrontIcon className="w-4.5 h-4.5 text-[#7A8B7B] dark:text-grey-300" style={{ width: 18, height: 18 }} />
            </div>
          </div>

          {/* Category */}
          <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#8C7A6B] dark:text-grey-500 mb-2">
            {card.front.category}
          </p>

          {/* Title */}
          <h3 className="text-xl font-display font-bold text-[#1A1A1A] dark:text-cream leading-tight mb-5">
            {card.front.title}
          </h3>

          {/* Friction points */}
          <ul className="space-y-2.5 mb-auto">
            {card.front.frictionPoints.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-[#5A5852] dark:text-grey-300 leading-relaxed"
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#8C7A6B] dark:bg-grey-500 shrink-0"
                  aria-hidden="true"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/* Metric highlight */}
          <div className="mt-5 flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-warm-900 border border-[#E5E2D9] dark:border-warm-700">
            <div className="w-9 h-9 rounded-lg bg-[#F4F3EF] dark:bg-warm-700 flex items-center justify-center shrink-0">
              <FrontMetricIcon className="w-4 h-4 text-[#8C7A6B] dark:text-grey-300" />
            </div>
            <p className="text-xs font-semibold text-[#1A1A1A] dark:text-cream leading-snug">
              {card.front.metric}
            </p>
          </div>
        </div>

        {/* ── BACK — THE SYSTEM BUILT ── */}
        <div
          className="absolute inset-0 flex flex-col rounded-2xl bg-[#F4F3EF] dark:bg-warm-800 border border-[#E5E2D9] dark:border-warm-700 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Header indicator */}
          <div className="flex items-center justify-between mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A8B7B]/15 dark:bg-[#7A8B7B]/20 text-[#7A8B7B] dark:text-[#9CB09D] text-[10px] font-semibold uppercase tracking-[0.18em]">
              Back: The System Built
            </div>
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-warm-700 border border-[#E5E2D9] dark:border-warm-600 flex items-center justify-center shrink-0">
              <BackIcon className="w-4.5 h-4.5 text-[#7A8B7B] dark:text-[#9CB09D]" style={{ width: 18, height: 18 }} />
            </div>
          </div>

          {/* Category */}
          <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#7A8B7B] dark:text-[#9CB09D] mb-2">
            {card.back.category}
          </p>

          {/* Title */}
          <h3 className="text-xl font-display font-bold text-[#1A1A1A] dark:text-cream leading-tight mb-5">
            {card.back.title}
          </h3>

          {/* Highlights */}
          <ul className="space-y-2.5 mb-auto">
            {card.back.highlights.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-[#5A5852] dark:text-grey-300 leading-relaxed"
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#7A8B7B] dark:bg-[#9CB09D] shrink-0"
                  aria-hidden="true"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>

{/* Outcome badges */}
<div className="mt-5 flex flex-wrap gap-1.5">
  {card.back.outcomes.map((outcome, i) => (
    <span
      key={i}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7A8B7B]/10 dark:bg-[#7A8B7B]/15 border border-[#7A8B7B]/25 dark:border-[#7A8B7B]/40 text-[#7A8B7B] dark:text-[#9CB09D] text-[11px] font-semibold leading-snug"
    >
      {outcome.startsWith("-") ? (
        <TrendingDown className="w-3 h-3 shrink-0" />
      ) : (
        <TrendingUp className="w-3 h-3 shrink-0" />
      )}
      <span>{outcome}</span>
    </span>
  ))}
</div>
        </div>
      </div>
    </div>
  );
}

export default function FlipCards() {
  return (
    <section id="problem-solution" className="relative py-20 md:py-28 bg-[#FAF8F5] dark:bg-deep">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16 text-center"
        >
          <p className="text-xs uppercase tracking-[0.22em] font-semibold text-[#8C7A6B] dark:text-grey-500 mb-3">
            Problem → Solution
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#1A1A1A] dark:text-cream leading-tight max-w-2xl mx-auto">
            Bottlenecks diagnosed. Systems built.
          </h2>
          <p className="mt-3 text-[#5A5852] dark:text-grey-300 text-base max-w-xl mx-auto">
            Click each card to flip between the operational bottleneck on the
            front and the engineered system on the back.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
            >
              <FlipCard card={card} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}