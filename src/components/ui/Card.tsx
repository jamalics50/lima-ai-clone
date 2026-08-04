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
      className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm animate-card-mount transition-all duration-[180ms] ${className}`} 
      style={mountStyle}
      {...props} 
    />
  );
}

export function CardHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col space-y-1.5 p-5 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-sans text-lg font-medium tracking-tight text-foreground ${className}`} {...props} />;
}

export function CardDescription({ className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-muted-foreground ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 pt-0 ${className}`} {...props} />;
}

export function CardFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex items-center p-5 pt-0 ${className}`} {...props} />;
}
