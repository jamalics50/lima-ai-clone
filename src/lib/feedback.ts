/**
 * Tactile/Haptic Feedback Utility
 * - Triggers real device vibration where supported (Android Chrome/Firefox)
 * - Dispatches `app:feedback` custom event for motion components to react to
 * - Respects `prefers-reduced-motion` and user's "Interface feedback" toggle
 */

export type FeedbackType = 'tap' | 'success' | 'warning' | 'error' | 'select';

// ── Centralized vibration patterns (ms durations) ─────────────────────────────
export const VIBRATION_PATTERNS: Record<FeedbackType, number | number[]> = {
  tap:     8,
  select:  6,
  success: [10, 40, 15],
  warning: [15, 60, 15],
  error:   [20, 50, 20, 50, 20],
};

// ── Centralized spring configs for Framer Motion ──────────────────────────────
export const SPRING_CONFIGS = {
  press:  { type: 'spring' as const, stiffness: 500, damping: 30, mass: 0.8 },
  modal:  { type: 'spring' as const, stiffness: 400, damping: 28, mass: 0.9 },
  slide:  { type: 'spring' as const, stiffness: 320, damping: 32, mass: 1.0 },
  gentle: { type: 'spring' as const, stiffness: 240, damping: 26, mass: 1.0 },
};

// ── Duration constants (ms) ───────────────────────────────────────────────────
export const FEEDBACK_DURATIONS = {
  press:          120,
  successPulse:   350,
  errorShake:     150,
  confirmLabel:  1200,
  criterionTick:   60,
};

// ── Is feedback enabled? (reads localStorage, defaults true) ─────────────────
export function isFeedbackEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const val = window.localStorage.getItem('feedback-enabled');
  return val === null ? true : val === 'true';
}

export function setFeedbackEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('feedback-enabled', String(enabled));
  // Notify any listeners (e.g. the hook) immediately
  window.dispatchEvent(new CustomEvent('app:feedback-settings', { detail: { enabled } }));
}

// ── Core trigger ─────────────────────────────────────────────────────────────
export function triggerFeedback(type: FeedbackType): void {
  if (typeof window === 'undefined') return;
  if (!isFeedbackEnabled()) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A. Real device vibration — feature-detected, silently no-ops on desktop/iOS
  if (!prefersReducedMotion && 'vibrate' in navigator) {
    try {
      navigator.vibrate(VIBRATION_PATTERNS[type]);
    } catch {
      // Silent no-op — some browsers throw on invalid contexts
    }
  }

  // B. Custom event — motion components listen for this to animate
  window.dispatchEvent(
    new CustomEvent('app:feedback', {
      detail: { type, reducedMotion: prefersReducedMotion },
    })
  );
}
