'use server';

import { createClient } from '@/utils/supabase/server';
import { runAudit } from '@/lib/audit/runner';
import type { CriterionResult } from '@/lib/audit/criteria';

export interface AuditActionResult {
  success: boolean;
  error?: string;
  score?: number;
  results?: CriterionResult[];
  url?: string;
  loadMs?: number;
  auditId?: string;
}

export async function runAuditAction(url: string): Promise<AuditActionResult> {
  if (!url || url.trim().length < 4) {
    return { success: false, error: 'Please enter a valid URL.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated.' };

  // Get workspace
  const { data: wm } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!wm?.workspace_id) return { success: false, error: 'No workspace found.' };

  // Run the audit (server-side fetch)
  let auditResult;
  try {
    auditResult = await runAudit(url);
  } catch (err) {
    return { success: false, error: `Audit failed: ${(err as Error).message}` };
  }

  // Store in DB
  const { data: savedAudit, error: dbError } = await supabase
    .from('audits')
    .insert({
      workspace_id: wm.workspace_id,
      url: auditResult.url,
      score: auditResult.score,
      results: auditResult.results,
    })
    .select('id')
    .single();

  if (dbError) {
    // Return results anyway even if we can't store (DB table might not exist yet)
    return {
      success: true,
      score: auditResult.score,
      results: auditResult.results,
      url: auditResult.url,
      loadMs: auditResult.loadMs,
    };
  }

  return {
    success: true,
    score: auditResult.score,
    results: auditResult.results,
    url: auditResult.url,
    loadMs: auditResult.loadMs,
    auditId: savedAudit?.id,
  };
}

export async function getAuditHistory(): Promise<{ id: string; url: string; score: number; created_at: string }[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: wm } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!wm?.workspace_id) return [];

  const { data } = await supabase
    .from('audits')
    .select('id, url, score, created_at')
    .eq('workspace_id', wm.workspace_id)
    .order('created_at', { ascending: false })
    .limit(5);

  return data ?? [];
}
