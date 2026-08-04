'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { SPRING_CONFIGS } from '@/lib/feedback';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:opacity-50 disabled:pointer-events-none rounded-full border cursor-pointer';
  
  const variants = {
    primary:   'bg-coral text-coral-text border-transparent shadow-md hover:bg-coral-hover hover:shadow-glow',
    secondary: 'border-border text-foreground bg-surface-2 hover:bg-surface-glass shadow-sm',
    tertiary:  'border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5',
    outline:   'border-border text-foreground bg-transparent hover:bg-white/5 hover:border-white/20',
    ghost:     'border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5',
  };

  const sizes = {
    sm: 'h-8 px-4 text-xs',
    md: 'h-9 px-5 text-sm',
    lg: 'h-10 px-8 text-sm',
  };

  const classes = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`;

  // Wrap in motion.button for spring-physics press state on every button app-wide
  return (
    <motion.button
      className={classes}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.96 } : undefined}
      transition={SPRING_CONFIGS.press}
      {...(props as React.ComponentProps<typeof motion.button>)}
    />
  );
}
