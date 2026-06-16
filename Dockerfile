FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend code
COPY . .

EXPOSE 5173

# Vite needs --host to be accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host"]