import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ClientsPage } from './components/ClientsPage';

// Simple routing types
type Route = 'dashboard' | 'clients' | 'lots' | 'contracts' | 'payments' | 'settings';

function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('dashboard');

  const renderContent = () => {
    switch(currentRoute) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientsPage />;
      default:
        return <div className="p-6">This module is under development.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentRoute={currentRoute} onRouteChange={setCurrentRoute} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
