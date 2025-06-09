
"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useMemo } from 'react';

export type Locale = 'de' | 'en' | 'nl';

export type Translations = Record<string, string>;

interface LanguageContextType {
  language: Locale;
  setLanguage: Dispatch<SetStateAction<Locale>>;
  translations: Translations;
}

const defaultLocale: Locale = 'de';

export const AllTranslations: Record<Locale, Translations> = {
  de: {
    dashboardTitle: 'ScoreDoc',
    dashboardSubtitle: 'Geben Sie Patientendaten ein, um KI-gestützte Empfehlungen und berechnete Scores für Systeme wie HAS-BLED, WELLS, SOFA, CHA₂DS₂-VASc, CURB-65 und GCS zu erhalten.',
    patientDataInputTitle: 'Patientendateneingabe',
    patientDataLabel: 'Geben Sie Patienteninformationen ein (Symptome, Krankengeschichte, Laborergebnisse usw.)',
    patientDataPlaceholder: 'z.B. 75 J. Mann, Anamnese mit Hypertonie, Vorhofflimmern, unter Warfarin. Stellt sich mit plötzlich einsetzenden Brustschmerzen, Atemnot vor. GCS 15. Verwirrt, AF 22, BD 90/60. Kürzliche Operation... Geben Sie detaillierte Informationen für die Berechnung von Scores wie HAS-BLED, WELLS, SOFA, CHA₂DS₂-VASc, CURB-65, GCS an.',
    getScoresButton: 'Scores & Empfehlungen erhalten',
    processingButton: 'Verarbeite...',
    referencesTitle: 'Referenzen für Bewertungssysteme',
    referencesSubtitle: 'Finden Sie schnelle Links zu Dokumentationen und Rechnern für gängige klinische Bewertungssysteme.',
    calculatedScoresTitle: 'Berechnete Scores',
    recommendedToolsTitle: 'Empfohlene Bewertungstools',
    switchLanguageTo: 'Sprache wechseln zu',
    english: 'Englisch',
    german: 'Deutsch',
    dutch: 'Niederländisch',
    successToastTitle: "Erfolg",
    successToastDescription: "Scores und Empfehlungen verarbeitet.",
    processingErrorToastTitle: "Verarbeitungsfehler",
    partialErrorToastTitle: "Teilweiser Fehler",
    partialErrorToastDescription: "Einige Informationen fehlen möglicherweise: {error}",
    noSpecificResultsToastTitle: "Keine spezifischen Ergebnisse",
    noSpecificResultsToastDescription: "KI konnte keine spezifischen Empfehlungen oder Scores generieren. Versuchen Sie, die Patientendaten zu verfeinern.",
    submissionErrorToastTitle: "Übermittlungsfehler",
    disclaimerTitle: "Wichtiger Hinweis",
    disclaimerContent: "Die von dieser Anwendung bereitgestellten Scores und Empfehlungen werden von einem KI-Modell (Gemini AI) generiert und dienen nur zu Informationszwecken. Sie sind kein Ersatz für professionelle medizinische Beratung, Diagnose oder Behandlung.\n\nAls Benutzer übernehmen Sie die volle Verantwortung für alle Entscheidungen oder Maßnahmen, die auf der Grundlage der von dieser Anwendung bereitgestellten Informationen getroffen werden. Konsultieren Sie bei medizinischen Bedenken immer einen qualifizierten Gesundheitsdienstleister.",
    disclaimerAcknowledgeButton: "Bestätigen & Fortfahren",
    scoreTypeLabel: 'Bestimmten Score-Typ auswählen (Optional)',
    scoreTypeAll: 'Alle anwendbaren Scores (Standard)',
    scoreTypeHasBled: 'HAS-BLED Score',
    scoreTypeWells: 'Wells Score (DVT/PE)',
    scoreTypeSofa: 'SOFA Score',
    scoreTypeCha2ds2vasc: 'CHA₂DS₂-VASc Score',
    scoreTypeCurb65: 'CURB-65 Score',
    scoreTypeGcs: 'Glasgow Coma Scale (GCS)',
  },
  en: {
    dashboardTitle: 'ScoreDoc',
    dashboardSubtitle: 'Enter patient data to get AI-powered recommendations and calculated scores for systems like HAS-BLED, WELLS, SOFA, CHA₂DS₂-VASc, CURB-65, and GCS.',
    patientDataInputTitle: 'Patient Data Input',
    patientDataLabel: 'Enter patient information (symptoms, medical history, lab results, etc.)',
    patientDataPlaceholder: 'e.g., 75 y/o male, history of hypertension, atrial fibrillation, on warfarin. Presents with sudden onset chest pain, shortness of breath. GCS 15. Confused, RR 22, BP 90/60. Recent surgery... Provide detailed info for scores like HAS-BLED, WELLS, SOFA, CHA₂DS₂-VASc, CURB-65, GCS.',
    getScoresButton: 'Get Scores & Recommendations',
    processingButton: 'Processing...',
    referencesTitle: 'Scoring System References',
    referencesSubtitle: 'Find quick links to documentation and calculators for common clinical scoring systems.',
    calculatedScoresTitle: 'Calculated Scores',
    recommendedToolsTitle: 'Recommended Scoring Tools',
    switchLanguageTo: 'Switch language to',
    english: 'English',
    german: 'German',
    dutch: 'Dutch',
    successToastTitle: "Success",
    successToastDescription: "Scores and recommendations processed.",
    processingErrorToastTitle: "Processing Error",
    partialErrorToastTitle: "Partial Error",
    partialErrorToastDescription: "Some information might be missing: {error}",
    noSpecificResultsToastTitle: "No Specific Results",
    noSpecificResultsToastDescription: "AI could not generate specific recommendations or scores. Try refining patient data.",
    submissionErrorToastTitle: "Submission Error",
    disclaimerTitle: "Important Disclaimer",
    disclaimerContent: "The scores and recommendations provided by this application are generated by an AI model (Gemini AI) and are for informational purposes only. They are not a substitute for professional medical advice, diagnosis, or treatment.\n\nAs a user, you assume full responsibility for any decisions or actions taken based on the information provided by this application. Always consult with a qualified healthcare professional for any medical concerns.",
    disclaimerAcknowledgeButton: "Acknowledge & Continue",
    scoreTypeLabel: 'Select Specific Score Type (Optional)',
    scoreTypeAll: 'All Applicable Scores (Default)',
    scoreTypeHasBled: 'HAS-BLED Score',
    scoreTypeWells: 'Wells Score (DVT/PE)',
    scoreTypeSofa: 'SOFA Score',
    scoreTypeCha2ds2vasc: 'CHA₂DS₂-VASc Score',
    scoreTypeCurb65: 'CURB-65 Score',
    scoreTypeGcs: 'Glasgow Coma Scale (GCS)',
  },
  nl: {
    dashboardTitle: 'ScoreDoc',
    dashboardSubtitle: 'Voer patiëntgegevens in voor AI-gestuurde aanbevelingen en berekende scores for systemen zoals HAS-BLED, WELLS, SOFA, CHA₂DS₂-VASc, CURB-65, en GCS.',
    patientDataInputTitle: 'Patiëntgegevens Invoer',
    patientDataLabel: 'Voer patiëntinformatie in (symptomen, medische geschiedenis, laboratoriumresultaten, enz.)',
    patientDataPlaceholder: 'bijv. 75-jarige man, voorgeschiedenis van hypertensie, atriumfibrilleren, gebruikt warfarine. Presenteert zich met plotselinge pijn op de borst, kortademigheid. GCS 15. Verward, AF 22, BD 90/60. Recente operatie... Geef gedetailleerde informatie voor scores zoals HAS-BLED, WELLS, SOFA, CHA₂DS₂-VASc, CURB-65, GCS.',
    getScoresButton: 'Scores & Aanbevelingen ophalen',
    processingButton: 'Verwerken...',
    referencesTitle: 'Referenties voor Scoretabel Systemen',
    referencesSubtitle: 'Vind snelle links naar documentatie en rekenmachines voor gangbare klinische scoresystemen.',
    calculatedScoresTitle: 'Berekende Scores',
    recommendedToolsTitle: 'Aanbevolen Scoretools',
    switchLanguageTo: 'Schakel taal naar',
    english: 'Engels',
    german: 'Duits',
    dutch: 'Nederlands',
    successToastTitle: "Succes",
    successToastDescription: "Scores en aanbevelingen verwerkt.",
    processingErrorToastTitle: "Verwerkingsfout",
    partialErrorToastTitle: "Gedeeltelijke Fout",
    partialErrorToastDescription: "Sommige informatie ontbreekt mogelijk: {error}",
    noSpecificResultsToastTitle: "Geen Specifieke Resultaten",
    noSpecificResultsToastDescription: "AI kon geen specifieke aanbevelingen of scores genereren. Probeer de patiëntgegevens te verfijnen.",
    submissionErrorToastTitle: "Indieningsfout",
    disclaimerTitle: "Belangrijke disclaimer",
    disclaimerContent: "De scores en aanbevelingen die door deze applicatie worden verstrekt, worden gegenereerd door een AI-model (Gemini AI) en zijn uitsluitend voor informatieve doeleinden. Ze zijn geen vervanging voor professioneel medisch advies, diagnose of behandeling.\n\nAls gebruiker aanvaardt u de volledige verantwoordelijkheid voor alle beslissingen of acties die worden ondernomen op basis van de informatie die door deze applicatie wordt verstrekt. Raadpleeg altijd een gekwalificeerde zorgverlener voor medische problemen.",
    disclaimerAcknowledgeButton: "Accepteren & Doorgaan",
    scoreTypeLabel: 'Selecteer Specifiek Score Type (Optioneel)',
    scoreTypeAll: 'Alle Toepasselijke Scores (Standaard)',
    scoreTypeHasBled: 'HAS-BLED Score',
    scoreTypeWells: 'Wells Score (DVT/PE)',
    scoreTypeSofa: 'SOFA Score',
    scoreTypeCha2ds2vasc: 'CHA₂DS₂-VASc Score',
    scoreTypeCurb65: 'CURB-65 Score',
    scoreTypeGcs: 'Glasgow Coma Scale (GCS)',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Locale>(defaultLocale);

  const translations = useMemo(() => AllTranslations[language], [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

