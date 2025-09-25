"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useCreateUpdateRequestMutation } from "@/queries/useUpdateRequest";
import {
  CreateUpdateRequestSchema,
  type CreateUpdateRequest,
} from "@/schemaValidations/upgradeRequest";
import {
  FileText,
  User,
  GraduationCap,
  Globe,
  Phone,
  Upload,
  CheckCircle,
  ArrowLeft,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MentorApplicationForm() {
  const router = useRouter();
  const createMutation = useCreateUpdateRequestMutation();
  const [cvFile, setCvFile] = useState<File | null>(null);

  const form = useForm<CreateUpdateRequest>({
    resolver: zodResolver(CreateUpdateRequestSchema),
    defaultValues: {
      name: "",
      bio: "",
      major: "",
      description: "",
      website: "",
      phone_number: "",
    },
  });

  const onSubmit = async (values: CreateUpdateRequest) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("bio", values.bio);
      formData.append("major", values.major);
      formData.append("description", values.description);

      if (values.website) {
        formData.append("website", values.website);
      }
      if (values.phone_number) {
        formData.append("phone_number", values.phone_number);
      }
      if (cvFile) {
        formData.append("cv", cvFile);
      }

      await createMutation.mutateAsync(formData as any);

      toast({
        title: "Application submitted successfully!",
        description: "Your mentor application has been submitted for review.",
      });

      form.reset();
      setCvFile(null);

      router.push("/manage/mentee/mentor-application/status");
    } catch (error: any) {
      toast({
        title: error?.message || "Submission failed",
        description:
          error?.message ||
          "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setCvFile(file);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
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

        <Button
          variant="outline"
          onClick={() =>
            router.push("/manage/mentee/mentor-application/status")
          }
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          View My Applications
        </Button>
      </div>

      <Card className="rounded-md shadow-sm border border-gray-200">
        <CardHeader className="bg-blue-500 text-white p-6 rounded-t-md">
          <CardTitle className="flex items-center gap-2">
            Mentor Application Form
          </CardTitle>
          <p className="text-sm opacity-90">
            Fill out the form below to apply as a mentor
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <User className="h-5 w-5" />
                Personal Information
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="major" className="text-sm font-medium">
                    Major/Field of Study *
                  </Label>
                  <Input
                    id="major"
                    {...form.register("major")}
                    placeholder="e.g., Computer Science"
                    className="mt-1"
                  />
                  {form.formState.errors.major && (
                    <p className="text-xs text-red-500 mt-1">
                      {form.formState.errors.major.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone_number" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone_number"
                    {...form.register("phone_number")}
                    placeholder="0123456789"
                    className="mt-1"
                  />
                  {form.formState.errors.phone_number && (
                    <p className="text-xs text-red-500 mt-1">
                      {form.formState.errors.phone_number.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website" className="text-sm font-medium">
                    Website/Portfolio
                  </Label>
                  <Input
                    id="website"
                    {...form.register("website")}
                    placeholder="https://your-website.com"
                    className="mt-1"
                  />
                  {form.formState.errors.website && (
                    <p className="text-xs text-red-500 mt-1">
                      {form.formState.errors.website.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio *
                </Label>
                <Textarea
                  id="bio"
                  {...form.register("bio")}
                  placeholder="Tell us about yourself, your background, and your expertise..."
                  className="mt-1 min-h-[100px]"
                />
                {form.formState.errors.bio && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.bio.message}
                  </p>
                )}
              </div>
            </div>

            {/* Motivation */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <GraduationCap className="h-5 w-5" />
                Motivation
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Why do you want to become a mentor? *
                </Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Explain your motivation for becoming a mentor, what you hope to achieve, and how you plan to help students..."
                  className="mt-1 min-h-[120px]"
                />
                {form.formState.errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* CV Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <FileText className="h-5 w-5" />
                Curriculum Vitae
              </div>

              <div>
                <Label htmlFor="cv" className="text-sm font-medium">
                  Upload your CV (PDF only, max 10MB)
                </Label>
                <div className="mt-1">
                  {!cvFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload your CV or drag and drop
                      </p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="cv-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("cv-upload")?.click()
                        }
                      >
                        Choose File
                      </Button>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg p-4 bg-green-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {cvFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(cvFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCvFile(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8"
              >
                {createMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Application
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
