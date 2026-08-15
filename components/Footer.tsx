"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const ecosystemLinks = [
    { href: "/", label: "Portfolio Home" },
    { href: "/architect", label: "Consulting & Architecture" },
    { href: "https://resources-virid-nine.vercel.app/resources", label: "Resource Hub", external: true },
    { href: "https://ledger-article-site.vercel.app/", label: "Articles", external: true },
  ];

  const legalLinks = [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
  ];

  return (
    <footer className="border-t border-warm-200 dark:border-warm-700 bg-cream dark:bg-deep py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand Section */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-display text-2xl md:text-3xl font-bold text-warm-900 dark:text-warm-100 mb-4">
              Derrick Odiwuor
            </p>
            <p className="text-warm-700 dark:text-warm-300 leading-relaxed text-base mb-6 max-w-xs">
              Operations & AI Automation Architect. Building scalable workflows, intelligent automation, and operational infrastructure for modern teams.
            </p>
            <p className="text-warm-500 dark:text-warm-400 text-sm">
              &copy; {currentYear} Derrick Odiwuor. All rights reserved.
            </p>
          </motion.div>

          {/* Ecosystem Navigation */}
          <motion.nav
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            aria-label="Ecosystem navigation"
          >
            <h3 className="font-semibold text-warm-900 dark:text-warm-100 mb-4 tracking-wide uppercase text-sm">
              Ecosystem
            </h3>
            <ul className="space-y-3" role="list">
              {ecosystemLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-warm-600 dark:text-warm-300 hover:text-warm-900 dark:hover:text-warm-100 transition-colors flex items-center gap-2 group"
                    aria-label={link.label + (link.external ? " (opens in new tab)" : "")}
                  >
                    <span className="group-hover:underline">{link.label}</span>
                    {link.external && (
                      <svg
                        className="w-3.5 h-3.5 text-warm-400 dark:text-warm-500 group-hover:text-warm-600 dark:group-hover:text-warm-300 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>

          {/* Legal & Compliance */}
          <motion.nav
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            aria-label="Legal and compliance"
          >
            <h3 className="font-semibold text-warm-900 dark:text-warm-100 mb-4 tracking-wide uppercase text-sm">
              Legal & Compliance
            </h3>
            <ul className="space-y-3" role="list">
              {legalLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <Link
                    href={link.href}
                    className="text-warm-600 dark:text-warm-300 hover:text-warm-900 dark:hover:text-warm-100 transition-colors group"
                  >
                    <span className="group-hover:underline">{link.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </div>

        {/* Bottom Divider & Social/Contact */}
        <motion.div
          className="mt-12 pt-8 border-t border-warm-200 dark:border-warm-700 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-warm-500 dark:text-warm-400 text-sm">
            Designed for clarity and speed.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}