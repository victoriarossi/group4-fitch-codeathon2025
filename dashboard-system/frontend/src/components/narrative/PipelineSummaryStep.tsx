import { GlassCard } from "../ui/glass-card";
import { StepHeader } from "../ui/step-header";
import { Check } from "lucide-react";

interface PipelineSummaryStepProps {
  stepNumber: number;
}

const pipelineSteps = [
  { label: "Data loaded", detail: "429 companies across 7 regions" },
  { label: "SDG imputed using KNN", detail: "596 missing SDGs filled with K=5" },
  { label: "Features engineered (56 total)", detail: "Combining geography, ESG, activities, embeddings, PCA" },
  { label: "PCA applied", detail: "Dimensional reduction on sector data" },
  { label: "Baseline + Tuned models trained", detail: "RandomForest with hyperparameter optimization" },
  { label: "Predictions generated", detail: "Scope 1 & 2 emissions for all entities" },
];

export function PipelineSummaryStep({ stepNumber }: PipelineSummaryStepProps) {
  return (
    <section>
      <StepHeader
        stepNumber={stepNumber}
        title="Final Pipeline Summary"
        description="A concise view of the complete modeling workflow from raw data to predictions."
      />

      <GlassCard variant="secondary" className="p-8">
        <div className="text-[#1A1A1A] mb-1">Workflow Checklist</div>
        <div className="text-sm text-[#8B8F94] mb-8">
          End-to-end pipeline execution
        </div>

        <div className="space-y-4">
          {pipelineSteps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-5 bg-white/40 rounded-2xl border border-[#E8EAED] transition-all duration-200 hover:bg-white/60 hover:border-[#3F4D64]/20 hover:shadow-md"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3F4D64] flex items-center justify-center text-white shadow-md">
                <Check className="w-5 h-5" strokeWidth={3} />
              </div>
              <div className="flex-1 pt-1">
                <div className="text-[#1A1A1A] mb-1">{step.label}</div>
                <div className="text-sm text-[#8B8F94]">{step.detail}</div>
              </div>
              <div className="text-xs text-[#8B8F94] pt-2">
                Step {idx + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-[#E8EAED]">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-[#3F4D64]/5 rounded-xl">
              <div className="text-2xl text-[#3F4D64] mb-1">429</div>
              <div className="text-xs text-[#8B8F94]">Companies Modeled</div>
            </div>
            <div className="text-center p-4 bg-[#3F4D64]/5 rounded-xl">
              <div className="text-2xl text-[#3F4D64] mb-1">56</div>
              <div className="text-xs text-[#8B8F94]">Features Engineered</div>
            </div>
            <div className="text-center p-4 bg-[#3F4D64]/5 rounded-xl">
              <div className="text-2xl text-[#3F4D64] mb-1">2</div>
              <div className="text-xs text-[#8B8F94]">Emission Scopes</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
