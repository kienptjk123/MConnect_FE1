import z from "zod";

export const LoginBody = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const RegisterBody = z
  .object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirm_password: z
      .string()
      .min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
    dateOfBirth: z
      .string()
      .min(1, "Vui lòng chọn ngày sinh")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh phải có định dạng YYYY-MM-DD"),
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  })
  .refine(
    (data) => {
      // Validate that dateOfBirth is a valid date
      const date = new Date(data.dateOfBirth);
      return !isNaN(date.getTime());
    },
    {
      message: "Ngày sinh không hợp lệ",
      path: ["dateOfBirth"],
    }
  );

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

// API payload type with snake_case for backend
export type RegisterApiPayload = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  date_of_birth: string;
};

export const LoginRes = z.object({
  message: z.string(),
  result: z.object({
    role: z.enum(["MENTOR", "MENTEE", "STAFF", "ADMIN"]),
    access_token: z.string(),
    refresh_token: z.string(),
  }),
});

export type LoginResType = z.TypeOf<typeof LoginRes>;

export const RegisterRes = z.object({
  message: z.string(),
  data: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
  }),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const VerifyEmailBody = z.object({
  email_verify_token: z.string().min(1, "Mã OTP không được để trống"),
});

export type VerifyEmailBodyType = z.TypeOf<typeof VerifyEmailBody>;

// Removed VerifyEmailApiBody - no longer needed since we only use email_verify_token

export const VerifyEmailRes = z.object({
  message: z.string(),
  result: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
  }),
});

export type VerifyEmailResType = z.TypeOf<typeof VerifyEmailRes>;

export const ResendVerifyEmailRes = z.object({
  message: z.string(),
});

export type ResendVerifyEmailResType = z.TypeOf<typeof ResendVerifyEmailRes>;

export const RefreshTokenBody = z.object({
  refreshToken: z.string(),
});

export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>;

export const RefreshTokenRes = z.object({
  message: z.string(),
  result: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
  }),
});

export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>;

export const ForgotPasswordBody = z.object({
  email: z.string().email("Invalid email"),
});

export type ForgotPasswordBodyType = z.TypeOf<typeof ForgotPasswordBody>;

export const verifyForgotPasswordBody = z.object({
  otp: z.string().min(1, "OTP code is required"),
});

export type VerifyForgotPasswordBodyType = z.TypeOf<
  typeof verifyForgotPasswordBody
>;

export const ResetPasswordBody = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Password must contain at least 1 number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least 1 special character"
      ),
    confirm_password: z
      .string()
      .min(6, "Password confirmation must be at least 6 characters"),
    otp: z.string().min(1, "OTP code is required"),
  })
  .strict()
  .refine((data) => data.password === data.confirm_password, {
    message: "Password confirmation does not match",
    path: ["confirm_password"],
  });

export type ResetPasswordBodyType = z.TypeOf<typeof ResetPasswordBody>;
