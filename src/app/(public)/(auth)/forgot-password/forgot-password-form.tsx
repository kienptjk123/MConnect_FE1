"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  ForgotPasswordBody,
  ForgotPasswordBodyType,
} from "@/schemaValidations/auth.schema";
import { useForgotPasswordMutation } from "@/queries/useAuth";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [, setEmail] = useState("");

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
      await forgotPasswordMutation.mutateAsync(values);
      setEmail(values.email);

      toast({
        title: "Success",
        description: "OTP has been sent to your email",
      });
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
    <Card className="bg-[#fae7e7]/50 rounded-[2rem] backdrop-blur-none border-0 w-[60%] shadow-none py-3 px-10">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-3xl font-bold text-gray-800 text-center">
          FORGOT PASSWORD
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email to receive verification code"
                      className="w-full h-10 border border-[#60A6EB] rounded-md bg-white mt-2"
                      required
                      {...field}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md text-sm transition duration-200"
            >
              {forgotPasswordMutation.isPending ? "SENDING..." : "SEND OTP"}
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
