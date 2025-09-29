# 🤖 Chatbot Open Sour

<div align="center">

![Chatbot Open Source](https://img.shields.io/badge/Chatbot-Open%20Source-blue?style=for-the-badge&logo=robot)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite)
![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-47A248?style=for-the-badge&logo=mongodb)

**A next-generation AI chatbot platform with MongoDB persistence, built for developers, by developers.**

• [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/T2-Astra/Chatbot-Open-Source-/issues) • [✨ Request Feature](https://github.com/T2-Astra/Chatbot-Open-Source-/issues)

</div>

---

## 🌟 Overview

Chatbot Open Source is a modern, privacy-first AI chatbot platform that combines the power of Google's Gemini AI with enterprise-grade authentication and user management. Built with React, TypeScript, and cutting-edge web technologies, it delivers a seamless conversational experience while maintaining the highest standards of security and privacy.

## ✨ Key Features

### 🔐 **Enterprise Authentication**
- **Multi-Provider Support**: Google, GitHub, Email/Password, and more
- **Secure Sessions**: Industry-standard JWT tokens with Clerk
- **Zero-Trust Architecture**: Every request is authenticated and authorized

### 🧠 **Advanced AI Capabilities**
- **Google Gemini Integration**: State-of-the-art language model
- **Context-Aware Conversations**: Maintains conversation history and context
- **Real-time Responses**: Streaming responses for better UX

### 🗄️ **MongoDB Integration**
- **Persistent Storage**: Chat history stored in MongoDB Atlas
- **Scalable Architecture**: Handles millions of conversations
- **Real-time Sync**: Instant synchronization across devices

### 🔒 **Privacy by Design**
- **User Data Isolation**: Complete separation of user conversations
- **Hybrid Storage**: MongoDB for authenticated users, localStorage for guests
- **GDPR Compliant**: Built with privacy regulations in mind

### 📱 **Modern User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Mode**: Adaptive theming for user preference
- **Accessibility First**: WCAG 2.1 AA compliant interface

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Clerk account for authentication
- Google AI API key for Gemini integration
- MongoDB Atlas account (or local MongoDB instance)

### Installation

```bash
# Clone the repository
git clone https://github.com/T2-Astra/Chatbot-Open-Source-.git
cd Chatbot-Open-Source-

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Configuration

Update your `.env` file with the required credentials:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Google AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# MongoDB Database
VITE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbot
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbot

# API Configuration
VITE_API_URL=http://localhost:3001/api
```

### Developmentt

```bash
# Start frontend onl
npm run dev

# Start API server only
npm run api:dev

# Start both frontend and API (recommended)
npm run dev:full

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

Visit `http://localhost:5173` to see your chatbot in action! 

### MongoDB Setup

1. **Create MongoDB Atlas Account**: Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create a Cluster**: Follow the setup wizard to create a free cluster
3. **Get Connection String**: Copy your connection string from the Atlas dashboard
4. **Update Environment Variables**: Add your MongoDB URI to `.env`

```bash
# Example MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/chatbot?retryWrites=true&w=majority
```

## 🏗️ Architecture

```mermaid
graph TB
    A[User Interface] --> B[React Components]
    B --> C[Clerk Authentication]
    B --> D[Gemini AI Service]
    C --> E[User Management]
    D --> F[Conversation Engine]
    E --> G[MongoDB Atlas]
    F --> G
    E --> H[LocalStorage Fallback]
    F --> H
    G --> I[REST API]
    H --> I
```

### Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Frontend** | React | 18.3.1 |
| **Language** | TypeScript | 5.5.3 |
| **Build Tool** | Vite | 5.4.2 |
| **Styling** | Tailwind CSS | 3.4.1 |
| **Authentication** | Clerk | 5.47.0 |
| **AI Engine** | Google Gemini | 0.24.1 |
| **Database** | MongoDB | 6.19.0 |
| **Backend** | Node.js + Express | 18+ |
| **Icons** | Lucide React | 0.344.0 |

## 📖 Documentation

### Authentication Flow

1. **User Registration/Login**: Handled by Clerk with multiple providers
2. **Session Management**: Secure JWT tokens with automatic refresh
3. **User Isolation**: Each user's data is completely separated

### AI Integration

```typescript
// Example: Sending a message to Gemini AI
const response = await geminiService.generateResponse({
  message: userInput,
  context: conversationHistory,
  userId: user.id
});
```

### Privacy Features

- **Data Encryption**: All user data is encrypted at rest
- **Session Isolation**: Users can only access their own conversations
- **Automatic Cleanup**: Sessions are cleaned on logout

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/T2-Astra/Chatbot-Open-Source-)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod


```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build individual containers
docker build -t chatbot-app .
docker run -p 3001:3001 chatbot-app
```

### Other Platforms

- **Railway**: Connect your GitHub repo for automatic deployments
- **Render**: Deploy both frontend and backend with ease
- **AWS**: Use ECS or Elastic Beanstalk for scalable deployment
- **DigitalOcean**: App Platform for simple container deployment

### Environment Variables for Production

```env
# Production MongoDB
MONGODB_URI=mongodb+srv://prod-user:password@prod-cluster.mongodb.net/chatbot

# Production API
VITE_API_URL=https://your-api-domain.com/api

# Clerk Production Keys
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Setup

```bash
# Fork the repository
git clone https://github.com/your-username/Chatbot-Open-Source-.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

### Contribution Guidelines

- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI** for the powerful Gemini language model
- **Clerk** for seamless authentication infrastructure
- **Vercel** for hosting and deployment platform
- **Open Source Community** for continuous inspiration and support

## 📞 Support

- 📧 **Email**: krishmhatre34@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/T2-Astra/Chatbot-Open-Source-/issues)


---

<div align="center">

**Made with ❤️ by the T2-Astra**

[⭐ Star us on GitHub](https://github.com/T2-Astra/Chatbot-Open-Source-) • [🐦 Follow on Twitter](https://x.com/KrishMhatr14800) •

</div>
