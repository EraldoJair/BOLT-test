import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { connectDB, Client } from './src/lib/db';
import mongoose from 'mongoose';

// Connect to MongoDB when starting the dev server
connectDB().catch(console.error);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/clients': {
        target: 'http://localhost:5173',
        bypass: async (req, res) => {
          // Set CORS headers for all responses
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

          // Handle OPTIONS requests (CORS preflight)
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          // Get client ID from URL if present (for single client operations)
          const urlParts = req.url.split('/');
          const clientId = urlParts.length > 2 ? urlParts[3] : null;

          // Handle GET requests
          if (req.method === 'GET') {
            try {
              let clients;
              
              // If clientId is provided, fetch single client
              if (clientId && mongoose.isValidObjectId(clientId)) {
                clients = await Client.findById(clientId).lean();
                if (!clients) {
                  res.statusCode = 404;
                  res.end(JSON.stringify({ error: 'Client not found' }));
                  return;
                }
              } else {
                // Otherwise fetch all clients
                clients = await Client.find().lean();
              }
              
              // Transform _id to id for frontend compatibility
              const transformedClients = Array.isArray(clients) 
                ? clients.map(c => ({ ...c, id: c._id.toString(), _id: undefined }))
                : { ...clients, id: clients._id.toString(), _id: undefined };
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(transformedClients));
            } catch (error) {
              console.error('Error fetching clients:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to fetch clients' }));
            }
            return;
          }

          // Handle POST requests
          if (req.method === 'POST') {
            try {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              await new Promise(resolve => req.on('end', resolve));

              const clientData = JSON.parse(body);
              const newClient = new Client(clientData);
              await newClient.save();

              // Transform for frontend
              const clientResponse = newClient.toObject();
              clientResponse.id = clientResponse._id.toString();
              delete clientResponse._id;

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify(clientResponse));
            } catch (error) {
              console.error('Error creating client:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to create client', details: error.message }));
            }
            return;
          }

          // Handle PUT requests
          if (req.method === 'PUT') {
            try {
              if (!clientId || !mongoose.isValidObjectId(clientId)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid client ID' }));
                return;
              }

              let body = '';
              req.on('data', chunk => { body += chunk; });
              await new Promise(resolve => req.on('end', resolve));

              const clientData = JSON.parse(body);
              const updatedClient = await Client.findByIdAndUpdate(
                clientId,
                clientData,
                { new: true }
              );

              if (!updatedClient) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Client not found' }));
                return;
              }

              // Transform for frontend
              const clientResponse = updatedClient.toObject();
              clientResponse.id = clientResponse._id.toString();
              delete clientResponse._id;

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(clientResponse));
            } catch (error) {
              console.error('Error updating client:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to update client', details: error.message }));
            }
            return;
          }

          // Handle DELETE requests
          if (req.method === 'DELETE') {
            try {
              if (!clientId || !mongoose.isValidObjectId(clientId)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid client ID' }));
                return;
              }

              const deletedClient = await Client.findByIdAndDelete(clientId);
              
              if (!deletedClient) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Client not found' }));
                return;
              }

              res.statusCode = 200;
              res.end(JSON.stringify({ message: 'Client deleted successfully' }));
            } catch (error) {
              console.error('Error deleting client:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to delete client' }));
            }
            return;
          }

          // Handle unimplemented methods
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
        },
      },
    },
  },
});
