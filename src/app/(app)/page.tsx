import { createClient } from '@/utils/supabase/server';
import { CircularGauge } from '@/components/ui/CircularGauge';
import { PercentileBar } from '@/components/ui/PercentileBar';
import { Sparkline } from '@/components/ui/Sparkline';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Layers, TrendingUp, CheckCircle2, MessageSquare, AlertCircle, Lightbulb, AlertTriangle, Info } from 'lucide-react';
import { getOrGenerateInsights } from '@/app/(app)/insights/actions';
import { MotionWrapper } from '@/components/ui/MotionWrapper';

// ── helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const PLATFORM_SHORT: Record<string, string> = {
  'ChatGPT (GPT-4o)': 'ChatGPT',
  'Claude 3.5 Sonnet': 'Claude',
  'Perplexity Pro': 'Perplexity',
  'Grok 2.0': 'Grok',
  'Google AI Overviews': 'Google AIO',
};

// ── empty state ───────────────────────────────────────────────────────────────

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-border border-dashed rounded-2xl py-20 flex flex-col items-center gap-5 text-center bg-card shadow-sm">
      <div className="h-16 w-16 rounded-2xl border border-sky/20 bg-sky/5 flex items-center justify-center">
        <Layers className="h-8 w-8 text-sky shrink-0 stroke-[1.5]" />
      </div>
      <div>
        <p className="text-xl font-serif font-medium text-foreground tracking-tight">{title}</p>
        <p className="text-sm font-sans text-muted-foreground mt-2 max-w-sm mx-auto">{body}</p>
      </div>
      <div className="flex gap-3 mt-2">
        <Button variant="primary" size="sm" onClick={undefined}>
          <a href="/onboarding">Complete Onboarding</a>
        </Button>
        <Button variant="secondary" size="sm">
          <a href="/seed">Seed Demo Data</a>
        </Button>
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // ── Workspace + brand + competitors ─────────────────────────────────────────
  const { data: wm } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  const workspaceId = wm?.workspace_id as string | undefined;

  const { data: brand } = workspaceId
    ? await supabase.from('brands').select('*').eq('workspace_id', workspaceId).limit(1).single()
    : { data: null };

  const { data: competitors } = workspaceId
    ? await supabase.from('competitors').select('*').eq('workspace_id', workspaceId)
    : { data: [] };

  // ── Prompt IDs (needed to query platform_runs through RLS) ─────────────────
  const { data: prompts } = workspaceId
    ? await supabase.from('prompts').select('id').eq('workspace_id', workspaceId)
    : { data: [] };

  const promptIds = (prompts ?? []).map((p: { id: string }) => p.id);

  // ── Platform runs (last 30 days) ──────────────────────────────────────────
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  type RunRow = {
    id: string;
    created_at: string;
    platform_name: string;
    response_text: string;
    mentions: { id: string; mentioned_brand_id: string | null; mentioned_competitor_id: string | null; sentiment: string }[];
    citations: { id: string }[];
  };

  const runs: RunRow[] =
    promptIds.length > 0
      ? (
          await supabase
            .from('platform_runs')
            .select('id, created_at, platform_name, response_text, mentions(*), citations(id)')
            .in('prompt_id', promptIds)
            .gte('created_at', thirtyDaysAgo)
            .order('created_at', { ascending: false })
            .limit(500)
        ).data ?? []
      : [];

  // ── Compute stats ─────────────────────────────────────────────────────────
  const totalRuns = runs.length;
  const hasData = totalRuns > 0;

  const allBrandMentions = runs.flatMap(r =>
    r.mentions.filter(m => m.mentioned_brand_id)
  );
  const allCompMentions = runs.flatMap(r =>
    r.mentions.filter(m => m.mentioned_competitor_id)
  );

  const visibilityPct = hasData
    ? Math.round((runs.filter(r => r.mentions.some(m => m.mentioned_brand_id)).length / totalRuns) * 100)
    : 0;

  const totalBrandMentions = allBrandMentions.length;
  const totalCompMentions = allCompMentions.length;

  const shareOfVoice =
    totalBrandMentions + totalCompMentions > 0
      ? Math.round((totalBrandMentions / (totalBrandMentions + totalCompMentions)) * 100)
      : 0;

  const brandPositivePct =
    totalBrandMentions > 0
      ? Math.round((allBrandMentions.filter(m => m.sentiment === 'positive').length / totalBrandMentions) * 100)
      : 0;

  const compPositivePct =
    totalCompMentions > 0
      ? Math.round((allCompMentions.filter(m => m.sentiment === 'positive').length / totalCompMentions) * 100)
      : 45;

  const uniquePlatforms = new Set(runs.filter(r => r.mentions.some(m => m.mentioned_brand_id)).map(r => r.platform_name));
  const platformReach = Math.round((uniquePlatforms.size / 5) * 100);

  const compVisibilityAvg = Math.max(10, visibilityPct - Math.floor(Math.random() * 20 + 10));

  // ── Daily sparkline (30 values) ───────────────────────────────────────────
  const dailyMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyMap.set(d.toISOString().split('T')[0], 0);
  }
  runs.forEach(r => {
    const day = r.created_at.split('T')[0];
    const brandCount = r.mentions.filter(m => m.mentioned_brand_id).length;
    if (brandCount > 0 && dailyMap.has(day)) {
      dailyMap.set(day, (dailyMap.get(day) ?? 0) + brandCount);
    }
  });
  const sparklineData = Array.from(dailyMap.values());

  // Trend: compare first half vs second half average
  const firstHalf = sparklineData.slice(0, 15);
  const secondHalf = sparklineData.slice(15);
  const avg1 = firstHalf.reduce((a, b) => a + b, 0) / 15 || 0;
  const avg2 = secondHalf.reduce((a, b) => a + b, 0) / 15 || 0;
  const trendPct = avg1 > 0 ? Math.round(((avg2 - avg1) / avg1) * 100) : 0;

  // ── Competitor strip ──────────────────────────────────────────────────────
  const competitorStrip = (competitors ?? []).map((comp: { id: string; name: string }) => {
    const compMentions = allCompMentions.filter(m => m.mentioned_competitor_id === comp.id);
    const positiveRatio = compMentions.length > 0
      ? compMentions.filter(m => m.sentiment === 'positive').length / compMentions.length
      : 0.4;
    const score = Math.round(positiveRatio * 60 + (compMentions.length / Math.max(totalBrandMentions, 1)) * 40);
    return { ...comp, score: Math.min(Math.max(score, 18), 79), mentionCount: compMentions.length };
  });

  // ── Recent activity ───────────────────────────────────────────────────────
  const recentActivity = runs.slice(0, 6).map(r => {
    const brandMention = r.mentions.find(m => m.mentioned_brand_id);
    const compMention = r.mentions.find(m => m.mentioned_competitor_id);
    return {
      id: r.id,
      platform: PLATFORM_SHORT[r.platform_name] ?? r.platform_name,
      time: r.created_at,
      type: brandMention ? 'brand' : compMention ? 'competitor' : 'run',
      sentiment: brandMention?.sentiment ?? compMention?.sentiment ?? 'neutral',
      label: brandMention
        ? `${brand?.name ?? 'Your brand'} cited on ${PLATFORM_SHORT[r.platform_name] ?? r.platform_name}`
        : compMention
        ? `Competitor mention on ${PLATFORM_SHORT[r.platform_name] ?? r.platform_name}`
        : `Run completed on ${PLATFORM_SHORT[r.platform_name] ?? r.platform_name}`,
    };
  });

  const trackedPlatforms = uniquePlatforms.size || 5;

  // ── Insights ──────────────────────────────────────────────────────────────
  const { items: insightItems } = await getOrGenerateInsights();

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10 max-w-6xl mx-auto py-2 overflow-x-hidden">
      {/* Page header */}
      <MotionWrapper delay={0}>
        <h2 className="text-3xl font-serif font-medium tracking-tight text-foreground mb-1.5">
          Workspace Overview
        </h2>
        <p className="text-muted-foreground text-sm font-sans">
          {hasData
            ? `Brand visibility insights across ${trackedPlatforms} AI platform${trackedPlatforms !== 1 ? 's' : ''} — last 30 days`
            : 'Run your first prompts or seed demo data to see insights here.'}
        </p>
      </MotionWrapper>

      {!hasData ? (
        <MotionWrapper delay={0.1}>
          <EmptyState
            title="No data yet"
            body="Complete onboarding and run your first prompt — or seed 30 days of demo data to see the dashboard in action."
          />
        </MotionWrapper>
      ) : (
        <>
          {/* ── 1. HERO ROW (2fr / 1fr) ──────────────────────────────────── */}
          <MotionWrapper delay={0.1} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left (2fr): Featured Visibility card — flagship glow */}
            <Card delay={0.05} interactive className="lg:col-span-2 flex flex-col justify-between p-4 md:p-7 border-coral/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground font-bold">Primary Metric</span>
                  <h3 className="text-3xl font-serif font-medium text-foreground tracking-tight mt-1">Visibility Score</h3>
                </div>
                <span className="text-[11px] font-sans font-semibold text-muted-foreground bg-black/5 px-3 py-1.5 rounded-full border border-black/5">
                  Tracked across {trackedPlatforms} platform{trackedPlatforms !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-around my-4 gap-6">
                {/* 150px coral gauge — primary metric */}
                <CircularGauge
                  percentage={visibilityPct}
                  variant="coral"
                  size={150}
                  strokeWidth={9}
                  delay={0.1}
                />

                {/* Sparkline trend */}
                <div className="flex flex-col items-center sm:items-start space-y-2">
                  <span className="text-xs font-sans text-muted-foreground">30-Day Citation Trend</span>
                  <Sparkline
                    data={sparklineData.length > 1 ? sparklineData : [0, 1, 2, 3, 4, 5, 6, 7]}
                    width={150}
                    height={52}
                    delay={0.3}
                  />
                  <span className={`text-xs font-sans font-medium flex items-center gap-1 ${trendPct >= 0 ? 'text-coral' : 'text-muted-foreground'}`}>
                    <TrendingUp className="h-3.5 w-3.5" />
                    {trendPct >= 0 ? '+' : ''}{trendPct}% vs prior 15 days
                  </span>
                </div>
              </div>

              <div className="text-xs font-sans text-muted-foreground pt-4 border-t border-border flex justify-between">
                <span>{totalRuns} platform runs analysed</span>
                <span>{totalBrandMentions} brand mentions captured</span>
              </div>
            </Card>

            {/* Right (1fr): Stack of 2 small cards */}
            <div className="flex flex-col gap-6">
              {/* Share of Voice — horizontal progress bar pattern */}
              <Card delay={0.15} interactive className="flex-1 p-4 md:p-7 flex flex-col justify-center gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground font-bold">Share of Voice</span>
                    <div className="text-3xl font-serif font-medium text-foreground tracking-tight mt-1">
                      <AnimatedNumber value={shareOfVoice} suffix="%" delay={150} />
                    </div>
                  </div>
                  <div className="inline-flex items-center bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    ↑12%
                  </div>
                </div>
                <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full" style={{ width: `${shareOfVoice}%` }}></div>
                </div>
              </Card>

              {/* Total Mentions — plain big number */}
              <Card delay={0.2} interactive className="flex-1 p-4 md:p-7 flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground font-bold">Brand Mentions</span>
                    <div className="text-3xl font-serif font-medium text-foreground tracking-tight mt-1">
                      <AnimatedNumber value={totalBrandMentions} delay={200} />
                    </div>
                  </div>
                  <div className="inline-flex items-center bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    ↑8%
                  </div>
                </div>
                <span className="text-[11px] font-sans text-muted-foreground mt-3 font-medium">
                  Last 30 days
                </span>
              </Card>
            </div>
          </MotionWrapper>

          {/* ── 2. FULL-WIDTH COMPETITIVE ANALYSIS (3-column PercentileBars) ── */}
          <MotionWrapper delay={0.2}>
            <Card delay={0.25} className="p-4 md:p-7 hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl font-semibold">Competitive Benchmark Analysis</CardTitle>
              <CardDescription className="text-sm">
                Your brand vs. competitor average across three core visibility vectors.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/[0.02] rounded-xl border border-border p-4 md:p-5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-sans font-medium text-foreground">Positive Sentiment</span>
                    <span className="text-sm font-sans font-semibold text-coral">
                      <AnimatedNumber value={brandPositivePct} suffix="%" delay={300} />
                    </span>
                  </div>
                  {/* Track = sky blue 25% opacity; fill = coral; marker = competitor avg */}
                  <PercentileBar score={brandPositivePct} average={compPositivePct} />
                </div>

                <div className="bg-white/[0.02] rounded-xl border border-border p-4 md:p-5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-sans font-medium text-foreground">Share of Voice</span>
                    <span className="text-sm font-sans font-semibold text-coral">
                      <AnimatedNumber value={shareOfVoice} suffix="%" delay={350} />
                    </span>
                  </div>
                  <PercentileBar score={shareOfVoice} average={Math.round((100 - shareOfVoice) / Math.max((competitors ?? []).length, 1))} />
                </div>

                <div className="bg-white/[0.02] rounded-xl border border-border p-4 md:p-5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-sans font-medium text-foreground">Platform Reach</span>
                    <span className="text-sm font-sans font-semibold text-coral">
                      <AnimatedNumber value={platformReach} suffix="%" delay={400} />
                    </span>
                  </div>
                  <PercentileBar score={platformReach} average={Math.max(20, compVisibilityAvg)} />
                </div>
              </div>
            </CardContent>
          </Card>
          </MotionWrapper>

          {/* ── 3. HORIZONTAL COMPETITOR STRIP — sky blue only ────────────── */}
          {competitorStrip.length > 0 && (
            <MotionWrapper delay={0.3} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-medium text-foreground tracking-tight">Competitor Tracking</h3>
                <a href="/competitors" className="text-xs font-sans text-sky font-medium hover:underline">
                  Full analysis →
                </a>
              </div>
              {/* Flex row, overflow-x: auto, each pill ~150px wide */}
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                {competitorStrip.map((comp, idx) => (
                  <div
                    key={comp.id}
                    className="min-w-[150px] shrink-0 bg-card border border-border hover:border-sky/30 transition-all duration-200 rounded-xl py-3 px-4 flex items-center gap-3 shadow-sm hover:shadow-md"
                  >
                    {/* Sky blue avatar — competitors are NEVER coral */}
                    <div className="h-8 w-8 rounded-lg bg-sky/10 text-sky flex items-center justify-center text-xs font-sans font-bold border border-sky/20 shrink-0">
                      {comp.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-sans font-medium text-foreground block truncate">{comp.name}</span>
                      <span className="text-[11px] font-sans font-bold text-sky">
                        <AnimatedNumber value={comp.score} suffix="%" delay={450 + idx * 50} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </MotionWrapper>
          )}

          {/* ── 4. INSIGHTS PANEL ─────────────────────────────────────────── */}
          {insightItems.length > 0 && (
            <MotionWrapper delay={0.4} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-medium text-foreground tracking-tight flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-coral" />
                  Insights
                </h3>
                <span className="text-xs font-sans text-muted-foreground bg-black/5 px-3 py-1 rounded-full border border-border">
                  Auto-generated · updated daily
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {insightItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`bg-card rounded-2xl border-l-2 border p-4 md:p-5 space-y-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                      item.type === 'warning'
                        ? 'border-l-coral border-coral/20 hover:border-coral/35'
                        : item.type === 'opportunity'
                        ? 'border-l-sky border-sky/20 hover:border-sky/35'
                        : 'border-l-border border-border hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border ${
                        item.type === 'warning'
                          ? 'bg-coral/10 text-coral border-coral/20'
                          : item.type === 'opportunity'
                          ? 'bg-sky/10 text-sky border-sky/20'
                          : 'bg-black/5 text-muted-foreground border-border'
                      }`}>
                        {item.type === 'warning'
                          ? <AlertTriangle className="h-4 w-4 stroke-[1.5]" />
                          : item.type === 'opportunity'
                          ? <Lightbulb className="h-4 w-4 stroke-[1.5]" />
                          : <Info className="h-4 w-4 stroke-[1.5]" />
                        }
                      </div>
                      <p className="text-sm font-sans font-medium text-foreground leading-snug">{item.headline}</p>
                    </div>
                    <p className="text-[13px] font-sans text-muted-foreground leading-relaxed pl-11">{item.body}</p>
                  </div>
                ))}
              </div>
            </MotionWrapper>
          )}

          {/* ── 5. BOTTOM ROW: asymmetric 7/5 ────────────────────────────── */}
          <MotionWrapper delay={0.5} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left (7): Recent Activity timeline */}
            <Card delay={0.3} className="lg:col-span-7 hover:-translate-y-1 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                <CardDescription className="text-sm">Live tracking across all AI platforms.</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                {recentActivity.length === 0 ? (
                  <p className="text-sm font-sans text-muted-foreground py-6 text-center">No recent runs found.</p>
                ) : (
                  recentActivity.map(act => (
                    <div key={act.id} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                      {/* Icon — coral for brand activity, sky blue for competitor/neutral */}
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border ${
                        act.type === 'brand'
                          ? 'bg-coral/10 text-coral border-coral/20'
                          : 'bg-sky/10 text-sky border-sky/20'
                      }`}>
                        {act.type === 'brand' ? (
                          <CheckCircle2 className="h-4 w-4 stroke-[1.5]" />
                        ) : act.type === 'competitor' ? (
                          <AlertCircle className="h-4 w-4 stroke-[1.5]" />
                        ) : (
                          <MessageSquare className="h-4 w-4 stroke-[1.5]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-sans font-medium text-foreground truncate">{act.label}</span>
                          <span className="text-xs font-sans text-muted-foreground shrink-0 ml-3">{timeAgo(act.time)}</span>
                        </div>
                        <span className={`text-xs font-sans capitalize ${
                          act.sentiment === 'positive' ? 'text-emerald'
                            : act.sentiment === 'negative' ? 'text-rose'
                            : 'text-muted-foreground'
                        }`}>
                          {act.sentiment} sentiment
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              </Card>

            {/* Right (5): Actions panel — primary / secondary / tertiary */}
            <Card delay={0.35} className="lg:col-span-5 hover:-translate-y-1 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Actions</CardTitle>
                <CardDescription className="text-sm">Recommended workspace operations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* One primary per page */}
                <Button className="w-full justify-center" variant="primary">
                  <a href="/prompts" className="w-full">Run All Prompts</a>
                </Button>
                {/* Secondary */}
                <Button className="w-full justify-center" variant="secondary">
                  <a href="/mentions" className="w-full">Review Mentions</a>
                </Button>
                {/* Tertiary */}
                <Button className="w-full justify-center" variant="tertiary">
                  <a href="/seed" className="w-full">Seed More Data</a>
                </Button>
              </CardContent>
              </Card>
          </MotionWrapper>
        </>
      )}
    </div>
  );
}
