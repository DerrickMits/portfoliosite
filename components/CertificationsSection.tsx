"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

// To add a new badge in the future, append one entry to this array.
// `image` paths are root-relative to /public. URL-encode spaces as %20.
const badges = [
  {
    title: "Salesforce Certified Platform Administrator",
    issuer: "Salesforce",
    image: "/badges/Salesforce%20Certified%20Platform%20Administrator.png",
    href: "https://www.salesforce.com/trailblazer/npzwbmxctzpotksmw2",
  },
  {
    title: "GoHighLevel Certified Admin",
    issuer: "GoHighLevel",
    image: "/badges/GoHighLevel%20Certified%20Admin.png",
    href: "https://directory.gohighlevel.com/kenya/nairobi/certified-admins/derrick-odiwuor?from=badge",
  },
  {
    title: "Salesforce Certified Platform Foundations",
    issuer: "Salesforce",
    image: "/badges/Salesforce%20Certified%20Platform%20Foundations.png",
    href: "https://www.salesforce.com/trailblazer/npzwbmxctzpotksmw2",
  },
];

const sectionEyebrow = "Verified Credentials";
const sectionTitle = "Certifications & Badges";
const credentialLinkLabel = "View credential";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function CertificationsSection() {
  return (
    <section
      id="certifications"
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
            {sectionEyebrow}
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-warm-900 dark:text-warm-100">
            {sectionTitle}
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-stretch gap-8 md:gap-12 lg:gap-16"
        >
          {badges.map((badge) => (
            <motion.a
              key={badge.title}
              variants={item}
              href={badge.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-warm-900 rounded-2xl border border-warm-200 dark:border-warm-800 p-6 md:p-8 flex flex-col items-center hover:shadow-xl hover:border-warm-300 dark:hover:border-warm-700 transition-all duration-300"
            >
              <div className="w-40 h-40 md:w-44 md:h-44 flex items-center justify-center">
                <Image
                  src={badge.image}
                  alt={badge.title}
                  width={176}
                  height={176}
                  sizes="176px"
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="mt-5 text-xs uppercase tracking-[0.15em] font-semibold text-warm-500 dark:text-warm-400">
                {badge.issuer}
              </p>
              <p className="mt-1 text-sm font-display font-semibold text-warm-800 dark:text-warm-200 text-center max-w-[12rem]">
                {badge.title}
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-warm-400 dark:text-warm-500 group-hover:text-warm-600 dark:group-hover:text-warm-300 transition-colors">
                {credentialLinkLabel}
                <ExternalLink className="w-3 h-3" />
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
