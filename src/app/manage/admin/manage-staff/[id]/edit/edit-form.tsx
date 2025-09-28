"use client";

import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useStaffByIdQuery, useUpdateStaffMutation } from "@/queries/useStaff";
import {
  UpdateStaffSchema,
  type UpdateStaffProfileType,
} from "@/schemaValidations/staff.schema";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

export default function EditStaffFormPage() {
  const router = useRouter();
  const params = useParams();
  const staffId = parseInt(params.id as string);

  const { mutateAsync, isPending } = useUpdateStaffMutation();
  const { data: staffData, isLoading: staffLoading } =
    useStaffByIdQuery(staffId);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedCover, setSelectedCover] = useState<File | null>(null);

  const form = useForm<UpdateStaffProfileType>({
    resolver: zodResolver(UpdateStaffSchema),
    defaultValues: {
      name: "",
      bio: null,
      date_of_birth: "",
      location: null,
      website: null,
      username: "",
      phone_number: null,
      description: null,
      avatar: null,
      coverPhoto: null,
    },
  });

  useEffect(() => {
    if (staffData) {
      form.reset({
        name: staffData.name || "",
        bio: staffData.bio,
        date_of_birth: staffData.date_of_birth
          ? staffData.date_of_birth.split("T")[0]
          : "",
        location: staffData.location,
        website: staffData.website,
        username: staffData.username || "",
        phone_number: staffData.phone_number,
        description: staffData.description,
      });
    }
  }, [staffData, form]);

  const onSubmit = async (values: UpdateStaffProfileType) => {
    try {
      const updateData = {
        ...values,
        avatar: selectedAvatar,
        coverPhoto: selectedCover,
      };

      await mutateAsync({ id: staffId, data: updateData });
      toast({
        title: "Staff updated",
        description: `"${values.name}" was updated successfully.`,
      });
      router.push("/manage/admin/manage-staff");
    } catch (error: any) {
      toast({
        title: "Failed to update staff",
        description: error?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (staffLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
            Loading staff details...
          </div>
        </div>
      </div>
    );
  }

  if (!staffData) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">Staff not found</p>
          <Button
            onClick={() => router.push("/manage/admin/manage-staff")}
            className="mt-4"
          >
            Back to Staff
          </Button>
        </div>
      </div>
    );
  }

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
            Edit Staff Member
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Avatar Display */}
            {staffData.avatar && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Current Avatar
                </Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src={staffData.avatar}
                      alt={staffData.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Update Avatar
              </Label>
              <ImageUpload
                onImageSelect={setSelectedAvatar}
                className="space-y-2"
              />
            </div>

            {/* Cover Photo Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Update Cover Photo
              </Label>
              <ImageUpload
                onImageSelect={setSelectedCover}
                className="space-y-2"
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Full Name
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

            {/* Username */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter username..."
                {...form.register("username")}
                className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              {form.formState.errors.username && (
                <p className="text-xs text-red-500 font-medium">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="text-sm font-medium text-gray-700"
              >
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Enter bio..."
                {...form.register("bio")}
                className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                rows={3}
              />
              {form.formState.errors.bio && (
                <p className="text-xs text-red-500 font-medium">
                  {form.formState.errors.bio.message}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="phone_number"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone_number"
                  placeholder="Enter phone number..."
                  {...form.register("phone_number")}
                  className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {form.formState.errors.phone_number && (
                  <p className="text-xs text-red-500 font-medium">
                    {form.formState.errors.phone_number.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Enter location..."
                  {...form.register("location")}
                  className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {form.formState.errors.location && (
                  <p className="text-xs text-red-500 font-medium">
                    {form.formState.errors.location.message}
                  </p>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label
                htmlFor="website"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                {...form.register("website")}
                className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              {form.formState.errors.website && (
                <p className="text-xs text-red-500 font-medium">
                  {form.formState.errors.website.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label
                htmlFor="date_of_birth"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Date of Birth
              </Label>
              <Input
                id="date_of_birth"
                type="date"
                {...form.register("date_of_birth")}
                className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              {form.formState.errors.date_of_birth && (
                <p className="text-xs text-red-500 font-medium">
                  {form.formState.errors.date_of_birth.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description..."
                {...form.register("description")}
                className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="text-xs text-red-500 font-medium">
                  {form.formState.errors.description.message}
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Update Staff
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
