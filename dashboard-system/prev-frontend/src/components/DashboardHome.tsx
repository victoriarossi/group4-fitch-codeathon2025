import { Building2, TrendingUp, Globe, Factory, Leaf, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Treemap } from 'recharts';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface DashboardHomeProps {
  onNavigateToExplorer: () => void;
  onNavigateToEntity: () => void;
}

const scatterData = [
  { revenue: 1200, emissions: 450, name: 'ENT-001', id: 'ent1' },
  { revenue: 2400, emissions: 780, name: 'ENT-002', id: 'ent2' },
  { revenue: 1800, emissions: 520, name: 'ENT-003', id: 'ent3' },
  { revenue: 3200, emissions: 950, name: 'ENT-004', id: 'ent4' },
  { revenue: 2800, emissions: 840, name: 'ENT-005', id: 'ent5' },
  { revenue: 1500, emissions: 490, name: 'ENT-006', id: 'ent6' },
  { revenue: 3800, emissions: 1100, name: 'ENT-007', id: 'ent7' },
  { revenue: 2100, emissions: 680, name: 'ENT-008', id: 'ent8' },
];

const treemapData = [
  { name: 'Manufacturing', size: 3200, fill: '#1D1D1F' },
  { name: 'Energy', size: 2800, fill: '#515154' },
  { name: 'Transport', size: 2100, fill: '#86868B' },
  { name: 'Construction', size: 1800, fill: '#B0B0B5' },
  { name: 'Services', size: 1400, fill: '#D1D1D6' },
];

const distributionData = [
  { range: '0-500', count: 124 },
  { range: '500-1000', count: 245 },
  { range: '1000-1500', count: 189 },
  { range: '1500-2000', count: 142 },
  { range: '2000+', count: 87 },
];

const latestPredictions = [
  { id: 'ENT-004', country: 'France', scope1: 1247, scope2: 892, status: 'high' },
  { id: 'ENT-007', country: 'Germany', scope1: 1089, scope2: 756, status: 'medium' },
  { id: 'ENT-012', country: 'Spain', scope1: 945, scope2: 623, status: 'medium' },
];

const anomalies = [
  { id: 'ENT-018', issue: 'Emissions 2.5σ above sector median', severity: 'high' },
  { id: 'ENT-024', issue: 'Low env score but low emissions detected', severity: 'medium' },
];

