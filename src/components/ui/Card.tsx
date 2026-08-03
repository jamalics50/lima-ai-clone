import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number; // Delay in seconds for mount stagger (e.g. 0.1, 0.2)
}

export function Card({ className = '', delay = 0, style, ...props }: CardProps) {
  const mountStyle: React.CSSProperties = {
    ...style,
    animationDelay: `${delay}s`,
  };

  return (
    <div 
      className={`rounded-2xl border border-white/8 bg-[#1C1917] text-[#F5F1EA] shadow-none animate-card-mount hover:-translate-y-[3px] hover:border-white/20 transition-all duration-[180ms] ${className}`} 
      style={mountStyle}
      {...props} 
    />
  );
}

export function CardHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col space-y-1.5 p-5 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-serif text-lg font-medium tracking-tight text-[#F5F1EA] ${className}`} {...props} />;
}

export function CardDescription({ className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-[#9C978C] ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 pt-0 ${className}`} {...props} />;
}

export function CardFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex items-center p-5 pt-0 ${className}`} {...props} />;
}
