import { Chat, Message } from '../types/chat';

// MongoDB API client for frontend
class MongoDBClient {
  private baseUrl: string;

  constructor() {
    // In production, this would be your API endpoint
    this.baseUrl = import.meta.env.VITE_API_URL || '/api';
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createChat(title: string, userId?: string): Promise<string> {
    if (!userId) {
      // For guests, use localStorage fallback
      return this.createLocalChat(title);
    }

    const response = await this.request('/chats', {
      method: 'POST',
      body: JSON.stringify({ title, userId }),
    });
    return response.chatId;
  }

  async addMessage(chatId: string, message: Omit<Message, '_id' | 'chatId'>, userId?: string): Promise<void> {
    if (!userId) {
      // For guests, use localStorage fallback
      return this.addLocalMessage(chatId, message);
    }

    await this.request(`/messages/${chatId}`, {
      method: 'POST',
      body: JSON.stringify({ ...message, userId }),
    });
  }

  async getChats(userId?: string): Promise<Chat[]> {
    if (!userId) {
      // For guests, use localStorage fallback
      return this.getLocalChats();
    }

    const response = await this.request(`/chats?userId=${userId}`);
    return response.chats;
  }

  async getChat(chatId: string, userId?: string): Promise<Chat | null> {
    if (!userId) {
      // For guests, use localStorage fallback
      return this.getLocalChat(chatId);
    }

    try {
      const response = await this.request(`/chat/${chatId}?userId=${userId}`);
      return response.chat;
    } catch (error) {
      return null;
    }
  }

  async updateChatTitle(chatId: string, title: string, userId?: string): Promise<void> {
    if (!userId) {
      // For guests, use localStorage fallback
      return this.updateLocalChatTitle(chatId, title);
    }

    await this.request(`/chat/${chatId}`, {
      method: 'PATCH',
      body: JSON.stringify({ title, userId }),
    });
  }

  async deleteChat(chatId: string, userId?: string): Promise<void> {
    if (!userId) {
      // For guests, use localStorage fallback
      return this.deleteLocalChat(chatId);
    }

    await this.request(`/chat/${chatId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  }

  // LocalStorage fallback methods for guests
  private getStorageKey(userId?: string): string {
    return userId ? `chatbot_data_${userId}` : 'chatbot_data_guest';
  }

  private getLocalData(userId?: string): { chats: Chat[] } {
    if (!userId) return { chats: [] };
    const data = localStorage.getItem(this.getStorageKey(userId));
    return data ? JSON.parse(data) : { chats: [] };
  }

  private saveLocalData(data: { chats: Chat[] }, userId?: string): void {
    if (!userId) return;
    localStorage.setItem(this.getStorageKey(userId), JSON.stringify(data));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private async createLocalChat(title: string): Promise<string> {
    const chatId = this.generateId();
    const data = this.getLocalData('guest');
    
    const chat: Chat = {
      _id: chatId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    };
    
    data.chats.unshift(chat);
    this.saveLocalData(data, 'guest');
    return chatId;
  }

  private async addLocalMessage(chatId: string, message: Omit<Message, '_id' | 'chatId'>): Promise<void> {
    const data = this.getLocalData('guest');
    const chat = data.chats.find(c => c._id === chatId);
    
    if (chat) {
      const messageWithId: Message = {
        ...message,
        _id: this.generateId(),
        chatId
      };
      
      chat.messages.push(messageWithId);
      chat.updatedAt = new Date();
      this.saveLocalData(data, 'guest');
    }
  }

  private async getLocalChats(): Promise<Chat[]> {
    const data = this.getLocalData('guest');
    return data.chats.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  private async getLocalChat(chatId: string): Promise<Chat | null> {
    const data = this.getLocalData('guest');
    return data.chats.find(c => c._id === chatId) || null;
  }

  private async updateLocalChatTitle(chatId: string, title: string): Promise<void> {
    const data = this.getLocalData('guest');
    const chat = data.chats.find(c => c._id === chatId);
    
    if (chat) {
      chat.title = title;
      chat.updatedAt = new Date();
      this.saveLocalData(data, 'guest');
    }
  }

  private async deleteLocalChat(chatId: string): Promise<void> {
    const data = this.getLocalData('guest');
    data.chats = data.chats.filter(c => c._id !== chatId);
    this.saveLocalData(data, 'guest');
  }
}

export const mongodb = new MongoDBClient();