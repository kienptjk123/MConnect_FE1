import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  RegisterApiPayload,
  RegisterResType,
  VerifyEmailBodyType,
  VerifyEmailResType,
  ResendVerifyEmailResType,
  RefreshTokenBodyType,
  RefreshTokenResType,
  ResetPasswordBodyType,
  ForgotPasswordBodyType,
  VerifyForgotPasswordBodyType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,
  sLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/users/login", body),

  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),

  sRegister: (body: RegisterApiPayload) =>
    http.post<RegisterResType>("/users/register", body),

  sVerifyEmail: (body: VerifyEmailBodyType, accessToken: string) =>
    http.post<VerifyEmailResType>("/users/verify-email", body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  register: (body: RegisterApiPayload) =>
    http.post<RegisterResType>("/api/auth/register", body, {
      baseUrl: "",
    }),

  verifyEmail: (body: VerifyEmailBodyType) =>
    http.post<VerifyEmailResType>("/api/auth/verify-email", body, {
      baseUrl: "",
    }),

  resendVerifyEmail: () =>
    http.post<ResendVerifyEmailResType>("/users/resend-verify-email", {}),
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/auth/refresh-token", body, {
      baseUrl: "",
    }),

  logout: () =>
    http.post("/api/auth/logout", null, {
      baseUrl: "",
    }),

  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  },

  sForgotPassword: (body: ForgotPasswordBodyType) =>
    http.post<ForgotPasswordBodyType>("/users/forgot-password", body),

  sVerifyForgotPassword: (body: VerifyForgotPasswordBodyType) =>
    http.post<VerifyForgotPasswordBodyType>(
      "/users/verify-forgot-password",
      body
    ),

  sResetPassword: (body: ResetPasswordBodyType) =>
    http.post<ResetPasswordBodyType>("/users/reset-password", body),

  forgotPassword: (body: ForgotPasswordBodyType) =>
    http.post("/api/auth/forgot-password", body, {
      baseUrl: "",
    }),

  verifyForgotPassword: (body: VerifyForgotPasswordBodyType) =>
    http.post("/api/auth/verify-forgot-password", body, {
      baseUrl: "",
    }),

  resetPassword: (body: ResetPasswordBodyType) =>
    http.post("/api/auth/reset-password", body, {
      baseUrl: "",
    }),
};

export default authApiRequest;
