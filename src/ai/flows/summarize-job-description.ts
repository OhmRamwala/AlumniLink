// Summarize the job description from external job board sources.
// This flow takes job description as input and returns a structured summary.

'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description to summarize.'),
});
export type SummarizeJobDescriptionInput = z.infer<
  typeof SummarizeJobDescriptionInputSchema
>;

const SummarizeJobDescriptionOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A short and simple paragraph summarizing the job, including key responsibilities and qualifications.'
    ),
});
export type SummarizeJobDescriptionOutput = z.infer<
  typeof SummarizeJobDescriptionOutputSchema
>;

export async function summarizeJobDescription(
  input: SummarizeJobDescriptionInput
): Promise<SummarizeJobDescriptionOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('MISSING_API_KEY');
  }
  return summarizeJobDescriptionFlow(input);
}

const summarizeJobDescriptionPrompt = ai.definePrompt({
  name: 'summarizeJobDescriptionPrompt',
  input: {schema: SummarizeJobDescriptionInputSchema},
  output: {schema: SummarizeJobDescriptionOutputSchema},
  prompt: `You are an expert at parsing job descriptions. Analyze the following job description and write a short, simple summary paragraph. Focus on the key aspects of the role, including the most important responsibilities and qualifications.

Job Description:
"""
{{{jobDescription}}}
"""`,
});

const summarizeJobDescriptionFlow = ai.defineFlow(
  {
    name: 'summarizeJobDescriptionFlow',
    inputSchema: SummarizeJobDescriptionInputSchema,
    outputSchema: SummarizeJobDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await summarizeJobDescriptionPrompt(input);
    return output!;
  }
);
