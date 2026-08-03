import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9714A] disabled:opacity-50 disabled:pointer-events-none rounded-full border shadow-none hover:brightness-110 active:scale-[0.97] cursor-pointer';
  
  const variants = {
    primary: 'bg-[#D9714A] text-[#4A1B0C] border-transparent',
    secondary: 'border-[#3FA9E0] text-[#3FA9E0] bg-transparent hover:bg-[#3FA9E0]/10',
    tertiary: 'border-white/16 text-[#F5F1EA] bg-transparent hover:bg-white/10',
    outline: 'border-white/16 text-[#F5F1EA] bg-transparent hover:bg-white/10',
    ghost: 'border-transparent text-[#9C978C] hover:text-[#F5F1EA] hover:bg-white/5',
  };

  const sizes = {
    sm: 'h-9 px-6 text-sm',
    md: 'h-10 py-2 px-8 text-sm',
    lg: 'h-11 px-10 text-base',
  };

  const classes = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props} />
  );
}
