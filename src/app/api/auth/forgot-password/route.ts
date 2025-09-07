import authApiRequest from "@/apiRequests/auth";
import { ForgotPasswordBodyType } from "@/schemaValidations/auth.schema";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ForgotPasswordBodyType;
    const { payload } = await authApiRequest.forgotPassword(body);
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Có lỗi xảy ra khi gửi yêu cầu quên mật khẩu",
        },
        {
          status: 500,
        }
      );
    }
  }
}
