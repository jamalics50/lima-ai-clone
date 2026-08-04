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
    primary:   'bg-coral text-white border-transparent shadow-sm hover:brightness-110 hover:scale-[1.02] hover:shadow-soft',
    secondary: 'bg-white border-border text-foreground shadow-sm hover:bg-zinc-50 hover:border-black/20',
    tertiary:  'border-transparent text-muted-foreground hover:text-foreground hover:bg-black/5',
    outline:   'border-border text-foreground bg-transparent hover:bg-black/5 hover:border-black/20',
    ghost:     'border-transparent text-muted-foreground hover:text-foreground hover:bg-black/5',
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
