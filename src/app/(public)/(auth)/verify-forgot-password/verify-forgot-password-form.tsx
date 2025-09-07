"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
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
import {
  verifyForgotPasswordBody,
  VerifyForgotPasswordBodyType,
} from "@/schemaValidations/auth.schema";
import { useVerifyForgotPasswordMutation } from "@/queries/useAuth";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function VerifyForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [countdown, setCountdown] = useState(0);

  const form = useForm<VerifyForgotPasswordBodyType>({
    resolver: zodResolver(verifyForgotPasswordBody),
    defaultValues: {
      otp: "",
    },
  });

  const verifyForgotPasswordMutation = useVerifyForgotPasswordMutation();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (values: VerifyForgotPasswordBodyType) => {
    if (verifyForgotPasswordMutation.isPending) return;

    try {
      await verifyForgotPasswordMutation.mutateAsync(values);

      toast({
        title: "Success",
        description: "Verification successful",
      });

      // Chuyển sang trang reset password với otp
      router.push(`/reset-password?otp=${encodeURIComponent(values.otp)}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.payload?.message || "Invalid OTP",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {email && (
          <div className="text-center text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            OTP code has been sent to:{" "}
            <strong className="text-blue-600">{email}</strong>
          </div>
        )}

        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium block text-center">
                OTP Code <span className="text-red-500">*</span>
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
                        className=" border-blue-200 focus:border-blue-400 bg-blue-50/30"
                      />
                      <InputOTPSlot
                        index={1}
                        className=" border-blue-200 focus:border-blue-400 bg-blue-50/30"
                      />
                      <InputOTPSlot
                        index={2}
                        className=" border-blue-200 focus:border-blue-400 bg-blue-50/30"
                      />
                      <InputOTPSlot
                        index={3}
                        className=" border-blue-200 focus:border-blue-400 bg-blue-50/30"
                      />
                      <InputOTPSlot
                        index={4}
                        className=" border-blue-200 focus:border-blue-400 bg-blue-50/30"
                      />
                      <InputOTPSlot
                        index={5}
                        className=" border-blue-200 focus:border-blue-400 bg-blue-50/30"
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
          disabled={
            verifyForgotPasswordMutation.isPending ||
            form.watch("otp").length !== 6
          }
          className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 shadow-lg text-lg"
        >
          {verifyForgotPasswordMutation.isPending
            ? "VERIFYING..."
            : "VERIFY OTP"}
        </Button>

        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Back to Forgot Password
          </Link>
        </div>
      </form>
    </Form>
  );
}
