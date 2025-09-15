import { connectToDatabase } from '../../db/mongodb.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method, query } = req;
  const { chatId } = query;
  
  try {
    const { db } = await connectToDatabase();
    const chatsCollection = db.collection('chats');

    switch (method) {
      case 'POST':
        await handleAddMessage(req, res, chatsCollection, chatId);
        break;
      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleAddMessage(req, res, chatsCollection, chatId) {
  const { content, role, userId } = req.body;
  
  if (!content || !role || !userId) {
    return res.status(400).json({ error: 'content, role, and userId are required' });
  }

  if (!ObjectId.isValid(chatId)) {
    return res.status(400).json({ error: 'Invalid chatId' });
  }

  const message = {
    _id: new ObjectId(),
    chatId,
    content,
    role,
    timestamp: new Date()
  };

  const result = await chatsCollection.updateOne(
    { _id: new ObjectId(chatId), userId },
    { 
      $push: { messages: message },
      $set: { updatedAt: new Date() }
    }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ error: 'Chat not found' });
  }

  res.status(201).json({ 
    success: true,
    message: { ...message, _id: message._id.toString() }
  });
}