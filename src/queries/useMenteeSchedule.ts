import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MenteeScheduleCreateType,
  MenteeScheduleUpdateType,
} from "@/schemaValidations/menteeSchedule.schema";
import menteeScheduleApi from "@/apiRequests/menteeSchedule";

// Key cho cache
const SCHEDULES_KEY = ["mentee-schedules"];

export function useSchedules() {
  return useQuery({
    queryKey: SCHEDULES_KEY,
    queryFn: () => menteeScheduleApi.getSchedules(),
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MenteeScheduleCreateType) =>
      menteeScheduleApi.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULES_KEY });
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: MenteeScheduleUpdateType;
    }) => menteeScheduleApi.updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULES_KEY });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => menteeScheduleApi.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULES_KEY });
    },
  });
}
