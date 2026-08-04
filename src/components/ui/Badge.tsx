import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline';
}

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-sans font-medium tracking-wide transition-colors focus:outline-none';
  
  const variants = {
    default: 'border-transparent bg-zinc-100 text-foreground',
    secondary: 'border-transparent bg-transparent text-muted-foreground',
    outline: 'border-black/10 text-foreground',
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <div className={classes} {...props} />
  );
}
