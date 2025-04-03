import React, { useState } from 'react';
import { useClients } from '../hooks/useClients';
import { PlusCircle, Search, User, Loader, X, CheckCircle, Trash2, AlertCircle } from 'lucide-react';
import type { Client as ClientType } from '../types';

export function ClientsPage() {
  const { clients, isLoading, error, createClient, updateClient, deleteClient } = useClients();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientType | null>(null);
  const [clientToDelete, setClientToDelete] = useState<ClientType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.document.trim()) errors.document = 'Document is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitStatus('loading');
    setErrorMessage('');
    
    try {
      if (editingClient) {
        await updateClient.mutateAsync({ id: editingClient.id, data: formData });
        setSuccessMessage('Client updated successfully');
      } else {
        await createClient.mutateAsync(formData);
        setSuccessMessage('Client created successfully');
      }
      setSubmitStatus('success');
      setTimeout(() => {
        setShowModal(false);
        setSubmitStatus('idle');
        resetForm();
      }, 1500);
    } catch (error) {
      console.error('Error saving client:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    
    setDeleteStatus('loading');
    setErrorMessage('');
    
    try {
      await deleteClient.mutateAsync(clientToDelete.id);
      setDeleteStatus('success');
      setSuccessMessage('Client deleted successfully');
      setTimeout(() => {
        setShowDeleteConfirmation(false);
        setDeleteStatus('idle');
        setClientToDelete(null);
      }, 1500);
    } catch (error) {
      console.error('Error deleting client:', error);
      setDeleteStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const openNewClientModal = () => {
    resetForm();
    setEditingClient(null);
    setShowModal(true);
  };

  const openEditClientModal = (client: ClientType) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      document: client.document,
      address: client.address,
    });
    setEditingClient(client);
    setShowModal(true);
  };

  const openDeleteConfirmation = (client: ClientType) => {
    setClientToDelete(client);
    setShowDeleteConfirmation(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      document: '',
      address: '',
    });
    setFormErrors({});
    setSubmitStatus('idle');
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const closeDeleteModal = () => {
    setShowDeleteConfirmation(false);
    setClientToDelete(null);
    setDeleteStatus('idle');
  };

  const dismissMessage = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const filteredClients = clients?.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.document.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="p-6">
      {/* Success and error messages */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{successMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={dismissMessage}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{errorMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={dismissMessage}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <button 
          onClick={openNewClientModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add Client</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search clients by name, email or document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients?.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.document}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditClientModal(client)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteConfirmation(client)}
                      className="text-red-600 hover:text-red-900 mr-3"
                    >
                      Delete
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClients?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                </div>
                
                <div>
                  <label htmlFor="document" className="block text-sm font-medium text-gray-700">Document</label>
                  <input
                    type="text"
                    id="document"
                    name="document"
                    value={formData.document}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.document ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {formErrors.document && <p className="mt-1 text-sm text-red-600">{formErrors.document}</p>}
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.address ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitStatus === 'loading' || submitStatus === 'success'}
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    submitStatus === 'loading' ? 'bg-blue-400' : 
                    submitStatus === 'success' ? 'bg-green-500' : 
                    submitStatus === 'error' ? 'bg-red-500' : 
                    'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {submitStatus === 'loading' ? (
                    <div className="flex items-center">
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </div>
                  ) : submitStatus === 'success' ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Saved!
                    </div>
                  ) : editingClient ? 'Update Client' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && clientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              <button onClick={closeDeleteModal} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                <p className="text-gray-700">
                  Are you sure you want to delete <span className="font-semibold">{clientToDelete.name}</span>? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteClient}
                  disabled={deleteStatus === 'loading' || deleteStatus === 'success'}
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    deleteStatus === 'loading' ? 'bg-red-400' : 
                    deleteStatus === 'success' ? 'bg-green-500' : 
                    'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {deleteStatus === 'loading' ? (
                    <div className="flex items-center">
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Deleting...
                    </div>
                  ) : deleteStatus === 'success' ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Deleted!
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Client
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Details View - To be implemented */}
      {/* Pagination component - To be implemented */}
    </div>
  );
}