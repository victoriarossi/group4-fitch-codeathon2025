import { useState } from "react";
import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Building2, DollarSign, Lightbulb, Search } from "lucide-react";
import { Input } from "./ui/input";
import type { FilterState } from "../App";

type Emitter = {
  entityId: string;
  region: string;
  sector: string;
  scope1: number;
  scope2: number;
  total: number;
  revenue: number;
};

const emittersData: Emitter[] = [
  { entityId: "ENT-8234", region: "Europe", sector: "Energy", scope1: 524800, scope2: 318500, total: 843300, revenue: 2500000 },
  { entityId: "ENT-5621", region: "North America", sector: "Manufacturing", scope1: 412600, scope2: 289400, total: 702000, revenue: 1850000 },
  { entityId: "ENT-9012", region: "Asia", sector: "Transportation", scope1: 389200, scope2: 245800, total: 635000, revenue: 1200000 },
  { entityId: "ENT-3456", region: "Europe", sector: "Mining", scope1: 356700, scope2: 198300, total: 555000, revenue: 980000 },
  { entityId: "ENT-7823", region: "North America", sector: "Energy", scope1: 298500, scope2: 256200, total: 554700, revenue: 2100000 },
  { entityId: "ENT-2109", region: "Asia", sector: "Manufacturing", scope1: 287300, scope2: 234100, total: 521400, revenue: 1650000 },
  { entityId: "ENT-4567", region: "Europe", sector: "Utilities", scope1: 265400, scope2: 189700, total: 455100, revenue: 890000 },
  { entityId: "ENT-6789", region: "Africa", sector: "Mining", scope1: 245900, scope2: 167200, total: 413100, revenue: 720000 },
  { entityId: "ENT-1234", region: "North America", sector: "Transportation", scope1: 234600, scope2: 178400, total: 413000, revenue: 1100000 },
  { entityId: "ENT-8901", region: "South America", sector: "Agriculture", scope1: 212300, scope2: 145800, total: 358100, revenue: 650000 },
];

const featureImportanceData = [
  { feature: "Sector PCA 1", importance: 0.185 },
  { feature: "Environmental Activities", importance: 0.162 },
  { feature: "Region Code", importance: 0.148 },
  { feature: "Revenue Scale", importance: 0.135 },
  { feature: "ESG Environmental", importance: 0.112 },
  { feature: "SDG Embedding 1", importance: 0.098 },
  { feature: "Sector PCA 2", importance: 0.087 },
  { feature: "Country Code", importance: 0.073 },
  { feature: "ESG Social", importance: 0.058 },
  { feature: "ESG Governance", importance: 0.042 },
];

type TopEmittersProps = {
  filters: FilterState;
};

