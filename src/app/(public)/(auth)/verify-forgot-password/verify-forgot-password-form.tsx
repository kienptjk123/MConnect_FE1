// filepath: d:\FPTUniversity\EXE101\MConnect_FE\src\app\(public)\(auth)\verify-forgot-password\verify-forgot-password-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  verifyForgotPasswordBody,
  VerifyForgotPasswordBodyType,
} from "@/schemaValidations/auth.schema";
import { useVerifyForgotPasswordMutation } from "@/queries/useAuth";
import Link from "next/link";

export default function VerifyForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const form = useForm<VerifyForgotPasswordBodyType>({
    resolver: zodResolver(verifyForgotPasswordBody),
    defaultValues: {
      otp: "",
    },
  });

  const verifyForgotPasswordMutation = useVerifyForgotPasswordMutation();

  const onSubmit = async (values: VerifyForgotPasswordBodyType) => {
    if (verifyForgotPasswordMutation.isPending) return;

    try {
      await verifyForgotPasswordMutation.mutateAsync(values);

      toast({
        title: "Thành công",
        description: "Xác thực thành công",
      });

      // Chuyển sang trang reset password với otp
      router.push(`/reset-password?otp=${encodeURIComponent(values.otp)}`);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.payload?.message || "Mã OTP không hợp lệ",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {email && (
          <div className="text-center text-sm text-gray-600 mb-4">
            Mã OTP đã được gửi đến: <strong>{email}</strong>
          </div>
        )}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã OTP</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Nhập mã OTP 6 số"
                    maxLength={6}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Button
            type="submit"
            disabled={verifyForgotPasswordMutation.isPending}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {verifyForgotPasswordMutation.isPending
              ? "Đang xác thực..."
              : "Xác thực OTP"}
          </Button>
        </div>

        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-indigo-600 hover:text-indigo-500 text-sm"
          >
            Gửi lại mã OTP
          </Link>
        </div>
      </form>
    </Form>
  );
}
