export interface Entity {
  id: string;
  name: string;
  url: string;
}

export interface MockRunContext {
  prompt: string;
  brand: Entity;
  competitors: Entity[];
}

export interface MentionResult {
  brandId?: string;
  competitorId?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface CitationResult {
  url: string;
  title: string;
}

export interface MockResult {
  text: string;
  citations: CitationResult[];
  mentions: MentionResult[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const sentiments = ['positive', 'neutral', 'negative'] as const;

function generateRandomMentions(context: MockRunContext): MentionResult[] {
  const mentions: MentionResult[] = [];
  
  // 70% chance to mention the brand
  if (Math.random() > 0.3) {
    mentions.push({
      brandId: context.brand.id,
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    });
  }

  // Mention 1-3 random competitors
  const numCompetitorsToMention = Math.floor(Math.random() * 3) + 1;
  const shuffledCompetitors = [...context.competitors].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < Math.min(numCompetitorsToMention, shuffledCompetitors.length); i++) {
    mentions.push({
      competitorId: shuffledCompetitors[i].id,
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    });
  }

  return mentions;
}

function generateRandomCitations(context: MockRunContext): CitationResult[] {
  const sources = [
    { url: 'https://reddit.com/r/software', title: 'Discussion on best tools' },
    { url: 'https://g2.com/reviews', title: 'Top 10 solutions in 2024' },
    { url: 'https://techcrunch.com', title: 'Industry analysis and trends' },
    { url: 'https://trustradius.com', title: 'User reviews and comparisons' },
    { url: 'https://ycombinator.com', title: 'Startup toolkit recommendations' }
  ];
  
  // Pick 2-4 citations
  const numCitations = Math.floor(Math.random() * 3) + 2;
  const shuffledSources = [...sources].sort(() => 0.5 - Math.random());
  
  return shuffledSources.slice(0, numCitations);
}

function getBaseResponse(platform: string, context: MockRunContext, mentions: MentionResult[]) {
  const brandMentioned = mentions.find(m => m.brandId);
  let text = `Here is a comprehensive analysis based on ${platform}'s latest data sources.\n\n`;
  
  if (brandMentioned) {
    text += `${context.brand.name} is frequently mentioned in this category. Users generally express a ${brandMentioned.sentiment} sentiment. `;
    if (brandMentioned.sentiment === 'positive') {
      text += 'It is praised for its ease of use and modern interface. ';
    } else if (brandMentioned.sentiment === 'negative') {
      text += 'However, some users complain about pricing and missing advanced features. ';
    }
  } else {
    text += `Interestingly, ${context.brand.name} does not appear prominently in recent discussions regarding this topic. `;
  }

  text += `\n\nIn comparison, several other alternatives are popular:\n`;
  
  context.competitors.forEach(comp => {
    const compMention = mentions.find(m => m.competitorId === comp.id);
    if (compMention) {
      text += `- **${comp.name}**: Seen in a ${compMention.sentiment} light by the community.\n`;
    }
  });

  return text;
}

export async function mockRunOnOpenAI(context: MockRunContext): Promise<MockResult> {
  await sleep(1500 + Math.random() * 1000);
  const mentions = generateRandomMentions(context);
  return {
    text: getBaseResponse('ChatGPT (GPT-4o)', context, mentions),
    citations: generateRandomCitations(context),
    mentions
  };
}

export async function mockRunOnClaude(context: MockRunContext): Promise<MockResult> {
  await sleep(2000 + Math.random() * 800);
  const mentions = generateRandomMentions(context);
  return {
    text: getBaseResponse('Claude 3.5 Sonnet', context, mentions),
    citations: generateRandomCitations(context),
    mentions
  };
}

export async function mockRunOnPerplexity(context: MockRunContext): Promise<MockResult> {
  await sleep(1000 + Math.random() * 1500);
  const mentions = generateRandomMentions(context);
  return {
    text: getBaseResponse('Perplexity Pro', context, mentions),
    citations: generateRandomCitations(context),
    mentions
  };
}

export async function mockRunOnGrok(context: MockRunContext): Promise<MockResult> {
  await sleep(1200 + Math.random() * 500);
  const mentions = generateRandomMentions(context);
  return {
    text: getBaseResponse('Grok 2.0', context, mentions),
    citations: generateRandomCitations(context),
    mentions
  };
}

export async function mockRunOnGoogleAIO(context: MockRunContext): Promise<MockResult> {
  await sleep(1800 + Math.random() * 1200);
  const mentions = generateRandomMentions(context);
  return {
    text: getBaseResponse('Google AI Overviews', context, mentions),
    citations: generateRandomCitations(context),
    mentions
  };
}
