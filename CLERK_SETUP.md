# Clerk Authentication Setup

This application uses Clerk for authentication, which provides a secure and easy-to-use authentication system.

## Current Configuration

The application is already configured with a working Clerk setup. The `.env` file contains:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXF1YWwtbGFiLTkxLmNsZXJrLmFjY291bnRzLmRldiQ
```

## Features

- **Multiple Auth Providers**: Email, Google, GitHub, and more
- **Secure Sessions**: Managed by Clerk's infrastructure
- **User Management**: Built-in user profiles and settings
- **Privacy**: User data is isolated by user ID

## How It Works

1. **Sign In**: Users can sign in using Clerk's authentication modal
2. **Session Management**: Clerk handles secure session management
3. **User Data**: Each user's chats are stored separately using their Clerk user ID
4. **Sign Out**: Clean logout clears user-specific data

## Customization

To customize the authentication providers or settings:

1. Visit the [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to your application
3. Configure authentication providers in the "User & Authentication" section
4. Update social login providers, email settings, etc.

## Development vs Production

- **Development**: Uses the test environment key
- **Production**: You'll need to create a production Clerk application and update the publishable key

## Privacy & Security

- User chats are stored locally with user ID isolation
- No sensitive data is exposed to the frontend
- Clerk handles all authentication security
- HTTPS required for production use