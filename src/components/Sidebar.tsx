import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  FileText, 
  CreditCard, 
  Settings,
  LogOut 
} from 'lucide-react';

type Route = 'dashboard' | 'clients' | 'lots' | 'contracts' | 'payments' | 'settings';

interface SidebarProps {
  currentRoute: Route;
  onRouteChange: (route: Route) => void;
}

const navigation = [
  { name: 'Dashboard', route: 'dashboard' as Route, icon: LayoutDashboard },
  { name: 'Clients', route: 'clients' as Route, icon: Users },
  { name: 'Lots', route: 'lots' as Route, icon: Map },
  { name: 'Contracts', route: 'contracts' as Route, icon: FileText },
  { name: 'Payments', route: 'payments' as Route, icon: CreditCard },
  { name: 'Settings', route: 'settings' as Route, icon: Settings },
];

export function Sidebar({ currentRoute, onRouteChange }: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Map className="h-8 w-8" />
          <span className="text-xl font-bold">RealEstate Pro</span>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => onRouteChange(item.route)}
                className={`flex items-center space-x-2 px-4 py-2 text-gray-300 rounded-lg transition-colors duration-200 w-full ${
                  currentRoute === item.route 
                    ? 'bg-gray-800 text-white' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <button className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors duration-200 w-full">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
