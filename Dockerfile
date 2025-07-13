# Step 1: Build static Next.js app
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install -f

# Copy full source code
COPY . .

# Build & export static files to /out
RUN npm run build && npx next export

# Step 2: Serve exported static files with nginx
FROM nginx:1.23-alpine

# Clear default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy exported site
COPY --from=build /app/out /usr/share/nginx/html

# Optional: Use custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose web port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
