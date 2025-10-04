"use client";

import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateStaffMutation } from "@/queries/useStaff";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Calendar,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  CreateStaffFormType,
  CreateStaffSchema,
} from "@/schemaValidations/staff.schema";

export default function CreateStaffFormPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateStaffMutation();

  const form = useForm<CreateStaffFormType>({
    resolver: zodResolver(CreateStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      dateOfBirth: "",
    },
  });

  const onSubmit = async (values: CreateStaffFormType) => {
    try {
      await mutateAsync(values);
      toast({
        title: "Staff created",
        description: `"${values.name}" was created successfully.`,
      });
      router.push("/manage/admin/manage-staff");
    } catch (error: any) {
      toast({
        title: "Failed to create staff",
        description: error?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Staff Member
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter full name..."
                {...form.register("name")}
                className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500 font-medium">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address..."
                {...form.register("email")}
                className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500 font-medium">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password..."
                  {...form.register("password")}
                  className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-red-500 font-medium">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirm_password"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password *
                </Label>
                <Input
                  id="confirm_password"
                  type="password"
                  placeholder="Confirm password..."
                  {...form.register("confirm_password")}
                  className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {form.formState.errors.confirm_password && (
                  <p className="text-xs text-red-500 font-medium">
                    {form.formState.errors.confirm_password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label
                htmlFor="dateOfBirth"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Date of Birth *
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...form.register("dateOfBirth")}
                className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              {form.formState.errors.dateOfBirth && (
                <p className="text-xs text-red-500 font-medium">
                  {form.formState.errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="rounded-md hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-md bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 flex items-center gap-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Staff
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
