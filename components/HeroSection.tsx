"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Mail,
  Phone,
  ArrowDown,
  TrendingUp,
  Clock,
  BarChart3,
  Sparkles,
} from "lucide-react";

const metrics = [
  {
    value: "+35%",
    label: "Executive Focus Time",
    icon: Clock,
    detail: "Recovered through calendar realignment",
  },
  {
    value: "+12%",
    label: "Campaign ROI",
    icon: TrendingUp,
    detail: "Data Analytics & Visualization",
  },
  {
    value: "20%",
    label: "Reduction in Receivables",
    icon: BarChart3,
    detail: "Outstanding receivables decreased",
  },
  {
    value: "95%",
    label: "On-Time Delivery",
    icon: Sparkles,
    detail: "Cross-functional project workstreams",
  },
];

export default function HeroSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center pt-24 pb-20 bg-cream dark:bg-deep overflow-hidden"
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream to-transparent dark:from-deep dark:via-deep dark:to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-warm-200/25 dark:bg-warm-800/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-warm-300/20 dark:bg-warm-700/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="z-10 max-w-6xl mx-auto px-6 md:px-8 w-full">
        {/* ── Two-column: Left text · Right Portrait ── */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left content area */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Role tag */}
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] font-semibold text-warm-500 dark:text-warm-400">
              Executive Operations · PM · CRM · AI
            </p>

            {/* Name */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-warm-900 dark:text-warm-100 tracking-tight leading-[1.05] mt-2">
              Derrick
              <br />
              Odiwuor
            </h1>

            {/* Summary */}
            <p className="text-lg md:text-xl text-warm-700 dark:text-warm-300 leading-relaxed max-w-lg">
              High-impact operations professional and MBA candidate combining
              project management expertise, CRM optimization, and modern AI
              automation workflows to drive organizational efficiency.
            </p>

            {/* Location line */}
            <div className="flex items-center gap-2 text-sm text-warm-500 dark:text-warm-400 pt-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-warm-400 dark:bg-warm-600" />
              Nairobi, Kenya · Open to Global Remote &amp; On-site Roles
            </div>

            {/* CTA group */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a
                href="#experience"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-warm-900 dark:bg-warm-100 text-white dark:text-warm-900 font-medium hover:bg-warm-800 dark:hover:bg-warm-200 transition-colors shadow-sm"
              >
                <ArrowDown className="w-4 h-4" />
                View Experience
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-warm-300 dark:border-warm-700 text-warm-700 dark:text-warm-300 font-medium hover:bg-warm-100 dark:hover:bg-warm-800 transition-colors"
              >
                Contact Me
              </a>

              {/* Social icons */}
              <div className="flex items-center gap-1.5 ml-2">
                <a
                  href="https://linkedin.com/in/derrickodiwuor"
                  className="w-10 h-10 rounded-xl bg-warm-100 dark:bg-warm-800 flex items-center justify-center hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <ExternalLink className="w-4 h-4 text-warm-600 dark:text-warm-300" />
                </a>
                <a
                  href="mailto:derrickodiwuor@gmail.com"
                  className="w-10 h-10 rounded-xl bg-warm-100 dark:bg-warm-800 flex items-center justify-center hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4 text-warm-600 dark:text-warm-300" />
                </a>
                <a
                  href="tel:+254713965539"
                  className="w-10 h-10 rounded-xl bg-warm-100 dark:bg-warm-800 flex items-center justify-center hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors"
                  aria-label="Phone"
                >
                  <Phone className="w-4 h-4 text-warm-600 dark:text-warm-300" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right portrait column */}
          <motion.div
            className="lg:col-span-5 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <div className="relative w-72 sm:w-80 md:w-96 aspect-[3/4] group">
              {/* Gradient glow behind portrait */}
              <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-warm-300/40 via-transparent to-warm-200/20 dark:from-warm-600/30 dark:to-warm-800/10 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Portrait frame */}
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-2 border-white/80 dark:border-warm-700/60 shadow-2xl shadow-warm-900/10 dark:shadow-black/40">
                <Image
                  src="/images/derrick-portrait.jpg"
                  alt="Derrick Odiwuor, Executive Operations Coordinator"
                  fill
                  sizes="(max-width: 1024px) 288px, 384px"
                  className="object-cover object-center"
                  priority
                />

                {/* Subtle inner vignette */}
                <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/20 dark:ring-white/5 pointer-events-none" />
              </div>

              {/* Soft decorative accent dot */}
              <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-warm-200/60 dark:bg-warm-700/40 blur-xl pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* ── Key Metrics Grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="bg-white/80 dark:bg-warm-800/80 backdrop-blur-sm rounded-2xl border border-warm-200/60 dark:border-warm-700/60 p-4 md:p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-warm-100 dark:bg-warm-700 flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-warm-600 dark:text-warm-300" />
                </div>
                <span className="text-2xl md:text-3xl font-display font-bold text-warm-900 dark:text-warm-100">
                  {metric.value}
                </span>
              </div>
              <p className="text-xs uppercase tracking-wide text-warm-500 dark:text-warm-400 mb-0.5">
                {metric.label}
              </p>
              <p className="text-xs text-warm-600 dark:text-warm-500">
                {metric.detail}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── Editorial Accent Strip with Secondary Photo ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-14 md:mt-18 max-w-2xl mx-auto"
        >
          <div className="flex items-start gap-5 bg-white/60 dark:bg-warm-800/60 backdrop-blur-sm rounded-2xl border border-warm-200/40 dark:border-warm-700/40 p-4 md:p-5">
            <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden border border-warm-200 dark:border-warm-700 shadow-sm">
              <Image
                src="/images/derrick-secondary.jpg"
                alt="Derrick Odiwuor"
                width={64}
                height={64}
                className="object-cover object-center w-full h-full"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-warm-500 dark:text-warm-400 mb-1">
                Currently
              </p>
              <p className="text-sm text-warm-700 dark:text-warm-300 leading-relaxed">
                Executive Partner at <span className="font-medium text-warm-900 dark:text-warm-200">Athena</span>
                <span className="text-warm-500"> · </span>
                MBA Candidate at <span className="font-medium text-warm-900 dark:text-warm-200">Woolf University</span>
                <span className="text-warm-500"> · </span>
                Open to global opportunities in Operations &amp; Project Management.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}