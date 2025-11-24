import { DatasetStoryStep } from "./components/narrative/DatasetStoryStep";
import { SDGImputationStep } from "./components/narrative/SDGImputationStep";
import { FeatureEngineeringStep } from "./components/narrative/FeatureEngineeringStep";
import { ModelPerformanceStep } from "./components/narrative/ModelPerformanceStep";
import { PredictionDistributionStep } from "./components/narrative/PredictionDistributionStep";
import { HighEmittersStep } from "./components/narrative/HighEmittersStep";
import { InterpretabilityStep } from "./components/narrative/InterpretabilityStep";
import { PipelineSummaryStep } from "./components/narrative/PipelineSummaryStep";
import { AIAssistantPage } from "./components/AIAssistantPage";
import { useState, useEffect } from "react";
import { MessageSquare, BarChart3 } from "lucide-react";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "assistant">("dashboard");
  const [backendReady, setBackendReady] = useState(false);

  // Wake up backend on app load
  useEffect(() => {
    const wakeUpBackend = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      try {
        console.log('Waking up backend...');
        await fetch(`${apiUrl}/health`, { 
          method: 'GET',
          signal: AbortSignal.timeout(30000) // 30 second timeout for cold start
        });
        console.log('Backend is awake');
        setBackendReady(true);
      } catch (error) {
        console.warn('Backend wake-up failed (this is normal on first load):', error);
        // Still set ready to true so user can try
        setBackendReady(true);
      }
    };
    
    wakeUpBackend();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Header */}
      <header className="border-b border-[#E8EAED] bg-white/80 backdrop-blur-xl">
        <div className="max-w-[1320px] mx-auto px-8 py-12">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs tracking-wide text-[#3F4D64] bg-[#3F4D64]/5 rounded-full">
                  CODEATHON '25
                </span>
              </div>
              <h1 className="text-[#1A1A1A] mb-3 text-3xl">
                FitchGroup Emissions Modeling Dashboard
              </h1>
              <p className="text-[#8B8F94] max-w-3xl">
                A step-by-step journey through our Scope 1 & Scope 2 prediction pipeline from raw data to actionable insights.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mt-8">
              <button
                onClick={() => setCurrentPage("dashboard")}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full transition-all
                  ${
                    currentPage === "dashboard"
                      ? "bg-[#3F4D64] text-white shadow-lg"
                      : "bg-white/60 text-[#8B8F94] hover:bg-white hover:text-[#3F4D64] border border-[#E8EAED]"
                  }
                `}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentPage("assistant")}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full transition-all
                  ${
                    currentPage === "assistant"
                      ? "bg-[#3F4D64] text-white shadow-lg"
                      : "bg-white/60 text-[#8B8F94] hover:bg-white hover:text-[#3F4D64] border border-[#E8EAED]"
                  }
                `}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">AI Assistant</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conditional Content */}
      {currentPage === "dashboard" ? (
        <>
          {/* Narrative Flow */}
          <main className="max-w-[1320px] mx-auto px-8 py-16 space-y-24">
            <DatasetStoryStep stepNumber={1} />
            <SDGImputationStep stepNumber={2} />
            <FeatureEngineeringStep stepNumber={3} />
            <ModelPerformanceStep stepNumber={4} />
            <PredictionDistributionStep stepNumber={5} />
            <HighEmittersStep stepNumber={6} />
            <InterpretabilityStep stepNumber={7} />
            <PipelineSummaryStep stepNumber={8} />
          </main>

          {/* Footer */}
          <footer className="border-t border-[#E8EAED] bg-white/60 backdrop-blur-lg mt-32">
            <div className="max-w-[1320px] mx-auto px-8 py-8">
              <p className="text-sm text-[#8B8F94]">
                FitchGroup Codeathon 2025 • Emissions Modeling Dashboard
              </p>
            </div>
          </footer>
        </>
      ) : (
        <>
          {!backendReady ? (
            <div className="max-w-[1320px] mx-auto px-8 py-32 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 border-4 border-[#3F4D64] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg text-[#3F4D64]">Connecting to backend...</p>
              </div>
              <p className="text-sm text-[#8B8F94]">Waking up the server (this may take up to 30 seconds)</p>
            </div>
          ) : (
            <AIAssistantPage />
          )}
        </>
      )}
    </div>
  );
}