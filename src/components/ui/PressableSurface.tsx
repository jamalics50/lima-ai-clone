'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, type HTMLMotionProps } from 'framer-motion';
import { SPRING_CONFIGS, type FeedbackType } from '@/lib/feedback';

interface PressableSurfaceProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  disabled?: boolean;
  /** Which feedback event triggers the glow ring — defaults to listening to all */
  watchType?: FeedbackType | FeedbackType[];
  /** Skip the press-scale (e.g. for table rows that shouldn't shift layout) */
  noScale?: boolean;
}

/**
 * A Framer Motion wrapper that adds:
 * - Spring-physics press scale (whileTap scale: 0.97)
 * - Accent-colored glow ring flash on `app:feedback` events
 * - Respects `prefers-reduced-motion`
 *
 * Usage: wrap any interactive element. All existing props/handlers pass through.
 */
export function PressableSurface({
  children,
  disabled = false,
  watchType,
  noScale = false,
  className = '',
  ...props
}: PressableSurfaceProps) {
  const controls = useAnimation();
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleFeedback = useCallback(
    (e: Event) => {
      const { type, reducedMotion } = (e as CustomEvent).detail as {
        type: FeedbackType;
        reducedMotion: boolean;
      };

      // If watchType is set, only react to matching types
      if (watchType) {
        const watched = Array.isArray(watchType) ? watchType : [watchType];
        if (!watched.includes(type)) return;
      }

      if (reducedMotion) {
        // Color-only flash (no motion) — still feels acknowledged
        controls.start({
          boxShadow: type === 'error'
            ? '0 0 0 2px rgba(248,113,113,0.6)'
            : '0 0 0 2px rgba(230,112,74,0.5)',
          transition: { duration: 0.1 },
        }).then(() =>
          controls.start({ boxShadow: '0 0 0 0px transparent', transition: { duration: 0.25 } })
        );
      } else {
        // Full spring glow flash
        controls.start({
          boxShadow: type === 'error'
            ? '0 0 0 2px rgba(248,113,113,0.6), 0 0 16px rgba(248,113,113,0.3)'
            : type === 'success'
            ? '0 0 0 2px rgba(52,211,153,0.6), 0 0 16px rgba(52,211,153,0.25)'
            : '0 0 0 2px rgba(230,112,74,0.5)',
          transition: { duration: 0.08 },
        }).then(() =>
          controls.start({ boxShadow: '0 0 0 0px transparent', transition: { duration: 0.32 } })
        );
      }
    },
    [controls, watchType]
  );

  useEffect(() => {
    window.addEventListener('app:feedback', handleFeedback);
    return () => window.removeEventListener('app:feedback', handleFeedback);
  }, [handleFeedback]);

  return (
    <motion.div
      animate={controls}
      whileTap={!disabled && !noScale && !prefersReduced.current
        ? { scale: 0.97 }
        : undefined}
      transition={SPRING_CONFIGS.press}
      className={`rounded-[inherit] ${className}`}
      style={{ display: 'contents', ...props.style }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
