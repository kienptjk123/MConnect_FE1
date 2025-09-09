"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
        title: "Success",
        description: "Verification successful",
      });

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
    <Card className="bg-[#fae7e7]/50 rounded-[2rem] backdrop-blur-none border-0 w-[50%] shadow-none py-3 px-10">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-3xl font-bold text-gray-800 text-center">
          VERIFY OTP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
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
                  <div className="space-y-2">
                    <Label
                      htmlFor="otp"
                      className="text-sm font-medium text-gray-700 block text-center"
                    >
                      OTP Code <span className="text-red-500">*</span>
                    </Label>
                    <FormControl>
                      <div className="flex justify-center mt-4">
                        <InputOTP
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot
                              index={0}
                              className="border-[#60A6EB] focus:border-blue-400 bg-white h-12 w-12"
                            />
                            <InputOTPSlot
                              index={1}
                              className="border-[#60A6EB] focus:border-blue-400 bg-white h-12 w-12"
                            />
                            <InputOTPSlot
                              index={2}
                              className="border-[#60A6EB] focus:border-blue-400 bg-white h-12 w-12"
                            />
                            <InputOTPSlot
                              index={3}
                              className="border-[#60A6EB] focus:border-blue-400 bg-white h-12 w-12"
                            />
                            <InputOTPSlot
                              index={4}
                              className="border-[#60A6EB] focus:border-blue-400 bg-white h-12 w-12"
                            />
                            <InputOTPSlot
                              index={5}
                              className="border-[#60A6EB] focus:border-blue-400 bg-white h-12 w-12"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={
                verifyForgotPasswordMutation.isPending ||
                form.watch("otp").length !== 6
              }
              className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md text-sm transition duration-200"
            >
              {verifyForgotPasswordMutation.isPending
                ? "VERIFYING..."
                : "VERIFY OTP"}
            </Button>

            <div className="text-center space-y-2">
              <div className="text-black font-bold mt-2 text-center">
                Didn't receive the code? <br />
                <Link
                  href="/forgot-password"
                  className="text-blue-500 ml-1 font-bold"
                >
                  Back to Forgot Password
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
