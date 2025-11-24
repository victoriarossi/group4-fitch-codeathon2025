import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lock, Mail, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  onNavigateToSignUp: () => void;
  onShow2FA: () => void;
}

export function LoginPage({ onLogin, onNavigateToSignUp, onShow2FA }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShow2FA();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0D0D0D] to-[#1A1A1A] flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16">
        <div>
          <div className="flex items-center space-x-3 mb-12">
            <Sparkles className="w-10 h-10 text-white" />
            <h1 className="text-4xl text-white" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              ESG Sense
            </h1>
          </div>
          
          <div className="space-y-6 max-w-lg">
            <h2 className="text-5xl text-white leading-tight" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              AI-Powered Emissions Intelligence
            </h2>
            <p className="text-xl text-[#AFAFAF]" style={{ fontWeight: 300, lineHeight: '1.8' }}>
              Predict, explain, and analyze Scope 1 & 2 emissions for non-reporting companies with enterprise-grade AI.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-[#AFAFAF]" style={{ fontWeight: 300 }}>
          <div className="flex items-center space-x-3">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span>Predictive Intelligence for 10,000+ Entities</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span>AI Analyst Chatbot with Domain Expertise</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span>Real-Time What-If Scenario Modeling</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-10 shadow-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
              <Sparkles className="w-8 h-8 text-black" />
              <h1 className="text-3xl text-black" style={{ fontWeight: 800 }}>ESG Sense</h1>
            </div>

            <div className="mb-10">
              <h3 className="text-black text-2xl mb-2" style={{ fontWeight: 700 }}>
                Welcome Back
              </h3>
              <p className="text-[#4E4E4E]" style={{ fontWeight: 300 }}>
                Sign in to access your ESG intelligence platform
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black" style={{ fontWeight: 500 }}>
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4E4E4E] w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="analyst@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 bg-[#F5F5F5] border-0 text-black placeholder:text-[#AFAFAF] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-black" style={{ fontWeight: 500 }}>
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4E4E4E] w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 bg-[#F5F5F5] border-0 text-black placeholder:text-[#AFAFAF] rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-[#4E4E4E] hover:text-black transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  Forgot your password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-black text-white hover:bg-[#1A1A1A] rounded-xl shadow-lg"
                style={{ fontWeight: 600 }}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[#4E4E4E]" style={{ fontWeight: 400 }}>
                Don't have an account?{' '}
                <button
                  onClick={onNavigateToSignUp}
                  className="text-black hover:underline"
                  style={{ fontWeight: 600 }}
                >
                  Create one
                </button>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[#AFAFAF] text-sm" style={{ fontWeight: 300 }}>
              © 2025 ESG Sense — Enterprise Emissions Intelligence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
