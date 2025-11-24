import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, trendValue }: KPICardProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E] hover:border-[#6E6E6E] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-[#2E2E2E] rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-[#2E2E2E]' : 'bg-[#2E2E2E]'
          }`}>
            <span className="text-white text-xs" style={{ fontWeight: 600 }}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-[#B3B3B3] text-sm" style={{ fontWeight: 500 }}>
          {title}
        </p>
        <p className="text-white text-3xl" style={{ fontWeight: 700 }}>
          {value}
        </p>
        {subtitle && (
          <p className="text-[#6E6E6E] text-xs" style={{ fontWeight: 300 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
