"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useCourseByMentor } from "@/queries/useCourse";
import {
  useUpdateWorkExpPackage,
  useWorkExpPackageById,
} from "@/queries/useWorkExpPackage";
import {
  WorkExperiencePackageUpdateSchema,
  type WorkExperiencePackageUpdateInput,
} from "@/schemaValidations/work-exp-package.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Package,
  Plus,
  Save,
  Users,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

export default function EditWorkExpPackageFormPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = parseInt(params.id as string);

  const { mutateAsync, isPending } = useUpdateWorkExpPackage(packageId);
  const { data: packageData, isLoading: packageLoading } =
    useWorkExpPackageById(packageId, !!packageId);
  const { data: coursesData, isLoading: coursesLoading } = useCourseByMentor();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<WorkExperiencePackageUpdateInput>({
    resolver: zodResolver(WorkExperiencePackageUpdateSchema),
    defaultValues: {
      title: "",
      description: "",
      skills: [],
      duration: 1,
      price: 2000000,
      packageType: "SANDBOX_ONLY",
      includesCourse: 0,
      certificateTemplate: "",
      maxParticipants: 10,
      status: "ACTIVE",
      requirements: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "requirements",
  });

  const watchPackageType = form.watch("packageType");

  useEffect(() => {
    if (packageData?.payload?.data) {
      const pkg = packageData.payload.data;
      const initialSkills = pkg.skills || [];

      // Reset form with all values
      form.reset({
        title: pkg.title || "",
        description: pkg.description || "",
        skills: initialSkills,
        duration: pkg.duration || 1,
        price: pkg.price || 2000000,
        packageType: pkg.packageType || "SANDBOX_ONLY",
        includesCourse: pkg.includesCourse || 0,
        certificateTemplate: pkg.certificateTemplate || "",
        maxParticipants: pkg.maxParticipants || 10,
        status: pkg.status || "ACTIVE",
        requirements: pkg.requirements || [],
      });

      // Set skills state
      setSkills(initialSkills);

      // Explicitly set packageType to ensure it displays correctly
      setTimeout(() => {
        form.setValue("packageType", pkg.packageType || "SANDBOX_ONLY", {
          shouldDirty: false,
          shouldTouch: false,
        });
      }, 100);

      if (pkg.requirements && pkg.requirements.length > 0) {
        replace(pkg.requirements);
      }
    }
  }, [packageData, form, replace]);
  const onSubmit = async (values: WorkExperiencePackageUpdateInput) => {
    try {
      const submitData: any = {
        ...values,
        skills,
      };

      // Only include includesCourse if packageType is COURSE_PLUS_SANDBOX
      if (watchPackageType === "COURSE_PLUS_SANDBOX" && values.includesCourse) {
        submitData.includesCourse = values.includesCourse;
      }

      await mutateAsync(submitData);
      toast({
        title: "Work Experience Package updated",
        description: `"${values.title}" was updated successfully.`,
      });
      router.push("/manage/mentor/work-experience-package");
    } catch (error: any) {
      toast({
        title: "Failed to update package",
        description: error?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()];
      setSkills(newSkills);
      form.setValue("skills", newSkills, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    console.log("Removing skill:", skillToRemove);
    console.log("Current skills before removal:", skills);
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    console.log("Updated skills after removal:", updatedSkills);
    setSkills(updatedSkills);
    form.setValue("skills", updatedSkills, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSkillAdd();
    }
  };

  const availableCourses = coursesData?.payload?.result?.courses || [];

  if (packageLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
            Loading package data...
          </div>
        </div>
      </div>
    );
  }

  if (!packageData?.payload?.data) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              Package not found
            </p>
            <Button
              onClick={() =>
                router.push("/manage/mentor/work-experience-package")
              }
              className="mt-4"
            >
              Back to Packages
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
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
        <CardHeader className="bg-blue-500 text-white border-b rounded-t-md">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-white/20 p-2">
              <Package className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-semibold">
              Edit Work Experience Package
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Basic Information
              </h3>

              {/* Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700"
                >
                  Package Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Enter package title..."
                  {...form.register("title")}
                  className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-red-500 font-medium">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your work experience package..."
                  rows={4}
                  {...form.register("description")}
                  className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                {form.formState.errors.description && (
                  <p className="text-xs text-red-500 font-medium">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Skills
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a skill..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleSkillKeyPress}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleSkillAdd}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill, index) => (
                      <Badge
                        key={`${skill}-${index}`}
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSkillRemove(skill);
                          }}
                          className="ml-1 hover:text-blue-900 focus:outline-none"
                        >
                          <X className="h-3 w-3 cursor-pointer" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Package Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Package Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Duration */}
                <div className="space-y-2">
                  <Label
                    htmlFor="duration"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Duration (hours) *
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    placeholder="Enter duration in hours..."
                    {...form.register("duration", { valueAsNumber: true })}
                    className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                  {form.formState.errors.duration && (
                    <p className="text-xs text-red-500 font-medium">
                      {form.formState.errors.duration.message}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    Price (VND) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="2000000"
                    max="5000000"
                    placeholder="Enter price..."
                    {...form.register("price", { valueAsNumber: true })}
                    className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                  {form.formState.errors.price && (
                    <p className="text-xs text-red-500 font-medium">
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>

                {/* Package Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Package Type *
                  </Label>
                  <Controller
                    name="packageType"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value || "SANDBOX_ONLY"}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                          <SelectValue placeholder="Select package type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SANDBOX_ONLY">
                            Sandbox Only
                          </SelectItem>
                          <SelectItem value="COURSE_PLUS_SANDBOX">
                            Course + Sandbox
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.packageType && (
                    <p className="text-xs text-red-500 font-medium">
                      {form.formState.errors.packageType.message}
                    </p>
                  )}
                </div>

                {/* Course Selection (only show for COURSE_PLUS_SANDBOX) */}
                {watchPackageType === "COURSE_PLUS_SANDBOX" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Include Course *
                    </Label>
                    {coursesLoading ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                        Loading courses...
                      </div>
                    ) : (
                      <Controller
                        name="includesCourse"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            value={field.value?.toString() || ""}
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                          >
                            <SelectTrigger className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableCourses.length > 0 ? (
                                availableCourses.map((course) => (
                                  <SelectItem
                                    key={course.id}
                                    value={course.id.toString()}
                                  >
                                    {course.title}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="0" disabled>
                                  No courses available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    )}
                    {form.formState.errors.includesCourse && (
                      <p className="text-xs text-red-500 font-medium">
                        {form.formState.errors.includesCourse.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Status *
                  </Label>
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                          <SelectItem value="ARCHIVED">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.status && (
                    <p className="text-xs text-red-500 font-medium">
                      {form.formState.errors.status.message}
                    </p>
                  )}
                </div>

                {/* Max Participants */}
                <div className="space-y-2">
                  <Label
                    htmlFor="maxParticipants"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Max Participants
                  </Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    placeholder="Enter max participants..."
                    {...form.register("maxParticipants", {
                      valueAsNumber: true,
                    })}
                    className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                  {form.formState.errors.maxParticipants && (
                    <p className="text-xs text-red-500 font-medium">
                      {form.formState.errors.maxParticipants.message}
                    </p>
                  )}
                </div>

                {/* Certificate Template */}
                <div className="space-y-2">
                  <Label
                    htmlFor="certificateTemplate"
                    className="text-sm font-medium text-gray-700"
                  >
                    Certificate Template
                  </Label>
                  <Input
                    id="certificateTemplate"
                    placeholder="Enter certificate template URL..."
                    {...form.register("certificateTemplate")}
                    className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                  {form.formState.errors.certificateTemplate && (
                    <p className="text-xs text-red-500 font-medium">
                      {form.formState.errors.certificateTemplate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Requirements
                </h3>
                <Button
                  type="button"
                  onClick={() =>
                    append({
                      title: "",
                      description: "",
                      order: fields.length + 1,
                      isOptional: false,
                    })
                  }
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Requirement
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="border border-gray-300">
                  <CardHeader className="bg-gray-50 pb-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">
                        Requirement {index + 1}
                      </h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {/* Requirement Title */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Title *
                      </Label>
                      <Input
                        placeholder="Enter requirement title..."
                        {...form.register(`requirements.${index}.title`)}
                        className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      />
                      {form.formState.errors.requirements?.[index]?.title && (
                        <p className="text-xs text-red-500 font-medium">
                          {
                            form.formState.errors.requirements[index]?.title
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    {/* Requirement Description */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Description *
                      </Label>
                      <Textarea
                        placeholder="Enter requirement description..."
                        rows={3}
                        {...form.register(`requirements.${index}.description`)}
                        className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      />
                      {form.formState.errors.requirements?.[index]
                        ?.description && (
                        <p className="text-xs text-red-500 font-medium">
                          {
                            form.formState.errors.requirements[index]
                              ?.description?.message
                          }
                        </p>
                      )}
                    </div>

                    {/* Order and Optional */}
                    <div className="flex items-center gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Order
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          {...form.register(`requirements.${index}.order`, {
                            valueAsNumber: true,
                          })}
                          className="w-20"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`optional-${index}`}
                          {...form.register(`requirements.${index}.isOptional`)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label
                          htmlFor={`optional-${index}`}
                          className="text-sm text-gray-700"
                        >
                          Optional requirement
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                className="rounded-md bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 flex items-center gap-2"
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
                    Update Package
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
