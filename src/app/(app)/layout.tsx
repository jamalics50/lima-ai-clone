import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { FloatingHeader } from './FloatingHeader';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the first workspace for this user (graceful fallback if none)
  const { data: workspaceMembers } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(name)')
    .eq('user_id', user.id)
    .limit(1);

  const workspaceId = workspaceMembers?.[0]?.workspace_id ?? null;
  const rawWorkspaces = workspaceMembers?.[0]?.workspaces as unknown;
  const workspaceObj = Array.isArray(rawWorkspaces) ? rawWorkspaces[0] : rawWorkspaces;
  const workspaceName = (workspaceObj as { name?: string })?.name || 'My Workspace';

  // Only redirect to onboarding if we have a workspace AND it has explicitly 0 brands.
  if (workspaceId) {
    const { count } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId);

    if (count === 0) {
      redirect('/onboarding');
    }
  }

  const initial = user.email ? user.email.charAt(0).toUpperCase() : 'U';
  const email = user.email || '';

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-page text-foreground relative">
      {/* Living Ambient Background */}
      <AmbientBackground />

      {/* Main content — sits on z-10 */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        
        {/* Floating Header Handles Navigation, Brand, and User Dropdown */}
        <FloatingHeader workspaceName={workspaceName} initial={initial} email={email} />

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-[calc(3rem+env(safe-area-inset-bottom))] pt-28">
          <div className="max-w-[1200px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
