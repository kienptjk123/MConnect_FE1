# Step 1: Build static Next.js app
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install -f

# Copy full source code
COPY . .


# Build and export static site
RUN npm run build

# Step 2: Serve exported static files with Nginx
FROM nginx:1.23-alpine

# Clear default nginx content
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/out /usr/share/nginx/html

# Optional: Use custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose web port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
