import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircularGauge } from '@/components/ui/CircularGauge';
import { PercentileBar } from '@/components/ui/PercentileBar';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Plus, TrendingUp, Award } from 'lucide-react';
import { MotionWrapper } from '@/components/ui/MotionWrapper';

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
    <div className="space-y-8 max-w-6xl mx-auto py-2 overflow-x-hidden">

      {/* Page Header */}
      <MotionWrapper delay={0} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-medium tracking-tight text-foreground">Competitor Intelligence</h2>
          <p className="text-muted-foreground text-sm font-sans mt-1">
            Benchmark performance, share of voice, and prompt efficacy against key market rivals.
          </p>
        </div>
        {/* One primary button per page — coral */}
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Competitor
        </Button>
      </MotionWrapper>

      {/* HERO ROW: asymmetric split — featured Your Brand card + KPI counters */}
      <MotionWrapper delay={0.1} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured "Your Brand" card — coral glow, market leader emotional high point */}
        <Card className="lg:col-span-2 p-7 border-coral/30 bg-gradient-to-br from-card to-coral/5 shadow-glow">
          <div className="flex items-center gap-2 text-xs font-sans text-coral uppercase tracking-wider font-semibold mb-6">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-coral/15 border border-coral/25 text-coral">
              <Award className="h-3.5 w-3.5" /> Your Brand — Market Leader
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Coral gauge — this is you, primary metric */}
            <CircularGauge percentage={84} variant="coral" size={110} strokeWidth={7} delay={0.1} />
            <div className="flex-1 space-y-4">
              <div>
                <span className="text-xs font-sans text-muted-foreground uppercase tracking-wider font-semibold">Competitors Tracked</span>
                <div className="text-4xl font-serif font-medium text-foreground tracking-tight mt-1">
                  <AnimatedNumber value={competitorsMatrix.length} delay={100} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-sans text-muted-foreground">Highest SOV</span>
                  <span className="text-lg font-serif font-medium text-foreground">32%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-sans text-muted-foreground">Top Positive Sentiment</span>
                  <span className="text-lg font-serif font-medium text-foreground">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-sans text-muted-foreground">Your Rank</span>
                  <span className="text-lg font-serif font-medium text-coral">#1</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Quick KPI stack */}
        <div className="flex flex-col gap-6">
          <Card className="flex-1 p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-sans text-muted-foreground">Market Position</span>
              <div className="text-2xl font-serif font-medium text-foreground mt-0.5">12 Active</div>
              <span className="text-[11px] font-sans text-muted-foreground mt-0.5 block">Players in top 50 responses</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-sans text-muted-foreground">Growth</span>
              <div className="text-3xl font-serif font-medium text-sky flex items-center gap-2 mt-1">
                <TrendingUp className="h-5 w-5 stroke-[2]" />
                +14.2%
              </div>
              <span className="text-xs font-sans text-muted-foreground mt-2 block">Lead over #2</span>
            </div>
          </Card>
        </div>
      </MotionWrapper>

      {/* HEAD-TO-HEAD COMPARISON STRIP — horizontal bar comparisons, non-grid rhythm */}
      <MotionWrapper delay={0.2}>
        <Card className="p-7 shadow-sm hover:-translate-y-1 transition-all duration-300">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-xl font-semibold">You vs. Top Competitor</CardTitle>
          <CardDescription className="text-sm">
            Direct comparison against Aura AI, your closest rival across key metrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 space-y-6">
          {barComparisons.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-sans font-medium text-foreground">{item.label}</span>
                <div className="flex items-center gap-4 text-xs font-sans">
                  {/* Coral for user, sky blue for competitor */}
                  <span className="text-coral font-semibold">You: {item.yourScore}</span>
                  <span className="text-sky font-medium">{item.competitorName}: {item.topCompetitor}</span>
                </div>
              </div>
              <PercentileBar score={item.yourScore} average={item.topCompetitor} />
            </div>
          ))}
        </CardContent>
      </Card>
      </MotionWrapper>

      {/* COMPETITOR MATRIX TABLE — table rhythm, deliberately different from card grid */}
      <MotionWrapper delay={0.3}>
        <Card className="p-0 overflow-hidden shadow-sm hover:-translate-y-1 transition-all duration-300">
        <CardHeader className="p-6 border-b border-border bg-background">
          <CardTitle className="text-xl font-semibold">Full Market Comparison Matrix</CardTitle>
          <CardDescription className="text-sm">
            Head-to-head metrics comparing your brand with all tracked competitors.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto bg-card">
          <table className="w-full text-left text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-border text-[11px] font-sans font-semibold text-muted-foreground uppercase tracking-wider bg-background">
                <th className="py-4 px-6">Brand / Company</th>
                <th className="py-4 px-4">Sentiment</th>
                <th className="py-4 px-4">Market Share</th>
                <th className="py-4 px-4">Prompt Efficacy</th>
                <th className="py-4 px-4">Response Quality</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {competitorsMatrix.map((row, idx) => (
                <tr
                  key={idx}
                  className={row.isUser ? 'bg-coral/5 border-l-2 border-l-coral' : 'hover:bg-surface-2 transition-colors'}
                >
                  <td className="py-4 px-6 font-medium">
                    <div className="flex items-center gap-3">
                      {/* Coral avatar for user, sky blue for competitors */}
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                        row.isUser ? 'bg-coral text-background' : 'bg-sky/10 text-sky border border-sky/20'
                      }`}>
                        {row.name.charAt(0)}
                      </div>
                      <span>{row.name}</span>
                    </div>
                  </td>
                  {/* Coral for user metrics, sky blue for competitors */}
                  <td className={`py-4 px-4 font-semibold ${row.isUser ? 'text-coral' : 'text-sky'}`}>{row.sentiment}</td>
                  <td className="py-4 px-4 text-muted-foreground">{row.marketShare}</td>
                  <td className="py-4 px-4 text-muted-foreground">{row.promptScore}</td>
                  <td className="py-4 px-4 text-muted-foreground">{row.responseQuality}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                      row.isUser
                        ? 'bg-coral/10 text-coral border-coral/20'
                        : 'bg-white/5 text-muted-foreground border-border'
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
      </MotionWrapper>

    </div>
  );
}
