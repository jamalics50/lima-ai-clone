'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { runPrompt } from './actions';
import { Play, ChevronDown, ChevronUp, CheckCircle2, ExternalLink } from 'lucide-react';

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

  const handleRun = async () => {
    setIsRunning(true);
    setRunResults(null);
    try {
      const results = await runPrompt(prompt.id);
      setRunResults(results);
      setLastRun(new Date().toLocaleTimeString());
      setIsExpanded(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden bg-[#1C1917] hover:border-white/16 transition-all">
      {/* Row header */}
      <div className="flex items-center justify-between p-4 group">
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-[#F5F1EA] font-sans font-medium text-sm truncate">{prompt.text}</p>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-[#9C978C] font-sans text-xs">
              Added {new Date(prompt.created_at).toLocaleDateString()}
            </p>
            {lastRun && (
              <span className="flex items-center gap-1 text-xs font-sans text-[#3FA9E0]">
                <CheckCircle2 className="h-3 w-3" /> Last run {lastRun}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {runResults && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#9C978C] hover:text-[#F5F1EA] transition-colors p-1"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="h-3.5 w-3.5" />
            {isRunning ? 'Running…' : 'Run Now'}
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isRunning && (
        <div className="border-t border-white/8 px-4 py-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-[#D9714A] animate-pulse" />
            <span className="text-xs font-sans text-[#9C978C]">Running across 5 AI platforms simultaneously…</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {['GPT-4o', 'Claude', 'Perplexity', 'Grok', 'Google'].map(p => (
              <div key={p} className="h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-1/2 bg-[#D9714A]/50 animate-pulse rounded-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results panel */}
      {runResults && isExpanded && (
        <div className="border-t border-white/8 px-4 pt-4 pb-5 space-y-3">
          <span className="text-xs font-sans text-[#9C978C] uppercase tracking-wider">Run Results — {runResults.length} platforms</span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {runResults.map((r) => (
              <div
                key={r.platform}
                className="bg-[#141210] border border-white/8 rounded-xl p-3 space-y-1.5"
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: PLATFORM_COLORS[r.platform] || '#9C978C' }}
                  />
                  <span className="text-[10px] font-sans font-medium text-[#F5F1EA] leading-tight">{r.platform.split(' ')[0]}</span>
                </div>
                <div>
                  {/* Coral for brand mentioned (this is you), sky blue for neutral/competitor context */}
                  <span className={`text-[10px] font-sans font-bold ${
                    r.brandMentioned ? 'text-[#D9714A]' : 'text-[#9C978C]'
                  }`}>
                    {r.brandMentioned ? '✓ Brand cited' : '✗ Not mentioned'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-sans px-1.5 py-0.5 rounded-full border ${
                    r.sentiment === 'positive'
                      ? 'text-[#D9714A] border-[#D9714A]/30 bg-[#D9714A]/10'
                      : r.sentiment === 'negative'
                      ? 'text-red-400 border-red-400/30 bg-red-400/10'
                      : 'text-[#9C978C] border-white/10 bg-white/5'
                  }`}>
                    {r.sentiment}
                  </span>
                </div>
                {/* Sky blue for informational citation count */}
                <span className="text-[10px] font-sans text-[#3FA9E0] flex items-center gap-1">
                  <ExternalLink className="h-2.5 w-2.5" /> {r.citationCount} citations
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
