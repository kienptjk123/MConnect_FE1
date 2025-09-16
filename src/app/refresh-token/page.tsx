"use client";

import Loading from "@/app/loading";
import {
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (hasRefreshed.current) return;
    hasRefreshed.current = true;

    const redirectPath = searchParams.get("redirect") || "/";

    const handleTokenRefresh = async () => {
      try {
        const response = await fetch("/api/auth/refresh-token", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.access_token && data.refresh_token) {
            setAccessTokenToLocalStorage(data.access_token);
            setRefreshTokenToLocalStorage(data.refresh_token);
          }

          router.replace(redirectPath);
        } else {
          const errorData = await response.text();
          console.warn("⚠️ Token refresh failed:", errorData);
          router.replace("/login?error=session_expired");
        }
      } catch (error) {
        console.error("❌ Token refresh error:", error);
        router.replace("/login?error=refresh_failed");
      }
    };

    handleTokenRefresh();
  }, [router, searchParams]);

  return <Loading />;
}
