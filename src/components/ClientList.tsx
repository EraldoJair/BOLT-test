import React from 'react';
import { useClients } from '../hooks/useClients';
import { User, Loader } from 'lucide-react';

export function ClientList() {
  const { clients, isLoading, error, createClient } = useClients();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        Error loading clients: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Clients</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {clients?.map((client) => (
          <div key={client.id} className="p-6 flex items-center space-x-4">
            <div className="flex-shrink-0">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {client.name}
              </p>
              <p className="text-sm text-gray-500 truncate">{client.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}