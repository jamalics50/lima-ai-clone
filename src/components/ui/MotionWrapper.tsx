'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionWrapperProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function MotionWrapper({ children, delay = 0, className = '' }: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 1, 0.5, 1], // Custom spring-like curve
        delay: delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
