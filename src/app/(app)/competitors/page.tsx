import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Plus } from 'lucide-react';

const competitorsMatrix = [
  { name: 'Your Brand (LIMA)', sentiment: '84%', marketShare: '32%', promptScore: '92%', responseQuality: '85%', status: 'Primary', isUser: true },
  { name: 'Aura AI', sentiment: '72%', marketShare: '24%', promptScore: '78%', responseQuality: '76%', status: 'Tracking', isUser: false },
  { name: 'Nexus Tech', sentiment: '68%', marketShare: '18%', promptScore: '71%', responseQuality: '70%', status: 'Tracking', isUser: false },
  { name: 'OmniData', sentiment: '64%', marketShare: '12%', promptScore: '65%', responseQuality: '62%', status: 'Tracking', isUser: false },
  { name: 'Vortex Labs', sentiment: '59%', marketShare: '8%', promptScore: '58%', responseQuality: '55%', status: 'Tracking', isUser: false },
];

export default function CompetitorsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-medium tracking-tight text-[#F5F1EA]">Competitor Intelligence</h2>
          <p className="text-[#9C978C] text-sm font-sans">
            Benchmark performance, share of voice, and prompt efficacy against key market rivals.
          </p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Competitor
        </Button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[#3FA9E0]/15 text-[#3FA9E0] flex items-center justify-center border border-[#3FA9E0]/30 shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-sans text-[#9C978C]">Tracked Competitors</span>
            <div className="text-2xl font-sans font-bold text-[#F5F1EA]">12 Active</div>
          </div>
        </Card>
        <Card className="p-5">
          <span className="text-xs font-sans text-[#9C978C]">Market Gap Index</span>
          <div className="text-2xl font-sans font-bold text-[#3FA9E0]">+14.2% Lead</div>
        </Card>
        <Card className="p-5">
          <span className="text-xs font-sans text-[#9C978C]">Benchmark Frequency</span>
          <div className="text-2xl font-sans font-bold text-[#F5F1EA]">Daily Sync</div>
        </Card>
      </div>

      {/* Competitor Matrix Comparison Table */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="p-6 border-b border-white/8">
          <CardTitle className="text-xl">Market Comparison Matrix</CardTitle>
          <CardDescription className="text-sm">
            Head-to-head metrics comparing your brand with tracked competitors.
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
                  className={row.isUser ? 'bg-[#D9714A]/10 border-l-2 border-l-[#D9714A]' : 'hover:bg-white/3'}
                >
                  <td className="py-4 px-6 font-medium flex items-center gap-3">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      row.isUser ? 'bg-[#D9714A] text-[#4A1B0C]' : 'bg-[#3FA9E0]/20 text-[#3FA9E0] border border-[#3FA9E0]/30'
                    }`}>
                      {row.name.charAt(0)}
                    </div>
                    <span>{row.name}</span>
                  </td>
                  <td className={`py-4 px-4 font-bold ${row.isUser ? 'text-[#D9714A]' : 'text-[#3FA9E0]'}`}>{row.sentiment}</td>
                  <td className="py-4 px-4">{row.marketShare}</td>
                  <td className="py-4 px-4">{row.promptScore}</td>
                  <td className="py-4 px-4">{row.responseQuality}</td>
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
