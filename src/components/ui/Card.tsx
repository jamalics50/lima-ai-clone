import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number; // Delay in seconds for mount stagger (e.g. 0.1, 0.2)
  interactive?: boolean; // Whether to apply hover lift and shadow
}

export function Card({ className = '', delay = 0, interactive = false, style, ...props }: CardProps) {
  const mountStyle: React.CSSProperties = {
    ...style,
    animationDelay: `${delay}s`,
  };

  return (
    <div 
      className={`liquid-glass rounded-2xl border border-black/5 text-card-foreground shadow-float transition-all duration-[240ms] ease-out ${
        interactive ? 'hover:-translate-y-[2px] hover:shadow-float-hover hover:bg-white/50' : ''
      } ${className}`} 
      style={mountStyle}
      {...props} 
    />
  );
}

export function CardHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col space-y-1.5 p-4 md:p-7 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-sans text-lg font-medium tracking-tight text-foreground ${className}`} {...props} />;
}

export function CardDescription({ className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-muted-foreground ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-4 md:p-7 pt-0 md:pt-0 ${className}`} {...props} />;
}

export function CardFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex items-center p-4 md:p-7 pt-0 md:pt-0 ${className}`} {...props} />;
}
