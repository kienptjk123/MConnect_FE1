# Step 1: Build the Vite frontend
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -f

# Copy source code
COPY . .

# Set environment variables before build
ENV VITE_API_BASE_URL=https://developgenderhealth.io.vn
ENV VITE_GOOGLE_CLIENT_ID=928966535131-jc1iutqk21arfti7slbcc2obd79i4c90.apps.googleusercontent.com
ENV VITE_GOOGLE_CLIENT_SECRET=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
ENV VITE_GOOGLE_REDIRECT_URI=https://developgenderhealth.io.vn/users/oauth/google
ENV VITE_GEMINI_API_KEY=AIzaSyCLxqjPPvMLW5MxTl00S6JUPlSP1tvf3uE

RUN npm run build

# Step 2: Serve the built app using NGINX
FROM nginx:1.23-alpine

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# ✅ Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Optional: Add custom nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Run NGINX
CMD ["nginx", "-g", "daemon off;"]
