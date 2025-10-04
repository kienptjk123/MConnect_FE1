// src/app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import authApiRequest from "@/apiRequests/auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  console.log("🔓 [Logout API] Starting logout process");

  try {
    // Gọi BE để revoke refresh token (không bắt buộc phải thành công)
    if (refreshToken) {
      try {
        await authApiRequest.sLogout({
          refresh_token: refreshToken,
        });
        console.log("🔓 [Logout API] Backend logout successful");
      } catch (backendError) {
        console.warn(
          "🔓 [Logout API] Backend logout failed, continuing with local logout:",
          backendError
        );
        // Continue with local logout even if backend fails
      }
    }

    // Xóa toàn bộ cookies - luôn thành công
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("role");
    cookieStore.delete("user_id");
    cookieStore.delete("verify");

    console.log("🔓 [Logout API] Cookies cleared successfully");

    return Response.json({ message: "Logout success" });
  } catch (error: unknown) {
    console.error("🔓 [Logout API] Unexpected error:", error);

    // Even if there's an error, still try to clear cookies
    try {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      cookieStore.delete("role");
      cookieStore.delete("user_id");
      cookieStore.delete("verify");
    } catch (cookieError) {
      console.error("🔓 [Logout API] Cookie deletion failed:", cookieError);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Logout failed";
    return Response.json({ message: errorMessage }, { status: 500 });
  }
}
