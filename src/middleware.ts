import { Role } from "@/constants/type";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_PATHS = {
  [Role.ADMIN]: ["/manage/admin"],
  [Role.STAFF]: ["/manage/staff"],
  [Role.MENTOR]: ["/manage/mentor"],
  [Role.MENTEE]: ["/manage/mentee"],
  [Role.Guest]: [],
} as const;

// Các đường dẫn public (không cần xác thực)
const PUBLIC_PATHS = ["/", "/blog", "/contact", "/debug", "/profile-test"];

// Các đường dẫn chỉ dành cho người chưa đăng nhập
const UNAUTH_PATHS = ["/login", "/register", "/forgot-password"];

// Đường dẫn mặc định cho từng role
const DEFAULT_DASHBOARDS = {
  [Role.ADMIN]: "/manage/admin/dashboard",
  [Role.STAFF]: "/manage/staff/dashboard",
  [Role.MENTOR]: "/manage/mentor/dashboard",
  [Role.MENTEE]: "/manage/mentee/dashboard",
  [Role.Guest]: "/", // Guest redirect về trang chủ
} as const;

// Tất cả các đường dẫn cần xác thực (loại bỏ empty arrays)
const PRIVATE_PATHS = Object.values(ROLE_PATHS)
  .flat()
  .filter((path) => path);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/refresh-token") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const userRole =
    (request.cookies.get("role")?.value as keyof typeof Role) || Role.Guest;

  // === 1. TRƯỜNG HỢP CHƯA ĐĂNG NHẬP (không có refresh token) ===
  if (!refreshToken) {
    // Nếu truy cập private paths -> redirect login
    if (PRIVATE_PATHS.some((path) => pathname.startsWith(path))) {
      const url = new URL("/login", request.url);
      url.searchParams.set("clearTokens", "true");
      return NextResponse.redirect(url);
    }

    // Cho phép truy cập public paths và unauth paths
    return NextResponse.next();
  }

  // === 2. TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP (có refresh token) ===

  // 2.1 Nếu truy cập trang dành cho người chưa đăng nhập -> redirect dashboard
  if (UNAUTH_PATHS.some((path) => pathname.startsWith(path))) {
    // Guest không có dashboard, redirect về trang chủ
    const dashboard =
      userRole === Role.Guest ? "/" : DEFAULT_DASHBOARDS[userRole] || "/";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // 2.2 Xử lý access token hết hạn cho private paths
  if (PRIVATE_PATHS.some((path) => pathname.startsWith(path)) && !accessToken) {
    // Redirect để refresh token, giữ lại path hiện tại
    const url = new URL("/refresh-token", request.url);
    url.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // 2.3 Kiểm tra quyền truy cập theo role
  if (PRIVATE_PATHS.some((path) => pathname.startsWith(path))) {
    // Guest không có quyền truy cập private paths
    if (userRole === Role.Guest) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname + request.nextUrl.search);
      return NextResponse.redirect(url);
    }

    const allowedPaths = ROLE_PATHS[userRole] || [];
    const hasPermission = allowedPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (!hasPermission) {
      const dashboard = DEFAULT_DASHBOARDS[userRole] || "/";
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
  }

  // 2.4 Redirect /manage -> dashboard tương ứng
  if (pathname === "/manage" || pathname === "/manage/") {
    const dashboard = DEFAULT_DASHBOARDS[userRole] || "/";
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  return NextResponse.next();
}

// middleware.ts
export const config = {
  matcher: [
    // Chạy middleware cho mọi path TRỪ các path/đuôi sau:
    // - api, _next/*, favicon/sitemap/robots/manifest
    // - thư mục static phổ biến (models, draco, basis, textures, assets, images, fonts, videos, static, wasm…)
    // - các file đuôi tĩnh (glb/gltf/bin/ktx2/basis/wasm và hình/vid/audio…)
    "/((?!api|_next/static|_next/image|_next/data|favicon\\.ico|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|assets|static|models|model|draco|basis|textures|images|img|fonts|videos|media|wasm)(?!.*\\.(?:glb|gltf|bin|ktx2|basis|wasm|ico|png|jpg|jpeg|gif|webp|avif|svg|mp4|webm|mp3|wav|ogg|txt|xml|json|map)$).*)",
  ],
};
