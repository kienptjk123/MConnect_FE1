"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  ForgotPasswordBody,
  ForgotPasswordBodyType,
} from "@/schemaValidations/auth.schema";
import { useForgotPasswordMutation } from "@/queries/useAuth";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const form = useForm<ForgotPasswordBodyType>({
    resolver: zodResolver(ForgotPasswordBody),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useForgotPasswordMutation();

  const onSubmit = async (values: ForgotPasswordBodyType) => {
    if (forgotPasswordMutation.isPending) return;

    try {
      const result = await forgotPasswordMutation.mutateAsync(values);
      setEmail(values.email);

      toast({
        title: "Thành công",
        description: "Mã OTP đã được gửi đến email của bạn",
      });

      // Chuyển sang trang verify với email
      router.push(`/verify-forgot-password`);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.payload?.message || "Có lỗi xảy ra",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
            disabled={forgotPasswordMutation.isPending}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {forgotPasswordMutation.isPending ? "Đang gửi..." : "Gửi mã OTP"}
          </Button>
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-500 text-sm"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </Form>
  );
}
