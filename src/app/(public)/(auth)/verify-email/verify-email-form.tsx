"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  VerifyEmailBody,
  VerifyEmailBodyType,
} from "@/schemaValidations/auth.schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  useVerifyEmailMutation,
  useResendVerifyEmailMutation,
} from "@/queries/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VerifyEmailForm() {
  const [countdown, setCountdown] = useState(0);
  const [mounted, setMounted] = useState(false);
  const verifyEmailMutation = useVerifyEmailMutation();
  const resendVerifyEmailMutation = useResendVerifyEmailMutation();
  const router = useRouter();

  const form = useForm<VerifyEmailBodyType>({
    resolver: zodResolver(VerifyEmailBody),
    defaultValues: {
      email_verify_token: "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  async function onSubmit(values: VerifyEmailBodyType) {
    if (verifyEmailMutation.isPending) {
      console.log("Verification already in progress");
      return;
    }

    try {
      await verifyEmailMutation.mutateAsync(values);
      toast.success("Xác thực email thành công!");
      if (mounted && typeof window !== "undefined") {
        router.push("/mentee/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error("Xác thực thất bại. Vui lòng thử lại.");
    } finally {
      console.log("VERIFY EMAIL ATTEMPT END");
    }
  }

  async function handleResendOTP() {
    if (countdown > 0 || resendVerifyEmailMutation.isPending) return;

    try {
      await resendVerifyEmailMutation.mutateAsync();

      toast.success("Mã OTP đã được gửi lại!");
      setCountdown(60);
    } catch (error: unknown) {
      console.error("❌ Resend failed:", error);

      let errorMessage = "Gửi lại mã OTP thất bại. Vui lòng thử lại.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const responseError = error as {
          response?: { data?: { payload?: { message?: string } } };
        };
        errorMessage =
          responseError.response?.data?.payload?.message || errorMessage;
      }

      toast.error(errorMessage);
    }
  }

  if (!mounted) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg border-0">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Xác thực email
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Nhập mã OTP được gửi đến email của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="animate-pulse bg-gray-200 h-12 w-80 rounded"></div>
            </div>
            <div className="animate-pulse bg-gray-200 h-11 w-full rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#fae7e7]/50 rounded-[2rem] backdrop-blur-none border-0 w-[1000px] shadow-none py-3 px-10">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center text-gray-800">
          Verify OTP
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Input OTP sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email_verify_token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 block text-center">
                    OTP (6 digits)
                  </FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="h-[50px] w-[50px] bg-white border border-blue-500"
                          />
                          <InputOTPSlot
                            index={1}
                            className="h-[50px] w-[50px] bg-white border-t border-b border-r border-blue-500"
                          />
                          <InputOTPSlot
                            index={2}
                            className="h-[50px] w-[50px] bg-white border-t border-b border-r border-blue-500"
                          />
                          <InputOTPSlot
                            index={3}
                            className="h-[50px] w-[50px] bg-white border-t border-b border-r border-blue-500"
                          />
                          <InputOTPSlot
                            index={4}
                            className="h-[50px] w-[50px] bg-white border-t border-b border-r border-blue-500"
                          />
                          <InputOTPSlot
                            index={5}
                            className="h-[50px] w-[50px] bg-white border-t border-b border-r border-blue-500"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              disabled={
                verifyEmailMutation.isPending ||
                form.watch("email_verify_token").length !== 6
              }
            >
              {verifyEmailMutation.isPending ? "Đang xác thực..." : "Verify"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 mb-3">
            Does not receive the otp?
          </p>
          <Button
            variant="outline"
            onClick={handleResendOTP}
            disabled={countdown > 0 || resendVerifyEmailMutation.isPending}
            className="w-full h-11"
          >
            {countdown > 0
              ? `Gửi lại sau ${countdown}s`
              : resendVerifyEmailMutation.isPending
              ? "Đang gửi..."
              : "Gửi lại mã OTP"}
          </Button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
