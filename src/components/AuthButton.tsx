import React from 'react';
import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react';
import { LogIn, LogOut, User } from 'lucide-react';

export const AuthButton: React.FC = () => {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            {user?.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt={user.firstName || 'User'} 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>
          <span className="font-medium">
            {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </span>
        </div>
        <SignOutButton>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium">
        <LogIn className="w-4 h-4" />
        Sign In
      </button>
    </SignInButton>
  );
};