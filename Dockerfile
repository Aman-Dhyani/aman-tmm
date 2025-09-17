# Use Node.js LTS as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build Next.js project
RUN npm run build

# Expose the port (from env)
ENV PORT=3000
EXPOSE 3000

# Start Next.js app
CMD ["npm", "start"]

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider --quiet http://localhost:3000/_next/  || exit 1
