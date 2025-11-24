import { useState } from 'react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Zap, RefreshCw, TrendingDown, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

export function WhatIfSimulator() {
  const [revenue, setRevenue] = useState([2890]);
  const [envScore, setEnvScore] = useState([68]);
  const [govScore, setGovScore] = useState([72]);
  const [renewableActivity, setRenewableActivity] = useState(false);
  const [removeHarmful, setRemoveHarmful] = useState(false);

  // Calculate simulated emissions based on inputs
  const calculateEmissions = () => {
    const baseScope1 = 1247;
    const baseScope2 = 892;

    // Revenue impact (higher revenue = more emissions)
    const revenueMultiplier = revenue[0] / 2890;
    
    // Environmental score impact (higher score = lower emissions)
    const envImpact = 1 - ((envScore[0] - 68) / 100) * 0.5;
    
    // Governance impact
    const govImpact = 1 - ((govScore[0] - 72) / 100) * 0.3;
    
    // Activity toggles
    const renewableReduction = renewableActivity ? 0.15 : 0;
    const harmfulReduction = removeHarmful ? 0.12 : 0;

    const scope1 = Math.round(baseScope1 * revenueMultiplier * envImpact * govImpact * (1 - renewableReduction - harmfulReduction));
    const scope2 = Math.round(baseScope2 * revenueMultiplier * envImpact * govImpact * (1 - renewableReduction - harmfulReduction));

    return { scope1, scope2 };
  };

  const simulated = calculateEmissions();
  const original = { scope1: 1247, scope2: 892 };

  const comparisonData = [
    {
      category: 'Scope 1',
      original: original.scope1,
      simulated: simulated.scope1,
    },
    {
      category: 'Scope 2',
      original: original.scope2,
      simulated: simulated.scope2,
    },
    {
      category: 'Total',
      original: original.scope1 + original.scope2,
      simulated: simulated.scope1 + simulated.scope2,
    },
  ];

  const totalReduction = ((original.scope1 + original.scope2) - (simulated.scope1 + simulated.scope2)) / (original.scope1 + original.scope2) * 100;

  const handleReset = () => {
    setRevenue([2890]);
    setEnvScore([68]);
    setGovScore([72]);
    setRenewableActivity(false);
    setRemoveHarmful(false);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Zap className="w-8 h-8 text-white" />
            <h2 className="text-white text-2xl" style={{ fontWeight: 700 }}>What-If Simulator</h2>
          </div>
          <p className="text-[#B3B3B3]" style={{ fontWeight: 300 }}>
            Adjust parameters to simulate emission impact scenarios
          </p>
        </div>
        <Button 
          onClick={handleReset}
          variant="outline" 
          className="border-[#2E2E2E] text-white hover:bg-[#2E2E2E]"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Controls */}
        <div className="space-y-6">
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
            <h3 className="text-white mb-6" style={{ fontWeight: 700 }}>Adjustable Parameters</h3>
            
            <div className="space-y-8">
              {/* Revenue Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white" style={{ fontWeight: 600 }}>Annual Revenue</Label>
                  <span className="text-[#B3B3B3]">€{revenue[0].toLocaleString()}M</span>
                </div>
                <Slider
                  value={revenue}
                  onValueChange={setRevenue}
                  min={1000}
                  max={5000}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-[#6E6E6E]">
                  <span>€1,000M</span>
                  <span>€5,000M</span>
                </div>
              </div>

              {/* Environmental Score Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white" style={{ fontWeight: 600 }}>Environmental Score</Label>
                  <span className="text-[#B3B3B3]">{envScore[0]}/100</span>
                </div>
                <Slider
                  value={envScore}
                  onValueChange={setEnvScore}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-[#6E6E6E]">
                  <span>Poor (0)</span>
                  <span>Excellent (100)</span>
                </div>
              </div>

              {/* Governance Score Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white" style={{ fontWeight: 600 }}>Governance Score</Label>
                  <span className="text-[#B3B3B3]">{govScore[0]}/100</span>
                </div>
                <Slider
                  value={govScore}
                  onValueChange={setGovScore}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-[#6E6E6E]">
                  <span>Weak (0)</span>
                  <span>Strong (100)</span>
                </div>
              </div>

              {/* Activity Toggles */}
              <div className="pt-4 border-t border-[#2E2E2E] space-y-4">
                <h4 className="text-white" style={{ fontWeight: 600 }}>Activity Adjustments</h4>
                
                <div className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#2E2E2E]">
                  <div className="flex-1">
                    <Label className="text-white" style={{ fontWeight: 600 }}>Add Renewable Activities</Label>
                    <p className="text-[#6E6E6E] text-sm mt-1" style={{ fontWeight: 300 }}>
                      +10% renewable energy sector exposure
                    </p>
                  </div>
                  <Switch 
                    checked={renewableActivity} 
                    onCheckedChange={setRenewableActivity}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#2E2E2E]">
                  <div className="flex-1">
                    <Label className="text-white" style={{ fontWeight: 600 }}>Remove Harmful Activities</Label>
                    <p className="text-[#6E6E6E] text-sm mt-1" style={{ fontWeight: 300 }}>
                      Eliminate high-emission operations
                    </p>
                  </div>
                  <Switch 
                    checked={removeHarmful} 
                    onCheckedChange={setRemoveHarmful}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="space-y-6">
          {/* Impact Summary */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingDown className="w-6 h-6 text-white" />
              <h3 className="text-white" style={{ fontWeight: 700 }}>Impact Summary</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#2E2E2E]">
                <p className="text-[#B3B3B3] text-sm mb-1" style={{ fontWeight: 500 }}>Original Total</p>
                <p className="text-white text-2xl" style={{ fontWeight: 700 }}>
                  {(original.scope1 + original.scope2).toLocaleString()}
                </p>
                <p className="text-[#6E6E6E] text-xs">tons CO₂e/year</p>
              </div>

              <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#2E2E2E]">
                <p className="text-[#B3B3B3] text-sm mb-1" style={{ fontWeight: 500 }}>Simulated Total</p>
                <p className="text-white text-2xl" style={{ fontWeight: 700 }}>
                  {(simulated.scope1 + simulated.scope2).toLocaleString()}
                </p>
                <p className="text-[#6E6E6E] text-xs">tons CO₂e/year</p>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${totalReduction > 0 ? 'bg-[#2E2E2E]' : 'bg-[#2E2E2E]'}`}>
              <div className="flex items-center justify-between">
                <p className="text-white" style={{ fontWeight: 600 }}>Net Change</p>
                <div className="flex items-center space-x-2">
                  <span className="text-white text-xl" style={{ fontWeight: 700 }}>
                    {totalReduction > 0 ? '-' : '+'}{Math.abs(totalReduction).toFixed(1)}%
                  </span>
                  {totalReduction > 0 ? (
                    <TrendingDown className="w-5 h-5 text-white" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
            <h3 className="text-white mb-6" style={{ fontWeight: 700 }}>Original vs Simulated</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
                <XAxis dataKey="category" stroke="#B3B3B3" />
                <YAxis stroke="#B3B3B3" label={{ value: 'Emissions (tons CO₂e)', angle: -90, position: 'insideLeft', fill: '#B3B3B3' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: '1px solid #2E2E2E',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
                <Legend />
                <Bar dataKey="original" fill="#6E6E6E" radius={[8, 8, 0, 0]} name="Original" />
                <Bar dataKey="simulated" fill="#FFFFFF" radius={[8, 8, 0, 0]} name="Simulated" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl p-6 border border-[#E0E0E0]">
            <h3 className="text-black mb-4" style={{ fontWeight: 700 }}>Scenario Analysis</h3>
            <div className="space-y-3 text-black" style={{ fontWeight: 400, lineHeight: '1.7' }}>
              {totalReduction > 0 ? (
                <>
                  <p>
                    Your simulated scenario achieves a <span style={{ fontWeight: 700 }}>{totalReduction.toFixed(1)}% reduction</span> in 
                    total emissions compared to the original prediction.
                  </p>
                  <p>
                    This translates to approximately <span style={{ fontWeight: 700 }}>
                    {((original.scope1 + original.scope2) - (simulated.scope1 + simulated.scope2)).toFixed(0)} tons CO₂e</span> saved 
                    annually, equivalent to removing {Math.round(((original.scope1 + original.scope2) - (simulated.scope1 + simulated.scope2)) / 4.6)} 
                    cars from the road for a year.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Your simulated scenario results in a <span style={{ fontWeight: 700 }}>{Math.abs(totalReduction).toFixed(1)}% increase</span> in 
                    total emissions. Consider adjusting parameters to achieve emission reductions.
                  </p>
                  <p>
                    Try increasing the environmental score, enabling renewable activities, or reducing harmful operations to see positive impact.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
