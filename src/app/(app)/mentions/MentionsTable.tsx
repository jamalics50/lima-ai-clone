'use client'

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ExternalLink, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
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
  'Grok 2.0': '#4a5568',
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
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
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
    if (s === 'positive') return <span className="inline-flex items-center text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-emerald/10 text-emerald border border-emerald/20">Positive</span>;
    if (s === 'negative') return <span className="inline-flex items-center text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-rose/10 text-rose border border-rose/20">Negative</span>;
    return <span className="inline-flex items-center text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-surface-glass text-muted-foreground border border-border">Neutral</span>;
  };

  return (
    <div className="space-y-4">
      {/* Sticky glassy filter bar */}
      <div className="sticky top-0 z-30 -mx-1 px-1 pb-3 pt-1 backdrop-blur-md bg-background/75 border-b border-border/50">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search — visual only for now */}
        <div className="relative flex-1 min-w-0 md:min-w-[200px]">
          <Search className="absolute left-3.5 top-3 md:top-2.5 h-4 w-4 text-muted-foreground shrink-0 stroke-[1.5]" />
          <input
            type="text"
            placeholder="Search mentions…"
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 md:py-2 text-base lg:text-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/50 transition-all shadow-sm"
          />
        </div>

        {/* Mobile Filters Trigger */}
        <div className="flex items-center justify-between md:hidden">
          <Button variant="secondary" onClick={() => setIsMobileFiltersOpen(true)} className="flex items-center gap-2 h-11 px-4">
            <SlidersHorizontal className="h-4 w-4 shrink-0 stroke-[1.5]" /> Filters
          </Button>
          <span className="text-sm font-sans text-muted-foreground font-medium">
            {total} result{total !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Mobile Filters Backdrop */}
        {isMobileFiltersOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity" 
            onClick={() => setIsMobileFiltersOpen(false)} 
          />
        )}

        {/* Filters Container (Bottom Sheet on Mobile, Inline on Desktop) */}
        <div className={`
          flex flex-col md:flex-row md:items-center gap-3
          fixed inset-x-0 bottom-0 z-50 md:static
          bg-card md:bg-transparent p-5 md:p-0
          rounded-t-3xl md:rounded-none shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-none
          transition-transform duration-300 ease-out
          ${isMobileFiltersOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
        `}>
          <div className="flex items-center justify-between mb-2 md:hidden">
            <h3 className="text-xl font-serif font-medium text-foreground tracking-tight">Filters</h3>
            <button onClick={() => setIsMobileFiltersOpen(false)} className="p-3 -mr-3 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Platform filter */}
          <div className="flex flex-col gap-2 md:gap-0 md:block">
            <label className="text-xs font-sans font-medium text-muted-foreground md:hidden uppercase tracking-wider ml-1">Platform</label>
            <select
              value={platform}
              onChange={e => pushFilter('platform', e.target.value)}
              className="liquid-glass border border-border rounded-lg px-4 py-2.5 md:py-2 text-base lg:text-sm font-sans text-foreground focus:outline-none focus:border-sky/50 focus:ring-1 focus:ring-sky/50 cursor-pointer shadow-sm w-full md:w-auto"
            >
              <option value="all">All Platforms</option>
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Sentiment filter */}
          <div className="flex flex-col gap-2 md:gap-0 md:block">
            <label className="text-xs font-sans font-medium text-muted-foreground md:hidden uppercase tracking-wider ml-1 mt-1 md:mt-0">Sentiment</label>
            <select
              value={sentiment}
              onChange={e => pushFilter('sentiment', e.target.value)}
              className="liquid-glass border border-border rounded-lg px-4 py-2.5 md:py-2 text-base lg:text-sm font-sans text-foreground focus:outline-none focus:border-sky/50 focus:ring-1 focus:ring-sky/50 cursor-pointer shadow-sm w-full md:w-auto"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          {/* Type filter */}
          <div className="flex flex-col gap-2 md:gap-0 md:block">
            <label className="text-xs font-sans font-medium text-muted-foreground md:hidden uppercase tracking-wider ml-1 mt-1 md:mt-0">Mention Type</label>
            <select
              value={type}
              onChange={e => pushFilter('type', e.target.value)}
              className="liquid-glass border border-border rounded-lg px-4 py-2.5 md:py-2 text-base lg:text-sm font-sans text-foreground focus:outline-none focus:border-sky/50 focus:ring-1 focus:ring-sky/50 cursor-pointer shadow-sm w-full md:w-auto"
            >
              <option value="all">All Types</option>
              <option value="brand">Brand Only</option>
              <option value="competitor">Competitor Only</option>
            </select>
          </div>

          <Button variant="primary" className="md:hidden mt-4 w-full h-11" onClick={() => setIsMobileFiltersOpen(false)}>
            Show {total} Results
          </Button>

          <span className="hidden md:block text-xs font-sans text-muted-foreground ml-auto shrink-0 font-medium">
            {total} result{total !== 1 ? 's' : ''}
          </span>
        </div>
        </div> {/* end flex filter row */}
      </div> {/* end sticky wrapper */}

      {/* Empty state */}
      {rows.length === 0 && (
        <div className="border border-border border-dashed rounded-2xl py-20 flex flex-col items-center gap-5 text-center bg-card shadow-sm">
          <div className="h-16 w-16 rounded-2xl border border-sky/20 bg-sky/5 flex items-center justify-center">
            <Search className="h-8 w-8 text-sky shrink-0 stroke-[1.5]" />
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
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-background border-b border-border text-[11px] font-sans font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Platform</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1">Sentiment</div>
            <div className="col-span-4">Snippet</div>
            <div className="col-span-2">Citations</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border flex flex-col md:block">
            {rows.map(row => (
              <div key={row.id} className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 hover:bg-zinc-50/80 transition-colors">
                
                {/* Mobile Line 1: Platform & Date */}
                <div className="flex justify-between items-center md:contents">
                  {/* Platform - order 1 on mobile, 2 on desktop */}
                  <div className="md:col-span-2 flex items-center gap-2 order-1 md:order-none">
                    <div
                      className="h-2 w-2 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: PLATFORM_COLORS[row.platform] ?? '#9C978C' }}
                    />
                    <span className="text-sm md:text-xs font-sans font-medium text-foreground truncate">{row.platform.split(' ')[0]}</span>
                  </div>
                  
                  {/* Date - order 2 on mobile, 1 on desktop */}
                  <div className="md:col-span-2 flex items-center order-2 md:order-none">
                    <span className="text-xs font-sans text-muted-foreground font-medium">{timeAgo(row.createdAt)}</span>
                  </div>
                </div>

                {/* Mobile Line 2: Type & Sentiment */}
                <div className="flex items-center gap-2 md:contents">
                  {/* Type badge */}
                  <div className="md:col-span-1 flex items-center">
                    {row.isBrand ? (
                      <span className="inline-flex items-center text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-coral/10 text-coral border border-coral/20 whitespace-nowrap">Brand</span>
                    ) : (
                      <span className="inline-flex items-center text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-sky/10 text-sky border border-sky/20 whitespace-nowrap">Competitor</span>
                    )}
                  </div>

                  {/* Sentiment */}
                  <div className="md:col-span-1 flex items-center">
                    {sentimentBadge(row.sentiment)}
                  </div>
                </div>

                {/* Snippet */}
                <div className="md:col-span-4 flex items-center mt-1 md:mt-0">
                  <p className="text-[13px] md:text-xs font-sans text-muted-foreground line-clamp-3 md:line-clamp-2 leading-relaxed">{row.snippet}</p>
                </div>

                {/* Citations */}
                <div className="md:col-span-2 flex items-center gap-2 flex-wrap mt-1 md:mt-0">
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
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="tertiary"
            disabled={page <= 1}
            onClick={() => pushPage(page - 1)}
            className="flex items-center gap-1.5 h-11 px-4 text-sm font-sans"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <span className="text-xs font-sans text-muted-foreground font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="tertiary"
            disabled={page >= totalPages}
            onClick={() => pushPage(page + 1)}
            className="flex items-center gap-1.5 h-11 px-4 text-sm font-sans"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
