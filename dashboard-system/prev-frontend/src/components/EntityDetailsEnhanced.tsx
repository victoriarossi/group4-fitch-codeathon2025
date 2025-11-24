import { Building2, MapPin, Globe, TrendingUp, Award, ArrowUpRight } from 'lucide-react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const influencingFeatures = [
  { feature: 'High Revenue', impact: 88, description: 'Large revenue base (€2.8B) correlates with higher operational emissions' },
  { feature: 'Manufacturing Sector', impact: 76, description: 'High proportion (45%) in emission-intensive manufacturing' },
  { feature: 'Environmental Score', impact: 62, description: 'Moderate score (68/100) indicates efficiency improvement potential' },
  { feature: 'Regional Factor', impact: 54, description: 'Western EU location with moderate regulatory frameworks' },
  { feature: 'Governance Practices', impact: 42, description: 'Good governance score (72) helps mitigate emissions' },
];

const sectorMix = [
  { sector: 'Manufacturing', value: 45, fill: '#FFFFFF' },
  { sector: 'Energy', value: 25, fill: '#AFAFAF' },
  { sector: 'Transport', value: 15, fill: '#4E4E4E' },
  { sector: 'Services', value: 10, fill: '#2A2A2A' },
  { sector: 'Other', value: 5, fill: '#1A1A1A' },
];

const benchmarkData = [
  { metric: 'Scope 1', entity: 1247, sector: 980, region: 1120, global: 1050 },
  { metric: 'Scope 2', entity: 892, sector: 720, region: 810, global: 780 },
];

const radarData = [
  { subject: 'Revenue', entity: 85, peer: 70 },
  { subject: 'Env Score', entity: 68, peer: 75 },
  { subject: 'Governance', entity: 72, peer: 68 },
  { subject: 'Efficiency', entity: 62, peer: 70 },
  { subject: 'Compliance', entity: 78, peer: 72 },
];

