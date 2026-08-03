import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline';
}

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2';
  
  const variants = {
    default: 'border-transparent bg-accent text-accent-foreground hover:bg-accent/80',
    secondary: 'border-transparent bg-muted text-muted-foreground hover:bg-muted/80',
    outline: 'text-foreground',
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <div className={classes} {...props} />
  );
}
