'use client';

import React, { useEffect, useState } from 'react';

interface PercentileBarProps {
  score: number; // 0 to 100
  average?: number; // 0 to 100
  className?: string;
}

export function PercentileBar({ score, average = 50, className = '' }: PercentileBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const clampedScore = Math.min(Math.max(score, 0), 100);
  const clampedAverage = Math.min(Math.max(average, 0), 100);

  return (
    <div className={`w-full pt-8 pb-1 ${className}`}>
      <div className="relative h-2 w-full rounded-full bg-black/10 dark:bg-white/10">
        {/* Average Tick & Label */}
        <div 
          className="absolute h-4 w-0.5 bg-foreground/30 -top-1 z-10 pointer-events-none"
          style={{ left: `${clampedAverage}%` }}
        >
          <span 
            className="absolute top-5 text-[10px] font-sans font-medium text-muted-foreground whitespace-nowrap"
            style={{ transform: `translateX(-${clampedAverage}%)` }}
          >
            Avg {clampedAverage}%
          </span>
        </div>
        
        {/* User Score Filled Track (Coral) */}
        <div 
          className="absolute h-full rounded-full bg-coral transition-all duration-[600ms] ease-out"
          style={{ width: mounted ? `${clampedScore}%` : '0%' }}
        />
        
        {/* User Score Thumb Dot */}
        <div 
          className="absolute h-3.5 w-3.5 rounded-full bg-coral border-2 border-white dark:border-zinc-900 shadow-md -top-[3px] transition-all duration-[600ms] ease-out z-20"
          style={{ left: mounted ? `calc(${clampedScore}% - 7px)` : '-7px' }}
        >
          {/* Soft Translucent Glass "You" Tooltip Badge with Coral Accent Border & Text */}
          <div className="absolute bottom-full mb-1 left-1/2 flex flex-col items-center pointer-events-none z-30">
            <div 
              className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold text-coral shadow-sm border border-coral/40 whitespace-nowrap bg-white/90 dark:bg-white/95 backdrop-blur-md backdrop-saturate-140"
              style={{ transform: `translateX(-${clampedScore}%)` }}
            >
              You
            </div>
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white/90 dark:border-t-white/95 -mt-[1px]" />
          </div>
        </div>
      </div>

      {/* 0% and 100% Bounds Labels */}
      <div className="flex justify-between text-[10px] font-sans font-medium text-muted-foreground mt-3">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
