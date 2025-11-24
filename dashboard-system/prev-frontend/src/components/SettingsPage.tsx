import { useState } from 'react';
import { Settings, User, Key, Download, Moon, Sun } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

export function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@company.com');
  const [apiKey, setApiKey] = useState('sk_live_••••••••••••••••');

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <Settings className="w-8 h-8 text-white" />
          <h2 className="text-white text-2xl" style={{ fontWeight: 700 }}>Settings</h2>
        </div>
        <p className="text-[#B3B3B3]" style={{ fontWeight: 300 }}>
          Manage your account preferences and configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-[#2E2E2E] rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white" style={{ fontWeight: 700 }}>Profile Information</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white" style={{ fontWeight: 600 }}>Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0D0D0D] border-[#2E2E2E] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white" style={{ fontWeight: 600 }}>Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0D0D0D] border-[#2E2E2E] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-white" style={{ fontWeight: 600 }}>Company</Label>
              <Input
                id="company"
                type="text"
                placeholder="Your company name"
                className="bg-[#0D0D0D] border-[#2E2E2E] text-white placeholder:text-[#6E6E6E]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-white" style={{ fontWeight: 600 }}>Role</Label>
              <Input
                id="role"
                type="text"
                placeholder="ESG Analyst"
                className="bg-[#0D0D0D] border-[#2E2E2E] text-white placeholder:text-[#6E6E6E]"
              />
            </div>

            <Button className="w-full bg-white text-black hover:bg-[#E0E0E0]" style={{ fontWeight: 600 }}>
              Save Changes
            </Button>
          </div>
        </div>

        {/* Appearance & API */}
        <div className="space-y-6">
          {/* Appearance Settings */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
            <h3 className="text-white mb-6" style={{ fontWeight: 700 }}>Appearance</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#2E2E2E]">
                <div className="flex items-center space-x-3">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-white" />
                  ) : (
                    <Sun className="w-5 h-5 text-white" />
                  )}
                  <div>
                    <Label className="text-white" style={{ fontWeight: 600 }}>Dark Mode</Label>
                    <p className="text-[#6E6E6E] text-sm" style={{ fontWeight: 300 }}>
                      {darkMode ? 'Currently enabled' : 'Currently disabled'}
                    </p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <p className="text-[#6E6E6E] text-sm" style={{ fontWeight: 300 }}>
                Note: This dashboard is optimized for grayscale themes. Both modes maintain the monochrome aesthetic.
              </p>
            </div>
          </div>

          {/* API Configuration */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-[#2E2E2E] rounded-lg">
                <Key className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white" style={{ fontWeight: 700 }}>API Configuration</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-white" style={{ fontWeight: 600 }}>API Key</Label>
                <Input
                  id="apiKey"
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-[#0D0D0D] border-[#2E2E2E] text-white font-mono"
                />
                <p className="text-[#6E6E6E] text-xs" style={{ fontWeight: 300 }}>
                  Keep your API key secure. Never share it publicly.
                </p>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-[#2E2E2E] text-white hover:bg-[#2E2E2E]"
                style={{ fontWeight: 600 }}
              >
                Generate New Key
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2E2E2E]">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-[#2E2E2E] rounded-lg">
            <Download className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-white" style={{ fontWeight: 700 }}>Data Export & Submission</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#2E2E2E]">
            <p className="text-white mb-2" style={{ fontWeight: 600 }}>Predictions CSV</p>
            <p className="text-[#6E6E6E] text-sm mb-4" style={{ fontWeight: 300 }}>
              Export all emission predictions
            </p>
            <Button 
              className="w-full bg-white text-black hover:bg-[#E0E0E0]"
              style={{ fontWeight: 600 }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#2E2E2E]">
            <p className="text-white mb-2" style={{ fontWeight: 600 }}>Dataset CSV</p>
            <p className="text-[#6E6E6E] text-sm mb-4" style={{ fontWeight: 300 }}>
              Export complete dataset
            </p>
            <Button 
              className="w-full bg-white text-black hover:bg-[#E0E0E0]"
              style={{ fontWeight: 600 }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#2E2E2E]">
            <p className="text-white mb-2" style={{ fontWeight: 600 }}>Submission.csv</p>
            <p className="text-[#6E6E6E] text-sm mb-4" style={{ fontWeight: 300 }}>
              Official competition submission
            </p>
            <Button 
              className="w-full bg-white text-black hover:bg-[#E0E0E0]"
              style={{ fontWeight: 600 }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <Separator className="my-6 bg-[#2E2E2E]" />

        {/* Quality Check */}
        <div className="bg-[#0D0D0D] rounded-lg p-6 border border-[#2E2E2E]">
          <h4 className="text-white mb-4" style={{ fontWeight: 600 }}>Submission Quality Check</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-[#6E6E6E] text-sm mb-1" style={{ fontWeight: 500 }}>Completeness</p>
              <p className="text-white text-2xl" style={{ fontWeight: 700 }}>100%</p>
            </div>
            <div>
              <p className="text-[#6E6E6E] text-sm mb-1" style={{ fontWeight: 500 }}>Missing Values</p>
              <p className="text-white text-2xl" style={{ fontWeight: 700 }}>0</p>
            </div>
            <div>
              <p className="text-[#6E6E6E] text-sm mb-1" style={{ fontWeight: 500 }}>Format Status</p>
              <p className="text-white text-2xl" style={{ fontWeight: 700 }}>Valid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#6E6E6E]">
        <h3 className="text-white mb-4" style={{ fontWeight: 700 }}>Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white mb-1" style={{ fontWeight: 600 }}>Delete Account</p>
            <p className="text-[#6E6E6E] text-sm" style={{ fontWeight: 300 }}>
              Permanently delete your account and all associated data
            </p>
          </div>
          <Button 
            variant="outline" 
            className="border-[#6E6E6E] text-[#B3B3B3] hover:bg-[#2E2E2E]"
            style={{ fontWeight: 600 }}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
