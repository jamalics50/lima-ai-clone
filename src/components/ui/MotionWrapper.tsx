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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1], // Custom spring-like curve
        delay: delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
