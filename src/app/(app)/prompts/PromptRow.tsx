'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { runPrompt } from './actions';
import { Play, ChevronDown, ChevronUp, CheckCircle2, ExternalLink, Check } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';

interface Prompt {
  id: string;
  text: string;
  created_at: string;
}

interface RunResult {
  platform: string;
  sentiment: string;
  brandMentioned: boolean;
  citationCount: number;
}

const PLATFORM_COLORS: Record<string, string> = {
  'ChatGPT (GPT-4o)': '#10a37f',
  'Claude 3.5 Sonnet': '#d97757',
  'Perplexity Pro': '#20808d',
  'Grok 2.0': '#e7e9ea',
  'Google AI Overviews': '#4285f4',
};

export function PromptRow({ prompt }: { prompt: Prompt }) {
  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState<RunResult[] | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [runDone, setRunDone] = useState(false); // cosmetic checkmark flash
  const { trigger } = useFeedback();

  const handleRun = async () => {
    trigger('tap'); // feedback — does not change what runPrompt does
    setIsRunning(true);
    setRunResults(null);
    setRunDone(false);
    try {
      const results = await runPrompt(prompt.id);
      setRunResults(results);
      setLastRun(new Date().toLocaleTimeString());
      setIsExpanded(true);
      trigger('success'); // success pulse
      setRunDone(true);
      setTimeout(() => setRunDone(false), 1200); // revert label after 1.2s
    } catch (error) {
      console.error(error);
      trigger('error'); // error pulse
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-white/20 transition-all shadow-sm">
      {/* Row header */}
      <div className="flex items-center justify-between p-5 group">
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-foreground font-sans font-medium text-sm truncate">{prompt.text}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <p className="text-muted-foreground font-sans text-xs">
              Added {new Date(prompt.created_at).toLocaleDateString()}
            </p>
            {lastRun && (
              <span className="flex items-center gap-1.5 text-xs font-sans font-medium text-sky">
                <CheckCircle2 className="h-3.5 w-3.5" /> Last run {lastRun}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {runResults && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 min-w-[90px] justify-center"
          >
            {runDone ? (
              <span className="flex items-center gap-1.5 text-white">
                <Check className="h-3.5 w-3.5" /> Done
              </span>
            ) : isRunning ? (
              <span className="flex items-center gap-2">Running…</span>
            ) : (
              <><Play className="h-3.5 w-3.5" /> Run Now</>
            )}
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isRunning && (
        <div className="border-t border-border px-5 py-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 rounded-full bg-coral animate-pulse" />
            <span className="text-xs font-sans text-muted-foreground font-medium">Running across 5 AI platforms simultaneously…</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {['GPT-4o', 'Claude', 'Perplexity', 'Grok', 'Google'].map(p => (
              <div key={p} className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-1/2 bg-coral/50 animate-pulse rounded-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results panel */}
      {runResults && isExpanded && (
        <div className="border-t border-border px-5 pt-5 pb-6 space-y-3">
          <span className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">Run Results — {runResults.length} platforms</span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {runResults.map((r) => (
              <div
                key={r.platform}
                className="bg-background border border-border rounded-xl p-3.5 space-y-2 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: PLATFORM_COLORS[r.platform] || '#9C978C' }}
                  />
                  <span className="text-[11px] font-sans font-semibold text-foreground leading-tight">{r.platform.split(' ')[0]}</span>
                </div>
                <div>
                  {/* Coral for brand mentioned (this is you), sky blue for neutral/competitor context */}
                  <span className={`text-[11px] font-sans font-bold ${
                    r.brandMentioned ? 'text-coral' : 'text-muted-foreground'
                  }`}>
                    {r.brandMentioned ? '✓ Brand cited' : '✗ Not mentioned'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-sans px-2 py-0.5 rounded-full border ${
                    r.sentiment === 'positive'
                      ? 'text-emerald border-emerald/30 bg-emerald/10'
                      : r.sentiment === 'negative'
                      ? 'text-rose border-rose/30 bg-rose/10'
                      : 'text-muted-foreground border-border bg-surface-glass'
                  }`}>
                    {r.sentiment}
                  </span>
                </div>
                {/* Sky blue for informational citation count */}
                <span className="text-[11px] font-sans text-sky font-medium flex items-center gap-1.5 mt-1">
                  <ExternalLink className="h-3 w-3" /> {r.citationCount} citations
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
