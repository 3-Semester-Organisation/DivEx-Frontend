# Step 1: Build stage
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy only package files first for caching purposes
COPY package.json package-lock.json ./

# Clear npm cache (to avoid potential issues with corrupt cache)
RUN npm cache clean --force

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application (ensure the build command is correct)
RUN npm run build

# Step 2: Production stage (optional, for serving static files)
FROM nginx:alpine

# Copy the custom Nginx config file into the container
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the build folder from the build stage to the Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (default for Nginx is 80)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
