'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { SPRING_CONFIGS, triggerFeedback } from '@/lib/feedback';

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
  const baseStyles = 'relative before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:min-w-[44px] before:min-h-[44px] before:w-full before:h-full before:content-[\'\'] inline-flex items-center justify-center font-sans font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 disabled:opacity-50 disabled:pointer-events-none rounded-full border cursor-pointer hover:-translate-y-[1.5px] hover:scale-[1.015] active:-translate-y-0 active:scale-100';
  
  const variants = {
    primary:   'bg-coral text-white border-transparent shadow-[0_2px_6px_rgba(224,102,63,0.25),0_8px_20px_rgba(224,102,63,0.15)] hover:brightness-105 active:shadow-sm',
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
      whileTap={!disabled ? { scale: 0.96, y: 0 } : undefined}
      transition={SPRING_CONFIGS.press}
      onClick={(e) => {
        if (!disabled) triggerFeedback('tap');
        if (props.onClick) props.onClick(e);
      }}
      {...(props as React.ComponentProps<typeof motion.button>)}
    />
  );
}
