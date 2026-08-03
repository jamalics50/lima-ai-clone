import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircularGauge } from '@/components/ui/CircularGauge';
import { PercentileBar } from '@/components/ui/PercentileBar';
import { Sparkline } from '@/components/ui/Sparkline';
import { MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

const competitorsData = [
  { name: 'Aura AI', score: 72, initial: 'A' },
  { name: 'Nexus Tech', score: 68, initial: 'N' },
  { name: 'OmniData', score: 64, initial: 'O' },
  { name: 'Vortex Labs', score: 59, initial: 'V' },
  { name: 'Krypton Inc', score: 54, initial: 'K' },
];

const recentActivity = [
  {
    id: 1,
    icon: MessageSquare,
    title: 'Mention Detected',
    description: 'Brand cited in TechCrunch AI Index',
    time: '12m ago',
  },
  {
    id: 2,
    icon: AlertCircle,
    title: 'Competitor Alert',
    description: 'Aura AI updated their core prompt suite',
    time: '2h ago',
  },
  {
    id: 3,
    icon: CheckCircle2,
    title: 'Audit Completed',
    description: 'Weekly visibility audit finished with 98% accuracy',
    time: '5h ago',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      <div>
        <h2 className="text-3xl font-serif font-medium tracking-tight text-[#F5F1EA] mb-1">Workspace Overview</h2>
        <p className="text-[#9C978C] text-sm font-sans leading-relaxed">
          Welcome back. Performance insights and real-time competitive standing.
        </p>
      </div>

      {/* 1. HERO ROW: 2-column grid (2fr / 1fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Cell (2fr): Featured Card with 150px Coral Gauge & Sparkline */}
        <Card className="lg:col-span-2 flex flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-sans uppercase tracking-widest text-[#9C978C]">Primary Metric</span>
              <h3 className="text-2xl font-serif font-medium text-[#F5F1EA] mt-1">Visibility Score</h3>
            </div>
            <span className="text-xs font-sans text-[#9C978C] bg-white/5 px-3 py-1 rounded-full border border-white/8">
              Tracked across 14 platforms
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around my-6 gap-6">
            {/* 150px Coral Gauge */}
            <CircularGauge percentage={84} variant="coral" size={150} strokeWidth={8} />

            {/* Sparkline Trend Line */}
            <div className="flex flex-col items-center sm:items-start space-y-2">
              <span className="text-xs font-sans text-[#9C978C]">30-Day Trend</span>
              <Sparkline data={[62, 68, 65, 74, 78, 80, 84]} color="#D9714A" width={140} height={48} />
              <span className="text-xs font-sans text-[#D9714A] font-semibold">+12% increase</span>
            </div>
          </div>

          <div className="text-xs font-sans text-[#9C978C] pt-2 border-t border-white/8 flex justify-between">
            <span>Last updated 5 mins ago</span>
            <span>Confidence index: High</span>
          </div>
        </Card>

        {/* Right Cell (1fr): Vertical Stack of 2 Smaller Cards */}
        <div className="flex flex-col gap-6">
          {/* Card A: Compact Market Share Tile (56px Sky Blue Gauge inline with label) */}
          <Card className="flex-1 p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-sans text-[#9C978C]">Market Share</span>
              <div className="text-2xl font-sans font-semibold text-[#F5F1EA] mt-1">32%</div>
              <span className="text-xs font-sans text-[#9C978C]">Industry Rank #2</span>
            </div>
            <CircularGauge percentage={32} variant="sky-blue" size={56} strokeWidth={5} />
          </Card>

          {/* Card B: Plain Number Stat Card (Total Mentions, no gauge) */}
          <Card className="flex-1 p-5 flex flex-col justify-center">
            <span className="text-xs font-sans text-[#9C978C]">Total Mentions</span>
            <div className="text-3xl font-sans font-bold text-[#F5F1EA] mt-1">1,234</div>
            <span className="text-xs font-sans text-[#3FA9E0] mt-1 font-medium">+20.1% from last month</span>
          </Card>
        </div>
      </div>

      {/* 2. FULL-WIDTH COMPETITIVE ANALYSIS CARD: 3-column percentile bars side by side */}
      <Card className="p-6">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-xl">Competitive Benchmark Analysis</CardTitle>
          <CardDescription className="text-sm">
            Performance comparison across core functional vectors vs. industry average.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/2 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-sans font-medium text-[#F5F1EA]">Customer Engagement</span>
                <span className="text-xs font-sans font-bold text-[#D9714A]">78 / 100</span>
              </div>
              <PercentileBar score={78} average={45} />
            </div>

            <div className="bg-white/2 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-sans font-medium text-[#F5F1EA]">Prompt Effectiveness</span>
                <span className="text-xs font-sans font-bold text-[#D9714A]">92 / 100</span>
              </div>
              <PercentileBar score={92} average={60} />
            </div>

            <div className="bg-white/2 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-sans font-medium text-[#F5F1EA]">Response Quality</span>
                <span className="text-xs font-sans font-bold text-[#D9714A]">85 / 100</span>
              </div>
              <PercentileBar score={85} average={52} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. HORIZONTAL-SCROLLING COMPETITOR STRIP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-medium text-[#F5F1EA]">Competitor Tracking</h3>
          <span className="text-xs font-sans text-[#3FA9E0] hover:underline cursor-pointer">View all 12 competitors &rarr;</span>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin">
          {competitorsData.map((item, idx) => (
            <div 
              key={idx} 
              className="min-w-[150px] bg-[#1C1917] border border-white/8 rounded-full py-2.5 px-4 flex items-center gap-3 shrink-0"
            >
              {/* Avatar circle in Sky Blue (Competitors are never Coral) */}
              <div className="h-7 w-7 rounded-full bg-[#3FA9E0]/20 text-[#3FA9E0] flex items-center justify-center text-xs font-sans font-bold border border-[#3FA9E0]/30">
                {item.initial}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-sans font-medium text-[#F5F1EA] truncate max-w-[70px]">{item.name}</span>
                {/* Score in Sky Blue */}
                <span className="text-[11px] font-sans font-bold text-[#3FA9E0]">{item.score}% score</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. BOTTOM ROW: Asymmetric 2-column grid (1.4fr / 1fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (1.4fr ~ 7 cols): Recent Activity Timeline */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription className="text-sm">
              Live updates and real-time mention tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-white/8">
            {recentActivity.map((act) => (
              <div key={act.id} className="py-3.5 flex items-start gap-4 first:pt-0 last:pb-0">
                <div className="h-8 w-8 rounded-full bg-[#3FA9E0]/10 text-[#3FA9E0] flex items-center justify-center shrink-0 border border-[#3FA9E0]/20 mt-0.5">
                  <act.icon className="h-4 w-4 stroke-[1.5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-sans font-medium text-[#F5F1EA]">{act.title}</span>
                    <span className="text-xs font-sans text-[#9C978C]">{act.time}</span>
                  </div>
                  <p className="text-xs font-sans text-[#9C978C] mt-0.5 truncate">{act.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right (1fr ~ 5 cols): Actions Panel with 3 Tiers */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-xl">Actions</CardTitle>
            <CardDescription className="text-sm">
              Recommended workflow operations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Primary Action - Solid Coral */}
            <Button className="w-full justify-center" variant="primary">
              Generate Audit Report
            </Button>
            {/* Secondary Action - Sky Blue Outline */}
            <Button className="w-full justify-center" variant="secondary">
              Review New Mentions
            </Button>
            {/* Tertiary Action - Neutral White 16% Outline */}
            <Button className="w-full justify-center" variant="tertiary">
              Manage Competitors
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
