import React from 'react';

interface CircularGaugeProps {
  percentage: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CircularGauge({ 
  percentage, 
  size = 120, 
  strokeWidth = 8,
  className = '' 
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-accent transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-serif text-3xl font-medium tracking-tight text-foreground">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
