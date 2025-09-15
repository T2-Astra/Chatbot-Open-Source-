# 🚀 Deployment Guide

This guide covers multiple deployment options for your Chatbot Open Source project.

## 🌟 Option 1: Vercel (Full Stack - Recommended)

Deploy both frontend and backend to Vercel using serverless functions.

### Step 1: Prepare Your Project

Make sure your project is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

#### Method A: Using Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Import your repository**: `T2-Astra/Chatbot-Open-Source-`
5. **Configure the project**:
   - Framework Preset: `Vite`
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Add Environment Variables**:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbot
   VITE_API_URL=https://your-app.vercel.app/api
   ```

7. **Click "Deploy"**

#### Method B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# ? Set up and deploy "~/your-project"? [Y/n] y
# ? Which scope do you want to deploy to? Your Name
# ? Link to existing project? [y/N] n
# ? What's your project's name? chatbot-open-source
# ? In which directory is your code located? ./

# Deploy to production
vercel --prod
```

### Step 3: Configure Environment Variables

After deployment, add your environment variables in the Vercel dashboard:

1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
VITE_GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbot
VITE_API_URL=https://your-app.vercel.app/api
NODE_ENV=production
```

### Step 4: Redeploy

After adding environment variables, trigger a new deployment:

```bash
vercel --prod
```

Or push a new commit to trigger automatic deployment.

---

## 🌟 Option 2: Separate Frontend (Vercel) + Backend (Railway)

Deploy frontend and backend separately for better scalability.

### Frontend on Vercel

1. **Create a separate branch for frontend-only**:
```bash
git checkout -b frontend-only
# Remove api/ folder from this branch
git rm -r api/
git commit -m "Frontend-only deployment"
git push origin frontend-only
```

2. **Deploy to Vercel** using the frontend-only branch

3. **Environment Variables**:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_API_URL=https://your-api.railway.app/api
```

### Backend on Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign in with GitHub**
3. **Create new project from GitHub repo**
4. **Select your repository**
5. **Configure deployment**:
   - Root Directory: `api/`
   - Build Command: `npm install`
   - Start Command: `npm start`

6. **Environment Variables**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbot
NODE_ENV=production
PORT=3001
```

---

## 🌟 Option 3: Docker Deployment

### Local Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Deploy to DigitalOcean App Platform

1. **Create account at [DigitalOcean](https://digitalocean.com)**
2. **Go to App Platform**
3. **Create App from GitHub**
4. **Configure services**:
   - **Web Service**: Frontend (Dockerfile.frontend)
   - **Backend Service**: API (Dockerfile)
   - **Database**: MongoDB (managed database)

---

## 🌟 Option 4: Netlify + Render

### Frontend on Netlify

1. **Go to [netlify.com](https://netlify.com)**
2. **Connect GitHub repository**
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Backend on Render

1. **Go to [render.com](https://render.com)**
2. **Create Web Service from GitHub**
3. **Configure**:
   - Root Directory: `api/`
   - Build Command: `npm install`
   - Start Command: `npm start`

---

## 🔧 Environment Variables Reference

### Required Variables

```env
# Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key

# AI Service
VITE_GEMINI_API_KEY=your_gemini_api_key

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbot

# API Endpoint (adjust based on deployment)
VITE_API_URL=https://your-api-domain.com/api
```

### Optional Variables

```env
# Development
NODE_ENV=production
PORT=3001

# Logging
LOG_LEVEL=info
```

---

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (use 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **API Not Working**
   - Verify CORS settings
   - Check environment variables
   - Ensure MongoDB connection string is correct

3. **Authentication Issues**
   - Verify Clerk publishable key
   - Check domain settings in Clerk dashboard
   - Ensure HTTPS in production

### Debugging Steps

1. **Check deployment logs**
2. **Verify environment variables**
3. **Test API endpoints manually**
4. **Check browser console for errors**

---

## 📊 Performance Optimization

### Frontend

- Enable Vercel's Edge Network
- Use Vercel Analytics
- Optimize images and assets
- Enable compression

### Backend

- Use connection pooling for MongoDB
- Implement caching strategies
- Monitor API response times
- Set up error tracking (Sentry)

### Database

- Create proper indexes
- Monitor query performance
- Use MongoDB Atlas performance advisor
- Set up automated backups

---

## 🔒 Security Checklist

- [ ] Environment variables are secure
- [ ] API endpoints are protected
- [ ] CORS is properly configured
- [ ] MongoDB access is restricted
- [ ] HTTPS is enabled
- [ ] Authentication is working
- [ ] User data is isolated

---

## 📈 Monitoring

### Vercel

- Use Vercel Analytics
- Monitor function execution times
- Check error rates

### MongoDB Atlas

- Monitor database performance
- Set up alerts for high usage
- Review slow queries

### Custom Monitoring

```javascript
// Add to your API for basic monitoring
console.log(`API Request: ${req.method} ${req.url} - ${new Date().toISOString()}`);
```

---

## 🎉 Post-Deployment

After successful deployment:

1. **Test all functionality**
2. **Set up monitoring**
3. **Configure custom domain** (optional)
4. **Set up CI/CD** for automatic deployments
5. **Monitor performance and errors**

Your chatbot is now live! 🚀