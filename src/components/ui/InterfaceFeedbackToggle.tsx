'use client';

import React, { useState, useEffect } from 'react';
import { setFeedbackEnabled, isFeedbackEnabled } from '@/lib/feedback';

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
        className={`relative inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 ${
          enabled ? 'bg-coral' : 'bg-[#E9E9EA] dark:bg-[#39393D]'
        }`}
      >
        <span
          className="pointer-events-none inline-block h-[27px] w-[27px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
          style={{ 
            transform: enabled ? 'translateX(20px)' : 'translateX(0px)',
            transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        />
      </button>
    </div>
  );
}
