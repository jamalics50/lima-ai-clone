import { CRITERIA, type CriterionResult } from './criteria';

export interface AuditRunResult {
  score: number;
  results: CriterionResult[];
  url: string;
  loadMs: number;
}

async function safeFetch(url: string, timeoutMs = 5000): Promise<{ ok: boolean; text: string; status: number }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LIMA-Audit-Bot/1.0)',
      },
    });
    clearTimeout(timer);
    const text = await res.text();
    return { ok: res.ok, text, status: res.status };
  } catch {
    return { ok: false, text: '', status: 0 };
  }
}

export async function runAudit(rawUrl: string): Promise<AuditRunResult> {
  // Normalise URL
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const origin = new URL(url).origin;

  // Fetch main page (timed)
  const start = Date.now();
  const pageRes = await safeFetch(url, 8000);
  const loadMs = Date.now() - start;
  const html = pageRes.text;

  // Concurrent auxiliary fetches
  const [robotsRes, sitemapRes, llmsRes] = await Promise.allSettled([
    safeFetch(`${origin}/robots.txt`, 4000),
    safeFetch(`${origin}/sitemap.xml`, 4000),
    safeFetch(`${origin}/llms.txt`, 4000),
  ]);

  const robotsTxt = robotsRes.status === 'fulfilled' && robotsRes.value.ok ? robotsRes.value.text : '';
  const sitemapExists = sitemapRes.status === 'fulfilled' && sitemapRes.value.ok;
  const llmsTxtExists = llmsRes.status === 'fulfilled' && llmsRes.value.ok;

  const inputs = { html, robotsTxt, sitemapExists, llmsTxtExists, loadMs };

  const results: CriterionResult[] = CRITERIA.map(criterion => ({
    id: criterion.id,
    label: criterion.label,
    ...criterion.check(inputs),
  }));

  const score = results.filter(r => r.passed).length;

  return { score, results, url, loadMs };
}
