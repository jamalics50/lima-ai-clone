'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageSquare, Users, BookOpen, FileText, Settings } from 'lucide-react';
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
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function TopNav() {
  const pathname = usePathname();
  const { trigger } = useFeedback();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="flex items-center gap-1 bg-white/70 backdrop-blur-xl border border-black/5 rounded-full p-1 shadow-sm">
      {navigation.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => trigger('select')}
            className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-sans font-medium transition-colors duration-150 ${
              active
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-black/5'
            }`}
          >
            {/* Sliding background pill — springs to the active item */}
            <AnimatePresence>
              {active && (
                <motion.div
                  layoutId="topnav-active-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-soft border border-black/5"
                  transition={SPRING_CONFIGS.slide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            <item.icon className="relative z-10 h-4 w-4 shrink-0" />
            <span className="relative z-10">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
