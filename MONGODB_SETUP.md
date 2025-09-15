# MongoDB Setup Guide

This guide will help you set up MongoDB for the Chatbot Open Source project.

## Option 1: MongoDB Atlas (Recommended)

MongoDB Atlas is a cloud-hosted MongoDB service that's perfect for production deployments.

### Step 1: Create an Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Verify your email address

### Step 2: Create a Cluster

1. Choose "Build a Database"
2. Select "M0 Sandbox" (Free tier)
3. Choose your preferred cloud provider and region
4. Name your cluster (e.g., "chatbot-cluster")
5. Click "Create Cluster"

### Step 3: Create a Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username and secure password
5. Set database user privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
4. For production, add specific IP addresses
5. Click "Confirm"

### Step 5: Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `chatbot`

Example connection string:
```
mongodb+srv://username:password@chatbot-cluster.xxxxx.mongodb.net/chatbot?retryWrites=true&w=majority
```

## Option 2: Local MongoDB

For development, you can run MongoDB locally.

### Install MongoDB

#### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ubuntu/Debian
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Windows
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Start MongoDB as a Windows service

### Local Connection String

For local MongoDB, use:
```
mongodb://localhost:27017/chatbot
```

## Option 3: Docker MongoDB

Run MongoDB in a Docker container:

```bash
# Run MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -e MONGO_INITDB_DATABASE=chatbot \
  -v mongodb_data:/data/db \
  mongo:7

# Connection string for Docker
mongodb://admin:password@localhost:27017/chatbot?authSource=admin
```

## Environment Configuration

Add your MongoDB connection string to your `.env` file:

```env
# For Atlas or remote MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbot

# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/chatbot

# For Docker MongoDB
MONGODB_URI=mongodb://admin:password@localhost:27017/chatbot?authSource=admin
```

## Database Schema

The application will automatically create the following collections:

### `chats` Collection
```javascript
{
  _id: ObjectId,
  title: String,
  userId: String,
  createdAt: Date,
  updatedAt: Date,
  messages: [
    {
      _id: ObjectId,
      chatId: String,
      content: String,
      role: String, // 'user' or 'assistant'
      timestamp: Date
    }
  ]
}
```

## Testing Your Connection

You can test your MongoDB connection using the MongoDB shell or a GUI tool like MongoDB Compass.

### Using MongoDB Shell
```bash
# Connect to Atlas
mongosh "mongodb+srv://cluster.mongodb.net/chatbot" --username your-username

# Connect to local
mongosh "mongodb://localhost:27017/chatbot"
```

### Using MongoDB Compass
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Enter your connection string
3. Connect and explore your database

## Production Considerations

### Security
- Use strong passwords for database users
- Restrict network access to specific IP addresses
- Enable authentication and authorization
- Use SSL/TLS connections

### Performance
- Create indexes on frequently queried fields
- Monitor database performance with Atlas monitoring
- Consider sharding for large datasets

### Backup
- Enable automated backups in Atlas
- Set up point-in-time recovery
- Test backup restoration procedures

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check network access settings in Atlas
   - Verify firewall settings for local MongoDB

2. **Authentication Failed**
   - Verify username and password
   - Check database user permissions

3. **Database Not Found**
   - The database will be created automatically when first accessed
   - Ensure the database name in the connection string is correct

4. **SSL/TLS Errors**
   - For Atlas, ensure `ssl=true` in connection string
   - For local development, you can disable SSL

### Getting Help

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Support](https://support.mongodb.com/)
- [MongoDB Community Forums](https://community.mongodb.com/)

## Next Steps

Once MongoDB is set up:

1. Update your `.env` file with the connection string
2. Start the API server: `npm run api:dev`
3. Start the frontend: `npm run dev`
4. Test the application by creating a chat and sending messages

Your chat data will now be persisted in MongoDB! 🎉