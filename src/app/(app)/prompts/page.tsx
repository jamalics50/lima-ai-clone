import { Card } from '@/components/ui/Card';

import { Clock, Layers } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { PromptRow } from './PromptRow';
import { CreatePromptModal } from './CreatePromptModal';
import { MotionWrapper } from '@/components/ui/MotionWrapper';

interface Prompt {
  id: string;
  text: string;
  created_at: string;
}

interface RecentRun {
  id: string;
  platform_name: string;
  created_at: string;
  prompt_text: string;
}

export default async function PromptsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch workspace
  const { data: workspaceMembers } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1);

  const workspaceId = workspaceMembers?.[0]?.workspace_id;

  let prompts: Prompt[] = [];
  let recentRuns: RecentRun[] = [];

  if (workspaceId) {
    const { data: promptData } = await supabase
      .from('prompts')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    prompts = promptData || [];

    // Fetch recent platform runs joined with prompt text
    if (prompts.length > 0) {
      const promptIds = prompts.map(p => p.id);
      const { data: runData } = await supabase
        .from('platform_runs')
        .select('id, platform_name, created_at, prompt_id')
        .in('prompt_id', promptIds)
        .order('created_at', { ascending: false })
        .limit(10);

      if (runData) {
        recentRuns = runData.map(run => ({
          ...run,
          prompt_text: prompts.find(p => p.id === run.prompt_id)?.text ?? '',
        }));
      }
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2 overflow-x-hidden">
      {/* Page Header */}
      <MotionWrapper delay={0} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-medium tracking-tight text-foreground">Prompt Library</h2>
          <p className="text-muted-foreground text-sm font-sans mt-1">
            Manage, test, and optimize AI prompts across your active workspace.
          </p>
        </div>
        {/* One primary button per page */}
        <CreatePromptModal />
      </MotionWrapper>

      {/* Prompt List */}
      <MotionWrapper delay={0.1}>
        <Card className="p-4 md:p-7 shadow-sm hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-sky/10 text-sky flex items-center justify-center border border-sky/20">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          </div>
          <div>
            <h3 className="text-lg font-serif font-medium tracking-tight text-foreground">Saved Prompt Workflows</h3>
            <p className="text-sm font-sans text-muted-foreground">{prompts.length} prompt{prompts.length !== 1 ? 's' : ''} configured</p>
          </div>
        </div>

        {prompts.length === 0 ? (
          /* Empty state */
          <div className="border border-border border-dashed rounded-2xl py-20 flex flex-col items-center text-center gap-4 bg-card shadow-sm">
            <div className="h-16 w-16 rounded-2xl border border-sky/20 bg-sky/5 flex items-center justify-center">
              <Layers className="h-8 w-8 text-sky shrink-0 stroke-[1.5]" />
            </div>
            <p className="text-xl font-serif font-medium tracking-tight text-foreground">No prompts yet</p>
            <p className="text-sm font-sans text-muted-foreground max-w-sm">
              Complete onboarding or create a prompt manually to start tracking brand visibility across AI platforms.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {prompts.map(prompt => (
              <PromptRow key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </Card>
      </MotionWrapper>

      {/* Recent Runs — shown only after at least one run has occurred */}
      {recentRuns.length > 0 && (
        <MotionWrapper delay={0.2}>
          <Card className="p-0 overflow-hidden shadow-sm hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3 p-4 md:p-7 border-b border-border">
            <div className="h-10 w-10 rounded-lg bg-coral/10 text-coral flex items-center justify-center border border-coral/20">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-medium tracking-tight text-foreground">Recent Runs</h3>
              <p className="text-sm font-sans text-muted-foreground">Latest pipeline executions across all prompts</p>
            </div>
          </div>

          {/* Table-style run log — different rhythm from card grid */}
          <div className="divide-y divide-border">
            {recentRuns.map((run) => (
              <div key={run.id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50/80 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Coral dot = brand signal / run activity */}
                  <div className="h-2 w-2 rounded-full bg-coral shrink-0" />
                  <div>
                    <p className="text-sm font-sans font-medium text-foreground truncate max-w-xs">{run.prompt_text}</p>
                    <p className="text-xs font-sans text-sky mt-0.5">{run.platform_name}</p>
                  </div>
                </div>
                <span className="text-xs font-sans text-muted-foreground shrink-0 ml-4">
                  {new Date(run.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          </Card>
        </MotionWrapper>
      )}
    </div>
  );
}
