import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircularGauge } from '@/components/ui/CircularGauge';
import { PercentileBar } from '@/components/ui/PercentileBar';
import { BarChart2 } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-10 max-w-6xl mx-auto py-2">
      <div>
        <h2 className="text-4xl font-serif font-medium tracking-tight text-[#F5F1EA] mb-2">Workspace Overview</h2>
        <p className="text-[#9C978C] text-base font-sans leading-relaxed max-w-2xl">
          Welcome back. Here is a high-level summary of your brand&apos;s performance metrics and competitive standing for this period.
        </p>
      </div>

      {/* Metric Gauges Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Primary Metric Gauge - Coral */}
        <Card className="flex flex-col items-center text-center p-5 justify-center">
           <h3 className="text-xs font-sans font-medium text-[#9C978C] mb-6 uppercase tracking-widest">Brand Sentiment</h3>
           <CircularGauge percentage={84} variant="coral" size={140} strokeWidth={7} />
           <p className="text-xs font-sans text-[#9C978C] mt-6">
             +4% from last month
           </p>
        </Card>

        {/* Secondary Metric Gauge - Sky Blue */}
        <Card className="flex flex-col items-center text-center p-5 justify-center">
           <h3 className="text-xs font-sans font-medium text-[#9C978C] mb-6 uppercase tracking-widest">Market Share</h3>
           <CircularGauge percentage={32} variant="sky-blue" size={140} strokeWidth={7} />
           <p className="text-xs font-sans text-[#9C978C] mt-6">
             Stable
           </p>
        </Card>
        
        {/* Comparison Bars Card */}
        <Card className="col-span-1 md:col-span-2 flex flex-col justify-center">
          <CardHeader>
            <CardTitle className="text-xl">Competitive Analysis</CardTitle>
            <CardDescription className="text-sm">
              How your key metrics stack up against the industry average.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 mt-2">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-sans font-medium text-[#F5F1EA]">Customer Engagement</span>
                <span className="text-sm font-sans font-bold text-[#D9714A]">78</span>
              </div>
              <PercentileBar score={78} average={45} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-sans font-medium text-[#F5F1EA]">Prompt Effectiveness</span>
                <span className="text-sm font-sans font-bold text-[#D9714A]">92</span>
              </div>
              <PercentileBar score={92} average={60} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content & Actions Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Empty State Card */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription className="text-sm">
              Latest audit logs and mention highlights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Empty state container with Sky Blue border */}
            <div className="h-[280px] flex flex-col items-center justify-center rounded-2xl border border-[#3FA9E0]/40 bg-[#3FA9E0]/5 p-8 text-center">
              <BarChart2 className="h-10 w-10 text-[#3FA9E0] mb-3 stroke-[1.5]" />
              <h4 className="font-serif text-lg font-medium text-[#F5F1EA] mb-1">No trend data yet</h4>
              <p className="text-sm font-sans text-[#9C978C] max-w-sm">
                Connect more data sources to view trends over time.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions Panel with 3 Tiers */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Actions</CardTitle>
            <CardDescription className="text-sm">
              Recommended next steps.
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
