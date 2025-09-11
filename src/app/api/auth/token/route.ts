import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    access_token: string;
    refresh_token: string;
    role: string;
  };
  const { access_token, refresh_token, role } = body;
  const cookieStore = await cookies();
  try {
    const decodedAccessToken = jwt.decode(access_token) as {
      exp?: number;
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

    return Response.json(body);
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
