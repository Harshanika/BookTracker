# Use Node 20 Alpine
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package files for dependency install
COPY package*.json ./

# Install dependencies
RUN npm install

# Install ts-node globally for easier execution
RUN npm install -g ts-node typescript

# Expose port
EXPOSE 4000

# Start the app with ts-node in watch mode
CMD ["npm", "run", "start:dev"]
#CMD ["npx", "ts-node", "--transpile-only", "src/main.ts"]