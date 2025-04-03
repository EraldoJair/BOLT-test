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

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Clients', icon: Users },
  { name: 'Lots', icon: Map },
  { name: 'Contracts', icon: FileText },
  { name: 'Payments', icon: CreditCard },
  { name: 'Settings', icon: Settings },
];

export function Sidebar() {
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
              <a
                key={item.name}
                href="#"
                className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
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