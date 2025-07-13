# Step 1: Build the Vite frontend
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -f

# Copy source code
COPY . .

RUN npm run build

# Step 2: Serve the built app using NGINX
FROM nginx:1.23-alpine

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets
COPY --from=build /app/out /usr/share/nginx/html

# ✅ Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Optional: Add custom nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Run NGINX
CMD ["nginx", "-g", "daemon off;"]
