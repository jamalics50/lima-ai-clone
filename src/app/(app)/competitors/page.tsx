import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircularGauge } from '@/components/ui/CircularGauge';
import { PercentileBar } from '@/components/ui/PercentileBar';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Users, Plus, TrendingUp, Award } from 'lucide-react';

const competitorsMatrix = [
  { name: 'Your Brand (LIMA)', sentiment: '84%', marketShare: '32%', promptScore: '92%', responseQuality: '85%', status: 'Primary', isUser: true },
  { name: 'Aura AI', sentiment: '72%', marketShare: '24%', promptScore: '78%', responseQuality: '76%', status: 'Tracking', isUser: false },
  { name: 'Nexus Tech', sentiment: '68%', marketShare: '18%', promptScore: '71%', responseQuality: '70%', status: 'Tracking', isUser: false },
  { name: 'OmniData', sentiment: '64%', marketShare: '12%', promptScore: '65%', responseQuality: '62%', status: 'Tracking', isUser: false },
  { name: 'Vortex Labs', sentiment: '59%', marketShare: '8%', promptScore: '58%', responseQuality: '55%', status: 'Tracking', isUser: false },
];

const barComparisons = [
  { label: 'Visibility Score', yourScore: 84, topCompetitor: 72, competitorName: 'Aura AI' },
  { label: 'Market Share', yourScore: 32, topCompetitor: 24, competitorName: 'Aura AI' },
  { label: 'Prompt Efficacy', yourScore: 92, topCompetitor: 78, competitorName: 'Aura AI' },
];

export default function CompetitorsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-medium tracking-tight text-[#F5F1EA]">Competitor Intelligence</h2>
          <p className="text-[#9C978C] text-sm font-sans">
            Benchmark performance, share of voice, and prompt efficacy against key market rivals.
          </p>
        </div>
        {/* One primary button per page — coral */}
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Competitor
        </Button>
      </div>

      {/* HERO ROW: asymmetric split — featured Your Brand card + KPI counters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured "Your Brand" card — coral accents, this is you */}
        <Card className="lg:col-span-2 p-6 border-[#D9714A]/25 bg-gradient-to-br from-[#1C1917] to-[#D9714A]/5">
          <div className="flex items-center gap-2 text-xs font-sans text-[#D9714A] uppercase tracking-wider font-semibold mb-4">
            <Award className="h-3.5 w-3.5" /> Your Brand — Market Leader
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Coral gauge — this is you, primary metric */}
            <CircularGauge percentage={84} variant="coral" size={110} strokeWidth={7} delay={0.1} />
            <div className="flex-1 space-y-3">
              <div>
                <span className="text-xs font-sans text-[#9C978C]">Visibility Score</span>
                <div className="text-3xl font-sans font-bold text-[#F5F1EA]">
                  <AnimatedNumber value={84} suffix="%" delay={100} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-xs font-sans text-[#9C978C] block">Market Share</span>
                  <span className="text-base font-sans font-bold text-[#F5F1EA]">32%</span>
                </div>
                <div>
                  <span className="text-xs font-sans text-[#9C978C] block">Prompt Score</span>
                  <span className="text-base font-sans font-bold text-[#F5F1EA]">92%</span>
                </div>
                <div>
                  <span className="text-xs font-sans text-[#9C978C] block">Industry Rank</span>
                  <span className="text-base font-sans font-bold text-[#D9714A]">#1</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Quick KPI stack */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1 p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-[#3FA9E0]/15 text-[#3FA9E0] flex items-center justify-center border border-[#3FA9E0]/30 shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-sans text-[#9C978C]">Tracked Competitors</span>
              <div className="text-2xl font-sans font-bold text-[#F5F1EA]">12 Active</div>
            </div>
          </Card>
          <Card className="flex-1 p-5">
            <span className="text-xs font-sans text-[#9C978C]">Market Gap Index</span>
            <div className="text-2xl font-sans font-bold text-[#3FA9E0] flex items-center gap-1.5 mt-1">
              <TrendingUp className="h-5 w-5" />
              +14.2%
            </div>
            <span className="text-xs font-sans text-[#9C978C]">Lead over #2</span>
          </Card>
        </div>
      </div>

      {/* HEAD-TO-HEAD COMPARISON STRIP — horizontal bar comparisons, non-grid rhythm */}
      <Card className="p-6">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-xl">You vs. Top Competitor</CardTitle>
          <CardDescription className="text-sm">
            Direct comparison against Aura AI, your closest rival across key metrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 space-y-6">
          {barComparisons.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-sans font-medium text-[#F5F1EA]">{item.label}</span>
                <div className="flex items-center gap-4 text-xs font-sans">
                  {/* Coral for user, sky blue for competitor */}
                  <span className="text-[#D9714A] font-bold">You: {item.yourScore}</span>
                  <span className="text-[#3FA9E0]">{item.competitorName}: {item.topCompetitor}</span>
                </div>
              </div>
              <PercentileBar score={item.yourScore} average={item.topCompetitor} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* COMPETITOR MATRIX TABLE — table rhythm, deliberately different from card grid */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="p-6 border-b border-white/8">
          <CardTitle className="text-xl">Full Market Comparison Matrix</CardTitle>
          <CardDescription className="text-sm">
            Head-to-head metrics comparing your brand with all tracked competitors.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-white/8 text-xs font-sans text-[#9C978C] uppercase tracking-wider bg-white/2">
                <th className="py-3.5 px-6">Brand / Company</th>
                <th className="py-3.5 px-4">Sentiment</th>
                <th className="py-3.5 px-4">Market Share</th>
                <th className="py-3.5 px-4">Prompt Efficacy</th>
                <th className="py-3.5 px-4">Response Quality</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8 text-[#F5F1EA]">
              {competitorsMatrix.map((row, idx) => (
                <tr
                  key={idx}
                  className={row.isUser ? 'bg-[#D9714A]/8 border-l-2 border-l-[#D9714A]' : 'hover:bg-white/2 transition-colors'}
                >
                  <td className="py-4 px-6 font-medium">
                    <div className="flex items-center gap-3">
                      {/* Coral avatar for user, sky blue for competitors */}
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        row.isUser ? 'bg-[#D9714A] text-[#4A1B0C]' : 'bg-[#3FA9E0]/20 text-[#3FA9E0] border border-[#3FA9E0]/30'
                      }`}>
                        {row.name.charAt(0)}
                      </div>
                      <span>{row.name}</span>
                    </div>
                  </td>
                  {/* Coral for user metrics, sky blue for competitors */}
                  <td className={`py-4 px-4 font-bold ${row.isUser ? 'text-[#D9714A]' : 'text-[#3FA9E0]'}`}>{row.sentiment}</td>
                  <td className="py-4 px-4 text-[#9C978C]">{row.marketShare}</td>
                  <td className="py-4 px-4 text-[#9C978C]">{row.promptScore}</td>
                  <td className="py-4 px-4 text-[#9C978C]">{row.responseQuality}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${
                      row.isUser
                        ? 'bg-[#D9714A]/20 text-[#D9714A] border-[#D9714A]/40'
                        : 'bg-white/5 text-[#9C978C] border-white/10'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
}
