
"use client";

import type { CalculateScoresOutput } from "@/ai/flows/calculate-scores";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, CheckCircle, AlertTriangle } from "lucide-react";

type CalculatedScoresDisplayProps = {
  data?: CalculateScoresOutput;
};

const ScoreItem: React.FC<{ label: string; value?: number }> = ({ label, value }) => {
  if (value === undefined || value === null) {
    return null;
  }
  return (
    <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
      <span className="text-sm font-medium text-secondary-foreground">{label}:</span>
      <span className="text-lg font-bold text-primary">{value}</span>
    </div>
  );
};

export default function CalculatedScoresDisplay({ data }: CalculatedScoresDisplayProps) {
  if (!data) {
    return null;
  }

  const hasScores =
    data.hasBledScore !== undefined ||
    data.wellsScore !== undefined ||
    data.sofaScore !== undefined ||
    data.cha2ds2vascScore !== undefined ||
    data.curb65Score !== undefined ||
    data.gcsScore !== undefined;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Calculator className="h-6 w-6 text-primary" />
          Calculated Scores
        </CardTitle>
        {data.recommendations && (
           <CardDescription className="pt-1 flex items-start gap-2 text-accent-foreground">
            <CheckCircle className="h-5 w-5 text-accent mt-1 shrink-0" />
            <span>{data.recommendations}</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {hasScores ? (
          <div className="space-y-3">
            <ScoreItem label="HAS-BLED Score" value={data.hasBledScore} />
            <ScoreItem label="WELLS Score (DVT/PE)" value={data.wellsScore} />
            <ScoreItem label="SOFA Score" value={data.sofaScore} />
            <ScoreItem label="CHA₂DS₂-VASc Score" value={data.cha2ds2vascScore} />
            <ScoreItem label="CURB-65 Score" value={data.curb65Score} />
            <ScoreItem label="Glasgow Coma Scale (GCS)" value={data.gcsScore} />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground p-3 border border-dashed rounded-md">
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm">No scores could be calculated from the provided data, or they were not applicable.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
