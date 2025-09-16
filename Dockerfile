# Use the Node.js 20.13.1 base image
FROM node:20.13.1

# Set the working directory inside the container
WORKDIR /src

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire application code
COPY . .

# Build the application
RUN npm run build

# Set environment variable for port
ENV PORT=3030

# Expose the port
EXPOSE 3030

# Command to start the application
CMD ["npm", "run", "start"]
