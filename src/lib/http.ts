/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import envConfig from "@/config";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  normalizePath,
  removeTokensFromLocalStorage,
  setAccessTokenToLocalStorage,
  setIdToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({
    status,
    payload,
    message = "Lỗi HTTP",
  }: {
    status: number;
    payload: any;
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: typeof ENTITY_ERROR_STATUS;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload, message: "Lỗi thực thể" });
    this.status = status;
    this.payload = payload;
  }
}

let clientLogoutRequest: null | Promise<any> = null;
let isRedirectingToRefresh = false; // Flag to prevent multiple redirects

const isClient = typeof window !== "undefined";
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isClient) {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = `${baseUrl}/${normalizePath(url)}`;

  let fetchResponse: globalThis.Response;
  let payload: Response;

  try {
    fetchResponse = await fetch(fullUrl, {
      ...options,
      headers: {
        ...baseHeaders,
        ...options?.headers,
      } as any,
      body,
      method,
    });
  } catch (networkError) {
    throw new Error(
      `Failed to fetch: ${
        networkError instanceof Error ? networkError.message : "Network error"
      }`
    );
  }

  try {
    payload = await fetchResponse.json();
  } catch (jsonError) {
    throw new Error(
      `Invalid JSON response: ${
        jsonError instanceof Error ? jsonError.message : "JSON parsing error"
      }`
    );
  }

  const data = {
    status: fetchResponse.status,
    payload,
  };
  // Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component
  if (!fetchResponse.ok) {
    if (fetchResponse.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (fetchResponse.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient) {
        console.log("🚨 [HTTP] 401 Error detected:", {
          url: fullUrl,
          method,
        });

        // Check if we have a refresh token before logging out
        const refreshToken = getRefreshTokenFromLocalStorage();
        const currentPath = window.location.pathname;

        console.log("🔍 [HTTP] Token status check:", {
          hasRefreshToken: !!refreshToken,
          refreshTokenLength: refreshToken ? refreshToken.length : 0,
          currentPath,
          isOnRefreshTokenPage: currentPath.includes("/refresh-token"),
        });

        // Prevent redirect loop - don't redirect if already on refresh-token page or already redirecting
        if (
          refreshToken &&
          !currentPath.includes("/refresh-token") &&
          !isRedirectingToRefresh
        ) {
          // Set flag to prevent multiple redirects
          isRedirectingToRefresh = true;

          // We have a refresh token, redirect to refresh-token page to get new access token
          // Preserve the current page in the redirect parameter
          const fullCurrentPath =
            window.location.pathname + window.location.search;
          const refreshUrl = `/refresh-token?redirect=${encodeURIComponent(
            fullCurrentPath
          )}`;

          // Use setTimeout to ensure the redirect happens after this function returns
          setTimeout(() => {
            window.location.href = refreshUrl;
          }, 0);

          // Return a rejected promise to stop further execution
          return Promise.reject(new Error("Redirecting to refresh token page"));
        }

        // If we're already redirecting or on refresh page, don't proceed with logout
        if (isRedirectingToRefresh || currentPath.includes("/refresh-token")) {
          return Promise.reject(new Error("Token refresh in progress"));
        }

        // No refresh token available or already on refresh page, proceed with logout
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: null, // Logout mình sẽ cho phép luôn luôn thành công
            headers: {
              ...baseHeaders,
            } as any,
          });
          try {
            await clientLogoutRequest;
          } catch (error) {
          } finally {
            removeTokensFromLocalStorage();
            clientLogoutRequest = null;
            // Redirect về trang login có thể dẫn đến loop vô hạn
            // Nếu không không được xử lý đúng cách
            // Vì nếu rơi vào trường hợp tại trang Login, chúng ta có gọi các API cần access token
            // Mà access token đã bị xóa thì nó lại nhảy vào đây, và cứ thế nó sẽ bị lặp
            location.href = "/login";
          }
        }
      } else {
        // Đây là trường hợp khi mà chúng ta vẫn còn access token (còn hạn)
        // Và chúng ta gọi API ở Next.js Server (Route Handler , Server Component) đến Server Backend
        const accessToken = (options?.headers as any)?.Authorization.split(
          "Bearer "
        )[1];
        redirect(`/logout?accessToken=${accessToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }
  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (isClient) {
    const normalizeUrl = normalizePath(url);
    if (
      ["api/auth/login", "api/auth/register", "api/guest/auth/login"].includes(
        normalizeUrl
      )
    ) {
      const { access_token, refresh_token } = (payload as LoginResType).result;
      setAccessTokenToLocalStorage(access_token);
      setRefreshTokenToLocalStorage(refresh_token);

      // Reset redirect flag when tokens are successfully set
      if (isRedirectingToRefresh) {
        isRedirectingToRefresh = false;
      }
    } else if (
      ["api/auth/token", "api/auth/refresh-token"].includes(normalizeUrl)
    ) {
      const { access_token, refresh_token } = payload as {
        access_token: string;
        refresh_token: string;
      };

      const decodedAccessToken = jwt.decode(access_token) as {
        exp?: number;
        user_id?: number;
        role?: string;
        verify?: string;
      } | null;

      if (decodedAccessToken?.user_id) {
        setIdToLocalStorage(decodedAccessToken.user_id.toString());
      }
      setAccessTokenToLocalStorage(access_token);
      setRefreshTokenToLocalStorage(refresh_token);

      // Reset redirect flag when tokens are successfully refreshed
      if (isRedirectingToRefresh) {
        isRedirectingToRefresh = false;
      }
    } else if (["api/auth/verify-email"].includes(normalizeUrl)) {
      // Handle verify email response - may contain new tokens
      if (
        (payload as any).result?.access_token &&
        (payload as any).result?.refresh_token
      ) {
        setAccessTokenToLocalStorage((payload as any).result.access_token);
        setRefreshTokenToLocalStorage((payload as any).result.refresh_token);
      }
    } else if (
      ["api/auth/logout", "api/guest/auth/logout"].includes(normalizeUrl)
    ) {
      removeTokensFromLocalStorage();
      // Reset redirect flag on logout
      isRedirectingToRefresh = false;
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  gets<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, { ...options, body });
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
  patch<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body">
  ) {
    return request<Response>("PATCH", url, { ...options, body });
  },
};

export default http;
