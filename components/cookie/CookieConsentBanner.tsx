"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { CookiePreferencesModal } from "@/components/cookie/CookiePreferencesModal";
import { getConsentState, type CookieConsentState } from "@/lib/cookie-utils";

const CONSENT_URL = "https://portfoliosite-pearl-one.vercel.app/terms";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [existingConsent, setExistingConsent] = useState<CookieConsentState | null>(null);
  const { needsConsent, acceptAll, declineAll, updateConsent } = useCookieConsent();

  useEffect(() => {
    // Only show on client-side after hydration
    if (typeof window !== "undefined" && needsConsent()) {
      setIsVisible(true);
    }
  }, [needsConsent]);

  // Get existing consent when preferences modal opens
  useEffect(() => {
    if (showPreferences) {
      setExistingConsent(getConsentState());
    }
  }, [showPreferences]);

  // Honor DNT header for users who prefer not to track
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") {
      // Don't show banner to users with DNT enabled
      setIsVisible(false);
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAll();
    setIsVisible(false);
  };

  const handleDeclineAll = () => {
    declineAll();
    setIsVisible(false);
  };

  const handleSavePreferences = (preferences: {
    analytics: boolean;
    functional: boolean;
    marketing: boolean;
  }) => {
    updateConsent(preferences);
    setIsVisible(false);
  };

  const handleOpenPreferences = () => {
    setShowPreferences(true);
  };

  const handleClosePreferences = () => {
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[50] md:bottom-8 mx-auto max-w-4xl mb-6 px-4 sm:px-6"
          >
            <div className="relative w-full bg-[#F9F8F5] dark:bg-warm-900/90 border border-[#E5E5E0] dark:border-warm-700 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl shadow-black/5 backdrop-blur-md">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#7A8B7B] dark:text-[#9CB09D] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-display font-bold text-[#1C1917] dark:text-cream mb-1">
                      We value your privacy
                    </h3>
                    <p className="text-sm text-[#5A5852] dark:text-grey-300">
                      We use cookies to enhance your browsing experience, analyze site performance, and personalize content. Read our{" "}
                      <a
                        href={CONSENT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#7A8B7B] hover:text-[#5A5852] dark:text-[#9CB09D] hover:underline transition-colors"
                      >
                        Terms and Conditions
                      </a>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleOpenPreferences}
                    className="px-4 py-2 rounded-xl border border-[#DCDCD5] dark:border-warm-600 text-[#5A5852] dark:text-grey-300 text-sm font-medium hover:bg-[#EFEFEA] dark:hover:bg-warm-800 transition-colors"
                  >
                    Preferences
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-5 py-2 rounded-xl bg-[#1C1917] dark:bg-warm-100 text-white dark:text-warm-900 text-sm font-semibold hover:bg-[#333] dark:hover:bg-warm-50 transition-colors"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CookiePreferencesModal
        open={showPreferences}
        onClose={handleClosePreferences}
        onSave={handleSavePreferences}
        existingConsent={existingConsent}
      />
    </>
  );
}
