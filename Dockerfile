# ==========================
# STEP 1: Build Next.js app
# ==========================
FROM node:20-bullseye-slim AS build

WORKDIR /app

ENV NEXT_PUBLIC_API_ENDPOINT=https://developgenderhealth.io.vn/
ENV NEXT_PUBLIC_URL=http://localhost:3000
ENV NEXT_PUBLIC_SOCKET_URL=https://developgenderhealth.io.vn/
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=355941671357-n80rj8ibhat9i0klintrtcuo06go2brd.apps.googleusercontent.com
ENV NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI=https://developgenderhealth.io.vn/users/oauth/google
ENV CLIENT_REDIRECT_CALLBACK=http://localhost:3000/oauth/callback

# Copy package files
COPY package.json package-lock.json ./

# Cài dependencies
RUN npm ci

# Fix cho Tailwind v4: oxide binary
RUN npm install --save-dev @tailwindcss/oxide
RUN npm install --save-dev lightningcss


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
