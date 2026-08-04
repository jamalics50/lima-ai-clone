'use client';

import { useCallback } from 'react';
import { triggerFeedback, type FeedbackType } from '@/lib/feedback';

/**
 * Returns a stable `trigger(type)` function that calls triggerFeedback().
 * Safe to call inside any existing event handler without changing its logic.
 *
 * Usage:
 *   const { trigger } = useFeedback();
 *   const handleClick = () => {
 *     trigger('tap');          // <-- add this line
 *     existingLogic();         // <-- this is unchanged
 *   };
 */
export function useFeedback() {
  const trigger = useCallback((type: FeedbackType) => {
    triggerFeedback(type);
  }, []);

  return { trigger };
}
