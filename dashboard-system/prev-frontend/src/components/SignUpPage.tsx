import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, Mail, Lock } from 'lucide-react';

interface SignUpPageProps {
  onSignUp: () => void;
  onNavigateToLogin: () => void;
}

export function SignUpPage({ onSignUp, onNavigateToLogin }: SignUpPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0D0D0D] to-[#1A1A1A] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-2" style={{ fontWeight: 700 }}>ESG.AI</h1>
            <p className="text-[#6E6E6E]" style={{ fontWeight: 300, fontSize: '14px' }}>
              Create your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E6E6E] w-5 h-5" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-[#F5F5F5] border-[#E0E0E0] text-black placeholder:text-[#B3B3B3] h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E6E6E] w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="enter@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-[#F5F5F5] border-[#E0E0E0] text-black placeholder:text-[#B3B3B3] h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E6E6E] w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-[#F5F5F5] border-[#E0E0E0] text-black placeholder:text-[#B3B3B3] h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-black">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E6E6E] w-5 h-5" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-[#F5F5F5] border-[#E0E0E0] text-black placeholder:text-[#B3B3B3] h-12"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-black text-white hover:bg-[#1A1A1A] transition-all shadow-lg mt-6"
              style={{ fontWeight: 700 }}
            >
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-[#6E6E6E]" style={{ fontSize: '14px' }}>
              Already have an account?{' '}
              <button
                onClick={onNavigateToLogin}
                className="text-black hover:underline"
                style={{ fontWeight: 600 }}
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
