import { Chat, Message } from '../types/chat';

class MockMongoDB {
  private getStorageKey(userId?: string): string {
    return userId ? `chatbot_data_${userId}` : 'chatbot_data_guest';
  }

  private getData(userId?: string): { chats: Chat[] } {
    // Only return data for authenticated users, empty for guests
    if (!userId) return { chats: [] };
    
    const data = localStorage.getItem(this.getStorageKey(userId));
    return data ? JSON.parse(data) : { chats: [] };
  }

  private saveData(data: { chats: Chat[] }, userId?: string): void {
    // Only save data for authenticated users
    if (!userId) return;
    
    localStorage.setItem(this.getStorageKey(userId), JSON.stringify(data));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  async connect(): Promise<void> {
    // Mock connection - no actual connection needed for localStorage
    return Promise.resolve();
  }

  async disconnect(): Promise<void> {
    // Mock disconnection - no actual disconnection needed for localStorage
    return Promise.resolve();
  }

  async createChat(title: string, userId?: string): Promise<string> {
    // For guests, just return a temporary ID without saving
    if (!userId) {
      return this.generateId();
    }
    
    const data = this.getData(userId);
    const chatId = this.generateId();
    
    const chat: Chat = {
      _id: chatId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    };
    
    data.chats.unshift(chat); // Add to beginning for most recent first
    this.saveData(data, userId);
    return chatId;
  }

  async addMessage(chatId: string, message: Omit<Message, '_id' | 'chatId'>, userId?: string): Promise<void> {
    // For guests, don't save messages
    if (!userId) return;
    
    const data = this.getData(userId);
    const chat = data.chats.find(c => c._id === chatId);
    
    if (chat) {
      const messageWithId: Message = {
        ...message,
        _id: this.generateId(),
        chatId
      };
      
      chat.messages.push(messageWithId);
      chat.updatedAt = new Date();
      this.saveData(data, userId);
    }
  }

  async getChats(userId?: string): Promise<Chat[]> {
    const data = this.getData(userId);
    return data.chats.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getChat(chatId: string, userId?: string): Promise<Chat | null> {
    const data = this.getData(userId);
    return data.chats.find(c => c._id === chatId) || null;
  }

  async updateChatTitle(chatId: string, title: string, userId?: string): Promise<void> {
    // For guests, don't save title updates
    if (!userId) return;
    
    const data = this.getData(userId);
    const chat = data.chats.find(c => c._id === chatId);
    
    if (chat) {
      chat.title = title;
      chat.updatedAt = new Date();
      this.saveData(data, userId);
    }
  }

  async deleteChat(chatId: string, userId?: string): Promise<void> {
    const data = this.getData(userId);
    data.chats = data.chats.filter(c => c._id !== chatId);
    this.saveData(data, userId);
  }
}

export const mongodb = new MockMongoDB();