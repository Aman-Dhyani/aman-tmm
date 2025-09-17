# 1. Base image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# 4. Copy source code
COPY . .

# 5. Build Next.js project
# (env vars from docker-compose will be available here too)
RUN npm run build

# 6. Expose port
EXPOSE 3000

# 7. Start app
CMD ["npm", "start"]
