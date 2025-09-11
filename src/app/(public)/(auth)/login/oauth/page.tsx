"use client";

import { useAppContext } from "@/components/app-provider";
import { toast } from "@/components/ui/use-toast";
import { decodeToken } from "@/lib/utils";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OauthPage() {
  const { mutateAsync } = useSetTokenToCookieMutation();
  const router = useRouter();
  const { setRole } = useAppContext();
  const searchParams = useSearchParams();
  const access_token = searchParams.get("access_token");
  const refresh_token = searchParams.get("refresh_token");
  useEffect(() => {
    if (access_token && refresh_token) {
      const data = decodeToken(access_token);
      const role = data.role;
      setRole(role as any);
      mutateAsync({
        access_token: access_token,
        refresh_token: refresh_token,
        role: role,
      }).then(() => {
        router.push("/manage/mentee/dashboard");
      });
    } else {
      toast({
        title: "Lỗi đăng nhập",
        description: "Đăng nhập thất bại. ",
        variant: "destructive",
      });
    }
  }, [access_token, refresh_token, setRole, router, mutateAsync]);
  return null;
}
