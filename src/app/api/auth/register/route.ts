import authApiRequest from "@/apiRequests/auth";
import { RegisterApiPayload } from "@/schemaValidations/auth.schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json()) as RegisterApiPayload;
  const cookieStore = await cookies();

  try {
    const { payload } = await authApiRequest.sRegister(body);
    const { access_token, refresh_token } = payload.result;

    const decodedAccessToken = jwt.decode(access_token) as { exp: number };
    const decodedRefreshToken = jwt.decode(refresh_token) as { exp: number };

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

    return Response.json(payload);
  } catch (error) {
    console.error("❌ Register API error:", error);

    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    }

    // ✅ vẫn trả JSON thay vì rỗng
    return Response.json({ message: "Có lỗi xảy ra" }, { status: 500 });
  }
}
