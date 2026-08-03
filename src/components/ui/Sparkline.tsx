'use client';

import React, { useEffect, useState } from 'react';

interface SparklineProps {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
  delay?: number; // seconds
  className?: string;
}

export function Sparkline({
  data = [12, 18, 14, 22, 28, 24, 34, 40],
  color = '#D9714A',
  width = 120,
  height = 40,
  delay = 0,
  className = '',
}: SparklineProps) {
  const [mounted, setMounted] = useState(false);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  // Approximate total path length for dasharray/dashoffset animation
  const totalLength = width * 1.5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <svg width={width} height={height} className={`overflow-visible ${className}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        strokeDasharray={totalLength}
        strokeDashoffset={mounted ? 0 : totalLength}
        style={{
          transition: `stroke-dashoffset 1.0s var(--ease-primary)`,
        }}
      />
    </svg>
  );
}
