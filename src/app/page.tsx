
"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import PatientDataForm from "@/components/patient-data-form";
import ResultsDisplay from "@/components/results-display";
import { processPatientData, ProcessPatientDataResult } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import LanguageSwitcher from "@/components/language-switcher";
import DisclaimerModal from "@/components/disclaimer-modal";

const FormSchema = z.object({
  patientData: z.string().min(10, {
    message: "Patient data must be at least 10 characters.", 
  }),
});
type FormValues = z.infer<typeof FormSchema>;

export type ScoreType = {
  value: string;
  label?: string; // For direct labels
  labelKey?: string; // For translation keys
};

// Define score types here for use in this component and passed to PatientDataForm
const SCORE_TYPES: readonly ScoreType[] = [
  { value: "ALL", labelKey: "scoreTypeAll" },
  { value: "HAS-BLED", labelKey: "scoreTypeHasBled" },
  { value: "WELLS", labelKey: "scoreTypeWells" },
  { value: "SOFA", labelKey: "scoreTypeSofa" },
  { value: "CHA2DS2VASc", labelKey: "scoreTypeCha2ds2vasc" },
  { value: "CURB65", labelKey: "scoreTypeCurb65" },
  { value: "GCS", labelKey: "scoreTypeGcs" },
] as const;


export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ProcessPatientDataResult | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [selectedScoreType, setSelectedScoreType] = useState<string>(SCORE_TYPES[0].value); // Default to "ALL"
  const { toast } = useToast();
  const { language, translations } = useLanguage();

  useEffect(() => {
    setShowDisclaimer(true);
  }, [language]);

  const handleAcknowledgeDisclaimer = () => {
    setShowDisclaimer(false);
  };

  const handleFormSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResults(null); 
    try {
      const response = await processPatientData(data.patientData, language, selectedScoreType);
      setResults(response);
      if (response.error && (!response.toolRecommendations && !response.calculatedScores)) {
        toast({
          variant: "destructive",
          title: translations.processingErrorToastTitle,
          description: response.error,
        });
      } else if (response.error) {
         toast({
          variant: "destructive",
          title: translations.partialErrorToastTitle,
          description: translations.partialErrorToastDescription?.replace('{error}', response.error),
        });
      } else if (!response.toolRecommendations && !response.calculatedScores) {
        toast({
          title: translations.noSpecificResultsToastTitle,
          description: translations.noSpecificResultsToastDescription,
        });
      }
       else {
        toast({
          title: translations.successToastTitle,
          description: translations.successToastDescription,
          className: "bg-accent text-accent-foreground border-accent"
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setResults({ error: errorMessage });
      toast({
        variant: "destructive",
        title: translations.submissionErrorToastTitle,
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DisclaimerModal isOpen={showDisclaimer} onAcknowledge={handleAcknowledgeDisclaimer} />
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex-grow text-center">
              <h1 className="text-3xl font-bold text-foreground font-headline">{translations.dashboardTitle}</h1>
              <p className="text-muted-foreground">
                {translations.dashboardSubtitle}
              </p>
            </div>
            <LanguageSwitcher />
          </div>
        </header>
        
        <main className="max-w-3xl mx-auto">
          <PatientDataForm 
            onSubmit={handleFormSubmit} 
            isLoading={isLoading}
            scoreTypes={SCORE_TYPES}
            selectedScoreType={selectedScoreType}
            onScoreTypeChange={setSelectedScoreType}
          />
          <ResultsDisplay results={results} isLoading={isLoading} />
        </main>
      </div>
    </>
  );
}
