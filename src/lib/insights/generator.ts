// ── Insights Generator ────────────────────────────────────────────────────────
// Pure function — no LLM. Reads real workspace stats, returns templated
// recommendations based on fixed patterns filled with actual numbers.

export interface InsightItem {
  type: 'warning' | 'opportunity' | 'info';
  headline: string;
  body: string;
  platform?: string;
}

export interface InsightStats {
  brandName: string;
  totalRuns: number;
  visibilityPct: number;
  shareOfVoice: number;
  brandPositivePct: number;
  platformBreakdown: Record<string, { runs: number; mentions: number; positiveMentions: number }>;
}

const ALL_PLATFORMS = ['ChatGPT (GPT-4o)', 'Claude 3.5 Sonnet', 'Perplexity Pro', 'Grok 2.0', 'Google AI Overviews'];
const SHORT_NAME: Record<string, string> = {
  'ChatGPT (GPT-4o)': 'ChatGPT',
  'Claude 3.5 Sonnet': 'Claude',
  'Perplexity Pro': 'Perplexity',
  'Grok 2.0': 'Grok',
  'Google AI Overviews': 'Google AIO',
};

export function generateInsights(stats: InsightStats): InsightItem[] {
  const items: InsightItem[] = [];
  const {
    brandName,
    visibilityPct,
    shareOfVoice,
    brandPositivePct,
    totalRuns,
    platformBreakdown,
  } = stats;

  if (totalRuns === 0) {
    return [{
      type: 'info',
      headline: 'Run your first prompts to unlock insights',
      body: 'Once you have mention data, we\'ll surface personalised recommendations based on your real performance numbers.',
    }];
  }

  const platforms = Object.entries(platformBreakdown);

  // 1. Weakest platform by mention rate
  const platformsByMentionRate = platforms
    .filter(([, v]) => v.runs > 0)
    .map(([name, v]) => ({ name, rate: v.mentions / v.runs }))
    .sort((a, b) => a.rate - b.rate);

  if (platformsByMentionRate.length >= 2) {
    const weakest = platformsByMentionRate[0];
    const strongest = platformsByMentionRate[platformsByMentionRate.length - 1];
    const weakestRate = Math.round(weakest.rate * 100);
    const strongestRate = Math.round(strongest.rate * 100);
    items.push({
      type: 'warning',
      headline: `Low visibility on ${SHORT_NAME[weakest.name] ?? weakest.name} (${weakestRate}%)`,
      body: `${brandName} appears in only ${weakestRate}% of ${SHORT_NAME[weakest.name] ?? weakest.name} responses — compared to ${strongestRate}% on ${SHORT_NAME[strongest.name] ?? strongest.name}. Consider adding FAQ-style content and Schema.org markup to target ${SHORT_NAME[weakest.name] ?? weakest.name}'s query patterns.`,
      platform: weakest.name,
    });
  }

  // 2. Best performing platform — double down
  if (platformsByMentionRate.length >= 1) {
    const best = platformsByMentionRate[platformsByMentionRate.length - 1];
    const bestRate = Math.round(best.rate * 100);
    if (bestRate >= 50) {
      items.push({
        type: 'opportunity',
        headline: `${SHORT_NAME[best.name] ?? best.name} is your strongest channel (${bestRate}%)`,
        body: `You appear in ${bestRate}% of ${SHORT_NAME[best.name] ?? best.name} responses — above the 50% benchmark. Reinforce this lead by keeping your structured data and llms.txt up to date.`,
        platform: best.name,
      });
    }
  }

  // 3. Sentiment alert if positive rate is below 50%
  if (brandPositivePct < 50 && platforms.some(([, v]) => v.mentions > 0)) {
    items.push({
      type: 'warning',
      headline: `Sentiment is below average (${brandPositivePct}% positive)`,
      body: `Only ${brandPositivePct}% of brand mentions carry positive sentiment. Review how AI models describe ${brandName} — adding customer proof points and clear differentiators to your site can shift this.`,
    });
  }

  // 4. Share of voice gap
  if (shareOfVoice < 40) {
    const gap = 40 - shareOfVoice;
    const estimatedMentions = Math.round((gap / 100) * totalRuns);
    items.push({
      type: 'warning',
      headline: `Share of voice is ${shareOfVoice}% — ${gap}pp below the target threshold`,
      body: `Closing this gap to 40% could generate ~${estimatedMentions} additional brand mentions. Focus on publishing comparison content and updating your sitemap to improve crawler indexing.`,
    });
  }

  // 5. Missing platforms
  const activePlatforms = Object.keys(platformBreakdown);
  const missingPlatforms = ALL_PLATFORMS
    .filter(p => !activePlatforms.includes(p))
    .map(p => SHORT_NAME[p] ?? p);

  if (missingPlatforms.length > 0) {
    items.push({
      type: 'opportunity',
      headline: `Expand to ${missingPlatforms.slice(0, 2).join(' and ')} for broader reach`,
      body: `You're currently tracked on ${activePlatforms.length}/5 platforms. Adding ${missingPlatforms.join(', ')} to your prompt runs will give you a fuller picture of your AI visibility.`,
    });
  } else if (visibilityPct >= 60) {
    // All platforms active and visibility is strong — positive reinforcement
    items.push({
      type: 'info',
      headline: `Solid all-platform coverage at ${visibilityPct}% visibility`,
      body: `${brandName} is being cited across all 5 tracked AI platforms. Maintain momentum by refreshing your on-site content quarterly to stay ahead of competitor indexing.`,
    });
  }

  return items.slice(0, 5);
}
