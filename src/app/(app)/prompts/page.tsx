import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Plus } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { PromptRow } from './PromptRow';

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

  interface Prompt {
    id: string;
    text: string;
    created_at: string;
  }
  let prompts: Prompt[] = [];
  if (workspaceId) {
    const { data } = await supabase
      .from('prompts')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    
    prompts = data || [];
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-medium tracking-tight text-[#F5F1EA]">Prompt Library</h2>
          <p className="text-[#9C978C] text-sm font-sans">
            Manage, test, and optimize AI prompts across your active workspace.
          </p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Prompt
        </Button>
      </div>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-5 w-5 text-[#3FA9E0]" />
          <h3 className="text-lg font-serif font-medium text-[#F5F1EA]">Saved Prompt Workflows</h3>
        </div>

        {prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-sans text-[#9C978C]">No prompts found. Add one to start tracking.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prompts.map(prompt => (
              <PromptRow key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
