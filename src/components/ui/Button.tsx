import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none ring-offset-background rounded-full';
  
  const variants = {
    primary: 'bg-accent text-accent-foreground hover:bg-accent/90',
    secondary: 'border border-accent text-accent bg-transparent hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-border hover:bg-muted text-foreground',
    ghost: 'hover:bg-muted hover:text-foreground text-muted-foreground',
  };

  const sizes = {
    sm: 'h-9 px-6 text-sm',
    md: 'h-10 py-2 px-8 text-sm',
    lg: 'h-11 px-10 text-base',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props} />
  );
}
