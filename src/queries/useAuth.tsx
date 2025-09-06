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
