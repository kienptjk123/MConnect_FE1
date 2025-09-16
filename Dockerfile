# Step 1: Build Next.js app
FROM node:18-bullseye-slim AS build

# Set working dir
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# Step 2: Run Next.js app
FROM node:18-bullseye-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy standalone build (minimal files)
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000

# Run Next.js production server
CMD ["node", "server.js"]
