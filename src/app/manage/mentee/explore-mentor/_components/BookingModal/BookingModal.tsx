"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useCreateBookingWithPayment,
  useMentorWorkSchedules,
  useSingleSessionTopics,
} from "@/queries/useBooking";
import {
  MentorWorkScheduleType,
  SingleSessionTopicType,
} from "@/schemaValidations/booking.schema";
import { format } from "date-fns";
import { Calendar, CalendarDays, Clock, DollarSign, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BookingModalProps {
  mentorId: number;
  mentorName: string;
  mentorAvatar?: string | null;
  children: React.ReactNode;
}

export default function BookingModal({
  mentorId,
  mentorName,
  mentorAvatar,
  children,
}: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] =
    useState<SingleSessionTopicType | null>(null);
  const [selectedSchedule, setSelectedSchedule] =
    useState<MentorWorkScheduleType | null>(null);
  const [step, setStep] = useState<"topic" | "schedule" | "confirm">("topic");

  // API calls - lazy load khi cần
  const { data: topicsResponse, isLoading: topicsLoading } =
    useSingleSessionTopics(mentorId, { enabled: isOpen && step === "topic" });

  const { data: schedulesResponse, isLoading: schedulesLoading } =
    useMentorWorkSchedules(mentorId, {
      enabled: isOpen && step === "schedule",
    });

  console.log("Topics Response:", topicsResponse);
  console.log("Schedules Response:", schedulesResponse);

  const createBookingMutation = useCreateBookingWithPayment();

  // API trả về array trực tiếp trong payload
  const topics = (topicsResponse?.payload || []) as SingleSessionTopicType[];
  const schedules = (schedulesResponse?.payload?.data ||
    []) as MentorWorkScheduleType[];
  const handleTopicSelect = (topic: SingleSessionTopicType) => {
    setSelectedTopic(topic);
    setStep("schedule");
  };

  const handleScheduleSelect = (schedule: MentorWorkScheduleType) => {
    setSelectedSchedule(schedule);
    setStep("confirm");
  };

  const handleConfirmBooking = async () => {
    if (!selectedTopic || !selectedSchedule) {
      toast.error("Please select both topic and schedule");
      return;
    }

    try {
      await createBookingMutation.mutateAsync({
        mentorProfileId: mentorId,
        mentorWorkScheduleId: selectedSchedule.id,
        singleSessionTopicId: selectedTopic.id,
      });

      setIsOpen(false);
      // Reset state
      setSelectedTopic(null);
      setSelectedSchedule(null);
      setStep("topic");
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const handleBack = () => {
    if (step === "schedule") {
      setStep("topic");
      setSelectedSchedule(null);
    } else if (step === "confirm") {
      setStep("schedule");
    }
  };

  const resetModal = () => {
    setSelectedTopic(null);
    setSelectedSchedule(null);
    setStep("topic");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetModal();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Book Mentorship Session
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm light:text-gray-600">
            <User className="w-4 h-4" />
            with {mentorName}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                step === "topic" ? "text-blue-600" : "light:text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "topic"
                    ? "bg-blue-600 text-white"
                    : "rounded-full bg-gray-700 light:bg-gray-200"
                }`}
              >
                1
              </div>
              <span className="text-sm">Select Topic</span>
            </div>
            <div className="w-8 h-0.5 rounded-full bg-gray-700 light:bg-gray-200"></div>
            <div
              className={`flex items-center space-x-2 ${
                step === "schedule" ? "text-blue-600" : "light:text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "schedule"
                    ? "bg-blue-600 text-white"
                    : "rounded-full bg-gray-700 light:bg-gray-200"
                }`}
              >
                2
              </div>
              <span className="text-sm">Select Time</span>
            </div>
            <div className="w-8 h-0.5 rounded-full bg-gray-700 light:bg-gray-200"></div>
            <div
              className={`flex items-center space-x-2 ${
                step === "confirm" ? "text-blue-600" : "light:text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === "confirm"
                    ? "bg-blue-600 text-white"
                    : "rounded-full bg-gray-700 light:bg-gray-200"
                }`}
              >
                3
              </div>
              <span className="text-sm">Confirm</span>
            </div>
          </div>

          {/* Step 1: Select Topic */}
          {step === "topic" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select a Session Topic</h3>
              {topicsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : !topicsResponse ? (
                <div className="text-center py-8 light:text-gray-500">
                  Open modal to load topics
                </div>
              ) : topicsResponse && topics.length === 0 ? (
                <div className="text-center py-8 light:text-gray-500">
                  No session topics available for this mentor
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {topics?.map((topic) => (
                    <Card
                      key={topic.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTopic?.id === topic.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => handleTopicSelect(topic)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold light:text-gray-900">
                            {topic.title}
                          </h4>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <DollarSign className="w-3 h-3" />
                            {parseInt(topic.price).toLocaleString()} VND
                          </Badge>
                        </div>
                        <p className="text-sm light:text-gray-600 mb-2">
                          {topic.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs light:text-gray-500">
                          <span>Topic: {topic.topic}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Schedule */}
          {step === "schedule" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select Available Time</h3>
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  Back
                </Button>
              </div>

              {selectedTopic && (
                <Card className="p-3 light:bg-blue-50 border-blue-200">
                  <div className="text-sm">
                    <span className="font-medium">Selected Topic: </span>
                    {selectedTopic.title} -{" "}
                    {parseInt(selectedTopic.price).toLocaleString()} VND
                  </div>
                </Card>
              )}

              {schedulesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : !schedulesResponse ? (
                <div className="text-center py-8 light:text-gray-500">
                  Move to step 2 to load schedules
                </div>
              ) : schedulesResponse && schedules.length === 0 ? (
                <div className="text-center py-8 light:text-gray-500">
                  No available schedules for this mentor
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {schedules.map((schedule: MentorWorkScheduleType) => (
                    <Card
                      key={schedule.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedSchedule?.id === schedule.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => handleScheduleSelect(schedule)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold light:text-gray-900">
                            {schedule.title}
                          </h4>
                          <Badge
                            variant={
                              schedule.status === "AVAILABLE"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {schedule.status}
                          </Badge>
                        </div>
                        <p className="text-sm light:text-gray-600 mb-2">
                          {schedule.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm light:text-gray-500">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {format(new Date(schedule.date), "MMM dd, yyyy")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && selectedTopic && selectedSchedule && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Confirm Your Booking</h3>
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  Back
                </Button>
              </div>

              <Card className="p-4 light:bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold light:text-gray-900 mb-2">
                      Session Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="light:text-gray-600">Topic:</span>
                        <span className="font-medium">
                          {selectedTopic.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="light:text-gray-600">Date:</span>
                        <span className="font-medium">
                          {format(
                            new Date(selectedSchedule.date),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="light:text-gray-600">Time:</span>
                        <span className="font-medium">
                          {selectedSchedule.startTime} -{" "}
                          {selectedSchedule.endTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="light:text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {selectedSchedule.title}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="light:text-gray-900 font-semibold">
                          Total Price:
                        </span>
                        <span className="font-bold text-lg text-blue-600">
                          {parseInt(selectedTopic.price).toLocaleString()} VND
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> After confirming, you will be
                  redirected to VNPay to complete the payment. Your session will
                  be confirmed once payment is successful.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={createBookingMutation.isPending}
            >
              Cancel
            </Button>
            {step === "confirm" && (
              <Button
                onClick={handleConfirmBooking}
                disabled={createBookingMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createBookingMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Confirm & Pay"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
