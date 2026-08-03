import React from 'react';

interface PercentileBarProps {
  score: number; // 0 to 100
  average?: number; // 0 to 100
  className?: string;
}

export function PercentileBar({ score, average = 50, className = '' }: PercentileBarProps) {
  return (
    <div className={`w-full space-y-2 mt-4 ${className}`}>
      <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1">
        <span>0</span>
        <span>100</span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-muted">
        {/* Average Marker */}
        <div 
          className="absolute h-4 w-0.5 bg-foreground/30 -top-1 z-10"
          style={{ left: `${average}%` }}
        >
           <span className="absolute -top-5 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">Avg {average}</span>
        </div>
        
        {/* User Score Bar */}
        <div 
          className="absolute h-full rounded-full bg-accent transition-all duration-1000 ease-out"
          style={{ width: `${score}%` }}
        />
        
        {/* User Score Marker */}
        <div 
          className="absolute h-4 w-1 bg-accent rounded-full -top-1 transition-all duration-1000 ease-out z-20"
          style={{ left: `calc(${score}% - 2px)` }}
        >
          <span className="absolute -bottom-5 -translate-x-1/2 text-[10px] font-bold text-accent whitespace-nowrap">You</span>
        </div>
      </div>
    </div>
  );
}
