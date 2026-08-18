"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3, Settings, Gift } from "lucide-react";
import { getConsentState, type CookieConsentState } from "@/lib/cookie-utils";

interface CookiePreferencesModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (preferences: {
    analytics: boolean;
    functional: boolean;
    marketing: boolean;
  }) => void;
  existingConsent?: CookieConsentState | null;
}

interface ToggleOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  required?: boolean;
}

const TOGGLE_OPTIONS: ToggleOption[] = [
  {
    id: "analytics",
    title: "Analytics",
    description: "Help us understand how visitors interact with our site. We collect anonymous data to improve performance and user experience.",
    icon: BarChart3,
    required: true,
  },
  {
    id: "functional",
    title: "Functional",
    description: "Enable enhanced functionality like saved preferences, chat widgets, and personalized content delivery.",
    icon: Settings,
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Allow us to send you personalized offers and recommendations based on your interests.",
    icon: Gift,
  },
];

export function CookiePreferencesModal({ 
  open, 
  onClose, 
  onSave,
  existingConsent 
}: CookiePreferencesModalProps) {
  const [options, setOptions] = useState({
    analytics: existingConsent?.analytics ?? false,
    functional: existingConsent?.functional ?? false,
    marketing: existingConsent?.marketing ?? false,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  // Reset options to existing consent when modal opens
  useEffect(() => {
    if (open) {
      setOptions({
        analytics: existingConsent?.analytics ?? false,
        functional: existingConsent?.functional ?? false,
        marketing: existingConsent?.marketing ?? false,
      });
      
      const timer = setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, existingConsent]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleToggle = (id: keyof typeof options) => {
    // Analytics is locked and cannot be toggled
    if (id === "analytics") return;
    
    setOptions(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSave = () => {
    onSave(options);
    onClose();
  };

  const handleAcceptAll = () => {
    const allTrue = { analytics: true, functional: true, marketing: true };
    onSave(allTrue);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />
          </div>
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            ref={modalRef}
            className="relative z-[101] w-full max-w-md bg-[#F9F8F5] dark:bg-warm-800/90 border border-[#E5E5E0] dark:border-warm-700 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black-5"
            role="dialog"
            aria-labelledby="cookie-modal-title"
            aria-modal="true"
          >
            <button
              ref={firstFocusableRef}
              onClick={onClose}
              className="absolute top-4 right-4 text-[#8C7A6B] dark:text-grey-400 hover:text-[#1C1917] dark:hover:text-cream transition-colors"
              aria-label="Close preferences"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 id="cookie-modal-title" className="text-2xl font-display font-bold text-[#1C1917] dark:text-cream mb-6">
              Cookie Preferences
            </h2>

            <div className="space-y-4 mb-8">
              {TOGGLE_OPTIONS.map((option, index) => (
                <div key={option.id} className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <option.icon className="w-4 h-4 text-[#7A8B7B] dark:text-[#9CB09D]" />
                      <span className="font-medium text-[#1C1917] dark:text-cream">
                        {option.title}
                        {option.required && (
                          <span className="text-xs text-[#8C7A6B] dark:text-grey-400 ml-1 bg-[#F4F3EE] dark:bg-warm-900 px-1.5 py-0.5 rounded-full">
                            Locked
                          </span>
                        )}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={options[option.id as keyof typeof options]}
                        onChange={() => handleToggle(option.id as keyof typeof options)}
                        disabled={option.required}
                        className="sr-only"
                        aria-label={option.required ? `${option.title} (required)` : `Enable ${option.title} cookies`}
                      />
                      <div className={`relative inline-block w-11 h-6 rounded-full transition-colors ${
                        options[option.id as keyof typeof options]
                          ? "bg-[#7A8B7B]"
                          : option.required
                          ? "bg-[#E5E2D9] dark:bg-warm-700 cursor-not-allowed"
                          : "bg-[#E5E2D9] dark:bg-warm-700 hover:bg-opacity-80"
                      }`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          options[option.id as keyof typeof options]
                            ? "translate-x-5"
                            : "translate-x-0.5"
                        }`}></div>
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-[#5A5852] dark:text-grey-300 ml-4 sm:ml-0">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                ref={lastFocusableRef}
                onClick={handleAcceptAll}
                className="flex-1 px-4 py-2 rounded-xl border border-[#7A8B7B] text-[#7A8B7B] dark:text-[#9CB09D] font-medium hover:bg-[#7A8B7B]/5 dark:hover:bg-[#9CB09B]/20 transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 rounded-xl bg-[#1C1917] dark:bg-warm-100 text-white dark:text-warm-900 font-medium hover:bg-[#333] dark:hover:bg-warm-50 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
