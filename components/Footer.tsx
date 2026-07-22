"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-warm-200 dark:border-warm-800 bg-cream dark:bg-deep py-10">
      <motion.div
        className="max-w-6xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-display text-2xl font-bold text-warm-900 dark:text-warm-100 mb-2">
          Derrick Odiwuor
        </p>
        <p className="text-warm-600 dark:text-warm-300 text-sm mb-1">
          Nairobi, Kenya
        </p>
        <p className="text-warm-500 dark:text-warm-600 text-xs">
          &copy; {currentYear} Derrick Odiwuor. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}