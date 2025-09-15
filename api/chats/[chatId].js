import { connectToDatabase } from '../db/mongodb.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method, query } = req;
  const { chatId } = query;
  
  try {
    const { db } = await connectToDatabase();
    const chatsCollection = db.collection('chats');

    switch (method) {
      case 'GET':
        await handleGetChat(req, res, chatsCollection, chatId);
        break;
      case 'PATCH':
        await handleUpdateChat(req, res, chatsCollection, chatId);
        break;
      case 'DELETE':
        await handleDeleteChat(req, res, chatsCollection, chatId);
        break;
      default:
        res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGetChat(req, res, chatsCollection, chatId) {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  if (!ObjectId.isValid(chatId)) {
    return res.status(400).json({ error: 'Invalid chatId' });
  }

  const chat = await chatsCollection.findOne({
    _id: new ObjectId(chatId),
    userId
  });

  if (!chat) {
    return res.status(404).json({ error: 'Chat not found' });
  }

  res.status(200).json({ chat });
}

async function handleUpdateChat(req, res, chatsCollection, chatId) {
  const { title, userId } = req.body;
  
  if (!title || !userId) {
    return res.status(400).json({ error: 'title and userId are required' });
  }

  if (!ObjectId.isValid(chatId)) {
    return res.status(400).json({ error: 'Invalid chatId' });
  }

  const result = await chatsCollection.updateOne(
    { _id: new ObjectId(chatId), userId },
    { 
      $set: { 
        title, 
        updatedAt: new Date() 
      } 
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ error: 'Chat not found' });
  }

  res.status(200).json({ success: true });
}

async function handleDeleteChat(req, res, chatsCollection, chatId) {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  if (!ObjectId.isValid(chatId)) {
    return res.status(400).json({ error: 'Invalid chatId' });
  }

  const result = await chatsCollection.deleteOne({
    _id: new ObjectId(chatId),
    userId
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Chat not found' });
  }

  res.status(200).json({ success: true });
}