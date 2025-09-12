import authApiRequest from "@/apiRequests/auth";
import { ResetPasswordBodyType } from "@/schemaValidations/auth.schema";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResetPasswordBodyType;
    const { payload } = await authApiRequest.sResetPassword(body);
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Có lỗi xảy ra khi đặt lại mật khẩu",
        },
        {
          status: 500,
        }
      );
    }
  }
}
