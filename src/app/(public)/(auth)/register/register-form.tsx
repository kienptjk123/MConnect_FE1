"use client";

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
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/queries/useAuth";
import {
  RegisterApiPayload,
  RegisterBody,
  RegisterBodyType,
} from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegisterMutation();
  const router = useRouter();

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm_password: "",
      dateOfBirth: "",
    },
  });

  async function onSubmit(values: RegisterBodyType) {
    if (registerMutation.isPending) {
      console.log("Registration already in progress");
      return;
    }

    try {
      if (!values.dateOfBirth || values.dateOfBirth.trim() === "") {
        toast.error("Vui lòng chọn ngày sinh");
        return;
      }

      const dateTest = new Date(values.dateOfBirth);
      if (isNaN(dateTest.getTime())) {
        toast.error("Ngày sinh không hợp lệ");
        return;
      }

      const fullName =
        `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
      if (!fullName) {
        toast.error("Vui lòng nhập đầy đủ họ và tên");
        return;
      }

      const dateObj = new Date(values.dateOfBirth);
      const formattedValues: RegisterApiPayload = {
        name: fullName,
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
        date_of_birth: dateObj.toISOString(),
      };
      console.log("zxczxc", formattedValues);
      const res = await registerMutation.mutateAsync(formattedValues);
      console.log("REGISTER SUCCESS:", res);
      toast.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );

      router.push("/verify-email");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi đăng ký. Vui lòng thử lại.");
    } finally {
      console.log("REGISTER ATTEMPT END");
    }
  }

  return (
    <Card className="bg-[#fae7e7]/50 rounded-[2rem] backdrop-blur-none border-0 w-[1000px] shadow-none py-3 px-10">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-3xl font-bold text-start text-gray-800">
          Mentee Registration
        </CardTitle>
        <CardDescription className="text-start text-black mt-4 font-bold">
          Fields with are required
        </CardDescription>
        <CardDescription className="text-start text-black mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim
        </CardDescription>
        <CardDescription className="text-start font-semibold text-black mt-2">
          Credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (error) => {
              console.log(error);
              console.log(form.getValues());
            })}
            noValidate
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-10 border border-[#60A6EB] rounded-md bg-white mt-2 dark:text-gray-700"
                      placeholder="Nguyen Van"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-10 border border-[#60A6EB] rounded-md bg-white mt-2 dark:text-gray-700"
                      placeholder="A"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="abcd@gmail.com"
                      {...field}
                      className="h-10 border border-[#60A6EB] rounded-md bg-white mt-2 dark:text-gray-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      required
                      max={new Date().toISOString().split("T")[0]}
                      className="h-10 border border-[#60A6EB] rounded-md bg-white mt-2 dark:text-gray-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="*******"
                        {...field}
                        className="h-10 border border-[#60A6EB] rounded-md bg-white mt-2 pr-10 dark:text-gray-700"
                      />
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </div>
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
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="*******"
                        {...field}
                        className="h-10 border border-[#60A6EB] rounded-md bg-white mt-2 pr-10 dark:text-gray-700"
                      />
                      <div
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-10 mt-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Loading..." : "Register"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-3">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in now
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
