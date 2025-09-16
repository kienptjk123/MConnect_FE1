"use client";

import profileApiRequest from "@/apiRequests/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { formatDateForInput } from "@/lib/utils";
import {
  UpdatePasswordSchema,
  UpdateProfile,
  UpdateProfileSchema,
  UserProfile,
} from "@/schemaValidations/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Eye, EyeOff, MapPin, Save, Upload, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export default function ProfileForm() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<UpdateProfile>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: "",
      bio: "",
      location: "",
      website: "",
      phone_number: "",
      description: "",
      date_of_birth: formatDateForInput(userProfile?.date_of_birth) || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch,
    reset: resetPassword,
  } = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
  });

  const password = watch("password", "");

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^a-zA-Z0-9]/.test(password)) score += 25;

    if (score <= 25) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 50) return { score, label: "Average", color: "bg-yellow-500" };
    if (score <= 75) return { score, label: "Strong", color: "bg-blue-500" };
    return { score, label: "Very Strong", color: "bg-green-500" };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await profileApiRequest.getProfile();
      const profile = response?.payload.result;
      setUserProfile(profile);

      // Reset form với data từ API
      reset({
        name: profile.name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        phone_number: profile.phone_number || "",
        description: profile.description || "",
        date_of_birth: formatDateForInput(profile.date_of_birth) || "",
      });

      return profile;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile. Please try again later.",
        variant: "destructive",
      });
      console.log(error);
    }
  }, [reset]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [avatarPreview, coverPreview]);

  const onSubmit = async (data: any) => {
    try {
      let hasChanges = false;
      const hasFiles = avatarFile || coverFile;

      if (hasFiles) {
        const formData = new FormData();

        // So sánh và append các field đã thay đổi
        if (data.name && data.name !== userProfile?.name) {
          formData.append("name", data.name);
          hasChanges = true;
        }
        if (data.location !== userProfile?.location) {
          formData.append("location", data.location || "");
          hasChanges = true;
        }
        if (data.bio !== userProfile?.bio) {
          formData.append("bio", data.bio || "");
          hasChanges = true;
        }
        if (data.date_of_birth !== userProfile?.date_of_birth) {
          formData.append("date_of_birth", data.date_of_birth || "");
          hasChanges = true;
        }
        if (data.phone_number !== userProfile?.phone_number) {
          formData.append("phone_number", data.phone_number || "");
          hasChanges = true;
        }
        if (data.website !== userProfile?.website) {
          formData.append("website", data.website || "");
          hasChanges = true;
        }
        if (data.description !== userProfile?.description) {
          formData.append("description", data.description || "");
          hasChanges = true;
        }

        if (avatarFile) {
          formData.append("avatar", avatarFile);
          hasChanges = true;
        }
        if (coverFile) {
          formData.append("coverPhoto", coverFile);
          hasChanges = true;
        }

        if (hasChanges) {
          await profileApiRequest.updateProfile(formData);
          const fetchedProfile = await profileApiRequest.getProfile();
          setUserProfile(fetchedProfile.payload.result);

          // Reset form với data mới
          reset({
            name: fetchedProfile.payload.result.name || "",
            bio: fetchedProfile.payload.result.bio || "",
            location: fetchedProfile.payload.result.location || "",
            website: fetchedProfile.payload.result.website || "",
            phone_number: fetchedProfile.payload.result.phone_number || "",
            description: fetchedProfile.payload.result.description || "",
            date_of_birth:
              formatDateForInput(fetchedProfile.payload.result.date_of_birth) ||
              "",
          });

          toast({
            title: "Success",
            description: "Profile updated successfully!",
            variant: "default",
          });
        }
      } else {
        const updateData: Partial<UpdateProfile> = {};

        // So sánh và chỉ update những field đã thay đổi
        if (data.name && data.name !== userProfile?.name) {
          updateData.name = data.name;
          hasChanges = true;
        }
        if (data.location !== userProfile?.location) {
          updateData.location = data.location;
          hasChanges = true;
        }
        if (data.bio !== userProfile?.bio) {
          updateData.bio = data.bio;
          hasChanges = true;
        }
        if (data.date_of_birth !== userProfile?.date_of_birth) {
          updateData.date_of_birth = data.date_of_birth;
          hasChanges = true;
        }
        if (data.phone_number !== userProfile?.phone_number) {
          updateData.phone_number = data.phone_number;
          hasChanges = true;
        }
        if (data.website !== userProfile?.website) {
          updateData.website = data.website;
          hasChanges = true;
        }
        if (data.description !== userProfile?.description) {
          updateData.description = data.description;
          hasChanges = true;
        }

        if (hasChanges) {
          await profileApiRequest.updateProfile(updateData);
          const fetchedProfile = await profileApiRequest.getProfile();
          setUserProfile(fetchedProfile.payload.result);

          // Reset form với data mới
          reset({
            name: fetchedProfile.payload.result.name || "",
            bio: fetchedProfile.payload.result.bio || "",
            location: fetchedProfile.payload.result.location || "",
            website: fetchedProfile.payload.result.website || "",
            phone_number: fetchedProfile.payload.result.phone_number || "",
            description: fetchedProfile.payload.result.description || "",
            date_of_birth:
              formatDateForInput(fetchedProfile.payload.result.date_of_birth) ||
              "",
          });

          toast({
            title: "Success",
            description: "Profile updated successfully!",
            variant: "default",
          });
        } else {
          toast({
            title: "No Changes",
            description: "No changes were made to the profile.",
            variant: "default",
          });
        }
      }

      setAvatarFile(null);
      setCoverFile(null);
      setAvatarPreview(null);
      setCoverPreview(null);
      setIsEditing(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.log(error);
    }
  };

  const handleCancel = () => {
    setAvatarFile(null);
    setCoverFile(null);
    setAvatarPreview(null);
    setCoverPreview(null);

    // Reset form về giá trị ban đầu từ userProfile
    reset({
      name: userProfile?.name || "",
      bio: userProfile?.bio || "",
      location: userProfile?.location || "",
      website: userProfile?.website || "",
      phone_number: userProfile?.phone_number || "",
      description: userProfile?.description || "",
      date_of_birth: formatDateForInput(userProfile?.date_of_birth) || "",
    });

    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarFile(null);
      setAvatarPreview(null);
      toast({
        title: "Error",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
    }
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverFile(null);
      setCoverPreview(null);
      toast({
        title: "Error",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async (
    data: z.infer<typeof UpdatePasswordSchema>
  ) => {
    try {
      const response = await profileApiRequest.updatePassword(data);
      resetPassword();
      setIsPasswordModalOpen(false);
      toast({
        title: "Success",
        description: "Password changed successfully!",
        variant: "default",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to change password. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div
            className={`h-80 w-full bg-gradient-to-r from-blue-200 via-pink-200 to-purple-200 rounded-b-3xl shadow-lg ${
              isEditing ? "cursor-pointer group" : ""
            }`}
            style={{
              backgroundImage: `url(${
                coverPreview || userProfile?.coverPhoto || "/placeholder.svg"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={
              isEditing
                ? () => document.getElementById("cover-upload")?.click()
                : undefined
            }
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent rounded-b-3xl" />
            {isEditing && (
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-b-3xl">
                <div className="bg-white/90 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 font-medium">
                    Click to change cover photo
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div
                className={`${isEditing ? "cursor-pointer group" : ""}`}
                onClick={
                  isEditing
                    ? () => document.getElementById("avatar-upload")?.click()
                    : undefined
                }
              >
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarImage
                    src={
                      avatarPreview || userProfile?.avatar || "/placeholder.svg"
                    }
                    alt={userProfile?.name}
                  />
                  <AvatarFallback className="bg-blue-200 text-blue-800 text-2xl font-bold">
                    {userProfile?.name
                      ? userProfile?.name.charAt(0).toUpperCase()
                      : ""}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 p-2 rounded-full">
                      <Upload className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 border-4 border-white rounded-full shadow-sm"></div>
            </div>
          </div>
          {/* Edit password */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            {!isEditing ? (
              <>
                <Dialog
                  open={isPasswordModalOpen}
                  onOpenChange={setIsPasswordModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90 hover:bg-white text-purple-700 border border-purple-200"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-gray-900">
                        <Edit3 className="w-5 h-5 text-purple-600" />
                        Change Password
                      </DialogTitle>
                      <DialogDescription>
                        Please enter your old password and new password to
                        change.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmitPassword(handlePasswordChange)}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="old_password"
                          className="text-sm font-medium text-gray-700"
                        >
                          Old Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="oldPassword"
                            type={showOldPassword ? "text" : "password"}
                            {...registerPassword("oldPassword")}
                            className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                          >
                            {showOldPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                        {passwordErrors.oldPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {passwordErrors.oldPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium text-gray-700"
                        >
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showNewPassword ? "text" : "password"}
                            {...registerPassword("password")}
                            className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                        {password && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">
                                Password Strength:
                              </span>
                              <span
                                className={`font-medium ${
                                  passwordStrength.score <= 25
                                    ? "text-red-600"
                                    : passwordStrength.score <= 50
                                    ? "text-yellow-600"
                                    : passwordStrength.score <= 75
                                    ? "text-blue-600"
                                    : "text-green-600"
                                }`}
                              >
                                {passwordStrength.label}
                              </span>
                            </div>
                            <Progress
                              value={passwordStrength.score}
                              className="h-2"
                            />
                          </div>
                        )}
                        {passwordErrors.password && (
                          <p className="text-red-500 text-xs mt-1">
                            {passwordErrors.password.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium text-gray-700"
                        >
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            {...registerPassword("confirmPassword")}
                            className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {passwordErrors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          type="submit"
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Update Password
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsPasswordModalOpen(false);
                            resetPassword();
                          }}
                          className="border-gray-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => setIsEditing(true)}
                  size="sm"
                  className="bg-white/90 hover:bg-white text-blue-700 border border-blue-200"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </>
            ) : null}
          </div>
        </div>

        <div className="px-8 pt-20 pb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-8">
              {!isEditing ? (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {userProfile?.name || "User Name"}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        @{userProfile?.email || "user@example.com"}
                      </Badge>
                      {userProfile?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">
                            {userProfile?.location}
                          </span>
                        </div>
                      )}

                      {userProfile?.phone_number && (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.128a11.042 11.042 0 005.516 5.516l1.128-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="text-sm">
                            {userProfile?.phone_number}
                          </span>
                        </div>
                      )}
                      {userProfile?.date_of_birth && (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-yellow-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm">
                            {new Date(
                              userProfile?.date_of_birth
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="pt-4 border-t border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Bio
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {userProfile?.bio ||
                        "Welcome to Mconnect. We are committed to providing you with the best learning services."}
                    </p>
                  </div>

                  {/* Description Section */}
                  {userProfile?.description && (
                    <div className="pt-4 border-t border-blue-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {userProfile?.description}
                      </p>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="pt-4 border-t border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      {userProfile?.created_at && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Member since:{" "}
                          </span>
                          <span>
                            {new Date(
                              userProfile?.created_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {userProfile?.website && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-700">
                            Website:{" "}
                          </span>
                          <a
                            href={userProfile?.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {userProfile?.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="location"
                        className="text-sm font-medium text-gray-700"
                      >
                        Address
                      </Label>
                      <Input
                        id="location"
                        {...register("location")}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                      {errors.location && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.location.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone_number"
                        className="text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone_number"
                        {...register("phone_number")}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                      {errors.phone_number && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone_number.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="website"
                        className="text-sm font-medium text-gray-700"
                      >
                        Website
                      </Label>
                      <Input
                        id="website"
                        {...register("website")}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                      {errors.website && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.website.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="bio"
                        className="text-sm font-medium text-gray-700"
                      >
                        Bio
                      </Label>
                      <Input
                        id="bio"
                        {...register("bio")}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                      {errors.bio && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.bio.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="date_of_birth"
                        className="text-sm font-medium text-gray-700"
                      >
                        Date of Birth
                      </Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        {...register("date_of_birth")}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      />
                      {errors.date_of_birth && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.date_of_birth.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                        rows={2}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Information
                    </Button>
                    <Button
                      onClick={handleCancel}
                      size="sm"
                      variant="outline"
                      className="bg-white/90 hover:bg-white border-blue-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
