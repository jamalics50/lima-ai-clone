import React from 'react';

interface PercentileBarProps {
  score: number; // 0 to 100
  average?: number; // 0 to 100
  className?: string;
}

export function PercentileBar({ score, average = 50, className = '' }: PercentileBarProps) {
  return (
    <div className={`w-full space-y-2 mt-4 ${className}`}>
      {/* Numbers in font-sans (Inter) */}
      <div className="flex justify-between text-xs font-sans font-medium text-[#9C978C] mb-1">
        <span>0</span>
        <span>100</span>
      </div>
      {/* Visible background track in Sky Blue 25% opacity */}
      <div className="relative h-2 w-full rounded-full bg-[#3FA9E0]/25">
        {/* Average Marker */}
        <div 
          className="absolute h-4 w-0.5 bg-white/40 -top-1 z-10"
          style={{ left: `${average}%` }}
        >
           <span className="absolute -top-5 -translate-x-1/2 text-[10px] font-sans text-[#9C978C] whitespace-nowrap">Avg {average}</span>
        </div>
        
        {/* User Score Bar in Coral */}
        <div 
          className="absolute h-full rounded-full bg-[#D9714A] transition-all duration-1000 ease-out"
          style={{ width: `${score}%` }}
        />
        
        {/* User Score Marker in Coral ("this is you") */}
        <div 
          className="absolute h-4 w-1 bg-[#D9714A] rounded-full -top-1 transition-all duration-1000 ease-out z-20"
          style={{ left: `calc(${score}% - 2px)` }}
        >
          <span className="absolute -bottom-5 -translate-x-1/2 text-[10px] font-sans font-bold text-[#D9714A] whitespace-nowrap">You</span>
        </div>
      </div>
    </div>
  );
}
