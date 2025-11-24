import { useState } from "react";
import { GlassCard } from "./ui/glass-card";
import { Sparkles, Send, ArrowLeft, Database, Wrench, BarChart2, Brain, Target, TrendingUp, FileText } from "lucide-react";
import { queryRAG } from "../services/ragApi";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ExpertiseLevel = "Beginner" | "Intermediate" | "Advanced";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Array<{
    docId: number;
    title: string;
    docType: string;
    contributor: string;
    relevanceScore: number;
  }>;
  error?: boolean;
}

export function AIAssistantPage() {
  const [expertiseLevel, setExpertiseLevel] = useState<ExpertiseLevel>("Intermediate");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI assistant for the FitchGroup Emissions Modeling Dashboard. I can answer questions about our workflow, methodology, modeling choices, and findings. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { icon: Database, label: "Dataset Overview", color: "#6366F1" },
    { icon: Wrench, label: "Feature Engineering", color: "#8B5CF6" },
    { icon: Target, label: "Model Performance", color: "#EC4899" },
    { icon: TrendingUp, label: "High Emitters", color: "#F59E0B" },
  ];

  const suggestedPrompts = [
    { icon: "🎯", text: "How did Maria and Victoria approach feature engineering?" },
    { icon: "🔧", text: "What imputation strategies were used?" },
    { icon: "📊", text: "Compare Maria's and Victoria's model results" },
    { icon: "💡", text: "What's in Victoria's training log?" },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Build the expertise-aware question
      const expertiseContext = {
        Beginner: "Explain in simple terms for someone new to data science. Use analogies and avoid technical jargon. Break down complex concepts.",
        Intermediate: "Provide a balanced explanation with some technical details. Assume familiarity with basic ML concepts.",
        Advanced: "Use technical terminology, cite specific methods, algorithms, and metrics. Include implementation details."
      };

      const contextualQuestion = `[Expertise Level: ${expertiseLevel}] ${expertiseContext[expertiseLevel]}\n\nQuestion: ${inputValue}`;

      // Call the RAG API
      const response = await queryRAG({
        question: contextualQuestion,
        context: {
          expertiseLevel: expertiseLevel,
        },
      });

      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('RAG query error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure the backend server is running on port 3001.`,
        timestamp: new Date(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Main Container */}
      <div className="max-w-[900px] mx-auto px-6 py-6 pb-32">
        <GlassCard variant="primary" className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-[#1A1A1A] text-2xl">Emissions Modeling Assistant</h1>
              <p className="text-[#8B8F94] text-sm">Powered by AI • Tailored to your expertise level</p>
            </div>
          </div>
          <button className="p-3 rounded-full bg-[#3F4D64] hover:bg-[#2F3D54] transition-colors shadow-lg">
            <Brain className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {categories.map((category, idx) => (
            <button
              key={idx}
              className="flex items-center gap-2 px-4 py-3 rounded-[16px] bg-white/60 backdrop-blur-[18px] border border-white/35 hover:bg-white/80 hover:shadow-md transition-all"
            >
              <category.icon className="w-4 h-4" style={{ color: category.color }} />
              <span className="text-[#3F4D64] text-sm">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Expertise Level Selector */}
        <div className="mb-6">
          <GlassCard className="p-4" variant="secondary">
            <div className="flex items-center justify-between">
              <span className="text-[#8B8F94] text-sm">Response Depth:</span>
              <div className="flex gap-2">
                {(["Beginner", "Intermediate", "Advanced"] as ExpertiseLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setExpertiseLevel(level)}
                    className={`
                      px-4 py-1.5 rounded-full text-sm transition-all
                      ${
                        expertiseLevel === level
                          ? "bg-[#3F4D64] text-white shadow-md"
                          : "bg-white/60 text-[#8B8F94] hover:bg-white/80"
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Messages */}
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === "assistant" ? (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#3F4D64] to-[#5F6D84] flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className={`bg-white/70 backdrop-blur-[20px] border ${message.error ? 'border-red-300' : 'border-white/40'} rounded-[20px] rounded-tl-[4px] p-5 shadow-sm`}>
                      <div className={`${message.error ? 'text-red-600' : 'text-[#3F4D64]'} leading-relaxed prose prose-sm max-w-none`}>
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold text-[#1A1A1A] mt-4 mb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-base font-semibold text-[#3F4D64] mt-3 mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-sm font-semibold text-[#3F4D64] mt-2 mb-1" {...props} />,
                            p: ({node, ...props}) => <p className="mb-3 text-[#3F4D64]" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="text-[#3F4D64] ml-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold text-[#1A1A1A]" {...props} />,
                            em: ({node, ...props}) => <em className="italic text-[#5F6D84]" {...props} />,
                            code: ({node, inline, ...props}: any) => 
                              inline ? 
                                <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-[#3F4D64] text-xs font-mono" {...props} /> :
                                <code className="block bg-[#F3F4F6] p-3 rounded-lg text-xs font-mono overflow-x-auto" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#D4976C] pl-4 italic text-[#5F6D84] my-3" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      
                      {/* Show sources if available */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/30">
                          <p className="text-xs text-[#8B8F94] mb-2 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Sources:
                          </p>
                          <div className="space-y-1.5">
                            {message.sources.map((source, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                <span className="text-[#8B8F94]">•</span>
                                <div className="flex-1">
                                  <span className={`font-medium ${source.contributor === 'Maria' ? 'text-purple-600' : 'text-blue-600'}`}>
                                    {source.contributor}
                                  </span>
                                  <span className="text-[#8B8F94]"> - {source.title}</span>
                                  <span className="text-[#C4C7CC] ml-1">
                                    ({Math.round(source.relevanceScore * 100)}% relevant)
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#8B8F94] mt-2 ml-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-[#3F4D64] rounded-[20px] rounded-tr-[4px] p-5 shadow-md">
                    <p className="text-white leading-relaxed">{message.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#3F4D64] to-[#5F6D84] flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="bg-white/70 backdrop-blur-[20px] border border-white/40 rounded-[20px] rounded-tl-[4px] p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#3F4D64] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-[#3F4D64] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-[#3F4D64] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Suggested Prompts - Show only after welcome message */}
          {messages.length === 1 && (
            <div className="ml-[52px] grid grid-cols-2 gap-2">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedPrompt(prompt.text)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-[14px] bg-white/60 backdrop-blur-[16px] border border-white/35 hover:bg-white/80 hover:shadow-sm transition-all text-left"
                >
                  <span className="text-base">{prompt.icon}</span>
                  <span className="text-[#3F4D64] text-sm">{prompt.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        </GlassCard>
      </div>

      {/* Fixed Bottom Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-white/0 pt-8 pb-6">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-[20px] border border-white/40 rounded-[24px] shadow-xl p-2 pr-3 flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask me anything about the modeling pipeline..."
              className="flex-1 bg-transparent px-4 py-3 text-[#1A1A1A] placeholder:text-[#8B8F94] outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-5 py-3 rounded-[18px] bg-[#D4976C] hover:bg-[#C4876C] disabled:bg-[#E8EAED] disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4 text-white" />
              <span className="text-white">{isLoading ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
          <p className="text-xs text-[#8B8F94] text-center mt-3">
            AI responses powered by Maria's and Victoria's documentation. Responses cite actual project findings.
          </p>
        </div>
      </div>
    </div>
  );
}