import React from 'react';

interface CircularGaugeProps {
  percentage: number; // 0 to 100
  variant?: 'coral' | 'sky-blue';
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CircularGauge({ 
  percentage, 
  variant = 'coral',
  size = 120, 
  strokeWidth = 8,
  className = '' 
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const strokeColor = variant === 'coral' ? '#D9714A' : '#3FA9E0';

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        {/* Numbers stay in font-sans (Inter) as required */}
        <span className="font-sans text-3xl font-semibold tracking-tight text-[#F5F1EA]">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
