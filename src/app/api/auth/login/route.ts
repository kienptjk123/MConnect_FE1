import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  const cookieStore = await cookies();
  try {
    const { payload } = await authApiRequest.sLogin(body);

    const { access_token, refresh_token, role } = payload.result;

    const decodedAccessToken = jwt.decode(access_token) as {
      exp?: number;
      user_id?: number;
      role?: string;
      verify?: string;
    } | null;
    const decodedRefreshToken = jwt.decode(refresh_token) as {
      exp?: number;
    } | null;

    cookieStore.set("accessToken", access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: decodedAccessToken?.exp
        ? new Date(decodedAccessToken.exp * 1000)
        : undefined,
    });

    cookieStore.set("refreshToken", refresh_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: decodedRefreshToken?.exp
        ? new Date(decodedRefreshToken.exp * 1000)
        : undefined,
    });

    cookieStore.set("role", role, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: decodedRefreshToken?.exp
        ? new Date(decodedRefreshToken.exp * 1000)
        : undefined,
    });

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

    return Response.json(payload);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Login failed";
    return Response.json(
      {
        message: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}
