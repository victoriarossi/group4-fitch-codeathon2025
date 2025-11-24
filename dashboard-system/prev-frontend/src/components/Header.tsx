import { Bell, User, ChevronDown, Search, Activity } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-black/5" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}>
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center relative overflow-hidden" 
                 style={{ 
                   background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                   boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
                 }}>
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl text-[#1D1D1F]" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                ESG Sense
              </h1>
              <p className="text-xs text-[#86868B]" style={{ fontWeight: 400 }}>
                Emissions Intelligence
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#86868B] w-4 h-4" />
              <Input
                type="search"
                placeholder="Search entities, countries, sectors..."
                className="pl-11 h-11 bg-white/60 backdrop-blur-lg border-black/8 text-[#1D1D1F] placeholder:text-[#86868B] rounded-2xl text-sm focus:bg-white/80 focus:border-[#007AFF]/30 focus:ring-2 focus:ring-[#007AFF]/10 shadow-sm"
                style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button 
              className="relative p-2.5 hover:bg-black/5 rounded-xl transition-all"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              <Bell className="w-5 h-5 text-[#1D1D1F]" strokeWidth={2} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#007AFF] rounded-full ring-2 ring-white"></span>
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-3 px-3 py-2 hover:bg-black/5 rounded-xl transition-all">
                <Avatar className="w-9 h-9 ring-2 ring-white/50 shadow-md">
                  <AvatarFallback 
                    className="text-white text-sm"
                    style={{ 
                      background: 'linear-gradient(135deg, #86868B 0%, #B0B0B5 100%)',
                      fontWeight: 600 
                    }}
                  >
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden lg:block">
                  <p className="text-[#1D1D1F] text-sm" style={{ fontWeight: 600 }}>John Doe</p>
                  <p className="text-[#86868B] text-xs" style={{ fontWeight: 400 }}>ESG Analyst</p>
                </div>
                <ChevronDown className="w-4 h-4 text-[#86868B]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="backdrop-blur-xl bg-white/95 border-black/8 text-[#1D1D1F] w-64 rounded-2xl shadow-2xl"
                style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08)' }}
              >
                <div className="px-4 py-3 border-b border-black/5">
                  <p className="text-sm" style={{ fontWeight: 600 }}>John Doe</p>
                  <p className="text-xs text-[#86868B]" style={{ fontWeight: 400 }}>john.doe@company.com</p>
                </div>
                <DropdownMenuItem className="hover:bg-black/5 cursor-pointer rounded-xl m-1 px-3 py-2.5">
                  <User className="w-4 h-4 mr-3 text-[#86868B]" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-black/5 cursor-pointer rounded-xl m-1 px-3 py-2.5">
                  API Configuration
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-black/5 my-1" />
                <DropdownMenuItem 
                  className="hover:bg-red-50 cursor-pointer rounded-xl m-1 px-3 py-2.5 text-[#FF3B30]"
                  onClick={onLogout}
                  style={{ fontWeight: 500 }}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
