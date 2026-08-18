"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  getConsentState,
  saveConsentState,
  hasConsent,
  needsConsent,
  type CookieConsentState,
  type ConsentOptions,
} from '@/lib/cookie-utils';

interface UseCookieConsentReturn {
  consent: CookieConsentState | null;
  needsConsent: () => boolean;
  acceptAll: () => void;
  declineAll: () => void;
  updateConsent: (options: Partial<ConsentOptions>) => void;
  hasAnalytics: boolean;
  hasFunctional: boolean;
  hasMarketing: boolean;
}

export function useCookieConsent(): UseCookieConsentReturn {
  const [consent, setConsent] = useState<CookieConsentState | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Check if component is mounted (for SSR safety)
  useEffect(() => {
    setIsMounted(true);
    const storedConsent = getConsentState();
    setConsent(storedConsent);
  }, []);

  const checkAnalytics = useCallback(() => hasConsent('analytics'), []);
  const checkFunctional = useCallback(() => hasConsent('functional'), []);
  const checkMarketing = useCallback(() => hasConsent('marketing'), []);

  const updateConsentState = useCallback((consentState: CookieConsentState) => {
    setConsent(consentState);
  }, []);

  const acceptAll = useCallback(() => {
    const state = saveConsentState({
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    });
    updateConsentState(state);
  }, [updateConsentState]);

  const declineAll = useCallback(() => {
    const state = saveConsentState({
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    });
    updateConsentState(state);
  }, [updateConsentState]);

  const updateConsent = useCallback((options: Partial<ConsentOptions>) => {
    const state = saveConsentState(options);
    updateConsentState(state);
  }, [updateConsentState]);

  return {
    consent,
    needsConsent: () => consent === null,
    acceptAll,
    declineAll,
    updateConsent,
    hasAnalytics: checkAnalytics(),
    hasFunctional: checkFunctional(),
    hasMarketing: checkMarketing(),
  };
}

export default useCookieConsent;