# Use a base image with Node.js
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Install GCC, Python, and other needed compilers
RUN apt-get update && apt-get install -y gcc python3 python3-pip build-essential

# Copy the rest of the application
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
