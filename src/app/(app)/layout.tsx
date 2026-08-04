import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { FloatingHeader } from './FloatingHeader';

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
    <div className="flex h-screen overflow-hidden bg-[#fafafa] text-foreground relative">
      {/* Soft floating clouds ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden mix-blend-multiply opacity-50" aria-hidden="true">
        <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] rounded-full blur-[120px] bg-coral/5" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] bg-sky/5" />
      </div>

      {/* Main content — sits on z-10 */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        
        {/* Floating Header Handles Navigation, Brand, and User Dropdown */}
        <FloatingHeader workspaceName={workspaceName} initial={initial} email={email} />

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto px-8 pb-12 pt-28">
          <div className="max-w-[1200px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
