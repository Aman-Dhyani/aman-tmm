# 1. Base image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# 4. Copy source code
COPY . .

# 5. Build the Next.js project
RUN npm run build

# 6. Expose the port your Next.js app will run on
EXPOSE 3000

# 7. Start the app in production
CMD ["npm", "start"]
