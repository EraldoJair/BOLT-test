import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ClientsPage } from './components/ClientsPage';

// Simple routing types
type Route = 'dashboard' | 'clients' | 'lots' | 'contracts' | 'payments' | 'settings';

function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  // Handle route changes with loading state
  const handleRouteChange = (route: Route) => {
    if (route !== currentRoute) {
      setIsLoading(true);
      setCurrentRoute(route);
      // Simulate page loading for smoother transitions
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  // Render appropriate content based on current route
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch(currentRoute) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientsPage />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">{getPageTitle(currentRoute)}</h2>
            <p className="text-gray-500 text-center">
              This module is under development and will be available soon.
            </p>
          </div>
        );
    }
  };

  // Get title for the current page
  const getPageTitle = (route: Route): string => {
    switch(route) {
      case 'dashboard': return 'Dashboard';
      case 'clients': return 'Clients';
      case 'lots': return 'Lots';
      case 'contracts': return 'Contracts';
      case 'payments': return 'Payments';
      case 'settings': return 'Settings';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar currentRoute={currentRoute} onRouteChange={handleRouteChange} />
      <main className="flex-1 overflow-auto relative md:ml-0">
        <div className="md:hidden bg-gray-900 text-white p-4 sticky top-0 z-10 flex items-center">
          <span className="ml-8 font-bold">{getPageTitle(currentRoute)}</span>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;