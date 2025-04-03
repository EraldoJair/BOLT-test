import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { connectDB, Client } from './src/lib/db';

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

          // Handle GET requests
          if (req.method === 'GET') {
            try {
              const clients = await Client.find().lean();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(clients));
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

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify(newClient.toJSON()));
            } catch (error) {
              console.error('Error creating client:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to create client' }));
            }
            return;
          }

          // Handle PUT requests
          if (req.method === 'PUT') {
            try {
              const clientId = req.url.split('/').pop();
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

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(updatedClient.toJSON()));
            } catch (error) {
              console.error('Error updating client:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to update client' }));
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