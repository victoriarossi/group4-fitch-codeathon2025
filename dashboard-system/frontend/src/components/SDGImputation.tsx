import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, GitBranch, TrendingUp } from "lucide-react";

const sdgComparisonData = [
  { sdg: "SDG 7", known: 18.5, imputed: 15.3 },
  { sdg: "SDG 9", known: 16.2, imputed: 18.7 },
  { sdg: "SDG 11", known: 14.7, imputed: 12.1 },
  { sdg: "SDG 12", known: 13.2, imputed: 14.6 },
  { sdg: "SDG 13", known: 11.5, imputed: 13.2 },
  { sdg: "SDG 8", known: 8.7, imputed: 9.4 },
  { sdg: "SDG 3", known: 6.2, imputed: 5.9 },
  { sdg: "SDG 6", known: 4.5, imputed: 4.2 },
  { sdg: "SDG 15", known: 3.2, imputed: 2.9 },
  { sdg: "SDG 17", known: 2.1, imputed: 2.5 },
  { sdg: "SDG 5", known: 1.2, imputed: 1.2 },
];

export function SDGImputation() {
  return (
    <section>
      <h2 className="text-[#1C1D1F] mb-4">SDG Imputation Model Summary</h2>
      
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-[#1C1D1F]">SDG Missingness</h3>
            <AlertCircle className="size-5 text-[#4169E1]" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">Total SDG rows:</span>
              <span className="text-[#1C1D1F]">997</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">Missing SDG labels:</span>
              <span className="text-[#1C1D1F]">596</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Known SDG labels:</span>
              <span className="text-[#1C1D1F]">401</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-[#1C1D1F]">KNN Imputation Quality</h3>
            <GitBranch className="size-5 text-[#4169E1]" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">Algorithm:</span>
              <span className="text-[#1C1D1F]">KNN</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">Best k:</span>
              <span className="text-[#1C1D1F]">5</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">CV Accuracy:</span>
              <span className="text-[#1C1D1F]">0.44</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Hold-out Accuracy:</span>
              <span className="text-[#1C1D1F]">0.457</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-[#1C1D1F]">Imputation Confidence</h3>
            <TrendingUp className="size-5 text-[#4169E1]" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">Mean confidence:</span>
              <span className="text-[#1C1D1F]">0.62</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">Median:</span>
              <span className="text-[#1C1D1F]">0.60</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">High confidence (&gt;70%):</span>
              <span className="text-[#1C1D1F]">221 (37.1%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Moderate (&gt;50%):</span>
              <span className="text-[#1C1D1F]">378 (63.4%)</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <h3 className="text-[#1C1D1F] mb-4">Known vs Imputed SDG Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sdgComparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="sdg" stroke="#6B7280" />
            <YAxis stroke="#6B7280" label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: '#6B7280' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
              labelStyle={{ color: '#1C1D1F' }}
            />
            <Legend />
            <Bar dataKey="known" fill="#4169E1" name="Known SDG %" />
            <Bar dataKey="imputed" fill="#93C5FD" name="Imputed SDG %" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </section>
  );
}