
"use server";

import { calculateScores, CalculateScoresInput, CalculateScoresOutput } from "@/ai/flows/calculate-scores";
import { recommendScoringTools, RecommendScoringToolsInput, RecommendScoringToolsOutput } from "@/ai/flows/recommend-scoring-tools";
import type { Locale } from "@/contexts/language-context";

export type ProcessPatientDataResult = {
  toolRecommendations?: RecommendScoringToolsOutput;
  calculatedScores?: CalculateScoresOutput;
  error?: string;
};

export async function processPatientData(
  patientData: string,
  language: Locale,
  requestedScoreType?: string 
): Promise<ProcessPatientDataResult> {
  if (!patientData || patientData.trim() === "") {
    return { error: "Patient data cannot be empty." };
  }

  try {
    const recommendInput: RecommendScoringToolsInput = { patientData, language };
    // Pass "ALL" if requestedScoreType is undefined or explicitly "ALL", otherwise pass the specific type.
    // The AI flow handles "ALL" as a special case for its default behavior.
    const calculateInput: CalculateScoresInput = { 
      patientData, 
      language, 
      requestedScoreType: requestedScoreType && requestedScoreType !== "ALL" ? requestedScoreType : undefined 
    };

    // If a specific score type is requested, we might only want to run calculateScores.
    // However, tool recommendations can still be useful. For now, let's run both.
    // This could be optimized later if only one is needed based on `requestedScoreType`.
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
