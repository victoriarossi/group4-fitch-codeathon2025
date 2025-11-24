import { useState } from "react";
import { GlassCard } from "../ui/glass-card";
import { StepHeader } from "../ui/step-header";

interface DatasetStoryStepProps {
  stepNumber: number;
}

const dataStats = [
  { label: "Companies", value: "429", category: "base" },
  { label: "Regions", value: "7", category: "geography" },
  { label: "Countries", value: "28", category: "geography" },
  { label: "Sector Revenue Rows", value: "799", category: "sector" },
  { label: "NACE Level-1 Sectors", value: "20", category: "sector" },
  { label: "NACE Level-2 Sectors", value: "79", category: "sector" },
  { label: "Environmental Records", value: "355", category: "activities" },
  { label: "Activity Types", value: "8", category: "activities" },
  { label: "SDG Records", value: "165", category: "sdgs" },
  { label: "Unique SDGs", value: "12", category: "sdgs" },
  { label: "Incomplete Revenue %", value: "21", category: "base" },
];

const progressionSteps = [
  { label: "Region", value: "7" },
  { label: "Country", value: "28" },
  { label: "Sector", value: "79" },
  { label: "Activities", value: "355" },
  { label: "SDGs", value: "165" },
];

export function DatasetStoryStep({ stepNumber }: DatasetStoryStepProps) {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  return (
    <section>
      <StepHeader
        stepNumber={stepNumber}
        title="Understanding the Dataset"
        description="A clear overview of the companies and data sources used to train the model."
      />

      {/* Data Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {dataStats.map((stat, idx) => (
          <GlassCard
            key={idx}
            variant="micro"
            className="p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_2px_12px_rgba(63,77,100,0.12)] relative"
            onMouseEnter={() => setHoveredStat(stat.label)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className="text-sm text-[#8B8F94] mb-2">{stat.label}</div>
            <div className="text-3xl text-[#1A1A1A]">{stat.value}</div>
            
            {/* Tooltip */}
            {hoveredStat === stat.label && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#1A1A1A] text-white text-xs rounded-lg whitespace-nowrap z-10">
                {stat.label}: {stat.value}
                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1A1A1A] rotate-45"></div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Progression Visualization */}
      <GlassCard variant="secondary" className="p-8">
        <div className="text-[#1A1A1A] mb-2">Data Hierarchy Flow</div>
        <div className="text-sm text-[#8B8F94] mb-8">
          From geographic regions to granular SDG disclosures
        </div>

        <div className="flex items-center justify-between">
          {progressionSteps.map((step, idx) => (
            <div key={idx} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#3F4D64]/10 border-2 border-[#3F4D64]/30 flex items-center justify-center mb-3 transition-all duration-200 hover:bg-[#3F4D64]/20 hover:scale-110">
                  <div className="text-xl text-[#3F4D64]">{step.value}</div>
                </div>
                <div className="text-sm text-[#1A1A1A]">{step.label}</div>
              </div>
              {idx < progressionSteps.length - 1 && (
                <div className="w-24 h-[2px] bg-gradient-to-r from-[#3F4D64]/30 to-[#3F4D64]/10 mx-4"></div>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
