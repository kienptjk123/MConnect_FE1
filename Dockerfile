# ==========================
# STEP 1: Build Stage
# ==========================
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Env build-time
ENV NEXT_PUBLIC_API_ENDPOINT=https://developgenderhealth.io.vn
ENV NEXT_PUBLIC_URL=https://mconnect.io.vn/
ENV NEXT_PUBLIC_SOCKET_URL=https://developgenderhealth.io.vn
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=355941671357-n80rj8ibhat9i0klintrtcuo06go2brd.apps.googleusercontent.com
ENV NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI=https://developgenderhealth.io.vn/users/oauth/google

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Fix cho Tailwind v4
RUN npm install --save-dev @tailwindcss/oxide lightningcss

# Copy toàn bộ source code
COPY . .

# Build Next.js (tạo output standalone)
RUN npm run build

# ==========================
# STEP 2: Runtime Stage
FROM node:20-bullseye-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy output standalone
COPY --from=builder /app/.next/standalone ./ 
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port 3000
EXPOSE 3000

# ✅ Chạy đúng server standalone
CMD ["node", "server.js"]
