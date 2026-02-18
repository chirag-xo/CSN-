FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install system dependencies
RUN apk add --no-cache openssl

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (Cloud Run sets PORT env var, but good practice to document)
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
