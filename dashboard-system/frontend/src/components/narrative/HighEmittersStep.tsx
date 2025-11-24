import { useState } from "react";
import { GlassCard } from "../ui/glass-card";
import { StepHeader } from "../ui/step-header";

interface HighEmittersStepProps {
  stepNumber: number;
}

type EmitterRow = {
  entityId: string;
  region: string;
  scope1: number;
  scope2: number;
  revenue: number;
  intensity: number;
};

const emitters: EmitterRow[] = [
  { entityId: "ENT-8234", region: "Europe", scope1: 524800, scope2: 318500, revenue: 2500000, intensity: 337.3 },
  { entityId: "ENT-5621", region: "North America", scope1: 412600, scope2: 289400, revenue: 1850000, intensity: 379.5 },
  { entityId: "ENT-9012", region: "Asia", scope1: 389200, scope2: 245800, revenue: 1200000, intensity: 529.2 },
  { entityId: "ENT-3456", region: "Europe", scope1: 356700, scope2: 198300, revenue: 980000, intensity: 566.3 },
  { entityId: "ENT-7823", region: "North America", scope1: 298500, scope2: 256200, revenue: 2100000, intensity: 264.1 },
  { entityId: "ENT-2109", region: "Asia", scope1: 287300, scope2: 234100, revenue: 1650000, intensity: 316.0 },
  { entityId: "ENT-4567", region: "Europe", scope1: 265400, scope2: 189700, revenue: 890000, intensity: 511.3 },
  { entityId: "ENT-6789", region: "Africa", scope1: 245900, scope2: 167200, revenue: 720000, intensity: 573.8 },
  { entityId: "ENT-1234", region: "North America", scope1: 234600, scope2: 178400, revenue: 1100000, intensity: 375.5 },
  { entityId: "ENT-8901", region: "South America", scope1: 212300, scope2: 145800, revenue: 650000, intensity: 550.9 },
];

export function HighEmittersStep({ stepNumber }: HighEmittersStepProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  return (
    <section>
      <StepHeader
        stepNumber={stepNumber}
        title="Which Companies Emit the Most?"
        description="Top predicted emitters ranked by total emissions and normalized carbon intensity."
      />

      <GlassCard variant="secondary" className="p-8">
        <div className="text-[#1A1A1A] mb-1">Top 10 Predicted Emitters</div>
        <div className="text-sm text-[#8B8F94] mb-6">
          Click any row to highlight • Hover for details
        </div>

        <div className="overflow-hidden rounded-xl border border-[#E8EAED]">
          <table className="w-full">
            <thead>
              <tr className="bg-white/60 border-b border-[#E8EAED]">
                <th className="text-left px-4 py-3 text-xs text-[#8B8F94]">Entity ID</th>
                <th className="text-left px-4 py-3 text-xs text-[#8B8F94]">Region</th>
                <th className="text-right px-4 py-3 text-xs text-[#8B8F94]">Scope 1</th>
                <th className="text-right px-4 py-3 text-xs text-[#8B8F94]">Scope 2</th>
                <th className="text-right px-4 py-3 text-xs text-[#8B8F94]">Revenue</th>
                <th className="text-right px-4 py-3 text-xs text-[#8B8F94]">Intensity</th>
              </tr>
            </thead>
            <tbody>
              {emitters.map((row, idx) => (
                <tr
                  key={row.entityId}
                  className={`
                    border-b border-[#E8EAED] cursor-pointer transition-all duration-200
                    ${idx % 2 === 0 ? 'bg-white/30' : 'bg-white/50'}
                    ${hoveredRow === row.entityId ? 'bg-[#3F4D64]/5' : ''}
                    ${selectedRow === row.entityId ? 'bg-[#3F4D64]/10 border-l-4 border-l-[#3F4D64]' : ''}
                  `}
                  onMouseEnter={() => setHoveredRow(row.entityId)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => setSelectedRow(selectedRow === row.entityId ? null : row.entityId)}
                >
                  <td className="px-4 py-4 text-sm text-[#1A1A1A]">{row.entityId}</td>
                  <td className="px-4 py-4 text-sm text-[#8B8F94]">{row.region}</td>
                  <td className="px-4 py-4 text-sm text-right text-[#1A1A1A]">
                    {row.scope1.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-right text-[#1A1A1A]">
                    {row.scope2.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-right text-[#8B8F94]">
                    ${(row.revenue / 1000).toFixed(0)}k
                  </td>
                  <td className="px-4 py-4 text-sm text-right text-[#3F4D64]">
                    {row.intensity.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-6 border-t border-[#E8EAED] flex items-center justify-between">
          <div className="text-sm text-[#8B8F94]">
            Carbon Intensity = (Scope 1 + Scope 2) / Revenue × 1000
          </div>
          {selectedRow && (
            <div className="text-sm text-[#3F4D64]">
              {selectedRow} selected
            </div>
          )}
        </div>
      </GlassCard>
    </section>
  );
}
