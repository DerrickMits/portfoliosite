"use client";

import { motion } from "framer-motion";

const links = [
  { href: "#services", label: "Services" },
  { href: "#case-studies", label: "Case Studies" },
  { href: "#problem-solution", label: "Problem & Solution" },
  { href: "#stack", label: "Tech Stack" },
  { href: "#contact", label: "Contact" },
];

export default function ArchitectFooter() {
  return (
    <footer className="bg-cream dark:bg-deep border-t border-grey-200 dark:border-warm-800">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-xl font-bold text-warm-900 dark:text-cream"
        >
          Derrick Odiwuor
        </motion.div>

<p className="text-sm text-grey-500 dark:text-warm-500 order-3 md:order-2 text-center">
  © {new Date().getFullYear()} Consulting. All rights reserved.
</p>

        <nav
          aria-label="Footer"
          className="flex gap-6 order-2 md:order-3 text-sm text-grey-700 dark:text-grey-300"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-accent dark:hover:text-cream transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
