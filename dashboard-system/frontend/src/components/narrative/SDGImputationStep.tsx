import { useState } from "react";
import { GlassCard } from "../ui/glass-card";
import { StepHeader } from "../ui/step-header";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface SDGImputationStepProps {
  stepNumber: number;
}

const kpiData = [
  { label: "Total SDG Rows", value: "997" },
  { label: "Known", value: "401" },
  { label: "Missing", value: "596" },
  { label: "Best K", value: "5" },
  { label: "CV Accuracy", value: "0.44" },
  { label: "Test Accuracy", value: "0.457" },
  { label: "Mean Confidence", value: "0.62" },
  { label: "High Confidence (>70%)", value: "221" },
  { label: "Moderate (>50%)", value: "378" },
];

// Confidence distribution KDE curve
const confidenceDistribution = Array.from({ length: 50 }, (_, i) => {
  const x = i / 49; // 0 to 1
  // Bimodal distribution with peaks at ~0.5 and ~0.75
  const density = 
    0.4 * Math.exp(-Math.pow((x - 0.5) / 0.15, 2)) +
    0.6 * Math.exp(-Math.pow((x - 0.75) / 0.12, 2));
  return { confidence: x, density };
});

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-xl">
        <p>Confidence: {(payload[0].payload.confidence * 100).toFixed(0)}%</p>
        <p>Density: {payload[0].value.toFixed(3)}</p>
      </div>
    );
  }
  return null;
};

export function SDGImputationStep({ stepNumber }: SDGImputationStepProps) {
  const [hoveredKPI, setHoveredKPI] = useState<string | null>(null);

  return (
    <section>
      <StepHeader
        stepNumber={stepNumber}
        title="Filling in Missing SDGs Using KNN"
        description="We filled 596 missing SDG labels using a K-Nearest Neighbors model with K=5, achieving 45.7% test accuracy."
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {kpiData.map((kpi, idx) => (
          <GlassCard
            key={idx}
            variant="micro"
            className="p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_2px_12px_rgba(63,77,100,0.12)] relative"
            onMouseEnter={() => setHoveredKPI(kpi.label)}
            onMouseLeave={() => setHoveredKPI(null)}
          >
            <div className="text-sm text-[#8B8F94] mb-2">{kpi.label}</div>
            <div className="text-2xl text-[#1A1A1A]">{kpi.value}</div>

            {hoveredKPI === kpi.label && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#1A1A1A] text-white text-xs rounded-lg whitespace-nowrap z-10">
                {kpi.label}: {kpi.value}
                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1A1A1A] rotate-45"></div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Dumbbell Accuracy Chart */}
        <GlassCard variant="secondary" className="p-8">
          <div className="text-[#1A1A1A] mb-1">Model Accuracy Comparison</div>
          <div className="text-sm text-[#8B8F94] mb-8">
            Cross-validation vs Hold-out test
          </div>

          <div className="space-y-8">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#8B8F94]">Accuracy</span>
              </div>
              <div className="relative h-2 bg-[#E8EAED] rounded-full">
                <div className="absolute top-1/2 -translate-y-1/2 left-[44%] w-[5.7%] h-1 bg-[#3F4D64]/30"></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-[44%] w-4 h-4 bg-[#AEB6C2] border-2 border-white rounded-full shadow-md"></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-[45.7%] w-4 h-4 bg-[#3F4D64] border-2 border-white rounded-full shadow-md"></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-[#8B8F94]">0</span>
                <span className="text-xs text-[#8B8F94]">1</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8EAED]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#AEB6C2] rounded-full"></div>
                <div>
                  <div className="text-xs text-[#8B8F94]">CV Accuracy</div>
                  <div className="text-[#1A1A1A]">0.44</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#3F4D64] rounded-full"></div>
                <div>
                  <div className="text-xs text-[#8B8F94]">Test Accuracy</div>
                  <div className="text-[#1A1A1A]">0.457</div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Confidence Distribution */}
        <GlassCard variant="secondary" className="p-8">
          <div className="text-[#1A1A1A] mb-1">Confidence Distribution</div>
          <div className="text-sm text-[#8B8F94] mb-6">
            KDE curve showing prediction confidence
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={confidenceDistribution}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="confidence"
                stroke="#8B8F94"
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="density"
                stroke="#8B5CF6"
                strokeWidth={3}
                fill="url(#confidenceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </section>
  );
}