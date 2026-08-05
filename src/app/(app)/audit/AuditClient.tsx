'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { runAuditAction } from './actions';
import type { CriterionResult } from '@/lib/audit/criteria';
import { CheckCircle2, XCircle, Globe, Clock } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import { FEEDBACK_DURATIONS, SPRING_CONFIGS } from '@/lib/feedback';

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
  const color = pct >= 80 ? 'var(--accent-primary)' : pct >= 50 ? 'var(--accent-blue)' : 'var(--accent-neutral)';
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-20 w-20 shrink-0"
        style={{
          background: `conic-gradient(${color} ${pct}%, transparent 0)`,
          borderRadius: '50%',
        }}
      >
        <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
          <span className="text-xl font-sans font-bold text-foreground">{score}</span>
        </div>
      </div>
      <div>
        <p className="text-3xl font-serif font-medium tracking-tight text-foreground">{score} / {total}</p>
        <p className="text-sm font-sans text-muted-foreground">
          {pct >= 80 ? 'Excellent AI visibility' : pct >= 50 ? 'Moderate AI readiness' : 'Needs improvement'}
        </p>
      </div>
    </div>
  );
}

function CriterionRow({ result, index }: { result: CriterionResult; index: number }) {
  return (
    <motion.div
      className={`flex items-start gap-3 py-3`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...SPRING_CONFIGS.gentle, delay: index * 0.03 }}
    >
      <div className={`mt-0.5 shrink-0 ${result.passed ? 'text-emerald' : 'text-rose'}`}>
        {result.passed
          ? <CheckCircle2 className="h-5 w-5" />
          : <XCircle className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-sans font-medium text-foreground">{result.label}</p>
        <p className="text-xs font-sans text-muted-foreground mt-0.5">{result.explanation}</p>
      </div>
      <span className={`text-[11px] font-sans font-semibold uppercase tracking-wide shrink-0 mt-0.5 ${result.passed ? 'text-emerald' : 'text-muted-foreground'}`}>
        {result.passed ? 'Pass' : 'Fail'}
      </span>
    </motion.div>
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
  const [revealedCount, setRevealedCount] = useState(0); // staggered reveal
  const { trigger } = useFeedback();

  // Tick revealed criteria one at a time when results arrive
  useEffect(() => {
    if (!results) { setRevealedCount(0); return; }
    setRevealedCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setRevealedCount(i);
      if (i >= results.length) {
        clearInterval(interval);
        trigger('success'); // pulse on final item
      }
    }, FEEDBACK_DURATIONS.criterionTick);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  const handleRun = () => {
    setError('');
    trigger('tap'); // tap feedback — does not change what runAuditAction does
    startTransition(async () => {
      const res = await runAuditAction(url);
      if (!res.success) {
        setError(res.error ?? 'Unknown error');
        trigger('error'); // error feedback
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
      <div className="bg-card border border-border rounded-2xl p-4 md:p-7 space-y-5 shadow-sm">
        <div>
          <label className="block text-sm font-sans font-medium text-foreground mb-1">Website URL to audit</label>
          <p className="text-xs font-sans text-muted-foreground">
            We&apos;ll check your page against 15 AI-readiness criteria — no JS execution, raw HTML only.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center bg-background border border-border rounded-xl px-4 gap-2 focus-within:border-coral/50 focus-within:ring-1 focus-within:ring-coral/50 transition-all shadow-sm">
            <Globe className="h-4 w-4 text-muted-foreground shrink-0 stroke-[1.5]" />
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isPending && handleRun()}
              placeholder="https://yoursite.com"
              className="flex-1 bg-transparent py-3 text-base lg:text-sm font-sans text-foreground placeholder:text-muted-foreground/80 focus:outline-none"
            />
          </div>
          <Button
            variant="primary"
            className="w-full sm:w-auto h-12 sm:h-9 min-h-[48px] sm:min-h-0"
            onClick={handleRun}
            disabled={isPending || !url}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                Running…
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
        <div className="bg-card border border-border border-coral/20 rounded-2xl p-8 flex flex-col items-center gap-4 text-center shadow-glow">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-2 border-coral/30 border-t-coral animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-coral/60 animate-pulse" />
            </div>
          </div>
          <div>
            <p className="text-lg font-serif font-medium tracking-tight text-foreground">Analysing your page…</p>
            <p className="text-sm font-sans text-muted-foreground mt-1">
              Fetching HTML, robots.txt, sitemap.xml, and llms.txt concurrently
            </p>
          </div>
        </div>
      )}

      {results && score !== null && !isPending && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Score header */}
          <div className="p-4 md:p-7 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <ScoreBadge score={score} />
              <div className="flex items-center gap-2 mt-4 text-xs font-sans text-muted-foreground">
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
                <p className="text-3xl font-sans font-bold text-coral">{passed}</p>
                <p className="text-xs font-sans text-muted-foreground font-medium uppercase tracking-wider mt-1">passed</p>
              </div>
              <div>
                <p className="text-3xl font-sans font-bold text-sky">{failed}</p>
                <p className="text-xs font-sans text-muted-foreground font-medium uppercase tracking-wider mt-1">failed</p>
              </div>
            </div>
          </div>

          {/* Checklist — items reveal one at a time via revealedCount */}
          <div className="px-7 py-5 grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <AnimatePresence>
              {/* Failed first, then passed */}
              {[...results.filter(r => !r.passed), ...results.filter(r => r.passed)]
                .slice(0, revealedCount)
                .map((r, idx) => <CriterionRow key={r.id} result={r} index={idx} />)}
            </AnimatePresence>
            {/* Placeholder chips for items not yet revealed */}
            {revealedCount < results.length && (
              <>
                {Array.from({ length: Math.min(3, results.length - revealedCount) }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <div className="h-5 w-5 rounded-full bg-black/5 animate-pulse shrink-0" />
                    <div className="h-3 flex-1 max-w-[120px] rounded-full bg-black/5 animate-pulse" />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Audit History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-serif font-medium tracking-tight text-foreground">Recent Audits</h3>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border shadow-sm">
            {history.map(item => {
              const pct = Math.round((item.score / 15) * 100);
              return (
                <div key={item.id} className="flex items-center justify-between px-5 py-4 hover:bg-surface-2 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0 stroke-[1.5]" />
                    <span className="text-sm font-sans font-medium text-foreground truncate max-w-xs">{item.url}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`text-[11px] font-sans font-bold px-2.5 py-1 rounded-full border ${
                      pct >= 80
                        ? 'bg-emerald/10 text-emerald border-emerald/25'
                        : pct >= 50
                        ? 'bg-sky/10 text-sky border-sky/25'
                        : 'bg-rose/10 text-rose border-rose/25'
                    }`}>{item.score}/15</span>
                    <span className="text-xs font-sans text-muted-foreground font-medium">{timeAgo(item.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
