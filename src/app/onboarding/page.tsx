'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { completeOnboarding } from './actions';
import { useRouter } from 'next/navigation';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { CheckCircle2, Plus, X, Search, Building2, Globe, Tag } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
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
      `Top 5 ${cat} solutions recommended by Reddit and reviewers.`,
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
      const result = await completeOnboarding({
        brandName,
        websiteUrl,
        category,
        competitors: competitors.filter(c => c.name && c.url),
        prompts: selectedPrompts,
      });
      
      if (result.error) {
        setErrorMsg(result.error);
        setIsLoading(false);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error(error);
      const err = error as Error;
      setErrorMsg(err.message || String(error));
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-5 sm:p-8 max-w-2xl mx-auto bg-white shadow-float rounded-[28px] border border-black/5">
      {/* Progress Step Bar */}
      <div className="mb-8">
        <div className="flex gap-2.5 mb-3">
          <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-coral' : 'bg-black/10'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-coral' : 'bg-black/10'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-coral' : 'bg-black/10'}`} />
        </div>
        <p className="text-xs font-sans text-muted-foreground uppercase font-bold tracking-wider">Step {step} of 3</p>
      </div>

      {step === 1 && (
        <MotionWrapper delay={0} className="space-y-6">
          <div>
            <h2 className="text-2xl font-serif text-foreground font-medium tracking-tight mb-1.5 flex items-center gap-2">
              <Search className="h-6 w-6 text-coral" />
              Monitor a New Brand
            </h2>
            <p className="text-sm font-sans text-muted-foreground">
              Enter details for the brand you want to track across ChatGPT, Claude, Perplexity &amp; Google AI.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-medium text-muted-foreground ml-1 mb-1.5">Brand Name</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full bg-zinc-50/50 border border-black/10 rounded-xl pl-10 pr-4 py-2.5 text-base lg:text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-muted-foreground ml-1 mb-1.5">Website URL</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://acme.com"
                  className="w-full bg-zinc-50/50 border border-black/10 rounded-xl pl-10 pr-4 py-2.5 text-base lg:text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-muted-foreground ml-1 mb-1.5">Category / Industry</label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. CRM software, running shoes"
                  className="w-full bg-zinc-50/50 border border-black/10 rounded-xl pl-10 pr-4 py-2.5 text-base lg:text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-coral/50 focus-visible:ring-1 focus-visible:ring-coral/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              variant="primary" 
              onClick={() => setStep(2)}
              disabled={!brandName || !websiteUrl}
              className="h-11 px-6 rounded-xl text-sm"
            >
              Next Step →
            </Button>
          </div>
        </MotionWrapper>
      )}

      {step === 2 && (
        <MotionWrapper delay={0} className="space-y-6">
          <div>
            <h2 className="text-2xl font-serif text-foreground font-medium tracking-tight mb-1.5">
              Who are your key competitors?
            </h2>
            <p className="text-sm font-sans text-muted-foreground">Add up to 5 competitors to benchmark against.</p>
          </div>

          <div className="space-y-4">
            {competitors.map((comp, idx) => (
              <div key={idx} className="flex gap-3 items-start bg-zinc-50/50 p-4 rounded-xl border border-black/5">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={comp.name}
                    onChange={(e) => handleCompetitorChange(idx, 'name', e.target.value)}
                    placeholder="Competitor Name"
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-2 text-base lg:text-sm font-sans text-foreground focus:outline-none focus:border-sky/50 transition-all shadow-sm"
                  />
                  <input
                    type="url"
                    value={comp.url}
                    onChange={(e) => handleCompetitorChange(idx, 'url', e.target.value)}
                    placeholder="Website URL (e.g. https://competitor.com)"
                    className="w-full bg-white border border-black/10 rounded-xl px-4 py-2 text-base lg:text-sm font-sans text-foreground focus:outline-none focus:border-sky/50 transition-all shadow-sm"
                  />
                </div>
                {competitors.length > 1 && (
                  <button 
                    onClick={() => handleRemoveCompetitor(idx)}
                    className="p-1 text-muted-foreground hover:text-coral transition-colors rounded-lg hover:bg-black/5"
                    title="Remove competitor"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {competitors.length < 5 && (
            <button 
              onClick={handleAddCompetitor}
              className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-sky hover:underline"
            >
              <Plus className="h-4 w-4" /> Add another competitor
            </button>
          )}

          <div className="pt-4 flex justify-between items-center">
            <Button variant="secondary" onClick={() => setStep(1)} className="h-11 px-5 rounded-xl text-sm">
              ← Back
            </Button>
            <Button 
              variant="primary" 
              onClick={() => setStep(3)}
              disabled={!competitors[0].name || !competitors[0].url}
              className="h-11 px-6 rounded-xl text-sm"
            >
              Next Step →
            </Button>
          </div>
        </MotionWrapper>
      )}

      {step === 3 && (
        <MotionWrapper delay={0} className="space-y-6">
          <div>
            <h2 className="text-2xl font-serif text-foreground font-medium tracking-tight mb-1.5">
              Select Prompts to Track
            </h2>
            <p className="text-sm font-sans text-muted-foreground">
              We&apos;ve generated template prompts tailored to your category. Select the ones you want to run.
            </p>
          </div>

          <div className="space-y-3">
            {generatedPrompts.map((prompt, idx) => {
              const isSelected = selectedPrompts.includes(prompt);
              return (
                <div 
                  key={idx}
                  onClick={() => togglePrompt(prompt)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3 ${
                    isSelected 
                      ? 'border-coral bg-coral/5 shadow-sm' 
                      : 'border-black/10 bg-white hover:border-black/20'
                  }`}
                >
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                    isSelected ? 'bg-coral text-white border-coral' : 'border-black/20 bg-white'
                  }`}>
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />}
                  </div>
                  <p className={`text-sm font-sans font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {prompt}
                  </p>
                </div>
              );
            })}
          </div>

          {errorMsg && (
            <div className="p-3 text-sm font-sans text-red-600 bg-red-50 border border-red-200 rounded-xl">
              Error: {errorMsg}
            </div>
          )}

          <div className="pt-4 flex justify-between items-center">
            <Button variant="secondary" onClick={() => setStep(2)} className="h-11 px-5 rounded-xl text-sm">
              ← Back
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={selectedPrompts.length === 0 || isLoading}
              className="h-11 px-6 rounded-xl text-sm"
            >
              {isLoading ? 'Saving Brand...' : 'Complete & Start Monitoring'}
            </Button>
          </div>
        </MotionWrapper>
      )}
    </Card>
  );
}
