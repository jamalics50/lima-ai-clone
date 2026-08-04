'use server'

import { createClient } from '@/utils/supabase/server';


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
    return { error: 'Not authenticated' };
  }

  // Get user's first workspace
  const { data: workspaceMembers } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1);

  let workspaceId = workspaceMembers?.[0]?.workspace_id;

  if (!workspaceId) {
    // Fallback: create a workspace if the database trigger didn't catch this user
    const { data: newWs, error: wsError } = await supabase
      .from('workspaces')
      .insert({ name: user.email || 'My Workspace' })
      .select('id')
      .single();

    if (wsError) return { error: `Workspace creation failed: ${wsError.message}` };
    workspaceId = newWs.id;

    const { error: wmError } = await supabase
      .from('workspace_members')
      .insert({ workspace_id: workspaceId, user_id: user.id, role: 'owner' });

    if (wmError) return { error: `Workspace member creation failed: ${wmError.message}` };
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

  if (brandError) return { error: `Brand creation failed: ${brandError.message}` };

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
    if (compError) return { error: `Competitor creation failed: ${compError.message}` };
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
    if (promptsError) return { error: `Prompts creation failed: ${promptsError.message}` };
  }

  return { success: true };
}
