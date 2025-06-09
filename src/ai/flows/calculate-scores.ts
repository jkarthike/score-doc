
// src/ai/flows/calculate-scores.ts
'use server';

/**
 * @fileOverview Calculates scores for common scoring systems based on patient data.
 *
 * - calculateScores - A function that calculates the scores.
 * - CalculateScoresInput - The input type for the calculateScores function.
 * - CalculateScoresOutput - The return type for the calculateScores function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const CalculateScoresInputSchema = z.object({
  patientData: z.string().describe('A string containing the patient data.'),
  language: z.string().optional().describe('The ISO 639-1 code for the desired language of the response (e.g., "en", "de", "nl"). Defaults to "en" if not provided.'),
});
export type CalculateScoresInput = z.infer<typeof CalculateScoresInputSchema>;

const CalculateScoresOutputSchema = z.object({
  hasBledScore: z.number().optional().describe('The HAS-BLED score, if applicable.'),
  wellsScore: z.number().optional().describe('The WELLS score for DVT/PE, if applicable.'),
  sofaScore: z.number().optional().describe('The SOFA score, if applicable.'),
  cha2ds2vascScore: z.number().optional().describe('The CHA₂DS₂-VASc score, if applicable.'),
  curb65Score: z.number().optional().describe('The CURB-65 score, if applicable.'),
  gcsScore: z.number().optional().describe('The Glasgow Coma Scale (GCS) score, if applicable.'),
  recommendations: z.string().describe('Any recommendations based on the calculated scores.'),
});

export type CalculateScoresOutput = z.infer<typeof CalculateScoresOutputSchema>;

export async function calculateScores(input: CalculateScoresInput): Promise<CalculateScoresOutput> {
  return calculateScoresFlow(input);
}

const calculateScoresPrompt = ai.definePrompt({
  name: 'calculateScoresPrompt',
  input: {schema: CalculateScoresInputSchema},
  output: {schema: CalculateScoresOutputSchema},
  prompt: `You are an AI assistant specialized in calculating medical scores.
  Respond in the language: {{#if language}}{{language}}{{else}}en{{/if}}.
  Based on the following patient data, calculate the HAS-BLED, WELLS, SOFA, CHA₂DS₂-VASc, CURB-65, and Glasgow Coma Scale (GCS) scores if applicable.
  If a score cannot be calculated due to insufficient information, omit that score from the output.

  Patient Data: {{{patientData}}}

  Return the scores in JSON format. Also, provide recommendations based on the calculated scores in the specified language.
  `,
});

const calculateScoresFlow = ai.defineFlow(
  {
    name: 'calculateScoresFlow',
    inputSchema: CalculateScoresInputSchema,
    outputSchema: CalculateScoresOutputSchema,
  },
  async input => {
    const {output} = await calculateScoresPrompt(input);
    return output!;
  }
);

