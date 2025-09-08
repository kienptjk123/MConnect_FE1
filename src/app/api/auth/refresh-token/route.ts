import authApiRequest from "@/apiRequests/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const currentRole = cookieStore.get("role")?.value; // Giữ role hiện tại

  if (!refreshToken) {
    return Response.json(
      { message: "No refresh token found" },
      { status: 401 }
    );
  }

  try {
    const result = await authApiRequest.sRefreshToken({
      refreshToken,
    });

    const { access_token: accessToken, refresh_token: newRefreshToken } =
      result.payload.result;

    // Decode tokens to get expiry times
    const decodedAccessToken = jwt.decode(accessToken) as jwt.JwtPayload | null;
    const decodedRefreshToken = jwt.decode(
      newRefreshToken
    ) as jwt.JwtPayload | null;

    const accessTokenExpiry = decodedAccessToken?.exp
      ? decodedAccessToken.exp * 1000
      : Date.now() + 15 * 60 * 1000; // 15 minutes default
    const refreshTokenExpiry = decodedRefreshToken?.exp
      ? decodedRefreshToken.exp * 1000
      : Date.now() + 24 * 60 * 60 * 1000; // 24 hours default

    const response = Response.json(result.payload.result);

    // Set new tokens in HTTP-only cookies
    response.headers.set(
      "Set-Cookie",
      `accessToken=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(
        (accessTokenExpiry - Date.now()) / 1000
      )}`
    );
    response.headers.append(
      "Set-Cookie",
      `refreshToken=${newRefreshToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(
        (refreshTokenExpiry - Date.now()) / 1000
      )}`
    );

    // Maintain role cookie if it exists
    if (currentRole) {
      response.headers.append(
        "Set-Cookie",
        `role=${currentRole}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(
          (refreshTokenExpiry - Date.now()) / 1000
        )}`
      );
    }

    return response;
  } catch {
    // If refresh token is invalid, clear the cookies
    const response = Response.json(
      { message: "Invalid refresh token" },
      { status: 401 }
    );

    response.headers.set(
      "Set-Cookie",
      "accessToken=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
    );
    response.headers.append(
      "Set-Cookie",
      "refreshToken=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
    );
    response.headers.append(
      "Set-Cookie",
      "role=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
    );

    return response;
  }
}
