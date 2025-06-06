
// RecommendScoringTools story implementation.

'use server';

/**
 * @fileOverview Recommends relevant scoring tools based on patient data.
 *
 * - recommendScoringTools - A function that recommends scoring tools based on patient data.
 * - RecommendScoringToolsInput - The input type for the recommendScoringTools function.
 * - RecommendScoringToolsOutput - The return type for the recommendScoringTools function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendScoringToolsInputSchema = z.object({
  patientData: z
    .string()
    .describe(
      'A string containing patient data, including symptoms, medical history, and lab results.'
    ),
  language: z.string().optional().describe('The ISO 639-1 code for the desired language of the response (e.g., "en", "de", "nl"). Defaults to "en" if not provided.'),
});

export type RecommendScoringToolsInput = z.infer<
  typeof RecommendScoringToolsInputSchema
>;

const RecommendScoringToolsOutputSchema = z.object({
  recommendedTools: z
    .array(z.string())
    .describe('A ranked list of scoring tools relevant to the patient data.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the tool recommendations, explaining why each tool is relevant.'
    ),
});

export type RecommendScoringToolsOutput = z.infer<
  typeof RecommendScoringToolsOutputSchema
>;

export async function recommendScoringTools(
  input: RecommendScoringToolsInput
): Promise<RecommendScoringToolsOutput> {
  return recommendScoringToolsFlow(input);
}

const recommendScoringToolsPrompt = ai.definePrompt({
  name: 'recommendScoringToolsPrompt',
  input: {
    schema: RecommendScoringToolsInputSchema,
  },
  output: {
    schema: RecommendScoringToolsOutputSchema,
  },
  prompt: `You are an AI assistant that specializes in recommending medical scoring tools based on patient data.
  Respond in the language: {{#if language}}{{language}}{{else}}en{{/if}}.

  Given the following patient data, identify and rank the most relevant scoring tools that would be useful for a doctor. Explain your reasoning for each recommendation in the specified language.

  Patient Data: {{{patientData}}}

  Format your response as a JSON object with 'recommendedTools' (a ranked list of scoring tool names) and 'reasoning' (explanation for each tool's relevance) fields.
  `,
});

const recommendScoringToolsFlow = ai.defineFlow(
  {
    name: 'recommendScoringToolsFlow',
    inputSchema: RecommendScoringToolsInputSchema,
    outputSchema: RecommendScoringToolsOutputSchema,
  },
  async input => {
    const {output} = await recommendScoringToolsPrompt(input);
    return output!;
  }
);
