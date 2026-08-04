// ── Audit Criteria ────────────────────────────────────────────────────────────
// Each criterion receives parsed data and returns { passed, explanation }.

export interface CriterionResult {
  id: string;
  label: string;
  passed: boolean;
  explanation: string;
}

export interface AuditInputs {
  html: string;
  robotsTxt: string;
  sitemapExists: boolean;
  llmsTxtExists: boolean;
  loadMs: number;
}

type CheckFn = (inputs: AuditInputs) => { passed: boolean; explanation: string };

export interface Criterion {
  id: string;
  label: string;
  check: CheckFn;
}

export const CRITERIA: Criterion[] = [
  {
    id: 'meta-description',
    label: 'Has meta description',
    check: ({ html }) => {
      const match = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']{10,})["']/i)
        || html.match(/<meta[^>]+content=["']([^"']{10,})["'][^>]*name=["']description["']/i);
      return match
        ? { passed: true, explanation: 'Meta description found and is at least 10 characters.' }
        : { passed: false, explanation: 'No <meta name="description"> tag found. Add one to help AI summarise your page.' };
    },
  },
  {
    id: 'structured-data',
    label: 'Has Schema.org / JSON-LD structured data',
    check: ({ html }) => {
      const has = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
      return has
        ? { passed: true, explanation: 'JSON-LD structured data block detected.' }
        : { passed: false, explanation: 'No JSON-LD <script type="application/ld+json"> found. Structured data helps AI understand your content.' };
    },
  },
  {
    id: 'llms-txt',
    label: 'Has llms.txt file',
    check: ({ llmsTxtExists }) => llmsTxtExists
      ? { passed: true, explanation: 'llms.txt found at the root — AI crawlers can read your guidance file.' }
      : { passed: false, explanation: 'No /llms.txt found. This emerging standard lets you give AI crawlers explicit instructions.' },
  },
  {
    id: 'clear-h1',
    label: 'Has a clear H1 heading',
    check: ({ html }) => {
      const match = html.match(/<h1[^>]*>([^<]{5,})<\/h1>/i);
      return match
        ? { passed: true, explanation: `H1 found: "${match[1].trim().slice(0, 60)}".` }
        : { passed: false, explanation: 'No H1 tag (with content) detected. A clear H1 helps AI understand the page topic.' };
    },
  },
  {
    id: 'faq-content',
    label: 'Has FAQ-style content',
    check: ({ html }) => {
      const lower = html.toLowerCase();
      const hasFaqSection = lower.includes('faq') || lower.includes('frequently asked') || lower.includes('questions');
      // Q&A pattern: sentences ending with "?" followed by answer text
      const questionMarks = (html.match(/\?/g) || []).length;
      const passed = hasFaqSection || questionMarks >= 3;
      return passed
        ? { passed: true, explanation: 'FAQ-style Q&A content detected — great for conversational AI queries.' }
        : { passed: false, explanation: 'No FAQ section detected. Adding Q&A content can improve AI citation rates.' };
    },
  },
  {
    id: 'not-js-only',
    label: 'Content visible without JavaScript',
    check: ({ html }) => {
      // Strip all tags and check if there's enough raw text
      const stripped = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const wordCount = stripped.split(' ').filter(w => w.length > 3).length;
      const passed = wordCount >= 50;
      return passed
        ? { passed: true, explanation: `${wordCount} words of readable text found in raw HTML — crawlers can index this page.` }
        : { passed: false, explanation: `Only ${wordCount} meaningful words in raw HTML. Content may be JS-only rendered, which AI crawlers can't read.` };
    },
  },
  {
    id: 'pricing-info',
    label: 'Has pricing or product info in plain text',
    check: ({ html }) => {
      const lower = html.toLowerCase();
      const hasPricing = lower.includes('price') || lower.includes('pricing') || lower.includes('plan') || lower.includes('per month') || lower.includes('/mo') || lower.includes('free trial');
      return hasPricing
        ? { passed: true, explanation: 'Pricing or plan information found in plain text.' }
        : { passed: false, explanation: 'No pricing or product info detected in raw HTML. Plain-text pricing helps AI recommendation engines cite you.' };
    },
  },
  {
    id: 'freshness',
    label: 'Has recent content freshness signals',
    check: ({ html }) => {
      const currentYear = new Date().getFullYear();
      const hasCurrentYear = html.includes(String(currentYear));
      const hasPrevYear = html.includes(String(currentYear - 1));
      const passed = hasCurrentYear || hasPrevYear;
      return passed
        ? { passed: true, explanation: `Date references to ${currentYear - 1}–${currentYear} found — content appears fresh.` }
        : { passed: false, explanation: 'No recent year references found. AI models favour up-to-date content.' };
    },
  },
  {
    id: 'sitemap',
    label: 'Has sitemap.xml',
    check: ({ sitemapExists }) => sitemapExists
      ? { passed: true, explanation: 'sitemap.xml accessible at root — AI crawlers can discover all your pages.' }
      : { passed: false, explanation: 'No /sitemap.xml found. A sitemap helps AI crawlers discover your full content.' },
  },
  {
    id: 'heading-hierarchy',
    label: 'Uses semantic heading hierarchy',
    check: ({ html }) => {
      const hasH1 = /<h1[^>]*>/i.test(html);
      const hasH2 = /<h2[^>]*>/i.test(html);
      const passed = hasH1 && hasH2;
      return passed
        ? { passed: true, explanation: 'Both H1 and H2 headings found — good semantic document structure.' }
        : { passed: false, explanation: `Missing ${!hasH1 ? 'H1' : 'H2'} — use a proper heading hierarchy for better AI content parsing.` };
    },
  },
  {
    id: 'alt-text',
    label: 'Images have alt text',
    check: ({ html }) => {
      const images = html.match(/<img[^>]+>/gi) || [];
      if (images.length === 0) return { passed: true, explanation: 'No images found — alt text criterion not applicable.' };
      const withAlt = images.filter(img => /alt=["'][^"']{2,}["']/i.test(img));
      const pct = Math.round((withAlt.length / images.length) * 100);
      const passed = pct >= 80;
      return passed
        ? { passed: true, explanation: `${pct}% of images have descriptive alt text.` }
        : { passed: false, explanation: `Only ${pct}% of ${images.length} images have alt text. Alt text helps AI understand visual content.` };
    },
  },
  {
    id: 'load-time',
    label: 'Page loads under 3 seconds',
    check: ({ loadMs }) => {
      const passed = loadMs < 3000;
      return passed
        ? { passed: true, explanation: `Page fetched in ${loadMs}ms — within the 3 second threshold.` }
        : { passed: false, explanation: `Page took ${loadMs}ms to load. Slow pages are deprioritised by some AI crawlers.` };
    },
  },
  {
    id: 'internal-links',
    label: 'Has clear internal linking',
    check: ({ html }) => {
      const internalLinks = (html.match(/<a[^>]+href=["']\/[^"']*["']/gi) || []).length;
      const passed = internalLinks >= 3;
      return passed
        ? { passed: true, explanation: `${internalLinks} internal links found — helps AI crawlers discover related content.` }
        : { passed: false, explanation: `Only ${internalLinks} internal links found. Add more to help AI crawlers navigate your site.` };
    },
  },
  {
    id: 'robots-txt',
    label: 'robots.txt does not block crawlers',
    check: ({ robotsTxt }) => {
      if (!robotsTxt) return { passed: false, explanation: 'No robots.txt found — add one to explicitly allow AI crawlers.' };
      const hasDisallowAll = /Disallow:\s*\/\s*$/.test(robotsTxt) && /User-agent:\s*\*/i.test(robotsTxt);
      return hasDisallowAll
        ? { passed: false, explanation: 'robots.txt blocks all crawlers with "Disallow: /". AI crawlers will be excluded.' }
        : { passed: true, explanation: 'robots.txt exists and does not block all crawlers.' };
    },
  },
  {
    id: 'readable-text',
    label: 'Has readable (non-image) body text',
    check: ({ html }) => {
      // Remove scripts, styles, and tags to get readable text ratio
      const noScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
      const noTags = noScripts.replace(/<[^>]+>/g, ' ');
      const text = noTags.replace(/\s+/g, ' ').trim();
      const wordCount = text.split(' ').filter(w => w.length > 2).length;
      const passed = wordCount >= 100;
      return passed
        ? { passed: true, explanation: `~${wordCount} readable words detected in body text.` }
        : { passed: false, explanation: `Only ~${wordCount} readable words. AI models need substantial text to cite your content.` };
    },
  },
];
