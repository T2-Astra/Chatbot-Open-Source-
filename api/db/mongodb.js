import { MongoClient } from 'mongodb';

let client;
let db;

export async function connectToDatabase() {
  if (db) {
    return { client, db };
  }

  try {
    const mongoUri = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI;
    console.log('Connecting to MongoDB with URI:', mongoUri ? 'URI provided' : 'No URI found');
    
    if (!mongoUri) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    client = new MongoClient(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    db = client.db('chatbot');
    
    console.log('Connected to MongoDB successfully');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function disconnectFromDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

export { db };