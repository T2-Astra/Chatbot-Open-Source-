// Vercel serverless function entry point
import { connectToDatabase } from './db/mongodb.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health check
  if (req.url === '/api' || req.url === '/api/') {
    return res.json({ 
      status: 'OK', 
      message: 'Chatbot API is running',
      timestamp: new Date().toISOString() 
    });
  }

  // Route to appropriate handler
  const path = req.url.replace('/api', '');
  
  try {
    if (path.startsWith('/chats')) {
      const pathParts = path.split('/').filter(Boolean);
      
      if (pathParts.length === 1) {
        // /api/chats
        const { default: chatsHandler } = await import('./chats/index.js');
        return chatsHandler(req, res);
      } else if (pathParts.length === 2) {
        // /api/chats/:chatId
        req.query.chatId = pathParts[1];
        const { default: chatHandler } = await import('./chats/[chatId].js');
        return chatHandler(req, res);
      } else if (pathParts.length === 3 && pathParts[2] === 'messages') {
        // /api/chats/:chatId/messages
        req.query.chatId = pathParts[1];
        const { default: messagesHandler } = await import('./chats/[chatId]/messages.js');
        return messagesHandler(req, res);
      }
    }
    
    res.status(404).json({ error: 'Route not found' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}