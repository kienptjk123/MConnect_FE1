"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/queries/useAuth";
import { toast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "@/components/app-provider";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import envConfig from "@/config";
import notificationService from "@/services/notification-service";

const getOauthGoogleUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: envConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

const googleAuthUrl = getOauthGoogleUrl();

export default function LoginForm() {
  const loginMutation = useLoginMutation();
  const searchParams = useSearchParams();
  const clearTokens = searchParams.get("clearTokens");
  const { setRole } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (clearTokens) {
      setRole();
    }
  }, [clearTokens, setRole]);

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) {
      console.warn("Login already in progress");
      return;
    }
    try {
      const result = await loginMutation.mutateAsync(data);
      toast({
        description: result.payload.message,
      });
      setRole(
        result.payload.result.role as "MENTOR" | "MENTEE" | "STAFF" | "ADMIN"
      );
      // if (result.payload.result.access_token) {
      //   const notificationResult =
      //     await notificationService.initializeNotifications();

      //   if (notificationResult.success) {
      //     console.log("Notifications initialized successfully");
      //   }
      // }

      router.push("/manage/mentee/dashboard");
    } catch (error) {
      console.log(error);
      toast({
        title: "Lỗi đăng nhập",
        description:
          "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-[#fae7e7]/50 rounded-[2rem] backdrop-blur-none border-0 w-[1000px] shadow-none py-3 px-10">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-3xl font-bold text-gray-800 text-start">
          MENTEE / MENTOR LOGIN
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log(err);
            })}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="abcd@gmail.com"
                      className="w-full h-10 border border-[#60A6EB] rounded-md bg-white mt-2"
                      required
                      {...field}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="*******"
                        className="h-10 border border-[#60A6EB] rounded-md bg-white mt-2"
                        required
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-[#60A6EB] rounded"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-black font-medium"
                >
                  Remember Me
                </label>
              </div>

              <Link
                href="/forgot-password"
                className="text-sm text-black font-medium"
              >
                Forgot Your Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md text-sm transition duration-200"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Đang đăng nhập..." : "Sign in"}
            </Button>

            <div className="text-center space-y-2">
              <div className="flex items-center mb-2 mt-1">
                <div className="flex-1 h-1 w-1 bg-gray-300"></div>
                <div className="text-gray-400 font-bold text-lg px-3">or</div>
                <div className="flex-1 h-1 w-1 bg-gray-300"></div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center justify-center bg-white border hover:bg-white/85 border-gray-300 text-gray-800 w-full py-3 text-sm rounded-lg mr-2">
                  <Image
                    src="/images/google-logo-search-new-svgrepo-com.svg"
                    alt="Google"
                    width={16}
                    height={16}
                    className="mr-2"
                  />
                  <Link href={googleAuthUrl}>
                    <div className="">Sign in with Google</div>
                  </Link>
                </div>
              </div>

              <div className="text-black font-bold mt-2 text-center">
                Do not have an account?
                <Link href="/register" className="text-blue-500 ml-1 font-bold">
                  Register
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
