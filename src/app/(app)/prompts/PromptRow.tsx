'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { runPrompt } from './actions';
import { Play } from 'lucide-react';

interface Prompt {
  id: string;
  text: string;
  created_at: string;
}

export function PromptRow({ prompt }: { prompt: Prompt }) {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      await runPrompt(prompt.id);
      alert('Run completed successfully! Check the database for results.');
    } catch (error) {
      console.error(error);
      alert('Failed to run prompt.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-white/8 rounded-xl bg-[#1C1917] hover:border-white/20 transition-all group">
      <div>
        <p className="text-[#F5F1EA] font-sans font-medium text-sm">{prompt.text}</p>
        <p className="text-[#9C978C] font-sans text-xs mt-1">
          Added {new Date(prompt.created_at).toLocaleDateString()}
        </p>
      </div>
      <Button 
        variant="secondary" 
        onClick={handleRun}
        disabled={isRunning}
        className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Play className="h-4 w-4" />
        {isRunning ? 'Running...' : 'Run Now'}
      </Button>
    </div>
  );
}
