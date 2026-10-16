import { Router, Request, Response } from 'express';
import OpenAI from 'openai';

const router = Router();

// System prompts for different assistant types
const systemPrompts: Record<string, string> = {
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

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST endpoint to get AI assistant responses
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, assistantType = 'general' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        message: 'The server is not properly configured with an OpenAI API key.'
      });
    }

    // Get the appropriate system prompt
    const systemPrompt = systemPrompts[assistantType] || systemPrompts.general;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: systemPrompt 
        },
        { 
          role: "user", 
          content: message 
        }
      ],
      max_tokens: 500, // Set to the requested range of 400-600
      temperature: 0.7, // Balance creativity and reliability
    });

    // Return the assistant's response
    return res.json({ 
      response: response.choices[0].message.content || "I'm having trouble responding right now. Please try again soon."
    });
  } catch (error: unknown) {
    console.error('Error calling OpenAI API:', error);
    
    // Create a type-safe error object
    const errorResponse: { status?: number; code?: string; message?: string } = {};
    
    // Extract properties safely
    if (error && typeof error === 'object') {
      if ('status' in error) errorResponse.status = Number((error as any).status);
      if ('code' in error) errorResponse.code = String((error as any).code);
      if (error instanceof Error) errorResponse.message = error.message;
    }
    
    // Check if the error is a rate limit or quota exceeded error
    if (errorResponse.code === 'insufficient_quota' || errorResponse.status === 429) {
      return res.status(429).json({ 
        error: 'API quota exceeded',
        message: 'The AI service is currently unavailable due to quota limits. Please try again later.',
        fallbackRequired: true
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to get assistant response',
      message: errorResponse.message || 'Unknown error occurred',
      fallbackRequired: true
    });
  }
});

export default router;