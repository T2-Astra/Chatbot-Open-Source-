import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase, disconnectFromDatabase } from './db/mongodb.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/chats', async (req, res, next) => {
  try {
    // Import handlers dynamically
    if (req.path === '/' || req.path === '') {
      const { default: handler } = await import('./chats/index.js');
      return handler(req, res);
    }
    
    // Handle chat-specific routes
    const pathParts = req.path.split('/').filter(Boolean);
    if (pathParts.length === 1) {
      // /api/chats/:chatId
      req.query.chatId = pathParts[0];
      const { default: handler } = await import('./chats/[chatId].js');
      return handler(req, res);
    }
    
    if (pathParts.length === 2 && pathParts[1] === 'messages') {
      // /api/chats/:chatId/messages
      req.query.chatId = pathParts[0];
      const { default: handler } = await import('./chats/[chatId]/messages.js');
      return handler(req, res);
    }
    
    res.status(404).json({ error: 'Route not found' });
  } catch (error) {
    console.error('Route handler error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🤖 API endpoint: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await disconnectFromDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await disconnectFromDatabase();
  process.exit(0);
});

startServer();