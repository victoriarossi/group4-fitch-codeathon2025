import { Card } from "./ui/card";
import { Database, Factory, Leaf, Target } from "lucide-react";

export function ProjectSnapshot() {
  return (
    <section>
      <h2 className="text-[#1C1D1F] mb-4">Project Snapshot</h2>
      
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-[#1C1D1F]">Training Dataset Coverage</h3>
            <Database className="size-5 text-[#4169E1]" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">Labeled Companies:</span>
              <span className="text-[#1C1D1F]">429</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">Regions:</span>
              <span className="text-[#1C1D1F]">7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Countries:</span>
              <span className="text-[#1C1D1F]">28</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-[#1C1D1F]">Sector Breakdown</h3>
            <Factory className="size-5 text-[#4169E1]" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">Sector revenue rows:</span>
              <span className="text-[#1C1D1F]">799</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">NACE Level-1 sectors:</span>
              <span className="text-[#1C1D1F]">20</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">NACE Level-2 sectors:</span>
              <span className="text-[#1C1D1F]">79</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Incomplete distribution:</span>
              <span className="text-[#1C1D1F]">21</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-[#1C1D1F]">Environmental Activities</h3>
            <Leaf className="size-5 text-[#4169E1]" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">Activity records:</span>
              <span className="text-[#1C1D1F]">355</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">Distinct types:</span>
              <span className="text-[#1C1D1F]">8</span>
            </div>
            <div className="text-[#6B7280] mt-3 pt-2 border-t border-[#F3F4F6]">
              <div className="flex flex-wrap gap-1">
                {["Operation", "Manufacturing", "Supply Chain", "Transportation", "Natural Resources", "Infrastructure", "Retail", "General"].map((type) => (
                  <span key={type} className="text-[11px] px-2 py-1 bg-[#F3F4F6] rounded">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-[#1C1D1F]">SDG Reporting</h3>
            <Target className="size-5 text-[#4169E1]" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">Original SDG rows:</span>
              <span className="text-[#1C1D1F]">165</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#F3F4F6] pb-2">
              <span className="text-[#6B7280]">Distinct SDGs:</span>
              <span className="text-[#1C1D1F]">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Avg SDGs per company:</span>
              <span className="text-[#1C1D1F]">1.27</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
