"use client";

import type { RecommendScoringToolsOutput } from "@/ai/flows/recommend-scoring-tools";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListChecks } from "lucide-react";

type ScoringToolRecommendationsDisplayProps = {
  data?: RecommendScoringToolsOutput;
};

export default function ScoringToolRecommendationsDisplay({ data }: ScoringToolRecommendationsDisplayProps) {
  if (!data || !data.recommendedTools || data.recommendedTools.length === 0) {
    return null; 
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <ListChecks className="h-6 w-6 text-primary" />
          Recommended Scoring Tools
        </CardTitle>
        {data.reasoning && (
          <CardDescription className="pt-1">{data.reasoning}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.recommendedTools.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {data.recommendedTools.map((tool, index) => (
                <li key={index} className="text-sm">
                  <Badge variant="secondary" className="mr-2">{index + 1}</Badge>
                  {tool}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No specific scoring tools recommended based on the provided data.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
