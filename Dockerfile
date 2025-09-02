# Use official Node.js LTS image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files, Prisma schema, and scripts before install
COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma
COPY scripts ./scripts
RUN yarn install

# Copy source files
COPY . .

# Build the app
RUN yarn build

# Production image
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Start the app
CMD ["node", "dist/main.js"]
