import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ChatSidebar } from './components/ChatSidebar';
import { LoadingMessage } from './components/LoadingMessage';
import { AuthButton } from './components/AuthButton';
import { Message, Chat, ChatSession } from './types/chat';
import { mongodb } from './lib/mongodb';
import { geminiService } from './lib/gemini';
import { MessageCircle, Sparkles } from 'lucide-react';

function App() {
  const { user, isSignedIn } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [guestMessages, setGuestMessages] = useState<Message[]>([]);
  const [guestChatId, setGuestChatId] = useState<string | null>(null);
  const [previousAuthState, setPreviousAuthState] = useState<boolean | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getUserId = () => isSignedIn ? user?.id : undefined;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Handle authentication state changes
    if (previousAuthState !== null && previousAuthState !== isSignedIn) {
      // Clear all state when auth state changes
      setMessages([]);
      setChatSessions([]);
      setCurrentChatId(null);
      setGuestMessages([]);
      setGuestChatId(null);
    }

    setPreviousAuthState(isSignedIn);

    if (isSignedIn) {
      loadChatSessions();
    } else {
      // For guests, don't load any persisted chats
      setChatSessions([]);
      setIsLoadingChats(false);
    }
  }, [isSignedIn, user?.id]);

  const loadChatSessions = async () => {
    try {
      setIsLoadingChats(true);
      const chats = await mongodb.getChats(getUserId());
      const sessions: ChatSession[] = chats.map(chat => ({
        id: chat._id!.toString(),
        title: chat.title,
        lastMessage: chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1].content.substring(0, 50) + '...'
          : 'New conversation',
        timestamp: chat.updatedAt
      }));
      setChatSessions(sessions);

      if (sessions.length > 0 && !currentChatId) {
        await selectChat(sessions[0].id);
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    } finally {
      setIsLoadingChats(false);
    }
  };

  const selectChat = async (chatId: string) => {
    try {
      const chat = await mongodb.getChat(chatId, getUserId());
      if (chat) {
        setCurrentChatId(chatId);
        setMessages(chat.messages || []);
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const createNewChat = async () => {
    try {
      if (isSignedIn) {
        // For logged-in users, create persistent chat
        const title = `Chat ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
        const chatId = await mongodb.createChat(title, getUserId());
        setCurrentChatId(chatId);
        setMessages([]);
        await loadChatSessions();
      } else {
        // For guests, create temporary in-memory chat
        const guestId = `guest_${Date.now()}`;
        setGuestChatId(guestId);
        setCurrentChatId(guestId);
        setMessages([]);
        setGuestMessages([]);
      }
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await mongodb.deleteChat(chatId, getUserId());
      if (chatId === currentChatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
      await loadChatSessions();
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const sendMessage = async (content: string) => {
    let chatId = currentChatId;

    if (!chatId) {
      if (isSignedIn) {
        await createNewChat();
        return;
      } else {
        // For guests, create a temporary chat ID
        chatId = `guest_${Date.now()}`;
        setCurrentChatId(chatId);
        setGuestChatId(chatId);
      }
    }

    const userMessage: Omit<Message, '_id' | 'chatId'> = {
      content,
      sender: 'user',
      timestamp: new Date()
    };

    const messageWithId = { ...userMessage, _id: Date.now().toString(), chatId: chatId };
    setMessages(prev => [...prev, messageWithId]);

    if (!isSignedIn) {
      setGuestMessages(prev => [...prev, messageWithId]);
    }

    setIsLoading(true);

    try {
      // Save user message to database only for logged-in users
      if (isSignedIn) {
        await mongodb.addMessage(chatId, userMessage, getUserId());
      }

      // Prepare chat history for Gemini
      const chatHistory = messages.map(msg => ({
        role: msg.sender,
        parts: msg.content
      }));

      // Generate AI response
      const aiResponse = await geminiService.generateResponse(content, chatHistory);

      const aiMessage: Omit<Message, '_id' | 'chatId'> = {
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      const aiMessageWithId = { ...aiMessage, _id: Date.now().toString(), chatId: chatId };
      setMessages(prev => [...prev, aiMessageWithId]);

      if (!isSignedIn) {
        setGuestMessages(prev => [...prev, aiMessageWithId]);
      }

      // Save AI message to database only for logged-in users
      if (isSignedIn) {
        await mongodb.addMessage(chatId, aiMessage, getUserId());

        // Update chat title if it's the first exchange
        if (messages.length === 0) {
          const shortTitle = content.length > 30 ? content.substring(0, 30) + '...' : content;
          await mongodb.updateChatTitle(chatId, shortTitle, getUserId());
          await loadChatSessions();
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        _id: Date.now().toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        chatId: chatId
      };
      setMessages(prev => [...prev, errorMessage]);

      if (!isSignedIn) {
        setGuestMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingChats) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your conversations...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      <ChatSidebar
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        isSignedIn={isSignedIn}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AI Chatbot</h1>
                <p className="text-sm text-gray-500">Powered by Gemini AI</p>
              </div>
            </div>
            <AuthButton />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentChatId || !isSignedIn ? (
            <>
              {messages.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">
                    {isSignedIn ? 'Start a conversation' : 'Welcome to AI Chatbot'}
                  </h3>
                  <p className="text-gray-400">
                    {isSignedIn
                      ? 'Ask me anything, and I\'ll do my best to help!'
                      : 'Start chatting! Note: Guest messages won\'t be saved after refresh.'
                    }
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <ChatMessage key={message._id} message={message} />
              ))}

              {isLoading && <LoadingMessage />}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">
                Welcome back!
              </h3>
              <p className="text-gray-400">
                Create a new chat to get started
              </p>
            </div>
          )}
        </div>

        {/* Input */}
        {(currentChatId || !isSignedIn) && (
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}

export default App;