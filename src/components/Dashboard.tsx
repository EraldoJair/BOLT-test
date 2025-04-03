import React from 'react';
import { BarChart3, Users, Map, Calendar } from 'lucide-react';
import { ClientList } from './ClientList';

const stats = [
  { name: 'Total Sales', value: 'R$ 1.2M', icon: BarChart3 },
  { name: 'Active Clients', value: '142', icon: Users },
  { name: 'Available Lots', value: '38', icon: Map },
  { name: 'Due Payments', value: '27', icon: Calendar },
];

export function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-500">{stat.name}</div>
                <Icon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h2>
          <div className="space-y-4">
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              Sales Chart Coming Soon
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h2>
          <div className="space-y-4">
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              Payment Status Chart Coming Soon
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ClientList />
      </div>
    </div>
  );
}