export function TopEmitters({ filters }: TopEmittersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter data based on filters and search
  const filteredEmitters = emittersData.filter(emitter => {
    const matchesRegion = filters.region === "All" || emitter.region === filters.region;
    const matchesSector = filters.sector === "All" || emitter.sector === filters.sector;
    const matchesSearch = emitter.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emitter.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emitter.sector.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSector && matchesSearch;
  });

  // Calculate carbon intensity
  const carbonIntensityData = filteredEmitters.map(emitter => ({
    ...emitter,
    intensity: (emitter.total / emitter.revenue * 1000).toFixed(2)
  })).sort((a, b) => parseFloat(a.intensity) - parseFloat(b.intensity)).slice(0, 10);

  return (
    <section>
      <h2 className="text-[#1C1D1F] mb-4">Top Emitters & Interpretability</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[#1C1D1F] mb-1">Top Predicted Emitters</h3>
              <p className="text-[#6B7280]">Highest total emissions (Scope 1 + 2)</p>
            </div>
            <Building2 className="size-5 text-[#4169E1]" />
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-[#6B7280]" />
              <Input
                type="text"
                placeholder="Search by Entity ID, Region, or Sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#E5E7EB] text-[#1C1D1F]"
              />
            </div>
          </div>

          <div className="overflow-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow className="border-[#E5E7EB]">
                  <TableHead className="text-[#1C1D1F]">Entity ID</TableHead>
                  <TableHead className="text-[#1C1D1F]">Region</TableHead>
                  <TableHead className="text-[#1C1D1F] text-right">Scope 1</TableHead>
                  <TableHead className="text-[#1C1D1F] text-right">Scope 2</TableHead>
                  <TableHead className="text-[#1C1D1F] text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmitters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-[#6B7280] py-8">
                      No results found. Try adjusting your filters or search term.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmitters.slice(0, 10).map((emitter, idx) => (
                    <TableRow 
                      key={emitter.entityId} 
                      className="border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                    >
                      <TableCell className="text-[#1C1D1F]">{emitter.entityId}</TableCell>
                      <TableCell className="text-[#6B7280]">{emitter.region}</TableCell>
                      <TableCell className="text-[#1C1D1F] text-right">{emitter.scope1.toLocaleString()}</TableCell>
                      <TableCell className="text-[#1C1D1F] text-right">{emitter.scope2.toLocaleString()}</TableCell>
                      <TableCell className="text-[#4169E1] text-right">{emitter.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[#1C1D1F] mb-1">Carbon Intensity Leaders</h3>
              <p className="text-[#6B7280]">Lowest emissions per revenue (kg CO₂e/$1000)</p>
            </div>
            <DollarSign className="size-5 text-[#4169E1]" />
          </div>

          <div className="overflow-auto max-h-[488px]">
            <Table>
              <TableHeader>
                <TableRow className="border-[#E5E7EB]">
                  <TableHead className="text-[#1C1D1F]">Entity ID</TableHead>
                  <TableHead className="text-[#1C1D1F]">Sector</TableHead>
                  <TableHead className="text-[#1C1D1F] text-right">Total Emissions</TableHead>
                  <TableHead className="text-[#1C1D1F] text-right">Intensity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carbonIntensityData.map((emitter) => (
                  <TableRow 
                    key={emitter.entityId}
                    className="border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                  >
                    <TableCell className="text-[#1C1D1F]">{emitter.entityId}</TableCell>
                    <TableCell className="text-[#6B7280]">{emitter.sector}</TableCell>
                    <TableCell className="text-[#1C1D1F] text-right">{emitter.total.toLocaleString()}</TableCell>
                    <TableCell className="text-[#4169E1] text-right">{emitter.intensity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[#1C1D1F] mb-1">Feature Importance</h3>
              <p className="text-[#6B7280]">Top 10 predictive features</p>
            </div>
            <Lightbulb className="size-5 text-[#4169E1]" />
          </div>
          
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={featureImportanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis dataKey="feature" type="category" stroke="#6B7280" width={150} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
                labelStyle={{ color: '#1C1D1F' }}
              />
              <Bar dataKey="importance" fill="#93C5FD" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-[#1C1D1F]">Interpretability Notes</h3>
            <Lightbulb className="size-5 text-[#4169E1]" />
          </div>
          
          <div className="space-y-4 text-[#6B7280]">
            <p>
              Model interpretability analysis shows that <span className="text-[#1C1D1F]">sector PCA signals</span>, 
              <span className="text-[#1C1D1F]"> environmental activities</span>, 
              <span className="text-[#1C1D1F]"> region_code</span>, and 
              <span className="text-[#1C1D1F]"> revenue scale</span> were among the most influential predictors.
            </p>
            
            <div className="pt-4 border-t border-[#F3F4F6]">
              <h4 className="text-[#1C1D1F] mb-2">Key Insights:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-[#4169E1] mr-2">•</span>
                  <span>Sector-based patterns account for ~18.5% of variance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#4169E1] mr-2">•</span>
                  <span>Environmental activity data improves predictions by ~16%</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#4169E1] mr-2">•</span>
                  <span>Geographic location remains a strong signal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#4169E1] mr-2">•</span>
                  <span>ESG scores provide meaningful predictive value</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
