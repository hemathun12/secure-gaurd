# Use Node.js base image
FROM node:20-slim

# Create and define the working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Set environment variables (Defaults for Docker)
ENV PORT=5000
ENV NODE_ENV=production

# Expose the API port
EXPOSE 5000

# Command to start the server
CMD ["node", "src/app.js"]
