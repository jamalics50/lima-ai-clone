'use server'

import { createClient } from '@/utils/supabase/server';
import { MockRunContext } from '@/lib/mocks/aiMocks';
import { revalidatePath } from 'next/cache';

const PLATFORMS = [
  'ChatGPT (GPT-4o)',
  'Claude 3.5 Sonnet',
  'Perplexity Pro',
  'Grok 2.0',
  'Google AI Overviews',
];

// Fast in-process mock — no sleep, same data shape as real mocks
function fastMock(platform: string, context: MockRunContext) {
  const sentiments = ['positive', 'neutral', 'negative'] as const;

  // ~70% brand mention rate (same as aiMocks.ts)
  const mentions: { brandId?: string; competitorId?: string; sentiment: 'positive' | 'neutral' | 'negative' }[] = [];
  if (Math.random() > 0.3) {
    mentions.push({
      brandId: context.brand.id,
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    });
  }
  const numComp = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...context.competitors].sort(() => 0.5 - Math.random());
  for (let i = 0; i < Math.min(numComp, shuffled.length); i++) {
    mentions.push({ competitorId: shuffled[i].id, sentiment: sentiments[Math.floor(Math.random() * 3)] });
  }

  const citationSources = [
    { url: 'https://reddit.com/r/software', title: 'Discussion on best tools' },
    { url: 'https://g2.com/reviews', title: 'Top 10 solutions in 2024' },
    { url: 'https://techcrunch.com', title: 'Industry analysis and trends' },
    { url: 'https://trustradius.com', title: 'User reviews and comparisons' },
    { url: 'https://ycombinator.com', title: 'Startup toolkit recommendations' },
  ];
  const numCitations = Math.floor(Math.random() * 3) + 2;
  const citations = [...citationSources].sort(() => 0.5 - Math.random()).slice(0, numCitations);

  const brandMentioned = mentions.find(m => m.brandId);
  let text = `Analysis from ${platform}. `;
  if (brandMentioned) {
    text += `${context.brand.name} is mentioned with ${brandMentioned.sentiment} sentiment in this category.`;
  } else {
    text += `${context.brand.name} did not surface prominently in results for this prompt.`;
  }

  return { text, citations, mentions };
}

export async function seedData(): Promise<{ runsCreated: number; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { runsCreated: 0, error: 'Not authenticated' };

  const { data: wm } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!wm) return { runsCreated: 0, error: 'No workspace found. Please complete setup.' };

  const workspaceId = wm.workspace_id;

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('workspace_id', workspaceId)
    .limit(1)
    .single();

  if (!brand) return { runsCreated: 0, error: 'No brand found. Complete onboarding Step 1 first.' };

  const { data: competitors } = await supabase
    .from('competitors')
    .select('*')
    .eq('workspace_id', workspaceId);

  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .limit(3);

  if (!prompts || prompts.length === 0) {
    return { runsCreated: 0, error: 'No prompts found. Complete onboarding Step 3 first.' };
  }

  const context: MockRunContext = {
    prompt: '',
    brand: { id: brand.id, name: brand.name, url: brand.website_url ?? '' },
    competitors: (competitors ?? []).map(c => ({ id: c.id, name: c.name, url: c.website_url ?? '' })),
  };

  let runsCreated = 0;

  // 30 days of backdated data
  for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
    const runDate = new Date();
    runDate.setDate(runDate.getDate() - daysAgo);
    runDate.setHours(Math.floor(Math.random() * 14) + 7, Math.floor(Math.random() * 60), 0, 0);
    const dateStr = runDate.toISOString();

    // Generate all mock results for this day simultaneously (no network calls, so instant)
    const dayData = prompts.flatMap(prompt =>
      PLATFORMS.map((platform, mi) => ({
        promptId: prompt.id,
        platform,
        result: fastMock(PLATFORMS[mi], { ...context, prompt: prompt.text }),
      }))
    );

    // Batch insert platform_runs for this day
    const { data: insertedRuns, error: runErr } = await supabase
      .from('platform_runs')
      .insert(
        dayData.map(d => ({
          prompt_id: d.promptId,
          platform_name: d.platform,
          response_text: d.result.text,
          created_at: dateStr,
        }))
      )
      .select('id');

    if (runErr || !insertedRuns) continue;

    const citationsToInsert: object[] = [];
    const mentionsToInsert: object[] = [];

    insertedRuns.forEach((run, idx) => {
      const data = dayData[idx];
      data.result.citations.forEach(c => {
        citationsToInsert.push({ platform_run_id: run.id, url: c.url, title: c.title, created_at: dateStr });
      });
      data.result.mentions.forEach(m => {
        mentionsToInsert.push({
          platform_run_id: run.id,
          mentioned_brand_id: m.brandId ?? null,
          mentioned_competitor_id: m.competitorId ?? null,
          sentiment: m.sentiment,
          created_at: dateStr,
        });
      });
    });

    if (citationsToInsert.length > 0) await supabase.from('citations').insert(citationsToInsert);
    if (mentionsToInsert.length > 0) await supabase.from('mentions').insert(mentionsToInsert);

    runsCreated += dayData.length;
  }

  revalidatePath('/');
  revalidatePath('/mentions');
  return { runsCreated };
}
