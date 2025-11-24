import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { TwoFactorModal } from './components/TwoFactorModal';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { EntityExplorer } from './components/EntityExplorer';
import { EntityDetailsEnhanced } from './components/EntityDetailsEnhanced';
import { ModelInsights } from './components/ModelInsights';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { AIChatbot } from './components/AIChatbot';
import { ExportsReports } from './components/ExportsReports';
import { SettingsPage } from './components/SettingsPage';

type AuthView = 'login' | 'signup' | 'dashboard';
type DashboardPage = 'home' | 'explorer' | 'entity' | 'predictions' | 'simulator' | 'chatbot' | 'insights' | 'exports' | 'settings';

function App() {
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentPage, setCurrentPage] = useState<DashboardPage>('home');
  const [show2FA, setShow2FA] = useState(false);

  const handleLogin = () => {
    setShow2FA(false);
    setAuthView('dashboard');
  };

  const handleLogout = () => {
    setAuthView('login');
    setCurrentPage('home');
  };

  const handleShow2FA = () => {
    setShow2FA(true);
  };

  const handleSignUp = () => {
    setAuthView('login');
  };

  // Auth screens
  if (authView === 'login') {
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          onNavigateToSignUp={() => setAuthView('signup')}
          onShow2FA={handleLogin}
        />
        {/* <TwoFactorModal
          isOpen={show2FA}
          onClose={() => setShow2FA(false)}
          onVerify={handleLogin}
        /> */}
      </>
    );
  }

  if (authView === 'signup') {
    return (
      <SignUpPage
        onSignUp={handleSignUp}
        onNavigateToLogin={() => setAuthView('login')}
      />
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Header onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        
        <main className="flex-1 min-h-[calc(100vh-57px)]">
          {currentPage === 'home' && (
            <DashboardHome 
              onNavigateToExplorer={() => setCurrentPage('explorer')}
              onNavigateToEntity={() => setCurrentPage('entity')}
            />
          )}
          {currentPage === 'explorer' && (
            <EntityExplorer onNavigateToEntity={() => setCurrentPage('entity')} />
          )}
          {currentPage === 'entity' && <EntityDetailsEnhanced />}
          {currentPage === 'predictions' && <EntityDetailsEnhanced />}
          {currentPage === 'simulator' && <WhatIfSimulator />}
          {currentPage === 'chatbot' && <AIChatbot />}
          {currentPage === 'insights' && <ModelInsights />}
          {currentPage === 'exports' && <ExportsReports />}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;