import authApiRequest from "@/apiRequests/auth";
import { VerifyEmailBodyType } from "@/schemaValidations/auth.schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json()) as VerifyEmailBodyType;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json(
      { message: "Access token not found" },
      { status: 401 }
    );
  }

  try {
    const { payload } = await authApiRequest.sVerifyEmail(body, accessToken);
    const newTokens = payload.result;

    const { access_token, refresh_token } = newTokens;
    const decodedAccessToken = jwt.decode(access_token) as {
      exp: number;
      verify?: string;
    };
    const decodedRefreshToken = jwt.decode(refresh_token) as {
      exp: number;
      verify?: string;
    };

    cookieStore.set("accessToken", access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: new Date(decodedAccessToken.exp * 1000),
    });

    cookieStore.set("refreshToken", refresh_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: new Date(decodedRefreshToken.exp * 1000),
    });

    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Có lỗi xảy ra khi verify email",
        },
        {
          status: 500,
        }
      );
    }
  }
}
