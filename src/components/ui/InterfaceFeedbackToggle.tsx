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
      {/* iOS Native-Style Toggle Switch */}
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          role="switch"
          aria-checked={enabled}
          checked={enabled}
          onChange={handleToggle}
          className="sr-only peer"
        />
        <div className="w-12 h-7 bg-black/15 dark:bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[20px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:duration-300 after:shadow-md peer-checked:bg-coral transition-colors duration-300"></div>
      </label>
    </div>
  );
}
