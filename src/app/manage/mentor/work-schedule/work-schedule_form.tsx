"use client";

import { toast } from "@/components/ui/use-toast";
import {
  MentorScheduleCreateType,
  MentorScheduleUpdateType,
} from "@/schemaValidations/mentorSchedule.schema";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Plus, Save } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "./work-schedule.css";

const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateMentorSchedule,
  useMentorSchedules,
  useUpdateMentorSchedule,
} from "@/queries/useMentorSchedule";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const toInputDate = (iso?: string) => (iso ? iso.slice(0, 10) : "");

export default function MentorWorkScheduleForm() {
  const [open, setOpen] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useMentorSchedules();
  const createSchedule = useCreateMentorSchedule();
  const updateSchedule = useUpdateMentorSchedule();

  const form = useForm<MentorScheduleCreateType>({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = (
    values: MentorScheduleCreateType | MentorScheduleUpdateType
  ) => {
    if (open === "create") {
      createSchedule.mutate(values as MentorScheduleCreateType, {
        onSuccess: () => {
          toast({ title: "Tạo lịch làm việc thành công" });
          form.reset();
          setOpen(null);
        },
        onError: () =>
          toast({
            title: "Lỗi",
            description: "Không thể tạo lịch làm việc.",
            variant: "destructive",
          }),
      });
    } else if (open === "edit" && editingId) {
      updateSchedule.mutate(
        { id: Number(editingId), body: values as MentorScheduleUpdateType },
        {
          onSuccess: () => {
            toast({ title: "Cập nhật thành công" });
            setOpen(null);
            setEditingId(null);
          },
          onError: () =>
            toast({
              title: "Lỗi",
              description: "Không thể cập nhật lịch làm việc.",
              variant: "destructive",
            }),
        }
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "#22c55e";
      case "BOOKED":
        return "#ef4444";
      case "PENDING":
        return "#f59e0b";
      case "ACCEPTED":
        return "#3b82f6";
      case "REJECTED":
        return "#6b7280";
      default:
        return "#22c55e";
    }
  };

  if (isLoading) return <p>Loading schedules...</p>;

  const events =
    data?.payload?.data.map((s) => {
      const date = new Date(s.date).toISOString().slice(0, 10);
      return {
        id: s.id.toString(),
        title: s.title,
        start: `${date}T${s.startTime}`,
        end: `${date}T${s.endTime}`,
        backgroundColor: getStatusColor(s.status),
        borderColor: getStatusColor(s.status),
        textColor: "white",
        extendedProps: { ...s },
      };
    }) ?? [];

  return (
    <div className="container mx-auto p-6 space-y-6  ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-500">
            Work Schedule
          </h1>
          <p className="text-muted-foreground">
            Manage your work schedule offerings
          </p>
        </div>
        <Button
          onClick={() => {
            form.reset();
            setOpen("create");
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Schedule
        </Button>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {open === "create"
                ? "Create Work Schedule"
                : "Edit Work Schedule"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Available for Mentoring"
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe your availability..."
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between pt-4">
                {/* {open === "edit" && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (!editingId) return;
                      if (!confirm("Delete this schedule?")) return;
                      deleteSchedule.mutate(Number(editingId), {
                        onSuccess: () => {
                          toast({ title: "Xóa thành công" });
                          setOpen(null);
                          setEditingId(null);
                        },
                      });
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                )} */}
                <div className="flex gap-2 ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {open === "create" ? (
                      "Save"
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="flex-1 mt-4 ">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          aspectRatio={1.6}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
          eventClick={(info) => {
            const ev = info.event;
            const ext: any = ev.extendedProps || {};
            setEditingId(ev.id);
            form.reset({
              title: ev.title,
              description: ext.description || "",
              date: toInputDate(ext.date),
              startTime: ext.startTime,
              endTime: ext.endTime,
            });
            setOpen("edit");
          }}
          eventContent={(eventInfo) => {
            const status = eventInfo.event.extendedProps.status;
            return (
              <div className="p-1">
                <div className="text-xs font-semibold">
                  {eventInfo.event.title}
                </div>
                <div className="text-xs opacity-90">{status}</div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
