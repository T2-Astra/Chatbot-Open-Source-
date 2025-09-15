import { connectToDatabase } from './db/mongodb.js';
import { ObjectId } from 'mongodb';

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

  const { method } = req;
  
  try {
    const { db } = await connectToDatabase();
    const chatsCollection = db.collection('chats');

    switch (method) {
      case 'GET':
        await handleGetChats(req, res, chatsCollection);
        break;
      case 'POST':
        await handleCreateChat(req, res, chatsCollection);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGetChats(req, res, chatsCollection) {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const chats = await chatsCollection
    .find({ userId })
    .sort({ updatedAt: -1 })
    .toArray();

  res.status(200).json({ chats });
}

async function handleCreateChat(req, res, chatsCollection) {
  const { title, userId } = req.body;
  
  if (!title || !userId) {
    return res.status(400).json({ error: 'title and userId are required' });
  }

  const chat = {
    title,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: []
  };

  const result = await chatsCollection.insertOne(chat);
  
  res.status(201).json({ 
    chatId: result.insertedId.toString(),
    chat: { ...chat, _id: result.insertedId }
  });
}