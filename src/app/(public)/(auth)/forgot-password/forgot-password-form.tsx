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
        title: "Success",
        description: "OTP has been sent to your email",
      });

      // Chuyển sang trang verify với email
      router.push(
        `/verify-forgot-password?email=${encodeURIComponent(values.email)}`
      );
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Email <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email to receive verification code"
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 bg-blue-50/30 placeholder-gray-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 shadow-lg text-sm"
        >
          {forgotPasswordMutation.isPending ? "SENDING..." : "SEND OTP"}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
