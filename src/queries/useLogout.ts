import authApiRequest from "@/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.logout,
    onSuccess: () => {
      console.log("🔓 [Frontend] Logout successful, clearing localStorage");

      localStorage.clear();
      window.location.replace("/login");
    },
    onError: (error) => {
      console.error("🔓 [Frontend] Logout error:", error);
      // Even if logout fails, clear localStorage and redirect
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");
      localStorage.removeItem("verify");

      window.location.replace("/login");
    },
  });
};
