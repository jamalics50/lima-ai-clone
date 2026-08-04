'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { setFeedbackEnabled, isFeedbackEnabled } from '@/lib/feedback';
import { SPRING_CONFIGS } from '@/lib/feedback';

/**
 * Toggle that reads/writes the 'feedback-enabled' localStorage key.
 * Dispatches app:feedback-settings so the utility picks up the change immediately.
 */
export function InterfaceFeedbackToggle() {
  const [enabled, setEnabled] = useState(true);

  // Hydrate from localStorage on mount (avoids SSR mismatch)
  useEffect(() => {
    setEnabled(isFeedbackEnabled());
  }, []);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    setFeedbackEnabled(next);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-sm font-sans font-medium text-foreground">Interface feedback</p>
        <p className="text-xs font-sans text-muted-foreground max-w-xs">
          Spring animations, press states, and device vibration on supported hardware.
        </p>
      </div>
      {/* iOS-style pill toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 ${
          enabled ? 'bg-coral' : 'bg-black/15'
        }`}
      >
        <motion.span
          layout
          transition={SPRING_CONFIGS.press}
          className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md"
          style={{ translateX: enabled ? 20 : 0 }}
        />
      </button>
    </div>
  );
}
