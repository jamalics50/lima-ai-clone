import { createClient } from '@/utils/supabase/server';
import { getAuditHistory } from './actions';
import AuditClient from './AuditClient';
import { ShieldCheck } from 'lucide-react';

export default async function AuditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get workspace + brand website
  const { data: wm } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  let brandWebsite: string | undefined;
  if (wm?.workspace_id) {
    const { data: brand } = await supabase
      .from('brands')
      .select('website_url')
      .eq('workspace_id', wm.workspace_id)
      .limit(1)
      .single();
    brandWebsite = brand?.website_url ?? undefined;
  }

  const history = await getAuditHistory();

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-[#D9714A]/15 border border-[#D9714A]/25 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-6 w-6 text-[#D9714A] stroke-[1.5]" />
        </div>
        <div>
          <h2 className="text-3xl font-serif font-medium tracking-tight text-[#F5F1EA]">
            Site Audit
          </h2>
          <p className="text-[#9C978C] text-sm font-sans mt-1">
            Check your website against 15 AI-readiness criteria — structured data, crawlability, content freshness, and more.
          </p>
        </div>
      </div>

      {/* What we check */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          'Meta description', 'Schema.org / JSON-LD', 'llms.txt',
          'Clear H1', 'FAQ content', 'Non-JS rendering',
          'Pricing in plain text', 'Freshness signals', 'sitemap.xml',
          'Heading hierarchy', 'Alt text on images', 'Load under 3s',
          'Internal linking', 'robots.txt', 'Readable body text',
        ].map(c => (
          <div
            key={c}
            className="text-xs font-sans text-[#9C978C] bg-white/3 border border-white/6 rounded-xl px-3 py-2 flex items-center gap-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#3FA9E0] shrink-0" />
            {c}
          </div>
        ))}
      </div>

      <AuditClient history={history} brandWebsite={brandWebsite} />
    </div>
  );
}
