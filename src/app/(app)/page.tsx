import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircularGauge } from '@/components/ui/CircularGauge';
import { PercentileBar } from '@/components/ui/PercentileBar';

export default function Dashboard() {
  return (
    <div className="space-y-12 max-w-6xl mx-auto py-4">
      <div>
        <h2 className="text-4xl font-serif font-medium tracking-tight mb-2">Workspace Overview</h2>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Welcome back. Here is a high-level summary of your brand&apos;s performance metrics and competitive standing for this period.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col items-center text-center p-6 justify-center">
           <h3 className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-widest">Brand Sentiment</h3>
           <CircularGauge percentage={84} size={140} strokeWidth={6} />
           <p className="text-sm text-muted-foreground mt-6">
             +4% from last month
           </p>
        </Card>
        <Card className="flex flex-col items-center text-center p-6 justify-center">
           <h3 className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-widest">Market Share</h3>
           <CircularGauge percentage={32} size={140} strokeWidth={6} />
           <p className="text-sm text-muted-foreground mt-6">
             Stable
           </p>
        </Card>
        
        <Card className="col-span-1 md:col-span-2 flex flex-col justify-center">
          <CardHeader>
            <CardTitle className="text-2xl">Competitive Analysis</CardTitle>
            <CardDescription className="text-base">
              How your key metrics stack up against the industry average.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 mt-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Customer Engagement</span>
                <span className="text-sm font-bold text-accent">78</span>
              </div>
              <PercentileBar score={78} average={45} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Prompt Effectiveness</span>
                <span className="text-sm font-bold text-accent">92</span>
              </div>
              <PercentileBar score={92} average={60} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Activity</CardTitle>
            <CardDescription className="text-base">
              Latest audit logs and mention highlights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-muted-foreground">
              <span className="font-serif text-lg italic text-foreground/50">Chart data unavailable</span>
              <p className="text-sm mt-2">Connect more data sources to view trends.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-2xl">Actions</CardTitle>
            <CardDescription className="text-base">
              Recommended next steps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="primary">
              Generate Audit Report
            </Button>
            <Button className="w-full justify-start" variant="secondary">
              Review New Mentions
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Manage Competitors
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
