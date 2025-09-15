import React from 'react';
import { ChatSession } from '../types/chat';
import { MessageCircle, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ChatSidebarProps {
  chatSessions: ChatSession[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  isSignedIn: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatSessions,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isSignedIn
}) => {
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {isSignedIn ? (
          <>
            <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Recent Chats</h3>
            <div className="space-y-2">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    currentChatId === session.id
                      ? 'bg-white shadow-sm border border-blue-200'
                      : 'hover:bg-white hover:shadow-sm'
                  }`}
                  onClick={() => onSelectChat(session.id)}
                >
                  <div className="flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">
                      {session.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(session.timestamp, 'MMM d, HH:mm')}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(session.id);
                    }}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-500 mb-2">Guest Mode</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sign in to save and access your chat history across sessions.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Current chat will be lost on refresh.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};