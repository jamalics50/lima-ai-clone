import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Filter, MessageSquare, ExternalLink, ThumbsUp, ArrowUpRight, TrendingUp, Radio } from 'lucide-react';

const mentionsList = [
  {
    id: 1,
    source: 'TechCrunch AI Index',
    snippet: 'LIMA AI has emerged as a top contender in brand monitoring automation, outperforming legacy benchmarks.',
    date: '2 hours ago',
    sentiment: 'Positive',
    platform: 'Article',
    score: '94% Match',
  },
  {
    id: 2,
    source: 'Hacker News Thread',
    snippet: 'Does anyone have experience using LIMA AI for automated competitive sentiment analysis vs. traditional APIs?',
    date: '5 hours ago',
    sentiment: 'Neutral',
    platform: 'Forum',
    score: '88% Match',
  },
  {
    id: 3,
    source: 'X / Twitter (@tech_guru)',
    snippet: 'Impressed by the real-time prompt tracking in LIMA AI. Huge time saver for marketing teams.',
    date: '1 day ago',
    sentiment: 'Positive',
    platform: 'Social',
    score: '91% Match',
  },
];

const sentimentColor = (s: string) => s === 'Positive' ? 'text-[#D9714A]' : 'text-[#9C978C]';

export default function MentionsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-medium tracking-tight text-[#F5F1EA]">Mentions &amp; Coverage</h2>
          <p className="text-[#9C978C] text-sm font-sans">
            Real-time feed of web citations, social posts, and industry news mentioning your brand.
          </p>
        </div>
        {/* One primary button per page */}
        <Button variant="primary">Export Mentions Report</Button>
      </div>

      {/* HERO: Featured Mention — full-width, sky blue accent border (informational) */}
      <Card className="p-6 border-[#3FA9E0]/30 bg-gradient-to-r from-[#1C1917] via-[#1C1917] to-[#3FA9E0]/8">
        <div className="flex items-center gap-2 text-xs font-sans text-[#3FA9E0] uppercase tracking-wider font-semibold mb-3">
          <Radio className="h-3.5 w-3.5" /> Top Trending Mention
        </div>
        <h3 className="text-xl font-serif font-medium text-[#F5F1EA] mb-2">
          &ldquo;LIMA AI sets the benchmark for enterprise prompt monitoring in 2026.&rdquo;
        </h3>
        <p className="text-sm font-sans text-[#9C978C] mb-4 max-w-3xl">
          Published by TechCrunch &bull; Reached 45,000+ industry professionals with 96% positive sentiment rating.
        </p>
        <div className="flex items-center gap-5 text-xs font-sans">
          <span className="flex items-center gap-1.5 text-[#F5F1EA]">
            <ThumbsUp className="h-3.5 w-3.5 text-[#3FA9E0]" /> 1,240 Engagements
          </span>
          <span className="flex items-center gap-1.5 text-[#F5F1EA]">
            <TrendingUp className="h-3.5 w-3.5 text-[#D9714A]" /> Coral = brand signal
          </span>
          <span className="text-[#3FA9E0] underline flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
            Read Full Article <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </Card>

      {/* KPI STAT STRIP — horizontal, breaks the card-grid rhythm */}
      <div className="grid grid-cols-3 divide-x divide-white/8 border border-white/8 rounded-2xl overflow-hidden bg-[#1C1917]">
        <div className="p-5">
          <span className="text-xs font-sans text-[#9C978C]">Total Mentions</span>
          <div className="text-2xl font-sans font-bold text-[#F5F1EA] mt-1">1,234</div>
          <span className="text-xs font-sans text-[#3FA9E0]">+20.1% this month</span>
        </div>
        <div className="p-5">
          <span className="text-xs font-sans text-[#9C978C]">Positive Sentiment</span>
          <div className="text-2xl font-sans font-bold text-[#D9714A] mt-1">76%</div>
          <span className="text-xs font-sans text-[#9C978C]">Industry avg: 58%</span>
        </div>
        <div className="p-5">
          <span className="text-xs font-sans text-[#9C978C]">Avg. Match Score</span>
          <div className="text-2xl font-sans font-bold text-[#F5F1EA] mt-1">91%</div>
          <span className="text-xs font-sans text-[#9C978C]">Across all sources</span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#9C978C]" />
          <input
            type="text"
            placeholder="Search mentions by keyword, domain, or source..."
            className="w-full bg-[#1C1917] border border-white/8 rounded-full pl-10 pr-4 py-2 text-sm text-[#F5F1EA] placeholder-[#9C978C] focus:outline-none focus:border-[#3FA9E0]/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" /> Filter
          </Button>
          <Button variant="tertiary" size="sm">Positive Only</Button>
          <Button variant="tertiary" size="sm">Last 7 Days</Button>
        </div>
      </div>

      {/* TIMELINE FEED — table-like rows, different rhythm from overview grid */}
      <div className="border border-white/8 rounded-2xl overflow-hidden bg-[#1C1917] divide-y divide-white/8">
        {mentionsList.map((item) => (
          <div key={item.id} className="flex items-start gap-4 p-5 hover:bg-white/2 transition-colors group">
            {/* Icon avatar — sky blue, informational */}
            <div className="h-9 w-9 rounded-full bg-[#3FA9E0]/15 text-[#3FA9E0] flex items-center justify-center border border-[#3FA9E0]/25 shrink-0 mt-0.5">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h4 className="text-base font-serif font-medium text-[#F5F1EA]">{item.source}</h4>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Coral for positive sentiment = brand signal / "you" context */}
                  <span className={`text-xs font-sans font-bold ${sentimentColor(item.sentiment)}`}>{item.sentiment}</span>
                  <span className="text-xs font-sans font-bold text-[#3FA9E0]">{item.score}</span>
                  <span className="text-xs font-sans text-[#9C978C]">{item.date}</span>
                </div>
              </div>
              <p className="text-sm font-sans text-[#9C978C] leading-relaxed">{item.snippet}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-sans text-[#9C978C] bg-white/5 px-2 py-0.5 rounded-full border border-white/8">{item.platform}</span>
                <span className="text-xs font-sans text-[#3FA9E0] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  View source <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
