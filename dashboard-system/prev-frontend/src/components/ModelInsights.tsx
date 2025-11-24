import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Brain, TrendingUp, Activity, AlertCircle } from 'lucide-react';

const featureImportanceData = [
  { feature: 'Revenue', importance: 95, fill: '#FFFFFF' },
  { feature: 'Environmental Score', importance: 88, fill: '#B3B3B3' },
  { feature: 'NACE Sector Mix', importance: 76, fill: '#6E6E6E' },
  { feature: 'Regional Factor', importance: 64, fill: '#2E2E2E' },
  { feature: 'Governance Score', importance: 52, fill: '#1A1A1A' },
  { feature: 'Company Size', importance: 45, fill: '#0D0D0D' },
];

const correlationData = [
  { feature: 'Revenue', scope1: 0.87, scope2: 0.72 },
  { feature: 'Env Score', scope1: -0.65, scope2: -0.58 },
  { feature: 'NACE', scope1: 0.54, scope2: 0.61 },
  { feature: 'Region', scope1: 0.42, scope2: 0.38 },
  { feature: 'Governance', scope1: -0.38, scope2: -0.44 },
];

const shapData = [
  { feature: 'Low Revenue', impact: -120 },
  { feature: 'High Env Score', impact: -85 },
  { feature: 'Med Revenue', impact: 45 },
  { feature: 'Manufacturing', impact: 130 },
  { feature: 'High Revenue', impact: 185 },
];

const residualsData = [
  { bin: '-200', count: 12 },
  { bin: '-150', count: 28 },
  { bin: '-100', count: 45 },
  { bin: '-50', count: 89 },
  { bin: '0', count: 134 },
  { bin: '50', count: 92 },
  { bin: '100', count: 48 },
  { bin: '150', count: 31 },
  { bin: '200', count: 15 },
];

export function ModelInsights() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>Model Insights</h2>
        <p className="text-[#B3B3B3]" style={{ fontWeight: 300 }}>
          Deep dive into model performance, feature importance, and explainability
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-5 h-5 text-[#B3B3B3]" />
            <span className="text-xs text-[#6E6E6E]">Scope 1</span>
          </div>
          <p className="text-[#B3B3B3] text-sm mb-1" style={{ fontWeight: 500 }}>RMSE</p>
          <p className="text-white text-3xl" style={{ fontWeight: 700 }}>128.4</p>
          <p className="text-[#6E6E6E] text-xs mt-1">tons CO₂e</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-5 h-5 text-[#B3B3B3]" />
            <span className="text-xs text-[#6E6E6E]">Scope 2</span>
          </div>
          <p className="text-[#B3B3B3] text-sm mb-1" style={{ fontWeight: 500 }}>RMSE</p>
          <p className="text-white text-3xl" style={{ fontWeight: 700 }}>94.7</p>
          <p className="text-[#6E6E6E] text-xs mt-1">tons CO₂e</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-5 h-5 text-[#B3B3B3]" />
            <span className="text-xs text-[#6E6E6E]">Overall</span>
          </div>
          <p className="text-[#B3B3B3] text-sm mb-1" style={{ fontWeight: 500 }}>R² Score</p>
          <p className="text-white text-3xl" style={{ fontWeight: 700 }}>0.89</p>
          <p className="text-[#6E6E6E] text-xs mt-1">excellent fit</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-5 h-5 text-[#B3B3B3]" />
            <span className="text-xs text-[#6E6E6E]">Training</span>
          </div>
          <p className="text-[#B3B3B3] text-sm mb-1" style={{ fontWeight: 500 }}>MAE</p>
          <p className="text-white text-3xl" style={{ fontWeight: 700 }}>86.2</p>
          <p className="text-[#6E6E6E] text-xs mt-1">mean abs error</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feature Importance */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
          <div className="mb-6">
            <h3 className="text-white mb-1" style={{ fontWeight: 700 }}>Feature Importance</h3>
            <p className="text-[#6E6E6E] text-sm" style={{ fontWeight: 300 }}>
              Relative impact on emission predictions
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureImportanceData} layout="vertical" margin={{ left: 120, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
              <XAxis type="number" stroke="#B3B3B3" />
              <YAxis dataKey="feature" type="category" stroke="#B3B3B3" width={110} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid #2E2E2E',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Bar dataKey="importance" radius={[0, 8, 8, 0]}>
                {featureImportanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Correlation Heatmap */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
          <div className="mb-6">
            <h3 className="text-white mb-1" style={{ fontWeight: 700 }}>Feature Correlations</h3>
            <p className="text-[#6E6E6E] text-sm" style={{ fontWeight: 300 }}>
              Correlation with emission targets
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={correlationData} margin={{ left: 80, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
              <XAxis dataKey="feature" stroke="#B3B3B3" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#B3B3B3" domain={[-1, 1]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid #2E2E2E',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Bar dataKey="scope1" fill="#FFFFFF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="scope2" fill="#6E6E6E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-white rounded"></div>
              <span className="text-[#B3B3B3] text-sm">Scope 1</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#6E6E6E] rounded"></div>
              <span className="text-[#B3B3B3] text-sm">Scope 2</span>
            </div>
          </div>
        </div>
      </div>

      {/* SHAP Explainability */}
      <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-[#B3B3B3]" />
            <h3 className="text-white" style={{ fontWeight: 700 }}>SHAP Feature Impact Analysis</h3>
          </div>
          <p className="text-[#6E6E6E] text-sm" style={{ fontWeight: 300 }}>
            Waterfall visualization showing how features contribute to predictions
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shapData} layout="vertical" margin={{ left: 120, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
              <XAxis type="number" stroke="#B3B3B3" label={{ value: 'Impact on Emissions', position: 'insideBottom', offset: -5, fill: '#B3B3B3' }} />
              <YAxis dataKey="feature" type="category" stroke="#B3B3B3" width={110} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid #2E2E2E',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Bar dataKey="impact" radius={[0, 8, 8, 0]}>
                {shapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#FFFFFF' : '#6E6E6E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Residuals Distribution */}
          <div>
            <h4 className="text-white mb-4" style={{ fontWeight: 600 }}>Residuals Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={residualsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
                <XAxis dataKey="bin" stroke="#B3B3B3" label={{ value: 'Residuals', position: 'insideBottom', offset: -5, fill: '#B3B3B3' }} />
                <YAxis stroke="#B3B3B3" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: '1px solid #2E2E2E',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="#FFFFFF" fill="#6E6E6E" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Explanation Text */}
      <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
        <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>Model Interpretation Summary</h3>
        <div className="space-y-3 text-[#B3B3B3]" style={{ fontWeight: 400, lineHeight: '1.8' }}>
          <p>
            <span className="text-white" style={{ fontWeight: 600 }}>Revenue</span> emerges as the strongest predictor with 95% importance, 
            showing a strong positive correlation (0.87) with Scope 1 emissions. This indicates that larger companies with higher revenues 
            typically have greater direct emissions from owned or controlled sources.
          </p>
          <p>
            <span className="text-white" style={{ fontWeight: 600 }}>Environmental Score</span> demonstrates significant negative correlation 
            (-0.65 for Scope 1, -0.58 for Scope 2), suggesting that companies with better environmental practices achieve measurably lower 
            emission levels across both scopes.
          </p>
          <p>
            The model achieves an <span className="text-white" style={{ fontWeight: 600 }}>R² of 0.89</span>, indicating excellent 
            predictive power. Residuals follow a near-normal distribution centered around zero, validating model assumptions and reliability.
          </p>
        </div>
      </div>
    </div>
  );
}
