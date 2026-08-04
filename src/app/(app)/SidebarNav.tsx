'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageSquare, Users, BookOpen, FileText, Settings, LogOut } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import { SPRING_CONFIGS } from '@/lib/feedback';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navigation = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Mentions', href: '/mentions', icon: MessageSquare },
  { name: 'Competitors', href: '/competitors', icon: Users },
  { name: 'Prompts', href: '/prompts', icon: BookOpen },
  { name: 'Audit', href: '/audit', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

/**
 * Client-side sidebar nav with:
 * - Active route detection via usePathname()
 * - Framer Motion layoutId pill that springs to the active item
 * - triggerFeedback('select') on nav item click
 */
export function SidebarNav() {
  const pathname = usePathname();
  const { trigger } = useFeedback();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <nav className="flex flex-1 flex-col px-4 py-4 space-y-0.5">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => trigger('select')}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-sans font-medium transition-colors duration-150 ${
                active
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {/* Sliding background pill — springs to the active item */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-lg bg-surface-2 border border-border"
                    transition={SPRING_CONFIGS.slide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
              <item.icon className="relative z-10 h-4 w-4 shrink-0" />
              <span className="relative z-10">{item.name}</span>
              {/* Coral dot accent for active item */}
              {active && (
                <motion.div
                  layoutId="sidebar-active-dot"
                  className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-coral"
                  transition={SPRING_CONFIGS.slide}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            onClick={() => trigger('tap')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-sans font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors duration-150"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}
