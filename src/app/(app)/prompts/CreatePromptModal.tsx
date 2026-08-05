'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SPRING_CONFIGS } from '@/lib/feedback';

export function CreatePromptModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" className="flex items-center gap-2" onClick={() => setIsOpen(true)}>
        <Sparkles className="h-4 w-4 shrink-0 stroke-[1.5]" /> Create Prompt
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Unified Responsive Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={SPRING_CONFIGS.modal}
              className="fixed z-50 flex flex-col bg-card overflow-hidden inset-x-0 bottom-0 w-full rounded-t-[32px] pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] px-6 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-black/5 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:rounded-[24px] md:p-6 md:shadow-float md:border md:border-black/5"
            >
              {/* Mobile handle */}
              <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mb-6 shrink-0 md:hidden" />
              
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h2 className="text-2xl font-serif font-medium text-foreground tracking-tight">Create Prompt</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-full relative before:absolute before:-inset-2 before:content-['']">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4 overflow-y-auto max-h-[60vh] md:max-h-none md:overflow-visible pr-1 -mr-1">
                <div>
                  <label className="block text-sm font-sans font-medium text-foreground mb-1.5">Prompt Name</label>
                  <input type="text" placeholder="e.g., Q3 Brand Campaign" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-base md:text-sm font-sans text-foreground focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/50 transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-sans font-medium text-foreground mb-1.5">System Prompt</label>
                  <textarea rows={4} placeholder="Describe the persona or instructions for the AI..." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-base md:text-sm font-sans text-foreground focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/50 transition-all shadow-sm resize-none" />
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row md:justify-end gap-3 mt-8 shrink-0">
                <Button variant="secondary" className="w-full md:w-auto h-12 md:h-9" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button variant="primary" className="w-full md:w-auto h-12 md:h-9" onClick={() => setIsOpen(false)}>Save Prompt</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
