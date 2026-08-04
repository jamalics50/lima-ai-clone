'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { runAuditAction } from './actions';
import type { CriterionResult } from '@/lib/audit/criteria';
import { CheckCircle2, XCircle, Loader2, Globe, Clock } from 'lucide-react';

interface HistoryItem {
  id: string;
  url: string;
  score: number;
  created_at: string;
}

interface AuditClientProps {
  history: HistoryItem[];
  brandWebsite?: string;
}

function ScoreBadge({ score, total = 15 }: { score: number; total?: number }) {
  const pct = Math.round((score / total) * 100);
  const color = pct >= 80 ? '#D9714A' : pct >= 50 ? '#3FA9E0' : '#9C978C';
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-20 w-20 shrink-0"
        style={{
          background: `conic-gradient(${color} ${pct}%, transparent 0)`,
          borderRadius: '50%',
        }}
      >
        <div className="absolute inset-2 rounded-full bg-[#1C1917] flex items-center justify-center">
          <span className="text-xl font-sans font-bold text-[#F5F1EA]">{score}</span>
        </div>
      </div>
      <div>
        <p className="text-3xl font-serif font-medium text-[#F5F1EA]">{score} / {total}</p>
        <p className="text-sm font-sans text-[#9C978C]">
          {pct >= 80 ? 'Excellent AI visibility' : pct >= 50 ? 'Moderate AI readiness' : 'Needs improvement'}
        </p>
      </div>
    </div>
  );
}

function CriterionRow({ result }: { result: CriterionResult }) {
  return (
    <div className={`flex items-start gap-3 py-3.5 border-b border-white/8 last:border-0`}>
      <div className={`mt-0.5 shrink-0 ${result.passed ? 'text-[#D9714A]' : 'text-[#3FA9E0]'}`}>
        {result.passed
          ? <CheckCircle2 className="h-5 w-5" />
          : <XCircle className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-sans font-medium text-[#F5F1EA]">{result.label}</p>
        <p className="text-xs font-sans text-[#9C978C] mt-0.5">{result.explanation}</p>
      </div>
      <span className={`text-[11px] font-sans font-semibold uppercase tracking-wide shrink-0 mt-0.5 ${result.passed ? 'text-[#D9714A]' : 'text-[#9C978C]'}`}>
        {result.passed ? 'Pass' : 'Fail'}
      </span>
    </div>
  );
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AuditClient({ history: initialHistory, brandWebsite }: AuditClientProps) {
  const [url, setUrl] = useState(brandWebsite ?? '');
  const [results, setResults] = useState<CriterionResult[] | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [auditUrl, setAuditUrl] = useState('');
  const [loadMs, setLoadMs] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(initialHistory);
  const [isPending, startTransition] = useTransition();

  const handleRun = () => {
    setError('');
    startTransition(async () => {
      const res = await runAuditAction(url);
      if (!res.success) {
        setError(res.error ?? 'Unknown error');
        return;
      }
      setResults(res.results ?? []);
      setScore(res.score ?? 0);
      setAuditUrl(res.url ?? url);
      setLoadMs(res.loadMs ?? null);
      // Prepend to history
      if (res.auditId) {
        setHistory(prev => [
          { id: res.auditId!, url: res.url!, score: res.score!, created_at: new Date().toISOString() },
          ...prev.slice(0, 4),
        ]);
      }
    });
  };

  const passed = results ? results.filter(r => r.passed).length : 0;
  const failed = results ? results.filter(r => !r.passed).length : 0;

  return (
    <div className="space-y-8">
      {/* URL Input */}
      <div className="bg-[#1C1917] border border-white/8 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-sans font-medium text-[#F5F1EA] mb-1">Website URL to audit</label>
          <p className="text-xs font-sans text-[#9C978C]">
            We&apos;ll check your page against 15 AI-readiness criteria — no JS execution, raw HTML only.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 flex items-center bg-[#141210] border border-white/8 rounded-xl px-4 gap-2 focus-within:border-[#D9714A]/50 transition-colors">
            <Globe className="h-4 w-4 text-[#9C978C] shrink-0" />
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isPending && handleRun()}
              placeholder="https://yoursite.com"
              className="flex-1 bg-transparent py-3 text-sm font-sans text-[#F5F1EA] placeholder:text-[#9C978C]/50 focus:outline-none"
            />
          </div>
          <Button
            variant="primary"
            onClick={handleRun}
            disabled={isPending || !url}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Running…
              </span>
            ) : 'Run Audit'}
          </Button>
        </div>
        {error && (
          <p className="text-sm font-sans text-red-400 bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
      </div>

      {/* Results */}
      {isPending && (
        <div className="bg-[#1C1917] border border-white/8 rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 text-[#D9714A] animate-spin" />
          <div>
            <p className="text-base font-serif font-medium text-[#F5F1EA]">Analysing your page…</p>
            <p className="text-sm font-sans text-[#9C978C] mt-1">
              Fetching HTML, robots.txt, sitemap.xml, and llms.txt concurrently
            </p>
          </div>
        </div>
      )}

      {results && score !== null && !isPending && (
        <div className="bg-[#1C1917] border border-white/8 rounded-2xl overflow-hidden">
          {/* Score header */}
          <div className="p-6 border-b border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <ScoreBadge score={score} />
              <div className="flex items-center gap-2 mt-3 text-xs font-sans text-[#9C978C]">
                <Globe className="h-3.5 w-3.5" />
                <span className="truncate max-w-xs">{auditUrl}</span>
                {loadMs !== null && (
                  <>
                    <Clock className="h-3.5 w-3.5 ml-2" />
                    <span>{loadMs}ms</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-6 text-center shrink-0">
              <div>
                <p className="text-2xl font-sans font-bold text-[#D9714A]">{passed}</p>
                <p className="text-xs font-sans text-[#9C978C]">passed</p>
              </div>
              <div>
                <p className="text-2xl font-sans font-bold text-[#3FA9E0]">{failed}</p>
                <p className="text-xs font-sans text-[#9C978C]">failed</p>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="px-6 divide-y divide-white/4">
            {/* Failed first */}
            {results.filter(r => !r.passed).map(r => <CriterionRow key={r.id} result={r} />)}
            {results.filter(r => r.passed).map(r => <CriterionRow key={r.id} result={r} />)}
          </div>
        </div>
      )}

      {/* Audit History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-serif font-medium text-[#F5F1EA]">Recent Audits</h3>
          <div className="bg-[#1C1917] border border-white/8 rounded-2xl divide-y divide-white/8">
            {history.map(item => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <Globe className="h-4 w-4 text-[#9C978C] shrink-0" />
                  <span className="text-sm font-sans text-[#F5F1EA] truncate max-w-xs">{item.url}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className={`text-sm font-sans font-semibold ${
                    item.score >= 12 ? 'text-[#D9714A]' : item.score >= 8 ? 'text-[#3FA9E0]' : 'text-[#9C978C]'
                  }`}>{item.score}/15</span>
                  <span className="text-xs font-sans text-[#9C978C]">{timeAgo(item.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
