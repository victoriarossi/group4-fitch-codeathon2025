import { Building2, MapPin, Globe, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const influencingFeatures = [
  { feature: 'High Revenue (€2.8B)', impact: 88, description: 'Large revenue base contributes significantly to emission levels' },
  { feature: 'Manufacturing Sector (45%)', impact: 76, description: 'High proportion in emission-intensive manufacturing' },
  { feature: 'Environmental Score (68)', impact: 62, description: 'Moderate environmental practices leave room for improvement' },
  { feature: 'Regional Factor (Western EU)', impact: 54, description: 'Located in region with moderate emission regulations' },
  { feature: 'Governance Score (72)', impact: 42, description: 'Good governance practices help mitigate emissions' },
];

const sectorMix = [
  { sector: 'Manufacturing', value: 45, fill: '#FFFFFF' },
  { sector: 'Energy', value: 25, fill: '#B3B3B3' },
  { sector: 'Transport', value: 15, fill: '#6E6E6E' },
  { sector: 'Services', value: 10, fill: '#2E2E2E' },
  { sector: 'Other', value: 5, fill: '#1A1A1A' },
];

export function EntityDetails() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <Building2 className="w-8 h-8 text-white" />
          <h2 className="text-white text-2xl" style={{ fontWeight: 700 }}>Entity ENT-004</h2>
          <Badge className="bg-[#2E2E2E] text-white border-none">Active</Badge>
        </div>
        <p className="text-[#B3B3B3]" style={{ fontWeight: 300 }}>
          Detailed emission predictions and influencing factors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
            <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>Company Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Building2 className="w-5 h-5 text-[#B3B3B3] mt-1" />
                <div>
                  <p className="text-[#6E6E6E] text-sm" style={{ fontWeight: 500 }}>Entity ID</p>
                  <p className="text-white" style={{ fontWeight: 600 }}>ENT-004</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Globe className="w-5 h-5 text-[#B3B3B3] mt-1" />
                <div>
                  <p className="text-[#6E6E6E] text-sm" style={{ fontWeight: 500 }}>Region</p>
                  <p className="text-white" style={{ fontWeight: 600 }}>Western Europe</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#B3B3B3] mt-1" />
                <div>
                  <p className="text-[#6E6E6E] text-sm" style={{ fontWeight: 500 }}>Country</p>
                  <p className="text-white" style={{ fontWeight: 600 }}>France</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-[#B3B3B3] mt-1" />
                <div>
                  <p className="text-[#6E6E6E] text-sm" style={{ fontWeight: 500 }}>Annual Revenue</p>
                  <p className="text-white" style={{ fontWeight: 600 }}>€2,890 Million</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-[#B3B3B3] mt-1" />
                <div className="flex-1">
                  <p className="text-[#6E6E6E] text-sm mb-2" style={{ fontWeight: 500 }}>Environmental Score</p>
                  <div className="space-y-1">
                    <Progress value={68} className="h-2" />
                    <p className="text-white text-right" style={{ fontWeight: 600 }}>68/100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sector Exposure */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
            <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>Sector Exposure</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sectorMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sectorMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: '1px solid #2E2E2E',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {sectorMix.map((item) => (
                <div key={item.sector} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-[#B3B3B3]">{item.sector}</span>
                  </div>
                  <span className="text-white" style={{ fontWeight: 600 }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Predictions Panel */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
            <h3 className="text-white mb-6" style={{ fontWeight: 700 }}>Emission Predictions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0D0D0D] rounded-lg p-6 border border-[#2E2E2E]">
                <p className="text-[#B3B3B3] text-sm mb-2" style={{ fontWeight: 500 }}>Scope 1 Emissions</p>
                <p className="text-white text-4xl mb-1" style={{ fontWeight: 700 }}>1,247</p>
                <p className="text-[#6E6E6E] text-xs">tons CO₂e / year</p>
              </div>

              <div className="bg-[#0D0D0D] rounded-lg p-6 border border-[#2E2E2E]">
                <p className="text-[#B3B3B3] text-sm mb-2" style={{ fontWeight: 500 }}>Scope 2 Emissions</p>
                <p className="text-white text-4xl mb-1" style={{ fontWeight: 700 }}>892</p>
                <p className="text-[#6E6E6E] text-xs">tons CO₂e / year</p>
              </div>

              <div className="bg-[#0D0D0D] rounded-lg p-6 border border-[#2E2E2E]">
                <p className="text-[#B3B3B3] text-sm mb-2" style={{ fontWeight: 500 }}>Confidence Level</p>
                <div className="mb-2">
                  <Progress value={92} className="h-3" />
                </div>
                <p className="text-white text-2xl" style={{ fontWeight: 700 }}>92%</p>
              </div>
            </div>
          </div>

          {/* Top Influencing Features */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
            <h3 className="text-white mb-6" style={{ fontWeight: 700 }}>Top Influencing Features</h3>
            
            <div className="space-y-4">
              {influencingFeatures.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-white" style={{ fontWeight: 600 }}>{item.feature}</p>
                    <span className="text-[#B3B3B3] text-sm">{item.impact}%</span>
                  </div>
                  <Progress value={item.impact} className="h-2" />
                  <p className="text-[#6E6E6E] text-sm" style={{ fontWeight: 300 }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI-Generated Narrative */}
          <div className="bg-white rounded-xl p-6 border border-[#E0E0E0]">
            <h3 className="text-black mb-4" style={{ fontWeight: 700 }}>AI-Generated Insight</h3>
            <div className="space-y-3 text-black" style={{ fontWeight: 400, lineHeight: '1.8' }}>
              <p>
                Entity ENT-004 is predicted to emit <span style={{ fontWeight: 700 }}>1,247 tons of Scope 1 CO₂e</span> and 
                <span style={{ fontWeight: 700 }}> 892 tons of Scope 2 CO₂e</span> annually, placing it in the upper-mid range 
                among comparable entities in the dataset.
              </p>
              <p>
                The primary driver of these emissions is the company's <span style={{ fontWeight: 700 }}>substantial revenue base 
                (€2.89B)</span>, which correlates strongly with operational scale and energy consumption. The significant 
                <span style={{ fontWeight: 700 }}> manufacturing sector exposure (45%)</span> further amplifies emissions due to 
                the energy-intensive nature of production processes.
              </p>
              <p>
                <span style={{ fontWeight: 700 }}>Recommendation:</span> Improving the environmental score from 68 to 80+ could 
                potentially reduce total emissions by 15-20%. Focus areas should include renewable energy adoption, process 
                optimization in manufacturing operations, and enhanced governance frameworks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
