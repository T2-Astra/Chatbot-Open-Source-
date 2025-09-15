export interface Message {
  _id?: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  chatId: string;
}

export interface Chat {
  _id?: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}