'use server'

import { createClient } from '@/utils/supabase/server';
import { mockRunOnOpenAI, mockRunOnClaude, mockRunOnPerplexity, mockRunOnGrok, mockRunOnGoogleAIO, MockRunContext } from '@/lib/mocks/aiMocks';
import { revalidatePath } from 'next/cache';

export async function runPrompt(promptId: string) {
  const supabase = await createClient();

  // 1. Fetch prompt
  const { data: prompt } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', promptId)
    .single();

  if (!prompt) throw new Error('Prompt not found');

  // 2. Fetch Brand & Competitors for this workspace
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('workspace_id', prompt.workspace_id)
    .limit(1)
    .single();

  if (!brand) throw new Error('Brand not found for workspace');

  const { data: competitors } = await supabase
    .from('competitors')
    .select('*')
    .eq('workspace_id', prompt.workspace_id);

  const context: MockRunContext = {
    prompt: prompt.text,
    brand: { id: brand.id, name: brand.name, url: brand.website_url },
    competitors: (competitors || []).map(c => ({ id: c.id, name: c.name, url: c.website_url }))
  };

  // 3. Execute mocks concurrently
  const mocks = [
    mockRunOnOpenAI,
    mockRunOnClaude,
    mockRunOnPerplexity,
    mockRunOnGrok,
    mockRunOnGoogleAIO
  ];

  const results = await Promise.all(mocks.map(mock => mock(context)));
  const platforms = ['ChatGPT (GPT-4o)', 'Claude 3.5 Sonnet', 'Perplexity Pro', 'Grok 2.0', 'Google AI Overviews'];

  // 4. Save results to DB
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const platformName = platforms[i];

    // Insert platform_run
    const { data: run, error: runError } = await supabase
      .from('platform_runs')
      .insert({
        prompt_id: promptId,
        platform_name: platformName,
        response_text: result.text,
      })
      .select('id')
      .single();
    
    if (runError) throw runError;
    const runId = run.id;

    // Insert citations
    if (result.citations.length > 0) {
      await supabase.from('citations').insert(
        result.citations.map(c => ({
          platform_run_id: runId,
          url: c.url,
          title: c.title,
        }))
      );
    }

    // Insert mentions
    if (result.mentions.length > 0) {
      await supabase.from('mentions').insert(
        result.mentions.map(m => ({
          platform_run_id: runId,
          mentioned_brand_id: m.brandId || null,
          mentioned_competitor_id: m.competitorId || null,
          sentiment: m.sentiment,
        }))
      );
    }
  }

  revalidatePath('/prompts');
}
