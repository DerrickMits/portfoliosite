"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import ToggleTheme from "@/components/ui/toggle-theme";

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

type ContentItem = {
  href: string;
  label: string;
  description: string;
  external?: boolean;
};

const navLinks: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#certifications", label: "Certifications" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "/architect", label: "Consulting" },
];

// The AI Assistant is the nav's primary CTA - it lives on the far right
// of the header (not inline with the section links) so it reads as the
// call to action rather than another destination.
const AI_ASSISTANT_URL = "https://ai-assistant-theta-nine.vercel.app";
const AI_ASSISTANT_LABEL = "AI Assistant";

// Blog/Articles/Resources grouped under a single "Content" dropdown
// so the top nav stays clean and the related destinations live together.
const contentItems: ContentItem[] = [
  {
    href: "#blog",
    label: "Blog",
    description: "Long-form writing on the portfolio site itself",
    external: false,
  },
  {
    href: "https://ledger-article-site.vercel.app",
    label: "Articles",
    description: "External publication - The Ledger",
    external: true,
  },
  {
    href: "https://resources-virid-nine.vercel.app/resources",
    label: "Resources",
    description: "Downloadable blueprints and playbooks",
    external: true,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!contentOpen) return;
    const onClick = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        setContentOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContentOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [contentOpen]);

  const closeMobile = () => setMobileOpen(false);

  const isConsulting = pathname === "/architect";

  return (
    <>
      <header
        style={{
          transition: "background-color 0.2s linear, border-color 0.2s linear, box-shadow 0.2s linear",
        }}
        className={`fixed top-0 left-0 right-0 z-40 will-change-auto ${
          scrolled
            ? "bg-cream/95 md:bg-cream/75 dark:bg-deep/95 md:dark:bg-deep/75 md:backdrop-blur-md border-b border-warm-200/60 dark:border-warm-800/60 shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          {/* Brand — links back to portfolio home on /; shows name with ← arrow on /architect */}
          {isConsulting ? (
            <Link
              href="/"
              className="font-display text-xl font-bold text-warm-900 dark:text-cream hover:text-warm-700 dark:hover:text-warm-300 transition-colors inline-flex items-center gap-2"
            >
              <span aria-hidden="true">←</span> Derrick Odiwuor
            </Link>
          ) : (
            <Link
              href="/"
              className="font-display text-xl font-bold text-warm-900 dark:text-warm-100 hover:text-warm-700 dark:hover:text-warm-300 transition-colors"
            >
              Derrick Odiwuor
            </Link>
          )}

          {/* Desktop Links — hidden on /architect */}
          {!isConsulting && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  {...(("external" in link) && link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  {...(("external" in link) && link.external
                    ? { className: "px-3 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-amber-300/30 to-violet-300/30 text-warm-900 dark:text-warm-100 hover:from-amber-300/50 hover:to-violet-300/50 transition-colors" }
                    : { className: "px-3 py-2 rounded-lg text-sm font-medium text-warm-600 dark:text-warm-400 hover:text-warm-900 dark:hover:text-warm-100 hover:bg-warm-100 dark:hover:bg-warm-800 transition-colors" })}
                >
                  {("external" in link) && link.external ? <span className="inline-flex items-center gap-1.5">{link.label}<Sparkles className="w-3.5 h-3.5" /></span> : link.label}
                </a>
              ))}

              {/* Content dropdown */}
              <div ref={contentRef} className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={contentOpen}
                  onClick={() => setContentOpen((v) => !v)}
                  className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    contentOpen
                      ? "bg-warm-100 dark:bg-warm-800 text-warm-900 dark:text-warm-100"
                      : "text-warm-600 dark:text-warm-400 hover:text-warm-900 dark:hover:text-warm-100 hover:bg-warm-100 dark:hover:bg-warm-800"
                  }`}
                >
                  Content
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      contentOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {contentOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      role="menu"
                      className="absolute right-0 mt-2 w-72 rounded-xl bg-cream dark:bg-warm-900 border border-warm-200 dark:border-warm-800 shadow-lg p-2 z-50"
                    >
                      {contentItems.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          {...(item.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          onClick={() => setContentOpen(false)}
                          className="flex flex-col gap-0.5 px-3 py-2.5 rounded-lg text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-800 hover:text-warm-900 dark:hover:text-warm-100 transition-colors"
                        >
                          <span className="text-sm font-semibold">{item.label}</span>
                          <span className="text-xs text-warm-500 dark:text-warm-400 font-normal">
                            {item.description}
                          </span>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* AI Assistant CTA + Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-3" style={{ contain: "layout style" }}>
            {/* AI Assistant pill — always visible */}
            <a
              href={AI_ASSISTANT_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${AI_ASSISTANT_LABEL} (opens in a new tab)`}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-warm-900 dark:text-warm-50 bg-gradient-to-r from-amber-300 to-violet-300 hover:from-amber-200 hover:to-violet-200 shadow-sm hover:shadow duration-200"
              style={{ transitionProperty: "background-image, box-shadow, color" }}
            >
              <img src="/elara-avatar.png" alt="Elara" className="w-5 h-5 object-cover rounded-full" />
              {AI_ASSISTANT_LABEL}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {mounted && (
              <ToggleTheme />
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-warm-100 dark:bg-warm-800 flex items-center justify-center hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-warm-700 dark:text-warm-300" />
              ) : (
                <Menu className="w-5 h-5 text-warm-700 dark:text-warm-300" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-30 md:hidden"
            onClick={closeMobile}
          >
            {/* Backdrop — no backdrop-blur on mobile (causes repaint jitter) */}
            <div className="absolute inset-0 bg-black/50 md:backdrop-blur-sm" />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute top-0 right-0 bottom-0 w-72 bg-white dark:bg-warm-900 border-l border-warm-200 dark:border-warm-800 shadow-2xl pt-20 px-6"
              onClick={(e) => e.stopPropagation()}
            >
              {!isConsulting && (
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const isExt = ("external" in link) && (link as { external?: boolean }).external;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={closeMobile}
                        {...(isExt ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className={
                          isExt
                            ? "inline-flex items-center gap-2 px-4 py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-amber-300/30 to-violet-300/30 text-warm-900 dark:text-warm-100"
                            : "px-4 py-3 rounded-xl text-lg font-medium text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-800 hover:text-warm-900 dark:hover:text-warm-100 transition-colors"
                        }
                      >
                        {link.label}
                        {isExt && <Sparkles className="w-4 h-4" />}
                      </a>
                    );
                  })}

                  {/* Content group heading + sub-items in the mobile drawer */}
                  <div className="mt-4 pt-4 border-t border-warm-200 dark:border-warm-800">
                    {/* AI Assistant CTA in mobile drawer */}
                    <a
                      href={AI_ASSISTANT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMobile}
                      className="mb-3 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-base font-semibold text-warm-900 dark:text-warm-50 bg-gradient-to-r from-amber-300 to-violet-300 shadow-sm"
                    >
                      <img src="/elara-avatar.png" alt="Elara" className="w-5 h-5 object-cover rounded-full" />
                      {AI_ASSISTANT_LABEL}
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <p className="px-4 mb-2 text-xs uppercase tracking-[0.2em] font-semibold text-warm-500 dark:text-warm-400">
                      Content
                    </p>
                    <div className="flex flex-col gap-1">
                      {contentItems.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={closeMobile}
                          {...(item.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="px-4 py-3 rounded-xl text-base font-medium text-warm-600 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-warm-800 hover:text-warm-900 dark:hover:text-warm-100 transition-colors"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* /architect — minimal mobile menu: back link + AI + theme */}
              {isConsulting && (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/"
                    onClick={closeMobile}
                    className="px-4 py-3 rounded-xl text-base font-medium text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-800 transition-colors"
                  >
                    ← Back to Portfolio
                  </Link>
                  <a
                    href={AI_ASSISTANT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMobile}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-base font-semibold text-warm-900 dark:text-warm-50 bg-gradient-to-r from-amber-300 to-violet-300 shadow-sm"
                  >
                    <img src="/elara-avatar.png" alt="Elara" className="w-5 h-5 object-cover rounded-full" />
                    {AI_ASSISTANT_LABEL}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
