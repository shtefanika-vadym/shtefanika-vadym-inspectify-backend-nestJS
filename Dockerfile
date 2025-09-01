# Use official Node.js LTS image
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Install dependencies using Yarn
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source files
COPY . .

# Build the app
RUN yarn build

# Production image
FROM node:20-alpine AS production
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose port (Railway uses PORT env variable)
EXPOSE 3001

# Start the app
CMD ["node", "dist/main.js"]
