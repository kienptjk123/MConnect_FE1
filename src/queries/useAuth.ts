import authApiRequest from "@/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.login,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.register,
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.verifyEmail,
  });
};

export const useResendVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.resendVerifyEmail,
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.forgotPassword,
  });
};

export const useVerifyForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.verifyForgotPassword,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.resetPassword,
  });
};

export const useSetTokenToCookieMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.setTokenToCookie,
  });
};
