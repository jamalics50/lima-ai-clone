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

  return (
    <div className={`w-full space-y-2 mt-4 ${className}`}>
      {/* Numbers in font-sans (Inter) */}
      <div className="flex justify-between text-[11px] font-sans font-medium text-muted-foreground mb-1">
        <span>0</span>
        <span>100</span>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-white/10">
        {/* Average Marker */}
        <div 
          className="absolute h-4 w-0.5 bg-white/40 -top-1 z-10"
          style={{ left: `${average}%` }}
        >
           <span className="absolute -top-5 -translate-x-1/2 text-[10px] font-sans text-muted-foreground whitespace-nowrap">Avg {average}</span>
        </div>
        
        {/* User Score Bar in Coral */}
        <div 
          className="absolute h-full rounded-full bg-coral transition-all duration-[600ms] ease-out"
          style={{ width: mounted ? `${score}%` : '0%' }}
        />
        
        {/* User Score Marker in Coral ("this is you") */}
        <div 
          className="absolute h-3 w-1 bg-coral rounded-full -top-0.5 transition-all duration-[600ms] ease-out z-20"
          style={{ left: mounted ? `calc(${score}% - 2px)` : '-2px' }}
        >
          <span className="absolute -bottom-5 -translate-x-1/2 text-[10px] font-sans font-bold text-coral whitespace-nowrap">You</span>
        </div>
      </div>
    </div>
  );
}
