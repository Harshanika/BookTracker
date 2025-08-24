# Use the official Node.js 20 Alpine image
FROM node:20-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Expose port 3000 (React dev server default)
EXPOSE 3000

# Run the app using the npm start script
CMD ["npm", "start"]
