/**
 * Cookie Consent Utilities
 * Handles cookie management and consent state persistence
 */

export interface CookieConsentState {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  timestamp: number;
  expiresAt: number;
}

export interface ConsentOptions {
  essential: boolean;
  analytics?: boolean;
  functional?: boolean;
  marketing?: boolean;
}

const CONSENT_KEY = 'cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

/**
 * Get the consent state from localStorage and cookies
 */
export function getConsentState(): CookieConsentState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;

    const state: CookieConsentState = JSON.parse(stored);

    // Check if consent has expired
    if (Date.now() > state.expiresAt) {
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

/**
 * Save consent state to localStorage and cookie
 */
export function saveConsentState(consent: Partial<ConsentOptions>): CookieConsentState {
  const now = Date.now();
  const expiresAt = now + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  const state: CookieConsentState = {
    essential: true, // Essential is always true
    analytics: consent.analytics ?? false,
    functional: consent.functional ?? false,
    marketing: consent.marketing ?? false,
    timestamp: now,
    expiresAt,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state));

    // Set cookie with SameSite=Lax; Secure
    const cookieValue = btoa(JSON.stringify(state));
    const cookieExpiration = new Date(expiresAt).toUTCString();
    document.cookie = `${CONSENT_KEY}=${cookieValue}; expires=${cookieExpiration}; path=/; SameSite=Lax; Secure`;
  }

  return state;
}

/**
 * Check if consent has been given for a specific category
 */
export function hasConsent(category: 'essential' | 'analytics' | 'functional' | 'marketing'): boolean {
  const state = getConsentState();
  if (!state) return false;

  return state[category] === true;
}

/**
 * Check if essential cookies have been accepted (for basic consent)
 */
export function hasBasicConsent(): boolean {
  const state = getConsentState();
  if (!state) return false;
  
  return state.essential === true;
}

/**
 * Clear consent state (for testing or reset)
 */
export function clearConsentState(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(CONSENT_KEY);
  document.cookie = `${CONSENT_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

/**
 * Check if consent is needed (user hasn't accepted yet)
 */
export function needsConsent(): boolean {
  return getConsentState() === null;
}
