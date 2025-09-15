# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY api/package*.json ./api/

# Install dependencies
RUN npm ci --only=production
RUN cd api && npm ci --only=production

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy API
COPY --from=builder /app/api ./api
COPY --from=builder /app/api/node_modules ./api/node_modules

# Expose port
EXPOSE 3001

# Start the API server
CMD ["node", "api/server.js"]