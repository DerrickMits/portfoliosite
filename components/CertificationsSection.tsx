"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

// Badge types: drop in a new entry to add a 4th, 5th, etc.
//   - `image`: local PNG under /public/badges (URL-encode spaces as %20)
//   - `embed`: raw HTML (for credential widgets like HubSpot Academy that
//     load their own badge artwork from a remote URL inside the snippet)
type BadgeImage = {
  kind: "image";
  title: string;
  issuer: string;
  image: string;
  href: string;
};

type BadgeEmbed = {
  kind: "embed";
  title: string;
  issuer: string;
  embed: string;
  href: string;
};

type Badge = BadgeImage | BadgeEmbed;

const badges: Badge[] = [
  {
    kind: "image",
    title: "Salesforce Certified Platform Administrator",
    issuer: "Salesforce",
    image: "/badges/Salesforce%20Certified%20Platform%20Administrator.png",
    href: "https://www.salesforce.com/trailblazer/npzwbmxctzpotksmw2",
  },
  {
    kind: "image",
    title: "GoHighLevel Certified Admin",
    issuer: "GoHighLevel",
    image: "/badges/GoHighLevel%20Certified%20Admin.png",
    href: "https://directory.gohighlevel.com/kenya/nairobi/certified-admins/derrick-odiwuor?from=badge",
  },
  {
    kind: "image",
    title: "Salesforce Certified Platform Foundations",
    issuer: "Salesforce",
    image: "/badges/Salesforce%20Certified%20Platform%20Foundations.png",
    href: "https://www.salesforce.com/trailblazer/npzwbmxctzpotksmw2",
  },
  {
    kind: "embed",
    title: "HubSpot Academy Inbound Certified",
    issuer: "HubSpot Academy",
    href: "https://app-eu1.hubspot.com/academy/achievements/s8wx1ywy/en/1/derrick-odiwuor/inbound-certified",
    embed: `<div class='academy-badge'><a href='https://app-eu1.hubspot.com/academy/achievements/s8wx1ywy/en/1/derrick-odiwuor/inbound-certified' title='Inbound Certified'><img src='https://hubspot-credentials-na1.s3.amazonaws.com/prod/badges/user/0a7bffa10cfb44b4a542818fb7edd4e8.png' alt='HubSpot Academy Inbound Certified' /></a></div>`,
  },
  {
    kind: "embed",
    title: "Account-Based Marketing Bootcamp",
    issuer: "HubSpot Academy",
    href: "https://app-eu1.hubspot.com/academy/achievements/p3pkbxqj/en/1/derrick-odiwuor/certificate-of-completion",
    embed: `<div class='academy-badge'><a href='https://app-eu1.hubspot.com/academy/achievements/p3pkbxqj/en/1/derrick-odiwuor/certificate-of-completion' title='Account-Based Marketing Bootcamp'><img src='https://hubspot-credentials-na1.s3.amazonaws.com/prod/badges/user/f49c47c78d4a448cb7eb08314f701335.png' alt='Account-Based Marketing Bootcamp' /></a></div>`,
  },
  {
    kind: "embed",
    title: "Content Marketing Certified",
    issuer: "HubSpot Academy",
    href: "https://app-eu1.hubspot.com/academy/achievements/htzv6v3b/en/1/derrick-odiwuor/content-marketing-certified",
    embed: `<div class='academy-badge'><a href='https://app-eu1.hubspot.com/academy/achievements/htzv6v3b/en/1/derrick-odiwuor/content-marketing-certified' title='Content Marketing Certified'><img src='https://hubspot-credentials-na1.s3.amazonaws.com/prod/badges/user/7112ab938e7946acb81f373ea0992ee5.png' alt='Content Marketing Certified' /></a></div>`,
  },
  {
    kind: "embed",
    title: "Email Marketing Certified",
    issuer: "HubSpot Academy",
    href: "https://app-eu1.hubspot.com/academy/achievements/td0v79mn/en/1/derrick-odiwuor/email-marketing-certified",
    embed: `<div class='academy-badge'><a href='https://app-eu1.hubspot.com/academy/achievements/td0v79mn/en/1/derrick-odiwuor/email-marketing-certified' title='Email Marketing Certified'><img src='https://hubspot-credentials-na1.s3.amazonaws.com/prod/badges/user/7cb5c9ad34d8450dbb2f4b8f0982ccf4.png' alt='Email Marketing Certified' /></a></div>`,
  },
  {
    kind: "image",
    title: "Google Agile Project Management",
    issuer: "Google",
    image: "/badges/Google%20Agile%20Project%20Management.png",
    href: "https://www.coursera.org/account/accomplishments/verify/TBZL78UQ5QU7",
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
              {/* Badge artwork: local <Image> OR remote HTML embed (HubSpot). */}
              <div className="w-40 h-40 md:w-44 md:h-44 flex items-center justify-center">
                {badge.kind === "image" ? (
                  <Image
                    src={badge.image}
                    alt={badge.title}
                    width={176}
                    height={176}
                    sizes="176px"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center [&_img]:max-h-full [&_img]:max-w-full [&_img]:h-auto [&_img]:w-auto [&_img]:object-contain [&_a]:inline-flex"
                    dangerouslySetInnerHTML={{ __html: badge.embed }}
                  />
                )}
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
