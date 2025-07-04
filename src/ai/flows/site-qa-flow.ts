'use server';
/**
 * @fileOverview A chatbot flow that answers questions about the AlumniLink platform.
 *
 * - askChatbot - A function that handles user queries.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  getRecentNews,
  getRecentEvents,
  getRecentJobs,
  searchAlumni,
} from '@/services/firestore-service';

// Define tools for the LLM
const getRecentNewsTool = ai.defineTool(
  {
    name: 'getRecentNews',
    description: 'Retrieves the most recent news articles from the platform.',
    outputSchema: z.any(),
  },
  async () => getRecentNews()
);

const getRecentEventsTool = ai.defineTool(
  {
    name: 'getRecentEvents',
    description: 'Retrieves the most recent upcoming events from the platform.',
    outputSchema: z.any(),
  },
  async () => getRecentEvents()
);

const getRecentJobsTool = ai.defineTool(
  {
    name: 'getRecentJobs',
    description: 'Retrieves the most recent job postings from the platform.',
    outputSchema: z.any(),
  },
  async () => getRecentJobs()
);

const searchAlumniTool = ai.defineTool(
  {
    name: 'searchAlumni',
    description: 'Searches the alumni directory by name, company, or position.',
    inputSchema: z.object({
      searchTerm: z.string().describe('The name, company, or position to search for.'),
    }),
    outputSchema: z.any(),
  },
  async ({ searchTerm }) => searchAlumni(searchTerm)
);

const siteQaFlow = ai.defineFlow(
  {
    name: 'siteQaFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (query) => {
    const llmResponse = await ai.generate({
      prompt: query,
      system: `You are a friendly and helpful assistant for the AlumniLink platform.
Your purpose is to answer user questions about news, events, jobs, and alumni within the community.
You MUST use the provided tools to get information. Do not answer from your general knowledge.
If a user asks a question that cannot be answered with the available tools, or if the tools return no information, politely state that you cannot answer and explain that you can only provide information about the AlumniLink platform.
Keep your answers concise and helpful. Format lists clearly when appropriate.`,
      tools: [
        getRecentNewsTool,
        getRecentEventsTool,
        getRecentJobsTool,
        searchAlumniTool,
      ],
    });
    return llmResponse.text ?? "I'm sorry, I couldn't generate a response. Please try again.";
  }
);

export async function askChatbot(query: string): Promise<string> {
    if (!process.env.GOOGLE_API_KEY) {
        return 'The AI service is not configured. The GOOGLE_API_KEY is missing.';
    }
    return await siteQaFlow(query);
}
