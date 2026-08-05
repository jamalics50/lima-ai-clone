'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageSquare, Users, BookOpen, FileText, Settings, LogOut, ChevronDown, PlusCircle } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import { SPRING_CONFIGS } from '@/lib/feedback';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navigation: NavItem[] = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Mentions', href: '/mentions', icon: MessageSquare },
  { name: 'Competitors', href: '/competitors', icon: Users },
  { name: 'Prompts', href: '/prompts', icon: BookOpen },
  { name: 'Audit', href: '/audit', icon: FileText },
  { name: 'Monitor Brand', href: '/onboarding', icon: PlusCircle },
];

export function FloatingHeader({ workspaceName, initial, email }: { workspaceName?: string, initial?: string, email?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { trigger } = useFeedback();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4 md:pt-6 pointer-events-none transition-all duration-200">
      <div 
        className={`pointer-events-auto flex items-center justify-between transition-all duration-300 w-full max-w-5xl rounded-[32px] border border-black/5 ${
          isScrolled 
            ? 'h-14 px-6 bg-white/80 backdrop-blur-[20px] backdrop-saturate-[1.4] shadow-soft scale-[0.98] -translate-y-1'
            : 'h-16 px-8 bg-white/70 backdrop-blur-[16px] backdrop-saturate-[1.3] shadow-float scale-100'
        }`}
      >
        {/* Left: Brand / Workspace */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-white shadow-sm flex items-center justify-center border border-black/5">
            <span className="font-serif font-bold text-coral text-lg">L</span>
          </div>
          <div className="hidden md:flex flex-col justify-center h-full pb-0.5">
            <span className="font-sans font-bold text-[14px] tracking-tight text-foreground leading-none">LIMA AI</span>
            <span className="text-[11px] text-muted-foreground font-medium">{workspaceName}</span>
          </div>
        </div>

        {/* Center: Navigation Links (Text only as requested) */}
        <nav className="flex items-center gap-1 mx-4">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => trigger('select')}
                className={`relative flex items-center justify-center rounded-full px-4 py-2 text-[14px] font-sans transition-colors duration-150 ${
                  active
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground font-medium hover:text-foreground hover:bg-black/5'
                }`}
              >
                <AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="topnav-active-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-sm border border-black/5"
                      transition={SPRING_CONFIGS.slide}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10 hidden sm:inline">{item.name}</span>
                <item.icon className="relative z-10 h-4 w-4 shrink-0 sm:hidden" />
              </Link>
            );
          })}
        </nav>

        {/* Right: User Dropdown or Logged Out State */}
        <div className="relative shrink-0 flex items-center">
          {email ? (
            <>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-black/5 p-1 pr-3 rounded-full transition-colors"
              >
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-sans font-bold bg-coral text-white shadow-sm">
                  {initial}
                </div>
                <span className="text-[13px] font-medium text-foreground hidden sm:block truncate max-w-[120px]">{email}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={SPRING_CONFIGS.modal}
                      className="absolute right-0 top-full mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-[20px] shadow-float border border-black/5 overflow-hidden py-2 z-50"
                    >
                      <Link href="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-[14px] font-medium text-foreground hover:bg-black/5 transition-colors">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        Settings
                      </Link>
                      <div className="h-px w-full bg-black/5 my-1" />
                      <form action="/auth/signout" method="post">
                        <button type="submit" className="flex w-full items-center gap-3 px-5 py-2.5 text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </form>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </>
          ) : (
            <Link href="/login" className="text-sm font-sans font-medium text-foreground hover:text-coral transition-colors px-4">
              Log in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
