import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Search, Filter, Download } from 'lucide-react';
import { Button } from './ui/button';

const mockData = [
  { id: 'ENT-001', region: 'Western Europe', country: 'Germany', revenue: 2450, envScore: 72, sector: 'Manufacturing' },
  { id: 'ENT-002', region: 'Northern Europe', country: 'Sweden', revenue: 1820, envScore: 85, sector: 'Energy' },
  { id: 'ENT-003', region: 'Southern Europe', country: 'Italy', revenue: 3100, envScore: 68, sector: 'Transport' },
  { id: 'ENT-004', region: 'Western Europe', country: 'France', revenue: 2890, envScore: 74, sector: 'Manufacturing' },
  { id: 'ENT-005', region: 'Eastern Europe', country: 'Poland', revenue: 1560, envScore: 61, sector: 'Construction' },
  { id: 'ENT-006', region: 'Northern Europe', country: 'Denmark', revenue: 1980, envScore: 89, sector: 'Services' },
  { id: 'ENT-007', region: 'Western Europe', country: 'Netherlands', revenue: 2670, envScore: 81, sector: 'Energy' },
  { id: 'ENT-008', region: 'Southern Europe', country: 'Spain', revenue: 2340, envScore: 70, sector: 'Transport' },
  { id: 'ENT-009', region: 'Western Europe', country: 'Belgium', revenue: 1890, envScore: 76, sector: 'Services' },
  { id: 'ENT-010', region: 'Northern Europe', country: 'Finland', revenue: 1720, envScore: 83, sector: 'Manufacturing' },
];

export function DatasetExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');
  const [revenueRange, setRevenueRange] = useState([1000, 4000]);

  const filteredData = mockData.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || item.region === selectedRegion;
    const matchesSector = selectedSector === 'all' || item.sector === selectedSector;
    const matchesRevenue = item.revenue >= revenueRange[0] && item.revenue <= revenueRange[1];
    
    return matchesSearch && matchesRegion && matchesSector && matchesRevenue;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>Dataset Explorer</h2>
          <p className="text-[#B3B3B3]" style={{ fontWeight: 300 }}>
            Browse and filter {mockData.length} entities with complete data
          </p>
        </div>
        <Button className="bg-white text-black hover:bg-[#E0E0E0]" style={{ fontWeight: 600 }}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-[#B3B3B3]" />
          <h3 className="text-white" style={{ fontWeight: 600 }}>Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E6E6E] w-4 h-4" />
            <Input
              placeholder="Search by ID or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#0D0D0D] border-[#2E2E2E] text-white placeholder:text-[#6E6E6E]"
            />
          </div>

          {/* Region Filter */}
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="bg-[#0D0D0D] border-[#2E2E2E] text-white">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2E2E2E] text-white">
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Western Europe">Western Europe</SelectItem>
              <SelectItem value="Northern Europe">Northern Europe</SelectItem>
              <SelectItem value="Southern Europe">Southern Europe</SelectItem>
              <SelectItem value="Eastern Europe">Eastern Europe</SelectItem>
            </SelectContent>
          </Select>

          {/* Sector Filter */}
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="bg-[#0D0D0D] border-[#2E2E2E] text-white">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2E2E2E] text-white">
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Energy">Energy</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Construction">Construction</SelectItem>
              <SelectItem value="Services">Services</SelectItem>
            </SelectContent>
          </Select>

          {/* Revenue Range */}
          <div className="space-y-2">
            <label className="text-[#B3B3B3] text-sm" style={{ fontWeight: 500 }}>
              Revenue: €{revenueRange[0]}M - €{revenueRange[1]}M
            </label>
            <Slider
              value={revenueRange}
              onValueChange={setRevenueRange}
              min={1000}
              max={4000}
              step={100}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#1A1A1A] rounded-xl border border-[#2E2E2E] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#2E2E2E] hover:bg-[#1A1A1A]">
                <TableHead className="text-[#B3B3B3]" style={{ fontWeight: 600 }}>Entity ID</TableHead>
                <TableHead className="text-[#B3B3B3]" style={{ fontWeight: 600 }}>Region</TableHead>
                <TableHead className="text-[#B3B3B3]" style={{ fontWeight: 600 }}>Country</TableHead>
                <TableHead className="text-[#B3B3B3]" style={{ fontWeight: 600 }}>Revenue (M€)</TableHead>
                <TableHead className="text-[#B3B3B3]" style={{ fontWeight: 600 }}>Env. Score</TableHead>
                <TableHead className="text-[#B3B3B3]" style={{ fontWeight: 600 }}>Primary Sector</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="border-b border-[#2E2E2E] hover:bg-[#2E2E2E] cursor-pointer transition-colors"
                >
                  <TableCell className="text-white" style={{ fontWeight: 600 }}>{item.id}</TableCell>
                  <TableCell className="text-[#B3B3B3]">{item.region}</TableCell>
                  <TableCell className="text-[#B3B3B3]">{item.country}</TableCell>
                  <TableCell className="text-white">{item.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-[#0D0D0D] rounded-full h-2">
                        <div 
                          className="bg-white h-2 rounded-full" 
                          style={{ width: `${item.envScore}%` }}
                        ></div>
                      </div>
                      <span className="text-white" style={{ fontWeight: 600 }}>{item.envScore}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#B3B3B3]">{item.sector}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Info */}
        <div className="px-6 py-4 border-t border-[#2E2E2E] flex items-center justify-between">
          <p className="text-[#6E6E6E] text-sm">
            Showing {filteredData.length} of {mockData.length} entities
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-[#2E2E2E] text-[#B3B3B3] hover:bg-[#2E2E2E]">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="border-[#2E2E2E] text-[#B3B3B3] hover:bg-[#2E2E2E]">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