export function DashboardHome({ onNavigateToExplorer, onNavigateToEntity }: DashboardHomeProps) {
  return (
    <div className="p-8 space-y-8 max-w-[1900px] mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1D1D1F] text-3xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>
            Mission Control
          </h1>
          <p className="text-[#86868B] text-base" style={{ fontWeight: 400 }}>
            Real-time emissions intelligence and analytics overview
          </p>
        </div>
        <Button 
          onClick={onNavigateToExplorer}
          className="h-11 px-6 rounded-2xl text-white shadow-lg hover:shadow-xl"
          style={{ 
            background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
          }}
        >
          View Entity Explorer
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Top-Level Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {[
          { icon: Building2, label: 'Companies', value: '10,247', subtitle: 'Analyzed', gradient: 'from-blue-500 to-blue-600' },
          { icon: TrendingUp, label: 'Avg Scope 1', value: '1,124', subtitle: 'tons CO₂e/year', gradient: 'from-purple-500 to-purple-600' },
          { icon: TrendingUp, label: 'Avg Scope 2', value: '798', subtitle: 'tons CO₂e/year', gradient: 'from-pink-500 to-pink-600' },
          { icon: Factory, label: 'Top Sector', value: 'Manufacturing', subtitle: '32% of entities', gradient: 'from-orange-500 to-orange-600' },
          { icon: Leaf, label: 'Env Score', value: '68.5', subtitle: 'Average /100', gradient: 'from-green-500 to-green-600' },
          { icon: Globe, label: 'Countries', value: '42', subtitle: 'Represented', gradient: 'from-indigo-500 to-indigo-600' },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div 
              key={index}
              className="group backdrop-blur-xl bg-white/60 rounded-3xl p-6 border border-black/5 hover:bg-white/80 hover:shadow-lg cursor-pointer"
              style={{ 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  className={`bg-gradient-to-br ${metric.gradient}`}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-[#86868B] text-xs uppercase mb-2" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                {metric.label}
              </p>
              <p className="text-[#1D1D1F] text-2xl mb-1" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                {metric.value}
              </p>
              <p className="text-[#86868B] text-xs" style={{ fontWeight: 400 }}>
                {metric.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Emissions Scatter */}
        <div className="lg:col-span-2 backdrop-blur-xl bg-white/60 rounded-3xl p-8 border border-black/5 shadow-md hover:shadow-lg transition-all">
          <div className="mb-6">
            <h3 className="text-[#1D1D1F] text-xl mb-1" style={{ fontWeight: 600, letterSpacing: '-0.015em' }}>
              Revenue vs Emissions (Scope 1)
            </h3>
            <p className="text-[#86868B] text-sm" style={{ fontWeight: 400 }}>
              Click any point to view entity details
            </p>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.06)" />
              <XAxis 
                type="number" 
                dataKey="revenue" 
                name="Revenue (€M)"
                stroke="#86868B"
                style={{ fontSize: '12px', fontWeight: 500 }}
              />
              <YAxis 
                type="number" 
                dataKey="emissions" 
                name="Scope 1 (tCO₂e)"
                stroke="#86868B"
                style={{ fontSize: '12px', fontWeight: 500 }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}
                cursor={{ strokeDasharray: '3 3', stroke: '#86868B' }}
              />
              <Scatter 
                data={scatterData} 
                fill="#007AFF"
                onClick={(data) => {
                  if (data) {
                    onNavigateToEntity();
                  }
                }}
                style={{ cursor: 'pointer' }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Right Panel - Latest & Anomalies */}
        <div className="space-y-5">
          {/* Latest Predictions */}
          <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 border border-black/5 shadow-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#1D1D1F] text-base" style={{ fontWeight: 600 }}>
                Latest Predictions
              </h3>
              <Sparkles className="w-4 h-4 text-[#007AFF]" />
            </div>
            <div className="space-y-3">
              {latestPredictions.map((pred) => (
                <div 
                  key={pred.id}
                  className="p-4 backdrop-blur-lg bg-white/40 rounded-2xl hover:bg-white/70 transition-all cursor-pointer border border-black/5"
                  onClick={onNavigateToEntity}
                  style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#1D1D1F] text-sm" style={{ fontWeight: 600 }}>
                      {pred.id}
                    </span>
                    <Badge 
                      className={`text-xs rounded-full px-3 py-1 ${
                        pred.status === 'high' 
                          ? 'bg-red-100 text-red-600 border-red-200' 
                          : 'bg-orange-100 text-orange-600 border-orange-200'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {pred.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-[#86868B] text-xs mb-3" style={{ fontWeight: 500 }}>{pred.country}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#86868B]">S1: <span className="text-[#1D1D1F] font-semibold">{pred.scope1}</span></span>
                    <span className="text-[#86868B]">S2: <span className="text-[#1D1D1F] font-semibold">{pred.scope2}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anomalies */}
          <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 border border-black/5 shadow-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#1D1D1F] text-base" style={{ fontWeight: 600 }}>
                Detected Anomalies
              </h3>
              <AlertCircle className="w-4 h-4 text-[#FF9500]" />
            </div>
            <div className="space-y-3">
              {anomalies.map((anomaly) => (
                <div 
                  key={anomaly.id}
                  className="flex items-start space-x-3 p-4 bg-orange-50/80 backdrop-blur-lg rounded-2xl cursor-pointer hover:bg-orange-100/80 transition-all border border-orange-200/50"
                >
                  <AlertCircle className="w-4 h-4 text-[#FF9500] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[#1D1D1F] text-xs mb-1" style={{ fontWeight: 600 }}>
                      {anomaly.id}
                    </p>
                    <p className="text-[#86868B] text-xs" style={{ fontWeight: 400 }}>
                      {anomaly.issue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Exposure Treemap */}
        <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-8 border border-black/5 shadow-md">
          <div className="mb-6">
            <h3 className="text-[#1D1D1F] text-xl mb-1" style={{ fontWeight: 600, letterSpacing: '-0.015em' }}>
              Sector Exposure Distribution
            </h3>
            <p className="text-[#86868B] text-sm" style={{ fontWeight: 400 }}>
              Total emissions by industry sector
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <Treemap
              data={treemapData}
              dataKey="size"
              stroke="rgba(255, 255, 255, 0.95)"
              strokeWidth={3}
              content={({ x, y, width, height, name, size }) => (
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{ 
                      fill: treemapData.find(d => d.name === name)?.fill,
                      rx: 12,
                      ry: 12
                    }}
                  />
                  {width > 100 && height > 50 && (
                    <>
                      <text
                        x={x + width / 2}
                        y={y + height / 2 - 8}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize={15}
                        fontWeight={600}
                      >
                        {name}
                      </text>
                      <text
                        x={x + width / 2}
                        y={y + height / 2 + 12}
                        textAnchor="middle"
                        fill="rgba(255, 255, 255, 0.8)"
                        fontSize={13}
                        fontWeight={500}
                      >
                        {size} tCO₂e
                      </text>
                    </>
                  )}
                </g>
              )}
            />
          </ResponsiveContainer>
        </div>

        {/* Emissions Distribution */}
        <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-8 border border-black/5 shadow-md">
          <div className="mb-6">
            <h3 className="text-[#1D1D1F] text-xl mb-1" style={{ fontWeight: 600, letterSpacing: '-0.015em' }}>
              Emissions Distribution
            </h3>
            <p className="text-[#86868B] text-sm" style={{ fontWeight: 400 }}>
              Entity count by emission range
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.06)" />
              <XAxis 
                dataKey="range" 
                stroke="#86868B"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#86868B" 
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}
              />
              <Bar dataKey="count" fill="#007AFF" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
