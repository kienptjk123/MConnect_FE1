"use client";

import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import "./my-schedules.css";
import {
  MenteeScheduleCreateType,
  MenteeScheduleUpdateType,
} from "@/schemaValidations/menteeSchedule.schema";

const FullCalendar = dynamic(() => import("@fullcalendar/react"), {
  ssr: false,
});
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateSchedule,
  useDeleteSchedule,
  useSchedules,
  useUpdateSchedule,
} from "@/queries/useMenteeSchedule";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const toInputDate = (iso?: string) => (iso ? iso.slice(0, 10) : "");
const toInputTime = (iso?: string) => (iso ? iso.substring(11, 16) : "");

export default function MenteeSchedulesPage() {
  const [open, setOpen] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data, isLoading } = useSchedules();
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const form = useForm<MenteeScheduleCreateType>({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: "",
      startTime: "",
      endTime: "",
      status: "ACTIVE",
    },
  });

  const onSubmit = (
    values: MenteeScheduleCreateType | MenteeScheduleUpdateType
  ) => {
    if (open === "create") {
      createSchedule.mutate(values as MenteeScheduleCreateType, {
        onSuccess: () => {
          toast({ title: "Tạo lịch thành công" });
          form.reset();
          setOpen(null);
        },
        onError: () =>
          toast({
            title: "Lỗi",
            description: "Không thể tạo lịch.",
            variant: "destructive",
          }),
      });
    } else if (open === "edit" && editingId) {
      updateSchedule.mutate(
        { id: editingId, data: values as MenteeScheduleUpdateType },
        {
          onSuccess: () => {
            toast({ title: "Cập nhật thành công" });
            setOpen(null);
            setEditingId(null);
          },
          onError: () =>
            toast({
              title: "Lỗi",
              description: "Không thể cập nhật lịch.",
              variant: "destructive",
            }),
        }
      );
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
        textColor: "white",
        extendedProps: { ...s },
      };
    }) ?? [];

  return (
    <div className="h-screen flex flex-col max-h-[calc(100vh-62px)] overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-white">
        <h1 className="text-2xl font-bold text-blue-600">Mentee Schedules</h1>
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
              {open === "create" ? "Create Schedule" : "Edit Schedule"}
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
                      <Input {...field} required />
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
                      <Textarea {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <FormLabel>Start</FormLabel>
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
                      <FormLabel>End</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between pt-4">
                {open === "edit" && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (!editingId) return;
                      if (!confirm("Delete this schedule?")) return;
                      deleteSchedule.mutate(editingId, {
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
                )}
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

      <div className="flex-1 mt-4 px-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="95%"
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
            setEditingId(Number(ev.id));
            form.reset({
              title: ev.title,
              description: ext.description || "",
              location: ext.location || "",
              date: toInputDate(ext.date),
              startTime: toInputTime(ext.startTime),
              endTime: toInputTime(ext.endTime),
              status: ext.status || "ACTIVE",
            });
            setOpen("edit");
          }}
        />
      </div>
    </div>
  );
}
