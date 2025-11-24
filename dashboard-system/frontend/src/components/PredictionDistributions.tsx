import { Card } from "./ui/card";
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, ReferenceLine } from "recharts";
import { BarChart3, ScatterChart as ScatterIcon } from "lucide-react";

// Generate histogram data for Scope 1 predictions (log scale)
const scope1HistogramData = Array.from({ length: 30 }, (_, i) => ({
  bin: (i * 0.5 + 6).toFixed(1),
  frequency: Math.floor(Math.random() * 40 + 10) * Math.exp(-Math.abs(i - 15) / 8)
}));

// Generate histogram data for Scope 2 predictions (log scale)
const scope2HistogramData = Array.from({ length: 30 }, (_, i) => ({
  bin: (i * 0.5 + 6).toFixed(1),
  frequency: Math.floor(Math.random() * 35 + 8) * Math.exp(-Math.abs(i - 14) / 7)
}));

// Generate scatter plot data showing correlation between Scope 1 and Scope 2
const scatterData = Array.from({ length: 200 }, (_, i) => {
  const scope1 = Math.random() * 8 + 8; // Log scale 8-16
  const scope2 = scope1 + (Math.random() - 0.5) * 3 + 0.5; // Correlated with some noise
  return {
    scope1: parseFloat(scope1.toFixed(2)),
    scope2: parseFloat(scope2.toFixed(2)),
    size: Math.random() * 100 + 50
  };
});

const medianScope1 = 11.2;
const medianScope2 = 11.8;

export function PredictionDistributions() {
  return (
    <section>
      <h2 className="text-[#1C1D1F] mb-4">Prediction Distributions</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[#1C1D1F] mb-1">Predicted Scope 1 Distribution (Log)</h3>
              <p className="text-[#6B7280]">Histogram of predicted direct emissions</p>
            </div>
            <BarChart3 className="size-5 text-[#4169E1]" />
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={scope1HistogramData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="bin" 
                stroke="#6B7280"
                label={{ value: 'Log(Emissions)', position: 'insideBottom', offset: -5, fill: '#6B7280' }}
              />
              <YAxis 
                stroke="#6B7280"
                label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
                labelStyle={{ color: '#1C1D1F' }}
              />
              <Bar dataKey="frequency" fill="#D1D5DB" opacity={0.7} />
              <ReferenceLine 
                x={medianScope1.toString()} 
                stroke="#4169E1" 
                strokeDasharray="3 3"
                label={{ value: 'Median', fill: '#4169E1', position: 'top' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[#1C1D1F] mb-1">Predicted Scope 2 Distribution (Log)</h3>
              <p className="text-[#6B7280]">Histogram of predicted indirect emissions</p>
            </div>
            <BarChart3 className="size-5 text-[#4169E1]" />
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={scope2HistogramData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="bin" 
                stroke="#6B7280"
                label={{ value: 'Log(Emissions)', position: 'insideBottom', offset: -5, fill: '#6B7280' }}
              />
              <YAxis 
                stroke="#6B7280"
                label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
                labelStyle={{ color: '#1C1D1F' }}
              />
              <Bar dataKey="frequency" fill="#D1D5DB" opacity={0.7} />
              <ReferenceLine 
                x={medianScope2.toString()} 
                stroke="#4169E1" 
                strokeDasharray="3 3"
                label={{ value: 'Median', fill: '#4169E1', position: 'top' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-[#1C1D1F] mb-1">Scope 1 vs Scope 2 Predictions</h3>
            <p className="text-[#6B7280]">Correlation between predicted direct and indirect emissions</p>
          </div>
          <ScatterIcon className="size-5 text-[#4169E1]" />
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              type="number" 
              dataKey="scope1" 
              name="Scope 1" 
              stroke="#6B7280"
              label={{ value: 'Predicted Scope 1 (Log)', position: 'insideBottom', offset: -5, fill: '#6B7280' }}
            />
            <YAxis 
              type="number" 
              dataKey="scope2" 
              name="Scope 2" 
              stroke="#6B7280"
              label={{ value: 'Predicted Scope 2 (Log)', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
            />
            <ZAxis type="number" dataKey="size" range={[20, 80]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
              labelStyle={{ color: '#1C1D1F' }}
            />
            <Scatter 
              data={scatterData} 
              fill="#D1D5DB" 
              opacity={0.3}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>
    </section>
  );
}
