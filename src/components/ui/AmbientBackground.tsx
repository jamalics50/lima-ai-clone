'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export function AmbientBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

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
      <style>{`
        @keyframes ambient-blob1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.08); }
          66% { transform: translate(-20px, 25px) scale(0.95); }
        }
        @keyframes ambient-blob2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-45px, 35px) scale(0.94); }
          66% { transform: translate(30px, -20px) scale(1.06); }
        }
        @keyframes ambient-blob3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-30px, -25px) scale(1.05); }
          66% { transform: translate(20px, 30px) scale(0.96); }
        }
        .animate-blob1 { animation: ambient-blob1 55s ease-in-out infinite; will-change: transform; }
        .animate-blob2 { animation: ambient-blob2 65s ease-in-out infinite; will-change: transform; }
        .animate-blob3 { animation: ambient-blob3 75s ease-in-out infinite; will-change: transform; }
        .pause-animation { animation-play-state: paused !important; }
      `}</style>

      {/* Blob 1: Coral / Peach (Upper-Left) */}
      <div
        className={`absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full mix-blend-multiply opacity-20 blur-[80px] md:blur-[130px] ${!prefersReducedMotion ? 'animate-blob1' : ''} ${isScrolling ? 'pause-animation' : ''}`}
        style={{
          background: 'radial-gradient(circle, #e0663f 0%, #ea7a56 100%)',
        }}
      />

      {/* Blob 2: Sky Blue (Upper-Right) */}
      <div
        className={`absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] max-w-[750px] max-h-[750px] rounded-full mix-blend-multiply opacity-20 blur-[80px] md:blur-[140px] ${!prefersReducedMotion ? 'animate-blob2' : ''} ${isScrolling ? 'pause-animation' : ''}`}
        style={{
          background: 'radial-gradient(circle, #3b82f6 0%, #93c5fd 100%)',
        }}
      />

      {/* Blob 3: Blush Pink (Lower-Right) - Hidden on mobile for perf */}
      <div
        className={`hidden md:block absolute -bottom-[15%] right-[10%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] rounded-full mix-blend-multiply opacity-25 blur-[120px] ${!prefersReducedMotion ? 'animate-blob3' : ''} ${isScrolling ? 'pause-animation' : ''}`}
        style={{
          background: 'radial-gradient(circle, #e9c9e6 0%, #f7ece0 100%)',
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
