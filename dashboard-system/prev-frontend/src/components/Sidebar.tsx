import { 
  LayoutDashboard, 
  Database, 
  Brain, 
  Building2, 
  Sliders, 
  MessageSquare, 
  FileText, 
  Upload,
  BarChart3 
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'home', label: 'Home Dashboard', icon: LayoutDashboard },
  { id: 'explorer', label: 'Entity Explorer', icon: Database },
  { id: 'entity', label: 'Entity Details', icon: Building2 },
  { id: 'predictions', label: 'Predictions', icon: Upload },
  { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
  { id: 'chatbot', label: 'AI Analyst', icon: MessageSquare },
  { id: 'insights', label: 'Model Insights', icon: BarChart3 },
  { id: 'exports', label: 'Reports', icon: FileText },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-72 backdrop-blur-xl bg-white/40 border-r border-black/5 min-h-[calc(100vh-81px)] relative">
      <nav className="p-5 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-sm ${
                isActive
                  ? 'bg-gradient-to-r from-[#007AFF] to-[#0051D5] text-white shadow-lg'
                  : 'text-[#1D1D1F] hover:bg-white/60 hover:shadow-sm'
              }`}
              style={{ 
                fontWeight: isActive ? 600 : 500,
                backdropFilter: isActive ? 'blur(20px)' : 'none',
                boxShadow: isActive ? '0 4px 12px rgba(0, 122, 255, 0.3)' : 'none'
              }}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="absolute bottom-8 left-5 right-5">
        <div 
          className="backdrop-blur-xl bg-white/60 rounded-2xl p-5 border border-black/5 shadow-md"
          style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <p className="text-[#86868B] text-xs mb-3 uppercase" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
            SYSTEM STATUS
          </p>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 rounded-full relative">
              <div className="absolute inset-0 bg-[#34C759] rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-[#34C759] w-2 h-2 rounded-full"></div>
            </div>
            <span className="text-[#1D1D1F] text-sm" style={{ fontWeight: 600 }}>
              All Systems Operational
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#86868B]">
            <span>10,247 entities</span>
            <span>•</span>
            <span>Last sync: 2m</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
