import { useState } from "react";
import { GlassCard } from "../ui/glass-card";
import { StepHeader } from "../ui/step-header";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";

interface FeatureEngineeringStepProps {
  stepNumber: number;
}

const featureFamilies = [
  { name: "Geography", value: 8, color: "#3B82F6", description: "Region and country encodings" },
  { name: "Revenue & Financial", value: 10, color: "#8B5CF6", description: "Financial indicators and revenue data" },
  { name: "ESG Scores", value: 9, color: "#EC4899", description: "Environmental, Social, Governance metrics" },
  { name: "Environmental Activities", value: 7, color: "#F59E0B", description: "Activity types and intensity" },
  { name: "SDG Embeddings", value: 10, color: "#10B981", description: "Sustainable Development Goal vectors" },
  { name: "Sector PCA", value: 12, color: "#6366F1", description: "Principal components from sector data" },
];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export function FeatureEngineeringStep({ stepNumber }: FeatureEngineeringStepProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredFamily, setHoveredFamily] = useState<string | null>(null);

  return (
    <section>
      <StepHeader
        stepNumber={stepNumber}
        title="Engineering 56 Features"
        description="We engineered 56 features drawing from geography, revenue, ESG scores, environmental activities, SDG embeddings, and sector PCA components."
      />

      <div className="grid grid-cols-2 gap-6">
        {/* Dataset Splits */}
        <GlassCard variant="secondary" className="p-8">
          <div className="text-[#1A1A1A] mb-1">Dataset Configuration</div>
          <div className="text-sm text-[#8B8F94] mb-8">
            Train / Validation / Test split
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-[#3F4D64]/5 rounded-2xl border border-[#3F4D64]/10">
              <div className="text-sm text-[#8B8F94] mb-2">Total Features</div>
              <div className="text-4xl text-[#3F4D64]">56</div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#E8EAED]">
              <div className="flex items-center justify-between">
                <span className="text-[#8B8F94]">Training rows</span>
                <span className="text-2xl text-[#1A1A1A]">299</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B8F94]">Validation rows</span>
                <span className="text-2xl text-[#1A1A1A]">65</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B8F94]">Test rows</span>
                <span className="text-2xl text-[#1A1A1A]">65</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Radial Feature Wheel */}
        <GlassCard variant="secondary" className="p-8">
          <div className="text-[#1A1A1A] mb-1">Feature Family Composition</div>
          <div className="text-sm text-[#8B8F94] mb-6">
            Interactive wheel showing feature categories
          </div>

          <div className="relative">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={featureFamilies}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  activeIndex={activeIndex ?? undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => {
                    setActiveIndex(index);
                    setHoveredFamily(featureFamilies[index].name);
                  }}
                  onMouseLeave={() => {
                    setActiveIndex(null);
                    setHoveredFamily(null);
                  }}
                >
                  {featureFamilies.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="cursor-pointer" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-3xl text-[#1A1A1A]">56</div>
              <div className="text-xs text-[#8B8F94]">features</div>
            </div>
          </div>

          {/* Legend with descriptions */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {featureFamilies.map((family, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  hoveredFamily === family.name
                    ? 'bg-[#3F4D64]/10 border border-[#3F4D64]/20'
                    : 'bg-white/30 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: family.color }}></div>
                  <span className="text-xs text-[#1A1A1A]">{family.name}</span>
                </div>
                {hoveredFamily === family.name && (
                  <p className="text-xs text-[#8B8F94] mt-1">{family.description}</p>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}