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
  aboutTheRole: z
    .string()
    .describe('A summary of what the job is about and the company.'),
  responsibilities: z
    .string()
    .describe(
      'A bulleted list of the key responsibilities for this position.'
    ),
  preferredRequirements: z
    .string()
    .describe(
      'A bulleted list of the preferred qualifications, skills, and experience for the role.'
    ),
  otherInfo: z
    .string()
    .describe(
      'Any other relevant information, such as salary, benefits, or company culture, formatted as a bulleted list.'
    ),
});
export type SummarizeJobDescriptionOutput = z.infer<
  typeof SummarizeJobDescriptionOutputSchema
>;

export async function summarizeJobDescription(
  input: SummarizeJobDescriptionInput
): Promise<SummarizeJobDescriptionOutput> {
  return summarizeJobDescriptionFlow(input);
}

const summarizeJobDescriptionPrompt = ai.definePrompt({
  name: 'summarizeJobDescriptionPrompt',
  input: {schema: SummarizeJobDescriptionInputSchema},
  output: {schema: SummarizeJobDescriptionOutputSchema},
  prompt: `You are an expert at parsing job descriptions. Analyze the following job description and extract the key information into the specified categories. Format lists with bullet points.

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
