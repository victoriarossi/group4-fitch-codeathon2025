import { useState } from 'react';
import { Search, Filter, Download, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface EntityExplorerProps {
  onNavigateToEntity: () => void;
}

const entities = [
  { id: 'ENT-001', region: 'Western Europe', country: 'France', revenue: 1240, envScore: 72, govScore: 68, sectorMix: 'Manufacturing 60%, Energy 20%', predicted: true },
  { id: 'ENT-002', region: 'Northern Europe', country: 'Sweden', revenue: 2890, envScore: 84, govScore: 82, sectorMix: 'Services 45%, Manufacturing 35%', predicted: true },
  { id: 'ENT-003', region: 'Southern Europe', country: 'Spain', revenue: 1680, envScore: 65, govScore: 63, sectorMix: 'Transport 50%, Services 30%', predicted: true },
  { id: 'ENT-004', region: 'Western Europe', country: 'Germany', revenue: 3250, envScore: 78, govScore: 75, sectorMix: 'Manufacturing 70%, Energy 15%', predicted: true },
  { id: 'ENT-005', region: 'Eastern Europe', country: 'Poland', revenue: 980, envScore: 58, govScore: 55, sectorMix: 'Construction 45%, Manufacturing 35%', predicted: true },
  { id: 'ENT-006', region: 'Western Europe', country: 'Belgium', revenue: 1820, envScore: 70, govScore: 72, sectorMix: 'Services 55%, Transport 25%', predicted: true },
  { id: 'ENT-007', region: 'Northern Europe', country: 'Denmark', revenue: 2150, envScore: 88, govScore: 86, sectorMix: 'Energy 40%, Services 35%', predicted: true },
  { id: 'ENT-008', region: 'Southern Europe', country: 'Italy', revenue: 2940, envScore: 67, govScore: 64, sectorMix: 'Manufacturing 55%, Construction 25%', predicted: true },
];

type SortField = 'id' | 'revenue' | 'envScore' | 'govScore';
type SortDirection = 'asc' | 'desc';

export function EntityExplorer({ onNavigateToEntity }: EntityExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredEntities = entities
    .filter(entity => {
      const matchesSearch = 
        entity.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entity.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entity.region.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = regionFilter === 'all' || entity.region === regionFilter;
      
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      return aVal > bVal ? modifier : -modifier;
    });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-3.5 h-3.5" /> : 
      <ChevronDown className="w-3.5 h-3.5" />;
  };

  return (
    <div className="p-8 space-y-6 max-w-[1900px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1D1D1F] text-3xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>
            Entity Explorer
          </h1>
          <p className="text-[#86868B] text-base" style={{ fontWeight: 400 }}>
            Browse and filter {entities.length} analyzed companies
          </p>
        </div>
        <Button 
          className="h-11 px-6 rounded-2xl text-white shadow-lg hover:shadow-xl"
          style={{ 
            background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-5 border border-black/5 shadow-md">
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#86868B] w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by entity ID, country, region..."
              className="pl-11 h-11 bg-white/60 backdrop-blur-lg border-black/8 text-[#1D1D1F] rounded-2xl text-sm focus:bg-white/80 focus:border-[#007AFF]/30 focus:ring-2 focus:ring-[#007AFF]/10"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-11 px-4 border-black/8 hover:bg-white/80 text-[#1D1D1F] rounded-2xl backdrop-blur-lg bg-white/60"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>

          {/* Region Quick Filter */}
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-56 h-11 border-black/8 rounded-2xl text-sm backdrop-blur-lg bg-white/60">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-xl bg-white/95 border-black/8 rounded-2xl shadow-2xl">
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Western Europe">Western Europe</SelectItem>
              <SelectItem value="Northern Europe">Northern Europe</SelectItem>
              <SelectItem value="Southern Europe">Southern Europe</SelectItem>
              <SelectItem value="Eastern Europe">Eastern Europe</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {(searchQuery || regionFilter !== 'all') && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery('');
                setRegionFilter('all');
              }}
              className="h-11 text-[#86868B] hover:text-[#1D1D1F] hover:bg-white/60 rounded-2xl"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="mt-5 pt-5 border-t border-black/5 grid grid-cols-4 gap-4">
            <div>
              <label className="text-[#86868B] text-xs mb-2 block" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                MIN REVENUE
              </label>
              <Input 
                type="number" 
                placeholder="€0" 
                className="h-10 border-black/8 rounded-xl text-sm bg-white/60 backdrop-blur-lg"
              />
            </div>
            <div>
              <label className="text-[#86868B] text-xs mb-2 block" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                MAX REVENUE
              </label>
              <Input 
                type="number" 
                placeholder="€10,000" 
                className="h-10 border-black/8 rounded-xl text-sm bg-white/60 backdrop-blur-lg"
              />
            </div>
            <div>
              <label className="text-[#86868B] text-xs mb-2 block" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                MIN ENV SCORE
              </label>
              <Input 
                type="number" 
                placeholder="0" 
                className="h-10 border-black/8 rounded-xl text-sm bg-white/60 backdrop-blur-lg"
              />
            </div>
            <div>
              <label className="text-[#86868B] text-xs mb-2 block" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                SECTOR
              </label>
              <Select>
                <SelectTrigger className="h-10 border-black/8 rounded-xl text-sm bg-white/60 backdrop-blur-lg">
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-xl bg-white/95 border-black/8 rounded-2xl">
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-[#86868B]" style={{ fontWeight: 500 }}>
          Showing <span className="text-[#1D1D1F]" style={{ fontWeight: 700 }}>{filteredEntities.length}</span> of {entities.length} entities
        </p>
      </div>

      {/* Table */}
      <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-black/5 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="backdrop-blur-lg bg-white/40 border-b border-black/5">
                <th 
                  className="text-left px-6 py-4 text-[#86868B] text-xs uppercase cursor-pointer hover:bg-white/60 transition-all"
                  style={{ fontWeight: 600, letterSpacing: '0.05em' }}
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Entity ID</span>
                    <SortIcon field="id" />
                  </div>
                </th>
                <th className="text-left px-6 py-4 text-[#86868B] text-xs uppercase" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                  Region
                </th>
                <th className="text-left px-6 py-4 text-[#86868B] text-xs uppercase" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                  Country
                </th>
                <th 
                  className="text-left px-6 py-4 text-[#86868B] text-xs uppercase cursor-pointer hover:bg-white/60 transition-all"
                  style={{ fontWeight: 600, letterSpacing: '0.05em' }}
                  onClick={() => handleSort('revenue')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Revenue (€M)</span>
                    <SortIcon field="revenue" />
                  </div>
                </th>
                <th 
                  className="text-left px-6 py-4 text-[#86868B] text-xs uppercase cursor-pointer hover:bg-white/60 transition-all"
                  style={{ fontWeight: 600, letterSpacing: '0.05em' }}
                  onClick={() => handleSort('envScore')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Env Score</span>
                    <SortIcon field="envScore" />
                  </div>
                </th>
                <th 
                  className="text-left px-6 py-4 text-[#86868B] text-xs uppercase cursor-pointer hover:bg-white/60 transition-all"
                  style={{ fontWeight: 600, letterSpacing: '0.05em' }}
                  onClick={() => handleSort('govScore')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Gov Score</span>
                    <SortIcon field="govScore" />
                  </div>
                </th>
                <th className="text-left px-6 py-4 text-[#86868B] text-xs uppercase" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                  Sector Mix
                </th>
                <th className="text-left px-6 py-4 text-[#86868B] text-xs uppercase" style={{ fontWeight: 600, letterSpacing: '0.05em' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEntities.map((entity) => (
                <tr 
                  key={entity.id}
                  className="border-b border-black/5 hover:bg-white/70 transition-all cursor-pointer"
                  onClick={onNavigateToEntity}
                >
                  <td className="px-6 py-4">
                    <span className="text-[#1D1D1F] text-sm" style={{ fontWeight: 600 }}>
                      {entity.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#86868B] text-sm" style={{ fontWeight: 400 }}>
                      {entity.region}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#1D1D1F] text-sm" style={{ fontWeight: 500 }}>
                      {entity.country}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#1D1D1F] text-sm" style={{ fontWeight: 600 }}>
                      €{entity.revenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-[#1D1D1F] text-sm" style={{ fontWeight: 600 }}>
                        {entity.envScore}
                      </span>
                      <div className="w-20 h-2 bg-black/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${entity.envScore}%`,
                            background: 'linear-gradient(90deg, #007AFF 0%, #0051D5 100%)'
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-[#1D1D1F] text-sm" style={{ fontWeight: 600 }}>
                        {entity.govScore}
                      </span>
                      <div className="w-20 h-2 bg-black/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#86868B] rounded-full"
                          style={{ width: `${entity.govScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#86868B] text-xs" style={{ fontWeight: 400 }}>
                      {entity.sectorMix}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      className="bg-green-100 text-green-600 border-green-200 text-xs rounded-full px-3 py-1"
                      style={{ fontWeight: 600 }}
                    >
                      PREDICTED
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
