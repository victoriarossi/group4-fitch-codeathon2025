import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { queryRAG } from '../services/ragApi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    docId: number;
    title: string;
    docType: string;
    relevanceScore: number;
  }>;
  error?: boolean;
}

const suggestionPrompts = [
  "Explain why Entity ENT-004 has high emissions",
  "Compare entities in the Manufacturing sector",
  "What do NACE codes represent?",
  "Find anomalies in the dataset",
  "Explain Scope 1 vs Scope 2 emissions",
  "Which region has the highest emissions?",
];

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm your ESG Analyst AI, specialized in emissions intelligence and sustainability metrics. I can help you understand predictions, compare entities, explain NACE sectors, and provide actionable insights. What would you like to explore?",
    timestamp: new Date(),
  },
];

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const questionText = input;
    setInput('');
    setIsTyping(true);

    try {
      // Call the RAG API
      const response = await queryRAG({
        question: questionText,
        includeNumericData: true,
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources,
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('RAG query failed:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error 
          ? `Sorry, I encountered an error: ${error.message}. Please try again.`
          : 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        error: true,
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const formatMessageContent = (content: string) => {
    return content.split('**').map((part, i) => 
      i % 2 === 0 ? part : <strong key={i} style={{ fontWeight: 700 }}>{part}</strong>
    );
  };

  return (
    <div className="p-8 h-[calc(100vh-73px)] flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-white rounded-xl">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-white text-3xl" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
            AI Analyst
          </h1>
        </div>
        <p className="text-[#AFAFAF]" style={{ fontWeight: 300 }}>
          Domain expert in emissions intelligence and ESG analytics
        </p>
      </div>

      {/* Suggestions */}
      <div className="mb-6">
        <p className="text-[#AFAFAF] text-sm mb-3" style={{ fontWeight: 500 }}>
          SUGGESTED PROMPTS
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestionPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(prompt)}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#AFAFAF] hover:text-white rounded-xl transition-all text-sm border border-[#2A2A2A]"
              style={{ fontWeight: 500 }}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-6 bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-5 ${
                message.role === 'user'
                  ? 'bg-[#4E4E4E] text-white'
                  : message.error
                  ? 'bg-red-950 border border-red-800 text-red-200'
                  : 'bg-white text-black'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center space-x-2 mb-3">
                  {message.error ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <Badge 
                    variant="outline" 
                    className={`${
                      message.error 
                        ? 'border-red-400 text-red-400' 
                        : 'border-black text-black'
                    } text-xs`}
                  >
                    {message.error ? 'ERROR' : 'ESG ANALYST AI'}
                  </Badge>
                </div>
              )}
              <div 
                className="whitespace-pre-line" 
                style={{ 
                  fontWeight: 400, 
                  lineHeight: '1.7',
                  fontSize: '0.9375rem'
                }}
              >
                {formatMessageContent(message.content)}
              </div>
              
              {/* Display sources if available */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-[#4E4E4E] mb-2" style={{ fontWeight: 600 }}>
                    Sources:
                  </p>
                  <div className="space-y-1">
                    {message.sources.map((source, idx) => (
                      <div key={idx} className="text-xs text-[#4E4E4E]">
                        • {source.title} ({source.docType}) - {(source.relevanceScore * 100).toFixed(0)}% relevant
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p 
                className={`text-xs mt-3 ${message.role === 'user' ? 'text-[#AFAFAF]' : message.error ? 'text-red-400' : 'text-[#4E4E4E]'}`}
                style={{ fontWeight: 300 }}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-white rounded-2xl p-5">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 text-black animate-spin" />
                <span className="text-black" style={{ fontWeight: 500 }}>
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
        <div className="flex items-center space-x-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about emissions, entities, sectors, or model insights..."
            className="flex-1 bg-[#0D0D0D] border-[#2A2A2A] text-white placeholder:text-[#4E4E4E] h-12 rounded-xl"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-white text-black hover:bg-[#AFAFAF] h-12 px-6 rounded-xl"
            style={{ fontWeight: 600 }}
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
