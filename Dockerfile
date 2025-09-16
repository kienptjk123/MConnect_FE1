# Step 1: Build Next.js app
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build Next.js
COPY . .
RUN npm run build

# Step 2: Run Next.js app
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000
CMD ["npm", "start"]
