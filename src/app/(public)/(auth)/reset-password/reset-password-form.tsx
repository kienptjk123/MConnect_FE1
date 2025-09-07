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
  ResetPasswordBody,
  ResetPasswordBodyType,
} from "@/schemaValidations/auth.schema";
import { useResetPasswordMutation } from "@/queries/useAuth";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const otp = searchParams.get("otp");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordBodyType>({
    resolver: zodResolver(ResetPasswordBody),
    defaultValues: {
      password: "",
      confirm_password: "",
      otp: otp || "",
    },
  });

  const resetPasswordMutation = useResetPasswordMutation();

  const onSubmit = async (values: ResetPasswordBodyType) => {
    if (resetPasswordMutation.isPending) return;

    try {
      await resetPasswordMutation.mutateAsync(values);

      toast({
        title: "Success",
        description: "Password reset successfully",
      });

      // Chuyển về trang login
      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.payload?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                New Password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 pr-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-400 bg-blue-50/30"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-blue-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-blue-400" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Confirm Password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 pr-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-400 bg-blue-50/30"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-blue-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-blue-400" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormLabel className="text-gray-700 font-medium">
                OTP Code
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="OTP Code"
                  readOnly
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 shadow-lg text-lg"
        >
          {resetPasswordMutation.isPending ? "RESETTING..." : "RESET PASSWORD"}
        </Button>

        <div className="text-center text-sm text-red-500">
          Password requirements: At least 6 characters with uppercase, numbers
          and special characters
        </div>
      </form>
    </Form>
  );
}
