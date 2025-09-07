import authApiRequest from "@/apiRequests/auth";
import { VerifyForgotPasswordBodyType } from "@/schemaValidations/auth.schema";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyForgotPasswordBodyType;
    const { payload } = await authApiRequest.verifyForgotPassword(body);
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Có lỗi xảy ra khi xác thực mã OTP",
        },
        {
          status: 500,
        }
      );
    }
  }
}
