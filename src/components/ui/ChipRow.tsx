'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface ChipRowProps {
  items: React.ReactNode[];
  speed?: number; // duration of one full loop in seconds
}

export function ChipRow({ items, speed = 40 }: ChipRowProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div 
      className="flex overflow-hidden relative w-full group pointer-events-none"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
      }}
    >
      <motion.div
        className="flex whitespace-nowrap gap-3 py-4 pr-3"
        animate={prefersReducedMotion ? {} : { x: ['0%', '-100%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
      >
        {items.map((item, i) => (
          <div key={`chip-a-${i}`} className="inline-flex items-center rounded-full bg-white border border-black/5 px-5 py-2 shadow-sm text-sm font-sans font-medium text-foreground shrink-0 pointer-events-auto hover:-translate-y-0.5 hover:shadow-soft transition-all duration-200">
            {item}
          </div>
        ))}
      </motion.div>
      <motion.div
        className="flex whitespace-nowrap gap-3 py-4 pr-3 absolute top-0"
        style={{ left: '100%' }}
        animate={prefersReducedMotion ? {} : { x: ['0%', '-100%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
        aria-hidden="true"
      >
        {items.map((item, i) => (
          <div key={`chip-b-${i}`} className="inline-flex items-center rounded-full bg-white border border-black/5 px-5 py-2 shadow-sm text-sm font-sans font-medium text-foreground shrink-0 pointer-events-auto hover:-translate-y-0.5 hover:shadow-soft transition-all duration-200">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
