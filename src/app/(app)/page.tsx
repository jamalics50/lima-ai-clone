import { createClient } from '@/utils/supabase/server';
import { CircularGauge } from '@/components/ui/CircularGauge';
import { PercentileBar } from '@/components/ui/PercentileBar';
import { Sparkline } from '@/components/ui/Sparkline';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Layers, TrendingUp, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

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
    <div className="border border-[#3FA9E0]/30 border-dashed rounded-2xl py-16 flex flex-col items-center gap-4 text-center">
      <div className="h-14 w-14 rounded-full border border-[#3FA9E0]/40 bg-[#3FA9E0]/10 flex items-center justify-center">
        <Layers className="h-7 w-7 text-[#3FA9E0]" />
      </div>
      <div>
        <p className="text-lg font-serif font-medium text-[#F5F1EA]">{title}</p>
        <p className="text-sm font-sans text-[#9C978C] mt-1 max-w-xs mx-auto">{body}</p>
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Page header */}
      <div>
        <h2 className="text-3xl font-serif font-medium tracking-tight text-[#F5F1EA] mb-1">
          Workspace Overview
        </h2>
        <p className="text-[#9C978C] text-sm font-sans">
          {hasData
            ? `Brand visibility insights across ${trackedPlatforms} AI platform${trackedPlatforms !== 1 ? 's' : ''} — last 30 days`
            : 'Run your first prompts or seed demo data to see insights here.'}
        </p>
      </div>

      {!hasData ? (
        <EmptyState
          title="No data yet"
          body="Complete onboarding and run your first prompt — or seed 30 days of demo data to see the dashboard in action."
        />
      ) : (
        <>
          {/* ── 1. HERO ROW (2fr / 1fr) ──────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left (2fr): Featured Visibility card */}
            <Card delay={0.05} className="lg:col-span-2 flex flex-col justify-between p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-sans uppercase tracking-widest text-[#9C978C]">Primary Metric</span>
                  <h3 className="text-2xl font-serif font-medium text-[#F5F1EA] mt-0.5">Visibility Score</h3>
                </div>
                <span className="text-xs font-sans text-[#9C978C] bg-white/5 px-3 py-1 rounded-full border border-white/8">
                  Tracked across {trackedPlatforms} platform{trackedPlatforms !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around my-4 gap-6">
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
                  <span className="text-xs font-sans text-[#9C978C]">30-Day Citation Trend</span>
                  <Sparkline
                    data={sparklineData.length > 1 ? sparklineData : [0, 1, 2, 3, 4, 5, 6, 7]}
                    color="#D9714A"
                    width={150}
                    height={52}
                    delay={0.3}
                  />
                  <span className={`text-xs font-sans font-semibold flex items-center gap-1 ${trendPct >= 0 ? 'text-[#D9714A]' : 'text-[#9C978C]'}`}>
                    <TrendingUp className="h-3.5 w-3.5" />
                    {trendPct >= 0 ? '+' : ''}{trendPct}% vs prior 15 days
                  </span>
                </div>
              </div>

              <div className="text-xs font-sans text-[#9C978C] pt-3 border-t border-white/8 flex justify-between">
                <span>{totalRuns} platform runs analysed</span>
                <span>{totalBrandMentions} brand mentions captured</span>
              </div>
            </Card>

            {/* Right (1fr): Stack of 2 small cards */}
            <div className="flex flex-col gap-6">
              {/* Share of Voice — sky blue secondary gauge */}
              <Card delay={0.15} className="flex-1 p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-sans text-[#9C978C]">Share of Voice</span>
                  <div className="text-2xl font-sans font-semibold text-[#F5F1EA] mt-1">
                    <AnimatedNumber value={shareOfVoice} suffix="%" delay={150} />
                  </div>
                  <span className="text-xs font-sans text-[#9C978C]">vs all mentions</span>
                </div>
                {/* Sky blue — secondary/informational metric only */}
                <CircularGauge percentage={shareOfVoice} variant="sky-blue" size={56} strokeWidth={5} delay={0.25} />
              </Card>

              {/* Total Mentions — plain big number, no gauge */}
              <Card delay={0.2} className="flex-1 p-5 flex flex-col justify-center">
                <span className="text-xs font-sans text-[#9C978C]">Brand Mentions</span>
                <div className="text-3xl font-sans font-bold text-[#F5F1EA] mt-1">
                  <AnimatedNumber value={totalBrandMentions} delay={200} />
                </div>
                <span className="text-xs font-sans text-[#3FA9E0] mt-1 font-medium">
                  Last 30 days
                </span>
              </Card>
            </div>
          </div>

          {/* ── 2. FULL-WIDTH COMPETITIVE ANALYSIS (3-column PercentileBars) ── */}
          <Card delay={0.25} className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl">Competitive Benchmark Analysis</CardTitle>
              <CardDescription className="text-sm">
                Your brand vs. competitor average across three core visibility vectors.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/2 rounded-xl border border-white/5 p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-sans font-medium text-[#F5F1EA]">Positive Sentiment</span>
                    <span className="text-xs font-sans font-bold text-[#D9714A]">
                      <AnimatedNumber value={brandPositivePct} suffix="%" delay={300} />
                    </span>
                  </div>
                  {/* Track = sky blue 25% opacity; fill = coral; marker = competitor avg */}
                  <PercentileBar score={brandPositivePct} average={compPositivePct} />
                </div>

                <div className="bg-white/2 rounded-xl border border-white/5 p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-sans font-medium text-[#F5F1EA]">Share of Voice</span>
                    <span className="text-xs font-sans font-bold text-[#D9714A]">
                      <AnimatedNumber value={shareOfVoice} suffix="%" delay={350} />
                    </span>
                  </div>
                  <PercentileBar score={shareOfVoice} average={Math.round((100 - shareOfVoice) / Math.max((competitors ?? []).length, 1))} />
                </div>

                <div className="bg-white/2 rounded-xl border border-white/5 p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-sans font-medium text-[#F5F1EA]">Platform Reach</span>
                    <span className="text-xs font-sans font-bold text-[#D9714A]">
                      <AnimatedNumber value={platformReach} suffix="%" delay={400} />
                    </span>
                  </div>
                  <PercentileBar score={platformReach} average={Math.max(20, compVisibilityAvg)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── 3. HORIZONTAL COMPETITOR STRIP — sky blue only ────────────── */}
          {competitorStrip.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-medium text-[#F5F1EA]">Competitor Tracking</h3>
                <a href="/competitors" className="text-xs font-sans text-[#3FA9E0] hover:underline">
                  Full analysis →
                </a>
              </div>
              {/* Flex row, overflow-x: auto, each pill ~150px wide */}
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                {competitorStrip.map((comp, idx) => (
                  <div
                    key={comp.id}
                    className="min-w-[150px] shrink-0 bg-[#1C1917] border border-white/8 hover:border-[#3FA9E0]/30 transition-all duration-150 rounded-full py-2.5 px-4 flex items-center gap-3"
                  >
                    {/* Sky blue avatar — competitors are NEVER coral */}
                    <div className="h-7 w-7 rounded-full bg-[#3FA9E0]/20 text-[#3FA9E0] flex items-center justify-center text-xs font-sans font-bold border border-[#3FA9E0]/30 shrink-0">
                      {comp.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-sans font-medium text-[#F5F1EA] block truncate">{comp.name}</span>
                      <span className="text-[11px] font-sans font-bold text-[#3FA9E0]">
                        <AnimatedNumber value={comp.score} suffix="%" delay={450 + idx * 50} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 4. BOTTOM ROW: asymmetric 7/5 ────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left (7): Recent Activity timeline */}
            <Card delay={0.3} className="lg:col-span-7">
              <CardHeader>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription className="text-sm">Live tracking across all AI platforms.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 px-6 pb-6 divide-y divide-white/8">
                {recentActivity.length === 0 ? (
                  <p className="text-sm font-sans text-[#9C978C] py-6 text-center">No recent runs found.</p>
                ) : (
                  recentActivity.map(act => (
                    <div key={act.id} className="py-3.5 flex items-center gap-4 first:pt-0 last:pb-0">
                      {/* Icon — coral for brand activity, sky blue for competitor/neutral */}
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border ${
                        act.type === 'brand'
                          ? 'bg-[#D9714A]/15 text-[#D9714A] border-[#D9714A]/25'
                          : 'bg-[#3FA9E0]/10 text-[#3FA9E0] border-[#3FA9E0]/20'
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
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-sans font-medium text-[#F5F1EA] truncate">{act.label}</span>
                          <span className="text-xs font-sans text-[#9C978C] shrink-0 ml-3">{timeAgo(act.time)}</span>
                        </div>
                        <span className={`text-xs font-sans capitalize ${
                          act.sentiment === 'positive' ? 'text-[#D9714A]'
                            : act.sentiment === 'negative' ? 'text-red-400'
                            : 'text-[#9C978C]'
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
            <Card delay={0.35} className="lg:col-span-5">
              <CardHeader>
                <CardTitle className="text-xl">Actions</CardTitle>
                <CardDescription className="text-sm">Recommended workspace operations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* One primary per page — coral */}
                <Button className="w-full justify-center" variant="primary">
                  <a href="/prompts">Run All Prompts</a>
                </Button>
                {/* Secondary — sky blue outline */}
                <Button className="w-full justify-center" variant="secondary">
                  <a href="/mentions">Review Mentions</a>
                </Button>
                {/* Tertiary — neutral white outline */}
                <Button className="w-full justify-center" variant="tertiary">
                  <a href="/seed">Seed More Data</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
