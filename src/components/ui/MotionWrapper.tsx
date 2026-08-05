'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';

interface MotionWrapperProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function MotionWrapper({ children, delay = 0, className = '' }: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    }
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: isMobile ? 0.4 : 0.6, 
        ease: [0.22, 1, 0.36, 1], // Custom spring-like curve
        delay: delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
