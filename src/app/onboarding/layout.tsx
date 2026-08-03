import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#141210] text-[#F5F1EA]">
      <div className="w-full max-w-2xl px-8">
        <div className="mb-8 flex items-center justify-center">
            <span className="font-serif font-medium text-2xl tracking-tight text-[#F5F1EA]">LIMA AI</span>
        </div>
        {children}
      </div>
    </div>
  );
}
