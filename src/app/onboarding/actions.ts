'use server'

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function completeOnboarding(formData: {
  brandName: string;
  websiteUrl: string;
  category: string;
  competitors: { name: string; url: string }[];
  prompts: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Get user's first workspace
  const { data: workspaceMembers } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1);

  const workspaceId = workspaceMembers?.[0]?.workspace_id;

  if (!workspaceId) {
    throw new Error('No workspace found');
  }

  // 1. Insert Brand
  const { error: brandError } = await supabase
    .from('brands')
    .insert({
      workspace_id: workspaceId,
      name: formData.brandName,
      website_url: formData.websiteUrl,
    })
    .select('id')
    .single();

  if (brandError) throw brandError;

  // 2. Insert Competitors
  if (formData.competitors.length > 0) {
    const { error: compError } = await supabase
      .from('competitors')
      .insert(
        formData.competitors.map(c => ({
          workspace_id: workspaceId,
          name: c.name,
          website_url: c.url,
        }))
      );
    if (compError) throw compError;
  }

  // 3. Insert Prompts
  if (formData.prompts.length > 0) {
    const { error: promptsError } = await supabase
      .from('prompts')
      .insert(
        formData.prompts.map(p => ({
          workspace_id: workspaceId,
          text: p,
        }))
      );
    if (promptsError) throw promptsError;
  }

  redirect('/');
}
