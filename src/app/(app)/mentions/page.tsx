import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, Filter, MessageSquare, ExternalLink, ThumbsUp, ArrowUpRight } from 'lucide-react';

const mentionsList = [
  {
    id: 1,
    source: 'TechCrunch AI Index',
    snippet: 'LIMA AI-CLONE has emerged as a top contender in brand monitoring automation, outperforming legacy benchmarks.',
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

export default function MentionsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-medium tracking-tight text-[#F5F1EA]">Mentions & Coverage</h2>
          <p className="text-[#9C978C] text-sm font-sans">
            Real-time feed of web citations, social posts, and industry news mentioning your brand.
          </p>
        </div>
        <Button variant="primary">Export Mentions Report</Button>
      </div>

      {/* Featured Top Mention Highlight Card */}
      <Card className="p-6 bg-gradient-to-r from-[#1C1917] via-[#1C1917] to-[#3FA9E0]/10 border-[#3FA9E0]/30">
        <div className="flex items-center gap-2 text-xs font-sans text-[#3FA9E0] uppercase tracking-wider font-semibold mb-2">
          <ArrowUpRight className="h-4 w-4" /> Top Trending Mention
        </div>
        <h3 className="text-xl font-serif font-medium text-[#F5F1EA] mb-2">
          &ldquo;LIMA AI sets the benchmark for enterprise prompt monitoring in 2026.&rdquo;
        </h3>
        <p className="text-sm font-sans text-[#9C978C] mb-4 max-w-3xl">
          Published by TechCrunch • Reached 45,000+ industry professionals with 96% positive sentiment rating.
        </p>
        <div className="flex items-center gap-4 text-xs font-sans text-[#F5F1EA]">
          <span className="flex items-center gap-1.5"><ThumbsUp className="h-3.5 w-3.5 text-[#3FA9E0]" /> 1,240 Engagements</span>
          <span>•</span>
          <span className="text-[#3FA9E0] underline flex items-center gap-1 cursor-pointer">Read Full Article <ExternalLink className="h-3 w-3" /></span>
        </div>
      </Card>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#9C978C]" />
          <input
            type="text"
            placeholder="Search mentions by keyword, domain, or source..."
            className="w-full bg-[#1C1917] border border-white/8 rounded-full pl-10 pr-4 py-2 text-sm text-[#F5F1EA] placeholder-[#9C978C] focus:outline-none focus:border-[#3FA9E0]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Button variant="secondary" size="sm" className="whitespace-nowrap flex items-center gap-2">
            <Filter className="h-3.5 w-3.5" /> All Sources
          </Button>
          <Button variant="tertiary" size="sm" className="whitespace-nowrap">Positive Only</Button>
          <Button variant="tertiary" size="sm" className="whitespace-nowrap">Last 7 Days</Button>
        </div>
      </div>

      {/* Timeline Feed List Rhythm */}
      <div className="space-y-4">
        {mentionsList.map((item) => (
          <Card key={item.id} className="p-5 hover:border-white/20 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#3FA9E0]/15 text-[#3FA9E0] flex items-center justify-center border border-[#3FA9E0]/30">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-base font-serif font-medium text-[#F5F1EA]">{item.source}</h4>
                  <span className="text-xs font-sans text-[#9C978C]">{item.date} • {item.platform}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={item.sentiment === 'Positive' ? 'default' : 'secondary'}>
                  {item.sentiment}
                </Badge>
                <span className="text-xs font-sans font-bold text-[#3FA9E0]">{item.score}</span>
              </div>
            </div>
            <p className="text-sm font-sans text-[#9C978C] pl-0 sm:pl-11 leading-relaxed">
              {item.snippet}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
