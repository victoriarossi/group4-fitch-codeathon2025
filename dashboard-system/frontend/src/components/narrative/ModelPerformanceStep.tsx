import { useState } from "react";
import { GlassCard } from "../ui/glass-card";
import { StepHeader } from "../ui/step-header";
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";

interface ModelPerformanceStepProps {
  stepNumber: number;
}

// Sparkline data for performance trajectories
const scope1Trajectory = [
  { model: "Baseline", r2: 0.553, rmse: 1.323 },
  { model: "Tuned", r2: 0.540, rmse: 1.339 },
];

const scope2Trajectory = [
  { model: "Baseline", r2: 0.414, rmse: 1.876 },
  { model: "Tuned", r2: 0.426, rmse: 1.851 },
];

// Calibration plot data (predicted vs actual)
const calibrationData = Array.from({ length: 40 }, (_, i) => {
  const actual = 8 + Math.random() * 6;
  const noise = (Math.random() - 0.5) * 1.2;
  return {
    actual,
    predicted: actual + noise,
  };
});

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg text-xs shadow-xl">
        <p>Actual: {payload[0]?.value?.toFixed(2)}</p>
        <p>Predicted: {payload[1]?.value?.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export function ModelPerformanceStep({ stepNumber }: ModelPerformanceStepProps) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  return (
    <section>
      <StepHeader
        stepNumber={stepNumber}
        title="Model Performance"
        description="Comparing baseline and tuned model performance for both Scope 1 and Scope 2 emissions predictions."
      />

      {/* Performance Cards Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Scope 1 Card */}
        <GlassCard variant="primary" className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[#1A1A1A] mb-1">Scope 1 Performance</div>
              <div className="text-sm text-[#8B8F94]">Direct emissions</div>
            </div>
            <div className="px-3 py-1 bg-[#3F4D64]/10 text-[#3F4D64] text-xs rounded-full">
              Log-space
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className="p-4 bg-white/40 rounded-xl border border-[#E8EAED] cursor-pointer transition-all duration-200 hover:bg-white/60 hover:scale-[1.02]"
              onMouseEnter={() => setHoveredMetric('scope1-baseline')}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="text-xs text-[#8B8F94] mb-2">Baseline Model</div>
              <div className="text-xl text-[#1A1A1A] mb-1">R² = 0.553</div>
              <div className="text-sm text-[#8B8F94]">RMSE = 1.323</div>
            </div>
            <div
              className="p-4 bg-white/40 rounded-xl border border-[#3F4D64]/30 cursor-pointer transition-all duration-200 hover:bg-[#3F4D64]/5 hover:scale-[1.02]"
              onMouseEnter={() => setHoveredMetric('scope1-tuned')}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="text-xs text-[#8B8F94] mb-2">Tuned Model</div>
              <div className="text-xl text-[#1A1A1A] mb-1">R² = 0.540</div>
              <div className="text-sm text-[#8B8F94]">RMSE = 1.339</div>
            </div>
          </div>

          {/* Sparkline trajectory */}
          <div className="pt-4 border-t border-[#E8EAED]">
            <div className="text-xs text-[#8B8F94] mb-3">R² Trajectory</div>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={scope1Trajectory}>
                <Line
                  type="monotone"
                  dataKey="r2"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Scope 2 Card */}
        <GlassCard variant="primary" className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[#1A1A1A] mb-1">Scope 2 Performance</div>
              <div className="text-sm text-[#8B8F94]">Indirect emissions</div>
            </div>
            <div className="px-3 py-1 bg-[#3F4D64]/10 text-[#3F4D64] text-xs rounded-full">
              Log-space
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className="p-4 bg-white/40 rounded-xl border border-[#E8EAED] cursor-pointer transition-all duration-200 hover:bg-white/60 hover:scale-[1.02]"
              onMouseEnter={() => setHoveredMetric('scope2-baseline')}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="text-xs text-[#8B8F94] mb-2">Baseline Model</div>
              <div className="text-xl text-[#1A1A1A] mb-1">R² = 0.414</div>
              <div className="text-sm text-[#8B8F94]">RMSE = 1.876</div>
            </div>
            <div
              className="p-4 bg-white/40 rounded-xl border border-[#3F4D64]/30 cursor-pointer transition-all duration-200 hover:bg-[#3F4D64]/5 hover:scale-[1.02]"
              onMouseEnter={() => setHoveredMetric('scope2-tuned')}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              <div className="text-xs text-[#8B8F94] mb-2">Tuned Model</div>
              <div className="text-xl text-[#1A1A1A] mb-1">R² = 0.426</div>
              <div className="text-sm text-[#8B8F94]">RMSE = 1.851</div>
            </div>
          </div>

          {/* Sparkline trajectory */}
          <div className="pt-4 border-t border-[#E8EAED]">
            <div className="text-xs text-[#8B8F94] mb-3">R² Trajectory</div>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={scope2Trajectory}>
                <Line
                  type="monotone"
                  dataKey="r2"
                  stroke="#EC4899"
                  strokeWidth={3}
                  dot={{ fill: '#EC4899', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Calibration Plot */}
      <GlassCard variant="secondary" className="p-8">
        <div className="text-[#1A1A1A] mb-1">Model Calibration</div>
        <div className="text-sm text-[#8B8F94] mb-6">
          Predicted vs Actual (log-scale) — Perfect calibration follows the diagonal
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart>
            <XAxis
              dataKey="actual"
              stroke="#8B8F94"
              axisLine={false}
              tickLine={false}
              label={{ value: 'Actual (log)', position: 'insideBottom', offset: -5, fill: '#8B8F94' }}
            />
            <YAxis
              dataKey="predicted"
              stroke="#8B8F94"
              axisLine={false}
              tickLine={false}
              label={{ value: 'Predicted (log)', angle: -90, position: 'insideLeft', fill: '#8B8F94' }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference line (y=x) */}
            <Line
              data={[{ actual: 8, predicted: 8 }, { actual: 14, predicted: 14 }]}
              dataKey="predicted"
              stroke="#E8EAED"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            
            <Scatter
              data={calibrationData}
              fill="#6366F1"
              fillOpacity={0.5}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </GlassCard>
    </section>
  );
}