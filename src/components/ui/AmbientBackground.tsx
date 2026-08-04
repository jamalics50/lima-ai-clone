'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function AmbientBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device to skip mouse tracking
    if (typeof window !== 'undefined') {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    }

    if (prefersReducedMotion || isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse offset from center (-1 to 1)
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const x = (e.clientX - cx) / cx;
      const y = (e.clientY - cy) / cy;

      setMousePos({ x: x * 12, y: y * 12 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion, isTouchDevice]);

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none" 
      aria-hidden="true"
    >
      {/* Blob 1: Coral / Peach (Upper-Left) */}
      <motion.div
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full mix-blend-multiply opacity-20"
        style={{
          background: 'radial-gradient(circle, #e0663f 0%, #ea7a56 100%)',
          filter: 'blur(130px)',
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, 40, -20, 0],
                y: [0, -30, 25, 0],
                scale: [1, 1.08, 0.95, 1],
              }
        }
        transition={{
          duration: 55,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Blob 2: Sky Blue (Upper-Right) */}
      <motion.div
        className="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] max-w-[750px] max-h-[750px] rounded-full mix-blend-multiply opacity-20"
        style={{
          background: 'radial-gradient(circle, #3b82f6 0%, #93c5fd 100%)',
          filter: 'blur(140px)',
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, -45, 30, 0],
                y: [0, 35, -20, 0],
                scale: [1, 0.94, 1.06, 1],
              }
        }
        transition={{
          duration: 65,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Blob 3: Blush Pink (Lower-Right) */}
      <motion.div
        className="absolute -bottom-[15%] right-[10%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] rounded-full mix-blend-multiply opacity-25"
        style={{
          background: 'radial-gradient(circle, #e9c9e6 0%, #f7ece0 100%)',
          filter: 'blur(120px)',
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, -30, 20, 0],
                y: [0, -25, 30, 0],
                scale: [1, 1.05, 0.96, 1],
              }
        }
        transition={{
          duration: 75,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Dynamic Magnetic Cursor Layer */}
      {!prefersReducedMotion && !isTouchDevice && (
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          }}
        />
      )}

      {/* Subtle Dot-Grid Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#17181c 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
