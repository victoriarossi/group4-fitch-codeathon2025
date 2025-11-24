import { Card } from "./ui/card";
import { CheckCircle2, Cpu, GitBranch } from "lucide-react";
import { Badge } from "./ui/badge";

const pipelineSteps = [
  { name: "Data loading", completed: true },
  { name: "Missing value imputation", completed: true },
  { name: "SDG KNN model", completed: true },
  { name: "Feature engineering", completed: true },
  { name: "Sector PCA", completed: true },
  { name: "Model training (baseline & tuned)", completed: true },
  { name: "Prediction generation", completed: true },
];

const modelVersions = [
  { 
    name: "v1.0 Baseline", 
    description: "Linear/Tree ensemble with default parameters",
    status: "Deployed",
    r2Scope1: "0.553",
    r2Scope2: "0.414"
  },
  { 
    name: "v2.0 Tuned", 
    description: "Optimized hyperparameters with grid search",
    status: "Active",
    r2Scope1: "0.540",
    r2Scope2: "0.426"
  },
];

export function PipelineHealth() {
  return (
    <section>
      <h2 className="text-[#1C1D1F] mb-4">Pipeline Health & Summary</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-[#1C1D1F] mb-1">Pipeline Overview</h3>
              <p className="text-[#6B7280]">End-to-end workflow status</p>
            </div>
            <GitBranch className="size-5 text-[#4169E1]" />
          </div>
          
          <div className="space-y-3">
            {pipelineSteps.map((step, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {step.completed && (
                    <CheckCircle2 className="size-5 text-[#4169E1]" />
                  )}
                  <span className="text-[#1C1D1F]">{step.name}</span>
                </div>
                {step.completed && (
                  <Badge variant="outline" className="text-[#4169E1] border-[#4169E1] bg-[#EEF2FF]">
                    Complete
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">Overall Pipeline Status</span>
              <Badge className="bg-[#4169E1] text-white">
                100% Complete
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-[#1C1D1F] mb-1">Model Versions</h3>
              <p className="text-[#6B7280]">Available prediction models</p>
            </div>
            <Cpu className="size-5 text-[#4169E1]" />
          </div>
          
          <div className="space-y-4">
            {modelVersions.map((version, index) => (
              <div 
                key={index}
                className="p-4 rounded border border-[#E5E7EB] hover:border-[#4169E1] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-[#1C1D1F] mb-1">{version.name}</h4>
                    <p className="text-[#6B7280]">{version.description}</p>
                  </div>
                  <Badge 
                    variant={version.status === "Active" ? "default" : "outline"}
                    className={version.status === "Active" 
                      ? "bg-[#4169E1] text-white" 
                      : "text-[#6B7280] border-[#E5E7EB]"
                    }
                  >
                    {version.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#F3F4F6]">
                  <div>
                    <span className="text-[#6B7280]">Scope 1 R²:</span>
                    <span className="text-[#1C1D1F] ml-2">{version.r2Scope1}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280]">Scope 2 R²:</span>
                    <span className="text-[#1C1D1F] ml-2">{version.r2Scope2}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span>Last Updated:</span>
              <span className="text-[#1C1D1F]">November 23, 2025</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6 bg-[#F9FAFB] border-[#E5E7EB]">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-[#EEF2FF]">
            <CheckCircle2 className="size-5 text-[#4169E1]" />
          </div>
          <div>
            <h3 className="text-[#1C1D1F] mb-2">FitchGroup Emissions Modeling — Codeathon '25</h3>
            <p className="text-[#6B7280] mb-3">
              This dashboard provides a comprehensive view of the emissions prediction pipeline, from data ingestion 
              through SDG imputation, feature engineering, model training, and final predictions. The platform successfully 
              processes 429 labeled companies across 7 regions and 28 countries, utilizing advanced machine learning 
              techniques to predict Scope 1 and Scope 2 emissions.
            </p>
            <div className="flex items-center gap-6 text-[#6B7280]">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#4169E1]"></span>
                <span>Total Features: 56</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#4169E1]"></span>
                <span>Training Samples: 299</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#4169E1]"></span>
                <span>Test Samples: 65</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
