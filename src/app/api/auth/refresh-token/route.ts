import authApiRequest from "@/apiRequests/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const url = new URL(request.url);
  const returnTokenData = url.searchParams.get("returnData") === "true";

  if (!refreshToken) {
    return Response.json(
      { message: "No refresh token found" },
      { status: 401 }
    );
  }

  try {
    const result = await authApiRequest.sRefreshToken({
      refresh_token: refreshToken,
    });

    const { access_token, refresh_token: newRefreshToken } =
      result.payload.result;

    // Decode tokens to get user info and expiry times
    const decodedAccessToken = jwt.decode(access_token) as {
      exp?: number;
      user_id?: number;
      role?: string;
      verify?: string;
    } | null;
    const decodedRefreshToken = jwt.decode(newRefreshToken) as {
      exp?: number;
    } | null;

    // Set accessToken cookie
    cookieStore.set("accessToken", access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: decodedAccessToken?.exp
        ? new Date(decodedAccessToken.exp * 1000)
        : undefined,
    });

    // Set refreshToken cookie
    cookieStore.set("refreshToken", newRefreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: decodedRefreshToken?.exp
        ? new Date(decodedRefreshToken.exp * 1000)
        : undefined,
    });

    // Set role cookie
    if (decodedAccessToken?.role) {
      cookieStore.set("role", decodedAccessToken.role, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: decodedRefreshToken?.exp
          ? new Date(decodedRefreshToken.exp * 1000)
          : undefined,
      });
    }

    // Set user_id from decoded access token
    if (decodedAccessToken?.user_id) {
      cookieStore.set("user_id", decodedAccessToken.user_id.toString(), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: decodedRefreshToken?.exp
          ? new Date(decodedRefreshToken.exp * 1000)
          : undefined,
      });
    }

    // Set verify status from decoded access token
    if (decodedAccessToken?.verify) {
      cookieStore.set("verify", decodedAccessToken.verify, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: decodedRefreshToken?.exp
          ? new Date(decodedRefreshToken.exp * 1000)
          : undefined,
      });
    }

    // Return different response based on parameter
    if (returnTokenData) {
      // Return tokens for localStorage setting (like login response)
      return Response.json({
        message: "Tokens refreshed successfully",
        result: {
          access_token,
          refresh_token: newRefreshToken,
          role: decodedAccessToken?.role,
        },
      });
    } else {
      // Original behavior - just return the result
      return Response.json(result.payload.result);
    }
  } catch (error: unknown) {
    // If refresh token is invalid, clear all cookies
    cookieStore.set("accessToken", "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Expire immediately
    });

    cookieStore.set("refreshToken", "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Expire immediately
    });

    cookieStore.set("role", "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Expire immediately
    });

    cookieStore.set("user_id", "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Expire immediately
    });

    cookieStore.set("verify", "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Expire immediately
    });

    const errorMessage =
      error instanceof Error ? error.message : "Invalid refresh token";

    return Response.json({ message: errorMessage }, { status: 401 });
  }
}
