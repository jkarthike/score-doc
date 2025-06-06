
"use server";

import { calculateScores, CalculateScoresInput, CalculateScoresOutput } from "@/ai/flows/calculate-scores";
import { recommendScoringTools, RecommendScoringToolsInput, RecommendScoringToolsOutput } from "@/ai/flows/recommend-scoring-tools";
import type { Locale } from "@/contexts/language-context";

export type ProcessPatientDataResult = {
  toolRecommendations?: RecommendScoringToolsOutput;
  calculatedScores?: CalculateScoresOutput;
  error?: string;
};

export async function processPatientData(patientData: string, language: Locale): Promise<ProcessPatientDataResult> {
  if (!patientData || patientData.trim() === "") {
    return { error: "Patient data cannot be empty." }; // This could also be translated server-side if needed
  }

  try {
    const recommendInput: RecommendScoringToolsInput = { patientData, language };
    const calculateInput: CalculateScoresInput = { patientData, language };

    const [toolRecommendationsResult, calculatedScoresResult] = await Promise.allSettled([
      recommendScoringTools(recommendInput),
      calculateScores(calculateInput)
    ]);

    const toolRecommendations = toolRecommendationsResult.status === 'fulfilled' ? toolRecommendationsResult.value : undefined;
    const calculatedScores = calculatedScoresResult.status === 'fulfilled' ? calculatedScoresResult.value : undefined;
    
    let errorMessages: string[] = [];
    if (toolRecommendationsResult.status === 'rejected') {
      console.error("Error recommending scoring tools:", toolRecommendationsResult.reason);
      errorMessages.push(`Failed to get tool recommendations: ${toolRecommendationsResult.reason instanceof Error ? toolRecommendationsResult.reason.message : String(toolRecommendationsResult.reason)}`);
    }
    if (calculatedScoresResult.status === 'rejected') {
      console.error("Error calculating scores:", calculatedScoresResult.reason);
      errorMessages.push(`Failed to calculate scores: ${calculatedScoresResult.reason instanceof Error ? calculatedScoresResult.reason.message : String(calculatedScoresResult.reason)}`);
    }
    
    if (errorMessages.length > 0 && !toolRecommendations && !calculatedScores) {
       return { error: errorMessages.join('; ') };
    }
    
    return {
      toolRecommendations,
      calculatedScores,
      error: errorMessages.length > 0 ? errorMessages.join('; ') : undefined,
    };

  } catch (e) {
    console.error("Unexpected error processing patient data:", e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
    return { error: errorMessage };
  }
}
