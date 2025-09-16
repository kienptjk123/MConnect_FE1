# ==========================
# STEP 1: Build Next.js app
# ==========================
FROM node:20-bullseye-slim AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Cài dependencies
RUN npm ci

# Fix cho Tailwind v4: oxide binary
RUN npm install --save-dev @tailwindcss/oxide

# Copy toàn bộ source code
COPY . .

# Build Next.js
RUN npm run build


# ==========================
# STEP 2: Run Next.js app
# ==========================
FROM node:20-bullseye-slim AS runner

WORKDIR /app

# Copy từ build stage
COPY --from=build /app ./

# Expose cổng 3000
EXPOSE 3000

# Start app
CMD ["npm", "start"]
