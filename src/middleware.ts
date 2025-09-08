import { Role } from "@/constants/type";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Định nghĩa các đường dẫn cho từng role
const adminPaths = ["/manage/admin"];
const staffPaths = ["/manage/staff"];
const mentorPaths = ["/manage/mentor"];
const menteePaths = ["/manage/mentee"];

// Các đường dẫn cần xác thực
const privatePaths = [
  ...adminPaths,
  ...staffPaths,
  ...mentorPaths,
  ...menteePaths,
];

// Các đường dẫn không cần xác thực (guest có thể truy cập)
const publicPaths = ["/", "/blog", "/contact"];

// Các đường dẫn chỉ dành cho người chưa đăng nhập
const unAuthPaths = ["/login", "/register", "/forgot-password"];

// Mapping role với các đường dẫn được phép truy cập
const rolePermissions = {
  [Role.ADMIN]: [
    ...adminPaths,
    ...staffPaths,
    ...mentorPaths,
    ...menteePaths,
    ...publicPaths,
  ],
  [Role.STAFF]: [...staffPaths, ...publicPaths],
  [Role.MENTOR]: [...mentorPaths, ...publicPaths],
  [Role.MENTEE]: [...menteePaths, ...publicPaths],
  [Role.Guest]: [...publicPaths],
};

// Đường dẫn mặc định cho từng role sau khi login
const defaultRedirectPaths = {
  [Role.ADMIN]: "/manage/admin/dashboard",
  [Role.STAFF]: "/manage/staff/dashboard",
  [Role.MENTOR]: "/manage/mentor/dashboard",
  [Role.MENTEE]: "/manage/mentee/dashboard",
  [Role.Guest]: "/",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const userRole =
    (request.cookies.get("role")?.value as keyof typeof Role) || Role.Guest;

  // 1. Kiểm tra nếu truy cập đường dẫn private mà không có refresh token
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  // 2. Trường hợp đã đăng nhập (có refresh token)
  if (refreshToken) {
    // 2.1 Nếu cố tình vào trang dành cho người chưa đăng nhập
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      // Redirect về dashboard tương ứng với role
      const redirectPath = defaultRedirectPaths[userRole] || "/";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // 2.2 Kiểm tra access token hết hạn cho private paths
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // 2.3 Kiểm tra quyền truy cập dựa trên role
    const allowedPaths =
      rolePermissions[userRole] || rolePermissions[Role.Guest];
    const hasPermission = allowedPaths.some((path) =>
      pathname.startsWith(path)
    );

    if (!hasPermission) {
      // Nếu không có quyền, redirect về dashboard của role hiện tại
      const redirectPath = defaultRedirectPaths[userRole] || "/";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // 2.4 Xử lý trường hợp truy cập /manage mà không có path cụ thể
    if (pathname === "/manage" || pathname === "/manage/") {
      const redirectPath = defaultRedirectPaths[userRole] || "/";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // 2.5 Kiểm tra role-specific restrictions
    // Mentee không được vào trang mentor, staff, admin
    if (userRole === Role.MENTEE) {
      if (
        mentorPaths.some((path) => pathname.startsWith(path)) ||
        staffPaths.some((path) => pathname.startsWith(path)) ||
        adminPaths.some((path) => pathname.startsWith(path))
      ) {
        return NextResponse.redirect(
          new URL(defaultRedirectPaths[Role.MENTEE], request.url)
        );
      }
    }

    // Mentor không được vào trang admin, staff
    if (userRole === Role.MENTOR) {
      if (
        adminPaths.some((path) => pathname.startsWith(path)) ||
        staffPaths.some((path) => pathname.startsWith(path))
      ) {
        return NextResponse.redirect(
          new URL(defaultRedirectPaths[Role.MENTOR], request.url)
        );
      }
    }

    // Staff không được vào trang admin
    if (userRole === Role.STAFF) {
      if (adminPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(
          new URL(defaultRedirectPaths[Role.STAFF], request.url)
        );
      }
    }
  }

  // 3. Trường hợp chưa đăng nhập
  else {
    // Chỉ cho phép truy cập public paths và unAuth paths
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
    const isUnAuthPath = unAuthPaths.some((path) => pathname.startsWith(path));

    if (!isPublicPath && !isUnAuthPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login", "/register", "/forgot-password", "/"],
};
