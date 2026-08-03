'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number; // ms, default 900
  delay?: number; // ms, default 0
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 900,
  delay = 0,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const startVal = 0;
    const endVal = value;

    const timeoutId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing: cubic-bezier(.22,1,.36,1) approximation for smooth count up
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startVal + (endVal - startVal) * easeProgress);

        setDisplayValue(current);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setDisplayValue(endVal);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration, delay]);

  const formatted = value >= 1000 ? displayValue.toLocaleString() : displayValue.toString();

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
