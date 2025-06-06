"use client";

import type { ProcessPatientDataResult } from "@/app/actions";
import ScoringToolRecommendationsDisplay from "./scoring-tool-recommendations-display";
import CalculatedScoresDisplay from "./calculated-scores-display";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

type ResultsDisplayProps = {
  results: ProcessPatientDataResult | null;
  isLoading: boolean; // To show placeholder or specific loading UI if needed
};

export default function ResultsDisplay({ results, isLoading }: ResultsDisplayProps) {
  if (isLoading) {
     // Optionally, show skeletons or a general loading message for the results area
    return (
      <div className="space-y-6 mt-8">
        <div className="animate-pulse bg-muted h-40 rounded-lg"></div>
        <div className="animate-pulse bg-muted h-40 rounded-lg"></div>
      </div>
    );
  }
  
  if (!results) {
    return null;
  }

  const hasToolRecommendations = results.toolRecommendations && results.toolRecommendations.recommendedTools.length > 0;
  const hasCalculatedScores = results.calculatedScores && (
    results.calculatedScores.hasBledScore !== undefined ||
    results.calculatedScores.wellsScore !== undefined ||
    results.calculatedScores.sofaScore !== undefined ||
    (results.calculatedScores.recommendations && results.calculatedScores.recommendations.trim() !== "")
  );
  const hasAnyData = hasToolRecommendations || hasCalculatedScores;

  return (
    <div className="space-y-6 mt-8">
      {results.error && !hasAnyData && ( // Show general error if no data at all
        <Alert variant="destructive" className="shadow-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{results.error}</AlertDescription>
        </Alert>
      )}
      
      {/* Partial error display for calculated scores if recommendations are present */}
      {results.error && results.calculatedScores === undefined && results.toolRecommendations && (
         <Alert variant="destructive" className="shadow-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Score Calculation Error</AlertTitle>
          <AlertDescription>Could not fetch calculated scores. {results.error.split(';').find(e => e.includes("calculate scores"))}</AlertDescription>
        </Alert>
      )}
      <CalculatedScoresDisplay data={results.calculatedScores} />

      {/* Partial error display for tool recommendations if scores are present */}
      {results.error && results.toolRecommendations === undefined && results.calculatedScores && (
         <Alert variant="destructive" className="shadow-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Tool Recommendation Error</AlertTitle>
          <AlertDescription>Could not fetch tool recommendations. {results.error.split(';').find(e => e.includes("tool recommendations"))}</AlertDescription>
        </Alert>
      )}
      <ScoringToolRecommendationsDisplay data={results.toolRecommendations} />

      {!isLoading && !hasAnyData && !results.error && (
        <Alert className="shadow-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Results</AlertTitle>
          <AlertDescription>
            No recommendations or scores could be generated from the provided data. Please ensure the patient data is detailed enough.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
