"use client";

import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Plus, X, Save, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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

// Helpers: ISO -> input
const toInputDate = (iso?: string) => (iso ? iso.slice(0, 10) : "");
const toInputTime = (iso?: string) => (iso ? iso.substring(11, 16) : "");

export default function MenteeSchedulesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data, isLoading } = useSchedules();
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  // CREATE form
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

  // EDIT form
  const editForm = useForm<MenteeScheduleUpdateType>({
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

  const events =
    data?.payload?.data.map((s) => ({
      id: s.id.toString(),
      title: s.title,
      start: s.startTime,
      end: s.endTime,
      extendedProps: {
        description: s.description,
        location: s.location,
        status: s.status,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
      },
    })) ?? [];

  const onSubmitCreate = (values: MenteeScheduleCreateType) => {
    createSchedule.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Tạo lịch thành công",
          description: "Lịch học đã được thêm vào calendar.",
        });
        setIsCreateOpen(false);
        form.reset();
      },
      onError: () => {
        toast({
          title: "Lỗi",
          description: "Không thể tạo lịch. Vui lòng thử lại.",
          variant: "destructive",
        });
      },
    });
  };

  const onSubmitEdit = (values: MenteeScheduleUpdateType) => {
    if (!editingId) return;
    updateSchedule.mutate(
      { id: editingId, data: values },
      {
        onSuccess: () => {
          toast({
            title: "Cập nhật thành công",
            description: "Lịch đã được cập nhật.",
          });
          setIsEditOpen(false);
          setEditingId(null);
        },
        onError: () => {
          toast({
            title: "Lỗi",
            description: "Không thể cập nhật lịch. Vui lòng thử lại.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) return <p>Loading schedules...</p>;

  // Modal Layout
  const ModalLayout = ({
    title,
    onClose,
    children,
  }: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
  }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-white/20 transition"
          >
            <X className="text-white" />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 space-y-4">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-600">Mentee Schedules</h1>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Schedule
        </Button>
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitCreate)}
            className="min-w-[1000px]"
          >
            <ModalLayout
              title="Create Schedule"
              onClose={() => setIsCreateOpen(false)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-blue-200 focus:ring-blue-500"
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
                        className="border-blue-200 focus:ring-blue-500"
                      />
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
                      <Input
                        {...field}
                        className="border-blue-200 focus:ring-blue-500"
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
                      <Input
                        type="date"
                        {...field}
                        className="border-blue-200"
                      />
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
                        <Input
                          type="time"
                          {...field}
                          className="border-blue-200"
                        />
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
                        <Input
                          type="time"
                          {...field}
                          className="border-blue-200"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save
                </Button>
              </div>
            </ModalLayout>
          </form>
        </Form>
      )}

      {isEditOpen && (
        <Form {...editForm}>
          <form onSubmit={editForm.handleSubmit(onSubmitEdit)}>
            <ModalLayout
              title="Edit Schedule"
              onClose={() => {
                setIsEditOpen(false);
                setEditingId(null);
              }}
            >
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} className="border-blue-200" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="border-blue-200" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} className="border-blue-200" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="border-blue-200"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={editForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="border-blue-200"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="border-blue-200"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (!editingId) return;
                    if (!confirm("Delete this schedule?")) return;
                    deleteSchedule.mutate(editingId, {
                      onSuccess: () => {
                        toast({
                          title: "Xóa thành công",
                          description: "Lịch đã được xóa khỏi hệ thống.",
                        });
                        setIsEditOpen(false);
                        setEditingId(null);
                      },
                      onError: () => {
                        toast({
                          title: "Lỗi",
                          description: "Không thể xóa lịch.",
                          variant: "destructive",
                        });
                      },
                    });
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditOpen(false);
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Save className="mr-2 h-4 w-4" /> Update
                  </Button>
                </div>
              </div>
            </ModalLayout>
          </form>
        </Form>
      )}

      <div className="flex-1">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="100%"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Hôm nay",
            month: "Tháng",
            week: "Tuần",
            day: "Ngày",
          }}
          dayHeaderClassNames="bg-blue-50 text-blue-600 font-semibold py-3"
          viewClassNames="bg-white"
          dayCellClassNames="border border-slate-200 hover:bg-blue-50 cursor-pointer"
          slotLabelClassNames="text-slate-600 font-medium"
          eventClassNames="rounded-md px-2 py-1 text-xs bg-blue-500 border-blue-600 text-white"
          eventClick={(info) => {
            const ev = info.event;
            const ext: any = ev.extendedProps || {};
            setEditingId(Number(ev.id));
            editForm.reset({
              title: ev.title,
              description: ext.description || "",
              location: ext.location || "",
              date: toInputDate(ext.date),
              startTime: toInputTime(ext.startTime || ev.start?.toISOString()),
              endTime: toInputTime(ext.endTime || ev.end?.toISOString()),
              status: ext.status || "ACTIVE",
            });
            setIsEditOpen(true);
          }}
        />
      </div>
    </div>
  );
}
