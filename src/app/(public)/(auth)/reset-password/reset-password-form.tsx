"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  ResetPasswordBody,
  ResetPasswordBodyType,
} from "@/schemaValidations/auth.schema";
import { useResetPasswordMutation } from "@/queries/useAuth";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

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
    <Card className="bg-[#fae7e7]/50 rounded-[2rem] backdrop-blur-none border-0 w-[60%] shadow-none py-3 px-10">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-3xl font-bold text-gray-800 text-center">
          RESET PASSWORD
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
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
                      New Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="w-full h-10 border border-[#60A6EB] rounded-md bg-white mt-2 pr-10"
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

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm_password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        className="w-full h-10 border border-[#60A6EB] rounded-md bg-white mt-2 pr-10"
                        required
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
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

            {/* Hidden OTP field */}
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="hidden">
                  <Input {...field} type="hidden" readOnly />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-center text-sm text-red-500 mt-2">
              Password requirements: At least 6 characters with uppercase,
              numbers and special characters
            </div>

            <Button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md text-sm transition duration-200"
            >
              {resetPasswordMutation.isPending
                ? "RESETTING..."
                : "RESET PASSWORD"}
            </Button>

            <div className="text-center space-y-2">
              <div className="text-black font-bold mt-2 text-center">
                Remember your password? <br />
                <Link href="/login" className="text-blue-500 ml-1 font-bold">
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
