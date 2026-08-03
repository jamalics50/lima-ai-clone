import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Plus, Clock, Layers } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { PromptRow } from './PromptRow';

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
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-medium tracking-tight text-[#F5F1EA]">Prompt Library</h2>
          <p className="text-[#9C978C] text-sm font-sans">
            Manage, test, and optimize AI prompts across your active workspace.
          </p>
        </div>
        {/* One primary button per page — coral */}
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Prompt
        </Button>
      </div>

      {/* Prompt List */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-8 w-8 rounded-full bg-[#3FA9E0]/15 text-[#3FA9E0] flex items-center justify-center border border-[#3FA9E0]/25">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-medium text-[#F5F1EA]">Saved Prompt Workflows</h3>
            <p className="text-xs font-sans text-[#9C978C]">{prompts.length} prompt{prompts.length !== 1 ? 's' : ''} configured</p>
          </div>
        </div>

        {prompts.length === 0 ? (
          /* Empty state — sky blue border, informational */
          <div className="border border-[#3FA9E0]/30 border-dashed rounded-xl py-14 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full border border-[#3FA9E0]/40 bg-[#3FA9E0]/10 flex items-center justify-center">
              <Layers className="h-6 w-6 text-[#3FA9E0]" />
            </div>
            <p className="text-base font-serif font-medium text-[#F5F1EA]">No prompts yet</p>
            <p className="text-sm font-sans text-[#9C978C] max-w-xs">
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

      {/* Recent Runs — shown only after at least one run has occurred */}
      {recentRuns.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-white/8">
            <div className="h-8 w-8 rounded-full bg-[#D9714A]/15 text-[#D9714A] flex items-center justify-center border border-[#D9714A]/25">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-medium text-[#F5F1EA]">Recent Runs</h3>
              <p className="text-xs font-sans text-[#9C978C]">Latest pipeline executions across all prompts</p>
            </div>
          </div>

          {/* Table-style run log — different rhythm from card grid */}
          <div className="divide-y divide-white/8">
            {recentRuns.map((run) => (
              <div key={run.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/2 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Coral dot = brand signal / run activity */}
                  <div className="h-2 w-2 rounded-full bg-[#D9714A] shrink-0" />
                  <div>
                    <p className="text-sm font-sans font-medium text-[#F5F1EA] truncate max-w-xs">{run.prompt_text}</p>
                    <p className="text-xs font-sans text-[#3FA9E0]">{run.platform_name}</p>
                  </div>
                </div>
                <span className="text-xs font-sans text-[#9C978C] shrink-0 ml-4">
                  {new Date(run.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
