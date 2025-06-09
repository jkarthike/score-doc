
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
  requestedScoreType: z.string().optional().describe('A specific score type to calculate (e.g., "HAS-BLED", "WELLS", "SOFA", "CHA2DS2VASc", "CURB65", "GCS"). If not provided, attempt all applicable scores.'),
});
export type CalculateScoresInput = z.infer<typeof CalculateScoresInputSchema>;

const CalculateScoresOutputSchema = z.object({
  hasBledScore: z.number().optional().describe('The HAS-BLED score, if applicable.'),
  wellsScore: z.number().optional().describe('The WELLS score for DVT/PE, if applicable.'),
  sofaScore: z.number().optional().describe('The SOFA score, if applicable.'),
  cha2ds2vascScore: z.number().optional().describe('The CHA₂DS₂-VASc score, if applicable.'),
  curb65Score: z.number().optional().describe('The CURB-65 score, if applicable.'),
  gcsScore: z.number().optional().describe('The Glasgow Coma Scale (GCS) score, if applicable.'),
  recommendations: z.string().describe('Recommendations or explanations based on the calculated scores or lack thereof. This field is always required.'),
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

Your primary goal is to provide scores based on the patient data and a 'recommendations' string.
The 'recommendations' field in your JSON output is mandatory. It should explain your findings, which scores were calculated, or why scores could not be calculated.

{{#if requestedScoreType}}
Based on the following patient data, your main task is to calculate the {{requestedScoreType}} score.
- If the {{requestedScoreType}} can be calculated, include its value in the JSON output.
- If it cannot be calculated due to insufficient data, omit the field for {{requestedScoreType}} from the JSON.
- Your 'recommendations' must address the {{requestedScoreType}}, stating its value if calculated, or explaining why it wasn't.
- You MAY also calculate other scores from the list (HAS-BLED, WELLS, SOFA, CHA₂DS₂-VASc, CURB-65, GCS) if they are clearly determinable and relevant, but {{requestedScoreType}} is the priority.
{{else}}
Based on the following patient data, calculate all applicable scores from the list: HAS-BLED, WELLS, SOFA, CHA₂DS₂-VASc, CURB-65, and Glasgow Coma Scale (GCS).
- For any score that cannot be calculated due to insufficient information, omit that score field from the JSON output.
- Your 'recommendations' field should summarize findings based on all calculated scores or explain why some/all scores could not be calculated.
{{/if}}

Patient Data: {{{patientData}}}

Return the entire response in JSON format matching the defined output schema. Ensure the 'recommendations' field is always present and is a string.
Example (if HAS-BLED requested and calculable, and WELLS also found):
{
  "hasBledScore": 3,
  "wellsScore": 1,
  "recommendations": "Patient has a HAS-BLED score of 3 (priority). WELLS score is 1. ..."
}
Example (if HAS-BLED requested but not calculable):
{
  "recommendations": "The HAS-BLED score could not be calculated due to missing X. No other scores were explicitly sought or found."
}
Example (if no specific score requested, and some are found):
{
  "sofaScore": 5,
  "gcsScore": 12,
  "recommendations": "SOFA score is 5, GCS is 12. Other scores like HAS-BLED were not determinable."
}`,
});

const calculateScoresFlow = ai.defineFlow(
  {
    name: 'calculateScoresFlow',
    inputSchema: CalculateScoresInputSchema,
    outputSchema: CalculateScoresOutputSchema,
  },
  async input => {
    const {output} = await calculateScoresPrompt(input);
    if (!output) {
      // This case should ideally be caught by Genkit's Zod schema validation if the output is malformed.
      // However, if it somehow results in null/undefined before that:
      console.error("AI failed to produce a valid output for calculateScoresPrompt with input:", input);
      throw new Error('AI failed to produce a valid output structure that meets the schema requirements.');
    }
    return output;
  }
);

