
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

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ProcessPatientDataResult | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true); // Show by default
  const { toast } = useToast();
  const { language, translations } = useLanguage();

  // Effect to show disclaimer when language changes
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
      const response = await processPatientData(data.patientData, language);
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
          <PatientDataForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          <ResultsDisplay results={results} isLoading={isLoading} />
        </main>
      </div>
    </>
  );
}
