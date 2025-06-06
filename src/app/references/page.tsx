import ReferenceCard from "@/components/reference-card";
import { BookOpenText } from "lucide-react";

const references = [
  {
    title: "HAS-BLED Score",
    description: "Assesses 1-year risk of major bleeding in patients with atrial fibrillation (AF) on anticoagulation.",
    link: "https://www.mdcalc.com/calc/1099/has-bled-score-major-bleeding-risk",
    category: "Cardiology / Hematology"
  },
  {
    title: "Wells Score for DVT",
    description: "Predicts pretest probability of deep vein thrombosis (DVT).",
    link: "https://www.mdcalc.com/calc/18/wells-criteria-dvt",
    category: "Vascular / Emergency"
  },
  {
    title: "Wells Score for PE",
    description: "Predicts pretest probability of pulmonary embolism (PE).",
    link: "https://www.mdcalc.com/calc/115/wells-criteria-pulmonary-embolism",
    category: "Pulmonology / Emergency"
  },
  {
    title: "SOFA Score (Sequential Organ Failure Assessment)",
    description: "Assesses organ dysfunction/failure severity in ICU patients, often used in sepsis evaluation.",
    link: "https://www.mdcalc.com/calc/39/sofa-score-sequential-organ-failure-assessment",
    category: "Critical Care / Sepsis"
  },
  {
    title: "CHA₂DS₂-VASc Score",
    description: "Estimates stroke risk in patients with non-valvular atrial fibrillation.",
    link: "https://www.mdcalc.com/calc/801/cha2ds2-vasc-score-stroke-risk-atrial-fibrillation",
    category: "Cardiology"
  },
  {
    title: "CURB-65 Score",
    description: "Predicts mortality in community-acquired pneumonia to help guide admission decisions.",
    link: "https://www.mdcalc.com/calc/4 CURB-65-Severity-Score-Community-Acquired-Pneumonia",
    category: "Infectious Disease / Pulmonology"
  },
  {
    title: "Glasgow Coma Scale (GCS)",
    description: "Assesses level of consciousness in patients with acute brain injury.",
    link: "https://www.mdcalc.com/calc/64/glasgow-coma-scale-score-gcs",
    category: "Neurology / Trauma"
  }
];

export default function ReferencesPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpenText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground font-headline">Scoring System References</h1>
        </div>
        <p className="text-muted-foreground">
          Find quick links to documentation and calculators for common clinical scoring systems.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {references.map((ref) => (
          <ReferenceCard
            key={ref.title}
            title={ref.title}
            description={ref.description}
            link={ref.link}
            category={ref.category}
          />
        ))}
      </div>
    </div>
  );
}

