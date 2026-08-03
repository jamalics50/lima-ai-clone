'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { seedData } from './actions';
import { Zap, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function SeedButton() {
  const [status, setStatus] = useState<'idle' | 'seeding' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<{ runsCreated?: number; error?: string } | null>(null);

  const handleSeed = async () => {
    setStatus('seeding');
    setResult(null);
    try {
      const res = await seedData();
      setResult(res);
      setStatus(res.error ? 'error' : 'done');
    } catch (e) {
      setResult({ error: String(e) });
      setStatus('error');
    }
  };

  return (
    <div className="space-y-3">
      <Button
        variant="primary"
        onClick={handleSeed}
        disabled={status === 'seeding' || status === 'done'}
        className="flex items-center gap-2 w-full justify-center"
      >
        {status === 'seeding' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Zap className="h-4 w-4" />
        )}
        {status === 'idle' && 'Generate 30 Days of Data'}
        {status === 'seeding' && 'Seeding data… (10–20 seconds)'}
        {status === 'done' && 'Done!'}
        {status === 'error' && 'Failed — retry'}
      </Button>

      {status === 'done' && result && (
        <div className="flex items-center gap-2 text-sm font-sans text-[#D9714A] bg-[#D9714A]/10 border border-[#D9714A]/30 rounded-xl px-4 py-3">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Created {result.runsCreated} platform runs.{' '}
          <a href="/" className="underline">Refresh the Overview →</a>
        </div>
      )}

      {status === 'error' && result?.error && (
        <div className="flex items-center gap-2 text-sm font-sans text-red-400 bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {result.error}
        </div>
      )}
    </div>
  );
}
