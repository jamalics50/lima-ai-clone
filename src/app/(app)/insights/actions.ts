'use server';

import { createClient } from '@/utils/supabase/server';
import { generateInsights, type InsightItem, type InsightStats } from '@/lib/insights/generator';

export async function getOrGenerateInsights(): Promise<{ items: InsightItem[]; fresh: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { items: [], fresh: false };

  const { data: wm } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!wm?.workspace_id) return { items: [], fresh: false };
  const workspaceId = wm.workspace_id;

  // Check if a recent insight exists (generated within 24h)
  const { data: existing } = await supabase
    .from('insights')
    .select('items, generated_at')
    .eq('workspace_id', workspaceId)
    .order('generated_at', { ascending: false })
    .limit(1)
    .single();

  if (existing) {
    const age = Date.now() - new Date(existing.generated_at).getTime();
    if (age < 24 * 60 * 60 * 1000) {
      return { items: existing.items as InsightItem[], fresh: false };
    }
  }

  // Build stats from real data
  const { data: brand } = await supabase
    .from('brands')
    .select('name')
    .eq('workspace_id', workspaceId)
    .limit(1)
    .single();

  const { data: prompts } = await supabase
    .from('prompts')
    .select('id')
    .eq('workspace_id', workspaceId);

  const promptIds = (prompts ?? []).map((p: { id: string }) => p.id);

  if (promptIds.length === 0) {
    const items = generateInsights({
      brandName: brand?.name ?? 'Your brand',
      totalRuns: 0,
      visibilityPct: 0,
      shareOfVoice: 0,
      brandPositivePct: 0,
      platformBreakdown: {},
    });
    return { items, fresh: true };
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  type RunRow = {
    platform_name: string;
    mentions: { mentioned_brand_id: string | null; mentioned_competitor_id: string | null; sentiment: string }[];
  };

  const { data: runs } = await supabase
    .from('platform_runs')
    .select('platform_name, mentions(mentioned_brand_id, mentioned_competitor_id, sentiment)')
    .in('prompt_id', promptIds)
    .gte('created_at', thirtyDaysAgo);

  const allRuns: RunRow[] = runs ?? [];
  const totalRuns = allRuns.length;

  // Per-platform breakdown
  const platformBreakdown: InsightStats['platformBreakdown'] = {};
  for (const run of allRuns) {
    if (!platformBreakdown[run.platform_name]) {
      platformBreakdown[run.platform_name] = { runs: 0, mentions: 0, positiveMentions: 0 };
    }
    platformBreakdown[run.platform_name].runs++;
    const brandMentions = run.mentions.filter(m => m.mentioned_brand_id);
    platformBreakdown[run.platform_name].mentions += brandMentions.length > 0 ? 1 : 0;
    platformBreakdown[run.platform_name].positiveMentions += brandMentions.filter(m => m.sentiment === 'positive').length;
  }

  const allBrandMentions = allRuns.flatMap(r => r.mentions.filter(m => m.mentioned_brand_id));
  const allCompMentions = allRuns.flatMap(r => r.mentions.filter(m => m.mentioned_competitor_id));

  const totalBrand = allBrandMentions.length;
  const totalComp = allCompMentions.length;

  const visibilityPct = totalRuns > 0
    ? Math.round((allRuns.filter(r => r.mentions.some(m => m.mentioned_brand_id)).length / totalRuns) * 100)
    : 0;

  const shareOfVoice = totalBrand + totalComp > 0
    ? Math.round((totalBrand / (totalBrand + totalComp)) * 100)
    : 0;

  const brandPositivePct = totalBrand > 0
    ? Math.round((allBrandMentions.filter(m => m.sentiment === 'positive').length / totalBrand) * 100)
    : 0;

  const stats: InsightStats = {
    brandName: brand?.name ?? 'Your brand',
    totalRuns,
    visibilityPct,
    shareOfVoice,
    brandPositivePct,
    platformBreakdown,
  };

  const items = generateInsights(stats);

  // Upsert — delete old, insert new
  await supabase.from('insights').delete().eq('workspace_id', workspaceId);
  await supabase.from('insights').insert({ workspace_id: workspaceId, items });

  return { items, fresh: true };
}
