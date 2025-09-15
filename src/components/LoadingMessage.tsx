import React from 'react';
import { Bot } from 'lucide-react';

export const LoadingMessage: React.FC = () => {
  return (
    <div className="flex gap-3 mb-4">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md">
          <Bot className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="max-w-[70%]">
        <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};