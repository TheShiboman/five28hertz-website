import OpenAI from 'openai';

// Initialize the OpenAI client
// Note that the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// We'll use a server endpoint to proxy OpenAI API calls to protect the API key
// For client-side, we'll still provide mock responses as fallback if the server is unavailable

// This will be used server-side only
let openai: OpenAI | null = null;

// This flag will be used to track if we're running in a server environment
const isServer = typeof window === 'undefined';

// In a production environment, we'll initialize OpenAI on the server side
if (isServer) {
  try {
    if (process.env.OPENAI_API_KEY) {
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else {
      console.warn('OPENAI_API_KEY not found in environment variables.');
    }
  } catch (error) {
    console.error('Error initializing OpenAI:', error);
  }
}

// Define assistant types with their specialized knowledge
export type AssistantType = 
  | 'visionary' 
  | 'investor' 
  | 'community' 
  | 'partner' 
  | 'general';

// System prompts for different assistant types
const systemPrompts: Record<AssistantType, string> = {
  visionary: `You are an Innovation Advisor for five28hertz, helping visionary innovators develop and refine their ideas. 
  Your expertise is in sustainable innovation, conscious business models, and transformative technology.
  Keep responses concise (3-4 sentences max), inspiring, and actionable.
  Focus on helping users develop ideas that align with five28hertz's vision of harmony, joy and balance.
  Avoid discussing confidential information or making financial promises.`,
  
  investor: `You are an Investment Guide for five28hertz, helping conscious investors understand impact investment opportunities.
  Your expertise is in ESG criteria, sustainable finance, and purpose-driven investment models.
  Keep responses concise (3-4 sentences max), informative, and balanced.
  Focus on the philosophical and strategic aspects of conscious investing, not specific financial advice.
  Never provide specific investment recommendations or returns projections.`,
  
  community: `You are a Community Guide for five28hertz, helping community members connect with our ecosystem.
  Your expertise is in community building, sustainable living practices, and mindful consumption.
  Keep responses concise (3-4 sentences max), warm, and inclusive.
  Focus on how individuals can participate in and benefit from the five28hertz community.
  Encourage values of balance, harmony, and collaborative growth.`,
  
  partner: `You are a Partnership Advisor for five28hertz, helping potential strategic partners explore collaboration opportunities.
  Your expertise is in strategic alliances, co-creation models, and synergistic business development.
  Keep responses concise (3-4 sentences max), professional, and solution-oriented.
  Focus on how organizations can align with five28hertz's ecosystem to amplify mutual impact.
  Emphasize values of integrity, shared purpose, and innovative collaboration.`,
  
  general: `You are a friendly guide to five28hertz, a purpose-driven ecosystem of platforms and projects.
  Your expertise spans our various initiatives focused on creating harmony, joy, and balance in the world.
  Keep responses concise (3-4 sentences max), helpful, and aligned with our values.
  Focus on providing accurate information about five28hertz's mission, projects, and approach.
  Direct users to the appropriate sections of our ecosystem based on their interests.`
};

// Mock response templates based on assistant type and user message keywords
const mockResponses: Record<AssistantType, Record<string, string>> = {
  visionary: {
    default: "I'd be happy to help you develop your innovative idea. Consider focusing on sustainability, social impact, and technological innovation that aligns with the five28hertz vision of harmony and balance.",
    idea: "That's an interesting concept! To refine your idea further, consider how it creates harmony and balance in people's lives. The most successful five28hertz innovations address holistic wellbeing while leveraging sustainable technologies.",
    business: "A conscious business model should balance profit with purpose. Consider integrating circular economy principles, transparent value chains, and impact measurement into your business structure from the start.",
    technology: "When integrating technology, focus on creating solutions that enhance human connection rather than replace it. five28hertz values technologies that are accessible, ethical, and elevate collective consciousness.",
    sustainable: "Sustainability is central to the five28hertz ethos. Consider not just environmental impact, but social sustainability and long-term economic viability to create truly regenerative solutions.",
    how: "To submit your project idea, you can provide details through our proposal form. We'll evaluate how it aligns with our focus areas of conscious innovation, community wellbeing, and sustainable development."
  },
  investor: {
    default: "As a conscious investor with five28hertz, you'll find opportunities that balance financial returns with positive social and environmental impact. Our investment approach prioritizes sustainable growth and transformative solutions.",
    impact: "Impact investing with five28hertz means supporting ventures that measurably improve social and environmental wellbeing. We focus on ESG integration, stakeholder engagement, and tangible outcomes that contribute to a more harmonious world.",
    return: "While we can't discuss specific return projections, our investment philosophy balances financial sustainability with meaningful impact. We seek ventures with sound economics that can scale their positive influence over time.",
    portfolio: "Our investment portfolio spans several impact areas including conscious wellness tech, sustainable living solutions, and community-building platforms. Each venture demonstrates alignment with the five28hertz values and vision.",
    criteria: "We evaluate investments based on purpose alignment, founder integrity, scalable impact potential, and sound economic fundamentals. The strongest candidates typically address systemic challenges in innovative, holistic ways.",
    how: "To explore investment opportunities, you can schedule a consultation through our 'Express Interest' button. This begins a conversation about your impact goals and how they might align with our ecosystem."
  },
  community: {
    default: "Welcome to the five28hertz community! As a community member, you'll have access to events, content, and connections that support personal growth, conscious living, and collective positive impact.",
    events: "Our community events include virtual gatherings, local meetups, and annual summits that bring together like-minded individuals. These provide opportunities for learning, connection, and collaborative action.",
    benefits: "Community membership includes access to exclusive content, early platform features, special event invitations, and connection with other change-makers who share your values and vision for a more harmonious world.",
    connect: "You can connect with fellow community members through our online forums, themed interest groups, and facilitated networking events. Many members have formed lasting collaborations and friendships through these channels.",
    content: "Our community content includes thought leadership articles, practice guides, case studies, and transformative stories that inspire and inform. Members also gain access to specialized learning modules and expert interviews.",
    join: "To join our community, simply click the 'Join Community' button and complete the brief membership form. We welcome all who resonate with our mission of creating harmony, joy, and balance in the world."
  },
  partner: {
    default: "Strategic partnerships with five28hertz allow organizations to amplify their impact through collaborative initiatives. We focus on creating synergistic relationships that advance our shared vision of a more harmonious world.",
    collaboration: "Collaborative opportunities include co-created projects, shared resources, joint research, and amplified outreach. We design partnerships that leverage the unique strengths of each organization while advancing our collective goals.",
    benefits: "Partnership benefits include expanded reach, shared expertise, resource optimization, and enhanced credibility. Our partners consistently report accelerated impact and enriched organizational culture through our collaborative approach.",
    models: "Our partnership models range from project-specific collaborations to long-term strategic alliances. Each is customized to maximize mutual value and impact, with clear objectives, roles, and evaluation frameworks.",
    alignment: "We seek partners who demonstrate alignment with our core values of integrity, conscious innovation, and holistic wellbeing. Compatible organizational cultures and complementary capabilities create the strongest foundations for partnership.",
    process: "The partnership exploration process begins with an initial conversation about shared vision and potential synergies. If there's mutual interest, we develop a tailored collaboration framework that serves both organizations' goals."
  },
  general: {
    default: "five28hertz is a purpose-driven ecosystem of platforms and projects designed to create harmony, joy, and balance in the world. How can I help you learn more about our mission, projects, or how to get involved?",
    about: "five28hertz was founded on the principle that business can be a force for positive transformation. Our name references the love frequency (528 Hz), which symbolizes healing, harmony, and transformation - qualities we aim to embody in all our work.",
    projects: "Our project ecosystem includes Argento Homes (conscious hospitality), ExchangeSphere (resource sharing platform), and the 528Hz Blog & Podcast. Each initiative demonstrates our values through different expressions and impact areas.",
    vision: "Our vision is a world where economic activities enhance rather than diminish collective wellbeing. We're creating the platforms, products, and practices that make this vision tangible and accessible to all.",
    involved: "You can get involved as a visionary innovator, conscious investor, strategic partner, or community member. Each pathway offers unique opportunities to contribute to and benefit from our ecosystem.",
    contact: "For specific inquiries, you can reach our team through the Contact Us button. We're always open to conversations about potential collaborations, questions about our approach, or ways to engage with our ecosystem."
  }
};

// Function to get a response from the assistant
export async function getAssistantResponse(
  message: string, 
  assistantType: AssistantType = 'general'
): Promise<string> {
  try {
    // First, try to use the server API endpoint
    const response = await fetch('/api/ai-assistant/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        assistantType
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.response;
    } else {
      const errorData = await response.json();
      console.error('Server API error:', errorData);
      
      // Check if it's a quota exceeded error
      if (response.status === 429) {
        throw new Error("Our AI service is temporarily unavailable due to high demand. Please try again later. In the meantime, I'll do my best to answer your questions.");
      }
      
      // Fall back to mock responses for other errors
      throw new Error(errorData.message || "I'm having trouble connecting to my knowledge base. Let me try a simpler approach.");
    }
  } catch (error) {
    console.error('Error calling server API:', error);
    // Fall back to mock responses
  }
  
  // If server API fails, use mock responses as fallback
  // This ensures users always get some response even with API issues
  const messageLower = message.toLowerCase();
  const assistantResponses = mockResponses[assistantType];
  
  // Find a relevant response based on message keywords
  for (const [keyword, response] of Object.entries(assistantResponses)) {
    if (keyword !== 'default' && messageLower.includes(keyword)) {
      // Add a slight delay to simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      return response;
    }
  }
  
  // Return default response if no keywords match
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  return assistantResponses.default;
}