import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Plus } from 'lucide-react';

export default function PromptsPage() {
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

      <Card className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <BookOpen className="h-12 w-12 text-[#3FA9E0] mb-4 stroke-[1.5]" />
        <h3 className="text-xl font-serif font-medium text-[#F5F1EA] mb-2">Saved Prompt Workflows</h3>
        <p className="text-sm font-sans text-[#9C978C] max-w-md">
          Create custom prompts to analyze competitive responses and benchmark brand visibility.
        </p>
      </Card>
    </div>
  );
}
