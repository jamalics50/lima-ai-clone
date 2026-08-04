'use client'

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ExternalLink, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';

export interface MentionRow {
  id: string;
  createdAt: string;
  platform: string;
  isBrand: boolean;
  entityName: string;
  sentiment: string;
  snippet: string;
  citations: { url: string; title: string }[];
}

interface Props {
  rows: MentionRow[];
  total: number;
  page: number;
  pageSize: number;
  platform: string;
  sentiment: string;
  type: string;
  platforms: string[];
}

const PLATFORM_COLORS: Record<string, string> = {
  'ChatGPT (GPT-4o)': '#10a37f',
  'Claude 3.5 Sonnet': '#d97757',
  'Perplexity Pro': '#20808d',
  'Grok 2.0': '#a0aec0',
  'Google AI Overviews': '#4285f4',
};

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function MentionsTable({ rows, total, page, pageSize, platform, sentiment, type, platforms }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);
  const { trigger } = useFeedback();

  const pushFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.set('page', '1');
    router.push(`/mentions?${params.toString()}`);
  };

  const pushPage = (p: number) => {
    trigger('select'); // pagination feedback
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.push(`/mentions?${params.toString()}`);
  };

  const sentimentBadge = (s: string) => {
    if (s === 'positive') return <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-emerald/10 text-emerald border border-emerald/20">Positive</span>;
    if (s === 'negative') return <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-rose/10 text-rose border border-rose/20">Negative</span>;
    return <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-surface-glass text-muted-foreground border border-border">Neutral</span>;
  };

  return (
    <div className="space-y-4">
      {/* Sticky glassy filter bar */}
      <div className="sticky top-0 z-30 -mx-1 px-1 pb-3 pt-1 backdrop-blur-md bg-background/75 border-b border-border/50">
        <div className="flex flex-wrap items-center gap-3">
        {/* Search — visual only for now */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search mentions…"
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/50 transition-all shadow-sm"
          />
        </div>

        {/* Platform filter */}
        <select
          value={platform}
          onChange={e => pushFilter('platform', e.target.value)}
          className="bg-card border border-border rounded-lg px-4 py-2 text-sm font-sans text-foreground focus:outline-none focus:border-sky/50 focus:ring-1 focus:ring-sky/50 cursor-pointer shadow-sm"
        >
          <option value="all">All Platforms</option>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Sentiment filter */}
        <select
          value={sentiment}
          onChange={e => pushFilter('sentiment', e.target.value)}
          className="bg-card border border-border rounded-lg px-4 py-2 text-sm font-sans text-foreground focus:outline-none focus:border-sky/50 focus:ring-1 focus:ring-sky/50 cursor-pointer shadow-sm"
        >
          <option value="all">All Sentiments</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>

        {/* Type filter */}
        <select
          value={type}
          onChange={e => pushFilter('type', e.target.value)}
          className="bg-card border border-border rounded-lg px-4 py-2 text-sm font-sans text-foreground focus:outline-none focus:border-sky/50 focus:ring-1 focus:ring-sky/50 cursor-pointer shadow-sm"
        >
          <option value="all">All Types</option>
          <option value="brand">Brand Only</option>
          <option value="competitor">Competitor Only</option>
        </select>

        <span className="text-xs font-sans text-muted-foreground ml-auto shrink-0 font-medium">
          {total} result{total !== 1 ? 's' : ''}
        </span>
        </div> {/* end flex filter row */}
      </div> {/* end sticky wrapper */}

      {/* Empty state */}
      {rows.length === 0 && (
        <div className="border border-border border-dashed rounded-2xl py-20 flex flex-col items-center gap-5 text-center bg-card shadow-sm">
          <div className="h-16 w-16 rounded-2xl border border-sky/20 bg-sky/5 flex items-center justify-center">
            <Search className="h-8 w-8 text-sky" />
          </div>
          <div>
            <p className="text-xl font-sans font-semibold text-foreground tracking-tight">No mentions found</p>
            <p className="text-sm font-sans text-muted-foreground mt-2 max-w-sm mx-auto">
              Try adjusting your filters or run some prompts to generate mention data.
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      {rows.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-background border-b border-border text-[11px] font-sans font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Platform</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1">Sentiment</div>
            <div className="col-span-4">Snippet</div>
            <div className="col-span-2">Citations</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {rows.map(row => (
              <div key={row.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-4 hover:bg-surface-2 transition-colors">
                {/* Date */}
                <div className="sm:col-span-2 flex items-center">
                  <span className="text-xs font-sans text-muted-foreground font-medium">{timeAgo(row.createdAt)}</span>
                </div>

                {/* Platform */}
                <div className="sm:col-span-2 flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: PLATFORM_COLORS[row.platform] ?? '#9C978C' }}
                  />
                  <span className="text-xs font-sans font-medium text-foreground truncate">{row.platform.split(' ')[0]}</span>
                </div>

                {/* Type badge */}
                <div className="sm:col-span-1 flex items-center">
                  {row.isBrand ? (
                    <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-coral/10 text-coral border border-coral/20 whitespace-nowrap">Brand</span>
                  ) : (
                    <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-sky/10 text-sky border border-sky/20 whitespace-nowrap">Competitor</span>
                  )}
                </div>

                {/* Sentiment */}
                <div className="sm:col-span-1 flex items-center">
                  {sentimentBadge(row.sentiment)}
                </div>

                {/* Snippet */}
                <div className="sm:col-span-4 flex items-center">
                  <p className="text-xs font-sans text-muted-foreground line-clamp-2 leading-relaxed">{row.snippet}</p>
                </div>

                {/* Citations */}
                <div className="sm:col-span-2 flex items-center gap-2 flex-wrap">
                  {row.citations.slice(0, 2).map((c, ci) => (
                    <a
                      key={ci}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-sans font-medium text-sky flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink className="h-2.5 w-2.5" />
                      {new URL(c.url).hostname.replace('www.', '')}
                    </a>
                  ))}
                  {row.citations.length > 2 && (
                    <span className="text-[11px] font-sans text-muted-foreground">+{row.citations.length - 2} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="tertiary"
            size="sm"
            disabled={page <= 1}
            onClick={() => pushPage(page - 1)}
            className="flex items-center gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <span className="text-xs font-sans text-muted-foreground font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="tertiary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => pushPage(page + 1)}
            className="flex items-center gap-1.5"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
