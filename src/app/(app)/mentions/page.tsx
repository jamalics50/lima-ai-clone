import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/Button';
import { MentionsTable, MentionRow } from './MentionsTable';
import { Layers } from 'lucide-react';

const PAGE_SIZE = 20;
const ALL_PLATFORMS = [
  'ChatGPT (GPT-4o)',
  'Claude 3.5 Sonnet',
  'Perplexity Pro',
  'Grok 2.0',
  'Google AI Overviews',
];

interface PageProps {
  searchParams: {
    platform?: string;
    sentiment?: string;
    type?: string;
    page?: string;
  };
}

export default async function MentionsPage({ searchParams }: PageProps) {
  const platform = searchParams.platform ?? 'all';
  const sentiment = searchParams.sentiment ?? 'all';
  const type = searchParams.type ?? 'all';
  const page = Math.max(1, parseInt(searchParams.page ?? '1'));

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get workspace + prompts (to scope queries through RLS)
  const { data: wm } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  const workspaceId = wm?.workspace_id as string | undefined;

  const { data: brand } = workspaceId
    ? await supabase.from('brands').select('id, name').eq('workspace_id', workspaceId).limit(1).single()
    : { data: null };

  const { data: competitors } = workspaceId
    ? await supabase.from('competitors').select('id, name').eq('workspace_id', workspaceId)
    : { data: [] };

  const { data: prompts } = workspaceId
    ? await supabase.from('prompts').select('id').eq('workspace_id', workspaceId)
    : { data: [] };

  const promptIds = (prompts ?? []).map((p: { id: string }) => p.id);

  // Fetch runs with mentions and citations
  type RawRun = {
    id: string;
    created_at: string;
    platform_name: string;
    response_text: string;
    mentions: { id: string; mentioned_brand_id: string | null; mentioned_competitor_id: string | null; sentiment: string }[];
    citations: { url: string; title: string }[];
  };

  let runs: RawRun[] = [];
  if (promptIds.length > 0) {
    const { data } = await supabase
      .from('platform_runs')
      .select('id, created_at, platform_name, response_text, mentions(*), citations(url, title)')
      .in('prompt_id', promptIds)
      .order('created_at', { ascending: false })
      .limit(1000);
    runs = (data as RawRun[]) ?? [];
  }

  // Flatten to mention rows
  const brandId = brand?.id;
  const compNameMap = Object.fromEntries((competitors ?? []).map((c: { id: string; name: string }) => [c.id, c.name]));

  const allRows: MentionRow[] = runs.flatMap(run =>
    run.mentions.map(m => ({
      id: m.id,
      createdAt: run.created_at,
      platform: run.platform_name,
      isBrand: m.mentioned_brand_id === brandId,
      entityName: m.mentioned_brand_id === brandId
        ? (brand?.name ?? 'Your Brand')
        : compNameMap[m.mentioned_competitor_id ?? ''] ?? 'Competitor',
      sentiment: m.sentiment,
      snippet: run.response_text?.slice(0, 160) ?? '',
      citations: run.citations,
    }))
  );

  // Apply filters
  let filtered = allRows;
  if (platform !== 'all') filtered = filtered.filter(r => r.platform === platform);
  if (sentiment !== 'all') filtered = filtered.filter(r => r.sentiment === sentiment);
  if (type === 'brand') filtered = filtered.filter(r => r.isBrand);
  if (type === 'competitor') filtered = filtered.filter(r => !r.isBrand);

  const total = filtered.length;
  const paginatedRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasAnyData = allRows.length > 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-medium tracking-tight text-[#F5F1EA]">Mentions &amp; Coverage</h2>
          <p className="text-[#9C978C] text-sm font-sans">
            {hasAnyData
              ? `${allRows.length} mention${allRows.length !== 1 ? 's' : ''} tracked across ${new Set(runs.map(r => r.platform_name)).size} AI platforms`
              : 'Run your prompts to start capturing brand mentions across AI platforms.'}
          </p>
        </div>
        {/* One primary button per page — coral */}
        <Button variant="primary">Export CSV</Button>
      </div>

      {!hasAnyData ? (
        /* Full-page empty state — sky blue accent border */
        <div className="border border-[#3FA9E0]/30 border-dashed rounded-2xl py-20 flex flex-col items-center gap-4 text-center">
          <div className="h-14 w-14 rounded-full border border-[#3FA9E0]/40 bg-[#3FA9E0]/10 flex items-center justify-center">
            <Layers className="h-7 w-7 text-[#3FA9E0]" />
          </div>
          <div>
            <p className="text-lg font-serif font-medium text-[#F5F1EA]">No mentions yet</p>
            <p className="text-sm font-sans text-[#9C978C] mt-1 max-w-xs mx-auto">
              Head to Prompts and click &ldquo;Run Now&rdquo;, or visit the Seed page to populate demo data instantly.
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <Button variant="primary" size="sm">
              <a href="/prompts">Go to Prompts</a>
            </Button>
            <Button variant="secondary" size="sm">
              <a href="/seed">Seed Demo Data</a>
            </Button>
          </div>
        </div>
      ) : (
        /* Real filterable, paginated table */
        <MentionsTable
          rows={paginatedRows}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          platform={platform}
          sentiment={sentiment}
          type={type}
          platforms={ALL_PLATFORMS}
        />
      )}
    </div>
  );
}
