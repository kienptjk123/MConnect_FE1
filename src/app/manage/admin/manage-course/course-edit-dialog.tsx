"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CourseType } from "@/schemaValidations/course.schema";
import { useUpdateCourseStatusMutation } from "@/queries/useCourseAdmin";
import { toast } from "@/components/ui/use-toast";
import { formatDateToLocaleString } from "@/lib/utils";
import {
  BookOpen,
  User,
  Calendar,
  Star,
  Users,
  DollarSign,
} from "lucide-react";

interface CourseEditDialogProps {
  course: CourseType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CourseEditDialog({
  course,
  open,
  onOpenChange,
}: CourseEditDialogProps) {
  const [status, setStatus] = useState<string>("");
  const [note, setNote] = useState("");

  const { mutateAsync: updateCourseStatus, isPending } =
    useUpdateCourseStatusMutation();

  // Reset form when course changes
  useState(() => {
    if (course) {
      setStatus(course.status);
      setNote("");
    }
  });

  const handleSubmit = async () => {
    if (!course) return;

    try {
      await updateCourseStatus({
        id: course.id.toString(),
        body: {
          status: status as
            | "PUBLISHED"
            | "DRAFT"
            | "PENDING_REVIEW"
            | "ARCHIVED",
          note: note || undefined,
        },
      });

      toast({
        title: "Success",
        description: `Course status updated to ${status}`,
      });

      onOpenChange(false);
      setNote("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update course status",
        variant: "destructive",
      });
    }
  };

  if (!course) return null;

  const statusColors = {
    PUBLISHED: "bg-green-100 text-green-800",
    DRAFT: "bg-yellow-100 text-yellow-800",
    ARCHIVED: "bg-red-100 text-red-800",
    PENDING_REVIEW: "bg-blue-100 text-blue-800",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Edit Course Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Update Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Admin Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a note about this status change..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !status || status === course.status}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
