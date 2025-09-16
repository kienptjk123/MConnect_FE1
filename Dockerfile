# ==========================
# STEP 1: Build Next.js app
# ==========================
FROM node:20-bullseye-slim AS build

WORKDIR /app

# Env variables cho build
ENV NEXT_PUBLIC_API_ENDPOINT=https://developgenderhealth.io.vn
ENV NEXT_PUBLIC_URL=https://mconnect.io.vn/
ENV NEXT_PUBLIC_SOCKET_URL=https://developgenderhealth.io.vn
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=355941671357-n80rj8ibhat9i0klintrtcuo06go2brd.apps.googleusercontent.com
ENV NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI=https://developgenderhealth.io.vn/users/oauth/google
ENV CLIENT_REDIRECT_CALLBACK=https://mconnect.io.vn/oauth/callback

# Copy package files
COPY package.json package-lock.json ./

# Install deps
RUN npm ci

# Fix cho Tailwind v4
RUN npm install --save-dev @tailwindcss/oxide lightningcss

# Copy toàn bộ source
COPY . .

# Build Next.js
RUN npm run build


# ==========================
# STEP 2: Run Next.js app
# ==========================
FROM node:20-bullseye-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy output từ build stage
COPY --from=build /app ./

# Expose port
EXPOSE 3000

CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
