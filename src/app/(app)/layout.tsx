import React from 'react';
import Link from 'next/link';
import { Home, MessageSquare, Users, BookOpen, FileText, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

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

  // Fetch the first workspace for this user
  const { data: workspaceMembers } = await supabase
    .from('workspace_members')
    .select('workspaces(name)')
    .eq('user_id', user.id)
    .limit(1);

  const rawWorkspaces = workspaceMembers?.[0]?.workspaces as unknown;
  const workspaceObj = Array.isArray(rawWorkspaces) ? rawWorkspaces[0] : rawWorkspaces;
  const workspaceName = (workspaceObj as { name?: string })?.name || 'My Workspace';
  const initial = user.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex h-screen overflow-hidden bg-[#141210] text-[#F5F1EA]">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-white/8 bg-[#1C1917]">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/8">
          <span className="font-serif font-medium text-lg tracking-tight text-[#F5F1EA]">LIMA AI</span>
        </div>
        <nav className="flex flex-1 flex-col px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-sans font-medium text-[#9C978C] hover:bg-white/5 hover:text-[#F5F1EA] transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/8">
            <form action="/auth/signout" method="post">
                <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-sans font-medium text-[#9C978C] hover:bg-white/5 hover:text-[#F5F1EA] transition-colors">
                    <LogOut className="h-4 w-4" />
                    Sign out
                </button>
            </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 bg-[#141210] px-8">
          <h1 className="text-base font-serif font-medium text-[#F5F1EA]">{workspaceName}</h1>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-[#D9714A] text-[#4A1B0C] flex items-center justify-center text-sm font-sans font-bold">
              {initial}
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#141210]">
          {children}
        </main>
      </div>
    </div>
  );
}
