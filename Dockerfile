# 1. Base image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Install wget (needed for healthcheck)
RUN apk add --no-cache wget

# 4. Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# 5. Copy source code
COPY . .

# 6. Build Next.js project
RUN npm run build

# 7. Expose port
EXPOSE 3000

# 8. Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# 9. Start app
CMD ["npm", "start"]
