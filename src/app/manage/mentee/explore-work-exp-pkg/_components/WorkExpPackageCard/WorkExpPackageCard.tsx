"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useProfile } from "@/queries/useProfile";
import { useCreateWorkExpBooking } from "@/queries/useWorkExpBooking";
import { WorkBookingCreate } from "@/schemaValidations/work-exp-booking";
import { WorkExperiencePackage } from "@/schemaValidations/work-exp-package.schema";
import {
  BookOpen,
  Clock,
  Package,
  ReceiptCent,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface WorkExpPackageCardProps {
  workPackage: WorkExperiencePackage;
  isBooked?: boolean;
}

export default function WorkExpPackageCard({
  workPackage,
  isBooked = false,
}: WorkExpPackageCardProps) {
  const { data: profile } = useProfile();
  console.log(profile);

  const { mutateAsync: createBooking, isPending } = useCreateWorkExpBooking();

  const router = useRouter();

  const formatPrice = (price: string | number | undefined) => {
    const numPrice =
      typeof price === "string" ? Number(price) : (price as number);
    if (!numPrice || isNaN(numPrice)) return "Price not available";

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numPrice);
  };

  const getPackageTypeLabel = (type: string) =>
    type === "COURSE_PLUS_SANDBOX" ? "Course + Sandbox" : "Sandbox Only";

  const getPackageTypeColor = (type: string) =>
    type === "COURSE_PLUS_SANDBOX"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-yellow-100 text-yellow-800";
      case "ARCHIVED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date;
  };

  const handleBooking = async () => {
    if (!profile?.payload.result.mentee_profile_id) {
      toast({
        title: "Error",
        description: "Please complete your mentee profile first.",
        variant: "destructive",
      });
      return;
    }

    const price = Number(workPackage.price);
    if (!workPackage?.id || isNaN(price)) {
      toast({
        title: "Error",
        description: "Invalid package data. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const bookingData: WorkBookingCreate = {
        workExperiencePackageId: workPackage.id,
        menteeProfileId: profile.payload.result.mentee_profile_id,
        startDate: getStartDate(),
        price: price.toString(),
      };

      await createBooking(bookingData);

      toast({
        title: "Booking Successful! 🎉",
        description: `Your booking for "${
          workPackage.title || "this package"
        }" has been created successfully.`,
      });

      router.push("/manage/mentee/my-work-exp-bookings");
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description:
          error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const [showAll, setShowAll] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col gap-4">
        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
          {workPackage.title}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={getPackageTypeColor(workPackage.packageType)}>
            {workPackage.packageType === "COURSE_PLUS_SANDBOX" && (
              <BookOpen className="h-3 w-3 mr-1" />
            )}
            <Package className="h-3 w-3 mr-1" />
            {getPackageTypeLabel(workPackage.packageType)}
          </Badge>
          <Badge className={getStatusColor(workPackage.status)}>
            {workPackage.status}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3">
          {workPackage.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {(showAll ? workPackage.skills : workPackage.skills.slice(0, 3)).map(
            (skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            )
          )}

          {workPackage.skills.length > 3 && !showAll && (
            <Badge
              variant="secondary"
              className="text-xs cursor-pointer"
              onClick={() => setShowAll(true)}
            >
              +{workPackage.skills.length - 3} more
            </Badge>
          )}
        </div>

        {/* Package details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>{workPackage.duration}h</span>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <ReceiptCent className="h-4 w-4 mr-2" />
            <span className="font-semibold text-green-600">
              {formatPrice(workPackage.price)}
            </span>
          </div>

          {workPackage.maxParticipants && (
            <div className="flex items-center text-gray-600 text-sm">
              <Users className="h-4 w-4 mr-2" />
              <span>Max {workPackage.maxParticipants}</span>
            </div>
          )}

          <div className="flex items-center text-gray-600 text-sm">
            <User className="h-4 w-4 mr-2 " />
            <span>{workPackage._count?.bookings || 0} bookings</span>
          </div>
        </div>

        {/* Mentor info (phụ) */}
        <div className="flex items-center gap-3 mt-4 border-t pt-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {workPackage.mentorProfile?.avatar ? (
              <Image
                src={workPackage.mentorProfile.avatar}
                alt={workPackage.mentorProfile.name || "Mentor"}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-sm font-semibold text-blue-600">
                {workPackage.mentorProfile?.name?.[0] || "M"}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-sm">
              {workPackage.mentorProfile?.name || "Unknown Mentor"}
            </p>
            <p className="text-xs text-gray-500">
              {workPackage.mentorProfile?.major || "No major info"}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button
          variant="outline"
          className="w-1/2"
          onClick={() =>
            router.push(`/manage/mentee/explore-work-exp-pkg/${workPackage.id}`)
          }
        >
          View More
        </Button>

        {isBooked ? (
          <Button className="w-1/2" disabled>
            Booked
          </Button>
        ) : (
          <Button
            onClick={handleBooking}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={workPackage.status !== "ACTIVE" || isPending}
          >
            {isPending
              ? "Booking..."
              : workPackage.status === "ACTIVE"
              ? "Book Package"
              : "Not Available"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
