import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Home, MessageSquare, Users, BookOpen, FileText, Settings } from 'lucide-react';
import { SidebarNav } from './SidebarNav';

const navigation = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Mentions', href: '/mentions', icon: MessageSquare },
  { name: 'Competitors', href: '/competitors', icon: Users },
  { name: 'Prompts', href: '/prompts', icon: BookOpen },
  { name: 'Audit', href: '/audit', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

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
  // If the brands table doesn't exist yet (SQL not run), count will be null — don't redirect.
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

  return (
    <div className="flex h-screen overflow-hidden text-foreground">
      {/* Fixed ambient background — 2 large radial glows, pointer-events-none so they never capture clicks */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.07] blur-[120px]" style={{ background: 'var(--accent-primary)' }} />
        <div className="absolute top-[10%] right-[-10%] w-[600px] h-[500px] rounded-full opacity-[0.05] blur-[100px]" style={{ background: 'var(--accent-blue)' }} />
      </div>
      {/* Sidebar — uses surface-1 (slightly lighter than bg-base) for subtle elevation */}
      <aside className="relative z-10 w-64 flex flex-col border-r border-border" style={{ background: 'var(--surface-1)' }}>
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
          <span className="font-sans font-semibold text-lg tracking-tighter text-foreground">LIMA AI</span>
        </div>
        {/* SidebarNav handles active state, spring pill, and feedback */}
        <SidebarNav navigation={navigation} />
      </aside>

      {/* Main content — sits on z-10 so ambient layer shows behind sidebar glass */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Topbar — glassy blur over ambient */}
        <header className="absolute inset-x-0 top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-border backdrop-blur-md px-8" style={{ background: 'rgba(19,19,22,0.8)' }}>
          <h1 className="text-base font-sans font-medium text-foreground">{workspaceName}</h1>
          <div className="flex items-center gap-4">
            {/* Avatar uses coral as the brand identity color */}
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-sans font-bold shadow-sm ring-1 ring-white/10" style={{ background: 'var(--accent-primary)', color: '#fff' }}>
              {initial}
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-8 pt-24">
          {children}
        </main>
      </div>
    </div>
  );
}
