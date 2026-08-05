import { Card } from '@/components/ui/Card';
import { Database, Info } from 'lucide-react';
import { SeedButton } from './SeedButton';

export default function SeedPage() {
  return (
    <div className="max-w-lg mx-auto py-8 space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-medium text-[#F5F1EA]">Seed Dashboard Data</h2>
        <p className="text-sm font-sans text-[#D8D4CA] mt-1">
          Populate 30 days of backdated mock data so the dashboard looks like a real, active workspace.
        </p>
      </div>

      <Card className="p-6 space-y-5">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-[#3FA9E0]/15 text-[#3FA9E0] flex items-center justify-center border border-[#3FA9E0]/25 shrink-0 mt-0.5">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif font-medium text-[#F5F1EA] mb-2">What this generates</h3>
            <ul className="space-y-1.5 text-sm font-sans text-[#D8D4CA]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3FA9E0] shrink-0" />
                30 days × (your prompts) × 5 AI platforms = hundreds of platform_runs
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3FA9E0] shrink-0" />
                Realistic mentions with positive / neutral / negative sentiment
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3FA9E0] shrink-0" />
                2–4 citation URLs per run
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3FA9E0] shrink-0" />
                Same data shape as the real pipeline — stored in the exact same tables
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-white/[0.03] border border-white/8 rounded-xl p-3 text-xs font-sans text-[#D8D4CA]">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#3FA9E0]" />
          Requires completed onboarding (brand + at least one prompt). Takes ~10–20 seconds.
          Safe to run multiple times.
        </div>

        <div className="border-t border-white/8 pt-4">
          <SeedButton />
        </div>
      </Card>
    </div>
  );
}
