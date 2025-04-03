import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Client, ClientValidation } from '../lib/db';
import type { Client as ClientType } from '../types';

export function useClients() {
  const queryClient = useQueryClient();

  const { data: clients, isLoading, error } = useQuery<ClientType[]>('clients', async () => {
    const response = await fetch('/api/clients');
    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }
    return response.json();
  });

  const createClient = useMutation(
    async (clientData) => {
      const validated = ClientValidation.parse(clientData);
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });
      if (!response.ok) {
        throw new Error('Failed to create client');
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
      },
    }
  );

  const updateClient = useMutation(
    async ({ id, data }) => {
      const validated = ClientValidation.parse(data);
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });
      if (!response.ok) {
        throw new Error('Failed to update client');
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clients');
      },
    }
  );

  return {
    clients,
    isLoading,
    error,
    createClient,
    updateClient,
  };
}