export function EntityDetailsEnhanced() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Building2 className="w-8 h-8 text-white" />
            <h1 className="text-white text-3xl" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              Entity ENT-004
            </h1>
            <Badge className="bg-white text-black border-none" style={{ fontWeight: 600 }}>
              Active
            </Badge>
          </div>
          <p className="text-[#AFAFAF]" style={{ fontWeight: 300 }}>
            Comprehensive emissions analysis and benchmarking
          </p>
        </div>
        <Button className="bg-white text-black hover:bg-[#AFAFAF] rounded-xl h-11" style={{ fontWeight: 600 }}>
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Summary */}
        <div className="space-y-6">
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A]">
            <h3 className="text-white mb-6 text-lg" style={{ fontWeight: 700 }}>
              Company Profile
            </h3>
            
            <div className="space-y-5">
              <div>
                <p className="text-[#AFAFAF] text-xs mb-1" style={{ fontWeight: 500 }}>ENTITY ID</p>
                <p className="text-white text-lg" style={{ fontWeight: 700 }}>ENT-004</p>
              </div>

              <div>
                <p className="text-[#AFAFAF] text-xs mb-1" style={{ fontWeight: 500 }}>REGION</p>
                <p className="text-white" style={{ fontWeight: 600 }}>Western Europe</p>
              </div>

              <div>
                <p className="text-[#AFAFAF] text-xs mb-1" style={{ fontWeight: 500 }}>COUNTRY</p>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-[#AFAFAF]" />
                  <p className="text-white" style={{ fontWeight: 600 }}>France</p>
                </div>
              </div>

              <div>
                <p className="text-[#AFAFAF] text-xs mb-1" style={{ fontWeight: 500 }}>ANNUAL REVENUE</p>
                <p className="text-white text-2xl" style={{ fontWeight: 700 }}>€2,890M</p>
              </div>

              <div>
                <p className="text-[#AFAFAF] text-xs mb-2" style={{ fontWeight: 500 }}>ENVIRONMENTAL SCORE</p>
                <div className="space-y-2">
                  <Progress value={68} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-white text-xl" style={{ fontWeight: 700 }}>68</span>
                    <span className="text-[#4E4E4E] text-sm" style={{ fontWeight: 300 }}>out of 100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sector Exposure */}
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A]">
            <h3 className="text-white mb-6 text-lg" style={{ fontWeight: 700 }}>
              Sector Exposure
            </h3>
            <ResponsiveContainer width="100%" height={180}>
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
                    border: '1px solid #2A2A2A',
                    borderRadius: '12px',
                    color: '#FFFFFF'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-4">
              {sectorMix.map((item) => (
                <div key={item.sector} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-[#AFAFAF] text-sm" style={{ fontWeight: 500 }}>{item.sector}</span>
                  </div>
                  <span className="text-white" style={{ fontWeight: 700 }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Predictions */}
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A]">
            <h3 className="text-white mb-6 text-xl" style={{ fontWeight: 700 }}>
              Emission Predictions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0D0D0D] rounded-xl p-6 border border-[#2A2A2A]">
                <p className="text-[#AFAFAF] text-xs mb-3" style={{ fontWeight: 500 }}>SCOPE 1 EMISSIONS</p>
                <p className="text-white text-4xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>1,247</p>
                <p className="text-[#4E4E4E] text-sm" style={{ fontWeight: 300 }}>tons CO₂e/year</p>
              </div>

              <div className="bg-[#0D0D0D] rounded-xl p-6 border border-[#2A2A2A]">
                <p className="text-[#AFAFAF] text-xs mb-3" style={{ fontWeight: 500 }}>SCOPE 2 EMISSIONS</p>
                <p className="text-white text-4xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>892</p>
                <p className="text-[#4E4E4E] text-sm" style={{ fontWeight: 300 }}>tons CO₂e/year</p>
              </div>

              <div className="bg-[#0D0D0D] rounded-xl p-6 border border-[#2A2A2A]">
                <p className="text-[#AFAFAF] text-xs mb-3" style={{ fontWeight: 500 }}>CONFIDENCE</p>
                <div className="mb-2">
                  <Progress value={92} className="h-3" />
                </div>
                <p className="text-white text-2xl" style={{ fontWeight: 700 }}>92%</p>
              </div>
            </div>
          </div>

          {/* Benchmark Comparison */}
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A]">
            <h3 className="text-white mb-6 text-xl" style={{ fontWeight: 700 }}>
              Benchmark Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="metric" stroke="#AFAFAF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#AFAFAF" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: '1px solid #2A2A2A',
                    borderRadius: '12px',
                    color: '#FFFFFF'
                  }}
                />
                <Bar dataKey="entity" fill="#FFFFFF" radius={[8, 8, 0, 0]} name="This Entity" />
                <Bar dataKey="sector" fill="#AFAFAF" radius={[8, 8, 0, 0]} name="Sector Median" />
                <Bar dataKey="region" fill="#4E4E4E" radius={[8, 8, 0, 0]} name="Region Median" />
                <Bar dataKey="global" fill="#2A2A2A" radius={[8, 8, 0, 0]} name="Global Median" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Peer Comparison Radar */}
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A]">
            <h3 className="text-white mb-6 text-xl" style={{ fontWeight: 700 }}>
              Peer Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2A2A2A" />
                <PolarAngleAxis dataKey="subject" stroke="#AFAFAF" style={{ fontSize: '12px' }} />
                <Radar name="This Entity" dataKey="entity" stroke="#FFFFFF" fill="#FFFFFF" fillOpacity={0.3} />
                <Radar name="Peer Average" dataKey="peer" stroke="#4E4E4E" fill="#4E4E4E" fillOpacity={0.3} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: '1px solid #2A2A2A',
                    borderRadius: '12px',
                    color: '#FFFFFF'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Influencing Features */}
          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A]">
            <h3 className="text-white mb-6 text-xl" style={{ fontWeight: 700 }}>
              Top Influencing Factors
            </h3>
            
            <div className="space-y-5">
              {influencingFeatures.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-white" style={{ fontWeight: 600 }}>{item.feature}</p>
                    <span className="text-[#AFAFAF]" style={{ fontWeight: 600 }}>{item.impact}%</span>
                  </div>
                  <Progress value={item.impact} className="h-2" />
                  <p className="text-[#AFAFAF] text-sm" style={{ fontWeight: 300 }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Narrative */}
          <div className="bg-white rounded-2xl p-8">
            <h3 className="text-black mb-4 text-xl" style={{ fontWeight: 700 }}>
              AI-Generated Analysis
            </h3>
            <div className="space-y-4 text-black" style={{ fontWeight: 400, lineHeight: '1.8' }}>
              <p>
                Entity ENT-004 demonstrates <span style={{ fontWeight: 700 }}>above-median emissions</span> for its sector, 
                with predicted annual totals of <span style={{ fontWeight: 700 }}>2,139 tons CO₂e</span>.
              </p>
              <p>
                The primary driver is <span style={{ fontWeight: 700 }}>substantial revenue scale (€2.89B)</span>, which strongly 
                correlates with operational footprint and energy consumption. Additionally, the <span style={{ fontWeight: 700 }}>
                heavy manufacturing exposure (45%)</span> significantly amplifies emissions due to production intensity.
              </p>
              <p>
                <span style={{ fontWeight: 700 }}>Strategic Recommendation:</span> Improving the environmental score from 68 to 
                85+ could yield a <span style={{ fontWeight: 700 }}>15-22% reduction</span> in total emissions. Priority areas 
                include renewable energy procurement, manufacturing process optimization, and enhanced environmental governance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
