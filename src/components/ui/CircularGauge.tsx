'use client';

import React, { useEffect, useState } from 'react';
import { AnimatedNumber } from './AnimatedNumber';

interface CircularGaugeProps {
  percentage: number; // 0 to 100
  variant?: 'coral' | 'sky-blue';
  size?: number;
  strokeWidth?: number;
  delay?: number; // stagger delay in seconds (e.g., 0.2, 0.4)
  className?: string;
}

export function CircularGauge({ 
  percentage, 
  variant = 'coral',
  size = 120, 
  strokeWidth = 8,
  delay = 0,
  className = '' 
}: CircularGaugeProps) {
  const [mounted, setMounted] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const targetOffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    // Trigger stroke animation on mount
    const timer = setTimeout(() => {
      setMounted(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  const strokeColor = variant === 'coral' ? 'var(--accent-primary)' : 'var(--accent-blue)';
  const currentOffset = mounted ? targetOffset : circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress ring with 1.1s cubic-bezier(.22,1,.36,1) transition */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={currentOffset}
          style={{
            transition: `stroke-dashoffset 600ms var(--ease-primary)`,
          }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        {/* Count up number in font-sans (Inter) */}
        <AnimatedNumber
          value={percentage}
          duration={900}
          delay={delay * 1000}
          suffix="%"
          className="font-sans text-3xl font-semibold tracking-tight text-foreground"
        />
      </div>
    </div>
  );
}
