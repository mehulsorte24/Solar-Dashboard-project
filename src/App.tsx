import React from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/layout/ToastContainer';

import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AlertsPage } from './pages/AlertsPage';
import { DevicesPage } from './pages/DevicesPage';
import { ReportsPage } from './pages/ReportsPage';

const MainContent: React.FC = () => {
  const { activePage } = useSystem();

  return (
    <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
      {activePage === 'dashboard' && <DashboardPage />}
      {activePage === 'live' && <LiveMonitoringPage />}
      {activePage === 'analytics' && <AnalyticsPage />}
      {activePage === 'alerts' && <AlertsPage />}
      {activePage === 'devices' && <DevicesPage />}
      {activePage === 'reports' && <ReportsPage />}
    </main>
  );
};

export function App() {
  return (
    <SystemProvider>
      <div className="min-h-screen bg-[#FAF7F2] text-[#231F1D] flex flex-col font-sans selection:bg-[#E8D59E] selection:text-[#231F1D]">
        <Header />
        
        <div className="flex-1 flex flex-col lg:flex-row">
          <Sidebar />
          <MainContent />
        </div>

        <Footer />
        <ToastContainer />
      </div>
    </SystemProvider>
  );
}

export default App;
