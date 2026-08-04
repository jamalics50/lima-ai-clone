'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { completeOnboarding } from './actions';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1 State
  const [brandName, setBrandName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [category, setCategory] = useState('');

  // Step 2 State
  const [competitors, setCompetitors] = useState([{ name: '', url: '' }]);

  // Step 3 State
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);

  const handleAddCompetitor = () => {
    if (competitors.length < 5) {
      setCompetitors([...competitors, { name: '', url: '' }]);
    }
  };

  const handleCompetitorChange = (index: number, field: 'name' | 'url', value: string) => {
    const newComps = [...competitors];
    newComps[index][field] = value;
    setCompetitors(newComps);
  };

  const handleRemoveCompetitor = (index: number) => {
    const newComps = [...competitors];
    newComps.splice(index, 1);
    setCompetitors(newComps);
  };

  const generatePrompts = () => {
    const cat = category || 'software';
    return [
      `What are the best ${cat} platforms for enterprise use?`,
      `How does ${brandName || 'this brand'} compare to top ${cat} competitors?`,
      `Top 5 ${cat} solutions recommended by Reddit.`,
      `What are the pros and cons of using ${brandName || 'this brand'} for ${cat}?`,
    ];
  };

  const generatedPrompts = generatePrompts();

  const togglePrompt = (prompt: string) => {
    if (selectedPrompts.includes(prompt)) {
      setSelectedPrompts(selectedPrompts.filter(p => p !== prompt));
    } else {
      setSelectedPrompts([...selectedPrompts, prompt]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await completeOnboarding({
        brandName,
        websiteUrl,
        category,
        competitors: competitors.filter(c => c.name && c.url),
        prompts: selectedPrompts,
      });
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error?.message || String(error));
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 max-w-xl mx-auto">
      <div className="mb-8">
        <div className="flex gap-2 mb-2">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-[#D9714A]' : 'bg-white/10'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[#D9714A]' : 'bg-white/10'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-[#D9714A]' : 'bg-white/10'}`} />
        </div>
        <p className="text-sm font-sans text-[#9C978C]">Step {step} of 3</p>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-card-mount opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div>
            <h2 className="text-xl font-serif text-[#F5F1EA] mb-2">Tell us about your brand</h2>
            <p className="text-sm font-sans text-[#9C978C]">Let&apos;s set up your primary tracking subject.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-sans font-medium text-[#F5F1EA] mb-1">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full bg-[#141210] border border-white/8 rounded-xl px-4 py-2.5 text-sm font-sans text-[#F5F1EA] placeholder:text-[#9C978C]/50 focus:outline-none focus:border-[#D9714A]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-sans font-medium text-[#F5F1EA] mb-1">Website URL</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://acme.com"
                className="w-full bg-[#141210] border border-white/8 rounded-xl px-4 py-2.5 text-sm font-sans text-[#F5F1EA] placeholder:text-[#9C978C]/50 focus:outline-none focus:border-[#D9714A]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-sans font-medium text-[#F5F1EA] mb-1">Category / Industry</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. CRM software, running shoes"
                className="w-full bg-[#141210] border border-white/8 rounded-xl px-4 py-2.5 text-sm font-sans text-[#F5F1EA] placeholder:text-[#9C978C]/50 focus:outline-none focus:border-[#D9714A]/50 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              variant="primary" 
              onClick={() => setStep(2)}
              disabled={!brandName || !websiteUrl}
            >
              Next Step
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-card-mount opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div>
            <h2 className="text-xl font-serif text-[#F5F1EA] mb-2">Who are your competitors?</h2>
            <p className="text-sm font-sans text-[#9C978C]">Add up to 5 competitors to benchmark against.</p>
          </div>

          <div className="space-y-4">
            {competitors.map((comp, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={comp.name}
                    onChange={(e) => handleCompetitorChange(idx, 'name', e.target.value)}
                    placeholder="Competitor Name"
                    className="w-full bg-[#141210] border border-white/8 rounded-xl px-4 py-2 text-sm font-sans text-[#F5F1EA] focus:outline-none focus:border-[#3FA9E0]/50 transition-colors"
                  />
                  <input
                    type="url"
                    value={comp.url}
                    onChange={(e) => handleCompetitorChange(idx, 'url', e.target.value)}
                    placeholder="Website URL"
                    className="w-full bg-[#141210] border border-white/8 rounded-xl px-4 py-2 text-sm font-sans text-[#F5F1EA] focus:outline-none focus:border-[#3FA9E0]/50 transition-colors"
                  />
                </div>
                {competitors.length > 1 && (
                  <button 
                    onClick={() => handleRemoveCompetitor(idx)}
                    className="mt-2 text-[#9C978C] hover:text-[#D9714A] transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {competitors.length < 5 && (
            <button 
              onClick={handleAddCompetitor}
              className="text-sm font-sans text-[#3FA9E0] hover:text-[#3FA9E0]/80 transition-colors"
            >
              + Add another competitor
            </button>
          )}

          <div className="pt-4 flex justify-between">
            <Button variant="tertiary" onClick={() => setStep(1)}>Back</Button>
            <Button 
              variant="primary" 
              onClick={() => setStep(3)}
              disabled={!competitors[0].name || !competitors[0].url}
            >
              Next Step
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-card-mount opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div>
            <h2 className="text-xl font-serif text-[#F5F1EA] mb-2">Select Prompts to Track</h2>
            <p className="text-sm font-sans text-[#9C978C]">We&apos;ve generated some template prompts based on your category. Select the ones you want to run.</p>
          </div>

          <div className="space-y-3">
            {generatedPrompts.map((prompt, idx) => (
              <div 
                key={idx}
                onClick={() => togglePrompt(prompt)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedPrompts.includes(prompt) 
                    ? 'border-[#D9714A] bg-[#D9714A]/5' 
                    : 'border-white/8 hover:border-white/20'
                }`}
              >
                <p className="text-sm font-sans text-[#F5F1EA]">{prompt}</p>
              </div>
            ))}
          </div>

          {errorMsg && (
            <div className="p-3 text-sm font-sans text-red-400 bg-red-400/10 border border-red-400/30 rounded-xl">
              Error: {errorMsg}
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <Button variant="tertiary" onClick={() => setStep(2)}>Back</Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={selectedPrompts.length === 0 || isLoading}
            >
              {isLoading ? 'Saving...' : 'Complete Setup'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
