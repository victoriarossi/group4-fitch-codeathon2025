import { GlassCard } from "../ui/glass-card";
import { StepHeader } from "../ui/step-header";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface PredictionDistributionStepProps {
  stepNumber: number;
}

// Scope 1 KDE (moderate right skew)
const scope1Distribution = Array.from({ length: 80 }, (_, i) => {
  const x = 7 + i * 0.1;
  const density = Math.exp(-Math.pow((x - 10.5) / 1.6, 2)) * (1 + 0.3 * Math.exp(-Math.pow((x - 12) / 1.2, 2)));
  return { x, density };
});

// Scope 2 KDE (extreme right skew, skewness ≈ 7.34)
const scope2Distribution = Array.from({ length: 80 }, (_, i) => {
  const x = 7 + i * 0.12;
  const density = Math.exp(-Math.pow((x - 9.8) / 1.4, 2)) * (1 + 0.8 * Math.exp(-Math.pow((x - 12.5) / 0.8, 2)));
  return { x, density };
});

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg text-xs shadow-xl">
        <p>Log(Emissions): {payload[0].payload.x.toFixed(2)}</p>
        <p>Density: {payload[0].value.toFixed(3)}</p>
      </div>
    );
  }
  return null;
};

export function PredictionDistributionStep({ stepNumber }: PredictionDistributionStepProps) {
  return (
    <section>
      <StepHeader
        stepNumber={stepNumber}
        title="Prediction Distribution"
        description="Distribution of predicted emissions across all companies—showing right-skewed patterns typical of environmental data."
      />

      <div className="grid grid-cols-2 gap-6">
        {/* Scope 1 Distribution */}
        <GlassCard variant="secondary" className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[#1A1A1A] mb-1">Scope 1 Predictions</div>
              <div className="text-sm text-[#8B8F94]">Log-scale KDE curve</div>
            </div>
            <div className="px-3 py-1 bg-[#3F4D64]/10 text-[#3F4D64] text-xs rounded-full">
              Moderate skew
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={scope1Distribution}>
              <defs>
                <linearGradient id="scope1Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" vertical={false} />
              <XAxis
                dataKey="x"
                stroke="#8B8F94"
                axisLine={false}
                tickLine={false}
                label={{ value: 'Log(Emissions)', position: 'insideBottom', offset: -5, fill: '#8B8F94' }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="density"
                stroke="#06B6D4"
                strokeWidth={3}
                fill="url(#scope1Gradient)"
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-6 pt-6 border-t border-[#E8EAED] grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-[#8B8F94] mb-1">Mean</div>
              <div className="text-[#1A1A1A]">10.8</div>
            </div>
            <div>
              <div className="text-xs text-[#8B8F94] mb-1">Std Dev</div>
              <div className="text-[#1A1A1A]">1.6</div>
            </div>
            <div>
              <div className="text-xs text-[#8B8F94] mb-1">Skewness</div>
              <div className="text-[#1A1A1A]">0.85</div>
            </div>
          </div>
        </GlassCard>

        {/* Scope 2 Distribution */}
        <GlassCard variant="secondary" className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[#1A1A1A] mb-1">Scope 2 Predictions</div>
              <div className="text-sm text-[#8B8F94]">Log-scale KDE curve</div>
            </div>
            <div className="px-3 py-1 bg-[#8F9DB4]/20 text-[#3F4D64] text-xs rounded-full">
              Extreme skew
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={scope2Distribution}>
              <defs>
                <linearGradient id="scope2Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EAED" vertical={false} />
              <XAxis
                dataKey="x"
                stroke="#8B8F94"
                axisLine={false}
                tickLine={false}
                label={{ value: 'Log(Emissions)', position: 'insideBottom', offset: -5, fill: '#8B8F94' }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="density"
                stroke="#F59E0B"
                strokeWidth={3}
                fill="url(#scope2Gradient)"
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-6 pt-6 border-t border-[#E8EAED] grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-[#8B8F94] mb-1">Mean</div>
              <div className="text-[#1A1A1A]">10.2</div>
            </div>
            <div>
              <div className="text-xs text-[#8B8F94] mb-1">Std Dev</div>
              <div className="text-[#1A1A1A]">2.1</div>
            </div>
            <div>
              <div className="text-xs text-[#8B8F94] mb-1">Skewness</div>
              <div className="text-[#1A1A1A]">7.34</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}