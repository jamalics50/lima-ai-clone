import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#f5f4f1] text-foreground relative p-4 overflow-x-hidden">
      <AmbientBackground />

      <div className="w-full max-w-2xl relative z-10 py-8">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white shadow-soft flex items-center justify-center border border-black/5">
            <span className="font-serif font-bold text-coral text-xl">L</span>
          </div>
          <span className="font-serif font-medium text-2xl tracking-tight text-foreground">LIMA AI</span>
        </div>
        {children}
      </div>
    </div>
  );
}
