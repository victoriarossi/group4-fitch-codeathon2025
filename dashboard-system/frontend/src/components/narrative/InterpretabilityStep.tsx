import { useState } from "react";
import { GlassCard } from "../ui/glass-card";
import { StepHeader } from "../ui/step-header";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

interface InterpretabilityStepProps {
  stepNumber: number;
}

const featureImportance = [
  { feature: "Sector PCA 1", importance: 0.185, description: "Primary sector component capturing industrial classification patterns" },
  { feature: "Environmental Activities", importance: 0.162, description: "Count and intensity of environmental activity disclosures" },
  { feature: "Region Code", importance: 0.148, description: "Geographic region encoding with regulatory context" },
  { feature: "Revenue Scale", importance: 0.135, description: "Normalized company revenue as size proxy" },
  { feature: "ESG Environmental", importance: 0.112, description: "Environmental pillar score from ESG ratings" },
  { feature: "SDG Embedding 1", importance: 0.098, description: "First principal SDG embedding dimension" },
  { feature: "Sector PCA 2", importance: 0.085, description: "Secondary sector component for sub-industry patterns" },
  { feature: "Activity Intensity", importance: 0.075, description: "Environmental activity density per revenue unit" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-lg text-xs shadow-xl max-w-xs">
        <p className="mb-1">{data.feature}</p>
        <p className="text-white/80 mb-2">{data.description}</p>
        <p className="text-emerald-200">Importance: {(data.importance * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export function InterpretabilityStep({ stepNumber }: InterpretabilityStepProps) {
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  return (
    <section>
      <StepHeader
        stepNumber={stepNumber}
        title="What Drives the Predictions?"
        description="Feature importance reveals which factors most strongly influence emissions predictions."
      />

      <GlassCard variant="secondary" className="p-8">
        <div className="text-[#1A1A1A] mb-1">Top 8 Predictive Features</div>
        <div className="text-sm text-[#8B8F94] mb-6">
          Hover for descriptions • Click to highlight
        </div>

        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={featureImportance} layout="vertical" margin={{ left: 150 }}>
            <XAxis
              type="number"
              stroke="#8B8F94"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <YAxis
              type="category"
              dataKey="feature"
              stroke="#8B8F94"
              axisLine={false}
              tickLine={false}
              width={140}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(63, 77, 100, 0.05)' }} />
            <Bar
              dataKey="importance"
              radius={[0, 8, 8, 0]}
              onClick={(data, index) => setSelectedBar(selectedBar === index ? null : index)}
            >
              {featureImportance.map((entry, index) => {
                const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4', '#6366F1', '#14B8A6'];
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={selectedBar === index ? colors[index] : colors[index]}
                    className="cursor-pointer transition-all duration-200"
                    opacity={selectedBar === null || selectedBar === index ? 1 : 0.3}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {selectedBar !== null && (
          <div className="mt-6 p-4 bg-[#3F4D64]/5 rounded-xl border border-[#3F4D64]/20">
            <div className="text-sm text-[#1A1A1A] mb-1">
              {featureImportance[selectedBar].feature}
            </div>
            <div className="text-xs text-[#8B8F94]">
              {featureImportance[selectedBar].description}
            </div>
          </div>
        )}
      </GlassCard>
    </section>
  );
}